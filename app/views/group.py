from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

from django.shortcuts import redirect
from django.views.generic import (TemplateView)

from app.libraries.stored_procedure_lib import SP

import json
import datetime

class View(TemplateView):
    template_name='setup/group/group.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['IsLogin'] = self.request.session['IsLogin']
        return context

    def get(self, request, *args, **kwargs):
        IsLogin = request.session.get('IsLogin', 0)

        if IsLogin == False:
            return redirect('/')        
        else:    
            return super().get(request, *args, **kwargs)    

class Transact(viewsets.ViewSet):
    '''
        Author: Armando Garing II
        Date Created: January 01, 2023
        Purpose: Responsible for all transaction
    '''     
    @staticmethod
    def search_main_group(request):
        result_data, context = {}, {}
        try:
            sp = SP()
            desc = request.GET.get('desc', '')
            flag = request.GET.get('flag', '')
            context['Flag'] = flag
            context['MainGroupName'] = desc
            context['SPName'] = 'usermaingroup'            
            result_data = sp.profile(context)
            return Response(result_data, status=status.HTTP_201_CREATED)
        except:
            result_data['message'] = 'Error on search main group view'
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def search_group(request):
        result_data, context = {}, {}
        try:
            sp = SP()
            desc = request.GET.get('desc', '')
            flag = request.GET.get('flag', '')
            mgid = request.GET.get('mgid', '')
            context['Flag'] = flag
            context['GroupName'] = desc
            context['MainGroupID'] = mgid
            context['SPName'] = 'usergroup'            
            result_data = sp.profile(context)
            return Response(result_data, status=status.HTTP_201_CREATED)
        except:
            result_data['message'] = 'Error on search group view'
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def search_group_member(request):
        result_data, context = {}, {}
        try:
            sp = SP()
            desc = request.GET.get('desc', '')
            flag = request.GET.get('flag', '')
            mgid = request.GET.get('mgid', '')
            gid = request.GET.get('gid', '')
            uid = request.GET.get('uid', '')
            context['Flag'] = flag
            context['ProfileName'] = desc
            context['MainGroupID'] = mgid
            context['GroupID'] = gid
            context['UserLoginID'] = uid
            context['SPName'] = 'usergroupmember'            
            result_data = sp.profile(context)
            return Response(result_data, status=status.HTTP_201_CREATED)
        except:
            result_data['message'] = 'Error on search group view'
            return Response({}, status=status.HTTP_400_BAD_REQUEST)                        

    @staticmethod
    def transaction_main_group(request):
        context, result_data = {}, {}
        try:
            sp = SP()
            data = json.dumps(request.data)
            context = json.loads(data)

            context['TransactBy'] = request.session.get('UserLoginID') 
            context['SPName'] = 'usermaingroup' 

            result_data = sp.profile(context)
            return Response(result_data, status=status.HTTP_201_CREATED)        
        except:
            result_data['message'] = 'Error on add transaction main group view'
            return Response(result_data, status=status.HTTP_400_BAD_REQUEST)             

    @staticmethod
    def transaction_group(request):
        context, result_data = {}, {}
        try:
            sp = SP()
            data = json.dumps(request.data)
            context = json.loads(data)

            context['TransactBy'] = request.session.get('UserLoginID') 
            context['SPName'] = 'usergroup' 

            result_data = sp.profile(context)
            return Response(result_data, status=status.HTTP_201_CREATED)        
        except:
            result_data['message'] = 'Error on add transaction group view'
            return Response(result_data, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def transaction_group_member(request):
        context, result_data = {}, {}
        try:
            sp = SP()
            data = json.dumps(request.data)
            context = json.loads(data)

            context['TransactBy'] = request.session.get('UserLoginID') 
            context['SPName'] = 'usergroupmember' 

            result_data = sp.profile(context)
            return Response(result_data, status=status.HTTP_201_CREATED)        
        except:
            result_data['message'] = 'Error on add transaction group view'
            return Response(result_data, status=status.HTTP_400_BAD_REQUEST)                         
