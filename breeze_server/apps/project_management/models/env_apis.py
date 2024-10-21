from dataclasses import dataclass
from ....descriptor import ApplyValidation

class SetEnvBody:
    environmentName : str = ApplyValidation()
    