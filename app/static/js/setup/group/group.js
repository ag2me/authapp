$(document).ready(function(){
    var Group = {
        Init: function(config){
            this.config = config;
            this.BindEvents();
        },
        BindEvents: function(){
            var $this = this.config;

            $this.btn_new_main_group.on('click', {param: 1}, this.OpenModal);
            $this.btn_new_group.on('click', {param: 3}, this.OpenModal);
            $this.btn_new_group_member.on('click', {param: 5}, this.OpenModal);
            $this.tbl_display.on('click', '.btn-edit',{param: 2}, this.OpenModal);
            $this.tbl_display.on('click', '.lbl-switch',{param: 1}, this.UpdateStatus);                
            $this.tbl_display_group.on('click', '.btn-edit',{param: 4}, this.OpenModal);            
            $this.tbl_display_group.on('click', '.lbl-switch',{param: 1}, this.UpdateStatusGroup);                            
            $this.btn_save.on('click', {param: 1}, this.Save);
            $this.btn_save_group.on('click', {param: 1}, this.SaveGroup);
            $this.btn_save_group_member.on('click', {param: 1}, this.SaveGroupMember);
            $this.btn_search_main_group.on('click', {param:1}, this.SearchMainGroup);
            $this.btn_search_group.on('click', {param:1}, this.SearchGroup);
            $this.btn_search_group_member.on('click', {param:1}, this.SearchGroupMember);
            $this.btn_clear_main_group.on('click', {param:1}, this.Clear);
            $this.btn_clear_group.on('click', {param:4}, this.Clear);
            $this.in_search_main_group.on('keypress', {param:3}, this.SearchMainGroup);
            $this.in_search_group.on('keypress', {param:3}, this.SearchGroup);
            $this.custom_content_below_main_group_tab.on('click', {param:1}, this.Tab);
            $this.custom_content_below_group_tab.on('click', {param:2}, this.Tab);
            $this.custom_content_below_group_member_tab.on('click', {param:3}, this.Tab);
            $this.sel_main_group_filter.on('change', {param:1}, this.LookupGroup);
            $this.modal_form_group_member.find('[name=MainGroupID]').on('change', {param:1, lookup_type: 'group-member'}, this.LookupGroup);
            $this.check_all_list.on('click', {param: 'chk-login'}, this.togglecheckboxes );
            
            Group.OnPageLoad();
        },
        Message:{
            'input-group-placeholder': 'enter group name'
           ,'input-group-member-placeholder': 'enter group member name'
           ,'input-main-group-placeholder': 'enter main group name'
           ,'main-group-required': 'Main Group Name is required'
           ,'main-group-choose': 'Please choose User Main Group'
           ,'group-required': 'Group Name is required'            
           ,'transaction-warning': 'Are you sure you want to save this transaction?'
           ,'table-select-record': 'Please choose at least one record.'           
        },        
        OnPageLoad: () => {
            var $self = Group.config
            console.log('momo')
            toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            }); 

            Group.Tab(1);
            Group.LookupMainGroup(1);
        },
        Save: (e,data) => {
            var $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            switch($route){
                case 1:
                        if($self.modal_form_main_group.find('[name=MainGroupName]').val().length === 0){
                            $self.modal_form_main_group.find('[name=MainGroupName]').focus();
                            toast.fire({
                                icon: 'warning',
                                title: `&nbsp; ${ Group.Message['main-group-required'] }.`
                            })                        
                            return;   
                        }
                        
                        iziToast.show({ 
                            theme: 'dark',
                            icon: 'icon-person',
                            title: 'System Message!',
                            message: Group.Message['transaction-warning'],
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
                                    let $arr_data = ( $self.btn_save.attr('data-action') == 'new' ) ? ['',2] : [$self.btn_save.attr('data-main-group-id'),3];
                                    let $main_group_id = $arr_data[0];
                                    let $flag = $arr_data[1];
                                    let $formdata = $self.modal_form_main_group.serializeArray();
                                    $formdata.push({name:'MainGroupID', value: $main_group_id })
                                    $formdata.push({name:'Flag', value: $flag })

                                    const $serialize_data = new Common();

                                    $payload = { url : '/group/main/transact/', method_type : 'POST', payload : $serialize_data.objectifyForm($formdata), element_id : 'btn-save' }

                                    const $common = new Common($payload);

                                    $common.ApiData()
                                    .then(data => {
                                        Group.Save(2, data);
                                    })
                                    .catch(err => {
                                        console.log('err',err)
                                    }) 

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
                        if(data.code != 200){
                            toast.fire({
                                icon: 'warning',
                                title: `&nbsp; ${ data.message }.`
                            })                           
                            return;
                        }

                        let $row = data.data[0], $txt = '';
                        let $arr_data = ( parseInt($row.TableStatusID) === 1 ) ? ['bg-success','checked', ''] : ['bg-danger','', 'disabled'];
                        let $label = $arr_data[0];
                        let $is_checked = $arr_data[1];
                        let $is_disabled = $arr_data[2];                    

                        if($self.btn_save.attr('data-action') == 'new'){
                            $self.tbl_display.empty(); 
                            $txt = `
                                <tr id="${ $row.UserMainGroupID }">
                                    <td class="col" data-label="NAME">${ $row.UserMainGroupName }</td>
                                    <td class="col" data-label="DESC">${ $row.UserMainGroupDescription }</td>
                                    <td class="col" data-label="STATUS">
                                        <span class="badge ${ $label }">${ $row.TableStatus }</span>
                                    </td>                                                
                                    <td class="col" data-label="ACTION" >
                                        <label class="switch ">
                                            <input type="checkbox" ${ $is_checked } class="lbl-switch" data-statusid="${ $row.TableStatusID }">
                                            <span class="slider round"></span>
                                        </label>
                                        <button type="button" class="btn btn-edit" data-main-group-name="${ $row.UserMainGroupName }" data-main-group-desc="${ $row.UserMainGroupDescription }" ${ $is_disabled }>
                                            <i class="fa fa-edit fa-lg"></i>
                                        </button>                                            
                                    </td>
                                </tr> 
                                `;

                            $self.tbl_display.append($txt)
                        }

                        if($self.btn_save.attr('data-action') == 'update'){
                            $tr           = $self.tbl_display.find('tr#' + $row.UserMainGroupID);
                            $td           = $tr.find('td');
                            $td_last      = $tr.find('td:last');

                            $td.eq(0).html( $row.UserMainGroupName );
                            $td.eq(1).html( $row.UserMainGroupDescription );
                            $td_last.find('button.btn-edit').attr({
                                 'data-main-group-name': $row.UserMainGroupName
                                ,'data-main-group-desc': $row.UserMainGroupDescription
                            });
                        }

                        toast.fire({
                            icon: 'success',
                            title: `&nbsp; ${ data.Result }`
                        })

                        Group.CloseModal(1);
                break;
                case 3:                    
                        if(e.keyCode == '13' ) {
                            e.preventDefault();
                            $self.btn_save.click();
                        }
                break;
            }

        },
        SaveGroup: (e,data) => {
            var $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            switch($route){
                case 1:
                        if($self.sel_main_group.find('option:selected').val().length === 0){
                            $self.sel_main_group.find('option:selected').focus();
                            toast.fire({
                                icon: 'warning',
                                title: `&nbsp; ${ Group.Message['main-group-choose'] }.`
                            })                        
                            return;   
                        }
                        
                        if($self.modal_form_group.find('[name=GroupName]').val().length === 0){
                            $self.modal_form_group.find('[nameGroupName]').focus();
                            toast.fire({
                                icon: 'warning',
                                title: `&nbsp; ${ Group.Message['group-required'] }.`
                            })                        
                            return;   
                        }

                        iziToast.show({ 
                            theme: 'dark',
                            icon: 'icon-person',
                            title: 'System Message!',
                            message: Group.Message['transaction-warning'],
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
                                    let $arr_data = ( $self.btn_save_group.attr('data-action') == 'new' ) ? ['',2] : [$self.btn_save_group.attr('data-group-id'),3];
                                    let $group_id = $arr_data[0];
                                    let $flag = $arr_data[1];
                                    let $formdata = $self.modal_form_group.serializeArray();
                                    $formdata.push({name:'GroupID', value: $group_id })
                                    $formdata.push({name:'Flag', value: $flag })

                                    const $serialize_data = new Common();

                                    $payload = { url : '/group/transact/', method_type : 'POST', payload : $serialize_data.objectifyForm($formdata), element_id : 'btn-save-group' }

                                    const $common = new Common($payload);

                                    $common.ApiData()
                                    .then(data => {
                                        Group.SaveGroup(2, data);
                                    })
                                    .catch(err => {
                                        console.log('err',err)
                                    }) 

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
                        if(data.code != 200){
                            toast.fire({
                                icon: 'warning',
                                title: `&nbsp; ${ data.message }.`
                            })                           
                            return;
                        }

                        let $row = data.data[0], $txt = '';
                        let $arr_data = ( parseInt($row.TableStatusID) === 1 ) ? ['bg-success','checked', ''] : ['bg-danger','', 'disabled'];
                        let $label = $arr_data[0];
                        let $is_checked = $arr_data[1];
                        let $is_disabled = $arr_data[2];                    

                        if($self.btn_save_group.attr('data-action') == 'new'){
                            $self.tbl_display_group.empty(); 
                            $txt = `
                                <tr id="${ $row.UserGroupID }">
                                    <td class="col" data-label="MAIN GROUP">${ $row.UserMainGroupName }</td>
                                    <td class="col" data-label="GROUP">${ $row.UserGroupName }</td>
                                    <td class="col" data-label="STATUS">
                                        <span class="badge ${ $label }">${ $row.TableStatus }</span>
                                    </td>                                                
                                    <td class="col" data-label="ACTION" >
                                        <label class="switch ">
                                            <input type="checkbox" ${ $is_checked } class="lbl-switch" data-statusid="${ $row.TableStatusID }">
                                            <span class="slider round"></span>
                                        </label>
                                        <button 
                                            type="button" 
                                            class="btn btn-edit" 
                                            data-group-name="${ $row.UserGroupName }" 
                                            data-group-id="${ $row.UserGroupID }" 
                                            data-main-group-id="${ $row.UserMainGroupID }" 
                                            ${ $is_disabled }
                                        >
                                            <i class="fa fa-edit fa-lg"></i>
                                        </button>                                            
                                    </td>
                                </tr> 
                                `;

                            $self.tbl_display_group.append($txt)
                        }

                        if($self.btn_save_group.attr('data-action') == 'update'){
                            $tr           = $self.tbl_display_group.find('tr#' + $row.UserGroupID);
                            $td           = $tr.find('td');
                            $td_last      = $tr.find('td:last');

                            $td.eq(0).html( $row.UserMainGroupName );
                            $td.eq(1).html( $row.UserGroupName );
                            $td_last.find('button.btn-edit').attr({
                                 'data-group-name': $row.UserGroupName
                                ,'data-group-id': $row.UserGroupID
                                ,'data-main-group-id': $row.UserMainGroupID
                            });
                        }

                        toast.fire({
                            icon: 'success',
                            title: `&nbsp; ${ data.Result }`
                        })

                        Group.CloseModal(2);
                break;
                case 3:                    
                        if(e.keyCode == '13' ) {
                            e.preventDefault();
                            $self.btn_save.click();
                        }
                break;
            }

        },
        SaveGroupMember: (e,data) => {
            var $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;            
            const $result = new Common();

                switch($route){
                    case 1:
                            let $main_group_id = $self.modal_form_group_member.find('[name=MainGroupID]').find('option:selected');
                            let $group_id = $self.modal_form_group_member.find('[name=GroupID]').find('option:selected');
                            let $login_data = [];

                            if($main_group_id.val().length === 0){
                                $self.modal_form_group_member.find('[name=MainGroupID]').select2('open');
                                toast.fire({
                                    icon: 'warning',
                                    title: `&nbsp; ${ Group.Message['main-group-required'] }.`
                                })                        
                                return;                                 
                            }

                            if($group_id.val().length === 0){
                                $self.modal_form_group_member.find('[name=GroupID]').select2('open');
                                toast.fire({
                                    icon: 'warning',
                                    title: `&nbsp; ${ Group.Message['group-required'] }.`
                                })                        
                                return;                                 
                            }

                            $self.modal_form_group_member.find('.tbl-display').find('tr').each(function() { 
                                let $login_id = $(this).attr('id');
                                let $td = $(this).find('td');
                                let $last_td = $(this).find('td:last');

                                if( $(this).find('td > input.chk-login').is(':checked') ){
                                    $login_data.push({
                                         'UserLoginID' : $login_id
                                        ,'GroupID' : $group_id.val()
                                        ,'EffectiveDate' : $td.eq(4).find('input').val()
                                        ,'ExpiryDate' : $last_td.find('input').val()
                                    });
                                }
            
                            });

                            if($login_data.length === 0){
                                toast.fire({
                                    icon: 'warning',
                                    title: `&nbsp; ${ Group.Message['table-select-record'] }.`
                                })                        
                                return;                                 
                            }                            

                            let $formdata = $self.modal_form_group_member.serializeArray();
                            $formdata.push({name:'LoginIDs', value: $login_data })
                            $formdata.push({name:'Flag', value: 3 })

                            const $serialize_data = new Common();

                            $payload = { url : '/group/member/transact/', method_type : 'POST', payload : $serialize_data.objectifyForm($formdata), element_id : 'btn-save-group-member' }

                            const $common = new Common($payload);

                            $common.ApiData()
                            .then(data => {
                                Group.SaveGroupMember(2, data);
                            })
                            .catch(err => {
                                console.log('err',err)
                            })                             
                    break;
                    case 2:
                        $self.tbl_display_group_member.empty(); 
                        if(data.code != 200){
                            $result.IziToast(4, data.message);
                            return;
                        }

                        let $records = data.data, $txt = '', $counter=0;
                    
                        if(parseInt(data[0].IsSuccess) === 0){
                            $result.IziToast(4, data.message);
                            return;
                        }

                        $records.forEach($row => { 
                            let $arr_data = ( parseInt($row.TableStatusID) === 1 ) ? ['bg-success','checked', ''] : ['bg-danger','', 'disabled'];
                            let $label = $arr_data[0];
                            let $is_checked = $arr_data[1];
                            let $is_disabled = $arr_data[2];
                            let $expiry_date = $row.ExpiryDateText == null ? '' : $row.ExpiryDateText;

                            $txt += `
                                    <tr id="${ $row.UserGroupMemberID }">
                                        <td class="col" data-label="NAME">${ $row.ProfileName }</td>
                                        <td class="col" data-label="MAIN GROUP">${ $row.UserMainGroupName }</td>
                                        <td class="col" data-label="GROUP">${ $row.UserGroupName }</td>
                                        <td class="col" data-label="LOGIN">${ $row.UserLoginName }</td>
                                        <td class="col" data-label="LOGIN">${ $row.EffectiveDateText }</td>
                                        <td class="col" data-label="LOGIN">${ $expiry_date }</td>
                                        <td class="col" data-label="STATUS">
                                            <span class="badge ${ $label }">${ $row.TableStatus }</span>
                                        </td>                                                
                                        <td class="col" data-label="ACTION" >
                                            <label class="switch ">
                                                <input type="checkbox" ${ $is_checked } class="lbl-switch" data-statusid="${ $row.TableStatusID }">
                                                <span class="slider round"></span>
                                            </label>
                                            <button 
                                                type="button" 
                                                class="btn btn-edit" 
                                                data-group-name="${ $row.UserGroupName }" 
                                                data-group-member-id="${ $row.UserGroupMemberID }" 
                                                data-main-group-id="${ $row.UserMainGroupID }" 
                                                ${ $is_disabled }
                                            >                                            
                                                <i class="fa fa-edit fa-lg"></i>
                                            </button>                                            
                                        </td>
                                    </tr>   
                                `;
                                $counter++;  
                        });    
                                                                           
                        $self.tbl_display_group_member.append($txt);

                        toast.fire({
                            icon: 'success',
                            title: `&nbsp; ${$counter} records found.`
                        })                        

                        Group.CloseModal(3);
                    break;                    
                }                
        },
        UpdateStatus: (e, data) => {
            var $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            switch($route){
                case 1:
                        let $formdata = $self.modal_form_main_group.serializeArray();
                        $formdata.push({name:'MainGroupID', value: e.target.closest('tr').id })
                        $formdata.push({name:'ReferenceTableStatusID', value: e.currentTarget.getAttribute('data-statusid') })
                        $formdata.push({name:'Flag', value: 4 })

                        const $serialize_data = new Common();

                        $payload = { url : '/group/main/transact/', method_type : 'POST', payload : $serialize_data.objectifyForm($formdata), is_loading: false }
                        const $common = new Common($payload);
                        $common.ApiData()
                        .then(data => {
                            Group.UpdateStatus(2, data);
                        })
                        .catch(err => {
                            console.log('err',err)
                        }) 

                break;
                case 2:
                        if(data.code != 200){
                            toast.fire({
                                icon: 'warning',
                                title: `&nbsp; ${ data.message }`
                            })                            
                            return;
                        }
                        let $row = data.data[0];
                        let $arr_data = ( parseInt($row.TableStatusID) === 1 ) ? ['bg-success','success', 'bg-danger'] : ['bg-danger','warning', 'bg-success'];
                        let $badge = $arr_data[0];
                        let $icon = $arr_data[1];
                        let $badge_remove = $arr_data[2];

                        $tr           = $self.tbl_display.find('tr#' + $row.UserMainGroupID);
                        $td           = $tr.find('td');
                        $td_last      = $tr.find('td:last');

                        $td.eq(2).find('span').text( $row.TableStatus );
                        $td.eq(2).find('span').removeClass($badge_remove);
                        $td.eq(2).find('span').addClass($badge);

                        if (parseInt($row.TableStatusID) === 1) {
                            $td_last.find('button.btn-edit').removeAttr('disabled');
                            $self.sel_clone_main_group.append($('<option>', {
                                value: $row.UserMainGroupID,
                                text: $row.UserMainGroupName
                            }));                            
                        }else{
                            $td_last.find('button.btn-edit').prop('disabled', true);
                            $self.sel_clone_main_group.find(`option[value='${ $row.UserMainGroupID }']`).remove();
                        }

                        Group.ResetSelect(1);
                        $td_last.find('input.lbl-switch').attr('data-statusid', $row.TableStatusID);
                        $td_last.find('input.lbl-switch').removeAttr('disabled');

                        toast.fire({
                            icon: $icon,
                            title: `&nbsp; ${ $row.TableStatus }`
                        })
                break;
            }

        },
        UpdateStatusGroup: (e, data) => {
            var $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            switch($route){
                case 1:
                        let $formdata = $self.modal_form_main_group.serializeArray();
                        $formdata.push({name:'GroupID', value: e.target.closest('tr').id })
                        $formdata.push({name:'ReferenceTableStatusID', value: e.currentTarget.getAttribute('data-statusid') })
                        $formdata.push({name:'Flag', value: 4 })

                        const $serialize_data = new Common();

                        $payload = { url : '/group/transact/', method_type : 'POST', payload : $serialize_data.objectifyForm($formdata), is_loading: false }
                        const $common = new Common($payload);
                        $common.ApiData()
                        .then(data => {
                            Group.UpdateStatusGroup(2, data);
                        })
                        .catch(err => {
                            console.log('err',err)
                        }) 

                break;
                case 2:
                        if(data.code != 200){
                            toast.fire({
                                icon: 'warning',
                                title: `&nbsp; ${ data.message }`
                            })                            
                            return;
                        }
                        let $row = data.data[0];
                        let $arr_data = ( parseInt($row.TableStatusID) === 1 ) ? ['bg-success','success', 'bg-danger'] : ['bg-danger','warning', 'bg-success'];
                        let $badge = $arr_data[0];
                        let $icon = $arr_data[1];
                        let $badge_remove = $arr_data[2];

                        $tr           = $self.tbl_display_group.find('tr#' + $row.UserGroupID);
                        $td           = $tr.find('td');
                        $td_last      = $tr.find('td:last');

                        $td.eq(2).find('span').text( $row.TableStatus );
                        $td.eq(2).find('span').removeClass($badge_remove);
                        $td.eq(2).find('span').addClass($badge);

                        if (parseInt($row.TableStatusID) === 1) {
                            $td_last.find('button.btn-edit').removeAttr('disabled');
                            
                        }else{
                            $td_last.find('button.btn-edit').prop('disabled', true);
                        }

                        $td_last.find('input.lbl-switch').attr('data-statusid', $row.TableStatusID);
                        $td_last.find('input.lbl-switch').removeAttr('disabled');

                        toast.fire({
                            icon: $icon,
                            title: `&nbsp; ${ $row.TableStatus }`
                        })
                break;
            }

        },
        SearchMainGroup: (e, data) => {
            let $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            const $result = new Common();                

            switch($route){
                case 1:
                        let $params = new URLSearchParams();

                        $params.append('desc', $.trim($self.in_search_main_group.val()));                          
                        $params.append('flag', 1);                          
                        let $url_param = '/group/main/transact/?' + $params;    				

                        $payload = {url : $url_param,method_type : 'GET'}
            
                        const $common = new Common($payload)
            
                        $common.ApiData()
                        .then(data => {
                            Group.SearchMainGroup(2, data);
                        })
                        .catch(err => {
                            console.log('err',err)
                        }) 
                break;
                case 2:
                        $self.tbl_display.empty(); 
                        if(data.code != 200){
                            $result.IziToast(4, data.message);
                            return;
                        }

                        let $records = data.data, $txt = '', $counter=0;
                    
                        $records.forEach($row => { 
                            let $arr_data = ( parseInt($row.TableStatusID) === 1 ) ? ['bg-success','checked', ''] : ['bg-danger','', 'disabled'];
                            let $label = $arr_data[0];
                            let $is_checked = $arr_data[1];
                            let $is_disabled = $arr_data[2];

                            $txt += `
                                    <tr id="${ $row.UserMainGroupID }">
                                        <td class="col" data-label="NAME">${ $row.UserMainGroupName }</td>
                                        <td class="col" data-label="DESC">${ $row.UserMainGroupDescription }</td>
                                        <td class="col" data-label="STATUS">
                                            <span class="badge ${ $label }">${ $row.TableStatus }</span>
                                        </td>                                                
                                        <td class="col" data-label="ACTION" >
                                            <label class="switch ">
                                                <input type="checkbox" ${ $is_checked } class="lbl-switch" data-statusid="${ $row.TableStatusID }">
                                                <span class="slider round"></span>
                                            </label>
                                            <button type="button" class="btn btn-edit" data-main-group-name="${ $row.UserMainGroupName }" data-main-group-desc="${ $row.UserMainGroupDescription }" ${ $is_disabled }>
                                                <i class="fa fa-edit fa-lg"></i>
                                            </button>                                            
                                        </td>
                                    </tr>   
                                `;
                                $counter++;  
                        });    
                                                                           
                        $self.tbl_display.append($txt);

                        toast.fire({
                            icon: 'success',
                            title: `&nbsp; ${$counter} records found.`
                        })                        
                break;
                case 3:    
                        if(e.keyCode == '13' ) {
                            e.preventDefault();
                            $self.btn_search_main_group.click()
                        }
                break;
            }
        },
        SearchGroup: (e, data) => {
            let $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            const $result = new Common();                

            switch($route){
                case 1:
                        let $params = new URLSearchParams();

                        $params.append('mgid', $.trim($self.sel_main_group_filter.find('option:selected').val()));                          
                        $params.append('desc', $.trim($self.in_search_group.val()));                          
                        $params.append('flag', 1);                          
                        let $url_param = '/group/transact/?' + $params;    				

                        $payload = {url : $url_param,method_type : 'GET'}

                        const $common = new Common($payload)
            
                        $common.ApiData()
                        .then(data => {
                            Group.SearchGroup(2, data);
                        })
                        .catch(err => {
                            console.log('err',err)
                        }) 
                break;
                case 2:
                        $self.tbl_display_group.empty(); 
                        if(data.code != 200){
                            $result.IziToast(4, data.message);
                            return;
                        }

                        let $records = data.data, $txt = '', $counter=0;
                    
                        $records.forEach($row => { 
                            let $arr_data = ( parseInt($row.TableStatusID) === 1 ) ? ['bg-success','checked', ''] : ['bg-danger','', 'disabled'];
                            let $label = $arr_data[0];
                            let $is_checked = $arr_data[1];
                            let $is_disabled = $arr_data[2];

                            $txt += `
                                    <tr id="${ $row.UserGroupID }">
                                        <td class="col" data-label="MAIN GROUP">${ $row.UserMainGroupName }</td>
                                        <td class="col" data-label="GROUP">${ $row.UserGroupName }</td>
                                        <td class="col" data-label="STATUS">
                                            <span class="badge ${ $label }">${ $row.TableStatus }</span>
                                        </td>                                                
                                        <td class="col" data-label="ACTION" >
                                            <label class="switch ">
                                                <input type="checkbox" ${ $is_checked } class="lbl-switch" data-statusid="${ $row.TableStatusID }">
                                                <span class="slider round"></span>
                                            </label>
                                            <button 
                                                type="button" 
                                                class="btn btn-edit" 
                                                data-group-name="${ $row.UserGroupName }" 
                                                data-group-id="${ $row.UserGroupID }" 
                                                data-main-group-id="${ $row.UserMainGroupID }" 
                                                ${ $is_disabled }
                                            >                                            
                                                <i class="fa fa-edit fa-lg"></i>
                                            </button>                                            
                                        </td>
                                    </tr>   
                                `;
                                $counter++;  
                        });    
                                                                           
                        $self.tbl_display_group.append($txt);

                        toast.fire({
                            icon: 'success',
                            title: `&nbsp; ${$counter} records found.`
                        })                        
                break;
                case 3:    
                        if(e.keyCode == '13' ) {
                            e.preventDefault();
                            $self.btn_search_group.click()
                        }
                break;
            }
        },
        SearchGroupMember: (e, data) => {
            let $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            const $result = new Common();                

            switch($route){
                case 1:
                        let $params = new URLSearchParams();
                        let $gid = $self.form_group_member.find('[name=GroupName]').find('option:selected').val() == undefined ? '' : $self.form_group_member.find('[name=GroupName]').find('option:selected').val();
                        
                        $params.append('mgid', $self.form_group_member.find('[name=MainGroupName]').find('option:selected').val());                          
                        $params.append('gid', $gid);                          
                        $params.append('desc', $.trim($self.in_search_group_member.val()));                          
                        $params.append('flag', 1);                          
                        let $url_param = '/group/member/transact/?' + $params;    				

                        $payload = {url : $url_param,method_type : 'GET'};

                        const $common = new Common($payload)
            
                        $common.ApiData()
                        .then(data => {
                            Group.SearchGroupMember(2, data);
                        })
                        .catch(err => {
                            console.log('err',err)
                        }) 
                break;
                case 2:
                        $self.tbl_display_group_member.empty(); 
                        if(data.code != 200){
                            $result.IziToast(4, data.message);
                            return;
                        }

                        let $records = data.data, $txt = '', $counter=0;
                    
                        $records.forEach($row => { 
                            let $arr_data = ( parseInt($row.TableStatusID) === 1 ) ? ['bg-success','checked', ''] : ['bg-danger','', 'disabled'];
                            let $label = $arr_data[0];
                            let $is_checked = $arr_data[1];
                            let $is_disabled = $arr_data[2];
                            let $expiry_date = $row.ExpiryDateText == null ? '' : $row.ExpiryDateText;

                            $txt += `
                                    <tr id="${ $row.UserGroupMemberID }">
                                        <td class="col" data-label="NAME">${ $row.ProfileName }</td>
                                        <td class="col" data-label="MAIN GROUP">${ $row.UserMainGroupName }</td>
                                        <td class="col" data-label="GROUP">${ $row.UserGroupName }</td>
                                        <td class="col" data-label="LOGIN">${ $row.UserLoginName }</td>
                                        <td class="col" data-label="LOGIN">${ $row.EffectiveDateText }</td>
                                        <td class="col" data-label="LOGIN">${ $expiry_date }</td>
                                        <td class="col" data-label="STATUS">
                                            <span class="badge ${ $label }">${ $row.TableStatus }</span>
                                        </td>                                                
                                        <td class="col" data-label="ACTION" >
                                            <label class="switch ">
                                                <input type="checkbox" ${ $is_checked } class="lbl-switch" data-statusid="${ $row.TableStatusID }">
                                                <span class="slider round"></span>
                                            </label>
                                            <button 
                                                type="button" 
                                                class="btn btn-edit" 
                                                data-group-name="${ $row.UserGroupName }" 
                                                data-group-member-id="${ $row.UserGroupMemberID }" 
                                                data-main-group-id="${ $row.UserMainGroupID }" 
                                                ${ $is_disabled }
                                            >                                            
                                                <i class="fa fa-edit fa-lg"></i>
                                            </button>                                            
                                        </td>
                                    </tr>   
                                `;
                                $counter++;  
                        });    
                                                                           
                        $self.tbl_display_group_member.append($txt);

                        toast.fire({
                            icon: 'success',
                            title: `&nbsp; ${$counter} records found.`
                        })                        
                break;
                case 3:    
                        if(e.keyCode == '13' ) {
                            e.preventDefault();
                            $self.btn_search_group.click()
                        }
                break;
            }
        },
        SearchLogin: (e, data) => {
            let $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            const $result = new Common();                

            switch($route){
                case 1:
                        let $params = new URLSearchParams();

                        $params.append('flag', 2);                          
                        let $url_param = '/group/member/transact/?' + $params;    				

                        $payload = {url : $url_param,method_type : 'GET', is_loading: false};

                        const $common = new Common($payload)
            
                        $common.ApiData()
                        .then(data => {
                            Group.SearchLogin(2, data);
                        })
                        .catch(err => {
                            console.log('err',err)
                        }) 
                break;
                case 2:
                        $self.modal_form_group_member.find('.tbl-display').empty(); 
                        if(data.code != 200){
                            $result.IziToast(4, data.message);
                            return;
                        }

                        let $records = data.data, $txt = '', $counter=0;
                    
                        $records.forEach($row => { 
                            $txt += `
                                    <tr id="${ $row.UserLoginID }">
                                        <td class="w-5" scope="col" data-label="CHECK">
                                            <input type="checkbox" class="chk-login pointer" name="chk-login" value="${ $row.UserLoginID }">
                                        </td>
                                        <td scope="col" data-label="NAME">${ $row.ProfileName }</td>
                                        <td scope="col" data-label="DOB">${ $row.ProfileBirthdate }</td>
                                        <td scope="col" data-label="LOGIN">${ $row.UserLoginName }</td>
                                        <td scope="col" data-label="DATE">
                                            <input type="date" class="form-control" name="EffectiveDate" value="${ $row.CurrentDate }">
                                        </td>
                                        <td scope="col" data-label="DATE">
                                            <input type="date" class="form-control" name="ExpiryDate">
                                        </td>                                        
                                    </tr>   
                                `;
                                $counter++;  
                        });    
                                                                           
                        $self.modal_form_group_member.find('.tbl-display').append($txt);
                break;
                case 3:    
                        if(e.keyCode == '13' ) {
                            e.preventDefault();
                            $self.btn_search_group.click()
                        }
                break;
            }
        },                        
        LookupMainGroup: (e, data) => {
            let $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            const $result = new Common();                

            switch($route){
                case 1:
                        let $params = new URLSearchParams();

                        $params.append('flag', 5);                          
                        let $url_param = '/group/main/transact/?' + $params;    				

                        $payload = {url : $url_param,method_type : 'GET'}
            
                        const $common = new Common($payload)
            
                        $common.ApiData()
                        .then(data => {
                            Group.LookupMainGroup(2, data);
                        })
                        .catch(err => {
                            console.log('err',err)
                        }) 
                break;
                case 2:
                        $self.sel_clone_main_group.empty(); 
                        if(data.code != 200){
                            $result.IziToast(4, data.message);
                            return;
                        }

                        let $records = data.data, $option = '';
                        $option += `<option value=''>Select Main Group</option>`; 
                        $records.forEach($row => { $option += `<option value='${ $row.UserMainGroupID }'>${ $row.UserMainGroupName }</option>`;  });
                        $self.sel_clone_main_group.append($option);

                        Group.ResetSelect(1);                     
                break;
            }
        },
        LookupGroup: (e, data) => {
            let $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            const $result = new Common();                

            switch($route){
                case 1:
                        let $params = new URLSearchParams();
                        $mgid = e.data.lookup_type == 'group-member' ? $self.modal_form_group_member.find('[name=MainGroupID]').find('option:selected').val() : $self.form_group_member.find('[name=MainGroupName]').find('option:selected').val();
                        $params.append('mgid', $mgid);                          
                        $params.append('flag', 5);                          
                        let $url_param = '/group/transact/?' + $params;    				

                        $payload = {url : $url_param, method_type : 'GET', is_loading: false}
            
                        const $common = new Common($payload)
            
                        $common.ApiData()
                        .then(data => {
                            if(e.data.lookup_type == 'group-member'){
                                Group.LookupGroup(3, data);
                            }else{
                                Group.LookupGroup(2, data);
                            }
                            
                        })
                        .catch(err => {
                            console.log('err',err)
                        }) 
                break;
                case 2:
                        $self.sel_clone_group.empty(); 
                        if(data.code != 200){
                            Group.DisableEnabled(1);
                            let newOption = new Option(data.message, '', false, false);
                            $self.form_group_member.find('[name=GroupName]').append(newOption).trigger('change');                                       
                            return false;
                        }

                        let $record = data.data[0];

                        if(parseInt($record.IsSuccess) === 0){
                            Group.DisableEnabled(1);
                            return false;
                        } 

                        Group.DisableEnabled(2);

                        let $records = data.data, $option = '';
                        $option += `<option value=''>Select Group</option>`; 
                        $records.forEach($row => { $option += `<option value='${ $row.UserGroupID }'>${ $row.UserGroupName }</option>`;  });
                        $self.sel_clone_group.append($option);

                        Group.ResetSelect(2);                     
                break;
                case 3:
                        $self.modal_form_group_member.find('[name=GroupID]').empty(); 
                        if(data.code != 200){
                            Group.DisableEnabled(3);
                            let newOption = new Option(data.message, '', false, false);
                            $self.modal_form_group_member.find('[name=GroupID]').append(newOption).trigger('change');                                       
                            return false;
                        }

                        let $record_member = data.data[0];

                        if(parseInt($record_member.IsSuccess) === 0){
                            $result.IziToast(4, $record_member.Result);
                            Group.DisableEnabled(3);
                            return false;
                        } 
                        
                        Group.DisableEnabled(4);

                        let $records_member = data.data, $option_member = '';
                        $option_member += `<option value=''>Select Group</option>`; 
                        $records_member.forEach($row => { $option_member += `<option value='${ $row.UserGroupID }'>${ $row.UserGroupName }</option>`;  });
                        $self.modal_form_group_member.find('[name=GroupID]').append($option_member);
                break;                
                
            }
        },
        DisableEnabled: (e) => {
            let $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;            
            
            switch($route){
                case 1: 
                        $self.form_group_member.find('[name=GroupName]').empty();
                        $self.form_group_member.find('[name=GroupName]').attr('disabled',true);
                break;
                case 2: 
                        $self.form_group_member.find('[name=GroupName]').empty();
                        $self.form_group_member.find('[name=GroupName]').attr('disabled',false);
                break;
                case 3: 
                        $self.modal_form_group_member.find('[name=GroupID]').empty();
                        $self.modal_form_group_member.find('[name=GroupID]').attr('disabled',true);
                break;
                case 4: 
                        $self.modal_form_group_member.find('[name=GroupID]').empty();
                        $self.modal_form_group_member.find('[name=GroupID]').attr('disabled',false);
                break;                                                
              
            }    
        },                
        ResetSelect: (e) => {
            let $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;            
            
            switch($route){
                case 1: 
                        $self.sel_main_group_filter.empty();
                        $self.sel_clone_main_group.find('option').clone().appendTo( $self.sel_main_group_filter );                             
                break;
                case 2: 
                        $self.form_group_member.find('[name=GroupName]').empty();
                        $self.sel_clone_group.find('option').clone().appendTo( $self.form_group_member.find('[name=GroupName]') );                             
                break;  
                case 3: 
                        $self.modal_form_group_member.find('[name=MainGroupID]').empty();
                        $self.sel_clone_main_group.find('option').clone().appendTo( $self.modal_form_group_member.find('[name=MainGroupID]') );                             
                        Group.DisableEnabled(3);
                break;                  
                              
            }    
        },
        OpenModal: (e) => {
            var $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            switch($route){
                case 1:
                    setTimeout(function() { $self.modal_main_group.find('[name=MainGroupName]').focus(); }, 500);
                    $self.modal_main_group.modal('show');
                    $self.modal_main_group.find('.modal-title > span').text('Enter New Main Group');
                    $self.btn_save.attr('data-action', 'new');
                    Group.Clear(2);
                break;
                case 2:
                    $self.modal_main_group.modal('show')
                    $self.modal_main_group.find('.modal-title > span').text('Update Main Group');
                    $self.btn_save.attr('data-action', 'update')

                    $self.modal_form_main_group.find('[name=MainGroupName]').val( e.currentTarget.getAttribute('data-main-group-name') );
                    $self.modal_form_main_group.find('[name=MainGroupDesc]').val( e.currentTarget.getAttribute('data-main-group-desc') );
                    $self.btn_save.attr('data-main-group-id', e.target.closest('tr').id)
                break;
                case 3:
                    $self.sel_main_group.empty();
                    $self.sel_clone_main_group.find('option').clone().appendTo( $self.sel_main_group );                            

                    setTimeout(function() { $self.modal_group.find('[name=GroupName]').focus(); }, 500);
                    $self.modal_group.modal('show');
                    $self.modal_group.find('.modal-title > span').text('Enter New Group');
                    $self.btn_save_group.attr('data-action', 'new');
                    Group.Clear(3);
                break;  
                case 4:
                    $self.sel_main_group.empty();
                    $self.sel_clone_main_group.find('option').clone().appendTo( $self.sel_main_group );                            
                    $self.sel_main_group.val( $.trim(e.target.parentElement.getAttribute('data-main-group-id')) );

                    $self.modal_group.modal('show')
                    $self.modal_group.find('.modal-title > span').text('Update Group');
                    $self.btn_save_group.attr('data-action', 'update')

                    $self.modal_group.find('[name=GroupName]').val( e.currentTarget.getAttribute('data-group-name') );
                    $self.btn_save_group.attr('data-group-id', $.trim(e.target.parentElement.getAttribute('data-group-id')))
                break;    
                case 5:
                    Group.SearchLogin(1);
                    $self.modal_group_member.modal('show');
                    $self.modal_group_member.find('.modal-title > span').text('Enter New Member');
                    $self.btn_save.attr('data-action', 'new');
                    Group.Clear(5);
                    Group.ResetSelect(3);
                break;                                          
                
            }
        },
        CloseModal: (e) => {
            var $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            switch($route){
                case 1:
                        $self.btn_save.removeAttr('data-action')
                        $self.modal_main_group.modal('hide')
                        Group.Clear(2);
                break;
                case 2:
                        $self.btn_save_group.removeAttr('data-action')
                        $self.modal_group.modal('hide')
                        Group.Clear(3);
                break; 
                case 3:
                        $self.modal_group_member.modal('hide')
                        Group.Clear(5);
                break;                                
                
            }
        },
        Clear: (e) => {
            var $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            switch($route){
                case 1: //clear main group tab
                        $self.in_search_main_group.val('');
                        $self.in_search_main_group.focus();
                        $self.tbl_display.empty();
                break;
                case 2: $self.modal_form_main_group[0].reset(); break;
                case 3: $self.modal_form_group[0].reset(); break;
                case 4: //clear group tab
                        $self.in_search_group.val('');
                        $self.in_search_group.focus();
                        $self.in_search_group.attr('placeholder', Group.Message['input-group-placeholder']);
                        $self.tbl_display_group.empty();

                        $self.sel_main_group_filter.empty();
                        $self.sel_clone_main_group.find('option').clone().appendTo( $self.sel_main_group_filter );                                                    
                break;      
                case 5: $self.modal_form_group_member[0].reset(); break;          
            }
        },
        Tab: (e) => {
            var $self = Group.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            switch($route){
                case 1: 
                        $self.in_search_main_group.attr('placeholder', Group.Message['input-main-group-placeholder']);                
                        setTimeout(function() { $self.in_search_main_group.focus(); }, 500); 
                break;                
                case 2: 
                        $self.in_search_group.attr('placeholder', Group.Message['input-group-placeholder']);                
                        setTimeout(function() { $self.in_search_group.focus(); }, 500); 
                        $self.tbl_display_group.empty();
                break;
                case 3: 
                        Group.ResetSelect(1);             
                        Group.ResetSelect(2); 
                        $self.in_search_group_member.attr('placeholder', Group.Message['input-group-member-placeholder']);                
                        setTimeout(function() { $self.in_search_group_member.focus(); }, 500); 
                        $self.tbl_display_group_member.empty();
                        $self.form_group_member.find('[name=GroupName]').attr('disabled',true);
                break;                
            }
        },
        togglecheckboxes: (e) => {
            const $result = new Common();

            if(e.target.checked) {
                $result.ToggleCheckboxes(e.data.param, false);    
            }else{
                $result.ToggleCheckboxes(e.data.param, true);    
            }
        },                
    }

    Group.Init({
        in_search_main_group    : $('#in-search-main-group'),
        in_search_group         : $('#in-search-group'),
        in_search_group_member  : $('#in-search-group-member'),
        btn_search_main_group   : $('#btn-search-main-group'),
        btn_search_group        : $('#btn-search-group'),
        btn_search_group_member : $('#btn-search-group-member'),
        btn_new_main_group      : $('#btn-new-main-group'),
        btn_new_group           : $('#btn-new-group'),
        btn_new_group_member    : $('#btn-new-group-member'),        
        btn_clear_main_group    : $('#btn-clear-main-group'),
        btn_clear_group         : $('#btn-clear-group'),
        btn_save                : $('#btn-save'),
        btn_save_group          : $('#btn-save-group'),
        btn_save_group_member   : $('#btn-save-group-member'),
        sel_main_group_filter   : $('.sel-main-group-filter'),              
        sel_main_group          : $('#sel-main-group'),              
        sel_clone_main_group    : $('#sel-clone-main-group'),              
        sel_clone_group         : $('#sel-clone-group'),              
        check_all_list          : $('#check-all-list'),        
        custom_content_below_main_group_tab : $('#custom-content-below-main-group-tab'),              
        custom_content_below_group_tab : $('#custom-content-below-group-tab'),              
        custom_content_below_group_member_tab : $('#custom-content-below-group-member-tab'),              
        modal_main_group        : $('.modal-main-group'),
        modal_form_main_group   : $('.modal-form-main-group'),
        modal_form_group        : $('.modal-form-group'),
        modal_form_group_member : $('.modal-form-group-member'),
        modal_group             : $('.modal-group'),
        modal_group_member      : $('.modal-group-member'),
        tbl_display             : $('.tbl-display'),
        tbl_display_group       : $('.tbl-display-group'),
        tbl_display_group_member : $('.tbl-display-group-member'),
        btn_close               : $('.btn-close'),
        btn_edit                : $('.btn-edit'),
        form_filter             : $('.form-filter'),      
        form_group_member       : $('.form-group-member'),      
    })
})