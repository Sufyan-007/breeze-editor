from dataclasses import dataclass
from descriptor import ApplyValidation
from validator import required_validator


@dataclass
class GenerateServiceFileBody:
    fileName:str = ApplyValidation([required_validator])
    moduleId:str = ApplyValidation([required_validator])