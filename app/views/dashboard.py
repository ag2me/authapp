from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

from django.shortcuts import redirect
from django.views.generic import (TemplateView)

# from app.libraries.profile_lib import Profile

import json


class View(TemplateView):
    template_name='dashboard/app.html'

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
    def customer_address(request):
        result_data = {}        
        try:

            return Response(result_data, status=status.HTTP_201_CREATED)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        

