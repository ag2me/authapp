$(document).ready(function(){

    var Layout = {
        Init: function(config){
            this.config	= config;
            this.BindEvents();
        },
        BindEvents: function(){
            var $this = this.config;

                $this.tbody.on('click','tr',{param:1},                      this.AddRowHighlight);
                $this.href_logout.on('click',{param:1},                     this.Logout);
                $this.ul_nav_holder.on('click','.second-level',{param:1},   this.SubNavigation);
                $this.ul_nav_holder.on('click','.third-level',{param:1},    this.SubSubNavigation);
                $this.sel_nav_branch.on('change',{param:1},                 this.ChangeDefaultBranch);
                
                Layout.OnLoadPage();
               
        },
        OnLoadPage: () => {
            var $self = Layout.config;
         
                Layout.Select2Initialize();              
                Layout.Navigation(1);
                Layout.Branch(1);
        },
        ChangeDefaultBranch: (e) =>{
            let $self = Layout.config;
            let $formdata = $self.form_dummy.serializeArray();

            $formdata.push({name:'DefaultBranchID', value: e.target.value })

            const $serialize_data = new Common();

            $payload = { url : '/branch/navigation/', method_type : 'PUT', payload : $serialize_data.objectifyForm($formdata), is_loading: false }
            const $common = new Common($payload);
            $common.ApiData()
            .then(data => {
                console.log(data)
                location.reload();
            })
            .catch(err => {
                console.log('err',err)
            })            
        },        
        Branch: (e, data) => {
            let $self = Layout.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            const $result = new Common();                

            switch($route){
                case 1:
                        let $params = new URLSearchParams();
                        let $url_param = '/branch/navigation/?' + $params;    				

                        $payload = {url : $url_param,method_type : 'GET'}
            
                        const $common = new Common($payload)
            
                        $common.ApiData()
                        .then(data => {
                            Layout.Branch(2, data);
                        })
                        .catch(err => {
                            console.log('err',err)
                        }) 
                break;
                case 2:
                        $self.sel_nav_branch.empty(); 
                        if(data.code != 200){
                            $result.IziToast(4, data.message);
                            return;
                        }

                    let $records = data.data, $txt = '';
                    
                        $records.forEach($row => { 
                            let $is_selected = ($.trim($self.content_wrapper.attr('data-branch-id')) === $.trim($row.BranchID)) ? 'selected' : '';
                            $txt += `<option value="${ $row.BranchID }" data-code="${ $row.BranchCode }" ${ $is_selected }>${ $row.BranchName }</option>`;
                        });    
                                                                           
                        $self.sel_nav_branch.append($txt);
                break;
            }
        },
        Logout: function(e){
            var $route      = (typeof e == 'object') ? e.data.param : e, 
                $self       = Layout.config,
                $url       = $(this).attr('data-href'),
                $base_host  = $.trim($self.content_wrapper.attr('data-host'));

                switch($route){
                    case 1:
                            iziToast.show({
                                theme: 'dark',
                                icon: 'icon-person',
                                title: 'System Message!',
                                message: 'Are you sure you want to logout?',
                                position: 'center',
                                progressBarColor: 'rgb(0, 255, 184)',
                                zindex: 1051,
                                timeout: 20000,
                                close: false,
                                overlay: true,
                                drag: false,
                                displayMode: 'once',
                                buttons: [
                                    ['<button>Ok</button>', function (instance, toast) {
                                        window.location.replace($base_host + $url);
                                        iziToast.destroy();
                                    }, true], // true to focus
                                    ['<button>Close</button>', function (instance, toast) {
                                        instance.hide({
                                            transitionOut: 'fadeOutUp',
                                            onClosing: function(instance, toast, closedBy){ console.info('closedBy: ' + closedBy); }
                                        }, toast, 'buttonName');
                                    }]
                                    ],
                                    onOpening: function(instance, toast){ console.info('callback abriu!'); },
                                    onClosing: function(instance, toast, closedBy){ console.info('closedBy: ' + closedBy); }
                            });                            
                            
                    break;
                }
        },
        Select2Initialize : function(){
            var $self = Layout.config;

                $self.select2.select2();
                $self.select2.select2({
                    theme: 'bootstrap4'                    
                });
        },
        Navigation: function(e, data){
            var $route      = (typeof e == 'object') ? e.data.param : e, 
                $self       = Layout.config,
                $base_host  = $.trim($self.content_wrapper.attr('data-host'));
                const $result = new Common(); 
                switch($route){
                    case 1:
                            $data = $self.form_nagivation.serializeArray();                           
                            
                            $data.push(
                                 {name: 'ModuleParentID', value: '0'}
                                ,{name: 'SystemID', value: $result.GetQueryStringValue().sid}
                            );

                            Layout.NavAjax('/navigation/list/', $data , 1); 
                    break;
                    case 2: 
                            data = data['result'];

                            if (data[0]['IsSuccess'] == '0') {
                                return;
                            }                    

                            var len = data.length, txt = "", cnt = 1;

                            $self.ul_nav_holder.empty();  
                            
                            if(len > 0){

                                for(var i=0;i<len;i++){

                                    $submenu = ( data[i].ModuleSubMenu == '1' ) ? `<i class="right fas fa-angle-left"></i>` : '';

                                    var $system_module = data[i].ModuleController;

                                    if( data[i].ModuleController == null ){
                                        $link = '#';
                                    }
                                    else{
                                        $link = $base_host+'/' + $system_module + '?mid=' + data[i].ModuleID  + '&mdesc=' + data[i].ModuleDescription + '&sid=' + data[i].SystemID;
                                    }

                                    if( data[i].ModuleSubMenu == '1' ){
                                        $second_level   = `second-level`;

                                    }
                                    else{
                                        $second_level   = ``;
                                    }

                                    txt += `
                                            <li class="nav-item ${$second_level}" 
                                                data-module-desc="${data[i].ModuleDescription}"
                                                data-module-parentid="${data[i].ModuleID}"
                                            >
                                                <a href="${$link}" class="nav-link">
                                                    <i class="nav-icon far fa-circle text-info"></i>
                                                    <p>${data[i].ModuleName}</p>
                                                    ${$submenu}
                                                </a>
                                                
                                            </li>
                                    `;                            
                                }
                                if(txt != ""){ 
                                    $self.ul_nav_holder.append(txt); 
                                }

                                $mid = $.trim($self.content_wrapper.attr('data-mid'));
                                $self.ul_nav_holder.find('li').each(function(index, value) {
                                    $module_parentid = $.trim($(this).attr('data-module-parentid'));
                                    if ( $module_parentid == $mid){
                                        $(this).find('a').addClass('active');
                                    }
                                });  
                                
                                $smid = $.trim( $self.content_wrapper.attr('data-smid') );

                                if ($smid != '') {
                                    $self.ul_nav_holder.find('li.second-level').each(function(index, value) {
                                        $second_level_parentid = $.trim($(this).attr('data-module-parentid'));
                                        if ( $second_level_parentid == $smid){
    
                                            Layout.SubNavigation(3, {smid: $smid});

                                        }
                                    });
                                }
                                
                                $self.sp_module_title.text( $self.content_wrapper.attr('data-mdesc') );
                            }
                            


                    break;
                }
        }, 
        SubNavigation: function(e, data){
            var $route      = (typeof e == 'object') ? e.data.param : e, 
                $self       = Layout.config,
                $base_host  = $.trim($self.content_wrapper.attr('data-host'));
                const $result = new Common(); 
                switch($route){
                    case 1: 
                            if( !$(this).hasClass('menu-open') ){

                                $data = $self.form_nagivation.serializeArray();                           
                                
                                $data.push(
                                    {name: 'ModuleParentID', value: $(this).attr('data-module-parentid')}
                                    ,{name: 'SystemID', value: $result.GetQueryStringValue().sid}
                                );

                                Layout.NavAjax('/navigation/list/', $data , 2);
                            
                            }                    

                    break;
                    case 2: 
                            data = data['result'];

                            if (data[0]['IsSuccess'] == '0') {
                                return;
                            }                    
                   
                            

                            var len = data.length, txt = "", cnt = 1;

                            $self.ul_nav_holder.find('.second-level > ul').empty();  
                            
                            if(len > 0){
                                
                                txt += `<ul class="nav nav-treeview">`;

                                for(var i=0;i<len;i++){

                                    $submenu = ( data[i].ModuleSubMenu == '1' ) ? `<i class="right fas fa-angle-left"></i>` : '';

                                    if( data[i].ModuleController == null ){
                                        $link = '#';
                                    }
                                    else{
                                        $link = $base_host+'/' + data[i].ModuleController + '?mid=' + data[i].ModuleID + '&smid=' + data[0]['SecondLevelModuleParentID']  + '&mdesc=' + data[i].ModuleDescription + '&sid=' + data[i].SystemID;
                                    }

                                    if( data[i].ModuleSubMenu == '1' ){
                                        $third_level   = `third-level`;

                                    }
                                    else{
                                        $third_level   = ``;
                                    }

                                    txt += `
                                            <li class="nav-item ${$third_level}" 
                                                data-module-desc="${data[i].ModuleDescription}"
                                                data-module-parentid="${data[i].ModuleID}"
                                                data-second-level-module-parentid="${data[0]['SecondLevelModuleParentID']}"
                                            >
                                                <a href="${$link}" class="nav-link">
                                                    <i class="nav-icon far fa-circle text-warning"></i>
                                                    <p>${data[i].ModuleName}</p>
                                                    ${$submenu}
                                                </a>
                                            </li>                                            
                                    `;                            

                                }
                                txt += `</ul>`;

                                if(txt != ""){ 
                                    $mid = $.trim($self.content_wrapper.attr('data-mid'));
                                    $self.ul_nav_holder.find('li.second-level').each(function(index, value) {
                                        $second_level_parentid = $.trim($(this).attr('data-module-parentid'));
                                        if ( $second_level_parentid == data[0]['SecondLevelModuleParentID']){

                                            $(this).append(txt);
                                            $(this).addClass('menu-is-opening menu-open'); 
                                            

                                            $(this).find('ul > li').each(function(index, value) { 
                                                console.log($(this).attr('data-module-parentid') +'-'+$mid)
                                                if ($.trim($(this).attr('data-module-parentid')) == $mid) {
                                                    $(this).find('a').addClass('active');    
                                                }
                                            }); 

                                        }
                                    });                                     

                                    

                                }

                                $self.sp_module_title.text( $self.content_wrapper.attr('data-mdesc') );
                                
                            }


                    break;
                    case 3: 
                            if( !$(this).hasClass('menu-open') ){

                                $data = $self.form_nagivation.serializeArray();                           
                                
                                $data.push(
                                    {name: 'ModuleParentID', value: data['smid']}
                                    ,{name: 'Flag', value: '1'}
                                );

                                Layout.NavAjax('/navigation/list/', $data , 2);
                            
                            }                    

                    break;                    
                }
        },
        SubSubNavigation: function(e, data){
            var $route      = (typeof e == 'object') ? e.data.param : e, 
                $self       = Layout.config,
                $base_host  = $.trim($self.content_wrapper.attr('data-host'));
                const $result = new Common(); 
                switch($route){
                    case 1: 
                            if( !$(this).hasClass('menu-open') ){
                                $data = $self.form_nagivation.serializeArray();                           
                                        
                                $data.push(
                                    {name: 'ModuleParentID', value: $(this).attr('data-module-parentid')}
                                    ,{name: 'SystemID', value: $result.GetQueryStringValue().sid}
                                );
                                Layout.NavAjax('/navigation/list/', $data , 3); 
                            }                    

                    break;
                    case 2:
                            data = data['result'];

                            if (data[0]['IsSuccess'] == '0') {
                                return;
                            }                    
                            var len = data.length, txt = "", cnt = 1;

                            $self.ul_nav_holder.find('.third-level > ul').empty();  
                            
                            if(len > 0){
                                
                                txt += `<ul class="nav nav-treeview">`;

                                for(var i=0;i<len;i++){

                                    if( data[i].ModuleController == null ){
                                        $link = '#';
                                    }
                                    else{
                                        $link = $base_host+'/' + data[i].ModuleController + '?mid=' + data[i].ModuleID + '&tmid=' + data[0]['ThirdLevelModuleParentID'] + '&sid=' + data[i].SystemID;
                                    }

                                    txt += `
                                            <li class="nav-item"
                                                data-module-desc="${data[i].ModuleDescription}"
                                                data-module-parentid="${data[i].ModuleID}"                                            
                                                data-third-level-module-parentid="${data[0]['ThirdLevelModuleParentID']}"
                                            >
                                                <a href="${$link}" class="nav-link">
                                                    <i class="far fa-dot-circle nav-icon"></i>
                                                    <p>${data[i].ModuleName}</p>
                                                </a>
                                            </li>                                            
                                    `;                            

                                }
                                txt += `</ul>`;

                                if(txt != ""){ 
                                    $self.ul_nav_holder.find('.third-level').append(txt); 
                                    $self.ul_nav_holder.find('.third-level').addClass('menu-is-opening menu-open'); 
                                    
                                }
                            } 
                                                                      
                    break;
                    case 3: 
                            if( !$(this).hasClass('menu-open') ){
                                $data = $self.form_nagivation.serializeArray();                           
                                        
                                $data.push(
                                    {name: 'ModuleParentID', value: data['tmid']}
                                    ,{name: 'Flag', value: '1'}
                                );
                                Layout.NavAjax('/navigation/list/', $data , 3); 
                            }                    

                    break;                    
                }
        },                                        
        AddRowHighlight: function(e, data){
            var $route  = (typeof e == 'object') ? e.data.param : e, 
                $self   = Layout.config;

                switch($route){
                    case 1:
                            $self.tbody.find('tr').removeClass('highlight');
                            $(this).addClass('highlight');
                    break;
                }
        },        			
        NavAjax: function(url, data, route){
            var $self = Layout.config, timer, data_object = {},
                $base_host  = $.trim($self.content_wrapper.attr('data-host')),
                $url        =  $base_host + url;

            $.ajax({
                    type: 'POST',
                    url: $url,
                    data: data,
                    dataType:'json',
                    success: function(evt){ 
                        if(evt){
                            switch(route){
                                case 1: Layout.Navigation(2, evt); break; 
                                case 2: 
                                        $(data).each(function(i, field){
                                            data_object[field.name] = field.value;
                                        });                            

                                        evt['result'][0]['SecondLevelModuleParentID'] = data_object['ModuleParentID'];
                                        Layout.SubNavigation(2, evt); 
                                break; 
                                case 3: 
                                        $(data).each(function(i, field){
                                            data_object[field.name] = field.value;
                                        });                            

                                        evt['result'][0]['ThirdLevelModuleParentID'] = data_object['ModuleParentID'];                                
                                        Layout.SubSubNavigation(2, evt); 
                                break; 
                            }    
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        console.log('error: ' + textStatus + ': ' + errorThrown);
                    }
                }); 
        },//end sa NavAjax	
        CallAjax: function(url, data, route){
            var $self = Layout.config, timer, data_object = {},
                $base_host  = $.trim($self.content_wrapper.attr('data-host')),
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
                        500);                    
                        //DISABLE BUTTON
                    },
                    complete: function(){
                        clearTimeout(timer);
                        $("body").removeClass("loading"); 
                        //ENABLE BUTTON
                    },                
                    success: function(evt){ 
                        if(evt){
                            switch(route){
                                // case 1: Layout.Navigation(2, evt); break; 

                            }    
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        console.log('error: ' + textStatus + ': ' + errorThrown);
                    }
                }); 
        }//end sa CAllAjax	        
    }
    
    Layout.Init({
         tbody           : $('tbody')
        ,href_logout     : $('#href-logout')
        ,form_nagivation : $('#form-nagivation')
        ,sel_nav_branch  : $('#sel-nav-branch')
        ,sp_module_title : $('#sp-module-title')
        ,select2         : $('.select2')
        ,select2bs4      : $('.select2bs4')
        ,ul_nav_holder   : $('.ul-nav-holder')
        ,content_wrapper : $('.content-wrapper')        
        ,form_dummy      : $('.form-dummy')        
    });


});


