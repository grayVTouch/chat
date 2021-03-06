/**
 * *****************************
 * author 陈学龙 2018-05-15
 * 变量环境
 * *****************************
 */

// 采用下划线命名仅是为了避免名称冲突

/**
 * **************************
 * socket 连接初始化相关参数
 * **************************
 */
var _wsLink = 'ws://192.168.150.138:8282';

/**
 * ******************
 * dom 环境变量
 * ******************
 */
var _context = {};

// 容器元素
_context['bodyLeft'] = G('.body-left').first();
_context['bodyRight'] = G('.body-right').first();
_context['topNav'] = G('.top-nav' , _context['bodyRight'].get()).first();
_context['functions'] = G('.functions' , _context['bodyRight'].get()).first();

// 顶部导航栏
_context['advoise'] = G('.advoise' , _context['topNav'].get()).first();
_context['order'] = G('.order' , _context['topNav'].get()).first();
_context['user'] = G('.user' , _context['topNav'].get()).first();
_context['operation'] = G('.operation' , _context['user'].get()).first();
_context['loginOut'] = G('.login-out' , _context['operation'].get()).first();

// 左侧收缩快
_context['stretchBlock'] = G('.stretch-block' , _context['bodyLeft'].get()).first();
_context['horizontal'] = G('.horizontal' , _context['stretchBlock'].get()).first();
_context['vertical'] = G('.vertical' , _context['stretchBlock'].get()).first();

// 聊天室成员伸缩功能
_context['roomUserControl']   = G('.room-user-control' , _context['topNav'].get()).first();
_context['statusForRoomUserControl'] = G('.status' , _context['roomUserControl'].get()).first();

// user-info
_context['userInfo'] = G('.user-info' , _context['bodyLeft'].get()).first();

// 聊天室
_context['rooms']    = G('.rooms' , _context['bodyLeft'].get()).first();
_context['r_header']    = G('.header' , _context['rooms'].get()).first();
_context['r_text']   = G('q:.search .input .text' , _context['r_header'].get());
_context['r_items'] = G('.items' , _context['rooms'].get()).first();

// 会话
_context['sessions']    = G('.sessions' , _context['functions'].get()).first();
_context['s_text']   = G('q:.header .search .input .text' , _context['sessions'].get());
_context['s_items'] = G('.items' , _context['sessions'].get()).first();

// 会话窗口
_context['chatWindow'] = G('.chat-window' , _context['functions'].get()).first();
_context['w_default'] = G('.default' , _context['chatWindow'].get()).first();
_context['w_windows'] = G('.windows' , _context['chatWindow'].get()).first();
_context['w_chat'] = G('.chat' , _context['chatWindow'].get()).first();
_context['w_pannel'] = G('.pannel' , _context['w_chat'].get()).first();
_context['w_input'] = G('.input' , _context['w_chat'].get()).first();
_context['w_btns'] = G('.btns' , _context['w_chat'].get()).first();
_context['w_text'] = G('.text' , _context['w_input'].get()).first();
_context['w_send'] = G('.send' , _context['w_btns'].get()).first();

// 用户
_context['roomUser'] = G('.room-user' , _context['functions'].get()).first();
_context['u_header'] = G('.header' , _context['roomUser'].get()).first();
_context['u_text']   = G('.text' , _context['u_header'].get()).first();
_context['u_userGroup'] = G('.user-group' , _context['roomUser'].get()).first();
_context['u_default'] = G('.default' , _context['roomUser'].get()).first();
_context['u_userSessions'] = G('.search-users' , _context['roomUser'].get()).first();

// 聊天室相关事务
_context['things'] = G('.things' , _context['functions'].get()).first();
_context['t_default'] = G('.default' , _context['things'].get()).first();
_context['t_list'] = G('.list' , _context['things'].get()).first();
_context['t_roomForThings'] = G('.room-for-things' , _context['t_list'].get()).first();

// 聊天面板
_context['w_pannel']    = G('.pannel' , _context['w_chat'].get()).first();
_context['w_face']      = G('.face' , _context['w_pannel'].get()).first();
_context['w_icoForFace']    = G('.ico' , _context['w_face'].get()).first();
_context['w_listForFace']   = G('.list' , _context['w_face'].get()).first();

_context['w_picture']   = G('.picture' , _context['w_pannel'].get()).first();
_context['w_selectImages']   = G('.select-images' , _context['w_picture'].get()).first();

_context['w_file']      = G('.file' , _context['w_pannel'].get()).first();
_context['w_selectFiles']   = G('.select-files' , _context['w_file'].get()).first();

// 右键弹层
_context['rightKeyFloor'] = G('.right-key-floor').first();
_context['tipOption'] = G('.tip-option' , _context['rightKeyFloor'].get()).first();

// 申请争议
_context['orderDisputeFloor'] = G('.order-dispute-floor').first();
// 保存争议订单 html
_context['orderDisputeFloorHTML'] = _context['orderDisputeFloor'].html(null , 'outer');

_context['orderDisputeFloor'].get().parentNode.removeChild(_context['orderDisputeFloor'].get());

// console.log(_context);


/**
 * **************
 * 媒体类型变量
 * ***************
 */

// 图标前缀
var _icoPrefix = topContext['dataUrl'] + 'ico/';
// 铃声源
var _ringtonSrc = topContext['dataUrl'] + 'music/tip.mp3';
// 加载图片
var _loadingImageForGif = topContext['dataUrl'] + 'ico/loading.gif';
// 错误图片
var _errorImageForIco = topContext['dataUrl'] + 'ico/error.png';
// 发送状态图片
var _sendingImageForIco = topContext['dataUrl'] + 'ico/send.png';
// 文件图标
var _downloadImageForIco = topContext['dataUrl'] + 'ico/download.png';

/**
 * ***************
 * 富文本编辑器变量
 * ***************
 */
var _editor = new Editor();

/**
 * ********************
 * 网络请求相关
 * ********************
 */
// 相关 api 链接
var _links = {
    // 创建聊天室
    createRoom: topContext['apiUrl'] + 'Room/createRoom' ,
    // 查看聊天室记录
    history: topContext['apiUrl'] + 'Room/history' ,
    // 上传图片
    uploadImages: topContext['apiUrl'] + 'File/uploadImages' ,
    // 上传文件
    uploadFiles: topContext['apiUrl'] + 'File/uploadFiles' ,
    // 获取订单信息
    getOrder: topContext['apiUrl'] + 'Order/getOrder' ,
    // 为争议订单创建房间
    createRoomForDisputeOrder: topContext['apiUrl'] + 'Room/createRoomForDisputeOrder' ,
};