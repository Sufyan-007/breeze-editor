from dataclasses import dataclass
from .mode import ModeEnum
from .content import ContentEnum
from .formdata import Formdata

@dataclass
class Body:
    mode: ModeEnum
    content_type : ContentEnum
    required : bool
    schema_name : str
    raw_content : str
    file : str
    formdata : list(Formdata)