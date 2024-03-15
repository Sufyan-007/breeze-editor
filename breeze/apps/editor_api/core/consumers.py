import json
from channels.generic.websocket import AsyncWebsocketConsumer

class EchoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("socket connection")
        await self.accept()

    async def disconnect(self, close_code):
        pass
    
    # async def receive(self, text_data=None, bytes_data=None):
    #     await self.send(text_data=json.dumps({
    #         'message': text_data
    #     }))

    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        print("p_id, channel", text_data_json)
        
        message_type = text_data_json.get('command')

        if message_type == 'start':
            self.project_id = text_data_json['project_id']
            print("p_id, channel", self.project_id, self.channel_name)
            # Joining a group named after the project_id
            await self.channel_layer.group_add(
                self.project_id,
                self.channel_name
            )
            print("group created")
            
        elif message_type == 'progress_update':
            # Handle other message types or commands if needed
            pass

    async def send_progress_update(self, event):
        print("event sent")
        # Send a message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))
