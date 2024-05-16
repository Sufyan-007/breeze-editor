from enum import Enum

class SchemaRelationEnum(str, Enum):
    ONEOF = "oneOf"
    ALLOFF = "allOf"
    