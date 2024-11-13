def set_unresolved_keys(all_schemas):
    def check_nested_schema(properties):
        for k, v in properties.items():
            if "types" in v:
                for item in v["types"]:
                    if item.get("type") == "object":
                        return True
            if "properties" in v and isinstance(v["properties"], dict):
                if check_nested_schema(v["properties"]):
                    return True
        return False

    for key, value in all_schemas.items():
        if "properties" in value and isinstance(value["properties"], dict):
            if check_nested_schema(value["properties"]):
                all_schemas[key]["isUnresolved"] = True

    return all_schemas