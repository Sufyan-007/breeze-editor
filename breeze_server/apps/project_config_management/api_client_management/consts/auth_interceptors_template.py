AUTH_INTERCEPTOR = """
export const {INTERCEPTOR_NAME} = (request) => {
        const token = {FETCH_TOKEN};
        if (token) {
            {AUTH_CODE}
        }
        return request;
}    
"""