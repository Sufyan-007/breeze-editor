from .core.generate_project import GenerateProject
from .core.app_startup_manager import start_app
projects = GenerateProject.get_projects()
print(projects)
for project in projects.values():
    start_app(project)