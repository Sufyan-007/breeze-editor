from dataclasses import dataclass
from descriptor import ApplyValidation
from validator import required_validator
@dataclass
class SetEnvBody:
    environmentName : str = ApplyValidation([required_validator])

@dataclass
class AddEnvConfig:
    envVars : str = ApplyValidation([])
    environments : str = ApplyValidation([])
    
@dataclass
class UpdateEnvConfig:
    envVariableId : str = ApplyValidation([required_validator])
    envVars : str = ApplyValidation([required_validator])
@dataclass
class DeleteEnvConfig:
    envName : str = ApplyValidation([])
    envVariableId : str = ApplyValidation([])
    
    