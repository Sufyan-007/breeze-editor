from enum import Enum

class ContentEnum(str, Enum):
    NONE = None
    JSON = "application/json"
    TEXT = "text/plain"
    HTML = "text/html"
    XML = "application/xml"
    JAVASCRIPT = "application/javascript"
    FORMDATA = "multipart/form-data"
    URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8"
    OCTET_STREAM = "application/octet-stream"
    PDF = "application/pdf"
    ZIP = "application/zip"
    PNG = "image/png"
    JPEG = "image/jpeg"
    MP4 = "video/mp4"
    AUDIO = "audio/mpeg"
    CSV = "text/csv"
