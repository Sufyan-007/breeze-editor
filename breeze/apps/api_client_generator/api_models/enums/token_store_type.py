from enum import Enum

class TokenStoreTypeEnum(str, Enum):
    NONE="null"
    SESSION= "Session"
    LOCAL_STORAGE = "Local Storage"
    COOKIES = "Cookies"
    