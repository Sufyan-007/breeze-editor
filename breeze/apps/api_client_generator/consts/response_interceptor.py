RESPONSE_INTERCEPTOR = """
    // Add a response interceptor
    api.interceptors.response.use((response) => { 
        // block to handle success case
        return response
    }, function (error) { 
        // block to handle error case
        const originalRequest = error.config;
        {REFRESH_TOKEN_CONDITION}
        {RESPONSE_STATUS_CONDITION}
    return Promise.reject(error);
});

"""
