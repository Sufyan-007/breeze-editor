from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()

def store_custom_upload(project_id, file_id, message):
    try:
        async_to_sync(channel_layer.group_send)(
            project_id,
            {
                "type": "file_upload_status",
                "file_id":file_id,
                "message": message
            }
        )
        print(f"File upload progress sent to project {project_id} with {file_id}: {message}")
    except Exception as e:
        print(f"Error sending file upload progress: {str(e)}")
