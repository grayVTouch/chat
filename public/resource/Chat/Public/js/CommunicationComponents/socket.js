/**
 * *****************************
 * author 陈学龙 2018-05-15
 * Socket 实例
 * *****************************
 */

// 采用下划线命名仅是为了避免名称冲突
var _socket = new Socket(_wsLink , {
    platform: 'pc' ,
    user: {
        userType: topContext['e_userType'] ,
        userId: topContext['e_userId']
    } ,
    // socket 事件
    socketEvents: {
        open: function(){
            console.log('websocket 已连接');
        }
    } ,
    // 消息事件
    messageEvents: {
        // 接收到服务器会话同步时触发
        history: function(data){
            if (data['status'] === 'error') {
                console.log(data['msg']);
                return ;
            }

            data = data['msg'];

            // 仅用作节省代码使用
            var his = data['history'];

            // 渲染聊天室
            _render.renderRooms(data['room']);
            // 渲染会话
            _render.renderSessions(his);
            // 渲染会话窗口
            _render.renderWindows(his);
            // 渲染聊天室成员
            _render.renderGroups(his);
            // 渲染聊天室相关事物
            _render.renderPartsForThings(his);
        } ,
        // 新增会话时回调
        session: function(data){
            if (data['status'] === 'error') {
                console.log(data['msg']);
                return ;
            }

            data = data['msg'];

            _render.renderRoom(data);
            _render.renderSession(data);
            _render.renderWindow(data);
            _render.renderGroup(data);
            _render.renderPartForThings(data);

            // 表示没有正在聊天的窗口
            // 新增的会话置顶！
            if (_findDom.findCurSession() === false) {
                _domOperation.switch(data['room_id']);
            }
        } ,
        // 用户上下线通知
        notification: function(data){
            if (data['status'] === 'error') {
                console.log(data['msg']);
                return ;
            }

            data = data['msg'];

            // 如果是自己在其他平台上下线，那么无需理会
            if (data['user_type'] == this._user['userType'] && data['user_id'] == this._user['userId']) {
                console.log('接收到自己的上下线通知，可能是相同链接、也可能是不同平台链接，无需理会即可');
                return;
            }

            // 用户上下线通知
            _domOperation.notification(data);
        } ,
        // 聊天室增加成员时通知
        addUser: function(data){
            if (data['status'] === 'error') {
                console.log(data['msg']);
                return ;
            }

            data = data['msg'];

            // 如果是非自身，聊天窗口新增欢迎提示！
            if (data['user_type'] != this._user['userType'] || data['user_id'] != this._user['userId']) {
                _render.renderWelcom(data);
            }

            // 更新聊天室数据
            _domOperation.updateGroup(data);

            // 添加聊天室
            _render.renderUser(data);
        } ,
        // 聊天室新增正在咨询的订单
        orderConsultation: function(data){
            console.log('聊天室正在咨询的订单：' , data);

            if (data['status'] === 'error') {
                console.log(data['msg']);
                return ;
            }

            data = data['msg'];

            // 聊天室正在咨询的事务
            _render.renderOrderConsultation(data);
        } ,
        // 聊天室解锁正在咨询的订单
        unlockOrder: function(data){
            if (data['status'] === 'error') {
                console.log(data['msg']);
                return ;
            }

            data = data['msg'];

            // 清除正在咨询的订单
            _domOperation.clearOrderConsultation(data);
        } ,
        // 接收到服务器平台消息时触发
        advoise: function(data){
            if (data['status'] === 'error') {
                return ;
            }

            var his = data['msg'];

            // 检查是否是自己发送的消息
            if (his['client_id'] === this.clientId) {
                // 消息是自己发送的
                // 更新消息的状态
                console.log('接受到自己发送的信息，请更新消息状态');
                return ;
            }

            // 先渲染聊天室（可能会存在没有的情况：聊天室没有会话数据时！）
            _socketOperation.renderRoom(his['room_id'] , function(){
                // 添加临时会话
                _domOperation.addTmpSession(his['type'] , his['room_id'] , his['content']);

                // 更新临时会话
                _domOperation.updateTmpSession(his['room_id'] , 'success' , his);

                // 添加消息记录
                _render.renderHistory(his);

                // 消息提醒
                _misc.ringtonRemind(his['room_id']);

                // 设置未读消息数量
                _socketOperation.emptyMsgCount(his['room_id']);

                // top session 的问题
                // _domOperation.topSession(his['room_id']);
            });
        } ,
        // 接收到订单咨询消息的时候
        order: function(data){
            if (data['status'] == 'error') {
                // 消息发送失败
                console.log(data['msg']);
                return ;
            }

            var his = data['msg'];

            // 检查是否是自己发送的消息
            // 自己发送的消息无需处理
            // 因为设置发送后接收到响应时回调
            if (his['client_id'] === this.clientId) {
                console.log('接收到自己发送的消息，不做处理！！！');
                return ;
            }

            // 先渲染聊天室（可能会存在没有的情况：聊天室没有会话数据时！）
            _socketOperation.renderRoom(his['room_id'] , function(){
                // 添加临时会话
                _domOperation.addTmpSession(his['type'] , his['room_id'] , his['content']);

                // 更新临时会话
                _domOperation.updateTmpSession(his['room_id'] , 'success' , his);

                // 添加消息记录
                _render.renderHistory(his);

                // 消息提醒
                _misc.ringtonRemind(his['room_id']);

                // 重置未读消息数量
                _socketOperation.emptyMsgCount(his['room_id']);

                // 会话置顶
                // _domOperation.topSession(his['room_id']);
            });
        } ,
        // 接收到手动消息同步时触发
        syn: function(data){
            if (data['status'] === 'error') {
                console.log(data['msg']);
                return ;
            }

            data = data['msg'];

            console.log('手动同步消息');
            self.setHistory(data);
        } ,
        // 聊天室成员同步
        user: function(data){
            console.log('聊天室成员同步');
        } ,
        // 接受到未读消息数量时候
        unreadMsgCount: function(data){
            if (data['status'] === 'error') {
                console.log(data['msg']);
                return ;
            }

            data = data['msg'];
        }
    }
});