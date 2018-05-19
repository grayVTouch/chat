/**
 * ******************************
 * author 陈学龙 2018-04-22
 * 客服系统核心类库！！
 *
 * 系统组成部分：
 *
 * 聊天室列表
 * 会话列表
 * 聊天窗口
 * 聊天室成员
 * 聊天室相关事物
 *
 * 系统功能：
 *
 * 1. 记录会话排列顺序
 * 2. 未读消息提醒
 * 3. 支持表情、图片、文件传输
 * 4. 自定义设置消息提醒模式
 * 5. 聊天室成员上下线状态更新
 * 6. 聊天室新增成员动态更新
 * 7. 聊天室相关事物（聊天室信息 + 正在咨询的事物）
 * 8. 人性化光辉：群聊模式下，聊天室名称的友好展示，以快速定位自身位置
 * 9. 待发送区域草稿功能，切换会话输入内容不丢失
 * 10. 界面自适应设计，可满足最小宽度 >= 1360 任意设备
 *
 * ******************************
 */
var System = (function(){
    "use strict";

    // 聊天室前缀 r_
    // 会话前缀 s_
    // 窗口 w_\\\\\\
    // 成员前缀 u_

    function System(config){
        var thisRange = [window , null , undefined];

        if (G.contain(this , thisRange) || (!G.contain(this , thisRange) && this.constructor !== System)) {
            return new System(config);
        }

        this._default = {
            // websocket 链接
            wsLink: 'ws://0.0.0.0:8282'
        };

        if (G.isUndefined(config)) {
            config = this._default;
        }

        this._wsLink = G.isString(config['wsLink']) ? config['wsLink'] : this._default['wsLink'];

        this._run();
    }

    // 移除节点
    // context['orderDisputeFloor'].get().parentNode.removeChild(context['orderDisputeFloor'].get());

    // 实例继承的数据
    System.prototype = {
        constructor: System ,
        // 相关链接
        links: null ,
        // 相关加载实例
        loadings: null ,
        // socket 实例
        socket: null ,

        _initStaticArgs: function(){
            // 全局初始化变量
            // 这个是每个聊天室声音提醒
            this._tipPlays = {};

            // 草稿
            this._text = {};

            // 发送中的消息，缓存起来
            // 就怕发送失败后，做一些处理
            this._send = {};
        } ,

        _initStaticHTML: function(){
            var i = 0;
            var cur = null;
            var dom = null;

            for (; i < _face.length; ++i)
            {
                cur = _face[i];
                dom = _dom.getFace(cur['id'] , cur['src'] , cur['text']);

                // 添加表情借点
                _context['w_listForFace'].append(dom);
                _event.defineFaceEvent(dom);
            }
        } ,

        _initDynamicArgs: function(){

        } ,

        _initDynamicHTML: function(){

        } ,

        _initStatic: function(){

        } ,

        _initDynamic: function(){

        } ,

        // 获取聊天室 items
        getRoomItems: function(type){
            return G('.item' , _context['r_roomItems'].get()).get();
        } ,

        // 请求状态
        pending: function(btn , loading){
            btn = G(btn);
            loading.show();
            btn.data('isRunning' , 'y');
        } ,

        // 完成状态
        completed: function(btn , loading){
            btn = G(btn);
            loading.hide();
            btn.data('isRunning' , 'n');
        } ,


        // 设置消息提醒状态
        setTipOption: function(domType , roomType , roomId , tip){
            var text        = tip == 1 ? '消息免打扰' : '开启消息提醒';
            var _tip        = tip == 1 ? 2 : 1;

            _context['tipOption'].text(text);
            _context['tipOption'].data('type' , roomType);
            _context['tipOption'].data('id' , roomId);
            _context['tipOption'].data('tip' , _tip);
            _context['tipOption'].data('domType' , domType);
        } ,

        // 隐藏相关事物的默认界面
        hideDefaultRelatedThings: function(){
            _context['defaultForRelatedThings'].addClass('hide');
        } ,
        
        // 显示聊天室
        showInfoForRoom: function(){
            _context['infoForRoom'].removeClass('hide');
        } ,

        // 显示订单信息
        showInfoForOrder: function(){
            _context['infoForOrder'].removeClass('hide');
        } ,

        // 切换聊天室信息
        switchInfoForRoom: function(id){
            var items = G('.item' , _context['contentForInfoRoom'].get());
            var cur = this.findInfoForRoom(id);
                cur = G(cur);
            cur.highlight('hide' , items.get() , true);
        } ,

        // 获取当前选中项
        getCurForSession: function(){
            var items = G('.item' , _context['s_sessionItems'].get());
            var i = 0;
            var cur = null;

            for (; i < items.length; ++i)
            {
                cur = G(items.get()[i]);

                if (cur.hasClass('cur')) {
                    return cur.get();
                }
            }

            return false;
        } ,

        // 获取当前聊天室id
        getSessionId: function(){
            var session = this.getCurForSession();
                session = G(session);
            return session.isDom() ? session.data('id') : false;
        } ,

        // 获取当前聊天室信息
        getCurRoomInfo: function(type){
            var typeRange = ['id' , 'type' , 'both'];
            type = G.contain(type , typeRange) ? type : 'both';
            var session = this.getCurForSession();
            session = G(session);

            var _type = session.data('type');
            var id = session.data('id');

            if (type === 'id') {
                return id
            }

            if (type === 'type') {
                return _type;
            }

            return {
                id: id ,
                type: _type
            };
        } ,

        // 获取当前聊天室 id
        getCurRoomId: function(){
            this.getCurRoomInfo('id');
        } ,

        // 获取当前聊天室 type
        getCurRoomType: function(){
            this.getCurRoomInfo('type');
        } ,



        // 更新聊天室未读消息数量
        updateCount: function(){
            // 待开发 ..
        } ,

        // 显示指定窗口
        showWindow: function(id){
            var win = this.findWindow(id);
            win = G(win);
            var windows = G('.window' , _context['w_windows'].get());

            win.highlight('hide' , windows.get() , true);
        } ,

        // 隐藏指定窗口
        hideWindow: function(id){
            var win = this.findWindow(id);
            win = G(win);
            var windows = G('.window' , _context['w_windows'].get());

            win.highlight('hide' , windows.get() , false);
        } ,

        // 隐藏聊天输入框
        hideChat: function(){

        } ,


        // 显示用户
        showUser: function(id){
            var user = this.findUser(id);
                user = G(user);
            var users = G('.user' , _context['u_userItems'].get());

            user.highlight('hide' , users.get() , true);
        } ,

        // 设置

        // 获取订单信息
        getOrderInfo: function(dom , orderId , fn){
            if (G.isUndefined(orderId)) {
                throw new Error('订单 id 尚未提供');
            }

            dom = G(dom);

            var isRunning = dom.data('isRunning');

            if (isRunning === 'y') {
                layer.alert('加载中，请耐心等待...');
                return ;
            }

            var self    = this;
            var formData = G.getFormData({
                order_id: orderId
            });

            this.pending(dom.get() , topContext['loading']);

            G.ajax({
                url: this.links['getOrderInfo'] ,
                method: 'post' ,
                sendData: formData ,
                headers: {
                    'X-CSRF-TOKEN': topContext['token']
                } ,
                success: function(json){
                    var data = G.jsonDecode(json , true);

                    // 完成状态
                    self.completed(dom.get() , topContext['loading']);

                    if (data['status'] === 'error') {
                        // 完成状态
                        layer.msg(data['msg'] , {
                            time: topContext['tipTime']
                        });
                    } else {
                        if (G.isFunction(fn)) {
                            fn.call(self , data['msg']);
                        }
                    }
                } ,
                error: G.ajaxError
            });
        } ,

        // 获取当前登录用户房间的消息提醒状态
        getTip: function(dom , roomId , fn){
            dom = G(dom);

            var isRunning = dom.data('isRunning');

            if (isRunning === 'y') {
                layer.alert('加载中，请耐心等待...');
                return ;
            }

            var self    = this;
            var formData = G.getFormData({
                room_id: roomId ,
                user_type: topContext['userType'] ,
                user_id: topContext['userId']
            });

            this.pending(dom.get() , topContext['loading']);

            G.ajax({
                url: this.links['getTip'] ,
                method: 'post' ,
                sendData: formData ,
                headers: {
                    'X-CSRF-TOKEN': topContext['token']
                } ,
                success: function(json){
                    var data = G.jsonDecode(json , true);

                    // 完成状态
                    self.completed(dom.get() , topContext['loading']);

                    if (data['status'] === 'error') {
                        // 完成状态
                        layer.msg(data['msg'] , {
                            time: topContext['tipTime']
                        });
                    } else {
                        if (G.isFunction(fn)) {
                            fn.call(self , data['msg']);
                        }
                    }
                } ,
                error: G.ajaxError
            });
        } ,

        // 聊天室成员数量变动
        incrUserCount: function(roomId){
            var user = this.findUser(roomId);
                user = G(user);
            var title = G('.title' , user.get()).first();
            var online = G('.online' , title.get()).first();
            var count = G('.count' , title.get()).first();

            var _online = parseInt(online.text());
            var _count = parseInt(count.text());

            _online++;
            _count++;

            online.text(_online);
            count.text(_count);
        } ,

        // 设置聊天窗口标题
        setHistoryTitle: function(roomId){
            var win = this.findWindow(roomId);
            win = G(win);
        } ,

        // 标题新消息闪烁通知
        titleTip: function(){
            // 标签页标题闪烁通知
            window.clearTimeout(topContext['title']._tipTimer_);

            var sTime = new Date().getTime();
            var eTime = sTime;
            var count = 0;

            // 开始
            var start = function(){

                if (G.isNull(topContext['title'].data('title'))) {
                    // 保存原始标题
                    topContext['title'].data('title' , topContext['title'].text());

                }

                var text = topContext['title'].data('title');

                count++;

                if (G.oddEven(count) === 'odd') {
                    // 奇数显示
                    topContext['title'].text('【接收到新消息】' + text);
                } else {
                    // 偶数隐藏
                    topContext['title'].text(text);
                }

                eTime = new Date().getTime();

                if (eTime - sTime <= 5000) {
                    topContext['title']._tipTimer_ = window.setTimeout(start , 100);
                } else {
                    topContext['title'].text(text);
                }
            };

            start();
        } ,

        // 声音消息消息提醒
        addTip: function(roomId , userType , userId){
            // 消息提醒
            var session = this.findSession(roomId);
            session = G(session);

            var tip = session.data('tip');
            tip = parseInt(tip);
            // 铃声提醒
            this._tipPlays[roomId](userType , userId , tip);

            // 检查是否需要增加消息提醒
            var curSession = this.getCurForSession();
            curSession = G(curSession);

            if (!G.isDOMEle(curSession.get()) || curSession.data('id') != roomId) {
                // 新消息提醒
                session.addClass('item-for-new-msg');

                this.titleTip();
            } else {
                // 更新该聊天室的未读消息数量
                this.socket.emptyMsgCount(roomId);
            }
        } ,

        // 会话置顶
        sessionTop: function(roomId){
            var session     = this.findSession(roomId);

            // 会话置顶
            this.top(session);
        } ,

        // 发送图片消息
        sendImage: function(id , dom , data){
            var session = _findDom.findSession(id);
                session = G(session);
            var type = session.data('type');
            var json = G.jsonEncode(data);

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
                this.socket.advoise('json:image' , type , id , json , success);
            } else if (type === 'order') {
                this.socket.order('json:image' , type , id , json , success);
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
                this.socket.advoise('json:file' , type , id , json , success);
            } else if (type === 'order') {
                this.socket.order('json:file' , type , id , json , success);
            } else {
                // 其他类型待添加
            }
        } ,

        // 发送文本数据
        sendText: function(){
            var self = this;
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
                this.socket.advoise(msgType , type , id , text , success);
            } else if (type === 'order') {
                this.socket.order(msgType , type , id , text , success);
            } else {
                // ....其他类型消息
            }

            // 清空输入框
            _context['w_input'].html('');
        } ,

        // 发送文本消息消息
        send: function(){

        } ,

        // 设置消息提醒状态
        _setTipEvent: function(event){
            var self    = this;
            var tar     = G(event.currentTarget);
            var domType = tar.data('domType');
            var roomType = tar.data('type');
            var roomId  = tar.data('id');
            var tip     = tar.data('tip');

            // 设置消息提醒状态
            this.socket.setTip(roomId , tip , function(data){
                // console.log('数据测试....');
                if (data['status'] === 'error') {
                    console.log('状态设置失败');
                    return ;
                }

                data = data['msg'];

                var dom = domType === 'session' ? self.findSession(roomId) : self.findRoom(roomId);
                    dom = G(dom);
                var status = G('.status' , dom.get()).first();

                // 更新节点保存的状态
                dom.data('tip' , tip);

                if (tip == 1) {
                    // 消息提醒
                    status.addClass('hide');
                } else {
                    // 消息不提醒
                    status.removeClass('hide');
                }

                // 提示状态
                layer.msg(data , {
                    time: topContext['tipTime']
                });

                _context['rightKeyFloor'].addClass('hide');
            });
        } ,

        // 用户上下线通知
        notification: function(roomId , userType , userId , status){
            if (topContext['userType'] === userType && topContext['userId'] === userId) {
                console.log('自己通知自己上下线？？无需理会！');
                return ;
            }

            var user = this.findUser(roomId);
                user = G(user);
            var title = G('.title' , user.get()).first();
            var online = G('.online' , title.get()).first();
            var roomUser = this.findRoomUser(roomId , userType , userId);
                roomUser = G(roomUser);

            var _status  = G('.status' , roomUser.get()).first();
            var text    = status == 'on' ? '在线' : '离线';
            var _online = parseInt(online.text());

            roomUser.data('status' , status);

            // console.log(_online , status);

            if (status == 'on') {
                _status.replaceClass('red' , 'green');
                _status.text(text);
                online.text(++_online);
            } else {
                _status.replaceClass('green' , 'red');
                _status.text(text);
                online.text(--_online);
            }
        } ,

        // 聊天室成员同步
        synRoomUser: function(roomType , roomId){
            var self = this;

            this.socket.user(roomId , function(data){
                if (data['status'] === 'error') {
                    console.log(data['msg']);
                    return ;
                }

                data = data['msg'];

                // 添加聊天室用户
                self.addUser(roomType , roomId , data['online'] , data['count']);
                var i       = 0;
                var users   = data['user'];
                var cur     = null;

                for (; i < users.length; ++i)
                {
                    cur = users[i];
                    self.addRoomUser(cur['room_id'] , cur['user_type'] , cur['user_id'] , cur['details']['username'] , cur['details']['thumb'] , cur['status']);
                }
            });
        } ,
        
        // 注册 socket 实例
        _genSocket: function(){
            // 注册 socket 链接
            this.socket = new Socket(this._wsLink , {
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
                        _render.renderPartsForThings(data['room']);
                    } ,
                    // 接收到服务器平台消息时触发
                    advoise: function(data){
                        if (data['status'] === 'error') {
                            return ;
                        }

                        data = data['msg'];

                        // 检查是否是自己发送的消息
                        if (data['_identifier'] === this.identifier) {
                            // 消息是自己发送的
                            // 更新消息的状态
                            console.log('接受到自己发送的信息，请更新消息状态');
                            return ;
                        }
                        _render.renderHistory(data);
                        _misc.ringtonRemind(data['room_id'] , data['user_type'] , data['user_id']);
                        _domOperation.topSession(data['room_id']);
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
                        if (his['link_id'] === this._identifier) {
                            console.log('接收到自己发送的消息，不做处理！！！');
                            return ;
                        }

                        // 添加临时会话
                        _domOperation.addTmpSession(his['type'] , his['room_id'] , his['content']);

                        // 更新临时会话
                        _domOperation.updateTmpSession(his['room_id'] , 'success' , his);

                        // 更新未读消息数量
                        _domOperation.updateMsgCount(his['room_id']);

                        // 添加消息记录
                        _render.renderHistory(his);

                        // 消息提醒
                        _misc.ringtonRemind(his['room_id'] , his['user_type'] , his['user_id']);

                        // 会话置顶
                        _domOperation.topSession(his['room_id']);
                    } ,
                    // 新增会话时回调
                    session: function(data){
                        if (data['status'] === 'error') {
                            console.log(data['msg']);
                            return ;
                        }

                        data = data['msg'];
                        // 添加房间
                        self.addRoom(data['type'] , data['id'] , data['_name'] , data['tip']);
                        // 添加会话
                        self.addSession(data['type'] , data['id'] , data['_name'] , data['tip'] , data['count'] , data['sort']);
                        // 添加窗口
                        self.addWindow(data['type'] , data['id'] , data['_name']);
                        // 消息记录同步（请手动同步！！）
                        this.syn(data['id']);
                        // 聊天室成员同步
                        self.synRoomUser(data['type'] , data['id']);
                        // 聊天室信息同步

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
                    // 用户上下线通知
                    notification: function(data){
                        return ;
                        if (data['status'] === 'error') {
                            console.log(data['msg']);
                            return ;
                        }

                        data = data['msg'];

                        if (data['user_type'] == this._userType && data['user_id'] == this._userId) {
                            return ;
                        }

                        // 用户上下线通知
                        self.notification(data['room_id'] , data['user_type'] , data['user_id'] , data['status']);
                    } ,
                    // 聊天室增加成员时通知
                    addUser: function(data){
                        if (data['status'] === 'error') {
                            console.log(data['msg']);
                            return ;
                        }

                        data = data['msg'];

                        // console.log('某个聊天室新增成员' , data);
                        self.addRoomUser(data['room_id'] , data['user_type'] , data['user_id'] , data['username'] , data['thumb'] , data['status']);
                        self.incrUserCount(data['room_id']);
                    } ,
                    // 接受到未读消息数量时候
                    unreadMsgCount: function(data){
                        if (data['status'] === 'error') {
                            console.log(data['msg']);
                            return ;
                        }

                        data = data['msg'];
                    } ,
                }
            });
        } ,

        // 显示表情包
        showFace: function(){
            _context['w_face'].data('status' , 'show');
            _context['w_listForFace'].removeClass('hide');
        } ,

        // 隐藏表情包
        hideFace: function(){
            _context['w_face'].data('status' , 'hide');
            _context['w_listForFace'].addClass('hide');
        } ,

        // 表情包
        _faceEvent: function(event){
            event.stopPropagation();

            var tar = G(event.currentTarget);
            var status = tar.data('status');

            if (status === 'hide') {
                this.showFace();
            } else {
                this.hideFace();
            }
        } ,

        // 图片上传
        _selectImages: function(){
            _context['w_selectImages'].get().click();
        } ,

        // 文件上传
        _selectFiles: function(){
            _context['w_selectFiles'].get().click();
        } ,

        // 更新图片发送状态为失败
        uploadHistory: function(){

        } ,

        // 图片上传
        _uploadImages: function(event){
            var id = _find.getSessionId();

            if (id === false) {
                layer.msg('请选择聊天室 或 会话' , {
                    time: topContext['time']
                });
                return ;
            }

            var self    = this;
            var tar     = G(event.currentTarget);
            var files   = tar.get().files;

            if (files.length === 0) {
                return ;
            }

            var fileList    = [];
            var i           = 0;
            var cur         = null;

            for (; i < files.length; ++i)
            {
                cur = files[i];
                fileList.push(cur);
            }

            var upload = function(file){
                var formData = new FormData();
                    formData.append('images[]' , file);
                    formData.append('room_id' , id);
                    formData.append('user_type' , topContext['userType']);
                    formData.append('user_id' , topContext['userId']);

                G.getBlobUrl(file , function(src){
                    // 添加临时会话记录
                    _domOperation.addTmpSession('json:image' , id);

                    // 添加临时聊天记录
                    var dom = _render.appendTmpHistoryForImage(id , src);

                    ajax({
                        url: _links['uploadImages'] ,
                        method: 'post' ,
                        send: formData ,
                        success: function(data){
                            if (data['success'].length === 0) {
                                _domOperation.updateTmpSession(id , 'error');
                                _domOperation.updateTmpHistoryForImage(dom , 'error');
                                return ;
                            }

                            var image = data['success'][0];

                            // 发送数据
                            self.sendImage(id , dom , image);
                        } ,
                        error: function(msg){
                            _domOperation.updateTmpSession(id , 'error');
                            _domOperation.updateTmpHistoryForImage(dom , 'error');
                        }
                    });

                    if (fileList.length >= 1) {
                        upload(fileList.shift());
                    }
                });
            };

            upload(fileList.shift());
        } ,

        // 文件上传
        _uploadFiles: function(event){
            var id = _find.getSessionId();

            if (id === false) {
                layer.msg('请选择聊天室 或 会话' , {
                    time: topContext['time']
                });
                return ;
            }

            var self    = this;
            var tar     = G(event.currentTarget);
            var files   = tar.get().files;

            if (files.length === 0) {
                return ;
            }

            var fileList    = [];
            var i           = 0;
            var cur         = null;

            for (; i < files.length; ++i)
            {
                cur = files[i];
                fileList.push(cur);
            }

            var upload = function(file){
                var formData = new FormData();
                formData.append('files[]' , file);
                formData.append('room_id' , id);
                formData.append('user_type' , topContext['userType']);
                formData.append('user_id' , topContext['userId']);

                G.getBlobUrl(file , function(src){
                    // 添加临时会话记录
                    _domOperation.addTmpSession('json:file' , id);

                    // 添加临时聊天记录
                    var dom = _render.appendTmpHistoryForFile(id);

                    ajax({
                        url: _links['uploadFiles'] ,
                        method: 'post' ,
                        send: formData ,
                        success: function(data){
                            if (data['success'].length === 0) {
                                _domOperation.updateTmpSession(id , 'error');
                                _domOperation.updateTmpHistoryForFile(dom , 'error');
                                return ;
                            }

                            var _file = data['success'][0];

                            // 发送数据
                            self.sendFile(id , dom , _file);
                        } ,
                        error: function(msg){
                            _domOperation.updateTmpSession(id , 'error');
                            _domOperation.updateTmpHistoryForFile(dom , 'error');
                        }
                    });

                    if (fileList.length >= 1) {
                        upload(fileList.shift());
                    }
                });
            };

            upload(fileList.shift());
        } ,

        // 发送正在咨询的订单信息
        sendOrder: function(text){
            var info = this.getCurRoomInfo('both');

            this.sendText(info['type'] , info['id'] , text);
        } ,

        // 输入框
        _inputKeyUpEvent: function(event){
            var tar = G(event.currentTarget);
            var value = tar.html();

            if (event.keyCode === 13) {
                this.sendText();
            }

            var session = _findDom.findCurSession();

            if (session === false) {
                return ;
            }

            session = G(session);

            var id = session.data('id');

            _input.saveText(id , value);
        } ,

        // 右键点击事件
        _rightKeyEvent: function(){
            _context['rightKeyFloor'].addClass('hide');
        } ,

        /**
         * ************
         * 注册事件
         * ************
         */
        _defineEvent: function(){
            var self = this;

            _context['w_input'].loginEvent('keyup' , this._inputKeyUpEvent.bind(this) , true , false);

            _context['w_send'].loginEvent('click' , this.sendText.bind(this) , true , false);

            _context['tipOption'].loginEvent('click' , this._setTipEvent.bind(this) , true , false);

            // 屏幕单击事件
            topContext['win'].loginEvent('click' , this._rightKeyEvent.bind(this) , true , false);

            // 插入表情
            _context['w_face'].loginEvent('click' , this._faceEvent.bind(this) , true , false);
            topContext['win'].loginEvent('click' , this.hideFace.bind(this) , true , false);

            // 上传图片
            _context['w_picture'].loginEvent('click' , this._selectImages.bind(this) , true , false);
            _context['w_file'].loginEvent('click' , this._selectFiles.bind(this) , true , false);
            
            _context['w_selectImages'].loginEvent('change' , this._uploadImages.bind(this) , true , false);
            _context['w_selectFiles'].loginEvent('change' , this._uploadFiles.bind(this) , true , false);

            // 阻止事件冒泡
            _context['rightKeyFloor'].loginEvent('click' , G.stopPropagation , true , false);
            _context['w_listForFace'].loginEvent('click' , G.stopPropagation , true , false);
        } ,
        
        // 程序初始化
        _run: function(){
            this._initStaticArgs();
            this._initStaticHTML();
            this._initStatic();
            this._initDynamicArgs();
            this._initDynamicHTML();
            this._initDynamic();
            this._genSocket();
            this._defineEvent();
        }
    };

    return System;
})();