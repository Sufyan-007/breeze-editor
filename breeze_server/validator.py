import re

def validate_file_name(value):
    pass
    
def validate_module_id(value):
    pass 

def validate_api_type(value):
    pass  
def validate_api_data(value):
    pass  

def validate_id(value):
    pass 

def validate_schema_id(value):
    pass 

def validate_title(value):
    pass 
    

def validate_user(value):
    try:
        if len(value) <= 2:
            return "Username length must be greater than 2"
    except TypeError as e:
        return e
        

def validate_password(value):
    if len(value) < 6 or len(value) > 12:
        return "Password length should be between 6 and 12 characters"
    elif not re.search("[a-z]", value):
        return "Password should contain at least one lowercase letter"
    elif not re.search("[A-Z]", value):
        return "Password should contain at least one uppercase letter"
    elif not re.search("[0-9]", value):
        return "Password should contain at least one digit"
    elif not re.search("[$#@]", value):
        return "Password should contain at least one special character among '$', '#', '@'"
    elif re.search(r"\s", value):
        return "Password should not contain any whitespace character"

def validate_email(value):
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
        return "Invalid email address"
    


def validate_path(value):
    pass

def validate_component_id(value):
    pass

def validate_children(value):
    pass

def validate_parent_id(value):
    pass

def validate_props(value):
    pass

def validate_redirect_to(value):
    pass

def validate_hydrate_fall_back_element_id(value):
    pass

def validate_error_element_id(value):
    pass

def validate_loader(value):
    pass

def validate_lazy(value):
    pass

def validate_action(value):
    pass

def validate_should_revalidate(value):
    pass

def validate_case_sensitive(value):
    pass

def validate_index(value):
    pass

def validate_file(value):
    pass

def validate_file_name(value):
    pass

def validate_environment_name(value):
    pass

def validate_string(value):
    if not isinstance(value, str):
        return f'Expected {value!r} to be a str'

def validate_select(value):
    pass

def required_validator(name, value):
    if value is None:
        return "Value is required"
    
def validate_filter(value):
    pass