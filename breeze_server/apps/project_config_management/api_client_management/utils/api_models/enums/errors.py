from enum import Enum

class ErrorsEnum(str, Enum):
    REQUIRED_KEY = "required_key"
    TYPE_MISMATCH = "type_mismatch"
