import json
import os
import threading
import time
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from apps.common.constants.consts import CONFIG_PATH
import uuid
channel_layer = get_channel_layer()

thread_ids = {
    
}

def send_ws_status_periodically(project_id):
    resource_config_path = os.path.join(CONFIG_PATH, project_id, "uploaded_resources_config.json")
    
    def send_status():
        try:
            with open(resource_config_path, 'r') as file:
                resource_config = json.load(file)
            
                message = {
                    "file_statuses": {
                        file_id: details.get("status", "Unknown")
                        for file_id, details in resource_config.items()
                        if details.get("tag") == "ZIP"  
                    }
            }
            
                if message["file_statuses"]: 
                    async_to_sync(channel_layer.group_send)(
                        project_id,
                        {
                            "type": "file_status",
                            "message": message
                        }
                    )
                    
        except FileNotFoundError as e:
            print(f"Error: {resource_config_path} file not found.")
            raise e
        except Exception as e:
            print(f"Error sending WebSocket status: {str(e)}")
            raise e

    def periodic_task(t_id):
        while True:
            if thread_ids[t_id]:
                send_status()
                time.sleep(5)
            else:
                del thread_ids[t_id]
                break
            
    t_id =uuid.uuid4()
    thread_ids[t_id] = True
    thread= threading.Thread(target=periodic_task,args=[t_id], daemon=True)
    thread.start()
    return t_id
    
    
