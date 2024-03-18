from dataclasses import dataclass
from ..enums.auth_type import AuthTypeEnum
from typing import List
@dataclass
class AuthContent: 
    key: str
    value: str
    type: str

@dataclass
class Auth:
    type: AuthTypeEnum
    content: List[AuthContent]
    login_api: str
    token_api : str
    