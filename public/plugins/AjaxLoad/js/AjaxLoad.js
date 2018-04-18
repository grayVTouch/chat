/**
 * author grayVTouch 2017-12-11
 * Ajax 异步加载数据（不做分页处理）
 */
var AjaxLoad = (function(){
    function AjaxLoad(opt){
        var thisRange = [undefined , null , window];

        if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== AjaxLoad) {
            return new AjaxLoad(opt);
        }

        // 默认配置文件
        this._defaultOpt = {
            // 请求的链接: http://www.test.com/index.php?cur_page= 诸如这种格式
            url: '' ,
            // 默认请求页数
            curPage: 1 ,
            // 请求失败的时候
            error: null ,
            // 请求成功时
            success: null ,
            // 发起请求之前
            before: null ,
            // 是否初始化获取数据: true / false，默认不获取
            status: false ,
        };

        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

        this._url       = G.getValType(opt['url']) !== 'String'         ? this._defaultOpt['url']       : opt['url'];
        this._curPage   = G.getValType(opt['curPage']) !== 'Number'     ? this._defaultOpt['curPage']   : opt['curPage'];
        this._error     = G.getValType(opt['error']) !== 'Function'     ? this._defaultOpt['error']     : opt['error'];
        this._success   = G.getValType(opt['success']) !== 'Function'   ? this._defaultOpt['success']   : opt['success'];
        this._before    = G.getValType(opt['before']) !== 'Function'    ? this._defaultOpt['before']    : opt['before'];
        this._status    = G.getValType(opt['status']) !== 'Boolean'    ? this._defaultOpt['status']    : opt['status'];

        this._run();

    }

    AjaxLoad.prototype = {
        constructor: AjaxLoad ,

        _initStaticArgs: function(){
            this.action = null;
        } ,

        _initStatic: function(){

        } ,

        _initDynamicArgs: function(){

        } ,

        _initDynamic: function(){

        } ,

        // 获取当前页数
        page: function(page){
            if (G.getValType(page) === 'Undefined') {
                return this._curPage;
            }

            // 设置页数
            this._curPage = G.getValType(page) === 'Number' ? page : this._curPage;
        } ,

        // 获取数据
        _get: function(){
            var url = this._url + this._curPage;

            if (G.getValType(this._before) === 'Function') {
                this._before();
            }

            G.ajax({
                url: url ,
                method: 'get' ,
                success: this._success ,
                error: this._error
            });
        } ,

        // 获取当前页的数据
        cur: function(){
            this.action = 'cur';

            this._get();
        } ,

        // 获取下一个
        next: function(){
            this.action = 'next';

            this._curPage++;

            this._get();
        } ,

        // 获取上一页
        prev: function(){
            this.action = 'prev';

            this._curPage--;

            this._get();
        } ,

        _run: function() {
            this._initStaticArgs();
            this._initStatic();
            this._initDynamicArgs();
            this._initDynamic();

            // 如果设置了初始化时获取数据，则类实例化时便获取数据
            if (this._status) {
                this.cur();
            }
        }
    };

    return AjaxLoad;
})();