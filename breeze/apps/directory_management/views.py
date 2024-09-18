
from rest_framework.views import APIView
from django.http import JsonResponse
import json, uuid , os
from common.utils.app_consts import CONFIG_PATH
from .core.directory_management_service import DirectoryManagementGenerator
