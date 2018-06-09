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

        _initStaticArgs: function(){

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

        // 设置消息提醒状态
        _setTipEvent: function(event){
            var self    = this;
            var tar     = G(event.currentTarget);
            var domType = tar.data('domType');
            var roomType = tar.data('type');
            var roomId  = tar.data('id');
            var tip     = tar.data('tip');

            // 设置消息提醒状态
            _socket.setTip(roomId , tip , function(data){
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

        // 表情包
        _faceEvent: function(event){
            event.stopPropagation();

            var tar = G(event.currentTarget);
            var status = tar.data('status');

            if (status === 'hide') {
                _domOperation.showFace();
            } else {
                _domOperation.hideFace();
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
                            _socketOperation.sendImage(id , dom , image);
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
                            _socketOperation.sendFile(id , dom , _file);
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

        // 输入框
        _inputKeyUpEvent: function(event){
            var tar = G(event.currentTarget);
            var value = tar.html();

            if (event.keyCode === 13) {
                _socketOperation.sendText();
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

        // 搜索聊天室事件
        _searchRoomEvent: function(event){
            var tar = G(event.currentTarget);
            var key = tar.val();

            var items = G('.item' , _context['r_items'].get());

            var i   = 0;
            var cur = null;

            for (; i < items.length; ++i)
            {
                cur = items.jump(i , true);

                if (!G.isValidVal(key)) {
                    cur.removeClass('hide');
                    continue ;
                }

                var name = G('q:.content .name' , cur.get());
                var _name = name.text();

                if (_name.search(key) < 0) {
                    cur.addClass('hide');
                } else {
                    cur.removeClass('hide');
                }
            }
        } ,

        _searchSessionEvent: function(event){
            var tar = G(event.currentTarget);
            var key = tar.val();

            var items = G('.item' , _context['s_items'].get());

            var i   = 0;
            var cur = null;

            for (; i < items.length; ++i)
            {
                cur = items.jump(i , true);

                if (!G.isValidVal(key)) {
                    cur.removeClass('hide');
                    continue ;
                }

                var name = G('q:.content .info .name' , cur.get());
                var _name = name.text();

                if (_name.search(key) < 0) {
                    cur.addClass('hide');
                } else {
                    cur.removeClass('hide');
                }
            }
        } ,

        /**
         * ************
         * 注册事件
         * ************
         */
        _defineEvent: function(){
            var self = this;

            _context['w_input'].loginEvent('keyup' , this._inputKeyUpEvent.bind(this) , true , false);

            _context['w_send'].loginEvent('click' , _socketOperation.sendText.bind(_socketOperation) , true , false);

            _context['tipOption'].loginEvent('click' , this._setTipEvent.bind(this) , true , false);

            // 屏幕单击事件
            topContext['win'].loginEvent('click' , this._rightKeyEvent.bind(this) , true , false);

            // 插入表情
            _context['w_face'].loginEvent('click' , this._faceEvent.bind(this) , true , false);
            topContext['win'].loginEvent('click' , _domOperation.hideFace.bind(_domOperation) , true , false);

            // 上传图片
            _context['w_picture'].loginEvent('click' , this._selectImages.bind(this) , true , false);
            _context['w_file'].loginEvent('click' , this._selectFiles.bind(this) , true , false);
            
            _context['w_selectImages'].loginEvent('change' , this._uploadImages.bind(this) , true , false);
            _context['w_selectFiles'].loginEvent('change' , this._uploadFiles.bind(this) , true , false);

            // 阻止事件冒泡
            _context['rightKeyFloor'].loginEvent('click' , G.stopPropagation , true , false);
            _context['w_listForFace'].loginEvent('click' , G.stopPropagation , true , false);

            // 搜索事件
            _context['r_text'].loginEvent('keyup' , this._searchRoomEvent.bind(this) , true , false);
            _context['s_text'].loginEvent('keyup' , this._searchSessionEvent.bind(this) , true , false);
        } ,
        
        // 程序初始化
        _run: function(){
            this._initStaticArgs();
            this._initStaticHTML();
            this._initStatic();
            this._initDynamicArgs();
            this._initDynamicHTML();
            this._initDynamic();
            this._defineEvent();
        }
    };

    return System;
})();