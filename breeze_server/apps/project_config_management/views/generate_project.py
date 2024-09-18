from apps.code_generator.app_generation_handlers import AppGenerator

def generate_project(project_config, logo=None):
    app_generator = AppGenerator(project_config['name'], logo)
    app_generator.generate_app()