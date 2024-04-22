def get_content_type_and_mode(content_type_str):
        mode = "RAW"
        content_type = "JSON"
        if content_type_str == "application/json":
            mode = 'RAW'
            content_type = 'JSON'
        elif content_type_str == "application/xml":
            mode = 'RAW'
            content_type = 'XML'
        elif content_type_str == "text/plain":
            mode = 'RAW'
            content_type = 'TEXT'
        elif content_type_str == "text/html":
            mode = 'RAW'
            content_type = 'HTML'
        elif content_type_str == "application/javascript":
            mode = 'RAW'
            content_type = 'JAVASCRIPT'
        elif content_type_str == "application/x-www-form-urlencoded":
            mode = 'URLENCODED'
            content_type = 'URLENCODED'
        
        elif content_type_str == 'multipart/form-data':
            mode = 'FORMDATA'
            content_type = 'FORMDATA'
            
        elif content_type_str == "application/octet-stream":
            mode = 'BINARY'
            content_type = "NONE"
        
        return content_type,mode
    