

<?php $__env->startSection('metaAddPart'); ?>
    <meta name="csrf_token" content="<?php echo e(csrf_token()); ?>" />
    <meta name="user_type" content="<?php echo e($user->user_type); ?>" />
    <meta name="user_id" content="<?php echo e($user->user_id); ?>" />
    <meta name="username" content="<?php echo e($user->username); ?>" />
    <meta name="thumb" content="<?php echo e($user->thumb); ?>" />
    <meta name="type" content="<?php echo e($room_type); ?>" />
    <meta name="order_id" content="<?php echo e($order_id); ?>" />
<?php $__env->stopSection(); ?>

<?php $__env->startSection('linkAddPart'); ?>
    <link rel="stylesheet" href="<?php echo e($plugin_url); ?>Loading/css/Loading.css?version=<?php echo e(app_config('app.version')); ?>">
    <link rel="stylesheet" href="<?php echo e($plugin_url); ?>CSS/Component/input.css?version=<?php echo e(app_config('app.version')); ?>">
    <link rel="stylesheet" href="<?php echo e($plugin_url); ?>CSS/Component/columnTable.css?version=<?php echo e(app_config('app.version')); ?>">
    <link rel="stylesheet" href="<?php echo e($plugin_url); ?>MenuSwitch/css/MenuSwitch.css?version=<?php echo e(app_config('app.version')); ?>">
    <link rel="stylesheet" href="<?php echo e($public_view_url); ?>css/public.css?version=<?php echo e(app_config('app.version')); ?>">

    <?php echo $__env->yieldContent('userFormLinkAddPart'); ?>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('scriptAddPart'); ?>
    <?php echo $__env->yieldContent('userFormScriptAddPart'); ?>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('title' , app_config('app.system')); ?>

