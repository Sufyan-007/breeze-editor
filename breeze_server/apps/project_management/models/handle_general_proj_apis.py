from dataclasses import dataclass
from ....descriptor import ApplyValidation

@dataclass
class AddSchemaBody:
    name : str = ApplyValidation()
    description : str = ApplyValidation()
    author : str = ApplyValidation()
    framework : str = ApplyValidation()
    language : str = ApplyValidation()
    styling : str = ApplyValidation()
    buildTool : str = ApplyValidation()
    logo : str = ApplyValidation()
    projectPath : str = ApplyValidation()