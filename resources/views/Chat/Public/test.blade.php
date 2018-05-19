@extends(WEB_VIEW_PREFIX . 'base')

@section('metaAddPart')
    <meta name="csrf_token" content="{{ csrf_token() }}" />
@endsection

@section('linkAddPart')
    <link rel="stylesheet" href="{{ $plugin_url }}Loading/css/Loading.css?version={{ app_config('app.version') }}">
    <link rel="stylesheet" href="{{ $plugin_url }}CSS/Component/input.css?version={{ app_config('app.version') }}">
    <link rel="stylesheet" href="{{ $plugin_url }}CSS/Component/columnTable.css?version={{ app_config('app.version') }}">
    <link rel="stylesheet" href="{{ $plugin_url }}MenuSwitch/css/MenuSwitch.css?version={{ app_config('app.version') }}">
    <link rel="stylesheet" href="{{ $plugin_url }}Editor/css/Editor.css?version={{ app_config('app.version') }}">
    <link rel="stylesheet" href="{{ $public_view_url }}css/public.css?version={{ app_config('app.version') }}">

    @yield('userFormLinkAddPart')
@endsection

@section('scriptAddPart')
    @yield('userFormScriptAddPart')
@endsection

@section('title' , app_config('app.system'))

@section('content')
    <!-- 我的聊天室 -->
    <div class="body-left">
        <div class="in">
            <div class="logo">
                <div class="ico"><a href="/"><img src="{{ $data_url }}ico/logo.png" class="image" /></a></div>
                <div class="text">{{ app_config('app.system') }}</div>
            </div>

            <!-- 个人信息 -->
            <div class="user-info">
                <div class="thumb">
                    <div class="in">
                        <!-- 头像预览 -->
                        <div class="thumb-preview"><img src="{{ $data_url }}ico/thumb.png" class="image"></div>
                        <!-- 个人信息 -->
                        <div class="fade-in"></div>
                    </div>
                </div>

                <!--- 用户名称 -->
                <div class="explain">{{ $user->username ?? '尚未设置用户名' }}</div>
            </div>

            <!-- 伸缩块 -->
            <div class="stretch-block">
                <!-- 水平 -->
                <div class="horizontal">
                    <div class="in">
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                    </div>
                </div>

                <!-- 垂直 -->
                <div class="vertical hide">
                    <div class="in">
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                    </div>
                </div>
            </div>

            <!-- 聊天 -->
            <div class="rooms">
                <div class="header">
                    <div class="title">我的聊天室</div>
                    <div class="search">

                        <div class="input">
                            <img src="{{ $data_url }}ico/search.png" class="image" />
                            <input type="text" class="text" placeholder="搜索" />
                        </div>

                    </div>
                </div>

                <!-- 我的聊天室 -->
                <div class="items my-rooms">
                    <div class="item">
                        <div class="ico"><img src="{{ $data_url }}ico/advoise.png" class="image" /></div>
                        <div class="content">
                            <div class="name">平台咨询-grayVTouch</div>
                            <div class="status"><img src="{{ $data_url }}ico/quiet.png" class="image" /></div>
                        </div>
                    </div>

                    <div class="item">
                        <div class="ico"><img src="{{ $data_url }}ico/order.png" class="image" /></div>
                        <div class="content">
                            <div class="name">订单咨询-订单名称</div>
                            <div class="status"><img src="{{ $data_url }}ico/quiet.png" class="image" /></div>
                        </div>
                    </div>

                    <!-- 无数据 -->
                    <div class="empty"><img src="{{ $data_url }}ico/empty.png" class="image" />尚无数据</div>

                </div>
            </div>
        </div>

        <!-- 系统信息 -->
        <div class="system-flag">{{ app_config('app.system')  }}</div>
    </div>

    <div class="body-right">
        <!-- 顶部导航栏 -->
        <div class="top-nav">
            <div class="left-functions">

            </div>
            <div class="right-functions">
                <!-- 聊天室成员展示控制按钮 -->
                <div class="function room-user-control"><img src="{{ $data_url }}ico/room_user.png" class="image" />聊天室成员<img src="{{ $data_url }}ico/unfocus.png" data-focus="{{ $data_url }}ico/focus.png" data-unfocus="{{ $data_url }}ico/unfocus.png" class="image status" /></div>

                @if ($user->user_type === 'user')
                <!-- 发起平台咨询 -->
                <div class="function advoise"><img src="{{ $data_url }}ico/user_advoise.png" class="image" />平台咨询</div>
                @endif

                <!-- 发起订单咨询 -->
                <div class="function order"><img src="{{ $data_url }}ico/order_advoise.png" class="image" />订单咨询</div>

                <!-- 用户信息 -->
                <div class="function user">
                    <div class="info"><img src="{{ $data_url }}ico/thumb.png" class="image" />{{ $user->username or '尚未设置用户名' }}</div>
                    <div class="operation hide">
                        <div class="item">占位功能</div>
                        <div class="item">占位功能</div>
                        <div class="item login-out">注销</div>
                    </div>
                </div>

            </div>
        </div>

        <!-- 功能列表 --->
        <div class="functions">
            <!-- 我的会话 -->
            <div class="sessions">
                <div class="header">
                    <div class="title">我的会话</div>
                    <div class="search">

                        <div class="input">
                            <img src="{{ $data_url }}ico/search.png" class="image" />
                            <input type="text" class="text" placeholder="搜索" />
                        </div>

                    </div>
                </div>

                <div class="items">

                    <div class="item-list session-items">
                        <div class="item">
                            <div class="ico">
                                <div class="thumb"><img src="{{ $data_url }}ico/advoise.png" class="image" /></div>
                            </div>
                            <div class="content">
                                <div class="info">
                                    <div class="name">平台咨询-grayVTouch</div>
                                    <div class="msg">
                                        <div class="status hide"><img src="{{ $data_url }}ico/send.png" class="image image-for-status" /></div>
                                        <div class="text">grayVTouch:你好，客户！！</div>
                                    </div>
                                </div>

                                <div class="flag">
                                    <div class="time">18/4/6</div>
                                    <div class="status"><img src="{{ $data_url }}ico/quiet.png" class="image" /></div>
                                </div>
                            </div>
                        </div>

                        <div class="item">
                            <div class="ico">
                                <div class="thumb new-msg-tip"><img src="{{ $data_url }}ico/order.png" class="image" /></div>
                            </div>
                            <div class="content">
                                <div class="info">
                                    <div class="name">订单咨询-订单名称</div>
                                    <div class="msg">
                                        <div class="status"><img src="{{ $data_url }}ico/send.png" class="image image-for-status" /></div>
                                        <div class="text">grayVTouch：你好，客服，我有事情找你聊天.....</div>
                                        </div>
                                </div>

                                <div class="flag">
                                    <div class="time">18/4/6</div>
                                    <div class="status"><img src="{{ $data_url }}ico/quiet.png" class="image" /></div>
                                </div>
                            </div>
                        </div>

                        <div class="item">
                            <div class="ico">
                                <div class="thumb new-msg-tip"><img src="{{ $data_url }}ico/order.png" class="image" /></div>
                            </div>
                            <div class="content">
                                <div class="info">
                                    <div class="name">订单咨询-订单名称</div>
                                    <div class="msg">
                                        <div class="status"><img src="{{ $data_url }}ico/error.png" class="image image-for-status" /></div>
                                        <div class="text">grayVTouch：你好，客服，我有事情找你聊天.....</div>
                                    </div>
                                </div>

                                <div class="flag">
                                    <div class="time">18/4/6</div>
                                    <div class="status"><img src="{{ $data_url }}ico/quiet.png" class="image" /></div>
                                </div>
                            </div>
                        </div>

                        <!-- 无数据 -->
                        <div class="empty"><img src="{{ $data_url }}ico/empty.png" class="image" />尚无数据</div>
                    </div>

                </div>
            </div>

            <!-- 聊天窗口 -->
            <div class="chat-window">
                <!-- 默认会话窗口 -->
                <div class="default hide">
                    <div class='in'><img src="{{ $data_url }}ico/logo.png" class="image" />请选择会话</div>
                </div>

                <!-- 会话窗口 -->
                <div class="windows">

                    <div class="window">
                        <div class="header">
                            <div class="subject">订单咨询-订单名称</div>
                            <div class="other">
                                <button class="btn-8 add-dispute">发起争议</button>
                            </div>
                        </div>

                        <!-- 历史记录列表 -->
                        <div class="history">

                            <div class="list">
                                <div class="view-more">
                                    <img src="{{ $data_url }}ico/loading.gif" class="image" />
                                    <button class="view-more-btn">查看更多</button>
                                </div>

                                <!-- 欢迎提示 -->
                                <div class="user-join-notice">
                                    <div class="in"><img src="{{ $data_url }}ico/welcome.png" class="image">欢迎<span class="username weight">grayVTouch</span>加入聊天室</div>
                                </div>

                                <div class="line chat-text other">
                                    <div class="thumb"><img src="{{ $data_url }}ico/thumb.png" class="image" /></div>
                                    <div class="info">
                                        <div class="user">
                                            <span class="name">grayVTouch</span>
                                            <span class="time">2018-04-19 14:00:00</span>
                                        </div>

                                        <div class="msg">
                                            <div class="object">
                                                <img src="{{ $data_url }}ico/loading.png" class="image image-for-status hide" />你好我很好附近的积分乐山大佛就是端口福克斯浪费就开始对方就卡了双方均可拉萨加咖啡连锁店
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="line chat-text self">
                                    <div class="thumb"><img src="{{ $data_url }}ico/thumb.png" class="image" /></div>
                                    <div class="info">
                                        <div class="user">
                                            <span class="time">2018-04-19 14:00:00</span>
                                            <span class="name">admin</span>
                                        </div>

                                        <div class="msg">
                                            <div class="object"><img src="{{ $data_url }}ico/loading.gif" class="image image-for-status" />你好我很好附近的积分乐山大佛就是端口福克斯浪费就开始对方就卡了双方均可拉萨加咖啡连锁店</div>
                                        </div>

                                        <div class="tip hide">
                                            <span class="tip-text">发送失败：错误信息</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="line chat-text self">
                                    <div class="thumb"><img src="{{ $data_url }}ico/thumb.png" class="image" /></div>
                                    <div class="info">
                                        <div class="user">
                                            <span class="time">2018-04-19 14:00:00</span>
                                            <span class="name">admin</span>
                                        </div>

                                        <div class="msg">
                                            <div class="object">
                                                <img src="{{ $data_url }}ico/error.png" class="image image-for-status" />你好我很好附近的积分乐山大佛就是端口福克斯浪费就开始对方就卡了双方均可拉萨加咖啡连锁店
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 图片 -->
                                <div class="line chat-image self">
                                    <div class="thumb"><img src="{{ $data_url }}ico/thumb.png" class="image" /></div>
                                    <div class="info">
                                        <div class="user">
                                            <span class="time">2018-04-19 14:00:00</span>
                                            <span class="name">admin</span>
                                        </div>

                                        <div class="msg">
                                            <div class="object">

                                                <div class="status">
                                                    <!-- 加载状态 -->
                                                    <div class="loading">
                                                        <div class="u-loading line-scale">
                                                            <div></div>
                                                            <div></div>
                                                            <div></div>
                                                            <div></div>
                                                            <div></div>
                                                        </div>
                                                    </div>

                                                    <!-- 错误状态 -->
                                                    <div class="error hide"><img src="{{ $data_url }}ico/error.png" class="image image-for-file-status" /></div>
                                                </div>

                                                <img src="{{ $data_url }}images/test.jpg" class="image image-for-history" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 文件 -->
                                <div class="line chat-file self">
                                    <div class="thumb"><img src="{{ $data_url }}ico/thumb.png" class="image" /></div>
                                    <div class="info">
                                        <div class="user">
                                            <span class="time">2018-04-19 14:00:00</span>
                                            <span class="name">admin</span>
                                        </div>

                                        <div class="msg">
                                            <div class="object">

                                                <div class="status">
                                                    <div class="loading hide">
                                                        <div class="u-loading line-scale hide">
                                                            <div></div>
                                                            <div></div>
                                                            <div></div>
                                                            <div></div>
                                                            <div></div>
                                                        </div>
                                                    </div>

                                                    <div class="error">
                                                        <div class="background"></div>
                                                        <img src="{{ $data_url }}ico/error.png" class="image image-for-file-status" />
                                                    </div>
                                                </div>

                                                <div class="flag"><img src="{{ $data_url }}ico/download.png" class="image image-for-file" /></div>
                                                <div class="filename">数据测试</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

                <!-- 聊天功能 -->
                <div class="chat">
                    <!-- 聊天面板 -->
                    <div class="pannel">
                        <!-- 表情 -->
                        <div class="item face">
                            <div class="ico"><img src="{{ $data_url }}ico/face.png" class="image" /></div>
                            <div class="list hide">
                                <div class="c-item" title="笑" data-id="language"><img src="{{ $data_url }}ico/face.png" class="image" /></div>
                            </div>
                        </div>

                        <!-- 图片 -->
                        <div class="item picture">
                            <div class="ico"><img src="{{ $data_url }}ico/image.png" class="image" /></div>
                            <div class="images hide"><input type="file" multiple="multiple" class="select-images" /></div>
                        </div>

                        <!-- 文件 -->
                        <div class="item file">
                            <div class="ico"><img src="{{ $data_url }}ico/file.png" class="image" /></div>
                            <div class="file hide"><input type="file" multiple="multiple" class="select-files" /></div>
                        </div>
                    </div>
                    <!-- 输入区域 -->
                    <div class="input" contenteditable="true">请输入...</div>
                    <!-- 提交区域 -->
                    <div class="btns">
                        <button class="btn-8 send">发送</button>
                    </div>
                </div>
            </div>

            <!-- 聊天室成员 -->
            <div class="room-user hide">
                <div class="in">
                    <!-- 默认展示界面 -->
                    <div class="default hide">
                        <div class="in"><img src="{{ $data_url }}ico/logo.png" class="image">请选择聊天室或会话</div>
                    </div>

                    <!-- 聊天室用户组列表 -->
                    <div class="user-group">
                        <div class="group">
                            <div class="header">
                                <div class="title">聊天室成员</div>
                                <div class="search">

                                    <div class="input">
                                        <img src="{{ $data_url }}ico/search.png" class="image" />
                                        <input type="text" class="text" placeholder="搜索" />
                                    </div>

                                </div>
                            </div>

                            <div class="component-title">
                                <div class="subject">群成员 <span class="online">10</span> / <span class="count">50</span></div>
                                <div class="more"></div>
                            </div>

                            <div class="users">
                                <div class="user">
                                    <div class="info">
                                        <div class="thumb"><img src="{{ $data_url }}ico/thumb.png" class="image" /></div>
                                        <div class="name">grayVTouch</div>
                                    </div>
                                    <div class="status on">在线</div>
                                </div>

                                <div class="user">
                                    <div class="info">
                                        <div class="thumb"><img src="{{ $data_url }}ico/thumb.png" class="image" /></div>
                                        <div class="name">yueshu</div>
                                    </div>
                                    <div class="status off">离线</div>
                                </div>

                                <!-- 无数据 -->
                                <div class="empty"><img src="{{ $data_url }}ico/empty.png" class="image" />尚无数据</div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <!-- 相关物品（如果是订单咨询的话） -->
            <div class="things">
                <!-- 默认会话窗口 -->
                <div class="default hide">
                    <div class='in'><img src="{{ $data_url }}ico/logo.png" class="image" />请选择会话</div>
                </div>

                <div class="list">
                    <!-- 相关事物 -->
                    <div class="item room-for-things">
                        <!-- 聊天室项 -->
                        <div class="part">
                            <!-- 导航菜单 -->
                            <div class="nav-container">
                                <div class="menu-switch menu-switch-for-4">
                                    <div class="item cur" data-identifier="advoise">正在咨询</div>
                                    <div class="item" data-identifier="room">聊天室信息</div>
                                </div>
                            </div>

                            <div class="c-items">

                                <!--正在咨询的商品 -->
                                <div class="c-item advoise-things" data-identifier="advoise">

                                    <div class="order">
                                        <div class="left"><img src="{{ $data_url }}images/test.jpg" class="image" /></div>
                                        <div class="right">
                                            <div class="top"><a href="javascript:void(0);">小米(MI)Air 13.3英寸金属超轻薄笔记本电脑(i5-7200U 8G 256G PCleSSD MX150 2G独显 FHD 指纹识别 Win10)银</a></div>
                                            <div class="btm">
                                                <div class="price weight red">￥999.00</div>
                                                <div class="btns">
                                                    <button class="btn-7">发送</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <!-- 聊天室信息 -->
                                <div class="c-item room-info hide" data-identifier="room">
                                    <table class="column-tb">
                                        <tbody>
                                        <tr>
                                            <td>聊天室类型：</td>
                                            <td class="room-type">平台咨询</td>
                                        </tr>

                                        <tr>
                                            <td>聊天室名称：</td>
                                            <td class="room-type">顽喵客服</td>
                                        </tr>

                                        <tr>
                                            <td>咨询方：</td>
                                            <td class="from-for-room">陈学龙</td>
                                        </tr>

                                        <tr>
                                            <td>接收方：</td>
                                            <td class="to-for-room">顽喵客服</td>
                                        </tr>

                                        <tr>
                                            <td>是否关联聊天室：</td>
                                            <td class="is-related-room">是</td>
                                        </tr>

                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>

                    </div>

                    <!-- 可选 item -->
                    <div class="item hide">预留内容！！！！正式部署时请隐藏</div>
                </div>

            </div>

        </div>

    </div>

    <!-- 聊天室 + 会话右键弹层 -->
    <div class="right-key-floor hide">
        <div class="item tip-option">...</div>
        <div class="item">占位功能</div>
        <div class="item">占位功能</div>
    </div>

    <!-- 订单咨询：测试用！ -->
    <div class="order-floor layer-floor hide">
        <table class="input-tb">
            <tbody>
            <tr>
                <td>订单id：</td>
                <td><input type="number" class="form-text order-id" /></td>
            </tr>

            <tr>
                <td>是否已接单：</td>
                <td class="exists-accept-user">...</td>
            </tr>

            <tr>
                <td>是我接单的吗？：</td>
                <td class="self-accept">...</td>
            </tr>

            <tr>
                <td>是否关联订单：</td>
                <td class="is-tag">...</td>
            </tr>

            <tr>
                <td colspan="2">
                    <button class="btn-7 get-order-info">获取订单信息</button>
                    <button class="btn-7 hide order">开始咨询</button>
                    <button class="btn-7 hide order-related">关联订单-进入任务群聊</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>

    <!-- 争议描述 --->
    <div class="order-dispute-floor layer-floor hide">
        <table class="input-tb">
            <tbody>
            <tr class="tr-for-order-id">
                <td>订单ID：</td>
                <td><input type="text" class="form-text order-id" /></td>
            </tr>
            <tr>
                <td>争议标题：</td>
                <td><input type="text" class="form-text title" /></td>
            </tr>
            <tr>
                <td>争议描述：</td>
                <td><textarea class="form-textarea description"></textarea></td>
            </tr>
            <tr>
                <td colspan="2">
                    <button class="btn-2 submit-btn">申请争议解决</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
