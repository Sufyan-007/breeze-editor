from django.utils.deprecation import MiddlewareMixin
from apps.common.utils.file_helpers.config_tracker import rollback_config_file
from apps.common.utils.file_helpers.config_handler import global_file_change_state

class RollbackMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # Check if the response status indicates an error
        if response.status_code >= 400:
            # Here, you can implement your rollback logic
            # Assuming you have a function that handles rollback
            self.rollback_changes()
        else:
            print('everything is working')
        global global_file_change_state
        global_file_change_state = {'changed_files': {}}
        return response

    def rollback_changes(self):
        # Implement your rollback logic here
        changed_files = global_file_change_state.get('changed_files')
        if changed_files:
            print("Rolling back changes...")
            for file_obj in list(changed_files.values()):
                rollback_config_file(file_obj.project_name, file_obj.category, file_obj.filename, None, True)
        else:
            print('nothing to rollback')
        
        
        