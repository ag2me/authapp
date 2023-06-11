from django.urls import path
from api.views import user
app_name = 'api' 

urlpatterns = [
    path('signup/',user.Transact.as_view({'post': 'signup'}), name='signup'),    
    path('login/',user.Transact.as_view({'post': 'login'})),    
    path('permissions/',user.Transact.as_view({'post': 'create_permission','get': 'available_permissions'})),    
    path('roles/',user.Transact.as_view({'post': 'create_role','get': 'available_roles'}), name='roles'),    
    path('users/',user.Transact.as_view({'get': 'users_list'})),    
    path('roles/<int:id>/permissions/',user.Transact.as_view({'post': 'assign_permission','get': 'available_permission'})),    
    path('users/<int:id>/roles/',user.Transact.as_view({'post': 'add_role','get': 'list_roles'})),    
    path('users/<int:id>/permissions/',user.Transact.as_view({'get': 'list_permissions'})),    
    path('modules/',user.Transact.as_view({'post': 'create_module','get': 'available_modules'})),    
    path('systems/',user.Transact.as_view({'post': 'create_system','get': 'available_systems'})),    
    path('branches/',user.Transact.as_view({'post': 'create_branch','get': 'available_branches'})),    
]