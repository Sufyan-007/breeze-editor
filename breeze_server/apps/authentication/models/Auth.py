from dataclasses import dataclass
from validator import validate_user,validate_email,validate_password,validate_string,required_validator
from descriptor import ApplyValidation
import pprint
# from ....descriptor import ApplyValidation
# from ....validator import validate_user,validate_email,validate_password,required_validator,validate_string

@dataclass   
class LoginBody:
    username:str = ApplyValidation([required_validator])
    password:str = ApplyValidation([required_validator])

@dataclass
class RegisterBody:
    
    username:str = ApplyValidation([required_validator])
    email:str = ApplyValidation([required_validator])   #descriptor instance
    password:str = ApplyValidation([required_validator])

@dataclass
class LoginResponse:
    accessToken:str = ApplyValidation([])
    username:str = ApplyValidation([])

@dataclass
class RegisterResponse:
    accessToken:str = ApplyValidation([])