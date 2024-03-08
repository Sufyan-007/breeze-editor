from dataclasses import dataclass

@dataclass
class Url:
    baseurl: str
    host: str
    protocol : str
    port : int
    path : list(str)