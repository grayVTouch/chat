/**
 * *****************************
 * author 陈学龙 2018-05-15
 * js 动态生成各种类型的 dom 结构
 * *****************************
 */

// 采用下划线命名仅是为了避免名称冲突
var _ajax = {
    // 创建房间
    createRoom: function(dom , type , orderId , fn){
        var typeRange = ['advoise' , 'order'];

        if (!G.contain(type , typeRange)) {
            throw new Error('不支持的类型');
        }

        if (type === 'order' && G.isUndefined(orderId)) {
            throw new Error('订单 id 尚未提供');
        }

        dom = G(dom);

        var isRunning = dom.data('isRunning');

        console.log(isRunning);

        if (isRunning === 'y') {
            layer.alert('加载中，请耐心等待...');
            return ;
        }

        orderId = G.isValidVal(orderId) ? orderId : '';

        var self    = this;
        var formData = G.getFormData({
            room_type: type ,
            user_type: topContext['userType'] ,
            user_id: topContext['userId'] ,
            order_id: orderId
        });

        this.pending(dom.get() , topContext['loading']);

        G.ajax({
            url: this.links['createRoom'] ,
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

    // 创建房间
    createRoomForDisputeOrder: function(dom , orderId , fn){
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
            user_type: topContext['userType'] ,
            user_id: topContext['userId'] ,
            order_id: orderId
        });

        this.pending(dom.get() , topContext['loading']);

        G.ajax({
            url: this.links['createRoomForDisputeOrder'] ,
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

    // 加入房间
    joinRoom: function(dom , roomId , users , fn){
        dom = G(dom);

        var isRunning = dom.data('isRunning');

        if (isRunning === 'y') {
            layer.alert('加载中，请耐心等待...');
            return ;
        }

        var self    = this;
        var formData = G.getFormData({
            room_id: roomId ,
            users: G.jsonEncode(users)
        });

        this.pending(dom.get() , topContext['loading']);

        G.ajax({
            url: this.links['joinRoom'] ,
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
    // 查看更多历史记录
    history: function(id){
        var win         = _findDom.findWindow(id);
            win         = G(win);
        var isRunning   = win.data('isRunning');
        var disabled    = win.data('disabled');
        var type        = win.data('type');

        if (disabled === 'y' || isRunning === 'y') {
            console.log('最后一页 或 请求中，请勿重复操作');
            return ;
        }

        var self        = this;
        var identifier  = win.data('identifier');
        var page        = win.data('page');

        if (G.isNull(page)) {
            win.data('page' , page = 0);
        }

        page = parseInt(page);
        page++;

        // 设置加载状态
        win.data('isRunning' , 'y');

        var viewMore    = G('q:.history .list .view-more' , win.get());
        var image       = G('.image' , viewMore.get()).first();

        image.removeClass('hide');

        var formData = G.getFormData({
            room_id: id ,
            page: page ,
            identifier: identifier
        });

        // 简易的 ajax 封装
        ajax({
            url: _links['history'] ,
            method: 'post' ,
            headers: {
                'X-CSRF-TOKEN': topContext['token']
            } ,
            send: formData ,
            success: function(data){
                // 取消加载状态
                win.data('isRunning' , 'n');

                // 设置页数
                win.data('page' , data['page']);

                var his = data['history'];

                var list        = G('q:.history .list' , win.get());
                var _viewMore   = G('.view-more' , list.get()).first();
                var _viewMoreH  = _viewMore.getTH();

                // 移除之前的加载更多
                list.remove(_viewMore.get());

                // 没有历史记录，跳过
                if (his.length === 0) {
                    return ;
                }

                // 记住最近一条记录的 top 值
                // 必须要在添加添加节点之前保存起来
                var _oFirst = _findDom.getHistoryForFirst(id);
                    _oFirst = G(_oFirst);

                var i       = 0;
                for (; i < his.length; ++i)
                {
                    _render.insertHistory(his[i]);
                }

                if (data['max_page'] != data['page']) {
                    // 不是最后一页
                    var domForViewMore = _dom.getViewMore({
                        room_type: type ,
                        room_id: id
                    } , true);
                    var first = list.children({} , false , true).first();

                    if (first.isDom()) {
                        G.insertBefore(domForViewMore , first.get());
                    } else {
                        list.append(viewMore);
                    }

                    // 定义查看更多事件
                    _event.defineViewMoreEvent(domForViewMore);
                } else {
                    // 最后一页了，禁止继续加载浏览记录
                    win.data('disabled' , 'y');
                }

                // 滚动到原先浏览的位置
                if (_oFirst.isDom()) {
                    var distanceH   = _oFirst.getDocOffsetVal('top' , list.get());
                    var maxT        = Math.max(0 , distanceH - _viewMoreH);

                    // 滚动到底部
                    list.scroll(0 , 'y' , 0 , maxT);
                }
            }
        });
    } ,
};