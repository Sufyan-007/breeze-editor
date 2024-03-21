from enum import Enum

class ModeEnum(str, Enum):
    RAW = "raw"
    NONE = None
    FORMDATA = "form-data"
    FILE = "file"
    BINARY = "binary"
