from enum import Enum

class ContentEnum(str, Enum):
    JSON = "application/json"
    TEXT = "text/plain"
    HTML = "text/html"
    XML = "application/xml"
    JAVASCRIPT = "application/javascript"
    FORMDATA = "multipart/form-data"
    URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8"
