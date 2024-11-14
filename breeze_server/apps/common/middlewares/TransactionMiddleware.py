import threading
import uuid
from django.utils.deprecation import MiddlewareMixin
from apps.common.utils.file_helpers.config_handler import global_file_change_state
from apps.common.utils.uuid_as_key import generate_uuid_as_key

# Create thread-local storage for each request
thread_local = threading.local()

def set_transaction_id(transaction_id):
    # Generate a new transaction ID and store it in thread-local storage
    thread_local.transaction_id = transaction_id

def get_transaction_id():
    # Retrieve the transaction ID from thread-local storage
    return getattr(thread_local, 'transaction_id', None)

class TransactionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Generate a unique transaction ID for each request
        transaction_id = generate_uuid_as_key()
        request.transaction_id = transaction_id  # Attach it to the request object for later use
        global global_file_change_state
        global_file_change_state[transaction_id] = {"changed_files": {}}
        set_transaction_id(transaction_id)
