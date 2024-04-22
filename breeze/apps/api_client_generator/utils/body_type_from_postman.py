
def get_raw_content_type(content):
    content_type = "JSON"
    if content == "html":
        content_type = "HTML"
    elif content == "xml":
        content_type = "XML"
    elif content == "json":
        content_type = "JSON"
    elif content == "javascript":
        content_type = "JAVASCRIPT"
    elif content == "text":
        content_type = "TEXT"
    return content_type

def get_body_type(body_data):
    content_type = "JSON"
    mode = body_data.get("mode","").strip().upper()
    if mode == "RAW":
        content_type = body_data.get("options",{}).get("raw",{}).get("language")
        content_type = get_raw_content_type(content_type)
    elif mode == "URLENCODED":
        content_type = 'URLENCODED'
    elif mode == "FORMDATA":
        content_type = 'FORMDATA'
    elif mode == "BINARY":
        content_type = "NONE"
        
    
    return content_type
