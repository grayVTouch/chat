/**
 * *****************************
 * author 陈学龙 2018-05-15
 * js 定义各种动态生成的 dom 相关事件
 * *****************************
 */

// 采用下划线命名仅是为了避免名称冲突
var _event = {
    // update: 定义聊天室项事件
    definePartForThingsEvent: function(dom){
        dom = G(dom);

        var type    = dom.data('type');
        var id      = dom.data('id');

        // 待完成
        _misc.registerMenuSwitch(id);
    } ,

    // 定义会话事件
    defineSessionEvent: function(item){
        item = G(item);

        var self    = this;
        var type    = item.data('type');
        var id      = item.data('id');
        var ajax = null;

        // 会话事件
        item.loginEvent('click' , function(event){
            _domOperation.switch(id);
        } , true , false);

        // 右键单击
        item.loginEvent('mousedown' , function(event){
            return ;
            var button = event.button;

            if (button !== 2) {
                return ;
            }

            // 设置消息提醒选项
            var tar = G(event.currentTarget);
            var type = tar.data('type');
            var id = tar.data('id');
            var tip = tar.data('tip');

            self.setTipOption('session' , type , id , tip);

            // 设置位置
            var x = event.clientX;
            var y = event.clientY;

            self.context['rightKeyFloor'].removeClass('hide');
            self.context['rightKeyFloor'].css({
                left: x + 'px' ,
                top: y + 'px'
            });
        } , true , false);
    } ,

    // 定义窗口事件
    defineWindowEvent: function(dom){
        dom = G(dom);

        var type    = dom.data('type');
        var id      = dom.data('id');

        var addDispute  = G('q:.header .add-dispute' , dom.get());
        var list        = G('q:.history .list' , dom.get());

        // 列表滚动事件
        list.loginEvent('scroll' , function(event){
            var tar = G(event.currentTarget);

            if (tar.isTop()) {
                console.log('滚动加载');

                _ajax.history(id);
            }

            if (tar.isBottom()) {
                dom.data('isBottom' , 'y');
            } else {
                dom.data('isBottom' , 'n');
            }
        } , true , false);

        // 发起争议
        if (addDispute.isDom()) {
            addDispute.loginEvent('click' , this._addDisputeEvent.bind(this) , true , false);
        }
    } ,

    // 订单发起争议事件
    _addDisputeEvent: function(event){
        var self    = this;
        var tar     = G(event.currentTarget);
        var type    = tar.data('type');
        var id      = tar.data('id');

        console.log('发起争议');

        if (G.isNull(tar.data('text'))) {
            tar.data('text' , tar.text());
        }

        tar.text('正在处理...');

        // 检查聊天室是否锁定了会话
        _socket.getLockOrder(id , function(data){
            tar.text(tar.data('text'));

            if (data['status'] === 'error') {
                layer.alert(data['msg']);
                return ;
            }

            var order = data['msg'];

            layer.open({
                type: 1,
                title: '申请客服介入' ,
                skin: 'layui-layer-rim', //加上边框
                area: ['600px', '320px'], //宽高，正式部署的时候，height = 600px。
                content: _context['orderDisputeFloorHTML'] ,
                success: function(dom , index){
                    var addOrderDisputeFloor = G('.order-dispute-floor' , dom[0]).first();
                    var context = {};
                        context['title'] = G('.title' , addOrderDisputeFloor.get()).first();
                        context['description'] = G('.description' , addOrderDisputeFloor.get()).first();
                        context['submitBtn'] = G('.submit-btn' , addOrderDisputeFloor.get()).first();

                    console.log(addOrderDisputeFloor.get() , context);

                    // 获取数据
                    var getData = function(){
                        var data = {};
                            data['title'] = context['title'].val();
                            data['description'] = context['description'].val();

                        return data;
                    };

                    // 数据过滤
                    var filterData = function(data){
                        if (data['title'] === '') {
                            return {
                                status: false ,
                                msg: '争议标题尚未填写'
                            };
                        }

                        if (data['description'] === '') {
                            return {
                                status: false ,
                                msg: '争议描述尚未填写'
                            };
                        }

                        return {
                            status: true ,
                            msg: 'pass'
                        };
                    };

                    // 请求模式
                    var pending = function(){
                        topContext['loading'].show();
                        context['submitBtn'].data('isRunning' , 'y');
                    };

                    // 完成模式
                    var completed = function(){
                        topContext['loading'].hide();
                        context['submitBtn'].data('isRunning' , 'n');
                    };

                    context['submitBtn'].loginEvent('click' , function(){
                        var tar = G(this);
                        var isRunning = tar.data('isRunning');

                        if (isRunning === 'y') {
                            return ;
                        }

                        var data    = getData();
                        var filter  = filterData(data);

                        if (!filter['status']) {
                            layer.alert(filter['msg']);
                            return ;
                        }

                        pending();

                        _socket.addOrderDispute(type , id , order['order_id'] , data['title'] , data['description'] , function(data){
                            completed();

                            if (data['status'] === 'error') {
                                layer.alert(data['msg']);
                                return ;
                            }

                            layer.alert(data['msg'] , {
                                btn: ['确定'] ,
                                btn1: function(){
                                    layer.closeAll();
                                }
                            });
                        });
                    } , true , false);

                    addOrderDisputeFloor.removeClass('hide');
                }
            });
        });
    } ,

    // 定义查看更多历史记录事件
    defineViewMoreEvent: function(dom){
        dom = G(dom);

        var viewMoreBtn = G('.view-more-btn' , dom.get()).first();
        var type    = viewMoreBtn.data('type');
        var id      = viewMoreBtn.data('id');

        viewMoreBtn.loginEvent('click' , _ajax.history.bind(null , id) , true , false);
    } ,

    // 定义订单信息相关事件
    defineInfoOrderEvent: function(){
        // ...待完成
    } ,

    // 定义聊天室成员项事件
    defineGroupEvent: function(dom){
        dom = G(dom);

        var type = dom.data('type');
        var id   = dom.data('id');

        var text = G('q:.header .search .input .text' , dom.get());

        // 搜索用户事件
        text.loginEvent('keyup' , function(event){
            var tar = G(event.currentTarget);
            var key = tar.val();

            var group = _findDom.findGroup(id);
                group = G(group);
            var users = G('qa:.users .user' , group.get());

            var i   = 0;
            var cur = null;

            for (; i < users.length; ++i)
            {
                cur = users.jump(i , true);

                if (!G.isValidVal(key)) {
                    cur.removeClass('hide');
                    continue ;
                }

                var name = G('q:.info .name' , cur.get());
                var _name = name.text();

                if (_name.search(key) < 0) {
                    cur.addClass('hide');
                } else {
                    cur.removeClass('hide');
                }
            }
        } , true , false);
    } ,

    // 定义房间节点事件
    defineUserEvent: function(dom){
        console.log('可选扩展功能：定义聊天室成员相关事件');
    } ,

    // 定义订单咨询正在咨询订单的相关事件
    defineOrderConsultationEvent: function(dom){
        dom = G(dom);

        var self = this;
        var send = G('.send-btn' , dom.get()).first();

        send.loginEvent('click' , function(){
            var tar = G(this);
            var json = tar.data('json');
            var data = G.jsonDecode(json);

            _socketOperation.sendOrder(data);
        } , true , false);
    } ,

    // 添加表情事件
    defineFaceEvent: function(dom){
        dom = G(dom);

        var self = this;
        var id  = dom.data('id');
        var src = dom.data('src');
        var text = dom.data('text');

        dom.loginEvent('click' , function(){
            var sessionId = _find.getSessionId();

            if (sessionId === false) {
                layer.msg('请选择聊天室 或 会话' , {
                    time: topContext['time']
                });

                return ;
            }

            _input.addFace(sessionId , text , src)
        } , true , false);
    } ,

    // 定义房间时间
    defineRoomEvent: function(item){
        item = G(item);

        var type = item.data('type');
        var id = item.data('id');

        item.loginEvent('click' , function(){
            _socketOperation.renderRoom(id , function(){
                _domOperation.topSession(id);
            });
        } , true , false);
    } ,

    // 定义图片事件
    defineHistoryForImageEvent: function(dom){
        dom = G(dom);

        var object  = G('q:.info .msg .object' , dom.get());
        var image   = G('.image-for-history' , object.get()).first();
        var src     = image.getAttr('src');

        // 查看原图
        object.loginEvent('click' , function(event){
            window.open(src , '_blank');
        } , true , true);
    } ,

    // 定义文件事件
    defineHistoryForFileEvent: function(dom){
        dom = G(dom);

        var object = G('q:.info .msg .object' , dom.get());

        object.loginEvent('click' , function(){
            var tar = G(this);
            var url = tar.data('url');

            window.open(url , '_blank');
        } , true , false);
    } ,

    // 定义订单事件
    defineHistoryForOrderEvent: function(dom){
        dom = G(dom);

        var object = G('q:.info .msg .object' , dom.get());

        object.loginEvent('click' , function(event){
            var tar = G(event.currentTarget);

            layer.alert('你点击了订单！请添加订单事件');
        } , true , false);
    } ,
};