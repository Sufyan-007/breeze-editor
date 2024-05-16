from enum import Enum

class AuthTypeEnum(str, Enum):
    NOAUTH = "No Auth"
    BASIC = "Basic"
    OAUTH = "Oauth"
    OAUTH2 = "Oauth2"
    BEARER = "Bearer"
    APIKEY = "ApiKey"
    