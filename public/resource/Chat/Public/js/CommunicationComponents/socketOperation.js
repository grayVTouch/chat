/**
 * *****************************
 * author 陈学龙 2018-05-15
 * 对 socket 的各种操作封装
 * *****************************
 */

// 采用下划线命名仅是为了避免名称冲突
var _socketOperation = {
    // 渲染聊天室数据
    renderRoom: function(id , callback){
        // 已存在，仅切换
        if (_findDom.existsSession(id)) {
            if (G.isFunction(callback)) {
                callback();
            }

            return ;
        }

        // 如果不存在，那么渲染！
        _socket.getRoom(id , function(data){
            // 这边也要做一次判断！因为该死的异步！
            // 比如说：
            // 第一次判断逻辑发现不存在会话，那么发起请求
            // 请求还未返回之前产生了第二次逻辑判断
            // 正常应该要求在第一次请求返回之后才允许再次执行 renderRoom 函数
            // 结果才正确的！
            // 但实际并不是这样
            // 具体请按照这个思路思考下去，你就会知道这段代码的含义了
            if (_findDom.existsSession(id)) {
                if (G.isFunction(callback)) {
                    callback();
                }

                return ;
            }

            if (data['status'] === 'error') {
                layer.alert('获取聊天室信息失败，请稍后再试');
                return ;
            }

            data = data['msg'];

            // 移除空节点
            _domOperation.removeEmpty(_context['s_items'].get());

            _render.renderRoom(data);
            _render.renderSession(data);
            _render.renderWindow(data);
            _render.renderGroup(data);
            _render.renderPartForThings(data);

            _domOperation.switch(data['room_id']);

            if (G.isFunction(callback)) {
                callback();
            }
        });
    } ,

    // 更新会话的未读消息数量
    emptyMsgCount: function(id){
        var session = _findDom.findSession(id);
            session = G(session);

        // 检查会话该会话是否是当前选中项
        // 如果是当前选中项，设置未读消息数量 = 0
        // 否则不设置
        if (session.hasClass('cur')) {
            _socket.emptyMsgCount(id , function(){
                _domOperation.setMsgFlag(id , 'old');
            });
        } else {
            // 设置未读消息提醒
            _domOperation.setMsgFlag(id , 'new');
        }
    } ,

    // 发送文本数据
    sendText: function(){
        var html = _context['w_input'].html();
        var text = _editor.text(html);
        var msgType = 'text';

        if (text === '') {
            layer.msg('消息不能为空' , {
                time: topContext['tipTime']
            });

            return ;
        }

        var session = _findDom.findCurSession();

        if (session === false) {
            layer.msg('请选择聊天室 或 会话' , {
                time: topContext['tipTime']
            });

            return ;
        }

        session = G(session);

        var type    = session.data('type');
        var id      = session.data('id');

        // 聊天室置顶
        _domOperation.topSession(id);

        // 更新临时会话
        _domOperation.addTmpSession(msgType , id , text);

        // 添加临时聊天记录
        var dom = _render.appendTmpHistoryForText(id , text);

        // 服务端响应
        var success = function(data){
            // 消息发送成功清除对应聊天室临时记录
            _input.text[id] = '';

            // 更新操作
            _domOperation.updateTmpSession(id , data['status'] , data['msg']);
            _domOperation.updateTmpHistoryForText(id , dom , data);
        };

        if (type === 'advoise') {
            _socket.advoise(msgType , type , id , text , success);
        } else if (type === 'order') {
            _socket.order(msgType , type , id , text , success);
        } else {
            // ....其他类型消息
        }

        // 清空输入框
        _context['w_input'].html('');
    } ,

    // 发送图片消息
    sendImage: function(id , dom , data){
        var session = _findDom.findSession(id);
            session = G(session);
        var type = session.data('type');
        var json = G.jsonEncode(data);
        var msgType = 'json:image';

        _domOperation.topSession(id);

        // 接收到服务器响应时
        var success = function(data){
            if (data['status'] === 'error') {
                _domOperation.updateTmpSession(id , 'error');
                _domOperation.updateTmpHistoryForImage(dom , 'error');

                return ;
            }

            data = data['msg'];

            // 成功
            _domOperation.updateTmpSession(id , 'success' , data);
            _domOperation.updateTmpHistoryForImage(dom , 'success' , data);
        };

        if (type=== 'advoise') {
            _socket.advoise(msgType , type , id , json , success);
        } else if (type === 'order') {
            _socket.order(msgType , type , id , json , success);
        } else {
            // 其他类型待添加
        }
    } ,

    // 发送图片消息
    sendFile: function(id , dom , data){
        var session = _findDom.findSession(id);
            session = G(session);
        var type = session.data('type');
        var json = G.jsonEncode(data);

        _domOperation.topSession(id);

        // 接收到服务器响应时
        var success = function(data){
            if (data['status'] === 'error') {
                _domOperation.updateTmpSession(id , 'error');
                _domOperation.updateTmpHistoryForFile(dom , 'error');

                return ;
            }

            data = data['msg'];

            // 成功
            _domOperation.updateTmpSession(id , 'success' , data);
            _domOperation.updateTmpHistoryForFile(dom , 'success' , data);
        };

        if (type=== 'advoise') {
            _socket.advoise('json:file' , type , id , json , success);
        } else if (type === 'order') {
            _socket.order('json:file' , type , id , json , success);
        } else {
            // 其他类型待添加
        }
    } ,

    // 发送订单
    sendOrder: function(data){
        var session = _findDom.findSession(data['room_id']);
            session = G(session);
        var type = session.data('type');
        var json = G.jsonEncode(data);
        var msgType = 'json:order';

        _domOperation.topSession(data['room_id']);

        // 接收到服务器响应时
        var success = function(res){
            if (res['status'] === 'error') {
                _domOperation.updateTmpSession(res['room_id'] , 'error');
                _domOperation.updateTmpHistoryForOrder(dom , 'error');

                return ;
            }

            res = res['msg'];

            // 成功
            _domOperation.updateTmpSession(res['room_id'] , 'success' , res);
            _domOperation.updateTmpHistoryForOrder(dom , 'success' , res);
        };

        // 更新临时会话
        _domOperation.addTmpSession(msgType , data['room_id']);

        // 添加临时订单消息
        var dom = _render.appendTmpHistoryForOrder(data);

        if (type=== 'advoise') {
            _socket.advoise(msgType , type , data['room_id'] , json , success);
        } else if (type === 'order') {
            _socket.order(msgType , type , data['room_id'] , json , success);
        } else {
            // 其他类型待添加
        }
    } ,
};