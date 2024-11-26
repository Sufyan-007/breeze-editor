from django.utils.deprecation import MiddlewareMixin
from apps.common.utils.file_helpers.config_tracker import rollback_config_file
from apps.common.utils.file_helpers.config_handler import global_file_change_state

class RollbackMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # Check if the response status indicates an error
        transaction_id = getattr(request, "transaction_id", None)
        if transaction_id:
            if response.status_code >= 400:
                # Rollback only changes related to this transaction
                self.rollback_changes(transaction_id)
            # Clear the transaction state
            else:
                print('everything is working')
            global global_file_change_state
            del global_file_change_state[transaction_id]
        return response

    def rollback_changes(self, transaction_id):
        changed_files = global_file_change_state[transaction_id].get('changed_files')
        if changed_files:
            print("Rolling back changes...")
            for file_obj in list(changed_files.values()):
                try:
                    rollback_config_file(file_obj['project_name'], file_obj['category'], file_obj['filename'], None, True)
                except Exception as e:
                    print(f"Error rolling back file {file_obj.get('filename')}: {e}")
        else:
            print('nothing to rollback')
        