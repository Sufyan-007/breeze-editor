from dataclasses import dataclass
from ....descriptor import ApplyValidation
@dataclass
class ManageResourceBody:
    category : str = ApplyValidation()
    resource : str = ApplyValidation()
    select : list['str'] = ApplyValidation()
    filter : dict = ApplyValidation()
    order : str = ApplyValidation()
    limit : str = ApplyValidation()
    offset : str = ApplyValidation()
    count : str = ApplyValidation()
    libName : str = ApplyValidation()
    libversion : str = ApplyValidation()
    module : str = ApplyValidation()
    files : str = ApplyValidation()
    