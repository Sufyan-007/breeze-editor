import json, os
from apps.common.utils.file_helpers.file_handler import upload_file
from .get_all_projects import get_all_projects

def load_proj_data(proj_data_request):
    data = proj_data_request.POST.dict()
    logo_file = proj_data_request.FILES.get('logo')

    data['defaultComponent'] = "Main"
    data["projectName"] = data["name"]
    # data["selectedTemplate"]= data["selectedTemplate"]
    data["name"] = data['name'].lower().replace(" ", "_")
    # path = data["projectPath"]
    data["currentEnvironment"] = ""
    generated_paths = os.path.join(
        os.path.dirname(os.getcwd()), 'generated_projects')

    # os.makedirs(generated_paths,exist_ok=True)
    data["path"] = os.path.join(generated_paths, data["name"])
    if (data["name"] in get_all_projects().keys()):
        raise Exception("Application name should be unique.")
    
    if logo_file:
        logo_file_id = upload_file(logo_file, data["name"])
        data["logoId"] = logo_file_id
    else:
        data["logoId"] = None
    if data.get('logo'):
        del data['logo']
    return data
