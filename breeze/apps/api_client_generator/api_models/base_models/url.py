from dataclasses import dataclass
from ..customized_attr import CustomizedAttr
from ..validators import required_validator
@dataclass
class Url:
    servers: list =  CustomizedAttr((list),[])
    baseurl: str = CustomizedAttr((str),[required_validator])
    host: list= CustomizedAttr((list),[])
    protocol : str= CustomizedAttr((str),[])
    port : str= CustomizedAttr((str),[])
    path: list= CustomizedAttr((list),[required_validator])
    url_env : str= CustomizedAttr((str),[])

    def as_dict(self):
        
        return {
            'servers': self.servers,
            'baseurl': self.baseurl,
            'host': self.host,
            'protocol': self.protocol,
            'port': self.port,
            'path': self.path,
            'url_env' : self.url_env
        }
    