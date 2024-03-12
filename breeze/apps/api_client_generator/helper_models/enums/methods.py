from enum import Enum

class MethodsEnum(str, Enum):
    GET = "get"
    POST = "post"
    PUT = "put"
    DELETE = "delete"
