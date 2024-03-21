from dataclasses import dataclass
from ..enums.mode import ModeEnum
from ..enums.content import ContentEnum
from .formdata import Formdata
from typing import List
@dataclass
class Body:
    mode: ModeEnum
    content_type : ContentEnum
    required : bool
    schema_name : str
    raw_content : str
    file : str
    formdata: List[Formdata]