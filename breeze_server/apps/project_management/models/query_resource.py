from dataclasses import dataclass
from descriptor import ApplyValidation
from validator import required_validator
@dataclass
class ManageResourceBody:
    category : str = ApplyValidation([required_validator])
    resource : str = ApplyValidation([])
    select : list['str'] = ApplyValidation([])
    filter : dict = ApplyValidation([])
    order : str = ApplyValidation([])
    limit : str = ApplyValidation([])
    offset : str = ApplyValidation([])
    count : str = ApplyValidation([])
    libName : str = ApplyValidation([])
    libversion : str = ApplyValidation([])
    module : str = ApplyValidation([])
    files : str = ApplyValidation([])
    
@dataclass
class ManageResourceResponse:
    selected_data:str = ApplyValidation([])