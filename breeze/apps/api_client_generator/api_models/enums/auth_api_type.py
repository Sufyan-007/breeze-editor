from enum import Enum

class AuthApiTypeEnum(str, Enum):
    NONE="null"
    LOGIN = "Login"
    REFRESH = "Refresh"
    LOGOUT = "Logout"
    