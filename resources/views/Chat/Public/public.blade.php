@extends(WEB_VIEW_PREFIX . 'base')

@section('metaAddPart')
    <meta name="csrf_token" content="{{ csrf_token() }}" />
    <meta name="username" content="{{ $user->username ?? '' }}" />
    <meta name="thumb" content="{{ $user->thumb ?? '' }}" />
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
                <div class="items my-rooms"></div>
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
                <div class="function advoise hide"><img src="{{ $data_url }}ico/user_advoise.png" class="image" />平台咨询</div>
                @endif

                <!-- 发起订单咨询 -->
                <div class="function order hide"><img src="{{ $data_url }}ico/order_advoise.png" class="image" />订单咨询</div>

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

                    <div class="item-list session-items"></div>

                </div>
            </div>

            <!-- 聊天窗口 -->
            <div class="chat-window">
                <!-- 默认会话窗口 -->
                <div class="default">
                    <div class='in'><img src="{{ $data_url }}ico/logo.png" class="image" />请选择会话</div>
                </div>

                <!-- 会话窗口 -->
                <div class="windows"></div>

                <!-- 聊天功能 -->
                <div class="chat hide">
                    <!-- 聊天面板 -->
                    <div class="pannel">
                        <!-- 表情 -->
                        <div class="item face">
                            <div class="ico"><img src="{{ $data_url }}ico/face.png" class="image" /></div>
                            <div class="list hide">
                                <div class="c-item hide" title="笑" data-id="language"><img src="{{ $data_url }}ico/face.png" class="image" /></div>
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
                    <div class="default">
                        <div class="in"><img src="{{ $data_url }}ico/logo.png" class="image">请选择聊天室或会话</div>
                    </div>

                    <!-- 聊天室用户组列表 -->
                    <div class="user-group"></div>

                </div>
            </div>

            <!-- 相关物品（如果是订单咨询的话） -->
            <div class="things">
                <!-- 默认会话窗口 -->
                <div class="default">
                    <div class='in'><img src="{{ $data_url }}ico/logo.png" class="image" />请选择聊天室或会话</div>
                </div>

                <div class="list">
                    <!-- 相关事物 -->
                    <div class="item room-for-things"></div>

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
                    <button class="btn-2 submit-btn">申请客服介入</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
@endsection

@section('btmScriptAddPart')
    <script src="{{ $plugin_url }}Loading/js/Loading.js"></script>
    <script src="{{ $plugin_url }}Editor/js/Editor.js"></script>
    <script src="{{ $plugin_url }}MenuSwitch/js/MenuSwitch.js"></script>

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
    <script src="{{ $public_view_url }}js/CommunicationComponents/input.js"></script>
    <script src="{{ $public_view_url }}js/CommunicationComponents/ajax.js"></script>
    <script src="{{ $public_view_url }}js/CommunicationComponents/misc.js"></script>
    <!-- 实例化 socket：必须放在组件的最末尾！ -->
    <script src="{{ $public_view_url }}js/CommunicationComponents/socket.js"></script>
    <!-- 对 socket 的操作，必须在 socket 被实例化之后 -->
    <script src="{{ $public_view_url }}js/CommunicationComponents/socketOperation.js"></script>

    <!-- 聊天室功能实现 -->
    <script src="{{ $public_view_url }}js/System.js"></script>
    <!-- 聊天室创建库 -->
    <script src="{{ $public_view_url }}js/create.js"></script>
    <!-- 初始化开始 -->
    <script src="{{ $public_view_url }}js/public.js"></script>

    @yield('userFormBtmScriptAddPart')
@endsection