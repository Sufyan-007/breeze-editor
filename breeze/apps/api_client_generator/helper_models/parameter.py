from dataclasses import dataclass
from .methods import MethodsEnum
from .key_value import KeyValue
from .url import Url
from .body import Body

@dataclass
class Parameter:
    param_in : str
    name: str
    type: str
    required: bool
    description: str
      