@endsection

@section('btmScriptAddPart')
    <script src="{{ $plugin_url }}Loading/js/Loading.js"></script>
    <script src="{{ $plugin_url }}Editor/js/Editor.js"></script>
    <script src="{{ $public_view_url }}js/currency.js"></script>
    <script src="{{ $public_view_url }}js/http.js"></script>
    <script src="{{ $public_view_url }}js/Socket.js"></script>
    <script src="{{ $public_view_url }}js/globalVars.js"></script>
    <script src="{{ $public_view_url }}js/user.js"></script>
    <!-- 环境变量：必须优先加载 -->
    <script src="{{ $public_view_url }}js/context.js"></script>

    <!-- 聊天室操作组件 -->
    <script src="{{ $public_view_url }}js/CommunicationComponents/face.js"></script>
    <script src="{{ $public_view_url }}js/CommunicationComponents/dom.js"></script>
    <script src="{{ $public_view_url }}js/CommunicationComponents/render.js"></script>
    <script src="{{ $public_view_url }}js/CommunicationComponents/event.js"></script>
    <script src="{{ $public_view_url }}js/CommunicationComponents/findDom.js"></script>
    <script src="{{ $public_view_url }}js/CommunicationComponents/find.js"></script>
    <script src="{{ $public_view_url }}js/CommunicationComponents/domOperation.js"></script>
    <script src="{{ $public_view_url }}js/CommunicationComponents/Room.js"></script>
    <script src="{{ $public_view_url }}js/CommunicationComponents/misc.js"></script>

    <!-- 聊天室功能实现 -->
    <script src="{{ $public_view_url }}js/System.js"></script>

    <!-- 初始化开始 -->
    <script src="{{ $public_view_url }}js/public.js"></script>

    @yield('userFormBtmScriptAddPart')
@endsection