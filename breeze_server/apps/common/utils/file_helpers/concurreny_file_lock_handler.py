import json
import os
import threading
from django.dispatch import Signal

# Signals for write events
write_started = Signal()
write_completed = Signal()

# Global state object and write queue
write_queue = {}

# Lock for thread safety in concurrent environments
queue_lock = threading.Lock()

def add_to_queue(file_id):
    with queue_lock:
        write_queue[file_id] = threading.Event()

def remove_from_queue(file_id):
    with queue_lock:
        if file_id in write_queue:
            write_queue[file_id].set()
            del write_queue[file_id]

def wait_for_write(file_id):
    with queue_lock:
        if file_id in write_queue:
            write_queue[file_id].wait()
