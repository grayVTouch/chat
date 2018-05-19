/**
 * *****************************
 * author 陈学龙 2018-05-15
 * 杂项函数
 * *****************************
 */

// 采用下划线命名仅是为了避免名称冲突
var _misc = {
    // 聊天室铃声列表
    _audioSet: {} ,

    // 聊天室项切换实例
    menuSwitchSet: {} ,

    // 注册铃声
    registerAudio: function(roomId){
        var audio = new Audio();
        audio.src = _ringtonSrc;

        this._audioSet[roomId] = audio;
    } ,

    // 注册切换实例
    registerMenuSwitch: function(roomId){
        // 已经存在该实例，不允许重复创建
        if (!G.isUndefined(this.menuSwitchSet[roomId])) {
            return ;
        }

        var part = _findDom.findPartForThings(roomId);
            part = G(part);
        var navContainer = G('.nav-container' , part.get()).first();
        var cItems = G('qa:.c-items .c-item' , part.get());

        // 查找到给定的元素
        var find = function(identifier){
            var i   = 0;
            var cur = null;

            for (; i < cItems.length; ++i)
            {
                cur = cItems.jump(i , true);

                if (cur.data('identifier') == identifier) {
                    return cur.get();
                }
            }

            throw new Error('未找到标识符：' + identifier + '对应的元素项');
        };

        this.menuSwitchSet[roomId] = new MenuSwitch(navContainer.get() , {
            switchFn: function(identifier){
                var item = find(identifier);
                    item = G(item);
                item.highlight('hide' , cItems.get() , true);
            }
        });
    } ,

    // 铃声提醒
    ringtonRemind: function(roomId , userType , userId){
        // 如果已经存在对应实例
        if (!G.isUndefined(this._audioSet[roomId])) {
            return ;
        }

        var session = _findDom.findSession(roomId);
            session = G(session);

        var tip = session.data('tip');

        console.log(tip , userType , userId);
        if (tip != 1 && (userType != topContext['userType'] || userId != topContext['userId'])) {
            return ;
        }

        console.log('播放声音');
        this._audioSet[roomId].play();
    } ,

    // 判断消息发送方
    getType: function(userType , userId){
        return userType == topContext['userType'] && userId == topContext['userId'] ? 'self' : 'other';
    } ,
};