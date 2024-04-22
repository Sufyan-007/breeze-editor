def required_validator(name, value):
    if value is None:
        raise ValueError(f"values for {name!r}  is required")
