/**
 * ***************
 * 全局变量
 * ***************
 */

var topContext = {};

topContext['body']      = G(document.body);
topContext['url']       = topContext['body'].data('url');
topContext['domain']    = topContext['body'].data('domain');
topContext['module']    = topContext['body'].data('module');
topContext['controller'] = topContext['body'].data('controller');
topContext['action'] = topContext['body'].data('action');

/**
 * ************
 * 相关网络路径
 * ************
 */
topContext['pluginUrl'] = topContext['url'] + 'plugins/';
topContext['dataUrl']   = topContext['url'] + 'data/';

/**
 * ************
 * 网络相关
 * ************
 */
topContext['prefix'] = topContext['url'] + topContext['controller'] + '/';

/**
 * **********
 * 加载函数
 * **********
 */
topContext['loading'] = new Loading(topContext['body'].get() , {
    carTime: 200 ,
    // Loading.png 图片存放路径
    pluginUrl: topContext['pluginUrl'] + 'Loading/' ,
    className: 'Loading' ,
    initStatus: 'hide' , // 支持 'show' , 'hide'
    type: 'html' , // 类型：image（直接一张图片方式） 、 html（元素方式）
    style: 1 , // 具体风格
});

/**
 * ************
 * csrf token
 * ************
 */
topContext['token'] = G('n.csrf_token').first().getAttr('content');