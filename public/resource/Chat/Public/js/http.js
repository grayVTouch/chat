// 网络请求
function request(opt){
    var defaultOpt = {
        url: '' ,
        method: 'get' ,
        headers: {} ,
        // FormData 对象
        formData: null ,
        tip: true ,
        // 按钮
        btn: null ,
        // 是否显示加载画面
        isLoading: true ,
        success: null ,
        // 是否更新 dom 节点的值
        // 这仅在 btn = btn 时！如果是其他类型的就不是很好
        isUpdate: true ,
        error: null
    };

    if (!G.isObject(opt)) {
        opt = defaultOpt;
    }

    opt['method']   = G.isValidVal(opt['method']) ? opt['method'] : defaultOpt['method'];
    opt['tip']      = G.isBoolean(opt['tip']) ? opt['tip'] : defaultOpt['tip'];
    opt['isUpdate'] = G.isBoolean(opt['isUpdate']) ? opt['isUpdate'] : defaultOpt['isUpdate'];
    opt['isLoading'] = G.isBoolean(opt['isLoading']) ? opt['isLoading'] : defaultOpt['isLoading'];

    var btn = G(opt['btn']);
    var isRunning = btn.data('isRunning');

    if (isRunning === 'y') {
        layer.alert('请求中，请耐心等待...');
        return ;
    }

    if (opt['isUpdate']) {
        var attr        = btn.get().tagName === 'INPUT' ? 'value' : 'textContent';
        var originText  = btn.get()[attr];
    }

    // 请求状态
    var pending = function(){
        btn.data('isRunning' , 'y');

        if (opt['isLoading']) {
            topContext['loading'].show();
        }

        if (opt['isUpdate']) {
            btn.get()[attr] = '请求中...';
        }
    };

    // 完成状态
    var completed = function(){
        btn.data('isRunning' , 'n');

        if (opt['isLoading']) {
            topContext['loading'].hide();
        }

        if (opt['isUpdate']) {
            btn.get()[attr] = originText;
        }
    };

    // 成功
    var success = function(msg){
        completed();

        if (opt['tip']) {
            layer.msg(msg , {
                time: topContext['tipTime']
            });
        }

        if (G.isFunction(opt['success'])) {
            opt['success'](msg);
        }
    };

    // 失败
    var fail = function(msg){
        completed();

        layer.msg(msg , {
            time: topContext['tipTime']
        });

        if (G.isFunction(opt['error'])) {
            opt['error'](msg);
        }
    };

    // 设置请求状态
    pending();

    // 发送请求
    G.ajax({
        url: opt['url'] ,
        method: opt['method'] ,
        headers: opt['headers'] ,
        sendData: opt['formData'] ,
        success: function(json){
            var data = G.jsonDecode(json);

            if (data['status'] === 'error') {
                fail(data['msg']);
            } else {
                success(data['msg']);
            }
        } ,
        error: G.ajaxErro
    });
}

// ajax 请求（不显示加载项）
function ajax(config){
    // 默认配置
    var defaultConfig = {
        url: '' ,
        method: {} ,
        headers: null ,
        send: null ,
        success: null ,
        error: G.ajaxError
    };

    config['url']       = G.isUndefined(config['url'])      ? defaultConfig['url']      : config['url'];
    config['method']    = G.isUndefined(config['method'])   ? defaultConfig['method']   : config['method'];
    config['headers']   = G.isUndefined(config['headers'])  ? defaultConfig['headers']  : config['headers'];
    config['send']      = G.isUndefined(config['send'])     ? defaultConfig['send']     : config['send'];
    config['success']   = G.isUndefined(config['success'])  ? defaultConfig['success']  : config['success'];
    config['error']     = G.isUndefined(config['error'])    ? defaultConfig['error']    : config['error'];

    G.ajax({
        url: config['url'] ,
        method: config['method'] ,
        sendData: config['send'] ,
        success: function(json){
            var data = G.jsonDecode(json);

            if (data['status'] === 'success') {
                if (G.isFunction(config['success'])) {
                    config['success'](data['msg']);
                }
            } else {
                if (G.isFunction(config['error'])) {
                    config['error'](data['msg']);
                }
            }
        } ,
        error: G.ajaxError
    });
}