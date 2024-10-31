import os
from apps.common.utils.file_helpers.file_handler import upload_file
from .get_all_projects import get_all_projects

def load_proj_data(proj_data_request):
    data = proj_data_request.POST.dict()
    logo_file = proj_data_request.FILES.get('logo')
    
    # Validate project data
    errors = {field: f"{field.capitalize()} is required." for field in ["name", "author", "technology", "language", "styling", "buildTool"] if not data.get(field)}
    
    if data.get("name"):
        project_name_normalized = data["name"].lower().replace(" ", "_")
        if project_name_normalized in get_all_projects().keys():
            errors["name"] = "Project name must be unique."
    
    if logo_file:
        if logo_file.size > 5 * 1024 * 1024:
            errors["logo"] = "Logo must be smaller than 5MB."
        if not logo_file.content_type.startswith("image/"):
            errors["logo"] = "Logo must be an image."
    
    if errors:
        return {"errors": errors}
    
    data['defaultComponent'] = "Main"
    data["projectName"] = data["name"]
    data["name"] = project_name_normalized
    data["currentEnvironment"] = ""
    
    generated_paths = os.path.join(os.path.dirname(os.getcwd()), 'generated_projects')
    data["path"] = os.path.join(generated_paths, data["name"])
    
    # if data["name"] in get_all_projects().keys():
    #     raise Exception("Application name should be unique.")
    
    if logo_file:
        logo_file_id = upload_file(data["name"], logo_file)
        data["logoId"] = logo_file_id
    else:
        data["logoId"] = None
    if data.get('logo'):
        del data['logo']
    return data
