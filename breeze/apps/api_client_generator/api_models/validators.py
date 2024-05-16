def required_validator(name, value):
    if value is None:
        return "Value is required"
        # raise ValueError({"key" : name, "message" : "value is required"})
