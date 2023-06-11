from rest_framework import status
from app.helpers.dbs import DB


class SP():
    def __init__(self):
        pass

    def profile(self, param):
        result_data = {}

        try:
            db = DB()              

            list_data = db.profiles(param)

            if not list_data:
                result_data['message'] = 'No record found'            
                result_data['code'] = status.HTTP_400_BAD_REQUEST                
            else:    
                result_data['code'] = status.HTTP_200_OK   
                result_data['data'] = list_data                
        except:
            result_data['message'] = 'Error on store procedure'            
            result_data['code'] = status.HTTP_400_BAD_REQUEST
        
        return result_data

                      



