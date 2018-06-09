(function(){
    "use strict";

    /**
     * ************
     * 外链信息
     * ************
     */
    (function(){
        var qs = G.queryString();

        if (qs !== false) {
            var type    = qs['type'];
            var id      = qs['id'];

            switch (type)
            {
                case 'advoise':
                    createAdvoise();
                    break;
                case 'order':
                    createOrder(id);
                    break;
                default:
                    // 待扩展的其他类型咨询！
            }
        }
    })();

    /**
     * *************
     * 屏蔽系统右键
     * *************
     */
    // G._contextmenu();

    /**
     * ********************************
     * 客服系统初始化
     * 定义到全局变量是方便通信组件使用
     * ********************************
     */
    window['_system'] = new System({});

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
                system.getOrderInfo(_context['order'].get() , topContext['orderId'] , function(data){
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
            _context['advoise'].loginEvent('click' , advoiseHandle , true , false);
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

                    var _context = {};
                        _context['orderId']          = G('.order-id' , orderFloor.get()).first();
                        _context['existsAcceptUser'] = G('.exists-accept-user' , orderFloor.get()).first();
                        _context['isTag'] = G('.is-tag' , orderFloor.get()).first();
                        _context['myselfAccept'] = G('.myself-accept' , orderFloor.get()).first();
                        _context['getOrderInfo'] = G('.get-order-info' , orderFloor.get()).first();
                        _context['order']            = G('.order' , orderFloor.get()).first();
                        _context['orderRelated']     = G('.order-related' , orderFloor.get()).first();
                    // 获取订单的信息
                    _context['getOrderInfo'].loginEvent('click' , function(){
                        var orderId = _context['orderId'].val();

                        if (!G.isValidVal(orderId)) {
                            layer.msg('订单无效' , {
                                time: topContext['tipTime']
                            });

                            return ;
                        }

                        // 不允许更新订单
                        _context['orderId'].setAttr('readonly' , 'readonly');

                        // 获取订单信息
                        system.getOrderInfo(_context['getOrderInfo'].get() , orderId , function(data){
                            // 移除自身
                            _context['getOrderInfo'].get().parentNode.removeChild(_context['getOrderInfo'].get());

                            var existsText = G.isValidVal(data['accept_userid']) ? '是' : '否';
                            var isTagText = G.isValidVal(data['tag']) ? '关联订单，tag=' + data['tag'] : '非关联订单';
                            var myselfAcceptText = topContext['userType'] == 'user' && topContext['userId'] == data['accept_userid'] ? '是' : '否';

                            _context['existsAcceptUser'].text(existsText);
                            _context['isTag'].text(isTagText);
                            _context['myselfAccept'].text(myselfAcceptText);

                            // 控制功能的显示和隐藏
                            if (!G.isValidVal(data['accept_userid'])) {
                                _context['order'].removeClass('hide');
                            } else {
                                // _context['orderRelated'].removeClass('hide');
                                if (!G.isValidVal(data['tag'])) {
                                    // 关联订单
                                    _context['order'].removeClass('hide');
                                } else {
                                    if (topContext['userType'] != 'user' || data['accept_userid'] != topContext['userId']) {
                                        _context['order'].removeClass('hide');
                                    } else {
                                        _context['order'].removeClass('hide');
                                        _context['orderRelated'].removeClass('hide');
                                    }
                                }
                            }
                        });

                        if (G.isFunction(fn)) {
                            fn(orderId);
                        }
                    } , true , false);

                    // 单纯的发起同发单人的私聊
                    _context['order'].loginEvent('click' , function(){
                        var orderId = _context['orderId'].val();

                        system.getOrderInfo(_context['order'].get() , orderId , function(data){
                            orderHandle('order' , data);
                        });
                    } , true , false);

                    _context['orderRelated'].loginEvent('click' , function(){
                        var orderId = _context['orderId'].val();

                        system.getOrderInfo(_context['order'].get() , orderId , function(data){
                            orderHandle('disputeOrder' , data);
                        });
                    });

                    orderFloor.removeClass('hide');
                }
            });
        };

        // 测试：订单咨询
        _context['order'].loginEvent('click' , function(event){
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
        _context['operation'].removeClass('hide');

        var curBtmVal = _context['operation'].getCoordVal('bottom');
        var endBtmVal = 0;
        var curOpacity = parseFloat(_context['operation'].getStyleVal('opacity'));
        var endOpacity = 1;

        _context['operation'].animate({
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
        _context['operation'].removeClass('hide');

        var curBtmVal = _context['operation'].getCoordVal('bottom');
        var endBtmVal = -10;
        var curOpacity = parseFloat(_context['operation'].getStyleVal('opacity'));
        var endOpacity = 0;

        _context['operation'].animate({
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
                _context['operation'].addClass('hide');
            }
        });
    };

    _context['user'].loginEvent('mouseover' , showOperation , true , false);
    _context['user'].loginEvent('mouseout' , hideOperation , true , false);

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
            dom: _context['loginOut'].get() ,
            headers: {
                'X-CSRF-TOKEN': topContext['token']
            } ,
            success: function(msg){
                window.history.go(0);
            }
        });
    };

    _context['loginOut'].loginEvent('click' , loginOut , true , false);

    /**
     * *************
     * 伸缩块
     * *************
     */
    var originWForBodyLeft     = _context['bodyLeft'].getEleW('border-box');
    var stretchWForBodyLeft    = 40;

    var originWForUserInfo = _context['userInfo'].getEleW('border-box');
    var originHForUserInfo = _context['userInfo'].getEleH('border-box');

    // 显示用户信息
    var showUserInfo = function(){
        _context['userInfo'].removeClass('hide');

        var curW = _context['userInfo'].getEleW('border-box');
        var endW = originWForUserInfo;
        var curH = _context['userInfo'].getEleW('border-box');
        var endH = originHForUserInfo;

        _context['userInfo'].animate({
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
        var curW = _context['userInfo'].getEleW('border-box');
        var endW = 0;
        var curH = _context['userInfo'].getEleW('border-box');
        var endH = 0;

        _context['userInfo'].animate({
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
                _context['userInfo'].addClass('hide');
            }
        });
    };

    // 显示收缩块
    var showStretchBlock = function(){
        _context['horizontal'].removeClass('hide');
        _context['vertical'].addClass('hide');
    };

    // 显示伸展块
    var showSpreadBlock = function(){
        _context['horizontal'].addClass('hide');
        _context['vertical'].removeClass('hide');
    };

    // 设置空数据类名（如果有的话）
    // 以后再来

    // 收缩
    var stretchRoom = function(){
        // 保存状态
        window.localStorage.setItem('room-stretch-status' , 'stretch');
        // 更改状态
        _context['stretchBlock'].data('status' , 'stretch');
        // 更改样式
        _context['stretchBlock'].addClass('spread');

        // 隐藏 userInfo
        hideUserInfo();
        // 展示伸展快
        showSpreadBlock();

        var curW = _context['bodyLeft'].getEleW('border-box');
        var endW = stretchWForBodyLeft;
        var curML = _context['bodyRight'].getCoordVal('marginLeft');
        var endML = stretchWForBodyLeft;

        // 多余的头部隐藏
        _context['r_header'].addClass('hide');

        _context['bodyLeft'].animate({
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

        _context['bodyRight'].animate({
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
        _context['stretchBlock'].data('status' , 'spread');
        // 更改样式
        _context['stretchBlock'].removeClass('spread');

        // 隐藏用户信息
        showUserInfo();
        // 展示伸展快
        showStretchBlock();

        var curW = _context['bodyLeft'].getEleW('border-box');
        var endW = originWForBodyLeft;
        var curML = _context['bodyRight'].getCoordVal('marginLeft');
        var endML = originWForBodyLeft;

        _context['bodyLeft'].animate({
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
                _context['r_header'].removeClass('hide');
            }
        });

        _context['bodyRight'].animate({
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

    _context['stretchBlock'].loginEvent('click' , function(){
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
    var focusStatusSrc   = _context['statusForRoomUserControl'].data('focus');
    var unfocusStatusSrc = _context['statusForRoomUserControl'].data('unfocus');

    // 伸展 things
    var spreadThings = function(){
        var curML = _context['things'].getCoordVal('marginLeft');
        var endML = originThingsMarginLeft - originWForRoomUser;

        _context['things'].animate({
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
        var curML = _context['things'].getCoordVal('marginLeft');
        var endML = originThingsMarginLeft;

        _context['things'].animate({
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

        _context['roomUserControl'].data('status' , 'show');
        _context['roomUser'].css({
            width: '0px'
        });
        _context['roomUser'].removeClass('hide');
        _context['statusForRoomUserControl'].setAttr('src' , focusStatusSrc);

        // 收缩相关信息
        stretchThings();

        var curW = _context['roomUser'].getEleW('border-box');
        var endW = originWForRoomUser;

        _context['roomUser'].animate({
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

        _context['roomUserControl'].data('status' , 'hide');
        _context['roomUserControl'].addClass('spread');
        _context['statusForRoomUserControl'].setAttr('src' , unfocusStatusSrc);

        // 扩展相关信息
        spreadThings();

        var curW = _context['roomUser'].getEleW('border-box');
        var endW = 0;

        _context['roomUser'].animate({
            carTime: topContext['time'] ,
            json: [
                {
                    attr: 'width' ,
                    sVal: curW ,
                    eVal: endW
                }
            ] ,
            fn: function(){
                _context['roomUser'].addClass('hide');
            }
        });
    };

    _context['roomUserControl'].loginEvent('click' , function(){
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
    var topNavH = _context['topNav'].getEleH('border-box');
    // 最小高度
    var minH    = 400;

    // 设置 body-left
    var setBodyLeftH = function(){
        var clientH = document.documentElement.clientHeight;
        var setH    = clientH < minH ? minH : clientH;

        _context['bodyLeft'].css({
            height: setH + 'px'
        });
    };

    // 设置 body-right
    var setBodyRightH = function(){
        var clientH = document.documentElement.clientHeight;
        var setH = clientH - topNavH;
            setH = setH < minH ? minH : setH;

        _context['functions'].css({
            height: setH + 'px'
        });
    };

    // 设置 top-nav 的最小宽度
    var setTopNavW = function(){
        return ;
        var sessionsW       = _context['sessions'].getEleW('border-box');
        var chatWindowW     = _context['chatWindow'].getEleW('border-box');
        var roomUserW       = _context['roomUser'].getEleW('border-box');
        var thingsW  = _context['things'].getEleW('border-box');
        var bodyRightW      = sessionsW + chatWindowW + roomUserW + thingsW;

        _context['topNav'].css({
            minWidth: bodyRightW + 'px'
        });

        _context['bodyRight'].css({
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