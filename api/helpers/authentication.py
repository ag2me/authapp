from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from django.conf import settings
from app.libraries.stored_procedure_lib import SP
from system_settings.constant import NO_RECORD_FOUND
import json

class LegacyJWTAuthentication(JWTAuthentication):
    def __init__(self):
        self.user = {}

    def authenticate(self, **param):
        # Call your legacy database stored procedure here to authenticate the user
        # If the user is authenticated, return a tuple of (user, None)
        # If the user is not authenticated, return None        
        result_data, context = {}, {}
        sp = SP()

        context['UserLogin'] = param.get('username')
        context['UserPassword'] = settings.DB_PREFIX + param.get('password')
        context['SystemCode'] = settings.SYSTEM_CODE
        context['Flag'] = 13
        context['SPName'] = 'verifylogin' 

        result_data = sp.profile(context)       

        if not result_data:
            raise Exception(NO_RECORD_FOUND)
        
        if not int(result_data['data'][0]['IsSuccess']):
            raise Exception(NO_RECORD_FOUND)        

        return (result_data, None)        
    
    def check_token(self, request):
        sp = SP()
        result_data, context = {}, {}

        if request.method == 'GET':
            token = request.GET.get('useraccesstoken')
        else:
            data = json.dumps(request.data)
            context = json.loads(data)            
            if 'useraccesstoken' not in context:
                raise Exception('useraccesstoken is required')            
            
            token = request.data['useraccesstoken']
        
        if not token:
            raise Exception('useraccesstoken is required')
        
        access_token = AccessToken(token)
        payload = access_token.payload

        context['ProfileID'] = payload['user_id']
        context['Flag'] = 4
        context['SPName'] = 'userlogin'        
        result_data = sp.profile(context)

        if not result_data:
            return False 
        
        if not int(result_data['data'][0]['IsSuccess']):
            return False 

        self.user = result_data['data'][0]
        
        return True
   

