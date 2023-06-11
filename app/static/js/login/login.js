$(document).ready(function(){
    var Login = {
        Init: function(config){
            this.config = config;
            this.BindEvents();
        },
        BindEvents: function(){
            var $this = this.config;

            $this.btn_signin.on('click', {param: 1},this.Verify);
            $this.form_login.find('[name=username]').on('keypress', {param: 2}, this.Verify);
            $this.form_login.find('[name=password]').on('keypress', {param: 2}, this.Verify);

            Login.OnLoadPage();
        },
        OnLoadPage: function(){
            var $self = Login.config;

                toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });

                setTimeout(function() { $self.form_login.find('[name=username]').focus(); }, 500);
        },        
        Verify: function(e, data){
            var $self = Login.config,
                $route  = (typeof(e) == 'object') ? e.data.param : e;

                switch($route){
                  case 1:
   
                        $data = $self.form_login.serializeArray();
                        
                        if ($self.form_login.find('[name=username]').val() == '') {
                            $self.form_login.find('[name=username]').focus();
                            toast.fire({
                                icon: 'warning',
                                title: `&nbsp; Username is required.`
                            })
                            return
                        }
                        if ($self.form_login.find('[name=password]').val() == '') {
                            $self.form_login.find('[name=password]').focus();
                            toast.fire({
                                icon: 'warning',
                                title: `&nbsp; Password is required.`
                            })
                            return
                        }
                        let $formdata = $self.form_login.serializeArray();
                        const $serialize_data = new Common();

                        $payload = { url : '/api/login/', method_type : 'POST', payload : $serialize_data.objectifyForm($formdata), element_id : 'btn-signin' }

                        const $common = new Common($payload);

                        $common.ApiData()
                        .then(data => {
                            if (data.status && data.status !== 200) {
                                toast.fire({
                                    icon: 'warning',
                                    title: `&nbsp; No record found`
                                })  
                                $self.btn_signin.find('span').remove();                            
                                return;                                
                            }

                            Login.Verify(3, data);
                        })
                break;
                case 2:
                        if(e.keyCode == '13' ) {
                            e.preventDefault();
                            $self.btn_signin.click();
                        }
                break;
                case 3: 
                        const $url = new Common();
                        $host = $url.URLOrigin();
                        data = data[0];

                        if (parseInt(data['IsSuccess']) == 0) {
                            $self.form_login.find('[name=username]').focus();
                            toast.fire({
                                icon: 'warning',
                                title: `&nbsp; ${data['Result']}`
                            })  
                            $self.btn_signin.find('span').remove();                            
                            return;
                        }
                        window.location.replace($host + '/' + data['ModuleController']);

                break;
            }
        },
        CallAjax: function(url, data, route){
            var $self       = Login.config, timer, data_object = {},
                $base_host  = $.trim($self.login_box.attr('data-host')),
                $url        =  $base_host + url;


            $.ajax({
                    type: 'POST',
                    url: $url,
                    data: data,
                    dataType:'json',
                    beforeSend: function(){
                        timer && clearTimeout(timer);
                        timer = setTimeout(function()
                        {
                            $("body").addClass("loading"); 
                        },
                        1000);                    
                        //DISABLE BUTTON 

                        switch(route){
                            case 1: 
                                    $self.btn_signin.prepend(`<span class="spinner-grow spinner-grow-sm" role="status"></span>`); 
                                    $self.btn_signin.prop('disabled', true); 
                                    $self.form_login.find('[name=username]').prop('disabled', true); 
                                    $self.form_login.find('[name=password]').prop('disabled', true); 
                            break;
                        }
                    },
                    complete: function(){
                        clearTimeout(timer);
                        $("body").removeClass("loading");  
                        //ENABLE BUTTON

                        switch(route){
                            case 1: 
                                    $self.btn_signin.removeAttr('disabled'); 
                                    $self.form_login.find('[name=username]').removeAttr('disabled'); 
                                    $self.form_login.find('[name=password]').removeAttr('disabled');                               
                            break;
                        }                        
                    },                
                    success: function(evt){ 
                        if(evt){
                            switch(route){
                                case 1: 
                                        evt['host'] = $base_host;
                                        Login.Verify(3, evt); 
                                break; 
                            }    
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        console.log('error: ' + textStatus + ': ' + errorThrown);
                    }
                }); 
        }//end sa callajax
    }

    Login.Init({
        title         : $("title"),
        btn_signin    : $('#btn-signin'),
        user_name     : $('#username'),
        user_password : $('#password'),
        error         : $('#error'),
        form_login    : $('#form-login'),
        login_box     : $('.login-box'),
    });

});

