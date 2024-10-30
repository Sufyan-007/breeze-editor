import os,json
from apps.common.utils.file_helpers.file_handler import upload_file
from .get_all_projects import get_all_projects
from ..models.handle_general_proj_apis import AddSchemaBody
from django.http import JsonResponse
def load_proj_data(proj_data_request):
    data = proj_data_request.POST.dict()
    logo_file = proj_data_request.FILES.get('logo')
    
    # Validate project data
    res = AddSchemaBody(data.get("name"),data.get("author"),data.get("technology"),data.get("language"),data.get("styling"),data.get("buildTool"),logo_file)
    # errors = {field: f"{field.capitalize()} is required." for field in ["name", "author", "technology", "language", "styling", "buildTool"] if not data.get(field)}
    if(res.__dict__['isError']):
        return res

    # errors = {}
    # if res.__dict__.get("name"):
    #     project_name_normalized = res.__dict__.get("name").lower().replace(" ", "_")
    #     if project_name_normalized in get_all_projects().keys():
    #         errors["name"] = "Project name must be unique."
    
    # if logo_file:
    #     if logo_file.size > 5 * 1024 * 1024:
    #         errors["logo"] = "Logo must be smaller than 5MB."
    #     if not logo_file.content_type.startswith("image/"):
    #         errors["logo"] = "Logo must be an image."
    
    # if errors:
    #     return {"errors": errors}
    project_name_normalized = res.__dict__['responseObj'].get("name").lower().replace(" ", "_")
    res.__dict__['responseObj']['defaultComponent'] = "Main"
    res.__dict__['responseObj']["projectName"] = res.__dict__['responseObj'].get("name")
    res.__dict__['responseObj']["name"] = project_name_normalized
    res.__dict__['responseObj']["currentEnvironment"] = ""
    
    generated_paths = os.path.join(os.path.dirname(os.getcwd()), 'generated_projects')
    res.__dict__['responseObj']["path"] = os.path.join(generated_paths, res.__dict__['responseObj'].get("name"))
    
    # if data["name"] in get_all_projects().keys():
    #     raise Exception("Application name should be unique.")
    
    if logo_file:
        logo_file_id = upload_file(data["name"], logo_file)
        data["logoId"] = logo_file_id
    else:
        res.__dict__['responseObj']["logoId"] = None
    if res.__dict__['responseObj'].get('logo'):
        del res.__dict__['responseObj']['logo']
    return res
