REFRESH_TOKEN_API = """
    if (error.response.status === 401 && originalRequest.url === '{REFRESH_TOKEN_URL}') { 
            // Added this condition to avoid infinite loop 
            // Redirect to any unauthorised route to avoid infinite loop...
            return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) { 
        // Code inside this block will refresh the auth token
        originalRequest._retry = true;
        {GET_REFRESHED_TOKEN_CODE}
    }
"""
