from dataclasses import dataclass
from .request import Request
from .response import Response
from typing import List

@dataclass
class AuthApiModel:
    id:str
    operation_id: str
    tags: List[str]
    request : Request
    response : List[Response]
    summary : str
    auth_api_type : str
    authentication_type : str
    is_authorization_url : bool
    flow : dict
    token_store: dict
        
    
