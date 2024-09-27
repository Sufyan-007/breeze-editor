INTERCEPTOR_CODE = """
import axios from 'axios';
const axiosInstance = axios.create({});
{refresh_token_function}
{request_useage}
{response_useage}

export default axiosInstance;
"""



REFRESH_TOKEN_FUNCTION = """
const refreshToken = async () => {
    try {
        const refreshToken = {refresh_token_get_code};
         if (!refreshToken) {
            throw new Error('No refresh token available');
        }
         const response = await {refresh_token_api_call}
         //based on the schema selected for the response
         const { accessToken, newRefreshToken } = response.data;
         {refresh_token_set_code}
         {access_token_set_code}
         return accessToken;
         }
         catch (error) {
        // Handle token refresh errors (e.g., redirect to login)
        console.error('Unable to refresh token', error);
        throw error;
    }
    };
"""

REQUEST_USEAGE ="""
axiosInstance.interceptors.request.use((config) => {
    const accessToken = {access_token_get_code};
    if (accessToken) {
        config.headers.Authorization = {header_token_setter_code};
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
"""

RESPONSE_USEAGE = """
axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to unauthorized access (token expired)
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const newAccessToken = await refreshToken();
            originalRequest.headers.Authorization = {header_token_setter_code};
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            // Handle refresh token errors (e.g., redirect to login)
            console.error('Unable to refresh access token', refreshError);
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});
"""