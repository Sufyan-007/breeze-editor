class CustomizedAttr:
     def __init__(self, type, validators=()):
          self.type = type
          self.validators = validators

     def __set_name__(self, owner, name):
          self.name = name

     def __get__(self, instance, owner):
          if not instance: return self
          return instance.__dict__[self.name]

     def __delete__(self, instance):
          del instance.__dict__[self.name]

     def __set__(self, instance, value):
          if value and not isinstance(value, self.type):
               raise TypeError(f"{self.name!r} values must be of type {self.type!r}")
          for validator in self.validators:
            validator(self.name, value)
          instance.__dict__[self.name] = value
