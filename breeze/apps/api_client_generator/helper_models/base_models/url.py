from dataclasses import dataclass
from typing import List

@dataclass
class Url:
    baseurl: str
    host: str
    protocol : str
    port : int
    path: List[str]
    url_env : str
    