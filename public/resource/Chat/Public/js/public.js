(function(){
    "use strict";

    /**
     * ************
     * 外链信息
     * ************
     */
    (function(){
        var qs = G.queryString();

        if (qs === false) {
            topContext['type']      =  G.isUndefined(qs['type']) ? '' : qs['type'];
            topContext['orderId']   = G.isUndefined(qs['order_id']) ? '' : qs['order_id'];
        } else {
            topContext['type']      =  '';
            topContext['orderId']   = '';
        }
    })();

    /**
     * *********
     * 局部全局变量
     * *********
     */
    var context = {};

    context['bodyLeft'] = G('.body-left').first();
    context['bodyRight'] = G('.body-right').first();

    // 顶部导航栏功能
    context['topNav'] = G('.top-nav').first();
    context['advoise'] = G('.advoise' , context['topNav'].get()).first();
    context['order'] = G('.order' , context['topNav'].get()).first();
    context['user'] = G('.user' , context['topNav'].get()).first();
    context['operation'] = G('.operation' , context['user'].get()).first();
    context['loginOut'] = G('.login-out' , context['operation'].get()).first();

    // 收缩快
    context['stretchBlock'] = G('.stretch-block' , context['bodyLeft'].get()).first();
    context['horizontal'] = G('.horizontal' , context['stretchBlock'].get()).first();
    context['vertical'] = G('.vertical' , context['stretchBlock'].get()).first();

    // 我的聊天室
    context['rooms']    = G('.rooms' , context['bodyLeft'].get()).first();
    context['r_header'] = G('.header' , context['rooms'].get()).first();

    // 功能区域
    context['functions'] = G('.functions' , context['bodyRight'].get()).first();


    context['sessions'] = G('.sessions' , context['functions'].get()).first();
    context['chatWindow'] = G('.chat-window' , context['functions'].get()).first();
    context['roomUser'] = G('.room-user' , context['functions'].get()).first();
    context['things'] = G('.things' , context['functions'].get()).first();

    // 聊天室成员伸缩功能
    context['roomUserControl']   = G('.room-user-control' , context['topNav'].get()).first();
    context['statusForRoomUserControl'] = G('.status' , context['roomUserControl'].get()).first();

    // user-info
    context['userInfo'] = G('.user-info' , context['bodyLeft'].get()).first();

    /**
     * *************
     * 屏蔽系统右键
     * *************
     */
    // G.contextmenu();

    /**
     * ********************************
     * 客服系统初始化
     * 定义到全局变量是方便通信组件使用
     * ********************************
     */
    window['_system'] = new System({
        wsLink: 'ws://192.168.150.135:8282'
    });

    /**
     * *****************************************
     * 如果是通过外链进入，则检查是否有初始化动作
     * *****************************************
     */
    // 平台咨询处理
    var advoiseHandle = function(){
        // 创建聊天室（如果不存在的话，不会重复创建，无需担心）
        system.createRoom(document.documentElement , 'advoise' , null , function(room){
            var users = [
                {
                    user_id: topContext['userId'] ,
                    user_type: topContext['userType']
                }
            ];

            // 加入聊天室
            system.socket.joinRoom(room['type'] , room['id'] , users , function(msg){
                console.log(msg);

                // 获取聊天室详情
                system.socket.getRoomInfo(room['type'] , room['id'] , function(data){
                    if (data['status'] === 'error') {
                        console.log(data['msg']);
                        return ;
                    }

                    room = data['msg'];

                    // 自动分配客服
                    system.socket.autoAllocate(room['type'] , room['id'] , function(data){
                        console.log(data['msg']);
                    });

                    // 更新聊天室
                    system.setRooms();
                    // 添加会话
                    system.addSession(room['type'] , room['id'] , room['_name'] , room['tip'] , room['count'] , room['sort']);
                    // 添加聊天窗口
                    system.addWindow(room['type'] , room['id'] , room['_name']);
                    // 手动同步聊天室数据
                    system.socket.user(room['id'] , function(data){
                        if (data['status'] === 'error') {
                            console.log(data['msg']);
                            return ;
                        }

                        data = data['msg'];

                        // 添加聊天室用户
                        system.addUser(room['type'] , room['id'] , data['online'] , data['count']);
                        var i       = 0;
                        var users   = data['user'];
                        var cur     = null;

                        for (; i < users.length; ++i)
                        {
                            cur = users[i];
                            system.addRoomUser(cur['room_id'] , cur['user_type'] , cur['user_id'] , cur['details']['username'] , cur['details']['thumb'] , cur['status']);
                        }
                    });
                });
            });
        });
    };

    // 订单咨询处理
    var orderHandle = function(type , order){
        var typeRange   = ['order' , 'disputeOrder'];
        type        = G.contain(type , typeRange) ? type : 'order';

        // 发送数据
        var handle = function(room){
            // 如果是订单咨询的话，手动获取当前正咨询的订单
            system.socket.getLockOrder(room['id'] , function(data){
                if (data['status'] === 'error') {
                    console.log(data['msg']);
                    return ;
                }

                data = data['msg'];

                // addOrderConsultation: function(roomId , orderId , type , name , send , accept){

                system.addOrderConsultation(data['room_id'] , data['order_id'] , data['tag'] , data['order_no'] , data['send_userid'] , data['accept_userid']);

            });
            console.log('创建聊天室成功' , room);

            var users = [
                {
                    user_type: topContext['userType'] ,
                    user_id: topContext['userId']
                } ,
                {
                    user_type: order['send_user_type'] ,
                    user_id: order['send_userid']
                }
            ];

            // console.log(room);

            system.socket.joinRoom(room['type'] , room['id'] , users , function(msg){
                console.log('加入聊天室成功');
                layer.closeAll();
            });
        };

        if (type === 'order') {
            system.createRoom(document.documentElement , 'order' , order['order_id'] , handle);
        } else {
            system.createRoomForDisputeOrder(document.documentElement , order['order_id'] , handle);
        }
    };

    (function(){
        if (topContext['type'] !== '') {
            if (topContext['type'] === 'advoise') {
                // 平台咨询
                advoiseHandle();
            } else if (topContext['type'] === 'order') {
                // 订单咨询
                system.getOrderInfo(context['order'].get() , topContext['orderId'] , function(data){
                    orderHandle('order' , data);
                });
            } else {
                // 其他类型的请求
            }
        }
    })();

    /**
     * ******************
     * 顶部导航栏相关功能
     * ******************
     */
    (function(){
        var orderFloor = G('.order-floor').first();
        var orderFloorHTML = orderFloor.html(null , 'outer');

        // 删除元素
        orderFloor.get().parentNode.removeChild(orderFloor.get());

        if (topContext['userType'] === topContext['_user']) {
            // 测试：平台咨询
            context['advoise'].loginEvent('click' , advoiseHandle , true , false);
        }

        // 显示 layer 弹层
        var showOrderFloor = function(fn){
            layer.open({
                type: 1,
                title: '填写订单id',
                skin: 'layui-layer-rim', //加上边框
                area: ['600px', '280px'], //宽高，正式部署的时候，height = 600px。
                content: orderFloorHTML,
                success: function (dom, index) {
                    var orderFloor = G('.order-floor' , dom[0]).first();

                    var context = {};
                        context['orderId']          = G('.order-id' , orderFloor.get()).first();
                        context['existsAcceptUser'] = G('.exists-accept-user' , orderFloor.get()).first();
                        context['isTag'] = G('.is-tag' , orderFloor.get()).first();
                        context['myselfAccept'] = G('.myself-accept' , orderFloor.get()).first();
                        context['getOrderInfo'] = G('.get-order-info' , orderFloor.get()).first();
                        context['order']            = G('.order' , orderFloor.get()).first();
                        context['orderRelated']     = G('.order-related' , orderFloor.get()).first();
                    // 获取订单的信息
                    context['getOrderInfo'].loginEvent('click' , function(){
                        var orderId = context['orderId'].val();

                        if (!G.isValidVal(orderId)) {
                            layer.msg('订单无效' , {
                                time: topContext['tipTime']
                            });

                            return ;
                        }

                        // 不允许更新订单
                        context['orderId'].setAttr('readonly' , 'readonly');

                        // 获取订单信息
                        system.getOrderInfo(context['getOrderInfo'].get() , orderId , function(data){
                            // 移除自身
                            context['getOrderInfo'].get().parentNode.removeChild(context['getOrderInfo'].get());

                            var existsText = G.isValidVal(data['accept_userid']) ? '是' : '否';
                            var isTagText = G.isValidVal(data['tag']) ? '关联订单，tag=' + data['tag'] : '非关联订单';
                            var myselfAcceptText = topContext['userType'] == 'user' && topContext['userId'] == data['accept_userid'] ? '是' : '否';

                            context['existsAcceptUser'].text(existsText);
                            context['isTag'].text(isTagText);
                            context['myselfAccept'].text(myselfAcceptText);

                            // 控制功能的显示和隐藏
                            if (!G.isValidVal(data['accept_userid'])) {
                                context['order'].removeClass('hide');
                            } else {
                                // context['orderRelated'].removeClass('hide');
                                if (!G.isValidVal(data['tag'])) {
                                    // 关联订单
                                    context['order'].removeClass('hide');
                                } else {
                                    if (topContext['userType'] != 'user' || data['accept_userid'] != topContext['userId']) {
                                        context['order'].removeClass('hide');
                                    } else {
                                        context['order'].removeClass('hide');
                                        context['orderRelated'].removeClass('hide');
                                    }
                                }
                            }
                        });

                        if (G.isFunction(fn)) {
                            fn(orderId);
                        }
                    } , true , false);

                    // 单纯的发起同发单人的私聊
                    context['order'].loginEvent('click' , function(){
                        var orderId = context['orderId'].val();

                        system.getOrderInfo(context['order'].get() , orderId , function(data){
                            orderHandle('order' , data);
                        });
                    } , true , false);

                    context['orderRelated'].loginEvent('click' , function(){
                        var orderId = context['orderId'].val();

                        system.getOrderInfo(context['order'].get() , orderId , function(data){
                            orderHandle('disputeOrder' , data);
                        });
                    });

                    orderFloor.removeClass('hide');
                }
            });
        };

        // 测试：订单咨询
        context['order'].loginEvent('click' , function(event){
            var tar = G(event.currentTarget);

            showOrderFloor();
        } , true , false);
    })();

    /**
     * *************
     * 用户面板效果
     * *************
     */

    // 显示用户操作面板
    var showOperation = function(){
        context['operation'].removeClass('hide');

        var curBtmVal = context['operation'].getCoordVal('bottom');
        var endBtmVal = 0;
        var curOpacity = parseFloat(context['operation'].getStyleVal('opacity'));
        var endOpacity = 1;

        context['operation'].animate({
            time: topContext['time'] ,
            json: [
                {
                    attr: 'bottom' ,
                    sVal: curBtmVal ,
                    eVal: endBtmVal
                } ,
                {
                    attr: 'opacity' ,
                    sVal: curOpacity ,
                    eVal: endOpacity
                } ,
            ]
        });
    };

    // 隐藏用户操作面板
    var hideOperation = function(){
        context['operation'].removeClass('hide');

        var curBtmVal = context['operation'].getCoordVal('bottom');
        var endBtmVal = -10;
        var curOpacity = parseFloat(context['operation'].getStyleVal('opacity'));
        var endOpacity = 0;

        context['operation'].animate({
            time: topContext['time'] ,
            json: [
                {
                    attr: 'bottom' ,
                    sVal: curBtmVal ,
                    eVal: endBtmVal
                } ,
                {
                    attr: 'opacity',
                    sVal: curOpacity,
                    eVal: endOpacity
                }
            ] ,
            fn: function(){
                context['operation'].addClass('hide');
            }
        });
    };

    context['user'].loginEvent('mouseover' , showOperation , true , false);
    context['user'].loginEvent('mouseout' , hideOperation , true , false);

    /**
     * ******************
     * 用户注销
     * ******************
     */
    var loginOutLink = topContext['url'] + 'UserSign/loginOut';

    var loginOut = function(){
        request({
            url: loginOutLink ,
            method: 'post' ,
            tip: false ,
            headers: {
                'X-CSRF-TOKEN': topContext['token']
            } ,
            btn: context['loginOut'].get() ,
            success: function(msg){
                window.history.go(0);
            }
        });
    };

    context['loginOut'].loginEvent('click' , loginOut , true , false);

    /**
     * *************
     * 伸缩块
     * *************
     */
    var originWForBodyLeft     = context['bodyLeft'].getEleW('border-box');
    var stretchWForBodyLeft    = 40;

    var originWForUserInfo = context['userInfo'].getEleW('border-box');
    var originHForUserInfo = context['userInfo'].getEleH('border-box');

    // 显示用户信息
    var showUserInfo = function(){
        context['userInfo'].removeClass('hide');

        var curW = context['userInfo'].getEleW('border-box');
        var endW = originWForUserInfo;
        var curH = context['userInfo'].getEleW('border-box');
        var endH = originHForUserInfo;

        context['userInfo'].animate({
            carTime: topContext['time'] ,
            json: [
                {
                    attr: 'width' ,
                    sVal: curW ,
                    eVal: endW
                } ,
                {
                    attr: 'height' ,
                    sVal: curH ,
                    eVal: endH
                }
            ]
        });
    };

    // 隐藏用户信息
    var hideUserInfo = function(){
        var curW = context['userInfo'].getEleW('border-box');
        var endW = 0;
        var curH = context['userInfo'].getEleW('border-box');
        var endH = 0;

        context['userInfo'].animate({
            carTime: topContext['time'] ,
            json: [
                {
                    attr: 'width' ,
                    sVal: curW ,
                    eVal: endW
                } ,
                {
                    attr: 'height' ,
                    sVal: curH ,
                    eVal: endH
                }
            ] ,
            fn: function(){
                context['userInfo'].addClass('hide');
            }
        });
    };

    // 显示收缩块
    var showStretchBlock = function(){
        context['horizontal'].removeClass('hide');
        context['vertical'].addClass('hide');
    };

    // 显示伸展块
    var showSpreadBlock = function(){
        context['horizontal'].addClass('hide');
        context['vertical'].removeClass('hide');
    };

    // 设置空数据类名（如果有的话）
    // 以后再来

    // 收缩
    var stretchRoom = function(){
        // 保存状态
        window.localStorage.setItem('room-stretch-status' , 'stretch');
        // 更改状态
        context['stretchBlock'].data('status' , 'stretch');
        // 更改样式
        context['stretchBlock'].addClass('spread');

        // 隐藏 userInfo
        hideUserInfo();
        // 展示伸展快
        showSpreadBlock();

        var curW = context['bodyLeft'].getEleW('border-box');
        var endW = stretchWForBodyLeft;
        var curML = context['bodyRight'].getCoordVal('marginLeft');
        var endML = stretchWForBodyLeft;

        // 多余的头部隐藏
        context['r_header'].addClass('hide');

        context['bodyLeft'].animate({
            carTime: topContext['time'] ,
            json: [
                {
                    attr: 'width' ,
                    sVal: curW ,
                    eVal: endW
                }
            ] ,
            fn: function(){
                setBodyLeftH();
                setBodyRightH();
                setTopNavW();
            }
        });

        context['bodyRight'].animate({
            carTime: topContext['time'] ,
            json: [
                {
                    attr: 'marginLeft' ,
                    sVal: curML ,
                    eVal: endML
                }
            ]
        });
    };

    var spreadRoom = function(){
        // 保存状态
        window.localStorage.setItem('room-stretch-status' , 'spread');
        // 更改状态
        context['stretchBlock'].data('status' , 'spread');
        // 更改样式
        context['stretchBlock'].removeClass('spread');

        // 隐藏用户信息
        showUserInfo();
        // 展示伸展快
        showStretchBlock();

        var curW = context['bodyLeft'].getEleW('border-box');
        var endW = originWForBodyLeft;
        var curML = context['bodyRight'].getCoordVal('marginLeft');
        var endML = originWForBodyLeft;

        context['bodyLeft'].animate({
            carTime: topContext['time'] ,
            json: [
                {
                    attr: 'width' ,
                    sVal: curW ,
                    eVal: endW
                }
            ] ,
            fn: function(){
                // 多余的头部隐藏
                context['r_header'].removeClass('hide');
            }
        });

        context['bodyRight'].animate({
            carTime: topContext['time'] ,
            json: [
                {
                    attr: 'marginLeft' ,
                    sVal: curML ,
                    eVal: endML
                }
            ]
        });
    };

    context['stretchBlock'].loginEvent('click' , function(){
        var tar = G(this);
        var status = tar.data('status');

        if (status === 'stretch') {
            spreadRoom();
        } else {
            stretchRoom();
        }
    } , true , false);

    // 初始化
    (function(){
        var status = window.localStorage.getItem('room-stretch-status');

        if (status === 'stretch') {
            stretchRoom();
        }
    })();

    /**
     * *****************
     * 聊天室成员伸缩
     * *****************
     */
    var originWForRoomUser          = 221;
    var originThingsMarginLeft      = 982;
    var focusStatusSrc   = context['statusForRoomUserControl'].data('focus');
    var unfocusStatusSrc = context['statusForRoomUserControl'].data('unfocus');

    // 伸展 things
    var spreadThings = function(){
        var curML = context['things'].getCoordVal('marginLeft');
        var endML = originThingsMarginLeft - originWForRoomUser;

        context['things'].animate({
            carTime: topContext['time'] ,
            json: [
                {
                    attr: 'marginLeft' ,
                    sVal: curML ,
                    eVal: endML
                }
            ]
        });
    };

    // 收缩 things
    var stretchThings = function(){
        var curML = context['things'].getCoordVal('marginLeft');
        var endML = originThingsMarginLeft;

        context['things'].animate({
            carTime: topContext['time'] ,
            json: [
                {
                    attr: 'marginLeft' ,
                    sVal: curML ,
                    eVal: endML
                }
            ]
        });
    };

    // 显示聊天室成员
    var showRoomUser = function(){
        window.localStorage.setItem('room-user-stretch-status' , 'show');

        context['roomUserControl'].data('status' , 'show');
        context['roomUser'].css({
            width: '0px'
        });
        context['roomUser'].removeClass('hide');
        context['statusForRoomUserControl'].setAttr('src' , focusStatusSrc);

        // 收缩相关信息
        stretchThings();

        var curW = context['roomUser'].getEleW('border-box');
        var endW = originWForRoomUser;

        context['roomUser'].animate({
            carTime: topContext['time'] ,
            json: [
                {
                    attr: 'width' ,
                    sVal: curW ,
                    eVal: endW
                }
            ]
        });
    };

    // 隐藏聊天室成员
    var hideRoomUser = function(){
        window.localStorage.setItem('room-user-stretch-status' , 'hide');

        context['roomUserControl'].data('status' , 'hide');
        context['roomUserControl'].addClass('spread');
        context['statusForRoomUserControl'].setAttr('src' , unfocusStatusSrc);

        console.log(unfocusStatusSrc , 'hide');

        // 扩展相关信息
        spreadThings();

        var curW = context['roomUser'].getEleW('border-box');
        var endW = 0;

        context['roomUser'].animate({
            carTime: topContext['time'] ,
            json: [
                {
                    attr: 'width' ,
                    sVal: curW ,
                    eVal: endW
                }
            ] ,
            fn: function(){
                context['roomUser'].addClass('hide');
            }
        });
    };

    context['roomUserControl'].loginEvent('click' , function(){
        var tar = G(this);
        var status = tar.data('status');

        if (status === 'hide') {
            showRoomUser();
        } else {
            hideRoomUser();
        }

    } , true , false);

    // 初始化
    (function(){
        var status = window.localStorage.getItem('room-user-stretch-status');

        console.log('聊天室成员信息' , status);
        if (status === 'hide') {
            hideRoomUser();
        } else {
            showRoomUser();
        }
    })();

    /**
     * **************
     * 高度 & 宽度自适应
     * **************
     */
    var topNavH = context['topNav'].getEleH('border-box');
    // 最小高度
    var minH    = 400;

    // 设置 body-left
    var setBodyLeftH = function(){
        var clientH = document.documentElement.clientHeight;
        var setH    = clientH < minH ? minH : clientH;

        context['bodyLeft'].css({
            height: setH + 'px'
        });
    };

    // 设置 body-right
    var setBodyRightH = function(){
        var clientH = document.documentElement.clientHeight;
        var setH = clientH - topNavH;
            setH = setH < minH ? minH : setH;

        context['functions'].css({
            height: setH + 'px'
        });
    };

    // 设置 top-nav 的最小宽度
    var setTopNavW = function(){
        return ;
        var sessionsW       = context['sessions'].getEleW('border-box');
        var chatWindowW     = context['chatWindow'].getEleW('border-box');
        var roomUserW       = context['roomUser'].getEleW('border-box');
        var thingsW  = context['things'].getEleW('border-box');
        var bodyRightW      = sessionsW + chatWindowW + roomUserW + thingsW;

        context['topNav'].css({
            minWidth: bodyRightW + 'px'
        });

        context['bodyRight'].css({
            minWidth: bodyRightW + 'px'
        });
    };

    // 设置聊天窗口的高度


    // 高度自适应
    topContext['win'].loginEvent('resize' , function(){
        setBodyLeftH();
        setBodyRightH();
        setTopNavW();
    } , true , false);

    // 初始化设置高度
    (function(){
        setBodyLeftH();
        setBodyRightH();
        setTopNavW();
    })();
})();