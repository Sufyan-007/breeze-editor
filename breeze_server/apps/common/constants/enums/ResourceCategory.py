from enum import Enum


class ResourceCategory(Enum):
    COMPONENTS = "components"
    SERVICES = "services"
    THIRD_PARTY = "third_party"
    API_CLIENT = "api_client"
    CUSTOMIZED_PROJ = "external_components_config"
    MODEL = "models"


class ThirdPartyLibraryKeys:
    LIB_NAME = "libname"
    LIB_VERSION = "libversion"
