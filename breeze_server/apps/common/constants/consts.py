GLOBAL_RESOURCES_PATH = "user_uploads"

DEFAULT_THIRD_PARTY_CONFIG_FOLDER_NAME = "third_party_configs"

# TODO: need to finalize declaration of all config const here or in RespourceCategory.py
CONFIG_FILES_PATH = {
    'APP_CONFIG' : 'app_basic_config',
    'ROUTING_CONFIG' : 'routing_config',
    'CSS_CONFIG' : 'css_config',
    'DIRECTORY_MANAGEMENT':'directory_management',
    'SWAGGER_CONFIG' : 'swagger_metadata',
    'RESOURCE_CONFIG' : 'uploaded_resources_config',
    'ENVIRONMENT_SETTINGS' : 'environment_settings',
}

MULTI_NODE_MULTI_FILE = ['components', 'services', 'api_client', 'file_config']
MULTI_NODE_SINGLE_FILE = ['routing', 'resource_config', 'directory_management']

JSX_TEMPLATE_PATH = "project_templates/jsx_template"
TSX_TEMPLATE_PATH = "project_templates/tsx_template"
JSX_DIRECTORY_CONFIG = "project_templates/jsx_directory.json"
TSX_DIRECTORY_CONFIG = "project_templates/tsx_directory.json"

NEW_LINE_CHAR = "\n"

THIRD_PARTY_CONFIG_PATH = "third_party_configs"

CONFIG_PATH = "configurations"
EXTERNAL_COMPONENTS = "external_components"
EXTERNAL_COMPONENTS_CONFIG = "external_components_config"

PORT = 4000
# should be used after confirming the genration path status
PROJECT_GENERATION_PATH = "generated_projects"

CUSTOM_UPLOADS = "custom_uploads"
CLIENT_API = "api_client_intermediate_json"
MODEL = "models"
INDEX = "index"
ROUTING = "routing_config"
COMPONENT = "components"
CODE_FILE = "file_config"
RESOURCE = "uploaded_resources_config"

APP_CONFIG_PATH = "configurations"
