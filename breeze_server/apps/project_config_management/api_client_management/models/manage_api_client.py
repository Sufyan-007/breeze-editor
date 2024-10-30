from dataclasses import dataclass
from abc import abstractmethod
from descriptor import ApplyValidation
from validator import required_validator



@dataclass
class ModifyFunctionConfigBody:
    fileName : str = ApplyValidation([required_validator])
    moduleId : str = ApplyValidation([required_validator])
    apiType : str = ApplyValidation([required_validator])
    apiData : str = ApplyValidation([required_validator])

@dataclass
class TransferToAuthBody:
    moduleId : str = ApplyValidation([required_validator])
    id : str = ApplyValidation([required_validator])
    fileName : str = ApplyValidation([required_validator])
    
@dataclass
class EditModuleTitleBody:
    moduleId : str = ApplyValidation([required_validator])
    title : str = ApplyValidation([required_validator])

@dataclass
class AddModuleBody:
    name:str = ApplyValidation([required_validator])
    description:str = ApplyValidation([required_validator])
    
@dataclass
class EditModuleTitleResponse:
    result:str = ApplyValidation([])
    
@dataclass
class GetResponseTokenResponse:
    result:str = ApplyValidation([])