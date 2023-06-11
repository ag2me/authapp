$(document).ready(function(){

    var System = {
        Init: function(config){
            this.config = config;
            this.BindEvents();
        },
        BindEvents: function(){
            let $this = this.config;

            $this.in_search.on('keypress', {param:3}, this.Search);
            $this.btn_search.on('click', {param:1}, this.Search);

            System.OnPageLoad();
        },
        OnPageLoad: () => {
            let $self = System.config;

            toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            }); 

            $self.in_search.focus();
            System.Search(1);
        },
        Search: (e, data) => {
            let $self = System.config,
                $route = (typeof(e) == 'object') ? e.data.param : e;

            const $result = new Common();                

            switch($route){
                case 1:
                        let $params = new URLSearchParams();

                        $params.append('desc', $.trim($self.in_search.val()));                          
                        let $url_param = '/system/search/?' + $params;    				

                        $payload = {url : $url_param,method_type : 'GET'}
            
                        const $common = new Common($payload)
            
                        $common.ApiData()
                        .then(data => {
                            System.Search(2, data);
                        })
                        .catch(err => {
                            console.log('err',err)
                        }) 
                break;
                case 2: 
                        $self.div_system_holder.empty(); 
                        if(data.code != 200){
                            $result.IziToast(4, data.message);
                            return;
                        }

                    let $records = data.data, $txt = '', $counter=1;
                        $records.forEach($row => { 
                            let $module_desc = ($result.GetQueryStringValue().mdesc == null) ? '' : $result.GetQueryStringValue().mdesc;
                            let $module_id = ($result.GetQueryStringValue().mid == null) ? '' : $result.GetQueryStringValue().mid;
                            let $url = $result.URLOrigin() +'/'+ $row.ModuleController +'?mid='+ $module_id +'&mdesc='+$module_desc+'&sid='+$row.SystemID;                               
                            
                            let $break = ($counter > 2) ? 'break' : '';
                            console.log($break)
                            $txt += `
                                <div class="p-2">
                                    <div class="card" style="width:200px">
                                        <img class="card-img-top" src="https://excelautomationinc.com/wp-content/uploads/2021/07/No-Photo-Available.jpg" alt="Card image" style="width:100%">
                                        <div class="card-body">
                                            <h4 class="card-title">${ $row.SystemName }</h4>
                                            <p class="card-text">&nbsp;</p>
                                            <a href="${ $url }" 
                                                class="btn btn-primary"
                                                data-code="${ $row.SystemCode }"
                                                data-systemid="${ $row.SystemID }"
                                            >Click to view
                                            </a>
                                        </div>
                                    </div>            
                                </div>
                                  
                                `;
                                $counter++;  
                        });    
                                                                           
                        $self.div_system_holder.append($txt);

                        toast.fire({
                            icon: 'success',
                            title: `&nbsp; ${$counter} records found.`
                        })                        
                break;
                case 3:    
                        if(e.keyCode == '13' ) {
                            e.preventDefault();
                            $self.btn_search.click()
                        }
                break;
            }
        },
    }

    System.Init({
        in_search           : $('.in-search'),
        btn_search          : $('.btn-search'),
        div_system_holder   : $('.div-system-holder'),
    })
})