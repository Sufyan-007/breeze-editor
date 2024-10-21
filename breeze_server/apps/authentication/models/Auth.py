from dataclasses import dataclass
from breeze_server.validator import validate_user,validate_email,validate_password,validate_string
from breeze_server.descriptor import ApplyValidation
import pprint
# from ....descriptor import ApplyValidation
# from ....validator import validate_user,validate_email,validate_password

@dataclass   
class LoginBody:
    user:str = ApplyValidation([validate_user])
    password:str = ApplyValidation([validate_password])

@dataclass
class RegisterBody:
    
    user:str = ApplyValidation([validate_string,validate_user])
    email:str = ApplyValidation([validate_email])   #descriptor instance
    password:str = ApplyValidation([validate_password])
    
def main():
    r = RegisterBody('user','abc@gmail.com','Jh$0dfgdff')
    # l = LoginBody('usr','jgdj$Dve5')
    pprint.pprint(r.__dict__)
    # print(l.__dict__)
    # print(r.user,r.email,r.password)
main()