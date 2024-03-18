from dataclasses import dataclass
from .request import Request
from .response import Response
from typing import List

@dataclass
class ApiModel:
    operation_id: str
    tags: List[str]
    request : Request
    response : List[Response]
    summary : str
    
