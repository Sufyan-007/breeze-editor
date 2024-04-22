REQUEST_INTERCEPTOR = """
    // Add a request interceptor
    api.interceptors.request.use(
    (config) => {
        const token = {FETCH_TOKEN};
        if (token) {
            {AUTH_CODE}
        }
        return config;
    },
    (error) => Promise.reject(error)
    );    
"""

