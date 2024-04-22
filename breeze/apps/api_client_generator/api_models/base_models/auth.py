from dataclasses import dataclass
from ..enums.auth_type import AuthTypeEnum
from ..customized_attr import CustomizedAttr
from ..validators import required_validator
@dataclass
class AuthContent: 
    key: str = CustomizedAttr((str),[required_validator])
    value: str = CustomizedAttr((str),[])
    type: str = CustomizedAttr((str),[required_validator])
    
    def as_dict(self):
        
        return {
            'key': self.key,
            'value': self.value,
            'type': self.type
        }
    

@dataclass
class Auth:
    type: AuthTypeEnum = CustomizedAttr((AuthTypeEnum),[required_validator])
    content: list= CustomizedAttr((list),[required_validator])
    login_api: str= CustomizedAttr((str),[])
    token_api : str= CustomizedAttr((str),[])

    def as_dict(self):
        contents = []
        for c in self.content:
            contents.append(c.as_dict() if c else None)
        
        return {
            'type': self.type.name,
            'contents': contents,
            'login_api': self.login_api,
            'token_api': self.token_api
        }
    
    