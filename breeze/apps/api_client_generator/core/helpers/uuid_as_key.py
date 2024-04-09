import uuid

def generate_uuid_as_key():
    uuid = str(uuid.uuid4())
    return uuid.replace("-","_")