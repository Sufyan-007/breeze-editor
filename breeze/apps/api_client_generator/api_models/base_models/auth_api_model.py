from dataclasses import dataclass
from .request import Request
from ..enums.auth_api_type import AuthApiTypeEnum
from ..enums.auth_type import AuthTypeEnum
from ..enums.token_store_type import TokenStoreTypeEnum
from ..validators import required_validator
from ..customized_attr import CustomizedAttr

@dataclass
class TokenStore:
    store_in : TokenStoreTypeEnum =  CustomizedAttr((TokenStoreTypeEnum),[required_validator])
    access_token_key : str= CustomizedAttr((str),[])
    refresh_token_key : str= CustomizedAttr((str),[])

    def as_dict(self):
        
        return {
            'store_in' : self.store_in.name,
            'access_token_key' : self.access_token_key,
            'refresh_token_key' : self.refresh_token_key

        }
    
    

@dataclass
class AuthApiModel:
    id : str = CustomizedAttr((str),[required_validator])
    operation_id: str = CustomizedAttr((str),[required_validator])
    tags: str = CustomizedAttr((str),[required_validator])
    auth_api_type : AuthApiTypeEnum =CustomizedAttr(AuthApiTypeEnum,[])
    authentication_type : AuthTypeEnum = CustomizedAttr(AuthTypeEnum,[required_validator])
    request : Request = CustomizedAttr((Request),[])
    response : list = CustomizedAttr(list,[])
    summary : str =  CustomizedAttr((str),[])
    is_authorization_url : bool = CustomizedAttr(bool,[])
    flow : dict = CustomizedAttr(dict,[])
    flow_type : str = CustomizedAttr((str),[])
    token_store: TokenStore = CustomizedAttr(TokenStore,[])

    def as_dict(self):
        
        responses = []
        for rs in self.response:
            responses.append(rs.as_dict() if rs else None) 
        
        return {
            'id': self.id,
            'operation_id': self.operation_id,
            'tags' : self.tags,
            'auth_api_type' : self.auth_api_type.name,
            'authentication_type' : self.authentication_type.name,
            'request': self.request.as_dict() if self.request else None,
            'response': responses,
            'summary' : self.summary,
            'is_authorization_url' : self.is_authorization_url,
            'flow' : self.flow,
            'flow_type': self.flow_type,
            'token_store': self.token_store.as_dict() if self.token_store else None

        }
    
    
        
    