<?php $__env->startSection('content'); ?>
    <!-- 我的聊天室 -->
    <div class="body-left">

        <div class="logo">
            <div class="ico"><a href="/"><img src="<?php echo e($data_url); ?>ico/logo.png" class="image" /></a></div>
            <div class="text"><?php echo e(app_config('app.system')); ?></div>
        </div>

        <!-- 聊天 -->
        <div class="rooms">
            <div class="header">
                <div class="title reload">我的聊天室</div>
                <div class="search">

                    <div class="input">
                        <img src="<?php echo e($data_url); ?>ico/search.png" class="image" />
                        <input type="text" class="text" placeholder="搜索" />
                    </div>

                </div>
            </div>

            <div class="items">
                <!-- 我的聊天室 -->
                <div class="item-list room-items">

                    <div class="item">
                        <div class="ico"><img src="<?php echo e($data_url); ?>ico/advoise.png" class="image" /></div>
                        <div class="content">
                            <div class="name">平台咨询-grayVTouch</div>
                            <div class="status"><img src="<?php echo e($data_url); ?>ico/quiet.png" class="image" /></div>
                        </div>
                    </div>

                    <div class="item">
                        <div class="ico"><img src="<?php echo e($data_url); ?>ico/order.png" class="image" /></div>
                        <div class="content">
                            <div class="name">订单咨询-订单名称</div>
                            <div class="status"><img src="<?php echo e($data_url); ?>ico/quiet.png" class="image" /></div>
                        </div>
                    </div>

                    <!-- 无数据 -->
                    <div class="empty"><img src="<?php echo e($data_url); ?>ico/empty.png" class="image" />尚无数据</div>
                </div>

                <!-- 搜索到的聊天室 -->
                <div class="item-list search-rooms hide">
                    <div class="item">
                        <div class="ico"><img src="<?php echo e($data_url); ?>ico/advoise.png" class="image" /></div>
                        <div class="content">
                            <div class="name">平台咨询-grayVTouch</div>
                            <div class="status"><img src="<?php echo e($data_url); ?>ico/quiet.png" class="image" /></div>
                        </div>
                    </div>

                    <div class="item">
                        <div class="ico"><img src="<?php echo e($data_url); ?>ico/order.png" class="image" /></div>
                        <div class="content">
                            <div class="name">订单咨询-订单名称</div>
                            <div class="status"><img src="<?php echo e($data_url); ?>ico/quiet.png" class="image" /></div>
                        </div>
                    </div>

                    <!-- 无数据 -->
                    <div class="empty"><img src="<?php echo e($data_url); ?>ico/empty.png" class="image" />尚无数据</div>
                </div>

            </div>
        </div>

    </div>

    <div class="body-right">
        <!-- 顶部导航栏 -->
        <div class="top-nav">
            <div class="left-functions">
                <div class="function stretch-control stretch"><img src="<?php echo e($data_url); ?>ico/stretch.png" class="image" /></div>
            </div>
            <div class="right-functions">

                <?php if($user->user_type === 'user'): ?>
                <!-- 发起平台咨询 -->
                <div class="function advoise"><img src="<?php echo e($data_url); ?>ico/user_advoise.png" class="image" />平台咨询</div>
                <?php endif; ?>

                <!-- 发起订单咨询 -->
                <div class="function order"><img src="<?php echo e($data_url); ?>ico/user_order.png" class="image" />订单咨询</div>

                <!-- 用户信息 -->
                <div class="function user">
                    <div class="info"><img src="<?php echo e($data_url); ?>ico/thumb.png" class="image" /><?php echo e(isset($user->username) ? $user->username : '尚未设置用户名'); ?></div>
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
                    <div class="title reload">我的会话</div>
                    <div class="search">

                        <div class="input">
                            <img src="<?php echo e($data_url); ?>ico/search.png" class="image" />
                            <input type="text" class="text" placeholder="搜索" />
                        </div>

                    </div>
                </div>

                <div class="items">
                    <div class="item-list session-items">
                        <div class="item">
                            <div class="ico">
                                <div class="thumb"><img src="<?php echo e($data_url); ?>ico/advoise.png" class="image" /></div>
                            </div>
                            <div class="content">
                                <div class="info">
                                    <div class="name">平台咨询-grayVTouch</div>
                                    <div class="msg">grayVTouch：你好，客服，我有事情找你聊天.....</div>
                                </div>

                                <div class="flag">
                                    <div class="time">18/4/6</div>
                                    <div class="status"><img src="<?php echo e($data_url); ?>ico/quiet.png" class="image" /></div>
                                </div>
                            </div>
                        </div>

                        <div class="item">
                            <div class="ico">
                                <div class="thumb new-msg-tip"><img src="<?php echo e($data_url); ?>ico/order.png" class="image" /></div>
                            </div>
                            <div class="content">
                                <div class="info">
                                    <div class="name">订单咨询-订单名称</div>
                                    <div class="msg">grayVTouch：你好，客服，我有事情找你聊天.....</div>
                                </div>

                                <div class="flag">
                                    <div class="time">18/4/6</div>
                                    <div class="status"><img src="<?php echo e($data_url); ?>ico/quiet.png" class="image" /></div>
                                </div>
                            </div>
                        </div>

                        <!-- 无数据 -->
                        <div class="empty"><img src="<?php echo e($data_url); ?>ico/empty.png" class="image" />尚无数据</div>
                    </div>

                    <div class="item-list search-sessions hide">
                        <div class="item">
                            <div class="ico">
                                <div class="thumb"><img src="<?php echo e($data_url); ?>ico/advoise.png" class="image" /></div>
                            </div>
                            <div class="content">
                                <div class="info">
                                    <div class="name">平台咨询-grayVTouch</div>
                                    <div class="msg">
                                        <div class="status"><img src="<?php echo e($data_url); ?>ico/send.png" class="image image-for-status" /></div>
                                        <div class="text">grayVTouch：你好，客服，我有事情找你聊天.....</div>
                                    </div>
                                </div>

                                <div class="flag">
                                    <div class="time">18/4/6</div>
                                    <div class="status"><img src="<?php echo e($data_url); ?>ico/quiet.png" class="image" /></div>
                                </div>
                            </div>
                        </div>

                        <div class="item">
                            <div class="ico">
                                <div class="thumb new-msg-tip"><img src="<?php echo e($data_url); ?>ico/order.png" class="image" /></div>
                            </div>
                            <div class="content">
                                <div class="info">
                                    <div class="name">订单咨询-订单名称</div>
                                    <div class="msg">grayVTouch：你好，客服，我有事情找你聊天.....</div>
                                </div>

                                <div class="flag">
                                    <div class="time">18/4/6</div>
                                    <div class="status"><img src="<?php echo e($data_url); ?>ico/quiet.png" class="image" /></div>
                                </div>
                            </div>
                        </div>

                        <!-- 无数据 -->
                        <div class="empty"><img src="<?php echo e($data_url); ?>ico/empty.png" class="image" />尚无数据</div>
                    </div>

                </div>
            </div>

            <!-- 聊天窗口 -->
            <div class="chat-window">
                <!-- 默认会话窗口 -->
                <div class="default">
                    <div class='center'><img src="<?php echo e($data_url); ?>ico/logo.png" class="image" />请选择会话</div>
                </div>

                <!-- 会话窗口 -->
                <div class="windows">

                    <div class="window hide">
                        <div class="header">
                            <div class="subject">订单咨询-订单名称</div>
                            <div class="other">
                                <button class="btn-8 add-dispute">发起争议</button>
                            </div>
                        </div>

                        <!-- 历史记录列表 -->
                        <div class="history">

                            <div class="list">
                                <div class="view-more"><button class="view-more-btn">查看更多</button></div>

                                <div class="line other-user">
                                    <div class="thumb"><img src="<?php echo e($data_url); ?>ico/thumb.png" class="image" /></div>
                                    <div class="info">
                                        <div class="user">
                                            <span class="name">grayVTouch</span>
                                            <span class="time">2018-04-19 14:00:00</span>
                                        </div>

                                        <div class="msg"><span class="text">你好、兄弟！！</span></div>
                                    </div>
                                </div>

                                <div class="line myself">
                                    <div class="thumb"><img src="<?php echo e($data_url); ?>ico/thumb.png" class="image" /></div>
                                    <div class="info">
                                        <div class="user">
                                            <span class="time">2018-04-19 14:00:00</span>
                                            <span class="name">admin</span>
                                        </div>

                                        <div class="msg">
                                            <div class="text"><img src="<?php echo e($data_url); ?>ico/loading.gif" class="image image-for-status" />你好我很好附近的积分乐山大佛就是端口福克斯浪费就开始对方就卡了双方均可拉萨加咖啡连锁店</div>
                                        </div>

                                        <div class="tip hide">
                                            <span class="tip-text">发送失败：错误信息</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="line myself">
                                    <div class="thumb"><img src="<?php echo e($data_url); ?>ico/thumb.png" class="image" /></div>
                                    <div class="info">
                                        <div class="user">
                                            <span class="time">2018-04-19 14:00:00</span>
                                            <span class="name">admin</span>
                                        </div>

                                        <div class="msg">
                                            <div class="text">
                                                <img src="<?php echo e($data_url); ?>ico/error.png" class="image image-for-status" />你好我很好附近的积分乐山大佛就是端口福克斯浪费就开始对方就卡了双方均可拉萨加咖啡连锁店
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 图片 -->
                                <div class="line myself">
                                    <div class="thumb"><img src="<?php echo e($data_url); ?>ico/thumb.png" class="image" /></div>
                                    <div class="info">
                                        <div class="user">
                                            <span class="time">2018-04-19 14:00:00</span>
                                            <span class="name">admin</span>
                                        </div>

                                        <div class="msg">
                                            <div class="text object">

                                                <div class="status">
                                                    <div class="u-loading line-scale">
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                    </div>
                                                    <div class="error hide"><img src="<?php echo e($data_url); ?>ico/error.png" class="image image-for-file-status" /></div>
                                                </div>

                                                <img src="<?php echo e($data_url); ?>images/test.jpg" class="image image-for-history" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 文件 -->
                                <div class="line myself">
                                    <div class="thumb"><img src="<?php echo e($data_url); ?>ico/thumb.png" class="image" /></div>
                                    <div class="info">
                                        <div class="user">
                                            <span class="time">2018-04-19 14:00:00</span>
                                            <span class="name">admin</span>
                                        </div>

                                        <div class="msg">
                                            <div class="text object">

                                                <div class="status">
                                                    <div class="u-loading line-scale hide">
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                    </div>

                                                    <div class="error"><img src="<?php echo e($data_url); ?>ico/error.png" class="image image-for-file-status" /></div>
                                                </div>

                                                <div class="flag"><img src="<?php echo e($data_url); ?>ico/download.png" class="image image-for-file" /></div>
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
                <div class="chat hide">
                    <!-- 聊天面板 -->
                    <div class="pannel">
                        <!-- 表情 -->
                        <div class="face item">
                            <div class="ico"><img src="<?php echo e($data_url); ?>ico/face.png" class="image" /></div>
                            <div class="list">
                                <div class="c-item hide" title="笑" data-id="language"><img src="<?php echo e($data_url); ?>ico/face.png" class="image" /></div>
                            </div>
                        </div>

                        <!-- 图片 -->
                        <div class="picture item">
                            <div class="ico"><img src="<?php echo e($data_url); ?>ico/image.png" class="image" /></div>
                            <div class="images hide"><input type="file" multiple="multiple" class="select-images" /></div>
                        </div>

                        <!-- 文件 -->
                        <div class="file item">
                            <div class="ico"><img src="<?php echo e($data_url); ?>ico/file.png" class="image" /></div>
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
            <div class="room-user">
                <div class="room-user-in">
                    <div class="header">
                        <div class="title reload">聊天室成员</div>
                        <div class="search">

                            <div class="input">
                                <img src="<?php echo e($data_url); ?>ico/search.png" class="image" />
                                <input type="text" class="text" placeholder="搜索" />
                            </div>

                        </div>
                    </div>

                    <div class="items">
                        <div class="item-list user-items">
                            <!-- 默认展示界面 -->
                            <div class="default">
                                <div class="center"><img src="<?php echo e($data_url); ?>ico/logo.png" class="image">请选择聊天室或会话</div>
                            </div>

                            <!-- 聊天室用户 -->
                            <div class="user hide">
                                <div class="title">群成员 <span class="online">10</span> / <span class="count">50</span></div>
                                <div class="list">
                                    <div class="item">
                                        <div class="info">
                                            <div class="thumb"><img src="<?php echo e($data_url); ?>ico/thumb.png" class="image" /></div>
                                            <div class="name">grayVTouch</div>
                                        </div>
                                        <div class="status on">在线</div>
                                    </div>

                                    <div class="item">
                                        <div class="info">
                                            <div class="thumb"><img src="<?php echo e($data_url); ?>ico/thumb.png" class="image" /></div>
                                            <div class="name">yueshu</div>
                                        </div>
                                        <div class="status off">离线</div>
                                    </div>

                                    <!-- 无数据 -->
                                    <div class="empty"><img src="<?php echo e($data_url); ?>ico/empty.png" class="image" />尚无数据</div>
                                </div>
                            </div>

                        </div>

                        <div class="item-list search-users hide">
                            <div class="item">
                                <div class="info">
                                    <div class="thumb"><img src="<?php echo e($data_url); ?>ico/thumb.png" class="image" /></div>
                                    <div class="name">grayVTouch</div>
                                </div>
                                <div class="status on">在线</div>
                            </div>

                            <div class="item">
                                <div class="info">
                                    <div class="thumb"><img src="<?php echo e($data_url); ?>ico/thumb.png" class="image" /></div>
                                    <div class="name">yueshu</div>
                                </div>
                                <div class="status off">离线</div>
                            </div>

                            <!-- 无数据 -->
                            <div class="empty"><img src="<?php echo e($data_url); ?>ico/empty.png" class="image" />尚无数据</div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- 相关物品（如果是订单咨询的话） -->
            <div class="related-things">
                <!-- 默认会话窗口 -->
                <div class="default">
                    <div class='center'><img src="<?php echo e($data_url); ?>ico/logo.png" class="image" />请选择会话</div>
                </div>

                <!-- 平台咨询 -->
                <div class="info info-for-room hide">
                    <div class="component-title">
                        <div class="subject">
                            <div class="room-user-control"><img src="<?php echo e($data_url); ?>ico/stretch.png" class="image" /></div>
                            <div class="text">聊天室信息</div>
                        </div>
                        <div class="more"></div>
                    </div>

                    <div class="content">

                        <div class="item">
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

                <!-- 订单咨询 -->
                <div class="info info-for-order hide">
                    <div class="component-title">
                        <div class="subject">正在咨询</div>
                        <div class="more"></div>
                    </div>

                    <div class="content">

                        <div class="item hide">
                            <table class="column-tb">
                                <tbody>
                                <tr>
                                    <td>订单名称：</td>
                                    <td>数据测试...</td>
                                </tr>

                                <tr>
                                    <td>发单人：</td>
                                    <td>grayVTouch</td>
                                </tr>

                                <tr>
                                    <td>订单类型：</td>
                                    <td>非关联订单</td>
                                </tr>

                                <tr>
                                    <td>接单人：</td>
                                    <td>尚未接单</td>
                                </tr>

                                <tr>
                                    <td>操作：</td>
                                    <td>
                                        <button class="btn-8">发送订单</button>
                                        <button class="btn-8">查看订单</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
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
                <td class="myself-accept">...</td>
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
<?php $__env->stopSection(); ?>

<?php $__env->startSection('btmScriptAddPart'); ?>
    <script src="<?php echo e($plugin_url); ?>Loading/js/Loading.js"></script>
    <script src="<?php echo e($public_view_url); ?>js/currency.js"></script>
    <script src="<?php echo e($public_view_url); ?>js/http.js"></script>
    <script src="<?php echo e($public_view_url); ?>js/Socket.js"></script>
    <script src="<?php echo e($public_view_url); ?>js/globalVars.js"></script>
    <script src="<?php echo e($public_view_url); ?>js/user.js"></script>
    <script src="<?php echo e($public_view_url); ?>js/System.js"></script>
    <script src="<?php echo e($public_view_url); ?>js/public.js"></script>

    <?php echo $__env->yieldContent('userFormBtmScriptAddPart'); ?>
<?php $__env->stopSection(); ?>
<?php echo $__env->make(WEB_VIEW_PREFIX . 'base', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>