import json
import subprocess
import os
from common.utils.path_extractor import get_path_without_ext


from common.utils.file_utils import create_parent_dir_if_not_exists, get_dir_path_from_file
from common.utils.app_consts import NEW_LINE_CHAR
from common.utils.formatter import format_val

def generate_imports_code(store_config, all_reducer_config):
    # print(component_config)
    imported_reducer = store_config['imports']['reducer'] 
    import_statements = []

    # Handle import for components
    for ic in imported_reducer:
        related_comp = all_reducer_config[ic]
        comp_path = get_path_without_ext(related_comp['containingFile'])

        import_statement = f'import {related_comp["name"]} from \'{comp_path}\';'
        import_statements.append(import_statement)

    # Handle other imports
    for imp in store_config['imports']['other']:
        if imp['TYPE'] == "THIRD_PARTY":
            if imp['import_type'] == 'FULL':
                import_statement = f'import {imp["import_entity"]} from \'{imp["from"]}\' ;'
            # elif imp['import_type'] == 'SINGLE':
            else:
                import_statement = f'import  {{{imp["import_entity"]}}} from \'{imp["from"]}\' ;'
            
            import_statements.append(import_statement)

    return '\n'.join(import_statements)


class ReduxStoreGenerator():
    app_config = None
    reducer_dir = None

    def __init__(self, app_config, all_redux_store_config,all_reducer_config,all_comp_config):
        self.app_config = app_config
        self.all_redux_store_config = all_redux_store_config
        self.all_reducer_config = all_reducer_config
        self.all_comp_config = all_comp_config
        self.reducer_dir = f"{app_config['path']}/{app_config['components_src_dir']}"

    def write_all_store(self):
        configs =  list(self.all_redux_store_config.values())

        for store_config in configs:
            self.write_store(store_config,self.all_reducer_config,self.all_comp_config)
    
    
    def write_store(self, store_config,all_reducer_config,all_comp_config):
        react_store_code = self.generate_react_redux_store_code(store_config,all_reducer_config,all_comp_config)

        # Get the output file name from the JSON configuration
        output_file = f"{self.reducer_dir}/{store_config['containingFile']}"

        formatted_code = subprocess.check_output(" ".join(['npx', 'prettier', '--parser', 'babel']), shell=True, input=react_store_code, text=True)

        # Create parent dir if not exists
        create_parent_dir_if_not_exists(output_file)

        # print("output file", output_file)
        # Write the reducer code to the specified output file
        with open(output_file, 'w') as file:
            file.write(formatted_code)



    def generate_react_redux_store_code(self, config,all_reducer_config,all_comp_config):
                
        reducer_mapping = []
        import_code = generate_imports_code(config, all_reducer_config)
        
        for reducer_conf in config['reducer']:
            value = all_reducer_config[reducer_conf["value"]]
            reducer_mapping.append(" %s : %s"%(reducer_conf["name"],value["name"]))
        
        react_redux_store = """
            %s
            export default configureStore({
                reducer: {
                    %s
                }
                
            });
        """%(import_code,",\n".join(reducer_mapping))

        return react_redux_store
