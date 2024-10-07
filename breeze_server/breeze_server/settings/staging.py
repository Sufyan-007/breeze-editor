from pathlib import Path
from breeze_server.settings.common import *
import os
import environ

env = environ.Env()
environ.Env.read_env()  # reads the .env file

    

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("STAGING_SECRET_KEY") 

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("STAGING_DEBUG") 

CORS_ALLOW_ALL_ORIGINS = env.bool("STAGING_CORS_ALLOW_ALL_ORIGINS") 

ALLOWED_HOSTS = env.list("STAGING_ALLOWED_HOSTS") 

ALLOWED_CIDR_NETS = env.list("STAGING_ALLOWED_CIDR_NETS") 
 
CSRF_COOKIE_SECURE = env.bool("STAGING_CSRF_COOKIE_SECURE") 
CORS_ALLOWED_ORIGINS = env.list("STAGING_CORS_ALLOWED_ORIGINS") 
CORS_ALLOW_CREDENTIALS = env.bool("STAGING_CORS_ALLOW_CREDENTIALS") 
DATABASES = {
   'default' : env.json("STAGING_DATABASES") 
}

LANGUAGE_CODE = os.environ.get("STAGING_LANGUAGE_CODE") 
TIME_ZONE = os.environ.get("STAGING_TIME_ZONE") 
USE_I18N = env.bool("STAGING_USE_I18N") 
USE_TZ = env.bool("STAGING_USE_TZ") 
STATIC_URL = os.environ.get("STAGING_STATIC_URL") 


