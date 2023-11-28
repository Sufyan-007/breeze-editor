
import json
import subprocess
import os
from utils.path_extractor import get_path_without_ext
import yaml
from utils.app_consts import APP_CONFIG_PATH
from configurations.demo_app import react_request_code

from utils.file_utils import create_dir_if_not_exists, get_dir_path_from_file
from utils.app_consts import NEW_LINE_CHAR
from utils.formatter import format_val

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

        with open(r"configurations/demo_app/sample_swagger.yaml") as file:
            documents = yaml.full_load(file)
            paths = documents.get("paths",{})
            definitions  = documents.get("definitions",{})
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


            for definition in definitions:
                print(definition)
                data_model = self.generate_data_model(definitions[definition],definitions)
                s = json.dumps(remove_circular_refs(data_model))
                content = "const %s = %s; export default %s;"%(definition,s,definition)
                filename = definition+".js"
                self.write_file("model",filename,content)
                print(data_model)
    
    def write_file(self,folder,filename,content):
        path =f"{self.app_config['path']}/{self.app_config['name']}/src/{folder}/"

        output_file = f"{path}/{filename}"
        # Create parent dir if not exists
        create_dir_if_not_exists(output_file)
        with open(output_file, 'w') as file:
            file.write(content)



    def initialize_data_type(self,init_state,key,obj,definition):
        
        if "type" in obj:
            if obj["type"] == 'array':
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
        for method in obj:
            method = method
            code= self.generate_service_function(method,path,obj[method],definitions)
            tags = obj[method].get("tags")
            return {
                "tags" : tags,
                "code": code
            }
            
    def generate_service_function(self,method,path,obj,definitions):
            func_name = obj.get("operationId","test")
            parameters = obj.get("parameters",{})
            func_args = []
            required_params = []
            arr_obj_code = ""
            req_body = {}
            api_options_keys = []
            react_code = """
                const {FUNC_NAME} = async ({FUNC_ARGS}) => {
                    {REQUIRED_VALIDATION_CODE}
                    {ARR_OBJ_CODE}
                    const  apiOptions = {API_OPTIONS} 
                    const resp = await request(apiOptions)
                    console.log(resp);
                };
            """
            api_options = {
                "method" : method,
                "url": str(path)
            }
            queries = []
            paths = []
            definition =  None

            for parameter in parameters:
                if parameter.get("required",False) is True:
                    required_params.append(parameter)
                    
                if parameter.get("in") == "body":
                    api_options_keys.append("body")
                    if "schema" in parameter:
                        ref = None
                        is_array = False
                        schema = parameter["schema"]
                        if "type" in schema and schema["type"] == "array":
                            is_array = True
                            items = schema["items"]
                            ref = items["$ref"]
                            if "reactStateObjArray" not in func_args:
                                func_args.append("reactStateObjArray")
                    
                        else:
                            ref = parameter["schema"]["$ref"]
                            if "reactStateObj" not in func_args:
                                func_args.append("reactStateObj")
                            
                    ref = ref.split("/")[-1]
                    model = definitions[ref]
                    resp = self.generate_request_body_model(is_array,model,definitions)
                    req_body = resp["code"]
                    required_props = resp["required_props"]
                    for prop in required_props: 
                        required_params.append(prop)
                    if is_array is False:
                        api_options["body"] = req_body
                    else:
                        arr_obj_code = req_body
                        api_options["body"] = "arrObj"

                elif parameter.get("in") == "path":
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
            
            react_code = react_code.replace("{FUNC_NAME}",func_name)
            required_params_code = []
            for para in required_params:
                required_params_code.append(self.generate_code_for_required_params(para))
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

    def generate_request_body_model(self,is_array,definition,definitions):
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
                        body[key] = f'reactStateObj.{key}'
                    elif property.get("type") == "array":
                        items = property.get("items")
                        body[key] = f'reactStateObj.{key}'
                elif "$ref" in property :
                    ref = property.get("$ref")    
                    body[key] = f'reactStateObj.{key}'
            for i in body:
                pairs.append(" '%s' : reactStateObj.%s"%(i,i))
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

    def generate_code_for_required_params(self,parameter):
        code = ""
        if isinstance(parameter,str):
            code = """ if(!reactStateObj.hasOwnProperty('%s')){
                            validationErrors.push["%s is required"]
                        }
                """%(parameter,parameter)
        else:
            name = parameter.get("name")
            code = """ if(%s == null || %s == ''){
                            validationErrors.push["%s is required"]
                        }
                """%(name,name,name)
        return code