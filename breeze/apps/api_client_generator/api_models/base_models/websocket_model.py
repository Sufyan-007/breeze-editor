from dataclasses import dataclass
from ..customized_attr import CustomizedAttr
from ..validators import required_validator
from ..enums.channels import ChannelsEnum
from .url import Url
from .channel import Channel

@dataclass
class WebsocketModel:
    id : str = CustomizedAttr((str),[required_validator])
    url : Url = CustomizedAttr((Url),[])
    tags: str = CustomizedAttr((str),[])
    publish : Channel = CustomizedAttr((Channel),[required_validator])
    subscribe : Channel = CustomizedAttr((Channel),[required_validator])
    
    def as_dict(self):
        return {
            'id': self.id,
            'tags' : self.tags,
            'url': self.url.as_dict() if self.url else None,
            'publish': self.publish.as_dict() if self.publish else None,
            'subscribe': self.subscribe.as_dict() if self.subscribe else None
        }
    
