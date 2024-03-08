from dataclasses import dataclass
from .request import Request
from .response import Response


@dataclass
class ApiModel:
    operation_id: str
    tags: list(str)
    request : Request
    response : Response
    summary : str
    
