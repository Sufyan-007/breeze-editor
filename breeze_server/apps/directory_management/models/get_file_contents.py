from dataclasses import dataclass
from validator import required_validator
from descriptor import ApplyValidation

@dataclass
class GetFileContentResponse:
    
    code:str = ApplyValidation([])