from .component_generator import ComponentGenerator
from common.utils.file_utils import create_parent_dir_if_not_exists
import subprocess
from common.utils.path_extractor import get_path_without_ext
from .helpers.html_generator import HTMLGenerator
from .helpers.import_helper import ImportHelper
from .helpers.function_ast_parser import FunctionParser


class ComponentGenerator_TSX(ComponentGenerator):

    def __init__(self, app_config, all_comp_config,all_context_comp_config={},all_store_config={},all_reducer_config={}):
        if not hasattr(self, '_initialized'):
            self._initialized = True
            self.app_config = app_config
            self.all_comp_config = all_comp_config
            self.all_store_config = all_store_config
            self.all_context_comp_config = all_context_comp_config
            self.src_dir = f"{app_config['path']}/{app_config['name']}/{app_config['components_src_dir']}"
            self.app_config['APP_SOURCE_DIR'] = self.src_dir 
            self.all_reducer_config = all_reducer_config
            # self.mapping_config = mapping_config
            self.components_dir = f"{app_config['path']}/{app_config['name']}/{app_config['components_src_dir']}"
    
    def write_all_components(self):
        configs =  list(self.all_comp_config.values())

        for component_config in configs:
            self.write_component(component_config)
    
    def write_all_contexts(self):
        configs =  list(self.all_context_comp_config.values())

        for component_config in configs:
            self.write_component(component_config)
    
    
    def write_component(self, comp_config):
        react_component_code = self.generate_react_component_code(comp_config)
        output_file = f"{self.src_dir}/{comp_config['containingFile']}"
        formatted_code = subprocess.check_output(" ".join(['npx', 'prettier', '--parser', 'babel']), shell=True, input=react_component_code, text=True)
        create_parent_dir_if_not_exists(output_file)
        with open(output_file, 'w') as file:
            file.write(formatted_code)
