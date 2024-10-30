from dataclasses import dataclass
from descriptor import ApplyValidation
from validator import required_validator,validate_project_unique_name,validate_logo_file_size

@dataclass
class AddSchemaBody:
    name : str = ApplyValidation([required_validator,validate_project_unique_name])
    author : str = ApplyValidation([required_validator])
    technology : str = ApplyValidation([required_validator])
    language : str = ApplyValidation([required_validator])
    styling : str = ApplyValidation([required_validator])
    buildTool : str = ApplyValidation([required_validator])
    logoFile:str = ApplyValidation([validate_logo_file_size])
    
@dataclass
class GetProjMetaDataResponse:
    app_config:str  = ApplyValidation([])
    
@dataclass
class AddResponse:
    name:str = ApplyValidation([])