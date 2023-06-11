from rest_framework import viewsets, status
from rest_framework.response import Response

from django.core.validators import validate_email
from django.conf import settings

from app.helpers.dbs import DB
from api.libraries.user_lib import User
from app.helpers.app_exception import AppException
from system_settings.constant import NO_RECORD_FOUND

import json
import datetime

class Transact(viewsets.ViewSet):
    '''
        Author: Armando Garing II
        Date Created: June 9, 2023
        Purpose: Responsible for all transaction
    '''    
    @staticmethod
    def signup(request):
        result_data, context = {}, {}

        try:
            user = User()
            data = json.dumps(request.data)
            context = json.loads(data)

            username = context.get('username')
            email = context.get('email')
            password = context.get('password')

            if not username or username.strip() == '':
                raise Exception('username is required and cannot be empty')
            if not email or email.strip() == '':
                raise Exception('email is required and cannot be empty')            
            if not password or password.strip() == '':
                raise Exception('password is required and cannot be empty')
         
            validate_email(email)
            result_data = user.signup(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)

    @staticmethod
    def login(request):
        result_data, context, result_data['data'],  contacttext  = {}, {}, {}, {}

        try:
            db = DB()
            data = json.dumps(request.data)
            context = json.loads(data)

            username = context.get('username')
            password = context.get('password')

            if not username or username.strip() == '':
                raise Exception('username is required and cannot be empty')
            if not password or password.strip() == '':
                raise Exception('password is required and cannot be empty')
            
            context['UserLogin'] = username
            context['UserPassword'] = settings.DB_PREFIX + password  
            context['Flag'] = 1  
            context['SystemCode'] = settings.SYSTEM_CODE
            context['SPName'] = 'verifylogin' 
            
            result_data = db.profiles(context)

            if result_data and int(result_data[0].get('IsSuccess', 0)) == 1:
                form = result_data[0]
                form['IsLogin'] = True
                request.session.flush()

                for key, value in form.items():
                    if isinstance(value, datetime.date):
                        value = str(value)
                    request.session[key] = value

                return Response(result_data, status=status.HTTP_200_OK)
            else:
                request.session.flush()
                raise Exception(NO_RECORD_FOUND)


        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)   

    @staticmethod
    def create_permission(request):
        context, result_data = {}, {}
        try:
            user = User()    
            data = json.dumps(request.data)
            context = json.loads(data)

            result_data = user.create_permission(context)

            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)   

    @staticmethod
    def available_permissions(request):
        context, result_data = {}, {}
        try:
            user = User()
            search = request.GET.get('search', '')
            context['search'] = search
            result_data = user.available_permissions(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)     

    @staticmethod
    def available_permission(request, **kwargs):
        context, result_data = {}, {}
        try:
            id = kwargs.get('id')
            user = User()
            context['UserGroupID'] = id
            result_data = user.available_permission(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)     

    @staticmethod
    def create_role(request):
        context, result_data = {}, {}
        try:
            user = User()
            data = json.dumps(request.data)
            context = json.loads(data)
            result_data = user.create_role(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)  

    @staticmethod
    def available_roles(request):
        context, result_data = {}, {}
        try:
            user = User()
            search = request.GET.get('search', '')
            context['search'] = search
            result_data = user.available_roles(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED) 

    @staticmethod
    def assign_permission(request, **kwargs):
        context, result_data = {}, {}
        try:
            id = kwargs.get('id')
            user = User()
            data = json.dumps(request.data)
            context = json.loads(data)            
            context['UserLoginID'] = id
            result_data = user.assign_permission(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)                               
        
    @staticmethod
    def add_role(request, **kwargs):
        context, result_data = {}, {}
        try:
            id = kwargs.get('id')
            user = User()
            data = json.dumps(request.data)
            context = json.loads(data)            
            context['UserLoginID'] = id
            result_data = user.add_role(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)

    @staticmethod
    def list_roles(request, **kwargs):
        context, result_data = {}, {}
        try:
            id = kwargs.get('id')
            user = User()
            context['UserLoginID'] = id
            result_data = user.list_roles(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)        

    @staticmethod
    def list_permissions(request, **kwargs):
        context, result_data = {}, {}
        try:
            id = kwargs.get('id')
            user = User()
            context['UserLoginID'] = id
            result_data = user.list_permissions(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)                                                       

    @staticmethod
    def users_list(request):
        context, result_data = {}, {}
        try:
            user = User()
            search = request.GET.get('search', '')
            context['search'] = search
            result_data = user.users_list(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)         

    @staticmethod
    def create_module(request):
        context, result_data = {}, {}
        try:
            user = User()
            data = json.dumps(request.data)
            context = json.loads(data)
            result_data = user.create_module(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)   

    @staticmethod
    def available_modules(request):
        context, result_data = {}, {}
        try:
            user = User()
            search = request.GET.get('search', '')
            context['search'] = search
            result_data = user.available_modules(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)               

    @staticmethod       
    def create_system(request):
        context, result_data = {}, {}
        try:
            user = User()
            data = json.dumps(request.data)
            context = json.loads(data)
            result_data = user.create_system(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)   

    @staticmethod    
    def available_systems(request):
        context, result_data = {}, {}
        try:
            user = User()
            search = request.GET.get('search', '')
            context['search'] = search
            result_data = user.available_systems(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)  

    @staticmethod       
    def create_branch(request):
        context, result_data = {}, {}
        try:
            user = User()
            data = json.dumps(request.data)
            context = json.loads(data)
            result_data = user.create_branch(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)

    @staticmethod                     
    def available_branches(request):
        context, result_data = {}, {}
        try:
            user = User()
            search = request.GET.get('search', '')
            context['search'] = search
            result_data = user.available_branches(context)
            return Response(result_data, status=status.HTTP_200_OK)  
        except AppException as e:
            return Response({
                'code' : e.code,
                'message' : e.message
                }, status=e.code) 
        except Exception as e:
            return Response({
                'code' : status.HTTP_401_UNAUTHORIZED,
                'message' : str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)            