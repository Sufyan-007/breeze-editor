class CustomizedAttr:
    def __init__(self, type, validators=()):
        self.type = type
        self.validators = validators

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, instance, owner):
        if not instance:
            return self
        return instance.__dict__[self.name]

    def __delete__(self, instance):
        del instance.__dict__[self.name]

    def __set__(self, instance, value):
        if self.name == 'errors':
            value = instance.errors
        if 'errors' not in instance.__dict__:
                instance.__dict__['errors'] = {}
                
                
        if value and not isinstance(value, self.type):
                instance.add_error(self.name, f"values must be of type {self.type!r}")
                return
            
        for validator in self.validators:
                err_val = validator( self.name, value)
                if err_val:
                    instance.add_error(self.name, err_val)
            
        instance.__dict__[self.name] = value
        
        
            