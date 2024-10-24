from enum import Enum


class ResourceCategory(Enum):
    COMPONENTS = "components"
    SERVICES = "services"
    THIRD_PARTY = "third_party"
    API_CLIENT = "api_client"
    CUSTOMIZED_PROJ = "customized_proj_config"
    MODEL = "models"
    ROUTING = "routing"

class ThirdPartyLibraryKeys:
    LIB_NAME = "libname"
    LIB_VERSION = "libversion"
