from dataclasses import dataclass
from descriptor import ApplyValidation
from validator import required_validator
@dataclass
class GetDirectoryJsonResponse:
    node:str = ApplyValidation([])
    children:list = ApplyValidation([])