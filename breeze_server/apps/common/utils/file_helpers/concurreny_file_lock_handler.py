import threading
from django.dispatch import Signal

# Signals for write events
write_started = Signal()
write_completed = Signal()

# write queue
write_queue = {}

# Lock for thread safety in concurrent environments
queue_lock = threading.Lock()

def add_to_queue(file_id):
    with queue_lock:
        print("Adding file " + file_id + " to the queue...")
        write_queue[file_id] = threading.Event()

def remove_from_queue(file_id):
    if file_id in write_queue:
        print("Removing file " + file_id)
        write_queue[file_id].set()
        del write_queue[file_id]

def wait_for_write(file_id):
    with queue_lock:
        if file_id in write_queue:
            print("Waiting for file " + file_id + " to be written...")
            write_queue[file_id].wait()

def log_write_started(sender, **kwargs):
    file_id = kwargs.get('file_id')
    print(f"Write started for file {file_id}")

def log_write_completed(sender, **kwargs):
    file_id = kwargs.get('file_id')
    print(f"Write completed for file {file_id}")

# Connect the logging functions to signals
# write_started.connect(log_write_started)
# write_completed.connect(log_write_completed)
