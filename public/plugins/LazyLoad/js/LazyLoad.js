/**
 * author 陈学龙（grayVTouch）2017/7/21
 *
 * 图片懒加载
 *
 * 懒加载会创建新的图片节点插入原有节点位置
 * 使用时，需给要进行懒加载的图片设置 data-src 属性
 *
 */
var LazyLoad = (function(){
    'use strict';

    function lazyLoad(con , opt){
        var thisRange = [window , null , undefined];

        if (G.contain(this , thisRange) || (!G.contain(this , thisRange) && this.constructor !== lazyLoad)) {
            return new lazyLoad(con , opt);
        }

        this._defaultOpt = {
            // 单张图片加载完毕回调
            loaded: null ,
            // 所有图片加载完毕后回调
            callback: null
        };

        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

        this._con       = G(con);
        this._loaded    = G.getValType(opt['loaded']) === 'Function' ? opt['loaded'] : this._defaultOpt['loaded'];
        this._callback  = G.getValType(opt['callback']) === 'Function' ? opt['callback'] : this._defaultOpt['callback'];

        this._run();
    }

    lazyLoad.prototype = {
        constructor: lazyLoad ,

        _initStaticHTML: function(){

        } ,

        _initStaticArgs: function(){
            // 所有图片的一个集合
            this._images = [];

            this._picSet = G('.lazyload-image' , this._con.get());

            var i = 0;
            var cur = null;

            for (i = 0; i < this._picSet.length; ++i)
            {
                cur = G(this._picSet.get()[i]);

                this._images.push(cur.get());
            }
        } ,

        _initStatic: function(){

        } ,

        _initDynamicHTML: function(){

        } ,

        _initDynamicArgs: function(){
            // 已加载图片数量
            this._loadedImages = [];
        } ,

        _initDynamic: function(){

        } ,

        load: function(pic){
            var pic = G(pic);

            pic.get().src = pic.data('src');

            if (G.getValType(this._loaded) === 'Function') {
                this._loaded(pic.get());
            }

            this._loadedImages.push(pic.get());

            // console.log(this._loadedImages.length , this._picSet.length);

            // 所有图片加载完毕后回调函数
            if (this._loadedImages.length == this._picSet.length && G.getValType(this._callback) === 'Function') {
                this._callback(this._loadedImages);
            }
        } ,

        // 懒加载
        lazyLoad: function(){
            var i   = 0
            var cur = null;
            var curT = null;
            var endT = null;

            // 图片懒加载
            for (i = 0; i < this._images.length; ++i)
            {
                cur = G(this._images[i]);

                curT = cur.getDocOffsetVal('top');
                endT = curT + cur.getEleH('border-box');

                if (G.inVisible(curT) || G.inVisible(endT)) {
                    this.load(cur.get());

                    this._images.splice(i , 1);
                    i--;
                }
            }
        } ,

        _defineEvent: function(){
            var win = G(window);
            var self = this;

            win.loginEvent('scroll' , this.lazyLoad.bind(this) , true , false);

            if (document.readyState === 'complete') {
                this.lazyLoad();
            } else {
                win.loginEvent('load' , this.lazyLoad.bind(this) , true , false);
            }
        } ,

        _run: function(){
            this._initStaticHTML();
            this._initStaticArgs();
            this._initStatic();
            this._initDynamicHTML();
            this._initDynamicArgs();
            this._initDynamic();

            this._defineEvent();
        }
    };

    return lazyLoad;


})();