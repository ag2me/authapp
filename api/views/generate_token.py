from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from api.helpers.authentication import LegacyJWTAuthentication


class User:
    def __init__(self, data):
        self.id = data['id']
        self.username = data['username']

@api_view(['POST'])
def authenticate_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')

        if not username:
            raise Exception('username is required')

        if not password:
            raise Exception('password is required')        
        
        user = LegacyJWTAuthentication()
        user_info = user.authenticate(username=username, password=password)

        if user_info is None:
            raise Exception('Invalid credentials')
                
        data = user_info[0]['data'][0]

        myuser_info = User({'id': data['ProfileID'], 'username': data['UserLoginName']})

        access_token = AccessToken.for_user(myuser_info)
        refresh_token = RefreshToken.for_user(myuser_info)

        return Response({
            'access_token': str(access_token),
            'refresh_token': str(refresh_token),
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'code' : status.HTTP_401_UNAUTHORIZED,
            'message' : str(e)
            }, status=status.HTTP_401_UNAUTHORIZED) 

@api_view(['POST'])
def get_new_token(request):
    try:
        # Assume access token is expired
        # Get the refresh token from the request
        access_token = request.data.get('access_token')
        refresh_token = request.data.get('refresh_token')

        if refresh_token is None:
            raise Exception('refresh token is required')
        
        # Create a RefreshToken instance from the refresh token
        refresh_token = RefreshToken(refresh_token)

        # Generate a new access token
        access_token = str(refresh_token.access_token)

        # Return the new access token to the client
        return Response({
            'access_token': access_token,
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'code' : status.HTTP_401_UNAUTHORIZED,
            'message' : str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)                
