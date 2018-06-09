// 平台咨询处理
function createAdvoise(){
    var formData = G.getFormData({
        room_type: 'advoise' ,
        user_type: topContext['userType'] ,
        user_id: topContext['userId']
    });

    request({
        url: _links['createRoom'] ,
        method: 'post' ,
        dom: document.body ,
        send: formData ,
        tip: false ,
        success: function(data){
            var users = [
                {
                    user_type: topContext['userType'] ,
                    user_id: topContext['userId']
                }
            ];

            // 加入聊天室
            _socket.joinRoom(data['type'] , data['id'] , users , function(msg) {
                // 请一定在用户加入聊天室后在自动分配客服
                // 否则可能会出现聊天室仅分配到了客服的情况（用户加入聊天室失败了）
                _socket.autoAllocate(data['type'] , data['id'] , function(msg){
                    console.log('自动分配客服结果：' , msg);
                });
            });
        } ,
        error: function(msg){
            layer.msg(msg , {
                time: topContext['tipTime']
            });
        }
    });
}


// 创建订单咨询
function createOrder(id){
    var formData = G.getFormData({
        order_id: id
    });

    // 首先获取订单信息
    request({
        url: _links['getOrder'] ,
        method: 'post' ,
        send: formData ,
        tip:false ,
        dom: topContext['body'].get() ,
        success: function(order){
            formData = G.getFormData({
                user_type: topContext['userType'] ,
                user_id: topContext['userId'] ,
                room_type: 'order' ,
                order_id: id
            });

            // 创建聊天室
            request({
                url: _links['createRoom'] ,
                method: 'post' ,
                dom: topContext['body'].get() ,
                send: formData ,
                tip: false ,
                success: function(data){
                    var users = [
                        {
                            user_type: topContext['userType'] ,
                            user_id: topContext['userId']
                        } ,
                        {
                            user_type: order['user_type_for_send'] ,
                            user_id: order['user_id_for_send']
                        }
                    ];

                    // 加入聊天室
                    _socket.joinRoom(data['type'] , data['id'] , users , function(){
                        // 锁定聊天室正在咨询的订单
                        this.orderConsultation(data['id'] , id , function(data){
                            // 锁定步骤交给 socket 的回调事件即可！
                            /*
                            if (data['status'] === 'error') {
                                console.log(data['msg']);
                                return ;
                            }

                            data = data['msg'];
                            _render.renderOrderConsultation(data);
                            console.log('锁定聊天室正在咨询的订单成功' , data);
                            */
                        });
                    });
                } ,
                error: function(msg){
                    layer.msg(msg , {
                        time: topContext['tipTime']
                    });
                }
            });
        } ,
        error: function (msg) {
            layer.msg(msg , {
                time: topContext['tipTime']
            });
        }
    });
}