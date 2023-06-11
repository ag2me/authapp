from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

from django.shortcuts import redirect
from django.views.generic import (TemplateView)

from app.libraries.stored_procedure_lib import SP

import json


class View(TemplateView):
    template_name='setup/permission/permission.html'

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
        Date Created: October 16, 2022
        Purpose: Responsible for all transaction
    '''     

    @staticmethod
    def system_allowed(request):
        result_data, context = {}, {}
        try:
            sp = SP()
            desc = request.GET.get('desc', '')
            context['UserLoginID'] = request.session.get('UserLoginID') 
            # context['UserLoginID'] = 1
            # context['BranchID'] = branch_id 
            context['BranchID'] = request.session.get('DefaultBranchID')  
            context['Flag'] = 2
            context['SystemName'] = desc
            context['SPName'] = 'system'            
            result_data = sp.profile(context)
            return Response(result_data, status=status.HTTP_201_CREATED)
        except:
            result_data['message'] = 'Error on system  allowed'
            return Response({}, status=status.HTTP_400_BAD_REQUEST)