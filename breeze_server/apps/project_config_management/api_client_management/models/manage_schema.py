from dataclasses import dataclass
from descriptor import ApplyValidation
from validator import required_validator

@dataclass
class AddOrEditSchemaBody:
    schemaId:str = ApplyValidation([required_validator])
    moduleId:str = ApplyValidation([required_validator])
    schemaDetails:str = ApplyValidation([required_validator])
@dataclass    
class DeleteSchemaBody:
    schemaId:str = ApplyValidation([required_validator])
    moduleId:str = ApplyValidation([required_validator])