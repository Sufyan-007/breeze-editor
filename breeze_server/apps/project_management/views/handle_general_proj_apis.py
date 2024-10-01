import shutil
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from ..utils.validate_add_proj_data import load_proj_data
from ..utils.get_all_projects import get_all_projects
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file
from apps.project_config_management.core.config_files_handlers import add_dirs_configs
from apps.code_generator.core.generate_project import generate_project

@csrf_exempt
@api_view(['GET'])
def get_all(request):
    projects = get_all_projects()
    return JsonResponse(projects, status=200)

@csrf_exempt
def get_a_project(request, project_id):
    return ""

@csrf_exempt
@api_view(['POST'])
def add(request):
    
    try:
        ## 1) Load proj data from UI
        ## 2) Validate proj data
        data = load_proj_data(request)
        
        ## 3) Write proj data (app_config.json)
        ## 4) Create default directories objects for given template
        ## 5) Create default config for the main component via proj_config_management
        ## 6) Create default config for the route for main comp via proj_config_management
        app_current_config = add_dirs_configs(data)
            
        ## 7) Replace the content for the related code in the template file
        ## 8) Create all the files in the targeted new app
        ## 9) Install all the dependencies in that project
        generate_project(app_current_config)
        
        # TODO: need to add this part later
        # if logo_file:
        #     resource_config_generator = ResourceConfigGenerator(data["name"])
        #     resource_config_generator.update_config(logo_file.name, '/src/assets', "", logo_file_id)
        response = {"name": data["name"]}
        return JsonResponse(response, status=200)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)
        

@csrf_exempt
def delete(request, project_id):
    app_config_dir = f"{CONFIG_PATH}/{project_id}"
    try:
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        generated_project_path = app_config['path']
    except:
        raise FileNotFoundError("Could not find project '{project_name}")
    shutil.rmtree(app_config_dir)
    try:
        shutil.rmtree(generated_project_path,ignore_errors=False)
    except Exception as e:
        print("error occured: ", e)
        return JsonResponse({"message": "Failed to delete the project"}, status=500)
    # here parent_id is parent name itself 
    return JsonResponse({"message": f"{project_id} deleted successfully"}, status=200)