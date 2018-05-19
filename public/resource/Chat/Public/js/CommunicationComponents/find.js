/**
 * *****************************
 * author 陈学龙 2018-05-15
 * 查找非 dom 值
 * *****************************
 */

// 采用下划线命名仅是为了避免名称冲突
var _find = {
    // 获取某个聊天室最早一条消息的 identifier
    getIdentifierForFirstHistory: function(roomId){
        var line = _findDom.getHistoryForFirst(roomId);

        if (line === false) {
            return '';
        }

        return G(line).data('identifier');
    } ,

    // 获取当前聊天室id
    getSessionId: function(){
        var session = _findDom.findCurSession();

        if (session === false) {
            return false;
        }

        session = G(session);

        return session.data('id');
    },
};