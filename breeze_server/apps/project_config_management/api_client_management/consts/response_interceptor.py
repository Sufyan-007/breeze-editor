RESPONSE_INTERCEPTOR = """
    // Add a response interceptor
    localInstance.interceptors.response.use((response) => { 
        return response
    }, function (error) { 
        {REFRESH_TOKEN_CONDITION}
        {RESPONSE_STATUS_CONDITION}
    return Promise.reject(error);
});

"""
