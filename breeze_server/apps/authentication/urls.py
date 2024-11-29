from django.urls import path
from .views import log_in_out, register, user

urlpatterns = [
    path('register/', register.register, name='register'),
    path('login/', log_in_out.login, name='login'),
    path('logout/', log_in_out.logout, name='logout'),
    path('get-user/<str:param>/', user.get_user, name='get_user'),
    
    path('get-user/', user.get_user, name='get_all_users'),
    
    path('refreshtoken/',register.generate_access_token, name = 'refreshtoken'),
]