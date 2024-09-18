from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def manage_resource(request):
    return ""