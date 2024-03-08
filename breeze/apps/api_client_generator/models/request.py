from dataclasses import dataclass
from .methods import MethodsEnum
from .key_value import KeyValue
from .url import Url
from .body import Body
from .parameter import Parameter
from .auth import Auth

@dataclass
class Request:
    method: MethodsEnum
    auth : Auth
    headers: list(KeyValue)
    parameters : list(Parameter)
    url: Url
    body : Body