from dataclasses import dataclass

@dataclass
class Formdata:
    key: str
    value: str
    description : str
    type : str
    src : str