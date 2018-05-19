/**
 * *****************************
 * author 陈学龙 2018-05-15
 * js 动态生成各种类型的 dom 结构
 * *****************************
 */

// 采用下划线命名仅是为了避免名称冲突
var _findDom = {

    // 检查是否存在聊天室
    existsRoom: function(id){
        var items   = G('.item' , _context['r_items'].get());
        var i       = 0;
        var cur     = null;

        for (; i < items.length; ++i)
        {
            cur = G(items.get()[i]);

            if (cur.data('id') == id) {
                return true;
            }
        }

        return false;
    } ,

    // 检查是否存在会话
    existsSession: function(id){
        var items = G('.item' , _context['s_items'].get());
        var i = 0;
        var cur = null;

        for (; i < items.length; ++i)
        {
            cur = G(items.get()[i]);

            if (cur.data('id') == id) {
                return true;
            }
        }

        return false;
    } ,

    // 检查是否存在指定聊天室成员容器
    existsGroup: function(id){
        var groups  = G('.group' , _context['u_userGroup'].get());
        var i       = 0;
        var cur     = null;

        for (; i < groups.length; ++i)
        {
            cur = G(groups.get()[i]);

            if (cur.data('id') == id) {
                return true;
            }
        }

        return false;
    } ,

    // 检查指定聊天室容器是否已经存在指定成员
    existsUser: function(roomId , userType , userId){
        var group = this.findGroup(roomId);
            group = G(group);
        var users = G('qa:.users .user' , group.get());

        var i           = 0;
        var cur         = null;
        var _userType   = null;
        var _userId     = null;

        for (; i < users.length; ++i)
        {
            cur         = G(users.get()[i]);
            _userType   = cur.data('type');
            _userId     = cur.data('id');

            if (_userType == userType && _userId == userId) {
                return true;
            }
        }

        return false;
    } ,

    // 检查是否存在指定聊天室信息节点
    existsPartForThings: function(id){
        var parts = G('.part' , _context['t_roomForThings'].get());
        var i   = 0;
        var cur = null;

        for (; i < parts.length; ++i)
        {
            cur = G(parts.get()[i]);

            if (cur.data('id') == id) {
                return true;
            }
        }

        return false;
    } ,

    // 检查是否存在会话窗口
    existsWindow: function(id){
        var windows = G('.window' , _context['w_windows'].get());
        var i   = 0;
        var cur = null;

        for (; i < windows.length; ++i)
        {
            cur = G(windows.get()[i]);

            if (cur.data('id') == id) {
                return true;
            }
        }

        return false;
    } ,

    // 找到对应的聊天室
    findRoom: function(id){
        var items   = G('.item' , _context['r_items'].get());
        var i       = 0;
        var cur     = null;

        for (; i < items.length; ++i)
        {
            cur = G(items.get()[i]);

            if (cur.data('id') == id) {
                return cur.get();
            }
        }

        return false;
    } ,

    // 找到对应的聊天室信息
    findPartForThings: function(id){
        var parts   = G('.part' , _context['t_roomForThings'].get());
        var i       = 0;
        var cur     = null;

        for (; i < parts.length; ++i)
        {
            cur = G(parts.get()[i]);

            if (cur.data('id') == id) {
                return cur.get();
            }
        }

        return false;
    } ,

    // 找到对应的会话
    findSession: function(id){
        var items   = G('.item' , _context['s_items'].get());
        var i       = 0;
        var cur     = null;

        for (; i < items.length; ++i)
        {
            cur = G(items.get()[i]);

            if (cur.data('id') == id) {
                return cur.get();
            }
        }

        return false;
    } ,

    // 找到相关的订单
    findOrderConsultation: function(id){
        var items = G('.item' , _context['contentForInfoOrder'].get());
        var i = 0;
        var cur = null;

        for (; i < items.length; ++i)
        {
            cur = G(items.get()[i]);

            if (cur.data('roomId') == id) {
                return cur.get();
            }
        }

        return false;
    } ,

    // 找到对应的窗口
    findWindow: function(id){
        var windows = G('.window' , _context['w_windows'].get());
        var i       = 0;
        var cur     = null;

        for (; i < windows.length; ++i)
        {
            cur = G(windows.get()[i]);

            if (cur.data('id') == id) {
                return cur.get();
            }
        }

        return false;
    } ,

    // 找到存放聊天室用户的 dom
    findGroup: function(id){
        var groups  = G('.group' , _context['u_userGroup'].get());
        var i       = 0;
        var cur     = null;

        for (; i < groups.length; ++i)
        {
            cur = G(groups.get()[i]);

            if (cur.data('id') == id) {
                return cur.get();
            }
        }

        return false;
    } ,

    // 找到对应用户
    findUser: function(roomId , userType , userId){
        var group = this.findGroup(roomId);
            group = G(group);
        var users = G('.users .user' , group.get());
        var i   = 0;
        var cur = null;
        var _userType   = null;
        var _userId     = null;

        for (; i < users.length; ++i)
        {
            cur         = G(users.get()[i]);
            _userType   = cur.data('type');
            _userId     = cur.data('id');

            if (_userType == userType && _userId == userId) {
                return cur.get();
            }
        }

        return false;
    } ,

    // 获取指定聊天室最早一条聊天记录
    getHistoryForFirst: function(roomId){
        var win = this.findWindow(roomId);
            win = G(win);

        var lines = G('qa:.history .list .line' , win.get());

        if (lines.length === 0) {
            return false;
        }

        return lines.first().get();
    } ,

    // 获取当前会话窗口
    findCurSession: function() {
        var sessions = G('.item', _context['s_items'].get());
        var i   = 0;
        var cur = null;

        for (; i < sessions.length; ++i)
        {
            cur = sessions.jump(i , true);

            if (cur.hasClass('cur')) {
                return cur.get();
            }
        }

        return false;
    } ,

    // 获取给定记录
    findHistory: function(id , identifier){
        var win = this.findWindow(id);
            win = G(win);
        var lines = G('qa:.history .list .line' , win.get());
        var i = 0;
        var cur = null;

        for (; i < lines.length; ++i)
        {
            cur = lines.jump(i , true);

            // 标识符
            if (cur.data('identifier') == identifier) {
                return cur.get();
            }
        }

        return false;
    } ,

    // 检查某条记录是否已经存在
    existsHisotry: function(id , identifier){
        var win = this.findWindow(id);
            win = G(win);
        var lines = G('qa:.history .list .line' , win.get());
        var i = 0;
        var cur = null;

        for (; i < lines.length; ++i)
        {
            cur = lines.jump(i , true);

            // 标识符
            if (cur.data('identifier') == identifier) {
                return true;
            }
        }

        return false;
    } ,
};