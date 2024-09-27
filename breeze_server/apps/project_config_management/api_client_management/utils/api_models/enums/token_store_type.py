from enum import Enum

class TokenStoreTypeEnum(str, Enum):
    NONE="null"
    SESSION= "SESSION"
    LOCAL_STORAGE = "LOCAL_STORAGE"
    COOKIES = "COOKIES"
    