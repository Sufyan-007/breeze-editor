from dataclasses import dataclass
from ..enums.params_in import ParamsInEnum
@dataclass
class Parameter:
    param_in : ParamsInEnum
    name: str
    type: str
    required: bool
    description: str
      