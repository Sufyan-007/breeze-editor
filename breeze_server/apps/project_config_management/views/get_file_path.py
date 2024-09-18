from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def get_file_path(request):
    return ""