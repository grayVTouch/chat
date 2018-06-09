/**
 * *****************************
 * author 陈学龙 2018-05-15
 * js 动态生成各种类型的 dom 结构
 * *****************************
 */

// 采用下划线命名仅是为了避免名称冲突
var _dom = {
    // 获取表情的图标
    getFace: function(id , src , text , isReturnDom){
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var html = [];
        html.push(' <img src="' + src + '" class="image" /> ');

        if (isReturnDom) {
            var div = document.createElement('div');
            div = G(div);
            div.addClass('c-item');
            div.setAttr('title' , text);
            div.data('id' , id);
            div.data('src' , src);
            div.data('text' , text);
            div.html(html.join(''));

            return div.get();
        }

        var first = '<div class="c-item" title="' + text + '" data-id="' + id + '">';
        var last = '</div>';

        return first + html.join('') + last;
    } ,

    // 空数据时的 html
    getEmpty: function(isReturnDom){
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var html = [];

        html.push('<img src="' + _icoPrefix + 'empty.png" class="image" />尚无数据');

        if (isReturnDom) {
            var div = document.createElement('div');

            div = G(div);
            div.addClass('empty');
            div.html(html.join(''));

            return div.get();
        }

        var first   = '<div class="empty">';
        var last    = '</div>';

        return first + html.join('') + last;
    } ,

    // 聊天室 html
    getRoom: function(data , isReturnDom){
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        /*
        var dataStruct = {
            roomroom_type: '' ,
            roomroom_id: '' ,
            name: '' ,
            tip: ''
        };
        */
        var html = [];

        html.push('     <div class="ico"><img src="' + _icoPrefix + '' + data['room_type'] + '.png" class="image" /></div>  ');
        html.push('     <div class="content">  ');
        html.push('         <div class="name">' + data['_name'] + '</div>  ');
        html.push('         <div class="status ' + (data['tip'] == 1 ? 'hide' : '') + '"><img src="' + _icoPrefix + 'quiet.png" class="image" /></div>  ');
        html.push('     </div>  ');

        if (isReturnDom) {
            var div = document.createElement('div');
            div = G(div);
            div.addClass('item');
            div.data('type' , data['room_type']);
            div.data('id' , data['room_id']);
            div.html(html.join(''));

            return div.get();
        }

        var first = '<div class="item" data-type="' + data['room_type'] + '" data-id="' + data['room_id'] + '">  ';
        var last = '</div>  ';

        return first + html.join('') + last;
    } ,

    // 会话 html
    getSession: function(data , isReturnDom){
        /*
        var dataStruct = {
            room_type: '' ,
            room_id: '' ,
            _name: '' ,
            tip: '' ,
            count: '' ,
            sort: '' ,
            top: ''
        };
        */

        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var msgTip = data['count'] == 0 ? '' : 'item-for-new-msg';

        var html = [];

        html.push('     <div class="ico">  ');
        html.push('         <div class="thumb"><img src="' + _icoPrefix + data['room_type'] + '.png" class="image" /></div>  ');
        html.push('     </div>  ');
        html.push('     <div class="content">  ');
        html.push('         <div class="info">  ');
        html.push('             <div class="name">' + data['_name'] + '</div>  ');
        html.push('             <div class="msg">');
        html.push('                 <div class="status hide"><img src="' + _sendingImageForIco + '" class="image image-for-status" /></div>  ');
        html.push('                 <div class="text"></div>  ');
        html.push('              </div>  ');
        html.push('         </div>  ');
        html.push('         <div class="flag">  ');
        html.push('             <div class="time"></div>  ');
        html.push('             <div class="status ' + (data['tip'] == 1 ? 'hide' : '') + '"><img src="' + _icoPrefix + 'quiet.png" class="image" /></div>  ');
        html.push('         </div>  ');
        html.push('     </div>  ');

        if (isReturnDom) {
            var div = document.createElement('div');
                div = G(div);
                div.addClass(['item' , msgTip]);
                div.data('type' , data['room_type']);
                div.data('id' , data['room_id']);
                div.data('tip' , data['tip']);
                div.data('count' , data['count']);
                div.data('top' , data['top']);
                div.html(html.join(''));

            return div.get();
        }

        var first   = ' <div class="item ' + msgTip + '" data-type="' + data['room_type'] + '" data-id="' + data['room_id'] + '" data-tip="' + data['tip'] + '" data-count="' + data['count'] + '" data-isTop="' + data['top'] + '">  ';
        var last    = ' </div>  ';

        return first + html.join('') +last;
    } ,

    /**
     * 会话窗口 html
     */
    getWindow: function(data , isReturnDom){
        /*
        var dataStruct = {
            room_type: '' ,
            room_id: '' ,
            _name: ''
        };
        */
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var html = [];

        html.push('     <div class="header">    ');
        html.push('         <div class="subject">' + data['_name'] + '</div>    ');
        html.push('         <div class="other">    ');

        if (data['type'] === 'order' && topContext['userType'] !== 'admin') {
            html.push('<button class="btn-8 add-dispute" data-type="' + data['room_type'] + '" data-id="' + data['room_id'] + '">发起争议</button>');
        }

        html.push('         </div>');
        html.push('     </div>    ');
        html.push('     <!-- 历史记录列表 -->    ');
        html.push('     <div class="history">    ');
        html.push('         <div class="list"></div>    ');
        html.push('     </div>    ');

        if (isReturnDom) {
            var div = document.createElement('div');
            div = G(div);
            div.addClass(['window' , 'hide']);
            div.data('type' , data['room_type']);
            div.data('id' , data['room_id']);
            // 这个用于是否在切换会话的时候聊天记录滚动到底部
            div.data('isBottom' , 'y');
            div.html(html.join(''));

            return div.get();
        }

        var first   = ' <div class="window hide" data-isBottom="y" data-type="' + data['room_type'] + '" data-id="' + data['room_id'] + '">    ';
        var last    = ' </div>';

        return first + html.join('') + last;
    } ,

    // 聊天记录 html
    getHistoryForText: function(type , data , isReturnDom){
        /*
        var dataStruct = {
            username: '' ,
            thumb: '' ,
            content: '' ,
            identifier: '' ,
            create_time: ''
        };
        */
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var typeRange = ['other' , 'self'];
        var content = _editor.html(data['content']);
        var html = [];

        type = G.contain(type , typeRange) ? type : 'other';

        html.push('     <div class="thumb"><img src="' + data['thumb'] + '" class="image" /></div>   ');
        html.push('     <div class="info">   ');
        html.push('         <div class="user">   ');
        html.push('             <span class="name">' + data['username'] + '</span>   ');
        html.push('             <span class="time">' + data['create_time'] + '</span>   ');
        html.push('         </div>   ');
        html.push('         <div class="msg">');
        html.push('             <div class="text">');
        html.push('                 <div class="object">    ');
        html.push('                     <img src="' + _loadingImageForGif + '" class="image image-for-status hide" />' + content);
        html.push('                 </div>');
        html.push('             </div>');
        html.push('         </div>   ');
        html.push('         <div class="tip hide">  ');
        html.push('             <span class="tip-text">....</span> ');
        html.push('         </div> ');
        html.push('     </div>   ');

        if (isReturnDom) {
            var div = document.createElement('div');
            div = G(div);
            div.addClass(['line' , 'chat-text' , type]);
            div.setAttr('isTmp' , 'n');
            div.data('identifier' , data['identifier']);
            div.html(html.join(''));

            return div.get();
        }

        var first = ' <div class="line chat-text ' + type + '" isTmp="n" data-identifier="' + data['identifier'] + '">   ';
        var last = ' </div>   ';

        return first + html.join() + last;
    } ,

    // 获取上传图片
    getHistoryForImage: function(type , data , isReturnDom){
        /*
        var dataStruct = {
            username: '' ,
            thumb: '' ,
            content: '' ,
            identifier: '' ,
            create_time: ''
        };
        */
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;
        var typeRange = ['other' , 'self'];
        var html = [];
        var image = G.jsonDecode(data['content']);

        type = G.contain(type , typeRange) ? type : 'other';

        html.push('     <div class="thumb"><img src="' + data['thumb'] + '" class="image" /></div>   ');
        html.push('     <div class="info">   ');
        html.push('         <div class="user">   ');
        html.push('             <span class="name">' + data['username'] + '</span>   ');
        html.push('             <span class="time">' + data['create_time'] + '</span>   ');
        html.push('         </div>   ');
        html.push('         <div class="msg">   ');
        html.push('             <div class="object">   ');
        html.push('                 <div class="status hide">   ');
        html.push('                     <div class="loading">');
        html.push('                         <div class="u-loading line-scale">   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                         </div>   ');
        html.push('                     </div>   ');
        html.push('                     <div class="error hide">');
        html.push('                         <div class="background"></div>');
        html.push('                         <img src="' + _errorImageForIco + '" class="image image-for-file-status" /> ');
        html.push('                     </div>   ');
        html.push('                 </div>   ');
        html.push('                 <img src="' + image['url'] + '" title="' + image['name'] + '" class="image image-for-history" />   ');
        html.push('             </div>   ');
        html.push('         </div>   ');
        html.push('     </div>   ');

        if (isReturnDom) {
            var div = document.createElement('div');
                div = G(div);
                div.addClass(['line' , 'chat-image' , type]);
                div.setAttr('isTmp' , 'n');
                div.data('identifier' , data['identifier']);
                div.html(html.join(''));

            return div.get();
        }

        var first = ' <div class="line chat-image ' + type + '" isTmp="n" data-identifier="' + data['identifier'] + '">   ';
        var last = ' </div>   ';

        return first + html.join() + last;
    } ,

    // 获取上传文件
    getHistoryForFile: function(type , data , isReturnDom){
        /*
        var dataStruct = {
            username: '' ,
            thumb: '' ,
            content: {
                name: '' ,
                size: '' ,
                mime: '' ,
                url: ''
            } ,
            identifier: '' ,
            create_time: ''
        };
        */

        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;
        var typeRange = ['other' , 'self'];
        var html = [];
        var file = G.jsonDecode(data['content']);

        html.push('     <div class="thumb"><img src="' + data['thumb'] + '" class="image" /></div>   ');
        html.push('     <div class="info">   ');
        html.push('         <div class="user">   ');
        html.push('             <span class="name">' + data['username'] + '</span>   ');
        html.push('             <span class="time">' + data['create_time'] + '</span>   ');
        html.push('         </div>   ');
        html.push('         <div class="msg">   ');
        html.push('             <div class="object" data-url="' + file['url'] + '">   ');
        html.push('                 <div class="status hide">   ');
        html.push('                     <div class="loading">');
        html.push('                         <div class="u-loading line-scale">   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                         </div>   ');
        html.push('                     </div>   ');
        html.push('                     <div class="error hide">');
        html.push('                         <div class="background"></div>');
        html.push('                         <img src="' + _errorImageForIco + '" class="image image-for-file-status" /> ');
        html.push('                     </div>   ');
        html.push('                 </div>   ');
        html.push('                 <div class="flag"><img src="' + _downloadImageForIco + '" class="image image-for-file" /></div>  ');
        html.push('                 <div class="name">' + file['name'] + '</div>    ');
        html.push('             </div>   ');
        html.push('         </div>   ');
        html.push('     </div>   ');

        if (isReturnDom) {
            var div = document.createElement('div');
            div = G(div);
            div.addClass(['line' , 'chat-file' , type]);
            div.setAttr('isTmp' , 'n');
            div.data('identifier' , data['identifier']);
            div.html(html.join(''));

            return div.get();
        }

        var first = ' <div class="line chat-file ' + type + '" isTmp="n" data-identifier="' + data['identifier'] + '">   ';
        var last = ' </div>   ';

        return first + html.join() + last;
    } ,

    // 聊天记录 html
    getTmpHistoryForText: function(type , data , isReturnDom){
        /*
        var dataStruct = {
            username: '' ,
            thumb: '' ,
            content: ''
        };
        */

        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var content = _editor.html(data['content']);
        var typeRange = ['other' , 'self'];
        var html    = [];

        type = G.contain(type , typeRange) ? type : 'other';

        html.push('     <div class="thumb"><img src="' + data['thumb'] + '" class="image" /></div>   ');
        html.push('     <div class="info">   ');
        html.push('         <div class="user">   ');
        html.push('             <span class="name">' + data['username'] + '</span>   ');
        html.push('             <span class="time">...</span>   ');
        html.push('         </div>   ');
        html.push('         <div class="msg">');
        html.push('             <div class="text">');
        html.push('                 <div class="object">    ');
        html.push('                     <img src="' + _loadingImageForGif + '" class="image image-for-status" />' + content);
        html.push('                 </div>');
        html.push('             </div>');
        html.push('         </div>   ');
        html.push('         <div class="tip hide">  ');
        html.push('             <span class="tip-text">....</span> ');
        html.push('         </div> ');
        html.push('     </div>   ');

        if (isReturnDom) {
            var div = document.createElement('div');
            div = G(div);
            div.addClass(['line' , 'chat-text' , type]);
            div.setAttr('isTmp' , 'y');
            div.html(html.join(''));

            return div.get();
        }

        var first = ' <div class="line chat-text ' + type + '" isTmp="y">   ';
        var last = ' </div>   ';

        return first + html.join() + last;
    } ,

    // 获取临时上传图片节点
    getTmpHistoryForImage: function(type , data , isReturnDom){
        /*
        var dataStruct = {
            username: '' ,
            thumb: '' ,
            content: '' ,
            identifier: '' ,
            create_time: ''
        };
        */
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;
        var typeRange = ['other' , 'self'];
        var html = [];

        html.push('     <div class="thumb"><img src="' + data['thumb'] + '" class="image" /></div>   ');
        html.push('     <div class="info">   ');
        html.push('         <div class="user">   ');
        html.push('             <span class="name">' + data['username'] + '</span>   ');
        html.push('             <span class="time">...</span>   ');
        html.push('         </div>   ');
        html.push('         <div class="msg">   ');
        html.push('             <div class="object">   ');
        html.push('                 <div class="status">   ');
        html.push('                     <div class="loading">');
        html.push('                         <div class="u-loading line-scale">   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                         </div>   ');
        html.push('                     </div>   ');
        html.push('                     <div class="error hide">');
        html.push('                         <div class="background"></div>');
        html.push('                         <img src="' + _errorImageForIco + '" class="image image-for-file-status" /> ');
        html.push('                     </div>   ');
        html.push('                 </div>   ');
        html.push('                 <img src="' + data['content'] + '" class="image image-for-history" />   ');
        html.push('             </div>   ');
        html.push('         </div>   ');
        html.push('     </div>   ');

        if (isReturnDom) {
            var div = document.createElement('div');
                div = G(div);
                div.addClass(['line' , 'chat-image' , type]);
                div.setAttr('isTmp' , 'y');
                div.html(html.join(''));

            return div.get();
        }

        var first = ' <div class="line chat-image ' + type + '" isTmp="y">   ';
        var last = ' </div>   ';

        return first + html.join() + last;
    } ,

    // 获取临时上传文件节点
    getTmpHistoryForFile: function(type , data , isReturnDom){
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;
        var typeRange = ['other' , 'self'];
        var html = [];

        console.log(data);

        html.push('     <div class="thumb"><img src="' + data['thumb'] + '" class="image" /></div>   ');
        html.push('     <div class="info">   ');
        html.push('         <div class="user">   ');
        html.push('             <span class="name">' + data['username'] + '</span>   ');
        html.push('             <span class="time">...</span>   ');
        html.push('         </div>   ');
        html.push('         <div class="msg">   ');
        html.push('             <div class="object">   ');
        html.push('                 <div class="status">   ');
        html.push('                     <div class="loading">');
        html.push('                         <div class="u-loading line-scale">   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                             <div></div>   ');
        html.push('                         </div>   ');
        html.push('                     </div>   ');
        html.push('                     <div class="error hide">');
        html.push('                         <div class="background"></div>');
        html.push('                         <img src="' + _errorImageForIco + '" class="image image-for-file-status" /> ');
        html.push('                     </div>   ');
        html.push('                 </div>   ');
        html.push('                 <div class="flag"><img src="' + _downloadImageForIco + '" class="image image-for-file" /></div>  ');
        html.push('                 <div class="name">...</div>    ');
        html.push('             </div>   ');
        html.push('         </div>   ');
        html.push('     </div>   ');

        if (isReturnDom) {
            var div = document.createElement('div');
            div = G(div);
            div.addClass(['line' , 'chat-file' , type]);
            div.setAttr('isTmp' , 'y');
            div.html(html.join(''));

            return div.get();
        }

        var first = ' <div class="line chat-file ' + type + '" isTmp="y">   ';
        var last = ' </div>   ';

        return first + html.join() + last;
    } ,

    // more html
    getViewMore: function(data , isReturnDom){
        /*
        var dataStruct = {
            room_type: '' ,
            room_id: ''
        };
        */

        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var html = [];
            html.push('<img src="' + _icoPrefix + 'loading.gif" class="image hide" />');
            html.push('<button class="view-more-btn" data-type="' + data['room_type'] + '" data-id="' + data['room_id'] + '">查看更多</button>');

        if (isReturnDom) {
            var div = document.createElement('div');
            div = G(div);
            div.addClass('view-more');
            div.html(html.join(''));

            return div.get();
        }

        var first = '<div class="view-more">';
        var last = '</div>';

        return first + html.join('') + last;
    } ,

    // 获取订单争议
    getOrderDispute: function(roomId , orderId , isReturnDom){
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var html = '    <button class="btn-8 add-dispute" data-roomId="' + roomId + '" data-orderId="' + orderId + '">发起争议</button> ';

        if (isReturnDom) {
            var btn = document.createElement('button');
            btn = G(btn);
            btn.addClass(['btn-8' , 'add-dispute']);
            btn.data('roomId' , roomId);
            btn.data('orderId' , orderId);
            btn.text('发起争议');
            return btn.get();
        }

        return html;
    } ,

    // 生成聊天室用户容器项
    getGroup: function(data , isReturnDom){
        /*
        var dataStruct = {
            room_type: '' ,
            room_id: '' ,
            user: {
                online: '',
                count: '',
                user: []
            }
        };
        */
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var html = [];

        html.push(' <div class="header">    ');
        html.push('     <div class="title">聊天室成员</div>    ');
        html.push('     <div class="search">    ');
        html.push('         <div class="input">    ');
        html.push('             <img src="' + _icoPrefix + 'search.png" class="image" />    ');
        html.push('             <input type="text" class="text" placeholder="搜索" />    ');
        html.push('         </div>    ');
        html.push('     </div>    ');
        html.push(' </div>    ');

        html.push(' <div class="component-title">   ');
        html.push('     <div class="subject">群成员 <span class="online">' + data['user']['online'] + '</span> / <span class="count">' + data['user']['count'] + '</span></div>   ');
        html.push('     <div class="more"></div>   ');
        html.push(' </div>   ');

        html.push(' <div class="users"></div>  ');

        if (isReturnDom) {
            var div = document.createElement('div');
                div = G(div);
                div.addClass(['group' , 'hide']);
                div.data('type' , data['room_type']);
                div.data('id' , data['room_id']);
                div.html(html.join(''));

            return div.get();
        }

        var first = ' <div class="group hide" data-type="' + data['room_type'] + '" data-id="' + data['room_id'] + '"> ';
        var last = ' </div> ';

        return first + html.join('') + last;
    } ,

    // 生成用户项
    getUser: function(data , isReturnDom){
        /*
        var dataStruct = {
            user_room_type: '' ,
            user_room_id: '' ,
            username: '' ,
            thumb: '' ,
            status: ''
        };
        */
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var html = [];
        html.push('     <div class="info">  ');
        html.push('         <div class="thumb"><img src="' + data['thumb'] + '" class="image" /></div>  ');
        html.push('         <div class="name">' + data['username'] + '</div>  ');
        html.push('     </div>  ');
        html.push('     <div class="status ' + data['status'] + '">' + data['status_explain'] + '</div>  ');

        if (isReturnDom) {
            var div = document.createElement('div');
                div = G(div);
                div.addClass('user');
                div.data('type' , data['user_type']);
                div.data('id' , data['user_id']);
                div.data('status' , data['status']);
                div.html(html.join(''));

            return div.get();
        }

        var first = ' <div class="user ' + data['status'] + '" data-type="' + data['user_type'] + '" data-id="' + data['user_id'] + '" data-status="' + data['status'] + '">   ';
        var last = ' </div>   ';

        return first + html.join() + last;
    } ,

    // 生成选项
    getPartForThings: function(data , isReturnDom){
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var html = [];

        html.push('         <div class="nav-container">   ');
        html.push('             <div class="menu-switch menu-switch-for-4">   ');
        html.push('                 <div class="item hide order-consoltation" data-identifier="advoise">正在咨询</div>   ');
        html.push('                 <div class="item room-info cur" data-identifier="room">聊天室信息</div>   ');
        html.push('             </div>   ');
        html.push('         </div>   ');
        html.push('         <div class="c-items">   ');
        html.push('             <div class="c-item advoise-things hide" data-identifier="advoise"></div>   ');
        html.push('             <div class="c-item room-info" data-identifier="room"></div>   ');
        html.push('         </div>   ');

        if (isReturnDom) {
            var div = document.createElement('div');
                div = G(div);
                div.addClass(['part' , 'hide']);
                div.data('type' , data['room_type']);
                div.data('id' , data['room_id']);
                div.html(html.join(''));

            return div.get();
        }

        var first = '<div class="part" data-type="' + data['room_type'] + '" data-id="' + data['room_id'] + '">';
        var last = '</div>';

        return first + html.join('') + last;
    } ,

    // 获取聊天室信息 dom
    getRoomForThings: function(data , isReturnDom){
        /*
        var dataStruct = {
            room_type: '' ,
            room_id: '' ,
            _name: '' ,
            from: '' ,
            to: '' ,
            is_related_explain: ''
        };
        */
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;
        var html = [];

        html.push(' <tbody>   ');
        html.push('     <tr>   ');
        html.push('         <td>聊天室类型：</td>   ');
        html.push('         <td class="room-type">' + data['room_type_explain'] + '</td>   ');
        html.push('     </tr>   ');
        html.push('     <tr>   ');
        html.push('         <td>聊天室名称：</td>   ');
        html.push('         <td class="room-type">' + data['_name'] + '</td>   ');
        html.push('     </tr>   ');
        html.push('     <tr>   ');
        html.push('         <td>咨询方：</td>   ');
        html.push('         <td class="from-for-room">' + data['from'] + '</td>   ');
        html.push('     </tr>   ');
        html.push('     <tr>   ');
        html.push('         <td>接收方：</td>   ');
        html.push('         <td class="to-for-room">' + data['to'] + '</td>   ');
        html.push('     </tr>   ');
        html.push('     <tr>   ');
        html.push('         <td>是否关联聊天室：</td>   ');
        html.push('         <td class="is-related-room">' + data['is_related_explain'] + '</td>   ');
        html.push('     </tr>   ');
        html.push(' </tbody>   ');

        if (isReturnDom) {
            var table = document.createElement('table');
                table = G(table);
                table.addClass('column-tb');
                table.html(html.join(''));

            return table.get();
        }

        var first = '<table class="column-tb">';
        var last = '</table>';

        return first + html.join('') + last;
    } ,

    // 获取欢迎提示
    getWelcom: function(data , isReturnDom){
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var html = [];
            html.push(' <div class="in"><img src="' + _icoPrefix + 'welcome.png" class="image">欢迎客服<span class="username weight">' + data['username'] + '</span>加入聊天室</div>    ');

        if (isReturnDom) {
            var div = document.createElement('div');
                div = G(div);
                div.addClass('user-join-notice');
                div.html(html.join(''));
            return div.get();
        }

        var first = '<div class="user-join-notice">';
        var last = '</div>';

        return first + html.join('') + last;
    } ,

    // 获取聊天室正在咨询的订单
    getOrderConsultation: function(data , isReturnDom){
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var json = G.jsonEncode(data);

        var html = [];

        html.push('     <div class="left"><img src="' + topContext['dataUrl'] + 'images/test.jpg" class="image" /></div>  ');
        html.push('     <div class="right">  ');
        html.push('         <div class="top"><a href="javascript:void(0);">小米(MI)Air 13.3英寸金属超轻薄笔记本电脑(i5-7200U 8G 256G PCleSSD MX150 2G独显 FHD 指纹识别 Win10)银</a></div>  ');
        html.push('         <div class="btm">  ');
        html.push('             <div class="price weight red">￥999.00</div>  ');
        html.push('             <div class="btns">  ');
        html.push('                 <button class="btn-7 send-btn" data-json=\'' + json + '\'>发送</button>  ');
        html.push('             </div>  ');
        html.push('         </div>  ');
        html.push('     </div>  ');

        if (isReturnDom) {
            var div = document.createElement('div');
                div = G(div);
                div.addClass('order');
                div.html(html.join(''));
            return div.get();
        }

        var first = '<div class="order">';
        var last = '</div>';

        return first + html.join('') + last;
    } ,

    // 聊天室发送正在咨询的订单
    getHistoryForOrder: function(type , data , isReturnDom){
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var html = [];

        html.push('     <div class="thumb"><img src="' + _icoPrefix + 'thumb.png" class="image" /></div> ');
        html.push('     <div class="info"> ');
        html.push('         <div class="user"> ');
        html.push('             <span class="time">2018-04-19 14:00:00</span> ');
        html.push('             <span class="name">admin</span> ');
        html.push('         </div> ');

        html.push('         <div class="msg"> ');
        html.push('             <div class="object"> ');
        html.push('                 <img src="' + _icoPrefix + 'loading.gif" class="image image-for-status hide" /> ');
        html.push('                 <div class="text"> ');
        html.push('                     <div class="left"><img src="' + topContext['dataUrl'] + 'images/test.jpg" class="image image-for-order"></div> ');
        html.push('                     <div class="right"> ');
        html.push('                         <div class="top">小米(MI)Air 13.3英寸金属超轻薄笔记本电脑(i5-7200U 8G 256G PCleSSD MX150 2G独显 FHD 指纹识别 Win10)银</div> ');
        html.push('                         <div class="btm weight red">￥999.00</div> ');
        html.push('                     </div> ');
        html.push('                     <a href="javascript:void(0);" class="link"></a> ');
        html.push('                 </div> ');
        html.push('             </div> ');
        html.push('         </div> ');
        html.push('         <div class="tip hide"> ');
        html.push('             <span class="tip-text">发送失败：...</span> ');
        html.push('         </div> ');
        html.push('     </div> ');

        if (isReturnDom) {
            var div = document.createElement('div');
                div = G(div);
                div.addClass(['line' , 'chat-order' , type]);
                div.data('identifier' , data['identifier']);
                div.setAttr('isTmp' , 'n');
                div.html(html.join(''));
            return div.get();
        }

        var first = '<div class="line chat-order "' + type + ' data-identifier="' + data['identifier'] + '" isTmp="n">';
        var last = '</div>';

        return first + html.join('') + last;
    } ,

    // 临时聊天室订单
    getTmpHistoryForOrder: function(type , data , isReturnDom){
        isReturnDom = G.isBoolean(isReturnDom) ? isReturnDom : true;

        var html = [];

        html.push('     <div class="thumb"><img src="' + _icoPrefix + 'thumb.png" class="image" /></div> ');
        html.push('     <div class="info"> ');
        html.push('         <div class="user"> ');
        html.push('             <span class="time">2018-04-19 14:00:00</span> ');
        html.push('             <span class="name">admin</span> ');
        html.push('         </div> ');

        html.push('         <div class="msg"> ');
        html.push('             <div class="object"> ');
        html.push('                 <img src="' + _icoPrefix + 'loading.gif" class="image image-for-status hide" /> ');
        html.push('                 <div class="text"> ');
        html.push('                     <div class="left"><img src="' + topContext['dataUrl'] + 'images/test.jpg" class="image image-for-order"></div> ');
        html.push('                     <div class="right"> ');
        html.push('                         <div class="top">小米(MI)Air 13.3英寸金属超轻薄笔记本电脑(i5-7200U 8G 256G PCleSSD MX150 2G独显 FHD 指纹识别 Win10)银</div> ');
        html.push('                         <div class="btm weight red">￥999.00</div> ');
        html.push('                     </div> ');
        html.push('                     <a href="javascript:void(0);" class="link"></a> ');
        html.push('                 </div> ');
        html.push('             </div> ');
        html.push('         </div> ');
        html.push('         <div class="tip hide"> ');
        html.push('             <span class="tip-text">发送失败：...</span> ');
        html.push('         </div> ');
        html.push('     </div> ');

        if (isReturnDom) {
            var div = document.createElement('div');
                div = G(div);
                div.addClass(['line' , 'chat-order' , type]);
                div.setAttr('isTmp' , 'y');
                div.html(html.join(''));
            return div.get();
        }

        var first = '<div class="line chat-order "' + type + '" isTmp="n">';
        var last = '</div>';

        return first + html.join('') + last;
    } ,
};