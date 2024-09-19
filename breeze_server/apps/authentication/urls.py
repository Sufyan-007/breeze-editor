from django.urls import path
from .views import register, login, user

urlpatterns = [
    path('register/', register.register, name='register'),
    path('login/', login.login, name='login'),
    path('get-user/<str:param>/', user.get_user, name='get_user'),
]