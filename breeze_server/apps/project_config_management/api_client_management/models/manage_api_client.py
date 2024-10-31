from dataclasses import dataclass
from abc import abstractmethod
from .....descriptor import ApplyValidation



@dataclass
class ModifyFunctionConfigBody:
    fileName : str = ApplyValidation()
    moduleId : str = ApplyValidation()
    apiType : str = ApplyValidation()
    apiData : str = ApplyValidation()

@dataclass
class TransferToAuthBody:
    moduleId : str = ApplyValidation()
    Id : str = ApplyValidation()
    fileName : str = ApplyValidation()
    
@dataclass
class EditModuleTitleBody:
    moduleId : str = ApplyValidation()
    title : str = ApplyValidation()
    