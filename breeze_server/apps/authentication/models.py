# myapp/models.py
# from django.contrib.auth.models import User
from django.db import models


class Role(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
class UserProfile(models.Model):
    print("sdfsfd")
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128,null=False)
    
    
    created_at = models.DateTimeField(auto_now_add=True)
    phone_number = models.CharField(max_length=15, blank=False, null=False)
    
    # Many-to-many relationship to the Role model
    roles = models.ManyToManyField(Role, related_name="users")
    
    projects = models.JSONField(default=list)
    
    # set_password = models
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    # created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
