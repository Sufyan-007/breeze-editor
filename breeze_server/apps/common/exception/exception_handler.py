from rest_framework.views import exception_handler
from rest_framework import exceptions
from django.http import JsonResponse

def custom_exception_handler(exc, context):
    
    # Calling REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    # Handle specific exceptions with meaningful messages
    if isinstance(exc, KeyError):
        return JsonResponse({'error': f'A required key {str(exc)} was not found.'}, status=400)
    elif isinstance(exc, exceptions.ValidationError):
        return JsonResponse({'error': 'ValidationError: ' + str(exc)}, status=400)
    elif isinstance(exc, exceptions.ParseError):
        return JsonResponse({'error': 'ParseError: The request could not be parsed.'}, status=400)
    elif isinstance(exc, exceptions.NotFound):
        return JsonResponse({'error': f'NotFound: The requested resource {str(exc)} was not found.'}, status=404)
    elif isinstance(exc, ZeroDivisionError):
        return JsonResponse({'error': 'ZeroDivisionError: Division by zero is not allowed.'}, status=400)
    elif isinstance(exc, ValueError):
        return JsonResponse({'error': 'ValueError: ' + str(exc)}, status=400)
    elif isinstance(exc, TypeError):
        return JsonResponse({'error': 'TypeError: ' + str(exc)}, status=400)
    elif isinstance(exc, AttributeError):
        return JsonResponse({'error': 'AttributeError: An attribute was referenced that does not exist.'}, status=400)
    
    if response is not None:
        return response
    else:
        # If the exception was not handled, return a generic error response
        print(f"Unhandled exception type: {type(exc)}")
        print(f"Exception message: {str(exc)}")
        return JsonResponse({'error': 'An unexpected error occurred: ' + str(exc)}, safe=False, status=500)
