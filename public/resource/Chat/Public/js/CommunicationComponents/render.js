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
        var first = his[0];

        _domOperation.addTmpSession(first['type'] , first['room_id'] , first['content']);
        _domOperation.updateTmpSession(first['room_id'] , 'success' , first);
    } ,

    // 添加聊天室
    appendRoom: function(data){
        if (_findDom.existsRoom(data['room_id'])) {
            return ;
        }

        _domOperation.removeEmpty(_context['r_items'].get());

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

        _domOperation.removeEmpty(_context['s_items'].get());

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

        // 没有历史记录跳过
        // 查看更多必须存在，因为有可能 redis 缓存中数据
        // 恰好满足持久化条件导致，redis 中记录被清空
        // 这种情况下就会出现没有临时记录的情况
        // 但不表示就没有记录！
        if (his.length === 0) {
            return ;
        }

        var i   = his.length - 1;
        var cur = null;

        // 添加聊天记录
        for (; i >= 0; --i)
        {
            cur = his[i];
            this.renderHistory(cur);
        }

        // 设置聊天记录最早一条记录标识符
        _domOperation.setIdentifierForFirstHistoryOfWindow(roomId);
    } ,

    // 渲染历史聊天记录
    renderHistory: function(data){
        if (data['type'] === 'text') {
            this.appendHistoryForText(data);
        } else if (data['type'] === 'json:image') {
            this.appendHistoryForImage(data);
        } else if (data['type'] === 'json:file') {
            this.appendHistoryForFile(data);
        } else if (data['type'] === 'json:order') {
            this.appendHistoryForOrder(data);
        } else {
            // 其他类型的历史记录
            // 请扩展
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

    // 添加临时订单记录
    appendHistoryForOrder: function(data){
        var win = _findDom.findWindow(data['room_id']);
            win = G(win);
        var list = G('q:.history .list' , win.get());

        // 通过用户类型 和 用户 id 来确定
        var type = _misc.getType(data['user_type'] , data['user_id']);
        var dom  = _dom.getHistoryForOrder(type , data , true);

        _event.defineHistoryForOrderEvent(dom);

        list.append(dom);

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

        if (data['room_type'] === 'order') {
            var order = data['order'];

            // 如果有正在咨询的订单，那么进行渲染
            if (G.isValidVal(order)) {
                order['room_id'] = data['room_id'];

                // 渲染正在咨询的订单
                this.renderOrderConsultation(order);
            }
        }

        // 在添加完相关的 part & 切换内容后（必须！）
        // 根据聊天室类型对 dom 展示内容进行控制
        _domOperation.updatePartForThings(data['room_id']);
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

    // 新增欢迎提示
    renderWelcom: function(data){
        var win = _findDom.findWindow(data['room_id']);
            win = G(win);
        var list = G('q:.history .list' , win.get());

        var dom = _dom.getWelcom(data , true);

        list.append(dom);

        if (win.data('isBottom') == 'y') {
            list.bottom(topContext['time']);
        }
    } ,

    // 渲染聊天室正在咨询的订单
    renderOrderConsultation: function(data){
        this.appendOrderConsultation(data);
    } ,

    // 添加聊天室正在咨询的订单
    appendOrderConsultation: function(data){
        var part = _findDom.findPartForThings(data['room_id']);
            part = G(part);
        var advoiseThings = G('q:.c-items .advoise-things' , part.get());

        // 清空之前的数据
        advoiseThings.html('');

        var dom = _dom.getOrderConsultation(data , true);

        _event.defineOrderConsultationEvent(dom);

        advoiseThings.append(dom);

        return dom;
    } ,

    // 添加用户
    appendGroup: function(data){
        if (_findDom.existsGroup(data['room_id'])) {

        }
        var group = _dom.getGroup(data , true);

        _event.defineGroupEvent(group);

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
            _event.defineHistoryForImageEvent(dom);
        } else if (data['type'] === 'json:file') {
            dom  = _dom.getHistoryForFile(type , data , true);
            _event.defineHistoryForFileEvent(dom);
        } else if (data['type'] === 'json:order') {
            dom = _dom.getHistoryForOrder(type , data , true);
            _event.defineHistoryForOrderEvent(dom);
        } else {
            // 其他类型事件，请扩展
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

        _event.defineHistoryForImageEvent(dom);

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

        _event.defineHistoryForFileEvent(dom);

        list.append(dom);

        if (win.data('isBottom')) {
            list.bottom(topContext['time']);
        }

        return dom;
    } ,

    // 添加临时订单记录
    appendTmpHistoryForOrder: function(data){
        var win = _findDom.findWindow(data['room_id']);
            win = G(win);
        var list = G('q:.history .list' , win.get());

        // 通过用户类型 和 用户 id 来确定
        var type = _misc.getType(topContext['userType'] , topContext['userId']);
        var dom  = _dom.getTmpHistoryForOrder(type , {
            username: topContext['username'] ,
            thumb: topContext['thumb']
        } , true);

        _event.defineHistoryForOrderEvent(dom);

        list.append(dom);

        if (win.data('isBottom')) {
            list.bottom(topContext['time']);
        }

        return dom;
    } ,
};