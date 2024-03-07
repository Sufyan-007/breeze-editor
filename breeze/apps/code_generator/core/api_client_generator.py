
import json
import subprocess
import os
from common.utils.path_extractor import get_path_without_ext
import yaml
from common.consts import react_request_code

from common.utils.file_utils import create_parent_dir_if_not_exists, get_dir_path_from_file
from common.utils.app_consts import NEW_LINE_CHAR
from common.utils.formatter import format_val

def remove_circular_refs(ob, _seen=None):
    if _seen is None:
        _seen = set()

    if id(ob) in _seen:
        return None
    _seen.add(id(ob))

    res = ob

    if isinstance(ob, dict):
        res = {
            remove_circular_refs(key, _seen): remove_circular_refs(value, _seen)
            for key, value in ob.items()}

    elif isinstance(ob, (list, tuple, set, frozenset)):
        res = type(ob)(remove_circular_refs(v, _seen) for v in ob)

    _seen.remove(id(ob))
    return res


PRIMARY_DATA_TYPE_INITIAL_VAL = {
    'integer' : 0,
    'number' : 0,
    'string' : '',
    'array' : [],
    'boolean' : 'false'
}

PRIMARY_DATA_TYPES = ['integer',
    'string' ,
    'array' ,
    'boolean']

class GenerateAPIClient():
    app_config = None
    reducer_dir = None

    def __init__(self, app_config):
        self.app_config = app_config
        
    def read_yaml(self):

        with open(f"{self.app_config['APP_CONFIG_PATH']}/yaml/sample_swagger.yml") as file:
            documents = yaml.full_load(file)
            paths = documents.get("paths",{})
            definitions  = documents.get("components",{})
            if definitions is not None:
                definitions = definitions.get("schemas",{})
            service_tags = {}

            ## attached the core functionality to call an API in the react app
            folder = "api"
            reqest = "request.js"

            self.write_file(folder,reqest,react_request_code.REQUEST)
                
            for path in paths:
                print(path)
                service = self.generate_service(path,paths[path],definitions)        
                if service is not None:
                    tags = service.get("tags",[])
                    service_func = service.get("code","")
                    if tags is not None:
                        for tag in tags:
                            if tag in service_tags:
                                service_tags.get(tag).append(service_func)
                            else:
                                service_tags[tag] = [service_func]
                    print("------------------------")
                    print(service_func)

            ## preprare new service file for each tag
            folder_name = "service"
            for tag,func_arr in service_tags.items():
                filename = tag+"Service.js"
                content = "\n"
                content += 'import { request } from "../%s/%s"'%(folder,reqest)
                for func in func_arr:
                    content += "\n"
                    content += func 
                self.write_file(folder_name,filename,content)


            # for definition in definitions:
            #     data_model = self.generate_data_model(definitions[definition],definitions)
            #     s = json.dumps(remove_circular_refs(data_model))
            #     content = "const %s = %s; export default %s;"%(definition,s,definition)
            #     filename = definition+".js"
            #     self.write_file("model",filename,content)
    
    def write_file(self,folder,filename,content):
        path =f"{self.app_config['path']}/{self.app_config['name']}/src/{folder}/"

        output_file = f"{path}/{filename}"
        # Create parent dir if not exists
        create_parent_dir_if_not_exists(output_file)
        with open(output_file, 'w') as file:
            file.write(content)



    def initialize_data_type(self,init_state,key,obj,definition):
        
        if "type" in obj:
            if obj["type"] == 'object':
                init_state[key] = [self.generate_data_model(obj,definition)]
            
                
            elif obj["type"] == 'array':
                    items = obj["items"]
                    if 'type' in items:
                        init_state[key] = PRIMARY_DATA_TYPE_INITIAL_VAL[obj["type"]]
                    elif "$ref" in items:
                        ref = items["$ref"]
                        ref = ref.split("/")[-1]
                        init_state[key] = [self.generate_data_model(definition[ref],definition)]
            else:
                init_state[key] = PRIMARY_DATA_TYPE_INITIAL_VAL[obj["type"]]
        elif "$ref" in obj:
            ref = obj["$ref"]
            ref = ref.split("/")[-1]
            init_state[key] = self.initialize_data_type(init_state,ref,definition[ref],definition)
        else:
            pass
        return init_state

    def generate_data_model(self,obj,definition):
        properties = obj.get("properties",{})
        init_state = {}
        # get data type for initial value
        for property in properties:
            init_state =self.initialize_data_type(init_state,property,properties[property],definition)

        return init_state

    def generate_service(self,path,obj,definitions):
        tags = []
        code = ''
        for method in obj:
            method = method
            code+= "\n" + self.generate_service_function(method,path,obj[method],definitions)
            tags = obj[method].get("tags")
        return {
            "tags" : tags,
            "code": code
        }
            
    def generate_service_function(self,method,path,obj,definitions):
            func_name = obj.get("operationId","test")
            func_name = func_name.replace("-","_")
            parameters = obj.get("parameters",{})
            func_args = []
            required_params = []
            arr_obj_code = ""
            req_body = {}
            api_options_keys = []
            react_code = """
                export const {FUNC_NAME} = async ({FUNC_ARGS}) => {
                    {REQUIRED_VALIDATION_CODE}
                    {ARR_OBJ_CODE}
                    const  apiOptions = {API_OPTIONS} 
                    const resp = await request(apiOptions)
                    return resp
                };
            """
            api_options = {
                "method" : method,
                "url": str(path)
            }
            queries = []
            paths = []
            definition =  None
            print(obj)
            ref=None
            if "requestBody" in obj:
                requestBody = obj.get("requestBody")
                content = requestBody.get("content",{})
                app_json = content.get("application/json",{})
                api_options_keys.append("body")
                ref = None

                if "schema" in app_json:
                    is_array = False
                    schema = app_json["schema"]
                    if "type" in schema and schema["type"] == "array":
                        is_array = True
                        items = schema["items"]
                        ref = items["$ref"]
                        # if "reactStateObjArray" not in func_args:
                        #     func_args.append("reactStateObjArray")
                
                    else:
                        ref = app_json["schema"]["$ref"]
                        # if "reactStateObj" not in func_args:
                        #     func_args.append("reactStateObj")
                        
                    ref = ref.split("/")[-1]
                    if ref not in func_args:
                        func_args.append(ref)
                        
                    model = definitions[ref]
                    resp = self.generate_request_body_model(is_array,ref,model,definitions)
                    tem =self.extract_schema_and_generate_js_class(model,definitions,ref)
                    filename = ref+".js"
                    self.write_file("model",filename,tem)
    
                    req_body = resp["code"]
                    required_props = resp["required_props"]
                    for prop in required_props: 
                        required_params.append(prop)
                    if is_array is False:
                        api_options["body"] = req_body
                    else:
                        arr_obj_code = req_body
                        api_options["body"] = "arrObj"



            for parameter in parameters:
                if parameter.get("required",False) is True:
                    required_params.append(parameter)
                
                if parameter.get("in") == "path":
                    api_options_keys.append("path")
                    name = parameter["name"]
                    func_args.append(name)
                    
                    paths.append(" '%s' : %s"%(name,name))
                    if "path" in api_options:
                        api_options["path"][name] = name
                    else:
                        api_options["path"] = {}
                        api_options["path"][name] = name
            
                elif parameter.get("in") == "query":
                    api_options_keys.append("query")
                    name = parameter["name"]
                    queries.append(" '%s' : %s"%(name,name))

                    func_args.append(name)
                    if "query" in api_options:
                        api_options["query"][name] = name
                    else:
                        api_options["query"] = {}
                        api_options["query"][name] = name
                
                elif parameter.get("in") == "body":
                    api_options_keys.append("body")
                    if "schema" in parameter:
                        is_array = False
                        schema = parameter["schema"]
                        if "type" in schema and schema["type"] == "array":
                            is_array = True
                            items = schema["items"]
                            ref = items["$ref"]
                            # if "reactStateObjArray" not in func_args:
                            #     func_args.append("reactStateObjArray")
                    
                        else:
                            ref = parameter["schema"]["$ref"]
                            # if "reactStateObj" not in func_args:
                            #     func_args.append(ref)
                        if ref not in func_args:
                            func_args.append(ref)
                      
                    ref = ref.split("/")[-1]
                    model = definitions[ref]
                    resp = self.generate_request_body_model(is_array,ref,model,definitions)
                    req_body = resp["code"]
                    required_props = resp["required_props"]
                    for prop in required_props: 
                        required_params.append(prop)
                    if is_array is False:
                        api_options["body"] = req_body
                    else:
                        arr_obj_code = req_body
                        api_options["body"] = "arrObj"

                
            react_code = react_code.replace("{FUNC_NAME}",func_name)
            required_params_code = []
            for para in required_params:
                required_params_code.append(self.generate_code_for_required_params(ref,para))
            if len(required_params_code)>0:
                required_validation_code = """
                    let validationErrors = [];
                """
                required_validation_code += "\n".join(required_params_code)
                required_validation_code += """
                    if(validationErrors.lengh > 0){
                        return {
                            "error" : true,
                            "message" : validationErrors
                        }
                    }
                """
                react_code = react_code.replace("{REQUIRED_VALIDATION_CODE}",required_validation_code)
            else:
                react_code = react_code.replace("{REQUIRED_VALIDATION_CODE}","")
        
            pairs = []
            if len(arr_obj_code)>0:
                react_code = react_code.replace("{ARR_OBJ_CODE}",arr_obj_code)
            else:
                react_code = react_code.replace("{ARR_OBJ_CODE}","")
        
            if len(paths)>0:
                api_options["path"] = "{"+",".join(paths)+"}"
            if len(queries)>0:
                api_options["query"] = "{"+",".join(queries)+"}"
            
            for x,y in api_options.items():
                if x == 'method' or x =='url':
                    pairs.append(" '%s' : '%s'"%(x,y))
                else:    
                    pairs.append(" '%s' : %s"%(x,y))
            API_OPTIONS ="{"+",".join(pairs)+"}"
            react_code
            react_code = react_code.replace("{API_OPTIONS}",API_OPTIONS)
            if len(func_args)>0:
                react_code = react_code.replace("{FUNC_ARGS}",",".join(func_args))
            else:
                react_code = react_code.replace("{FUNC_ARGS}","")

            return react_code

    def generate_request_body_model(self,is_array,ref,definition,definitions):
        resp = {
            "code" : None,
            "required_props" : []
        }
        reactStateObj = ""
        pairs = []
        body = {}
        if is_array is False:
            properties = definition.get("properties",{})
            resp["required_props"] = definition.get("required",[])
            # get data type for initial value
            for key,property in properties.items():
                if "type" in property:
                    if property.get("type") in PRIMARY_DATA_TYPES:
                        body[key] = f'{ref}.{key}'
                    elif property.get("type") == "array":
                        items = property.get("items")
                        body[key] = f'{ref}.{key}'
                elif "$ref" in property :
                    ref = property.get("$ref")    
                    body[key] = f'{ref}.{key}'
            for i in body:
                pairs.append(" '%s' : %s.%s"%(i,ref,i))
            reactStateObj ="{"+",".join(pairs)+"}"
            resp["code"] = reactStateObj
            return resp

        else:
            resp["required_props"] = definition.get("required",[])
                
            properties = definition.get("properties",{})
            # get data type for initial value
            for key,property in properties.items():
                if "type" in property:
                    if property.get("type") in PRIMARY_DATA_TYPES:
                        body[key] = f'obj.{key}'
                    elif property.get("type") == "array":
                        items = property.get("items")
                        body[key] = f'obj.{key}'
                elif "$ref" in property :
                    ref = property.get("$ref")    
                    body[key] = f'obj.{key}'
            for i in body:
                pairs.append(" '%s' : reactStateObjArray[i].%s"%(i,i))
            s2 ="{"+",".join(pairs)+"}"
            s1 = """
                const arrObj = []; 
                for (let i = 0; i < reactStateObjArray.length; i++){ 
                    arrObj[i] = %s;
                }
                """%(s2)
            resp["code"]= s1
            return resp

    def generate_code_for_required_params(self,ref,parameter):
        code = ""
        if isinstance(parameter,str):
            code = """ if(!%s.hasOwnProperty('%s')){
                            validationErrors.push("%s is required")
                        }
                """%(ref,parameter,parameter)
        else:
            name = parameter.get("name")
            code = """ if(%s == null || %s == ''){
                            validationErrors.push("%s is required")
                        }
                """%(name,name,name)
        return code

    def extract_schema_and_generate_js_class(self,schema,all_schemas, schema_name):
    
        file_content = """"""
        class_name = schema_name.capitalize()
        imports = self.get_imports(schema)
        print('imports', imports)
        for import_name in imports:
            file_content = "\n" +f"import {import_name} from './{import_name}'\n"
        file_content += "\n" + f"export default class {class_name} {{\n"
        file_content += "\n" + f"    constructor() {{\n"
        for property_name, property_schema in schema['properties'].items():
            # print(property_schema, "ps")
            property_type = self._translate_js_type(property_schema['type'])
            if property_type in ('object', 'Array') and property_schema.get('items', {}).get('$ref'):
                dependency_schema_name = property_schema.get('items', {})['$ref'].split('/')[-1]
                file_content += "\n" +f"        this._{property_name} = new {dependency_schema_name.capitalize()}();\n"
            elif property_type == 'array' and property_schema.get('items', {}).get('$ref'):
                # Skip generation for arrays with refs
                pass
            else:
                file_content += "\n" +f"        this._{property_name} = '';\n"
        file_content += "\n" +f"    }}\n"
        # Write the rest of the class properties and methods here, within the `with` block
        for property_name, property_schema in schema['properties'].items():
                property_type = self._translate_js_type(property_schema['type'])
                if property_type == 'Array' and property_schema.get('items', {}).get('$ref'):
                    dependency_schema_name = property_schema.get('items', {})['$ref'].split('/')[-1]
                    dependency_schema = all_schemas.get(dependency_schema_name)
                    # Generate getter with nested property access
                    file_content += "\n" +f"    get {property_name}() {{\n"
                    file_content += "\n" +f"        return ";
                    file_content += "\n" +f"       this._{property_name} ";
                    
                    file_content += "\n" +f"    }}\n"
                    # Generate setter with nested property updates
                    file_content += "\n" +f"    set {property_name}(value) {{\n"
                    for property in dependency_schema['properties'].keys():
                        file_content += "\n" +f"        this._{property_name}.{property}(value.{property}) \n"  # Update nested properties
                    file_content += "\n" +f"    }}\n"
                else:  # Handle non-array properties
                    property_type = self._translate_js_type(property_schema['type'])
                    file_content += "\n" +f"    get {property_name}() {{\n"
                    file_content += "\n" +f"        return this._{property_name};\n"
                    file_content += "\n" +f"    }}\n"
                    file_content += "\n" +f"    set {property_name}(value) {{\n"
                    file_content += "\n" +f"        if (typeof value !== '{property_type}') {{\n"
                    file_content += "\n" +f"            throw new TypeError('{property_name} must be of type {property_type}');\n"
                    file_content += "\n" +f"        }}\n"
                    file_content += "\n" +f"        this._{property_name} = value;\n"
                    file_content += "\n" +f"    }}\n"
        file_content += "\n" +f"    }}\n"
        print(file_content)
        return file_content

    def get_imports(self,schema):
        imports = []
        for property_name, property_schema in schema['properties'].items():
            # print(property_name, property_schema)
            if property_schema.get('type') in ('object', 'array') and property_schema.get('items',{}).get('$ref'):
                dependency_schema_name = property_schema.get('items')['$ref'].split('/')[-1]
                imports.append(dependency_schema_name.capitalize())
            # print(imports, "imports")
        return imports
    def _translate_js_type(self,python_type):
        type_map = {
            'string': 'string',
            'integer': 'number',
            'number': 'number',
            'boolean': 'boolean',
            'array': 'Array',  # Handle arrays separately
        }
        return type_map.get(python_type, python_type)