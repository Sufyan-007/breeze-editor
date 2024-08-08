import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .app_startup_manager import RUNNING_APPS


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

    def project_progress(self, event):
        self.send(text_data=json.dumps({"progress": event["message"]}))

    def app_status(self, event):
        self.send(text_data=json.dumps({"status": event["message"]}))
