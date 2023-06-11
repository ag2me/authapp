from django.urls import path
from app.views import login, navigation, dashboard

app_name = 'app' 

urlpatterns = [
    path('',login.Login.as_view()),
    path('logout/',login.logout, name='logout'),
   
    path('navigation/list/',navigation.NavigationList.as_view(), name='navigation-list'), 
    path('dashboard/',dashboard.View.as_view(), name='dashboard'), 
]