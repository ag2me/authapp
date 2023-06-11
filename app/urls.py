from django.urls import path
from app.views import login, navigation, dashboard, base, group, permission, \
                    roles

app_name = 'app' 

urlpatterns = [
    path('',login.Login.as_view()),
    path('logout/',login.logout, name='logout'),
   
    path('navigation/list/',navigation.NavigationList.as_view(), name='navigation-list'), 
    path('dashboard/',dashboard.View.as_view(), name='dashboard'), 
    # path('dashboard/transact/',dashboard.Transact.as_view({'get': 'customer_address'})),    
    # path('branch/navigation/',base.Transact.as_view({'get': 'branch', 'put': 'change_branch_session'})),    

    # path('user/group/',group.View.as_view()),    
    # path('group/main/transact/',group.Transact.as_view({'get': 'search_main_group','post': 'transaction_main_group'})),    
    # path('group/transact/',group.Transact.as_view({'get': 'search_group','post': 'transaction_group',})),    
    # path('group/member/transact/',group.Transact.as_view({'get': 'search_group_member','post': 'transaction_group_member',})),    


    # path('user/roles/',roles.View.as_view()),    
    # path('user/permission/',permission.View.as_view()),    
    # path('system/search/',system.Transact.as_view({'get': 'system_allowed'})),    
    # path('system/allowed/',system.View.as_view(), name='system-allowed'),        
]