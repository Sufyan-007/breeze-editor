import uuid

def generate_uuid_as_key():
    unique_id = str(uuid.uuid4())
    return unique_id.replace("-", "_")