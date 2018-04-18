/**
 * Created by 陈学龙（grayVTouch） on 2017/7/21.
 */

/**
 * ************************
 * 已选择条件
 * ************************
 */
var SimplePage = (function(){
    'use strict';

    function SimplePage(con , opt){
        var thisRange = [window , null , undefined];

        if (G.contain(this , thisRange) || (!G.contain(this , thisRange) && this.constructor !== SimplePage)) {
            return new SimplePage(con , opt);
        }

        this._defaultOpt = {

        };

        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

        this._con = G(con);

        this._run();
    }

    SimplePage.prototype = {
        constructor: SimplePage ,

        _initStaticHTML: function(){

        }  ,

        _initStaticArgs: function(){
            // 元素
            this._simplePage = G('.simple-page' , this._con.get()).first();
            this._statistics = G('.statistics'  , this._simplePage.get()).first();
            this._count      = G('.count'       , this._statistics.get()).first();
            this._page      = G('.page'         , this._simplePage.get()).first();
            this._curPage   = G('.cur-page'     , this._page.get()).first();
            this._maxPage   = G('.max-page'     , this._page.get()).first();
            this._function  = G('.function'     , this._simplePage.get()).first();
            this._prev      = G('.prev'         , this._function.get()).first();
            this._next      = G('.next'         , this._function.get()).first();

            // 参数
            this.__curPage = parseInt(this._curPage.get().textContent);
            this.__maxPage = parseInt(this._maxPage.get().textContent);

            // 链接
            this._link = this._simplePage.data('link');

            // 类名
            this._classForDisabled = 'disabled';
        }  ,

        _initStatic: function(){
            if (this.__curPage <= 1) {
                this._prev.addClass(this._classForDisabled);
            }

            if (this.__curPage >= this.__maxPage) {
                this._next.addClass(this._classForDisabled);
            }

            /*
            // 后台处理好了
            // 对链接进行处理
            var qsIndex = this._link.indexOf('?');

            if (qsIndex !== -1) {
                this._link = this._link.replace(new RegExp(this._field + "=\\w*(&)?" , i) , '');
                this._link = this._link.replace("?&" , '?');
                this._link += '&';
            } else {
                this._link += '?';
            }

            this._link += this._field + '=';
             */
        } ,

        _initDynamicHTML: function(){

        }  ,

        _initDynamicArgs: function(){

        }  ,

        _initDynamic: function(){

        } ,

        link: function(link){
            window.location.href = link;
        } ,

        prev: function(){
            this.__curPage = this.__curPage - 1;

            if (this.__curPage < 1) {
                return this.__curPage = 1;
            }

            var link = this._link + this.__curPage;

            this.link(link);
        } ,

        next: function(){
            this.__curPage = this.__curPage + 1;

            if (this.__curPage > this.__maxPage) {
                return this.__curPage = this.__maxPage;
            }

            var link = this._link + this.__curPage;

            this.link(link);
        } ,

        _defineEvent: function(){
            this._prev.loginEvent('click' , this.prev.bind(this) , true , false);
            this._next.loginEvent('click' , this.next.bind(this) , true , false);
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

    return SimplePage;
})();