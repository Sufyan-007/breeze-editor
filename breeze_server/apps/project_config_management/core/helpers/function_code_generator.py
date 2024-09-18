class FunctionCodeGenerator:
    @staticmethod
    def generate_function(function_def, comp_config):
        
        func_name = ""
        if function_def['isAnonymous'] is False:
            func_name = f"const {function_def['name']} = "
        
        function_code = f"""

            {func_name} {"" if function_def['isAsync'] is not True else "async"} {FunctionCodeGenerator.get_parameters_code(function_def)} => {{
                
                {function_def['functionBody']}

            }}

        """

        return function_code
    
    @staticmethod
    def get_parameters_code(function_def):

        print(function_def)
        
        parameters = f"""
             {", ".join([p['name'] for p in  function_def['parameters']['list']])} 
        """

        print(function_def['parameters'].get("destructured"))
        print("******")
        if function_def['parameters'].get("destructured", False):
            parameters = f"({{ {parameters} }})"
        else:
            parameters = f"({parameters})"

        return parameters


   