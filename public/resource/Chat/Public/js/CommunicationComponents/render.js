/**
 * *****************************
 * author 陈学龙 2018-05-15
 * js 初始化各种类型的 dom 列表
 * *****************************
 */

// 采用下划线命名仅是为了避免名称冲突
var _render = {
    // 聊天室渲染：多条
    renderRooms: function(data){
        var html = [];

        if (data.length === 0) {
            var empty = _dom.getEmpty(true);
            _context['r_items'].append(empty);
            return ;
        }

        var i = 0;
        for (; i < data.length; ++i)
        {
            this.renderRoom(data[i]);
        }
    } ,

    // 聊天室渲染：单条
    renderRoom: function(data){
        this.appendRoom(data);
    } ,

    // 会话：设置多个
    renderSessions: function(data){
        if (data.length === 0) {
            var empty = _dom.getEmpty(true);
            _context['s_items'].append(empty);
            return ;
        }

        var i = 0;
        for (; i < data.length; ++i)
        {
            this.renderSession(data[i]);
        }
    } ,

    // 会话：设置单个
    renderSession: function(data){
        // 如果已经存在，不做处理
        if (_findDom.existsSession(data['room_id'])) {
            return ;
        }

        // 添加会话
        this.appendSession(data);

        var his = data['history'];

        if (his.length === 0) {
            // 不存在记录，不做处理
            return ;
        }

        // 最近一条记录
        var last = his[his.length - 1];

        _domOperation.setSessionRecentRecord(last);
    } ,

    // 更新临时会话
    setTmpSessionOfImage: function(roomId){
        var session = this.findSession(roomId);
        session = G(session);
        var msg     = G('.msg' , session.get()).first();
        var status  = G('.status' , msg.get()).first();
        var text    = G('.text' , msg.get()).first();
        var time    = G('.time' , session.get()).first();

        status.removeClass('hide');
        text.html(topContext['username'] + ': [图片]');
        time.text('...');
    } ,

    // 更新临时会话
    setTmpSessionOfFile: function(roomId){
        var session = this.findSession(roomId);
        session = G(session);
        var msg     = G('.msg' , session.get()).first();
        var status  = G('.status' , msg.get()).first();
        var text    = G('.text' , msg.get()).first();
        var time    = G('.time' , session.get()).first();

        status.removeClass('hide');
        text.html(topContext['username'] + ': [文件]');
        time.text('...');
    } ,

    // 添加会话 + 置顶 + 选中项
    addSession: function(type , id , name , tip , count , sort){
        var session = null;

        if (this.existsSession(id)) {
            session = this.findSession(id);
            session = G(session);
        } else {
            // 移除空节点
            this.removeEmpty(_context['s_items'].get());

            // 在已有的会话列表中添加新的会话
            session = this.getDomForSession(type , id , name , tip , count , sort , true);
            session = G(session);

            // 添加会话
            var items = G('.item' , _context['s_items'].get());

            if (items.length === 0) {
                _context['s_items'].append(session.get());
            } else {
                var first = items.first();
                _context['s_items'].get().insertBefore(session.get() , first.get());
            }

            // 定义会话事件
            this.defineSessionEvent(session.get());

            this.registerMusic(id);
        }

        // 消息置顶
        this.top(session.get());

        // 更新会话顺序
        this.updateRoomSort(id);
    } ,

    // 添加聊天室
    appendRoom: function(data){
        if (_findDom.existsRoom(data['room_id'])) {
            return ;
        }

        var dom = _dom.getRoom(data , true);

        _context['r_items'].append(dom);

        _misc.registerAudio(data['id']);

        _event.defineRoomEvent(dom);
    } ,

    // 添加会话
    appendSession: function(data){
        if (_findDom.existsSession(data['room_id'])) {
            return ;
        }

        var dom = _dom.getSession(data , true);

        // 添加节点
        _context['s_items'].append(dom);

        _event.defineSessionEvent(dom);
    } ,

    // 添加窗口节点
    appendWindow: function(data){
        if (_findDom.existsWindow(data['room_id'])) {
            return ;
        }

        var win = _dom.getWindow(data , true);

        _context['w_windows'].append(win);

        // 定义窗口事件
        _event.defineWindowEvent(win);

        return win;
    } ,

    // 聊天窗口渲染：多条
    renderWindows: function(data){
        // 如果没有不存在聊天室记录
        if (data.length === 0) {
            return ;
        }

        var i = 0;
        for (; i < data.length; ++i)
        {
            this.renderWindow(data[i]);
        }
    } ,

    // 聊天窗口渲染：单条
    renderWindow: function(data){
        if (_findDom.existsWindow(data['room_id'])) {
            return ;
        }

        // 添加窗口节点
        this.appendWindow(data);

        // 渲染聊天室窗口
        this.renderHistorys(data['room_type'] , data['room_id'] , data['history']);
    } ,

    // 渲染历史记录：多条
    renderHistorys: function(roomType , roomId , his){
        // 无聊天记录，不做处理
        if (his.length === 0) {
            return ;
        }

        var win = _findDom.findWindow(roomId);
        // 填充聊天窗口：添加聊天记录
        var list    = G('q:.history .list' , win);

        // 添加查看更多按钮
        var domForViewMore = _dom.getViewMore({
            room_type: roomType ,
            room_id: roomId
        } , true);

        list.append(domForViewMore);
        _event.defineViewMoreEvent(domForViewMore);

        var i   = 0;
        var cur = null;
        // 添加聊天记录
        for (i = 0; i < his.length; ++i)
        {
            cur = his[i];
            this.renderHistory(cur);
        }

        // 设置聊天记录最早一条记录标识符
        _domOperation.setIdentifierForWindow(roomId);
    } ,

    // 渲染历史聊天记录
    renderHistory: function(data){
        if (data['type'] === 'text') {
            this.appendHistoryForText(data);
        } else if (data['type'] === 'json:image') {
            this.appendHistoryForImage(data);
        } else if (data['type'] === 'json:file') {
            this.appendHistoryForFile(data);
        } else {
            // 其他类型待补
        }
    } ,


    // 添加历史记录
    appendHistoryForText: function(data){
        // 检查历史记录是否存在（通常需要这么做！但是这边不需要！！）
        var win = _findDom.findWindow(data['room_id']);
            win = G(win);
        var list = G('q:.history .list' , win.get());
        var from = _misc.getType(data['user_type'] , data['user_id']);
        var dom  = _dom.getHistoryForText(from , data);

        list.append(dom);

        // 滚动到底部
        _domOperation.toBottomForHistory(data['room_id']);

        return dom;
    } ,

    // 添加图片
    appendHistoryForImage: function(data){
        var win = _findDom.findWindow(data['room_id']);
            win = G(win);
        var list = G('q:.history .list' , win.get());

        // 通过用户类型 和 用户 id 来确定
        var type = _misc.getType(data['user_type'] , data['user_id']);
        var dom  = _dom.getHistoryForImage(type , data , true);

        // 定义图片相关事件
        _event.defineHistoryForImageEvent(dom);

        list.append(dom);

        if (win.data('isBottom')) {
            list.bottom(topContext['time']);
        }

        return dom;
    } ,

    // 添加文件
    appendHistoryForFile: function(data){
        var win = _findDom.findWindow(data['room_id']);
            win = G(win);
        var list = G('q:.history .list' , win.get());
        // 通过用户类型 和 用户 id 来确定
        var type = _misc.getType(data['user_type'] , data['user_id']);
        var dom  = _dom.getHistoryForFile(type , data , true);

        list.append(dom);

        _event.defineHistoryForFileEvent(dom);

        if (win.data('isBottom')) {
            list.bottom(topContext['time']);
        }

        return dom;
    } ,

    // 渲染聊天室成员容器：多个
    renderGroups: function(data){
        // 如果没有聊天室数据，跳过
        if (data.length === 0) {
            return ;
        }

        var i = 0;
        for (; i < data.length; ++i)
        {
            this.renderGroup(data[i]);
        }
    } ,

    // 渲染聊天室成员容器：单个
    renderGroup: function(data){
        if (_findDom.existsGroup(data['room_id'])) {
            return ;
        }

        // 添加聊天室成员容器
        this.appendGroup(data);

        var user = data['user']['user'];

        // 渲染聊天室成员
        this.renderUsers(user);
    } ,

    // 渲染聊天室成员：多个
    renderUsers: function(data){
        var i = 0;

        // 填充聊天室容器：添加用户
        for (i = 0; i < data.length; ++i)
        {
            this.renderUser(data[i]);
        }
    } ,

    // 渲染聊天室成员：单个
    renderUser: function(data){
        this.appendUser(data);
    } ,

    // 渲染聊天室项：多个
    renderPartsForThings: function(data){
        if (data.length === 0) {
            return ;
        }

        var i = 0;
        for (; i < data.length; ++i)
        {
            this.renderPartForThings(data[i]);
        }
    } ,

    // 渲染聊天室相关信息：多个
    renderPartForThings: function(data){
        if (_findDom.existsPartForThings(data['room_id'])) {
            return ;
        }

        // 添加聊天室项
        this.appendPartForThings(data);

        // 添加聊天室相关内容
        this.renderRoomForThings(data);
    } ,

    // 渲染聊天室相关信息：单个
    renderRoomForThings: function(data){
        var part = _findDom.findPartForThings(data['room_id']);
            part = G(part);
        var roomInfo = G('q:.c-items .room-info' , part.get());
        var dom = _dom.getRoomForThings(data , true);

        roomInfo.html('');
        roomInfo.append(dom);
    } ,

    // 添加用户
    appendGroup: function(data){
        if (_findDom.existsGroup(data['room_id'])) {

        }
        var group = _dom.getGroup(data , true);

        // 添加节点
        _context['u_userGroup'].append(group);

        return group;
    } ,

    // 添加聊天室用户
    appendUser: function(data){
        if (_findDom.existsUser(data['room_id'] , data['user_type'] , data['user_id'])) {
            return ;
        }

        var group   = _findDom.findGroup(data['room_id']);
            group   = G(group);
        var users   = G('.users' , group.get()).first();
        var dom     = _dom.getUser(data , true);

        users.append(dom);

        _event.defineUserEvent(dom);

        return dom;
    } ,

    // 添加聊天室项
    appendPartForThings: function(data){
        if (_findDom.existsPartForThings(data['room_id'])) {
            return ;
        }

        var dom = _dom.getPartForThings(data , true);

        _context['t_roomForThings'].append(dom);

        _event.definePartForThingsEvent(dom);

        // 根据聊天室类型对 dom 展示内容进行控制
        _domOperation.updatePartForThings(data['room_id']);
    } ,

    // 查看更多时添加的历史聊天记录
    insertHistory: function(data){
        var win     = _findDom.findWindow(data['room_id']);
            win = G(win);
        var list    = G('q:.history .list' , win.get());
        var type    = _misc.getType(data['user_type'] , data['user_id']);
        var dom     = null;

        if (data['type'] === 'text') {
            dom  = _dom.getHistoryForText(type , data , true);
        } else if (data['type'] === 'json:image') {
            dom  = _dom.getHistoryForImage(type , data , true);
        } else if (data['type'] === 'json:file') {
            dom  = _dom.getHistoryForFile(type , data , true);
        } else {
            // 待补充的模板内容
        }

        var first = _findDom.getHistoryForFirst(data['room_id']);

        if (first === false) {
            // 没有记录，直接添加
            list.append(dom);
        } else {
            // 存在记录
            G.insertBefore(dom , first);
        }
    } ,

    // --------------------- 以上都是修改过的代码！！！
    // --------------------- 一下都是未修改过的代码！！！

    // 填充聊天室信息
    fillRoomForRelatedThings: function(type , name , from , to , isRelated){
        var html = this.getDomForRoomOfRelatedThings(type , name , from , to , isRelated)

        _context['contentForInfoRoom'].html(html);
    } ,

    // 填充订单信息
    fillOrderForRelatedThings: function(orderId , name , send , get , tag){
        var html = this.getDomForOrderOfRelatedThings(orderId , name , send , get , tag)

        _context['contentForInfoOrder'].html(html);
        _context['contentForInfoOrder'].removeClass('hide');

        this.defineInfoOrderEvent();
    } ,


    // 设置聊天室信息
    setInfoRoom: function(data){
        if (data.length === 0) {
            return ;
        }

        var i = 0;
        var cur = null;

        for (; i < data.length; ++i)
        {
            cur = data[i];

            var roomInfo = this.getDomForRoomOfRelatedThings(cur['type'] , cur['id'] , cur['_name'] , cur['from'] , cur['to'] , cur['is_related']);
            // 获取数据
            _context['contentForInfoRoom'].append(roomInfo);
        }
    } ,

    // 添加临时记录（还未确定消息是否已经发送成功了）
    // 仅针对自身用户
    appendTmpHistoryForText: function(id , content){
        var win = _findDom.findWindow(id);
            win = G(win);
        var isBottom = win.data('isBottom');
        var list = G('q:.history .list' , win.get());

        // 通过用户类型 和 用户 id 来确定
        var type = _misc.getType(topContext['userType'] , topContext['userId']);
        var dom  = _dom.getTmpHistoryForText(type , {
            // topContext['username'] , topContext['thumb'] , content
            username: topContext['username'] ,
            thumb: topContext['thumb'] ,
            content: content
        } , true);

        list.append(dom);

        if (isBottom === 'y') {
            list.bottom(topContext['time']);
        }

        return dom;
    } ,

    // 添加临时记录
    appendTmpHistoryForImage: function(id , content){
        var win = _findDom.findWindow(id);
            win = G(win);
        var list = G('q:.history .list' , win.get());

        // 通过用户类型 和 用户 id 来确定
        var type = _misc.getType(topContext['userType'] , topContext['userId']);
        var dom  = _dom.getTmpHistoryForImage(type , {
            username: topContext['username'] ,
            thumb: topContext['thumb'] ,
            content: content
        });

        list.append(dom);

        if (win.data('isBottom')) {
            list.bottom(topContext['time']);
        }

        return dom;
    } ,

    // 添加临时文件记录
    appendTmpHistoryForFile: function(id){
        var win = _findDom.findWindow(id);
            win = G(win);
        var list = G('q:.history .list' , win.get());

        // 通过用户类型 和 用户 id 来确定
        var type = _misc.getType(topContext['userType'] , topContext['userId']);
        var dom  = _dom.getTmpHistoryForFile(type , {
            username: topContext['username'] ,
            thumb: topContext['thumb']
        } , true);

        list.append(dom);

        if (win.data('isBottom')) {
            list.bottom(topContext['time']);
        }

        return dom;
    } ,

    // 添加正在咨询的订单节点
    addOrderConsultation: function(roomId , orderId , type , name , send , accept){
        var item = this.findOrderConsultation(roomId);
        item = G(item);

        if (item.isDom()) {
            // 已经存在该节点，移除
            item.get().parentNode.removeChild(item.get());
        }

        var dom = this.getDomForOrderConsultation(roomId , orderId , type , name , send , accept , true);
        dom = G(dom);

        // 添加节点
        _context['contentForInfoOrder'].append(dom.get());

        var items = G('.item' , _context['contentForInfoOrder'].get());

        // 高亮显示当前节点
        dom.highlight('hide' , items.get() , true);

        // 定义节点事件
        this.defineOrderConsultationEvent(dom.get());

        // 显示正在咨询的订单
        _context['infoForOrder'].removeClass('hide');
    } ,

    // 添加聊天室节点（也许会被废弃）
    addRoom: function(roomType , roomId , name , tip){
        if (this.existsRoom(roomId)) {
            return ;
        }

        // 移除空节点
        this.removeEmpty(_context['r_roomItems'].get());

        var dom = this.getDomForRoom(roomType , roomId , name , tip);

        // 新增房间
        _context['r_roomItems'].append(dom);

        this.defineRoomEvent(dom);
    } ,
};