from dataclasses import dataclass
from ..customized_attr import CustomizedAttr
from ..validators import required_validator
from ..enums.schema_realations import SchemaRelationEnum

@dataclass
class Channel:
    operation_id: str = CustomizedAttr((str),[required_validator])
    description: str = CustomizedAttr((str),[])
    schema_relation : SchemaRelationEnum = CustomizedAttr((SchemaRelationEnum),[required_validator])
    messages : list = CustomizedAttr((list),[required_validator])
    schema : dict = CustomizedAttr((dict),[required_validator])
    
    def as_dict(self):
        
        return {
            'operation_id': self.operation_id,
            'description': self.description,
            'schema_relation': self.schema_relation.name,
            'messages': self.messages,
            'schema' : self.schema
        }
    
