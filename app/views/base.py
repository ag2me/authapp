from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

from django.shortcuts import redirect

# from app.libraries.profile_lib import Profile
from app.libraries.stored_procedure_lib import SP

import json


class Transact(viewsets.ViewSet):
    '''
        Author: Armando Garing II
        Date Created: Dec. 26, 2022
        Purpose: Responsible for all transaction
    '''     

    @staticmethod
    def branch(request):
        context, result_data = {}, {}
        try:
            sp = SP()
            data = json.dumps(request.data)
            context = json.loads(data)

            context['EntityNameID'] = request.session.get('EntityNameID')   
            context['Flag'] = 1  
            context['SPName'] = 'branch'
            result_data = sp.profile(context)
            return Response(result_data, status=status.HTTP_201_CREATED)        
        except:
            result_data['message'] = 'Error on branch view'
            return Response(result_data, status=status.HTTP_400_BAD_REQUEST)               

    @staticmethod
    def change_branch_session(request):
        context, result_data = {}, {}        
        try:
            data = json.dumps(request.data)
            context = json.loads(data)

            del request.session['DefaultBranchID']
            request.session['DefaultBranchID'] = context['DefaultBranchID']

            return Response(context, status=status.HTTP_201_CREATED)            
        except:
            result_data['message'] = 'Error on change_default_branch view'
            return Response(result_data, status=status.HTTP_400_BAD_REQUEST)

        

