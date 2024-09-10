from dataclasses import dataclass
from ..enums.params_in import ParamsInEnum
from ..customized_attr import CustomizedAttr
from ..validators import required_validator
@dataclass
class Parameter:
    param_in : ParamsInEnum= CustomizedAttr((ParamsInEnum),[required_validator])
    name: str= CustomizedAttr((str),[required_validator])
    type: str= CustomizedAttr((str),[required_validator])
    value: str = CustomizedAttr((str),[])
    param_type: str= CustomizedAttr((str),[])
    storage_key:str= CustomizedAttr((str),[])
    required: bool= CustomizedAttr((bool),[])
    description: str= CustomizedAttr((str),[])
    # errors = {}
    errors : dict = CustomizedAttr((dict), [])


    def add_error(self, attribute, error_message):
        if attribute not in self.errors:
            self.errors[attribute] = []
        self.errors[attribute].append(error_message)
        

    def as_dict(self):
        
        return {
            'param_in': self.param_in.name,
            'name': self.name,
            'type': self.type,
            'param_type': self.param_type,
            'value': self.value,
            'storage_key': self.storage_key,
            'required': self.required,
            'description': self.description,
            'errors': self.errors if self.errors else None
        }
      