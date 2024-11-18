# The extensions register themselves automatically. 
# Just be sure that the Python interpreter sees them at least once. 
# It is good practice to collect your extensions in YOUR_MAIN_APP_NAME/schema.py

from drf_spectacular.extensions import OpenApiAuthenticationExtension

    
class CustomTokenAuthenticationScheme(OpenApiAuthenticationExtension):
    target_class = 'apps.authentication.core.authentication.CustomTokenAuthentication'
    name = 'TokenAuth'
    
    def get_security_definition(self, auto_schema):        
        return {
            'type': 'http',
            'scheme': 'bearer',
            "name": "Authorizatin",
            "description": "Token-based authentication with required prefix 'Token'"
            }