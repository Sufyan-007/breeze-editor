from dataclasses import dataclass
from ..enums.methods import MethodsEnum
from .key_value import KeyValue
from .url import Url
from .body import Body
from .parameter import Parameter
from .auth import Auth
from typing import List

@dataclass
class Request:
    method: MethodsEnum
    auth : Auth
    headers: List[KeyValue]
    parameters: List[Parameter]
    url: Url
    body : Body