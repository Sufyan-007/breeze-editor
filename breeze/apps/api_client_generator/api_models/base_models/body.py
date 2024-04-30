from dataclasses import dataclass
from ..enums.mode import ModeEnum
from ..enums.content import ContentEnum
from ..customized_attr import CustomizedAttr
from ..validators import required_validator

@dataclass
class Body:
    content_type : ContentEnum = CustomizedAttr((ContentEnum),[required_validator])
    mode : ModeEnum = CustomizedAttr((ModeEnum),[required_validator])
    required : bool  = CustomizedAttr((bool),[])
    schema_name : str = CustomizedAttr((str),[])
    schema : dict = CustomizedAttr((dict),[])
    raw_content : str = CustomizedAttr((str),[])
    file : str = CustomizedAttr((str),[])
    anonymous : bool = CustomizedAttr((bool),[])

    def as_dict(self):
        
        return {
            'content_type': self.content_type.name,
            'mode': self.mode.name,
            'required': self.required,
            'schema_name' : self.schema_name,
            'schema': self.schema,
            'raw_content' : self.raw_content,
            'file': self.file,
            'anonymous': self.anonymous
        }
