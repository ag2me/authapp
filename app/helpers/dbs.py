from django.db import connections
from django.http import JsonResponse

from app.helpers.common import Repeated
    
class DB():
    def __init__(self):
        pass
    
    def profiles(self, param):
        try:
            query = "CALL sp_" + param["SPName"] + "(@ReturnIsSuccess,\""+str(param)+"\")"
            print(Repeated.cleanup_query(query))     
            with connections['default'].cursor() as cursor:
                cursor.execute(Repeated.cleanup_query(query))   
                row = Repeated.dictfetchall(cursor)
                cursor.close()
                return row
        except Exception as ex:
            return JsonResponse(ex, safe = False)
      
        



