import uuid

def generate_uuid_as_key():
    id = str(uuid.uuid4())
    return id.replace("-","_")