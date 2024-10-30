from dataclasses import dataclass
from descriptor import ApplyValidation
from validator import required_validator

@dataclass
class GetConfigByIndexBody:
    type:str = ApplyValidation([])
    index:str = ApplyValidation([])
    compoId:str = ApplyValidation([])

@dataclass
class GetConfigByIndexResponse:
    code:str = ApplyValidation([])