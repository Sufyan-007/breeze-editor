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
    errors : dict = CustomizedAttr((dict), [])
    # errors = {}
    

    def add_error(self, attribute, error_message):
        if attribute not in self.errors:
            self.errors[attribute] = []
        self.errors[attribute].append(error_message)

    def as_dict(self):
        
        return {
            'store_in' : self.store_in.name,
            'access_token_key' : self.access_token_key,
            'refresh_token_key' : self.refresh_token_key,
            'errors': self.errors if self.errors else None
        }
    
    

@dataclass
class AuthApiModel:
    id : str = CustomizedAttr((str),[required_validator])
    operation_id: str = CustomizedAttr((str),[required_validator])
    tags: str = CustomizedAttr((str),[required_validator])
    auth_api_type : AuthApiTypeEnum =CustomizedAttr(AuthApiTypeEnum,[])
    authentication_type : AuthTypeEnum = CustomizedAttr(AuthTypeEnum,[required_validator])
    access_token_request : Request = CustomizedAttr((Request),[])
    refresh_token_request : Request = CustomizedAttr((Request),[])
    access_token_response : list = CustomizedAttr(list,[])
    refresh_token_response : list = CustomizedAttr(list,[])
    summary : str =  CustomizedAttr((str),[])
    # is_authorization_url : bool = CustomizedAttr(bool,[])
    # flow : dict = CustomizedAttr(dict,[])
    # flow_type : str = CustomizedAttr((str),[])
    token_store: TokenStore = CustomizedAttr(TokenStore,[])
    errors: dict = CustomizedAttr(dict,[])
    is_authentication_api: bool = CustomizedAttr(bool,[])

    def add_error(self, attribute, error_message):
        if attribute not in self.errors:
            self.errors[attribute] = []
        self.errors[attribute].append(error_message)

    def as_dict(self):
        
        access_token_responses = []
        refresh_token_responses = []
        for rs in self.access_token_response:
            access_token_responses.append(rs.as_dict() if rs else None) 
        for rs in self.refresh_token_response:
            refresh_token_responses.append(rs.as_dict() if rs else None)
        return {
            'id': self.id,
            'operation_id': self.operation_id,
            'tags' : self.tags,
            'auth_api_type' : self.auth_api_type.name,
            'authentication_type' : self.authentication_type.name,
            'access_token_request': self.access_token_request.as_dict() if self.access_token_request else None,
            'refresh_token_request': self.refresh_token_request.as_dict() if self.refresh_token_request else None,
            'access_token_response': access_token_responses,
            'refresh_token_response': refresh_token_responses,
            'summary' : self.summary,
            # 'is_authorization_url' : self.is_authorization_url,
            # 'flow' : self.flow,
            # 'flow_type': self.flow_type,
            'token_store': self.token_store.as_dict() if self.token_store else None,
            'errors': self.errors if self.errors else None,
            'is_authentication_api': self.is_authentication_api

        }
    
    
        
    
