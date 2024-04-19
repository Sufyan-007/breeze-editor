from enum import Enum

class ContentEnum(str, Enum):
    JSON = "application/json"
    TEXT = "text/plain"
    HTML = "text/html"
    XML = "application/xml"
    JAVASCRIPT = "application/javascript"
