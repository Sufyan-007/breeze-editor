from dataclasses import dataclass
from .auth_type import AuthTypeEnum

@dataclass
class AuthContent: 
    key: str
    value: str
    type: str

@dataclass
class Auth:
    type: AuthTypeEnum
    content : list(AuthContent)
    