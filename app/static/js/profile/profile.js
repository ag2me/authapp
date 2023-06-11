$(document).ready(function(){

    var Profile = {
        Init: function(config){
            this.config = config;
            this.BindEvents();
        },
        BindEvents: function(){
            var $this = this.config;

            $this.btn_upload.on('click', {param:1}, this.OpenModal);
            $this.btn_reset_personal.on('click', {param: 1}, this.Reset);
            $this.btn_reset_address.on('click', {param: 2}, this.Reset);
            $this.btn_reset_contacts.on('click', {param: 3}, this.Reset);

            $this.btn_submit_personal.on('click', {param: 1}, this.Submit);
            $this.btn_submit_address.on('click', {param: 2}, this.Submit);
            $this.btn_submit_contacts.on('click', {param: 3}, this.Submit);
            $this.btn_submit_password.on('click', {param: 4}, this.Submit);

            $this.form_password.find('[name=confirm-new-pass]').on('keypress', {param: 5}, this.Submit);
            $this.form_contacts.find('[name=mobile-number]').on('keypress', {param: 6}, this.Submit);
            $this.form_address.find('[name=street]').on('keypress', {param: 7}, this.Submit);
            $this.form_personal.find('[name=firstname]').on('keypress', {param: 8}, this.Submit);

            $this.btn_clear.on('click', {param: 1}, this.Clear);

            $this.sel_province.on('change', {param:1}, this.CityList);
            $this.sel_city.on('change', {param:1}, this.BarangayList);   

            $this.nav_contacts.on('click', {param:1}, this.ProfileContacts);

            $this.file_layout_upload.on('change click', this.ReadUrl);
            $this.btn_save.on('click', { param: 1 }, this.UploadImage);
            $this.btn_close_modal.on('click', {param: 1}, this.CloseModal)
            
            Profile.OnPageLoad();
        },
        OnPageLoad: () => {
            var $self = Profile.config

            Profile.PersonalInfo(1);

            toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            }); 
            
            Profile.Select2();
        },
        UploadImage: (e, data) => {
            var $self = Profile.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            switch($route){
                case 1:
                    $image = $self.file_layout_upload
                    console.log($image)
                    if($image.get(0).files.length != 0){
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
                                ['<button>Ok</button>', function(instance, toast) {
                                    Profile.UploadAjax('/bo/profile/update_profile_image/', 1);
                                    iziToast.destroy();
                                }, true], // true to focus
                                ['<button>Close</button>', function(instance, toast) {
                                    instance.hide({
                                        transitionOut: 'fadeOutUp',
                                        onClosing: function(instance, toast, closedBy) { console.info('closedBy: ' + closedBy); }
                                    }, toast, 'buttonName');
                                }]
                            ],
                            onOpening: function(instance, toast) { console.info('callback abriu!'); },
                            onClosing: function(instance, toast, closedBy) { console.info('closedBy: ' + closedBy); }
                        });
                    } else{
                        alert('No File Chosen')
                    }
                break;
                case 2:
                    $self.modal_form_profile_image.find('[name=LookupID]').attr('value', data['ImageID'])
                    $self.profile_img.attr('src', data['ImageURL'])
                    $self.profile_img.attr('data-image-id', data['ImageID'])
                    $self.profile_image_circle.attr('src', data['ImageURL'])
                    $self.profile_image_circle.attr('data-image-id', data['ImageID'])
                    Profile.CloseModal(1)
                break;
            }
        },
        OpenModal: (e) => {
            var $self = Profile.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;
            
            switch ($route) {
                case 1:
                    setTimeout(function() { $self.modal_form_profile_image.find('[name=AttachmentName]').focus(); }, 500);
                    $self.image_layout_photo.attr('src', $self.profile_img.attr('src'))
                    $self.modal_profile_image.find('.modal-title > span').text('Upload Image');

                break;
            }
            
            $self.modal_profile_image.modal('show');
        },        
        CloseModal: function(e) {
            var $route = (typeof e == 'object') ? e.data.param : e,
                $self = Profile.config;

            switch ($route) {
                case 1:
                        $self.modal_profile_image.modal('hide');
                        Profile.Clear(2);
                break;
            }

        },
        ReadUrl: function(e) {
            var $self = Profile.config,
                $base_host = $.trim($self.content_wrapper.attr('data-host'));
                $self.image_layout_photo.attr('data-src', 1);

                if (e.target.files && e.target.files[0]) {
                    if (e.target.files[0].type == 'image/jpeg' ||
                        e.target.files[0].type == 'image/jpg' ||
                        e.target.files[0].type == 'image/png'
                    ) {

                        var fileReader = new FileReader();
                        fileReader.onload = function(event) {
                            var image = new Image();
                            image.onload = function() {
                                var canvas = document.createElement("canvas");
                                var context = canvas.getContext("2d");
                                canvas.width = 165;
                                canvas.height = 165;
                                context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
                                $self.image_layout_photo.attr('src', canvas.toDataURL());
                            }
                            image.src = event.target.result;
                        }
                        
                        $self.btn_save.removeClass('d-none')
                        fileReader.readAsDataURL(e.target.files[0]);
                    } else {
                        Profile.IziToast(3, 'Only Images (jpg,jpeg,png) are allowed to be uploaded');
                        return false;
                    }
                } else {
                    console.log('no changes')
                }
        },     
        Swal: function(e, data){ //swal
            var $self = Profile.config,
                $route  = (typeof(e) == 'object') ? e.data.param : e;

                toast = Swal.mixin({ 
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });

                Swal.close();

                switch($route){
                    case 1:
                        toast.fire({
                            icon: data[0], 
                            title: `&nbsp; ${data[1]}`,
                        })
                    break;
            }
        },
        Submit: (e) => {
            var $self = Profile.config;
            $route  = (typeof(e) == 'object') ? e.data.param : e;

            switch($route){
                case 1: //Personal Info
                        $data = [] //$self.form_personal.serializeArray()
                        $data.push(
                            {name:'ProfileFirstName', value: $self.form_personal.find('[name=firstname]').val()},
                            {name:'ProfileMiddleName', value: $self.form_personal.find('[name=middlename]').val()},
                            {name:'ProfileExtName', value: $self.form_personal.find('[name=extension]').val()},
                            {name:'ProfileLastName', value: $self.form_personal.find('[name=lastname]').val()},
                            {name:'ProfileBirthdate', value: $self.form_personal.find('[name=birthday]').val()},
                        )
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
                                ['<button>Yes</button>', function (instance, toast) {
                                    Profile.CallAjax('/bo/profile/update/', $data, 5, 'POST')
                                    iziToast.destroy();
                                }, true], // true to focus
                                ['<button>Cancel</button>', function (instance, toast) {
                                    instance.hide({
                                        transitionOut: 'fadeOutUp'
                                    }, toast, 'buttonName');
                                }]
                                ],
                                onOpening: function(instance, toast){
                                    //codehere
                                },
                                onClosing: function(instance, toast, closedBy){
                                    //codehere
                                 }
                        });

                break;
                case 2: //Address
                        $data = $self.form_address.serializeArray()
                        $data.push(
                            {name:'BarangayID', value: $self.form_address.find('[name=barangay]').val()},
                            {name:'Street', value: $self.form_address.find('[name=street]').val()},
                            {name:'AddressID', value: $self.personal_data.attr('data-address-id')}
                        )                        
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
                                ['<button>Yes</button>', function (instance, toast) {
                                    Profile.CallAjax('/bo/profile/updateaddress/', $data, 6, 'POST')
                                    iziToast.destroy();
                                }, true], // true to focus
                                ['<button>Cancel</button>', function (instance, toast) {
                                    instance.hide({
                                        transitionOut: 'fadeOutUp'
                                    }, toast, 'buttonName');
                                }]
                                ],
                                onOpening: function(instance, toast){
                                    //codehere
                                },
                                onClosing: function(instance, toast, closedBy){
                                    //codehere
                                 }
                        });
                break;
                case 3: //Contacts
                        $data = $self.form_contacts.serializeArray()     
                        $data.push(
                            {name: 'ContactID', value: $self.form_contacts.find('[name=mobile-number]').attr('data-contact-id')}
                        )                       
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
                                ['<button>Yes</button>', function (instance, toast) {
                                    Profile.CallAjax('/bo/profile/updatecontact/', $data, 9, 'POST')
                                    iziToast.destroy();
                                }, true], // true to focus
                                ['<button>Cancel</button>', function (instance, toast) {
                                    instance.hide({
                                        transitionOut: 'fadeOutUp'
                                    }, toast, 'buttonName');
                                }]
                                ],
                                onOpening: function(instance, toast){
                                    //codehere
                                },
                                onClosing: function(instance, toast, closedBy){
                                    //codehere
                                 }
                        });
                break;
                case 4: //Password
                        $new_pass = $self.form_password.find('[name=new-pass]').val()
                        $confirm_pass = $self.form_password.find('[name=confirm-new-pass]').val()
                        if($new_pass == $confirm_pass && $new_pass != '' && $confirm_pass != ''){
                            $data = $self.form_password.serializeArray()
                            $data.push(
                                {name: 'UserLoginPassword', value: $confirm_pass}
                            )
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
                                    ['<button>Yes</button>', function (instance, toast) {
                                        Profile.CallAjax('/bo/profile/updatepassword/', $data, 7, 'POST')
                                        iziToast.destroy();
                                    }, true], // true to focus
                                    ['<button>Cancel</button>', function (instance, toast) {
                                        instance.hide({
                                            transitionOut: 'fadeOutUp'
                                        }, toast, 'buttonName');
                                    }]
                                    ],
                                    onOpening: function(instance, toast){
                                        //codehere
                                    },
                                    onClosing: function(instance, toast, closedBy){
                                        //codehere
                                     }
                            });
                        } else{
                            Profile.Swal(1,['warning',"Password doesn't match!"]);
                        }
                break;
                case 5:
                    if(e.keyCode == '13' ) {
                        e.preventDefault();
                        $self.btn_submit_password.click();
                    }
                break;
                case 6:
                    if(e.keyCode == '13' ) {
                        e.preventDefault();
                        $self.btn_submit_contacts.click();
                    }
                break;
                case 7:
                    if(e.keyCode == '13' ) {
                        e.preventDefault();
                        $self.btn_submit_address.click();
                    }
                break;
                case 8:
                    if(e.keyCode == '13' ) {
                        e.preventDefault();
                        $self.btn_submit_personal.click();
                    }
                break;
            }
        },
        Select2: function(e){
            var $self = Profile.config;
                $self.sel_province.select2();
                $self.sel_city.select2();
                $self.sel_barangay.select2();
                $('.select2-selection').css('height', '38px')
        },
        Clear: (e, data) => {
            var $self = Profile.config, 
                $route = typeof(e) == 'object' ? e.data.param : e;

            switch($route){
                case 1:
                    $self.form_password.find('[name=new-pass').val('')
                    $self.form_password.find('[name=confirm-new-pass').val('')
                break;
                case 2:
                    $self.modal_form_profile_image[0].reset();
                    $self.btn_save.addClass('d-none')

                break;
            }
        },
        ProvinceList: (e, data) => {
            var $self = Profile.config, 
                $route = typeof(e) == 'object' ? e.data.param : e;
                switch($route){
                    case 1:
                        $data = $self.form_address.serializeArray();   
                        Profile.CallAjax('/api/provinces/', $data, 1, 'GET');
                    break;
                    case 2:
                        var len = data.length, txt=""
                            $province = $self.personal_data.attr('data-province-name') == '' ? ['Select Province...', '0'] : 
                                [$self.personal_data.attr('data-province-name'), $self.personal_data.attr('data-province-id')];
                        if(len > 0){
                            for(i=0;i<len;i++){
                                if(data[i]['ProvinceID'] == $province[1]){
                                    txt += `<option value="${data[i]['ProvinceID']}" 
                                                    data-name="${data[i]['ProvinceName']}"
                                                    selected>
                                                    ${data[i]['ProvinceName']}
                                            </option>`;
                                }else{
                                txt += `<option value="${data[i]['ProvinceID']}" 
                                                 data-name="${data[i]['ProvinceName']}">
                                                 ${data[i]['ProvinceName']}
                                        </option>`;
                                }
                            }
                        }else{
                            txt +=`<option selected value="${$province[1]}"> ${$province[0]}</option>`;
                        }
                        if(txt !=''){
                            $self.sel_province.empty();    
                            $self.sel_province.append(txt);    
                            if($self.sel_province.find('option:selected').val() != "0"){
                                Profile.CityList(1, null);
                            }
                        }
                    break;
                }
        },
        CityList: (e, data) => {
            var $self = Profile.config, 
                $route = typeof(e) == 'object' ? e.data.param : e;

                switch($route){
                    case 1:
                        // $data = $self.dummy_form.serializeArray();   
                        $data = {'ProvinceID' : $self.sel_province.find('option:selected').val()}
                        Profile.CallAjax('/api/cities/',$data, 2, 'GET');
                    break;
                    case 2:
                        var len = data.length, txt=""
                            $city = $self.personal_data.attr('data-city-name') == '' ? ['Select City...', '0'] : 
                                [$self.personal_data.attr('data-city-name'), $self.personal_data.attr('data-city-id')];
                        if(len > 0){
                            for(i=0;i<len;i++){
                                if(data[i]['CityMunicipalityID'] == $city[1]){
                                    txt += `<option value="${data[i]['CityMunicipalityID']}" 
                                                    data-name="${data[i]['CityMunicipalityName']}"
                                                    selected>
                                                    ${data[i]['CityMunicipalityName']}
                                            </option>`;
                                }else{
                                txt += `<option value="${data[i]['CityMunicipalityID']}"
                                                data-name="${data[i]['CityMunicipalityName']}">
                                                    ${data[i]['CityMunicipalityName']}
                                        </option>`;
                                }
                            }
                        }else{
                            txt +=`<option selected value="${$city[1]}"> ${$city[0]}</option>`;
                        }
                        if(txt !=''){
                            $self.sel_city.empty();    
                            $self.sel_city.append(txt);    
                            if($self.sel_city.find('option:selected').val() != "0"){
                                Profile.BarangayList(1, null);
                            }
                        }
                    break;
                }
        },
        BarangayList: (e, data) => {
            var $self = Profile.config,
                $route = typeof(e) == 'object' ? e.data.param : e;

                switch($route){
                    case 1:
 
                        $data = {"CityMunicipalityID": $self.sel_city.find('option:selected').val()}
                        Profile.CallAjax('/api/barangays/',$data, 3, 'GET');
                    break;
                    case 2:
                        var len = data.length, txt=""
                            $barangay = $self.personal_data.attr('data-barangay-name') == '' ? ['Select Barangay...', '0'] : 
                                [$self.personal_data.attr('data-barangay-name'), $self.personal_data.attr('data-barangay-id')];
                        if(len > 0){
                            for(i=0;i<len;i++){
                                if(data[i]['BarangayID'] == $barangay[1]){
                                    txt += `<option value="${data[i]['BarangayID']}" 
                                                    data-name="${data[i]['BarangayName']}"
                                                    selected>
                                                    ${data[i]['BarangayName']}
                                            </option>`;
                                }else{
                                txt += `<option value="${data[i]['BarangayID']}"
                                                data-name="${data[i]['BarangayName']}">
                                                    ${data[i]['BarangayName']}
                                        </option>`;
                                }
                            }
                        }else{
                            txt +=`<option selected value="${$barangay[1]}"> ${$barangay[0]}</option>`;
                        }
                        if(txt !=''){
                            $self.sel_barangay.empty();
                            $self.sel_barangay.append(txt);          
                        }
                    break;
                }
        },
        PersonalInfo: (e, data) => {
            var $self = Profile.config, 
                $route = typeof(e) == 'object' ? e.data.param : e;

                switch($route){
                    case 1:
                        $data = {}
                        Profile.CallAjax('/bo/profile/details/', $data, 4, 'GET')
                    break
                    case 2:
                        $self.personal_data.attr('data-profile-id', data[0]['ProfileID'])
                        $self.personal_data.attr('data-province-id', data[0]['ProvinceID'])
                        $self.personal_data.attr('data-city-id', data[0]['CityID'])
                        $self.personal_data.attr('data-barangay-id', data[0]['BarangayID'])
                        $self.personal_data.attr('data-entity-id', data[0]['EntityID'])
                        $self.personal_data.attr('data-address-id', data[0]['AddressID'])

                        $self.profile_image_circle.attr('src', data[0]['ProfileImage'])
                        $self.profile_image_circle.attr('data-image-id', data[0]['profile-image-id'])

                        $self.modal_form_profile_image.find('[name=LookupID]').attr('value', data[0]['profile-image-id'])
                        $self.profile_img.attr('src', data[0]['ProfileImage'])
                        $self.profile_img.attr('data-image-id', data[0]['profile-image-id'])

                        $form_personal_input= $self.form_personal.find('input')
                        $form_address_input= $self.form_address.find('input')

                        for(let i = 0; i < $form_personal_input.length; i++){
                            $key = $form_personal_input.eq(i).attr('name')
                            $form_personal_input.eq(i).val(data[0][$key])
                        }

                        for(let i = 0; i < $form_address_input.length; i++){
                            $key = $form_address_input.eq(i).attr('name')
                            $form_address_input.eq(i).val(data[0][$key])
                        }
                        

                        Profile.ProvinceList(1);
                    break
                    case 3:
                        if(data[0]['IsSuccess'] == "1"){
                            Profile.Swal(1,['success','Success!']);
                        }else{
                            Profile.Swal(1,['warning','Error Occured']);
                        }
                    break
                    case 4:
                        console.log(data)
                        if(data[0]['IsSuccess'] == "1"){
                            Profile.Swal(1,['success','Success!']);
                        }else{
                            Profile.Swal(1,['warning','Error Occured']);
                        }
                    break
                    case 5:
                        if(data[0]['IsSuccess'] == "1"){
                            Profile.Swal(1,['success','Success!']);
                            Profile.Clear(1, null)
                        }else{
                            Profile.Swal(1,['warning','Error Occured']);
                        }
                    break
                }
        }, 
        ProfileContacts: (e, data) => {
            var $self = Profile.config, 
                $route = typeof(e) == 'object' ? e.data.param : e;

            switch($route){
                case 1:
                    $data = []
                    $data.push(
                        {name: 'EntityID', value: $self.personal_data.attr('data-entity-id')}
                    )
                    Profile.CallAjax('/bo/profile/contactdetails/', $data, 8, 'POST')
                break;
                case 2:
                    $self.form_contacts.find('[name=mobile-number]').attr('data-contact-id', data[0]['ContactID'])
                    $self.form_contacts.find('[name=mobile-number]').val(data[0]['ContactValue'])
                break;
                case 3:
                    if(data[0]['IsSuccess'] == "1"){
                        Profile.Swal(1,['success','Success!']);
                    }else{
                        Profile.Swal(1,['warning','Error Occured']);
                    }
                break;
            }
        },
        UploadAjax: function(url, route) {
            var $self = Profile.config,
                timer, $body = $('body'),
                $form = $self.modal_form_profile_image[0],
                $base_host = $.trim($self.content_wrapper.attr('data-host')),
                $url = $base_host + url;
                $formData = new FormData($form);

                $.ajax({
                    type: 'POST',
                    url: $url,
                    data: $formData,
                    dataType: 'JSON',
                    processData: false,
                    contentType: false,
                    beforeSend: function() {
                        timer && clearTimeout(timer);
                        timer = setTimeout(function() {
                                $body.addClass("loading");
                            },
                            1000);
                    },
                    complete: function() {
                        clearTimeout(timer);
                        $body.removeClass("loading");
                    },
                    success: function(evt) {
                        if (evt) {
                            switch (route) {
                                case 1:
                                    Profile.UploadImage(2, evt);
                                break;


                            }
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('error: ' + textStatus + ': ' + errorThrown);
                    }
                });
        },
        CallAjax: function(url, data, route, method_type){
            var $self       = Profile.config, timer, data_object = {},
                $base_host  = $.trim($self.content_wrapper.attr('data-host')),
                $url        =  $base_host + url;
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
                            case 1: Profile.ProvinceList(2, evt); break; 
                            case 2: Profile.CityList(2, evt); break; 
                            case 3: Profile.BarangayList(2, evt); break; 
                            case 4: Profile.PersonalInfo(2, evt); break; 
                            case 5: Profile.PersonalInfo(3, evt); break; 
                            case 6: Profile.PersonalInfo(4, evt); break; 
                            case 7: Profile.PersonalInfo(5, evt); break; 
                            case 8: Profile.ProfileContacts(2, evt); break; 
                            case 9: Profile.ProfileContacts(3, evt); break; 
                        }    
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log('error: ' + textStatus + ': ' + errorThrown);
                }
            }); 
        }//end sa callajax        
    }

    Profile.Init({
        content_wrapper             : $('.content-wrapper'),
        personal_data               : $('#personal-data'),

        btn_upload                  : $('#btn-upload'),
        btn_reset_personal          : $('#btn-reset-personal'),
        btn_submit_personal         : $('#btn-submit-personal'),
        btn_reset_address           : $('#btn-reset-address'),
        btn_submit_address          : $('#btn-submit-address'),
        btn_reset_contacts          : $('#btn-reset-contacts'),
        btn_submit_contacts         : $('#btn-submit-contacts'),
        btn_clear                   : $('.btn-clear'),
        btn_submit_password         : $('#btn-submit-password'),
        form_personal               : $('#form-personal'),
        form_address                : $('#form-address'),
        form_contacts               : $('#form-contacts'),
        form_password               : $('#form-password'),

        sel_province                : $('#sel-province'),
        sel_city                    : $('#sel-city'),
        sel_barangay                : $('#sel-barangay'),

        nav_contacts                : $('#nav-contacts'),

        btn_save                    : $('#btn-save'),
        image_layout_photo          : $("#image-layout-photo"),
        file_layout_upload          : $(".file-layout-upload"),
        modal_profile_image         : $('#modal-profile-image'),
        modal_form_profile_image    : $('#modal-form-profile-image'),
        profile_image_circle        : $('#profile-image-circle'),
        btn_close_modal             : $('.btn-close'),
        
        profile_img                 : $('#profile-img')
    })
})