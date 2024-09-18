from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def manage_api_client(request):
    return ""