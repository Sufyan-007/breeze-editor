from dataclasses import dataclass
from ....descriptor import ApplyValidation

@dataclass
class AddCustomPackageBody:
    file : str = ApplyValidation()
    fileName : str = ApplyValidation()
    
@dataclass
class DeleteCustomPackageBody:
    fileName : str = ApplyValidation()