from dataclasses import dataclass
from ..enums.status import StatusEnum
from ..enums.content import ContentEnum

@dataclass
class Response:
    status: StatusEnum
    content_type : ContentEnum
    schema_name : str
    raw_content : str
    file : str
    