/**
 * Created by 陈学龙（grayVTouch） on 2017/7/21.
 */

/**
 * ************************
 * 已选择条件
 * ************************
 */
var View = (function(){
    'use strict';

    function View(con , opt){
        var thisRange = [window , null , undefined];

        if (G.contain(this , thisRange) || (!G.contain(this , thisRange) && this.constructor !== View)) {
            return new View(con , opt);
        }

        this._defaultOpt = {
            // 切换试图后的回调函数
            callback: null ,
            initializeFn: null ,    // 初始化完毕后回调
        };

        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

        this._con = G(con);

        this._callback      = G.getValType(opt['callback']) === 'Function' ? opt['callback'] : this._defaultOpt['callback'];
        this._initializeFn 	= G.getValType(opt['initializeFn']) !== 'Function' && G.getValType(opt['initializeFn']) !== 'Array' ? this._defaultOpt['initializeFn'] : opt['initializeFn'];

        this._run();
    }

    View.prototype = {
        constructor: View ,

        _initStaticHTML: function(){

        }  ,

        _initStaticArgs: function(){
            this._view      = G('.view' , this._con.get()).first();
            this._itemSet   = G('.item' , this._view.get());

            // 默认视图
            this.__view = this._view.data('view');

            // 类名
            this._classForFocus = 'cur';
        }  ,

        _initStatic: function(){
            // 设置默认视图
            var i   = 0;
            var cur = null;

            for (; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.data('view') == this.__view) {
                    cur.addClass(this._classForFocus);
                } else {
                    cur.removeClass(this._classForFocus);
                }
            }
        } ,

        _initDynamicHTML: function(){

        }  ,

        _initDynamicArgs: function(){

        }  ,

        _initDynamic: function(){

        } ,

        item: function(view){
            var i = 0;
            var cur = null;

            for (; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.data('view') == view) {
                    return cur.get();
                }
            }

            throw new Error("未找到对应项");
        } ,

        switch: function(view){
            var item = this.item(view);
                item = G(item);

            item.highlight(this._classForFocus , this._itemSet.get());

            this._view.data('view' , view);

            if (G.getValType(this._callback) === 'Function') {
                this._callback(view);
            }
        } ,

        // 返回默认视图
        view: function(){
            return this.__view;
        } ,

        _clickEvent: function(event){
            var tar     = G(event.currentTarget);
            var view    = tar.data('view');

            this.switch(view);
        } ,

        _defineEvent: function(){
            this._itemSet.loginEvent('click' , this._clickEvent.bind(this) , true , false);
        } ,

        _run: function(){
            this._initStaticHTML();
            this._initStaticArgs();
            this._initStatic();
            this._initDynamicHTML();
            this._initDynamicArgs();
            this._initDynamic();
            this._defineEvent();

            // 如果是单个函数则直接执行
            if (G.getValType(this._initializeFn) === 'Function') {
                this._initializeFn.call(this);
            }

            // 如果是一系列函数，则逐个执行
            if (G.getValType(this._initializeFn) === 'Array') {
                var i   = 0;
                var cur = null;

                for (; i < this._initializeFn.length; ++i)
                {
                    cur = this._initializeFn[i];

                    if (G.getValType(cur) === 'Function') {
                        cur.call(this);
                    }
                }
            }
        }
    };

    return View;
})();