from dataclasses import dataclass
from ..enums.methods import MethodsEnum
from .url import Url
from .parameter import Parameter
from typing import List
from ..customized_attr import CustomizedAttr
from ..validators import required_validator

@dataclass
class Request:
    method: MethodsEnum = CustomizedAttr((MethodsEnum),[required_validator])
    auth : list = CustomizedAttr((list),[])
    headers: list= CustomizedAttr((list),[])
    parameters: List[Parameter]= CustomizedAttr((list),[])
    url: Url= CustomizedAttr((Url),[required_validator])
    body : list= CustomizedAttr((list),[])

    def as_dict(self):
        params = []
        for pr in self.parameters:
            params.append(pr.as_dict()) 
        headers = []
        for hr in self.headers:
            headers.append(hr.as_dict()) 
        body = []
        for bd in self.body:
            body.append(bd.as_dict() if bd else None) 
        
        auths = []
        for au in self.auth:
            auths.append(au.as_dict() if au else None) 
        
        return {
            'method': self.method.name,
            'auth': auths,
            'headers': headers,
            'parameters': params,
            'url': self.url.as_dict() if self.url else None,
            'body': body
        }