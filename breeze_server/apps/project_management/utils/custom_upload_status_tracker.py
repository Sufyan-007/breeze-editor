import json
import os
import threading
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from apps.common.constants.consts import CONFIG_PATH

channel_layer = get_channel_layer()

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
                print(f"Sent WS status: {message} to project: {project_id}")
        except FileNotFoundError:
            print(f"Error: {resource_config_path} file not found.")
        except Exception as e:
            print(f"Error sending WebSocket status: {str(e)}")

    def periodic_task():
        while True:
            send_status()
            threading.Event().wait(5)  

    threading.Thread(target=periodic_task, daemon=True).start()
