from dataclasses import dataclass
from ..customized_attr import CustomizedAttr
from ..validators import required_validator
@dataclass
class Url:
    servers: list =  CustomizedAttr((list),[])
    baseurl: str = CustomizedAttr((str),[required_validator])
    host: list= CustomizedAttr((list),[required_validator])
    protocol : str= CustomizedAttr((str),[])
    port : str= CustomizedAttr((str),[])
    path: list= CustomizedAttr((list),[required_validator])
    url_env : str= CustomizedAttr((str),[])
    # errors = {}
    errors : dict = CustomizedAttr((dict), [])
   
    
        

    def add_error(self, attribute, error_message):
        if attribute not in self.errors:
            self.errors[attribute] = []
        self.errors[attribute].append(error_message)

    def as_dict(self):
        return {
            'servers': self.servers,
            'baseurl': self.baseurl,
            'host': self.host,
            'protocol': self.protocol,
            'port': self.port,
            'path': self.path,
            'url_env' : self.url_env,
            'errors': self.errors if self.errors else None
        }
    