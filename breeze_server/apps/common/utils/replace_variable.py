def replace_variable(data, variable, value,replace_keys=True):
    if isinstance(data, dict):
        keys_to_replace = []

        for key, val in data.items():
            if isinstance(val, (dict, list)):
                replace_variable(val, variable, value)
            elif isinstance(val, str):
                data[key] = val.replace(variable, value)

            if variable in key:
                keys_to_replace.append(key)

        if replace_keys and keys_to_replace:
            for old_key in keys_to_replace:
                new_key = old_key.replace(variable, value)
                data[new_key] = data.pop(old_key)

    elif isinstance(data, list):
        for item in data:
            if isinstance(item, (dict, list)):
                replace_variable(item, variable, value)