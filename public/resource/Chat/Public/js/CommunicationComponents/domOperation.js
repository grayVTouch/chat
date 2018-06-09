/**
 * *****************************
 * author 陈学龙 2018-05-15
 * 对 dom 的各种操作封装
 * *****************************
 */

// 采用下划线命名仅是为了避免名称冲突
var _domOperation = {

    // 移除空节点
    removeEmpty: function(container){
        var emptys  = G('.empty' , container);
        var i       = 0;
        var cur     = null;

        for (; i < emptys.length; ++i)
        {
            cur = G(emptys.get()[i]);

            cur.get().parentNode.removeChild(cur.get());
        }
    } ,

    // 会话窗口：隐藏默认界面
    hideDefaultForWindows: function(){
        _context['w_default'].addClass('hide');
    } ,

    // 会话窗口隐藏默认界面
    hideDefaultForRoomUser: function(){
        _context['u_default'].addClass('hide');
    } ,

    // 聊天室项：隐藏默认界面
    hideDefaultForThings: function(){
        _context['t_default'].addClass('hide');
    } ,

    // 显示聊天控制面板
    showChat: function(){
        _context['w_chat'].removeClass('hide');
    } ,

    // 指定会话
    topSession: function(id){
        var session = _findDom.findSession(id);
            session = G(session);

        // 已经是置顶元素
        if (session.data('top') == 1) {
            return ;
        }

        // 节点置顶
        var p = G(session.get().parentNode);

        // 当前已经是置顶元素了
        if (p.children({} , false , true) === 1) {
            return ;
        }

        // 获取所有非置顶元素
        var first = _context['s_items'].children({
            tagName: 'div' ,
            'data-top': 0
        } , false , true).first();

        // 首元素 = 当前元素，即当前元素已经是置顶元素了
        if (first.get() === session.get()) {
            return ;
        }

        G.insertBefore(p.remove(session.get()) , first.get());

        // 更新服务器端排序权重
        _socket.updateRoomSort(id , 'n' , function(data){
            console.log('聊天室置顶操作结果：' , data);
        });
    } ,

    // 切换显示窗口
    switchWindow: function(id){
        var win = _findDom.findWindow(id);
            win = G(win);

        var windows = G('.window' , _context['w_windows'].get());

        win.highlight('hide' , windows.get() , true);
    } ,

    // 切换聊天室成员容器
    switchGroup: function(id){
        var group = _findDom.findGroup(id);
            group = G(group);
        var groups = G('.group' , _context['u_userGroup'].get());

        group.highlight('hide' , groups.get() , true);
    } ,

    // 切换part
    switchPartForThings: function(id){
        var part = _findDom.findPartForThings(id);
            part = G(part);
        var parts = G('.part' , _context['t_roomForThings'].get());

        part.highlight('hide' , parts.get() , true);
    } ,

    // 切换会话带来的一系列操作封装
    // 做更少的事实现我们想要的结果
    switch: function(id){
        var self = this;
        var session = _findDom.findSession(id);
            session = G(session);

        var sessions = G('.item' , _context['s_items'].get());
            session.highlight('cur' , sessions.get());

        // 隐藏默认界面
        this.hideDefaultForWindows();
        this.hideDefaultForRoomUser();
        this.hideDefaultForThings();

        // 切换显示默认界面
        this.switchWindow(id);
        this.showChat();
        this.switchGroup(id);
        this.switchPartForThings(id);

        // 滚动到底部
        this.toBottomForHistory(id);

        // 更新该聊天室未读消息数量
        _socket.emptyMsgCount(id , function(data){
            // 设置所有消息已读成功后，设置会话的消息标识
            self.setMsgFlag(id , 'old');
        });
    } ,

    // 更新聊天室项
    updatePartForThings: function(id){
        var part = _findDom.findPartForThings(id);
            part = G(part);
        var type    = part.data('type');
        var identifier = null;

        if (type === 'order') {
            var orderConsoltation = G('q:.nav-container .menu-switch .order-consoltation' , part.get());
                orderConsoltation.removeClass('hide');

            identifier = orderConsoltation.data('identifier');
        } else if (type === 'advoise') {
            var roomInfo = G('q:.nav-container .menu-switch .room-info' , part.get());
            identifier = roomInfo.data('identifier');
        } else {
            // 其他类型的咨询，待扩展 ....
        }

        _misc.menuSwitchSet[id].switch(identifier);
    } ,

    // 去除 or 添加新消息标识
    setMsgFlag: function(id , type){
        var typeRange = ['new' , 'old'];
        type = G.contain(type , typeRange) ? type : 'new';

        var session = _findDom.findSession(id);
            session = G(session);

        var className = '';
        if (type === 'new') {
            session.addClass('item-for-new-msg');
        } else {
            session.removeClass('item-for-new-msg');
        }
    } ,

    // 聊天记录滚动到底部
    toBottomForHistory: function(id){
        var win = _findDom.findWindow(id);
            win = G(win);
        var isBottom = win.data('isBottom');

        // 表明之前就不是在底部的
        // 仅上次的状态是在底部的
        // 新增消息后，才滚动到底部
        if (isBottom !== 'y') {
            return ;
        }

        var list = G('q:.history .list' , win.get());

        list.bottom(topContext['time']);
    } ,

    // 平台咨询 & 订单咨询相关事物切换
    // 平台咨询没有正在咨询的订单，仅有聊天室信息
    switchSubjectForPartOfThings: function(type , id){

    } ,

    // 更新会话（显示最近一条通讯记录）
    updateSessionForText: function(data){
        /*
        var dataStruct = {
            room_id: '' ,
            username: '' ,
            content: '' ,
            create_time: '' ,
        };
        */
        var session = _findDom.findSession(data['room_id']);

        session = G(session);

        var text    = G('.text' , session.get()).first();
        var time    = G('.time' , session.get()).first();

        // 格式化显示时间
        var _time = formatTime(data['create_time']);
        var content = _editor.html(data['content']);

        text.html(data['username'] + ': ' + content);
        time.text(_time);
    } ,

    // file: 更新会话记录
    updateSessionForImage: function(data){
        /*
        var dataStruct = {
            room_id: '' ,
            username: '' ,
            create_time: ''
        };
        */

        var session = _findDom.findSession(data['room_id']);

        session = G(session);

        var text    = G('.text' , session.get()).first();
        var time    = G('.time' , session.get()).first();

        // 格式化显示时间
        var _time = formatTime(data['create_time']);

        text.html(data['username'] + ': [图片]');
        time.text(_time);
    } ,

    // file: 更新会话记录
    updateSessionForFile: function(data){
        /*
        var dataStruct = {
            room_id: '' ,
            username: '' ,
            create_time: ''
        };
        */

        var session = _findDom.findSession(data['room_id']);

        session = G(session);

        var text    = G('.text' , session.get()).first();
        var time    = G('.time' , session.get()).first();

        // 格式化显示时间
        var _time = formatTime(data['create_time']);

        text.html(data['username'] + ': [文件]');
        time.text(_time);
    } ,



    // 更新聊天室会话排列顺序
    updateRoomSort: function(roomId){
        this.socket.updateRoomSort(roomId , 'n' , function(data){
            console.log('更新会话排列顺序结果：' , data);
        });
    } ,

    // 更新消息，自动处理不同消息类型的问题
    updateHistory: function(){

    } ,

    // 更新给定消息相关参数&状态设置
    updateTmpHistoryForText: function(id , dom , data){
        dom = G(dom);

        var imageForStatus = G('q:.info .msg .text .object .image-for-status' , dom.get()).first();

        if (data['status'] === 'error') {
            imageForStatus.setAttr('src' , _errorImageForIco);

            // 更新数据
            var tip     = G('q:.info .tip' , dom.get());
            var tipText = G('.tip-text' , tip.get()).first();

            tipText.text('发送失败：' + data['msg']);
            tip.removeClass('hide');

            this.toBottomForHistory(id);
            return ;
        }

        data = data['msg'];

        // 移除状态
        imageForStatus.addClass('hide');

        var time = G('q:.info .user .time' , dom.get());

        // 表示已经发送成功的消息
        dom.setAttr('isTmp' , 'n');
        dom.data('identifier' , data['identifier']);

        time.text(data['create_time']);
    } ,

    // 更新图片消息状态
    updateTmpHistoryForImage: function(dom , status , data){
        dom = G(dom);

        var _status = G('q:.info .msg .object .status' , dom.get());

        if (status === 'error') {
            // 更新数据
            // 更新数据
            var loading     = G('.loading' , _status.get()).first();
            var error       = G('.error' , _status.get()).first();

            loading.addClass('hide');
            error.removeClass('hide');
            return ;
        }

        var time = G('q:.info .user .time' , dom.get());

        // 移除状态
        _status.addClass('hide');

        // 表示已经发送成功的消息
        dom.setAttr('isTmp' , 'n');
        dom.data('identifier' , data['identifier']);

        time.text(data['create_time']);
    } ,

    updateTmpHistoryForFile: function(dom , status , data){
        dom = G(dom);

        var _status = G('q:.info .msg .object .status' , dom.get());

        if (status === 'error') {
            // 更新数据
            var loading     = G('.loading' , _status.get()).first();
            var error       = G('.error' , _status.get()).first();

            loading.addClass('hide');
            error.removeClass('hide');
            return ;
        }

        var object  = G('q:.info .msg .object' , dom.get());
        var name    = G('.name' , object.get()).first();
        var time    = G('q:.info .user .time' , dom.get());

        // 移除状态
        _status.addClass('hide');

        // 表示已经发送成功的消息
        dom.setAttr('isTmp' , 'n');
        dom.data('identifier' , data['identifier']);

        var _data = G.jsonDecode(data['content']);

        object.data('url' , _data['url']);
        name.text(_data['name']);

        time.text(data['create_time']);
    } ,

    // 订单：更新临时记录
    updateTmpHistoryForOrder: function(dom , status , data){
        dom = G(dom);

        var image = G('q:.info .msg .object .image' , dom.get());

        if (status === 'error') {
            image.setAttr('src' , _errorImageForIco);

            // 更新数据
            var tip     = G('q:.info .tip' , dom.get());
            var tipText = G('.tip-text' , tip.get()).first();

            tipText.text('发送失败：' + data['msg']);
            tip.removeClass('hide');

            this.toBottomForHistory(data['room_id']);
            return ;
        }

        var object  = G('q:.info .msg .object' , dom.get());
        var time    = G('q:.info .user .time' , dom.get());

        // 移除状态
        image.addClass('hide');

        // 表示已经发送成功的消息
        dom.setAttr('isTmp' , 'n');
        dom.data('identifier' , data['identifier']);

        var _data = G.jsonDecode(data['content']);

        object.data('url' , _data['url']);

        time.text(data['create_time']);
    } ,

    // 设置聊天室最早一条消息的标识符
    setIdentifierForFirstHistoryOfWindow: function(roomId){
        var win = _findDom.findWindow(roomId);
            win = G(win);

        var identifier = _find.getIdentifierForFirstHistory(roomId);

        // 设置聊天室最早一条聊天记录的标识符
        win.data('identifier' , identifier);
    } ,

    // 消息发送成功后，更新相关元素
    update: function(){
        var dom     = null;
        var updateStatus = null;

        // 发送的用户先添加数据
        dom = this.addTmpHistory(roomId, text);

        this.setTmpSession(roomId , text);

        // 消息发送成功后，更新相关状态
        updateStatus = function(data){
            if (data['status'] === 'error') {
                self.updateTmpSession('error' , roomId , data['create_time']);
                self.updateTmpHistory(dom , 'error' , data['msg']['content']);
                return ;
            }

            data = data['msg'];

            // 更新记录
            self.updateTmpHistory(dom , 'success' , null , data['identifier'] , data['create_time']);

            // 更新会话
            self.updateTmpSession('success' , roomId , data['create_time']);
        };
    } ,

    // 添加临时会话
    addTmpSession: function(type , roomId , content){
        var session = _findDom.findSession(roomId);
            session = G(session);
        var msg     = G('q:.content .info .msg' , session.get());
        var status  = G('.status' , msg.get()).first();
        var image   = G('.image' , status.get()).first();
        var text    = G('.text' , msg.get()).first();
        var time    = G('q:.flag .time' , session.get());

        if (type === 'text') {
            content = _editor.html(content);
        } else if (type === 'json:image') {
            content = '[图片]';
        } else if (type === 'json:file') {
            content = '[文件]';
        } else if (type === 'json:order') {
            content = '[订单]';
        } else {
            content = '[其他模板消息，请添加！！]';
        }

        status.removeClass('hide');
        text.html(topContext['username'] + ': ' + content);
        time.html('...');
    } ,

    // 更新会话顺序
    updateTmpSession: function(id , status , data){
        var session = _findDom.findSession(id);
            session = G(session);
        var msg     = G('q:.content .info .msg' , session.get());
        var _status  = G('.status' , msg.get()).first();
        var image   = G('.image' , _status.get()).first();

        if (status === 'error') {
            _status.removeClass('hide');
            image.setAttr('src' , _errorImageForIco);
            return ;
        }

        var time = G('q:.flag .time' , session.get());
        var _time = formatTime(data['create_time']);

        _status.addClass('hide');
        time.html(_time);
    } ,

    // 更新会话状态
    updateMsgCount: function(id){

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

    // 更新在线在线人数 & 总人数
    setGroup: function(id , online , count){
        if (!_findDom.existsGroup(id)) {
            return ;
        }

        var _online = G(_findDom.findOnline(id));
        var _count  = G(_findDom.findCount(id));

        _online.text(online);
        _count.text(count);
    } ,

    updateGroup: function(data){
        this.setGroup(data['room_id'] , data['online'] , data['count']);
    } ,

    // 更新用户状态
    updateUser: function(data){
        if (!_findDom.existsGroup(data['room_id']) || !_findDom.existsUser(data['room_id'] , data['user_type'] , data['user_id'])) {
            return ;
        }

        var user = _findDom.findUser(data['room_id'] , data['user_type'] , data['user_id']);
            user = G(user);
        var status = G('.status' , user.get()).first();

        // status.removeClass(['on' , 'off']);
        status.removeClass('on');
        status.removeClass('off');
        status.addClass(data['real_status']);
        status.text(data['real_status_explain']);
    } ,

    // 用户上下线通知
    notification: function(data){
        this.updateGroup(data);
        this.updateUser(data);
    } ,

    // 清除正在咨询的订单
    clearOrderConsultation: function(data){
        /*
        var dataStruct = {
            room_id: '' ,
            order_id: ''
        };
        */

        var part = _findDom.findPartForThings(data['room_id']);
            part = G(part);
        var advoiseThings = G('q:.c-items .advoise-things' , part.get());

        // 清空正在咨询的订单
        advoiseThings.html('');
    } ,

};