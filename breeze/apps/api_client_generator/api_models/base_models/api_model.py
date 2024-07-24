from dataclasses import dataclass
from .request import Request
from ..customized_attr import CustomizedAttr
from ..validators import required_validator

@dataclass
class ApiModel:
    type : str = CustomizedAttr((str),[])
    isAsync : bool = CustomizedAttr((bool),[])
    parameters: list = CustomizedAttr((list),[])
    id : str = CustomizedAttr((str),[required_validator])
    operation_id: str = CustomizedAttr((str),[required_validator])
    tags: str = CustomizedAttr((str),[required_validator])
    request : Request = CustomizedAttr((Request),[required_validator])
    response : list = CustomizedAttr(list,[required_validator])
    summary : str =  CustomizedAttr((str),[])
    is_authentication_api: bool = CustomizedAttr((bool),[])
    errors : dict = CustomizedAttr((dict), [])

   

    def add_error(self, attribute, error_message):
        if attribute not in self.errors:
            self.errors[attribute] = []
        self.errors[attribute].append(error_message)

    def as_dict(self):
        responses = []
        for rs in self.response:
            responses.append(rs.as_dict() if rs else None) 
        
            
        return {
            'type': self.type,
            'isAsync': self.isAsync,
            'parameters': self.parameters if self.parameters else None, 
            'id': self.id,
            'operation_id': self.operation_id,
            'tags' : self.tags,
            'request': self.request.as_dict() if self.request else None,
            'response': responses,
            'summary' : self.summary,
            'is_authentication_api' : self.is_authentication_api,
            'errors': self.errors 
        }
    
