import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .app_startup_manager import RUNNING_APPS
from ..utils.custom_upload_status_tracker import send_ws_status_periodically

class EchoConsumer(WebsocketConsumer):
    def connect(self):
        print("=====socket connection established========")
        self.accept()

    def disconnect(self, close_code):
        print("=====socket disconnected========")
        pass

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        self.group_name = text_data_json["project_id"]
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
        message_type = text_data_json.get("command")

        file_id = text_data_json.get("file_id")
        if message_type == "start":
            async_to_sync(self.channel_layer.group_send)(
                self.group_name,
                {
                    "type": "project_progress",
                    "message": 5,
                },
            )
        elif message_type == "status":
            async_to_sync(self.channel_layer.group_send)(
                self.group_name,
                {
                    "type": "app_status",
                    "message": {
                        "project_id": self.group_name,
                        "status": RUNNING_APPS.get(self.group_name, {}).get(
                            "status", "Fetching Status"
                        ),
                    },
                },
            )  
        elif message_type == "external_comp_status":
            async_to_sync(self.channel_layer.group_send)(
                self.group_name,
                {
                    "type":"file_status", 
                    "message":{
                        "file_id":file_id,
                        "status":"Loading"
                    }
                }
            )
            send_ws_status_periodically(self.group_name)
            
    def project_progress(self, event):
        self.send(text_data=json.dumps({"progress": event["message"]}))

    def app_status(self, event):
        self.send(text_data=json.dumps({"status": event["message"]}))
        
    def file_status(self, event):
        self.send(text_data= json.dumps( 
               { "file_status": event["message"]}
            ))
