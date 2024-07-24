import json
import subprocess
import os
from common.utils.path_extractor import get_path_without_ext


from common.utils.file_utils import create_parent_dir_if_not_exists, get_dir_path_from_file
from common.utils.app_consts import NEW_LINE_CHAR
from common.utils.formatter import format_val


class ReducerGenerator():
    app_config = None
    reducer_dir = None

    def __init__(self, app_config, all_reducer_config):
        self.app_config = app_config
        self.all_reducer_config = all_reducer_config
        self.reducer_dir = f"{app_config['path']}/{app_config['name']}/{app_config['components_src_dir']}"

    def write_all_reducers(self):
        configs =  list(self.all_reducer_config.values())

        for reduer_config in configs:
            self.write_reducer(reduer_config)
    
    
    def write_reducer(self, reducer_config):
        react_reducer_code = self.generate_react_reducer_code(reducer_config)

        # Get the output file name from the JSON configuration
        output_file = f"{self.reducer_dir}/{reducer_config['containingFile']}"

        formatted_code = subprocess.check_output(" ".join(['npx', 'prettier', '--parser', 'babel']),shell=True, input=react_reducer_code, text=True)

        # Create parent dir if not exists
        create_parent_dir_if_not_exists(output_file)

        # print("output file", output_file)
        # Write the reducer code to the specified output file
        with open(output_file, 'w') as file:
            file.write(formatted_code)



    def generate_react_reducer_code(self, config):
        name = config['name']
        state_var_name = config['stateVarName']
        init_state_val = config['initialState']
                
        state_vars_declaration = '\n name :  "%s" '%(state_var_name)
        init_state_val = "\n initialState : { value : %s } "%(init_state_val)

        
        reducer_code = []
        reducer_names = []

        for reducer_conf in config['reducers']:
            reducer_code.append(FunctionCodeGenerator.generate_reducer_function(reducer_conf, config))
            reducer_names.append(reducer_conf["name"])
        
        react_reducer = """
            import { createSlice } from "@reduxjs/toolkit";

            export const %s = createSlice({
                %s,
                %s,
                reducers : {
                    %s
                }
                
            });
            export default %s.reducer; 
            export const select%s = (state) => state.%s.value;
            export const { %s } = %s.actions;

        """%(name,state_vars_declaration,init_state_val,",\n".join(reducer_code),name,state_var_name,state_var_name,",".join(reducer_names),name)

        return react_reducer


class FunctionCodeGenerator:
    @staticmethod
    def generate_function(function_def, comp_config):
        
        func_name = ""
        if function_def['isAnonymous'] is False:
            func_name = f"const {function_def['name']} = "

        
        # print(function_def)
        function_code = f"""

            {func_name} {"" if function_def['isAsync'] is not True else "async"} ( {", ".join([p['name'] for p in  function_def['parameters']])}) => {{
                
                {function_def['body']}

            }}

        """

        return function_code

    @staticmethod
    def generate_reducer_function(function_def, comp_config):
        
        func_name = function_def["name"]
        parameters = function_def["parameters"]
        func_logic = function_def["logic"]

        func_para = " state "

        if len(parameters) > 0:
            for para in parameters:
                func_para = func_para + ',' + para["name"]

        function_code = """

            %s : ( %s ) => {
                %s
            }

        """%(func_name,func_para,func_logic)

        return function_code
