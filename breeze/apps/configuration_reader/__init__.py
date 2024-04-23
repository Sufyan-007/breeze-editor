COMPONENTS_CONFIG = None
COMPONENTS_LIST = None
from common.utils.config_reader import read_config_file, read_file_json, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH, THIRD_PARTY_CONFIG_PATH
from .core.html_attributes import COMMON_HTML_ATTRIBUTES
import pathlib
import os

def prepare_config_map():
    global COMPONENTS_CONFIG
    global COMPONENTS_LIST
    print(COMPONENTS_CONFIG)
    if COMPONENTS_CONFIG is None:
        print("Preparing data on startup")
        COMPONENTS_CONFIG = {
            "CUSTOM" : {},
            "HTML" : {},
            "THIRD_PARTY" : {}
        }

        COMPONENTS_LIST = {
            "CUSTOM" : {},
            "HTML" : [],
            "THIRD_PARTY" : {}
        }


        all_projects = []
        all_projects_path = pathlib.Path(CONFIG_PATH)
        all_projects_path = list(all_projects_path.iterdir())

        # Preapre config map for html components
        COMPONENTS_CONFIG["HTML"] = prepare_html_comp_config()

        for html_comp in COMPONENTS_CONFIG["HTML"]:
            COMPONENTS_LIST["HTML"].append({
                "name" : html_comp,
                "id" : html_comp.upper()
            })

        # Preapre for third party components
        prepare_tp_comp_config()

        # Prepare config map for custom project components
        for project_config_dir in all_projects_path:
            project_config = read_config_file(project_config_dir, CONFIG_FILES_PATH['APP_CONFIG']) 

            comp_config = prepare_comp_config(project_config_dir)
            COMPONENTS_CONFIG["CUSTOM"][project_config['name']] = comp_config

            COMPONENTS_LIST["CUSTOM"][project_config['name']] = []

            for single_comp_config in comp_config:
                COMPONENTS_LIST["CUSTOM"][project_config['name']].append({
                    "name" : comp_config[single_comp_config]['name'],
                    #Certain config files don't contain $ID field, will remove later
                    "id" : comp_config[single_comp_config].get("$id",comp_config[single_comp_config]['name'])
                })
            

        print("FINISHED PREPARING COMPONENT CONFIG MAP")

def prepare_tp_comp_config():
    global COMPONENTS_CONFIG
    global COMPONENTS_LIST

    # If the folder doesnt exits then skip all the execution
    if not pathlib.Path(THIRD_PARTY_CONFIG_PATH).exists():
        return

    all_tp_path = pathlib.Path(THIRD_PARTY_CONFIG_PATH)
    all_tp_path = list(all_tp_path.iterdir())

    for tp_path in all_tp_path:
        tp_name = os.path.basename(tp_path)

        all_comp_path = []    
        all_comp_path = pathlib.Path(tp_path)    
        all_comp_path = list(all_comp_path.rglob("component_*.json"))

        COMPONENTS_LIST["THIRD_PARTY"][tp_name] = []
        all_comp_config = {}
        for comp_path in all_comp_path:
            comp_config = read_file_json(comp_path)
            all_comp_config[comp_config['$id']] = comp_config
            COMPONENTS_LIST["THIRD_PARTY"][tp_name].append({
                "name" : comp_config['name'],
                "id" : comp_config["$id"]
            })

        
        COMPONENTS_CONFIG["THIRD_PARTY"][tp_name] = all_comp_config


def prepare_html_comp_config():
    html_comp_config = {}

    html_elements = [
        "DOCTYPE html",
        "div",
        "html",
        "head",
        "title",
        "meta",
        "link",
        "body",
        # Text Elements
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "span",
        "a",
        "strong",
        "em",
        "br",
        "hr",
        # Lists
        "ul",
        "li",
        "dl",
        "dt",
        "dd",
        # Tables
        "table",
        "tr",
        "td",
        "th",
        # Forms
        "form",
        "input",
        "textarea",
        "button",
        "select",
        "option",
        "label",
        "fieldset",
        "legend",
        "body",
        "img"
    ]
    
    html_elements = sorted(html_elements)
    
    # common_config = read_file_json("/home/raj/Desktop/bridge/processor/bridge_ui_server/html_attributes.json")
    common_config = COMMON_HTML_ATTRIBUTES    
    for ele in html_elements:
        html_comp_config[ele] = common_config
    return html_comp_config

# Read components path
def read_components_configs_path(project_config_path):
    comp_config_path = f"{project_config_path}/app_components"

    all_comp_path = []

    
    all_comp_path = pathlib.Path(comp_config_path)

    
    all_comp_path = list(all_comp_path.rglob("component_*.json"))

    return all_comp_path

def prepare_comp_config(project_config_path):
    comp_config = read_config_file(project_config_path, CONFIG_FILES_PATH['COMPONENT_CONFIG'])

    comp_paths = read_components_configs_path(project_config_path)

    for comp_path in comp_paths:
        comp_config = read_file_json(comp_path)
        comp_config[comp_config['$id']] = comp_config

    return comp_config

prepare_config_map()