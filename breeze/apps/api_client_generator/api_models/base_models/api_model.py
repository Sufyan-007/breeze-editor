from dataclasses import dataclass
from .request import Request
from ..customized_attr import CustomizedAttr
from ..validators import required_validator

@dataclass
class ApiModel:
    id : str = CustomizedAttr((str),[required_validator])
    operation_id: str = CustomizedAttr((str),[required_validator])
    tags: str = CustomizedAttr((str),[required_validator])
    request : Request = CustomizedAttr((Request),[required_validator])
    response : list = CustomizedAttr(list,[required_validator])
    summary : str =  CustomizedAttr((str),[])
    is_authentication_api: bool = CustomizedAttr((bool),[])

    def as_dict(self):
        responses = []
        for rs in self.response:
            responses.append(rs.as_dict() if rs else None) 
        
        return {
            'id': self.id,
            'operation_id': self.operation_id,
            'tags' : self.tags,
            'request': self.request.as_dict() if self.request else None,
            'response': responses,
            'summary' : self.summary,
            'is_authentication_api' : self.is_authentication_api
        }
    
