
#descriptor
class ApplyValidation:
    def __init__(self,validators):
        self.validators = validators
       
    def __set_name__(self,owner,name):
        self.name =  name
        
    
    def __set__(self,obj,value):
        if('isError' not in obj.__dict__ and 'responseObj' not in obj.__dict__ and 'errorObj' not in obj.__dict__):
            obj.__dict__['isError'] = False
            obj.__dict__['responseObj'] = {}
            obj.__dict__['errorObj'] ={}
        if (self.name not in obj.__dict__['errorObj']):
            obj.__dict__['errorObj'][self.name] = []
        for validator in self.validators:
            error = validator(value)
            print(error)
            if not error:
                obj.__dict__['responseObj'][self.name] = value
                obj.__dict__['errorObj'][self.name].append('valid')
            else:
                obj.__dict__['isError'] = True
                obj.__dict__['errorObj'][self.name].append(error)
    def __get__(self,obj,objtype = None):
        return getattr(obj,self.name)