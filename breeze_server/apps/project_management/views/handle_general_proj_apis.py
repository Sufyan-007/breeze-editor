import os, json
import shutil
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file
from apps.common.utils.file_helpers.file_handler import upload_file
from apps.project_config_management.views.config_writer import create_or_update_app_config
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def get_all(request, api_res=True):
    project_names = os.listdir(CONFIG_PATH)
    projects={}
    for project_name in project_names:
        app_config_dir = f"{CONFIG_PATH}/{project_name}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        app_config['project_name'] = project_name
        projects[project_name]=app_config
    if api_res:
        return JsonResponse(projects, status=200)
    else:
        return projects

@csrf_exempt
def add(request):
    data = json.loads(request.body.decode("utf-8"))
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
    data["path"] = os.path.join(generated_paths, data["name"])
    if (data["name"] in get_all("", api_res=False).keys()):
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

@csrf_exempt
def delete(request, param):
    # for the time being param will be project_name instead of ID
    print(param)
    project_name = param
    app_config_dir = f"{CONFIG_PATH}/{project_name}"
    try:
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        generated_project_path = app_config['path']
    except:
        raise FileNotFoundError("Could not find project '{project_name}")
    print(app_config_dir)
    print(generated_project_path)
    shutil.rmtree(app_config_dir)
    try:
        shutil.rmtree(generated_project_path,ignore_errors=False)
    except Exception as e:
        print("error occured: ", e)
        return JsonResponse({"message": "Failed to delete the project"}, status=200)
    return JsonResponse({"message": f"{project_name} deleted successfully"}, status=200)