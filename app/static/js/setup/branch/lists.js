$(document).ready(function(){
    var Branch = {
        Init: function(config){
            this.config = config;
            this.BindEvents();
        },
        BindEvents: function(){
            var $this = this.config;
                // $this.btn_view_more_student.on('click', {param:1}, this.ViewMoreStudents);
                // $this.btn_view_more_school.on('click', {param:1}, this.ViewMoreSchools);
                $this.tbl_branch.on('click', '.btn-edit',{param: 2}, this.OpenModal);
                $this.tbl_branch.on('click', '.lbl-switch',{param: 1}, this.UpdateStatus);                
                $this.btn_save.on('click', {param: 1}, this.Save);
                $this.btn_search.on('click', {param:1}, this.Search);
                $this.btn_new.on('click', {param:1}, this.OpenModal);
                $this.in_search.on('keypress', {param:3}, this.Search);
                $this.in_address.on('keypress', {param:3}, this.Save);
                $this.in_contactno.on('keypress', {param:3}, this.Save);
                $this.modal_form_branch.find('[name=in-name]').on('keypress', {param: 3}, this.Save);
                $this.btn_clear.on('click', this.ClearFields);
                Branch.OnLoadPage();
        },
        OnLoadPage(){
           
            var $self = Branch.config;
                console.log('Branch')

                toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                }); 

                                  
                Branch.Gallery(1);
               
        },        

        Clear: function(e){
            var $route  = (typeof e == 'object') ? e.data.param : e,
                $self   = Branch.config;

                switch($route){
                    case 1: //clear  filter and table
                            $self.in_search.val('');
                            $self.in_search.focus();
                            $self.tbl_branch.empty();
                    break;
                    case 2: //clear on modal close
                            $self.modal_form_branch[0].reset();
                            $self.btn_save.removeAttr('data-branch-id');
                    break;     
                }
                

        },
        Gallery: function(e, data){
            var $self = Branch.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

                switch($route){
                    case 1:

                            // $data = $self.form_search.serializeArray();
                            // $data.push({name:'addedby_user_id', value: $userlogin_id});

                            // console.log($data); return;
                            Branch.CallAjax('/bo/gallery/list/',  null, 4, 'GET');

                    break;
                    case 2:
                            // console.log(data); return;
                            var len = data.length, txt="";
                            $self.sel_clone_gallery.empty();    
                            if(len > 0){
                                txt += `<option value="">Select Photo</option>`;
                                for(i=0;i<len;i++){
                                    txt += `<option value="${data[i].gallery_id}">${data[i].gallery_name}</option>`;
                                            
                                }
                            }else{
                                txt += `<option>No record found</option>`;
                            }
                            if(txt !=''){
                                $self.sel_clone_gallery.append(txt);    
                                $self.sel_clone_gallery.find('option').clone().appendTo( $self.sel_gallery );                            
                            }
                            $self.in_search.focus();  
                            
                    break;
                    case 3:
                            if(e.keyCode == '13'){
                                $self.btn_search.click();
                                e.preventDefault();
                            }
                    break;
                }
        },	        
        Search: function(e, data){
            var $self = Branch.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

                switch($route){
                    case 1:

                            $data = $self.form_search.serializeArray();
                            // $data.push({name:'addedby_user_id', value: $userlogin_id});

                            // console.log($data); return;
                            Branch.CallAjax('/bo/branch_transaction/',  $data, 1, 'GET');

                    break;
                    case 2:
                            // console.log(data); return;
                            var len = data.length, txt="";
                            $self.tbl_branch.empty();    
                            if(len > 0){
                                for(i=0;i<len;i++){
                                    $badge        = (data[i]['reference_tablestatus_fk'] == "1") ? 'bg-success' : 'bg-danger';
                                    $disabled     = (data[i]['reference_tablestatus_fk'] == "1") ? '' : 'disabled';
                                    $checked      = (data[i]['reference_tablestatus_fk'] == "1") ? 'checked' : '';

                                    let $branchAdd = $.trim(data[i]['branch_address']),
                                        $contact  = $.trim(data[i]['branch_contactno']);

                                    txt += `<tr id="${data[i]['branch_id']}">
                                                <td class="col">${data[i]['branch_code']}</td>
                                                <td class="col">${data[i]['branch_name']}</td>
                                                <td class="col">${($branchAdd == "" || $branchAdd == 'null') ? '' : $branchAdd}</td>
                                                <td class="col">${($contact == "" || $contact == 'null') ? '' : $contact}</td>
                                                <td class="col" scope="row" data-label="STATUS">
                                                    <span class="badge ${ $badge }">${ data[i]['reference_tablestatus_fk__reference_longdesc']}</span>
                                                </td>                                                
                                                <td scope="row" data-label="ACTION" class="col">
                                                    <label class="switch ">
                                                        <input type="checkbox" ${ $checked } class="lbl-switch" data-statusid="${data[i]['reference_tablestatus_fk']}">
                                                        <span class="slider round"></span>
                                                    </label>
                                                    <button class="btn btn-edit"
                                                        data-branch-id="${ data[i]['branch_id'] }"
                                                        data-branch-name="${ data[i]['branch_name'] }"
                                                        data-gallery-fk="${ data[i]['gallery_fk'] }"
                                                        ${ $disabled }
                                                    >
                                                        <i class="fa fa-edit fa-lg"></i>
                                                    </button>                                            
                                                </td>
                                            </tr>`;
                                }
                            }else{
                                txt +=`<tr class="tr-default">
                                            <td colspan="6">Empty Record. Click button to search.</td>
                                        </tr>`;
                            }
                            if(txt !=''){
                                $self.tbl_branch.append(txt);    
                            }
                    break;
                    case 3:
                            if(e.keyCode == '13'){
                                $self.btn_search.click();
                                e.preventDefault();
                            }
                    break;
                }
        },
        Save: function(e, data){
            var $route      = (typeof e == 'object') ? e.data.param : e,
                $self       = Branch.config,
                $userlogin_id = $.trim($self.content_wrapper.attr('data-userlogin-id'));
                

                switch($route){
                    case 1:
                            const $in_name = $self.modal_form_branch.find('[name=in-name]'),
                                  $in_address = $self.modal_form_branch.find('[name=in-address]'),
                                  $in_contact = $self.modal_form_branch.find('[name=in-contactno]');

                            
                            if ($.trim($in_name.val()).length === 0) {
                               
                                toast.fire({
                                    icon: 'warning',
                                    title: `&nbsp; Branch name is required.`
                                })             
                                $in_name.val('');
                                $in_name.focus();                     
                                return false;
                            }

                            if ($.trim($in_address.val()).length === 0) {
                                
                                toast.fire({
                                    icon: 'warning',
                                    title: `&nbsp; Branch Address is required.`
                                })               
                                $in_address.val('');
                                $in_address.focus();                   
                                return false;
                            }

                            if ($.trim($in_contact.val()).length === 0) {
                                
                                toast.fire({
                                    icon: 'warning',
                                    title: `&nbsp; Branch Contact is required.`
                                })                
                                $in_contact.val('');
                                $in_contact.focus();                  
                                return false;
                            }

                            $branch_id = ($self.btn_save.attr('data-action') == 'update') ? $self.btn_save.attr('data-branch-id') : '';
                            $data = $self.modal_form_branch.serializeArray();

                            iziToast.show({ 
                                theme: 'dark',
                                icon: 'icon-person',
                                title: 'System Message!',
                                message: 'Are you sure you want to save this transaction ?',
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
                                        $gallery_fk = $self.sel_gallery.find('option:selected').val();

                                        if ($self.btn_save.attr('data-action') == 'update') {
                                            $data.push(
                                                {name:'branch_id', value: $branch_id}
                                               ,{name:'branch_name', value: $.trim($in_name.val())}
                                               ,{name: 'branch_address', value: $.trim($in_address.val())}
                                               ,{name: 'branch_contactno', value: $.trim($in_contact.val())}
                                               ,{name:'gallery_fk', value: $gallery_fk}
                                               ,{name:'updatedby_user_id', value: $userlogin_id}
                                               ,{name:'flag', value: 1}
                                           );                                             
                                            Branch.CallAjax(`/bo/branch/${$branch_id}/`, $data , 2, 'PUT');
                                        }else{
                                            $data.push(
                                                {name:'branch_name', value: $.trim($in_name.val())}
                                               ,{name:'gallery_fk', value: $gallery_fk}
                                               ,{name: 'branch_address', value: $.trim($in_address.val())}
                                               ,{name: 'branch_contactno', value: $.trim($in_contact.val())}
                                               ,{name:'addedby_user_id', value: $userlogin_id}
                                            );                                            
                                            Branch.CallAjax('/bo/branch_transaction/', $data , 2, 'POST');
                                        }
                                        
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
                    case 2:
                            let row="";
                            // $self.tbl_branch.empty();    

                            if (data['is_success'] == 0) {
                                toast.fire({
                                    icon: 'warning',
                                    title: `&nbsp; ${data['result']}.`
                                })                                
                                return;
                            }

                            if (data['is_success'] == 1) {
                                if ($self.btn_save.attr('data-action') == 'create') {
                                    $badge =(data['reference_tablestatus_fk'] == "1") ? 'bg-success' : 'bg-danger';
                                    $disabled =(data['reference_tablestatus_fk'] == "1") ? '' : 'disabled';
                                    $checked =(data['reference_tablestatus_fk'] == "1") ? 'checked' : '';
                                    $status =(data['reference_tablestatus_fk'] == "1") ? 'Active' : 'Inactive';

                                    row = `
                                        <tr class="striped" id="${ data['branch_id']}">
                                            <td class="col">${data['branch_code']}</td>
                                            <td class="col" data-label="NAME">${ data['branch_name']}</td>
                                            <td class="col" >${ data['branch_address']}</td>
                                            <td class="col" >${ data['branch_contactno']}</td>
                                            <td class="col" data-label="STATUS">
                                                <span class="badge ${ $badge }">${ $status }</span>
                                            </td>
                                            <td class="col" data-label="ACTION">
                                                <label class="switch ">
                                                    <input type="checkbox" ${ $checked } class="lbl-switch" data-statusid="${data['reference_tablestatus_fk']}">
                                                    <span class="slider round"></span>
                                                </label>
                                                <button class="btn btn-edit"
                                                    data-branch-id="${ data['branch_id']}"
                                                    data-branch-name="${ data['branch_name']}"
                                                    data-gallery-fk="${ data['gallery_fk']}"
                                                    ${ $disabled }
                                                >
                                                    <i class="fa fa-edit fa-lg"></i>
                                                </button>                                            
                                            </td>
                                        </tr>   
                                    `; 
                                    
                                    $self.tbl_branch.empty();
                                    $self.tbl_branch.prepend(row);
                                }
                            
                                if ($self.btn_save.attr('data-action') == 'update') {
                                    $tr           = $self.tbl_branch.find('tr#' + data['branch_id']);
                                    $td           = $tr.find('td');
                                    $td_last      = $tr.find('td:last');

                                    $td.eq(1).html( data['branch_name'] );
                                    $td.eq(2).html( data['branch_address']);
                                    $td.eq(3).html( data['branch_contactno']);
                                    $td_last.find('button.btn-edit').attr('data-branch-name', data['branch_name']);
                                    $td_last.find('button.btn-edit').attr('data-gallery-fk', data['gallery_fk']);

                                }                            

                                toast.fire({
                                    icon: 'success',
                                    title: `&nbsp; ${data['result']}.`
                                })

                                Branch.CloseModal(1);
                            }
                    break;
                    case 3:
                            if (e.keyCode == '13') {
                                e.preventDefault();
                                $self.btn_save.click();
                                return;
                            } 
                    break;                    
                }
        },
        UpdateStatus: function(e, data){
            var $route      = (typeof e == 'object') ? e.data.param : e,
                $self       = Branch.config,
                $userlogin_id = $.trim($self.content_wrapper.attr('data-userlogin-id'));

                switch($route){
                    case 1:
                            $statusid = ($.trim($(this).attr('data-statusid')) == '1') ? 2 : 1;
                            $branch_id = $(this).closest('tr').attr('id');

                            $data = $self.form_search.serializeArray();
                            $data.push(
                                 {name:'branch_id', value: $branch_id}
                                ,{name:'reference_tablestatus_fk', value: $statusid}
                                ,{name:'updatedby_user_id', value: $userlogin_id}
                                ,{name:'flag', value: 2}
                            );                            
                            Branch.CallAjax(`/bo/branch/${$branch_id}/`, $data , 3, 'PUT');                           
                    break;
                    case 2:
                            if (data['is_success'] == '0') {
                                toast.fire({
                                    icon: 'warning',
                                    title: `&nbsp; ${data[0]['result']}`
                                })                                
                                return;
                            }

                            $icon         = (data['reference_tablestatus_fk'] == '1') ? 'success' : 'warning';
                            $badge        = (data['reference_tablestatus_fk'] == '1') ? 'bg-success' : 'bg-danger';
                            $badge_remove = (data['reference_tablestatus_fk'] == '1') ? 'bg-danger' : 'bg-success';
                            $status       = (data['reference_tablestatus_fk'] == '1') ? 'Active' : 'Inactive';

                            $tr           = $self.tbl_branch.find('tr#' + data['branch_id']);
                            $td           = $tr.find('td');
                            $td_last      = $tr.find('td:last');

                            $td.eq(4).find('span').text( $status );
                            $td.eq(4).find('span').removeClass($badge_remove);
                            $td.eq(4).find('span').addClass($badge);

                            if (data['reference_tablestatus_fk'] == '1') {
                                $td_last.find('button.btn-edit').removeAttr('disabled');
                                
                            }else{
                                $td_last.find('button.btn-edit').prop('disabled', true);
                            }

                            $td_last.find('input.lbl-switch').attr('data-statusid', data['reference_tablestatus_fk']);
                            $td_last.find('input.lbl-switch').removeAttr('disabled');

                            toast.fire({
                                icon: $icon,
                                title: `&nbsp; ${$status}`
                            })
                    break;
                }
        },                
        OpenModal: function(e){
            var $self = Branch.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

                switch($route){
                    case 1: 
                            setTimeout(function() { $self.modal_form_branch.find('[name=in-name]').focus(); }, 500);
                            Branch.Clear(2);
                            $self.sel_gallery.empty();    
                            $self.sel_clone_gallery.find('option').clone().appendTo( $self.sel_gallery );                                                        
                            $self.btn_save.attr('data-action', 'create');
                            $self.modal_branch.find('.modal-title > span').text('Create Branch');
                            
                    break;
                    case 2:
                            e.preventDefault();
                            $self.sel_gallery.empty();    
                            $self.sel_clone_gallery.find('option').not(':first').clone().appendTo( $self.sel_gallery );									
                            $self.sel_gallery.val($(this).attr('data-gallery-fk'));
                            $self.btn_save.attr('data-branch-id', $(this).attr('data-branch-id') );
                            $self.btn_save.attr('data-gallery-fk', $(this).attr('data-gallery-fk') );
                            $self.btn_save.attr('data-action', 'update');
                            $self.modal_form_branch.find('[name=in-name]').val( $(this).attr('data-branch-name'))
                            $self.modal_form_branch.find('[name=in-address]').val($.trim($(this).closest('tr').find('td').eq(2).text()));
                            $self.modal_form_branch.find('[name=in-contactno]').val($.trim($(this).closest('tr').find('td').eq(3).text()));
                            $self.modal_branch.find('.modal-title > span').text('Update Branch');
                    break;                     
                }

                $self.modal_branch.modal('show');
        },
        ClearFields: (e) => {
            const $self = Branch.config;
                $self.in_search.val('');
                $self.tbl_branch.empty();
                $self.tbl_branch.append(`<tr class="tr-default">
                                            <td colspan="6">Empty Record. Click button to search.</td>
                                        </tr>`);
        },
        CloseModal: function(e){
            var $route  = (typeof e == 'object') ? e.data.param : e,
                $self   = Branch.config;

                switch($route){
                    case 1:
                            $self.modal_branch.modal('hide');
                    break;
                    
                }
                
        },
        CallAjax: function(url, data, route, method_type){
            var $self       = Branch.config, timer, data_object = {},
                $base_host  = $.trim($self.content_wrapper.attr('data-host')),
                $url        =  $base_host + url;

                // console.log($url)
            $.ajax({
                type: method_type,
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

                    switch(route){
                        case 2: 
                                // $self.spinner_border.removeClass('hidden');
                        break;
                    }                    
                },
                complete: function(){
                    clearTimeout(timer);
                    $("body").removeClass("loading"); 

                    switch(route){
                        case 2: 
                                // $self.spinner_border.addClass('hidden');
                        break;
                    }                    
                },                
                success: function(evt){ 
                    console.log(typeof(evt));
                    if(evt){
                        switch(route){
                            case 1: Branch.Search(2, evt); break; 
                            case 2: Branch.Save(2, evt); break; 
                            case 3: Branch.UpdateStatus(2, evt); break; 
                            case 4: Branch.Gallery(2, evt); break; 
                        }    
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log('error: ' + textStatus + ': ' + errorThrown);
                }
            }); 
        }//end sa callajax 
    }
    Branch.Init({
             content_wrapper            : $('.content-wrapper')
            ,btn_clear                  : $("#btn-clear")
            ,btn_view_more_student      : $('#btn-view-more-student')
            ,btn_view_more_school       : $('#btn-view-more-school')
            ,modal_branch               : $('#modal-branch')
            ,modal_form_branch          : $('#modal-form-branch')
            ,btn_close_modal            : $('#btn-close-modal')
            ,tbl_branch                 : $('#tbl-branch')
            ,tbl_schools                : $('#tbl-schools')
            ,student_table              : $('#student-table')
            ,school_table               : $('#school-table')
            ,title_school               : $('#title-school')
            ,title_student              : $('#title-student')
            ,form_search                : $('#form-search')
            ,in_address                 : $("#in-address")
            ,in_contactno               : $("#in-contactno")
            ,in_search                  : $('#in-search')
            ,btn_search                 : $('#btn-search')
            ,btn_new                    : $('#btn-new')
            ,btn_save                   : $('#btn-save')
            ,nav_search                 : $('#nav-search')
            ,sel_gallery                : $('#sel-gallery')
            ,sel_clone_gallery          : $('#sel-clone-gallery')
    });
});