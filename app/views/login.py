from django.views.generic import (TemplateView)
from django.shortcuts import redirect

class Login(TemplateView):
    template_name='login/login.html'

def logout(request):
    try:
        request.session.flush()   
    except KeyError:
        pass
    return redirect('/')     