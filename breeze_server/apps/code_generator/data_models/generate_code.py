from dataclasses import dataclass
from abc import abstractmethod
from ....descriptor import ApplyValidation


@dataclass
class GenerateServiceFileBody:
    fileName = ApplyValidation()
    ModuleId = ApplyValidation()