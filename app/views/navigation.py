from django.http import HttpResponse, JsonResponse
from django.views.generic import (View)

from app.helpers.common import Repeated
from app.helpers.dbs import DB

import json

class NavigationList(View):
    def post(self, request):
        try:
            db = DB()                
            context, list_data = {}, {}

            data = json.dumps(request.POST)
            context = json.loads(data)
            context['ModuleParentID'] = Repeated.empty_to_null(request.POST.get('ModuleParentID'))   
            context['UserLoginID'] = request.session.get('UserLoginID')   
            context['BranchID'] = request.session.get('DefaultBranchID')   
            # context['SystemID'] = request.session.get('SystemID')   
            context['SystemID'] = request.POST.get('SystemID')
            context['Flag'] = 1
            # context['Flag'] = Repeated.empty_to_null(request.POST.get('Flag'))   
            context['SPName'] = 'navigation' 

            list_data = db.profiles(context)

            if len(list_data):
                return JsonResponse({'result':list_data}, safe = False) 
            else:
                return JsonResponse({'result':[Repeated.no_record()]}) 

        except Exception as ex:
            return HttpResponse(ex)
        
  




     
