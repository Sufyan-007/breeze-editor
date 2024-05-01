from common.utils.config_reader import read_config_file, read_file_json, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from .app_editor import AppEditor
class ComponentConfigService:
    def __init__(self,projectId):
        self.projectId = projectId
        self.app_config_dir = f"{CONFIG_PATH}/{projectId}"
        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.comp_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['COMPONENT_CONFIG'])
        
    def get_html_by_id(self,component,id):
        html= self.comp_config.get(component).get("html_elements").get(id)
        self.map_children(component,html)
        return html
    
    
    def update_html_config(self,component,id,html):
        self.comp_config.get(component).get("html_elements")[id] = html
        print("Updated html")
        appEditor=AppEditor(self.projectId)
        appEditor.write_component(self.comp_config.get(component))
        return self.comp_config
    
    def delete_html_config(self,component,id):
        ids = id.split("-")
        if len(ids)<2:
            raise IndexError("Invalid Id")
        parent_id = ("-").join(ids[:-1])
        self.delete_html_recursive(component,id)
        parent_html= self.comp_config.get(component).get("html_elements").get(parent_id)
        for x in parent_html.get("children",[]):
            if x["_id"]==id:
                parent_html["children"].remove(x)
        print(self.comp_config.get(component).get("html_elements"))
        return self.update_html_config(component,parent_id,parent_html)
        
    def delete_html_recursive(self,component,id):
        html= self.comp_config.get(component).get("html_elements").get(id)
        self.comp_config.get(component).get("html_elements").pop(id)
        if html["type"]=="Element":
            for x in html["children"]:
                self.delete_html_recursive(component,x["_id"])
    
    def map_children(self,component,html):
        if html.get("children"):
            for i,x in enumerate(html["children"]):
                elemType= self.comp_config[component]["html_elements"][x["_id"]]["type"]
                html["children"][i]["type"]=elemType
                if elemType=="Element":
                    html["children"][i]["tagName"]=self.comp_config[component]["html_elements"][x["_id"]]["tagName"]
    
    def add_child(self,component,parent_html_id,child):
        
        raise NotImplementedError()