from dataclasses import dataclass
from .request import Request
from .response import Response
from typing import List
from ..enums.auth_api_type import AuthApiTypeEnum
from ..enums.auth_type import AuthTypeEnum
from ..enums.token_store_type import TokenStoreTypeEnum


@dataclass
class TokenStore:
    store_in : TokenStoreTypeEnum
    access_token_key : str
    refresh_token_key : str
    

@dataclass
class AuthApiModel:
    id:str
    operation_id: str
    tags: List[str]
    request : Request
    response : List[Response]
    summary : str
    auth_api_type : AuthApiTypeEnum
    authentication_type : AuthTypeEnum
    is_authorization_url : bool
    flow : dict
    token_store: TokenStore
        
    
