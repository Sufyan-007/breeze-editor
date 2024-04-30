from dataclasses import dataclass
from ..customized_attr import CustomizedAttr
from ..validators import required_validator
@dataclass
class KeyValue:
    key: str = CustomizedAttr((str),[required_validator])
    value: str = CustomizedAttr((str),[required_validator])

    def as_dict(self):
        
        return {
            'key': self.key,
            'value': self.value
        }