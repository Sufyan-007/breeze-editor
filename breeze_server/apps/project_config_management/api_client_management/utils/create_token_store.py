def create_token_store(properties):
    """Helper function to create token store from response schema properties."""
    token_store = {}
    for prop_name, prop_info in properties.items():
        if prop_info.get("type") == 'string':
            token_store[prop_name] = {"store_in": "LOCAL_STORAGE", "storage_key": prop_name}
        elif prop_info.get("types"):
            for type_info in prop_info.get("types"):
                if type_info.get("type") == 'string':
                    token_store[prop_name] = {"store_in": "LOCAL_STORAGE", "storage_key": prop_name}
    return token_store