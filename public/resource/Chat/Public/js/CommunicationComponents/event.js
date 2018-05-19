/**
 * *****************************
 * author 陈学龙 2018-05-15
 * js 动态生成各种类型的 dom 结构
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

        var self    = this;
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
        var self = this;
        var tar = G(event.currentTarget);
        var roomType = tar.data('type');
        var roomId  = tar.data('id');

        // 检查是否存在正在咨询的订单
        // 如果不存在，则添加
        // 否不用添加

        layer.open({
            type: 1,
            title: '添加争议',
            skin: 'layui-layer-rim', //加上边框
            area: ['600px', '400px'], //宽高，正式部署的时候，height = 600px。
            content: _context['orderDisputeFloorHTML'],
            success: function (dom, index) {
                var orderDisputeFloor = G('.order-dispute-floor' , dom[0]).first();

                var context = {};
                context['trForOrderId']      = G('.tr-for-order-id' , orderDisputeFloor.get()).first();
                context['orderId']      = G('.order-id' , orderDisputeFloor.get()).first();
                context['title']        = G('.title' , orderDisputeFloor.get()).first();
                context['description']  = G('.description' , orderDisputeFloor.get()).first();
                context['submitBtn']  = G('.submit-btn' , orderDisputeFloor.get()).first();

                // 检查是否已经存在正在咨询的订单
                var orderInfo = self.findOrderConsultation(roomId);
                orderInfo = G(orderInfo);

                var hasOrder = orderInfo.isDom();

                if (hasOrder) {
                    context['trForOrderId'].addClass('hide');
                }

                context['submitBtn'].loginEvent('click' , function(event){
                    var tar = G(this);

                    var isRunning = tar.data('isRunning');

                    if (isRunning === 'y') {
                        layer.alert('请求中，请耐心等待...');
                        return ;
                    }

                    // 获取数据
                    var getData = function(){
                        var data = {};

                        data['orderId']     = hasOrder ? orderInfo.data('orderId') : context['orderId'].val();
                        data['title']       = context['title'].val();
                        data['description'] = context['description'].val();

                        return data;
                    };

                    // 过滤数据
                    var filterData = function(data){
                        if (!hasOrder && data['orderId'] === '') {
                            return {
                                status: false ,
                                msg: '订单id尚未填写'
                            };
                        }

                        if (data['title'] === '') {
                            return {
                                status: false ,
                                msg: '争议标题尚未填写'
                            };
                        }

                        return {
                            status: true ,
                            msg: 'pass'
                        };
                    };

                    // 请求状态
                    var pending = function () {
                        tar.data('isRunning' , 'y');
                        topContext['loading'].show();
                    };

                    // 完成状态
                    var complete = function(){
                        tar.data('isRunning' , 'n');
                        topContext['loading'].hide();
                    };

                    // 申请成功
                    var success = function(msg){
                        complete();

                        layer.msg(msg , {
                            time: topContext['tipTime']
                        });

                        layer.close(index);
                    };

                    // 申请失败
                    var fail = function(msg){
                        complete();

                        layer.alert(msg);
                    };

                    // 发送数据
                    var send = function(){
                        var data = getData();
                        var filter = filterData(data);

                        if (!filter['status']) {
                            layer.msg(filter['msg'] , {
                                time: topContext['tipTime']
                            });

                            return ;
                        }

                        // 设置请求状态
                        pending();

                        // 发起申请
                        self.socket.addOrderDispute(roomType , roomId , data['orderId'] , data['title'] , data['description'] , function(data){
                            console.log(data);

                            if (data['status'] === 'error') {
                                fail(data['msg']);
                            } else {
                                success(data['msg']);
                            }
                        });
                    };

                    send();
                } , true , false);

                orderDisputeFloor.removeClass('hide');
            }
        });

        console.log('发生争议');
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


    // 定义房间节点事件
    defineUserEvent: function(dom){
        console.log('定义聊天室成员相关事件');
    } ,

    // 定义订单咨询正在咨询订单的相关事件
    defineOrderConsultationEvent: function(dom){
        dom = G(dom);

        var self = this;
        var roomId = dom.data('roomId');
        var orderId = dom.data('orderId');
        var send = G('.send-btn' , dom.get()).first();
        var view = G('.view-btn' , dom.get()).first();

        send.loginEvent('click' , function(){
            var tar = G(this);
            var name = tar.data('name');

            // 获取封装好的字符串进行发送
            var text = '【正在咨询的订单：' + name + '】';

            self.sendOrder(text);
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
            _system.socket.getRoom(id , function(data){
                if (data['status'] === 'error') {
                    layer.alert('获取聊天室信息失败，请稍后再试');
                    return ;
                }

                data = data['msg'];

                // 移除空节点
                _domOperation.removeEmpty(_context['s_items'].get());

                _render.renderSession(data);
                _render.renderWindow(data);
                _render.renderGroup(data);
                _render.renderPartForThings(data);

                _domOperation.switch(data['room_id']);
            });
        } , true , false);
    } ,

    // 定义图片事件
    defineHistoryForImageEvent: function(dom){
        dom = G(dom);

        var image = G('q:.info .msg .object .image-for-history' , dom.get());

        // 查看原图
        image.loginEvent('click' , function(event){
            var tar = G(event.currentTarget);
            var src = tar.getAttr('src');

            window.open(src , '_blank');
        } , true , true);
    } ,

    // 定义文件事件
    defineHistoryForFileEvent: function(dom){
        dom = G(dom);


    } ,
};