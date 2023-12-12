
import pathlib
# desktop = pathlib.Path("")

# # .rglob() produces a generator too
# desktop.rglob("*")

# # Which you can wrap in a list() constructor to materialize
# list(desktop.rglob("*"))


from utils.app_consts import APP_CONFIG_PATH
from function_code_generator import FunctionCodeGenerator
from utils.config_reader import read_file_json
from import_helper import ImportHelper

class ServiceHandler():

    app_config = None
    all_services_path = []

    def __init__(self, app_config):
        self.app_config = app_config
        self.read_all_services_path()

        pass

    def read_all_services_path(self):
        print("READ")
        service_config_path = f"{APP_CONFIG_PATH}/services"

        all_services_path = pathlib.Path(service_config_path)

        self.all_services_path = list(all_services_path.rglob("*.json"))

        # print(self.all_services_path)

    def write_servic(self):
        print("WRITE")



    def generate_services_code(self):

        print("----GENERATING SERVICE CODE----")
        for service_path in self.all_services_path:
            print("SERVICE PATH : ", service_path)
            service_config = read_file_json(service_path)
            

            import_helper = ImportHelper()
            import_code = import_helper.generate_imports_code(service_config, {}, {}, self.app_config)

            print("----\n",import_code)
            
            code_generator = ServiceCodeGenerator(service_config=service_config)
            svc_code = code_generator.generate_code()

            print(svc_code)


class ServiceCodeGenerator():

    service_config = None
    def __init__(self, service_config):
        self.service_config = service_config

    def generate_code(self):
        javascript_code = ""



        for item in self.service_config["variables"]:
            declaration_type = item["declarationType"]
            var_type = item["varType"]
            var_id = item["$id"]
            properties = item.get("PROPERTIES", {})
            name = item.get("name", "")
            is_async = "async " if item.get("isAsync", False) else ""

            if declaration_type == "CONST" and var_type == "OBJECT":
                value = properties.get("isAll", {}).get("value", "null")
                javascript_code += f"{declaration_type} {name} = {value};\n"
            elif declaration_type == "CONST" and var_type == "FUNCTION":
                function_code = FunctionCodeGenerator.generate_function(item, None) 
                javascript_code += f"{function_code}\n"

        return javascript_code


# Function to convert the JSON configuration to JavaScript code
# def generate_javascript_code(config):
#     javascript_code = ""

#     for item in config["variables"]:
#         declaration_type = item["declarationType"]
#         var_type = item["varType"]
#         var_id = item["$id"]
#         properties = item.get("PROPERTIES", {})
#         name = item.get("name", "")
#         is_async = "async " if item.get("isAsync", False) else ""

#         if declaration_type == "CONST" and var_type == "OBJECT":
#             value = properties.get("isAll", {}).get("value", "null")
#             javascript_code += f"{declaration_type} {name} = {value};\n"
#         elif declaration_type == "CONST" and var_type == "FUNCTION":
#             parameters = ", ".join(param["name"] for param in item.get("parameters", []))
#             body = item.get("body", "")
#             javascript_code += (
#                 f"{declaration_type}  {name} = {is_async} ({parameters}) => {{\n{body}\n}};\n"
#             )

#     return javascript_code

# Generate JavaScript code from the configuration
# javascript_code = generate_javascript_code(config)

# Output the JavaScript code

# service_generator = ServiceHandler({})

# javascript_code = service_generator()

# print(javascript_code)
