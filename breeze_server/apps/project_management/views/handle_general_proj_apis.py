import os
from apps.common.consts import CONFIG_FILES_PATH
from apps.common.device_spec_consts import CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file
from apps.common.utils.file_helpers.file_handler import upload_file
from apps.project_config_management.views.config_writer import create_or_update_app_config
from django.http import JsonResponse

def get_all(self):
    project_names = os.listdir(CONFIG_PATH)
    projects={}
    for project_name in project_names:
        app_config_dir = f"{CONFIG_PATH}/{project_name}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        app_config['project_name'] = project_name
        projects[project_name]=app_config
    return JsonResponse(projects, status=200)

def add(self, request):
    data = request.POST.copy()
    logo_file = request.FILES.get('logo')

    data['defaultComponent'] = "Main"
    data["projectName"] = data["name"]
    # data["selectedTemplate"]= data["selectedTemplate"]
    data["name"] = data['name'].lower().replace(" ", "_")
    path = data["projectPath"]
    data["current_environment"] = ""
    generated_paths = os.path.join(
        os.path.dirname(os.getcwd()), path)

    # os.makedirs(generated_paths,exist_ok=True)
    data["path"] = os.path.join(generated_paths)
    if (data["name"] in get_all().keys()):
        return JsonResponse({"error": "Application name should be unique."}, status=400)
    
    if logo_file:
        logo_file_id = upload_file(logo_file, data["name"])
        data["logo"] = logo_file_id
        data["logo_file_name"] = logo_file.name

    create_or_update_app_config(data)
    
    # TODO: need to add this part later
    # if logo_file:
    #     resource_config_generator = ResourceConfigGenerator(data["name"])
    #     resource_config_generator.update_config(logo_file.name, '/src/assets', "", logo_file_id)
    response = {"name": data["name"]}
    return JsonResponse(response, status=200)

def delete(param):
    pass