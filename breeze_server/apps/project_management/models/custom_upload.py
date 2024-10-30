from dataclasses import dataclass
from descriptor import ApplyValidation
from validator import required_validator

@dataclass
class AddCustomPackageBody:
    file : str = ApplyValidation([required_validator])
    fileName : str = ApplyValidation([required_validator])
    
@dataclass
class DeleteCustomPackageBody:
    fileName : str = ApplyValidation([required_validator])

@dataclass
class GetCustomPackagesResponse:
    zip_files_info = ApplyValidation([])