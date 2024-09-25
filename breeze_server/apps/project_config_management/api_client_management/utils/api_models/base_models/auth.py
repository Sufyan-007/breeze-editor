from dataclasses import dataclass
from ..enums.auth_type import AuthTypeEnum
from ..customized_attr import CustomizedAttr
from ..validators import required_validator
@dataclass
class AuthContent: 
    key: str = CustomizedAttr((str),[required_validator])
    value: str = CustomizedAttr((str),[])
    type: str = CustomizedAttr((str),[required_validator])
    errors : dict = CustomizedAttr((dict), [])
    
   

    def add_error(self, attribute, error_message):
        if attribute not in self.errors:
            self.errors[attribute] = []
        self.errors[attribute].append(error_message)
    
    def as_dict(self):
        
        return {
            'key': self.key,
            'value': self.value,
            'type': self.type,
            'errors': self.errors if self.errors else None
        }
    

@dataclass
class Auth:
    type: AuthTypeEnum = CustomizedAttr((AuthTypeEnum),[required_validator])
    content: list= CustomizedAttr((list),[])
    login_api: str= CustomizedAttr((str),[])
    token_id : str= CustomizedAttr((str),[])
    # auth_api : str= CustomizedAttr((str),[])
    # username : str= CustomizedAttr((str),[])
    # password : str= CustomizedAttr((str),[])
    # errors  = {}
    errors : dict = CustomizedAttr((dict), [])

    def add_error(self, attribute, error_message):
        if attribute not in self.errors:
            self.errors[attribute] = []
        self.errors[attribute].append(error_message)

    def as_dict(self):
        contents = []
        for c in self.content:
            contents.append(c.as_dict() if c else None)
        
        return {
            'type': self.type.name,
            'contents': contents,
            'login_api': self.login_api,
            'token_id': self.token_id,
            'errors': self.errors if self.errors else None
        }
    
    