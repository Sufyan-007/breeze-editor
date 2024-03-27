from enum import Enum

class ParamsInEnum(str, Enum):
    QUERY = "query"
    PATH = "path"
    