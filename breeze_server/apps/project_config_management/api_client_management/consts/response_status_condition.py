RESPONSE_STATUS_CONDITION = """
    if (error.response.status == %s) { 
        return Promise.reject('%s');
    }
 
"""
