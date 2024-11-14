from django.views.decorators.csrf import csrf_exempt
from .serializers import get_user_data,get_all_user_data
from rest_framework.decorators import api_view
from django.http import JsonResponse


@csrf_exempt
@api_view(['GET'])
def get_user(request,param=None):
    try:
        # data=request.body
        # print(param)       
        # user_details = get_user_data(param)
        # return JsonResponse({'user_details':user_details}, status=200)
        if param:
            # If param is provided, fetch details for that specific user
            user_details = get_user_data(param)
            return JsonResponse({'user_details': user_details}, status=200)
        else:
            # If param is not provided, fetch details for all users
            all_users = get_all_user_data()  # Define this function to fetch all users
            return JsonResponse({'user_details': all_users}, status=200)
        
    except Exception as e:
        print(str(e))
        return JsonResponse({'error': str(e)}, status=400)
        
    # return ""