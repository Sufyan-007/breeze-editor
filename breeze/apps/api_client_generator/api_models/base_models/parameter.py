from dataclasses import dataclass
from ..enums.params_in import ParamsInEnum
from ..customized_attr import CustomizedAttr
from ..validators import required_validator
@dataclass
class Parameter:
    param_in : ParamsInEnum= CustomizedAttr((ParamsInEnum),[required_validator])
    name: str= CustomizedAttr((str),[required_validator])
    type: str= CustomizedAttr((str),[required_validator])
    required: bool= CustomizedAttr((bool),[])
    description: str= CustomizedAttr((str),[])

    def as_dict(self):
        
        return {
            'param_in': self.param_in.name,
            'name': self.name,
            'type': self.type,
            'required': self.required,
            'description': self.description
        }
      