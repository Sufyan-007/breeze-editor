from dataclasses import dataclass
from ..enums.status import StatusEnum
from ..enums.content import ContentEnum
from ..customized_attr import CustomizedAttr
from ..validators import required_validator
@dataclass
class Response:
    status: StatusEnum = CustomizedAttr((StatusEnum),[required_validator])
    content_type: ContentEnum = CustomizedAttr((ContentEnum),[])
    schema_name: str = CustomizedAttr((str),[])
    raw_content: str = CustomizedAttr((str),[])
    file: str = CustomizedAttr((str),[])
    description: str = CustomizedAttr((str),[])
    schema: dict = CustomizedAttr((dict),[])
    # errors  = {}
    token_store: dict = CustomizedAttr((dict),[])
    errors : dict = CustomizedAttr((dict), [])


    def add_error(self, attribute, error_message):
        if attribute not in self.errors:
            self.errors[attribute] = []
        self.errors[attribute].append(error_message)

    def as_dict(self):
        return {
            'content_type': self.content_type.name,
            'status': self.status.name,
            'schema_name': self.schema_name,
            'schema': self.schema,
            'raw_content': self.raw_content,
            'file': self.file,
            'description': self.description,
            'token_store': self.token_store,
            'errors': self.errors if self.errors else None
        }