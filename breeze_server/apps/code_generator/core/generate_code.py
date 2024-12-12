from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file, read_json_file
from apps.common.utils.file_helpers.config_handler import read_config_file
from apps.common.constants.enums.ResourceCategory import ResourceCategory
from apps.directory_management.core.directory_management_service import DirectoryManager
from apps.project_config_management.route_management.core.post_edit_operations import get_routing_code
from .new_component_generator import write_component

def generate_code_with_latest_config(project_name, category_filename_data):
    
    app_config_dir = f"{CONFIG_PATH}/{project_name}"
    app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
    
    # comp_config_index = read_json_file(f"{app_config_dir}/{ResourceCategory.COMPONENTS.value}/index")
    comp_config_index = read_json_file(f"{app_config_dir}/{ResourceCategory.CODE_FILE.value}/index")
    
    # reading routing config
    config_data_obj = read_config_file(project_name, "routing_config", "routing_config")
    if config_data_obj.get('err'):
        raise Exception(config_data_obj['message'], ": not able to read routing_config..")
    routing_config = config_data_obj.get('data')
    # routing_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])
        
    directory_manager = DirectoryManager(project_name)
    for category in category_filename_data:
        if category == 'routing_config':
            routing_code = get_routing_code(app_config, routing_config, comp_config_index, )
            directory_manager.save_file("ROUTE_COMPONENT", routing_code)
        elif category == 'components':
            comp_config_obj = read_config_file(project_name, category, category_filename_data[category])
            comp_config_data = comp_config_obj.get('data')[comp_config_index[app_config['defaultCompId']]]
            write_component(app_config, comp_config_data, comp_config_index)
            