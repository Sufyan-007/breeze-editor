def required_validator(name, value):
    if value is None:
        raise ValueError({"key" : name, "message" : "value is required"})
