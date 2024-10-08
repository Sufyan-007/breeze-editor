import os

if os.environ.get('RUN_MAIN' ):
    from .utils.get_all_projects import get_all_projects
    from .communication.app_startup_manager import start_app
    projects = get_all_projects()
    for project in projects.values():
        start_app(project)