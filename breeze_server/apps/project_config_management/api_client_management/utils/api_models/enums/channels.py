from enum import Enum

class ChannelsEnum(str, Enum):
    SUBSCRIBE = "subscribe"
    PUBLISH = "publish"
    