/**
 * Created by 陈学龙（grayVTouch） on 2017/7/21.
 */

/**
 * ************************
 * 已选择条件
 * ************************
 */
var Sort = (function(){
    'use strict';

    function Sort(con , opt){
        var thisRange = [window , null , undefined];

        if (G.contain(this , thisRange) || (!G.contain(this , thisRange) && this.constructor !== Sort)) {
            return new Sort(con , opt);
        }

        this._defaultOpt = {
            // 选择某个排序后的回调函数
            ascFn: null ,
            descFn: null ,
            clickFn: null ,
            initializeFn: null ,    // 初始化完毕后回调
        };

        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

        this._con = G(con);

        this._ascFn  = G.getValType(opt['ascFn']) === 'Function'   ? opt['ascFn']    : this._defaultOpt['ascFn'];
        this._descFn = G.getValType(opt['descFn']) === 'Function'  ? opt['descFn']   : this._defaultOpt['descFn'];
        this._clickFn = G.getValType(opt['clickFn']) === 'Function'  ? opt['clickFn']   : this._defaultOpt['clickFn'];
        this._initializeFn 	= G.getValType(opt['initializeFn']) !== 'Function' && G.getValType(opt['initializeFn']) !== 'Array' ? this._defaultOpt['initializeFn'] : opt['initializeFn'];

        this._run();
    }

    Sort.prototype = {
        constructor: Sort ,

        _initStaticHTML: function(){

        }  ,

        _initStaticArgs: function(){
            // 元素
            this._sort      = G('.sort' , this._con.get()).first();
            this._itemSet   = G('.item' , this._sort.get());

            this._field    = this._sort.data('field');

            this._asc = 'asc';
            this._desc = 'desc';

            // 默认排序
            this.__sort    = this._sort.data('sort');
            this._type     = this.__sort == this._asc ? this._asc : this.__sort == this._desc ? this._desc : '';
        }  ,

        _initStatic: function(){
            var i       = 0;
            var cur     = null;
            var pic     = null;

            // 设置默认排序状态
            for (i = 0; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);
                pic = G('.pic' , cur.get()).first();

                if (this._type !== '' && cur.data('field') == this._field) {
                    cur.addClass('cur');
                    cur.data('sort' , this._type);
                    pic.get().src = pic.data(this._type);
                } else {
                    // 默认为升序
                    cur.removeClass('cur');
                    cur.data('sort' , this._asc);
                    pic.get().src = pic.data(this._asc);
                }
            }
        } ,

        _initDynamicHTML: function(){

        }  ,

        _initDynamicArgs: function(){

        }  ,

        _initDynamic: function(){

        } ,

        item: function(field){
            var i = 0;
            var cur = null;

            for (; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.data('field') == field) {
                    return cur.get();
                }
            }

            throw new Error("未找到对应项");
        } ,

        asc: function(field){
            var item = G(this.item(field));
            var pic  = G('.pic' , item.get()).first();

            item.highlight('cur' , this._itemSet.get());
            item.data('sort' , this._asc);

            pic.get().src = pic.data(this._asc);

            this._sort.data('field' , field);
            this._sort.data('sort' , this._asc);

            if (G.getValType(this._ascFn) === 'Function') {
                this._ascFn(field , this._asc);
            }
        } ,

        desc: function(field){
            var item = G(this.item(field));
            var pic  = G('.pic' , item.get()).first();

            item.highlight('cur' , this._itemSet.get());
            item.data('sort' , this._desc);

            pic.get().src = pic.data(this._desc);

            this._sort.data('field' , field);
            this._sort.data('sort' , this._desc);

            if (G.getValType(this._descFn) === 'Function') {
                this._descFn(field , this._desc);
            }
        } ,

        _clickEvent: function(event){
            var tar     = G(event.currentTarget);
            var sort    = tar.data('sort');
            var field   = tar.data('field');
            var type    = null;

            if (tar.hasClass('cur')) {
                if (sort == this._asc) {
                    this.desc(field);
                    type = this._desc;
                } else {
                    this.asc(field);
                    type = this._asc;
                }
            } else {
                if (sort == this._asc) {
                    this.asc(field);
                    type = this._asc;
                } else {
                    this.desc(field);
                    type = this._desc;
                }
            }

            if (G.getValType(this._clickFn) === 'Function') {
                this._clickFn(field , type);
            }
        } ,

        // 获取默认数据
        sort: function(){
            return {
                field: this._field ,
                sort: this._type
            };
        },

        _defineEvent: function(){
            // 点击事件
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

    return Sort;
})();