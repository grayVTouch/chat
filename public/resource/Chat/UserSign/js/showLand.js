(function(){
    "use strict";

    /*
    * ********************
    * 单选
    * ********************
    */
    var componentSelect = G('.component-select').first();

    var remember = ComponentSelect(componentSelect.get() , {
        status: componentSelect.data('status')
    });

    /**
     * *******************
     * 表单提交
     * *******************
     */
    var link = topContext['prefix'] + 'userLand';
    var context = {};

    context['form']     = G('.form').first();
    context['userType'] = G('.user-type').first();
    context['userID']   = G('.user-id').first();
    context['submitBtn'] = G('.submit-btn').first();

    console.log(context);

    // 获取表单数据
    var form = {
        typeRange: ['admin' , 'user'] ,

        // 获取表单数据
        getData: function(){
            var data = {};

            data['userType'] = context['userType'].get().value;
            data['userID'] = context['userID'].get().value;
            data['status'] = remember.getStatus();

            return data;
        } ,

        // 表单过滤
        filter: function(data){
            if (!G.contain(data['userType'] , this.typeRange)) {
                return {
                    status: false ,
                    msg: '不支持的用户类型'
                };
            }

            if (data['userID'] === '') {
                return {
                    status: false ,
                    msg: '用户ID尚未填写'
                };
            }

            if (!checkNum(data['userID'] , 0)) {
                return {
                    status: false ,
                    msg: '用户ID格式错误'
                };
            }

            return {
                status: true ,
                msg: 'pass'
            };
        } ,

        // 生成表单对象
        getFormData: function(data){
            var formData = {
                user_type: data['userType'] ,
                user_id: data['userID'] ,
                status: data['status'] ,
            };

            return G.getFormData(formData);
        }
    };

    context['form'].loginEvent('submit' , function(event){
        event.preventDefault();

        var isRunning = context['submitBtn'].data('isRunning');
        var btnText   = context['submitBtn'].get().textContent;

        if (isRunning === 'y') {
            // 提交中
            layer.alert('表单提交中，请耐心等待...');
            return ;
        }

        var data = form.getData();
        var filter = form.filter(data);

        if (!filter['status']) {
            layer.msg(filter['msg']);
            return ;
        }

        // 请求状态
        var setPendingStatus = function(){
            topContext['loading'].show();
            context['submitBtn'].data('isRunning' , 'y');
            context['submitBtn'].get().textContent = '请求中...';
        };

        // 请求完成
        var setCompletedStatus = function(){
            topContext['loading'].hide();
            context['submitBtn'].data('isRunning' , 'n');
            context['submitBtn'].get().textContent = btnText;
        };

        // 请求成功
        var success = function(msg){
            setCompletedStatus();

            window.location.href = topContext['url'];
        };

        // 请求失败
        var fail = function(msg){
            setCompletedStatus();

            layer.msg(msg , {
                time: topContext['tipTime']
            });
        };

        var formData = form.getFormData(data);

        // 设置请求状态
        setPendingStatus();

        G.ajax({
            url: link ,
            method: 'post' ,
            sendData: formData ,
            headers: {
               'X-CSRF-TOKEN': topContext['token']
            } ,
            success: function(json){
                var data = G.jsonDecode(json);

                if (data['status'] === 'error') {
                    fail(data['msg']);
                } else {
                    success(data['msg']);
                }
            } ,
            error: G.ajaxError
        });

        // 获取表单数据
    } , true , false);

})();