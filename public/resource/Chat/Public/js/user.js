/**
 * ***************************
 * 用户登录之后存在的用户信息
 * ***************************
 */
/**
 * *****************
 * 用户信息
 * *****************
 */
topContext['_user'] = G.getCookie('_user');
topContext['_admin'] = G.getCookie('_admin');
topContext['_type'] = G.getCookie('_type');
topContext['_id'] = G.getCookie('_id');
topContext['e_userType'] = G.getCookie(topContext['_type']);
topContext['e_userId'] = G.getCookie(topContext['_id']);
topContext['userType'] = G.getCookie('_user_type');
topContext['userId'] = G.getCookie('_user_id');
topContext['username']  = G('n.username').first().getAttr('content');
topContext['thumb']     = G('n.thumb').first().getAttr('content');