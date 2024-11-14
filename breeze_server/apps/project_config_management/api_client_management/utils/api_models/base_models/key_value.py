from dataclasses import dataclass
from ..customized_attr import CustomizedAttr
from ..validators import required_validator
@dataclass
class KeyValue:
    key: str = CustomizedAttr((str),[required_validator])
    value: str = CustomizedAttr((str),[required_validator])
    # errors = {}
    type: str = CustomizedAttr((str),[])
    storage_key: str = CustomizedAttr((str))
    data_type:str = CustomizedAttr((str))
    errors : dict = CustomizedAttr((dict), [])
    


    def add_error(self, attribute, error_message):
        if attribute not in self.errors:
            self.errors[attribute] = []
        self.errors[attribute].append(error_message)

    def as_dict(self):
        
        return {
            'key': self.key,
            'value': self.value,
            'type': self.type if self.type else None, 
            'storage_key': self.storage_key,
            'data_type': self.data_type,
            'errors': self.errors if self.errors else None
        }