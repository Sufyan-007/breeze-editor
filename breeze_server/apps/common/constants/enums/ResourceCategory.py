from enum import Enum


class ResourceCategory(Enum):
    COMPONENTS = "components"
    SERVICES = "services"
    CODE_FILE = "file_config"
    THIRD_PARTY = "third_party"
    API_CLIENT = "api_client"
    CUSTOMIZED_PROJ = "external_components_config"
    MODEL = "models"
    ROUTING = "routing"
    RESOURCE = "resource_config"
    DIRECTORY_MANAGEMENT = "directory_management"

class ThirdPartyLibraryKeys:
    LIB_NAME = "libname"
    LIB_VERSION = "libversion"
