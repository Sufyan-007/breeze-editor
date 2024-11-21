from dataclasses import dataclass
from abc import abstractmethod
from .....descriptor import ApplyValidation


class AddOrEditSwaggerBody:
    schemaId = ApplyValidation()
    moduleId = ApplyValidation()