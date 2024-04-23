from common.utils.config_reader import read_config_file, read_file_json, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH

class ComponentConfigService:
    def __init__(self,projectId):
        self.projectId = projectId
        self.app_config_dir = f"{CONFIG_PATH}/{projectId}"
        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.comp_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['COMPONENT_CONFIG'])
        
    def get_html_by_id(self,component,id):
        html = [self.comp_config.get(component).get("html")]
        print(html)
        
        html= self.find_html_config(html,id.split("-"),"")
        return html
    
    def find_html_config(self,html,id_arr,prefix):
        id=id_arr.pop(0)
        for x in html:
            if x["_id"]==prefix+id:
                html=x
                # print(x)
                break
        else:
            raise Exception("Not Found")
        prefix+=id+"-"
        if id_arr:
            return self.find_html_config(html["children"],id_arr,prefix)
        else:
            return html