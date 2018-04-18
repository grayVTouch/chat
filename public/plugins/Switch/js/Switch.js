/**
 * **************************************
 * author 陈学龙 2017-07-19 14:57:00
 * 水平轮播
 * **************************************
 */
var Switch = (function(){
    'use strict';

    function Switch(con , opt){
        var thisRange = [window , null , undefined];

        if (G.contain(this , thisRange) || (!G.contain(this , thisRange) && this.constructor !== Switch)) {
            return new Switch(con , opt);
        }

        this._defaultOpt = {
            time: 200 ,         // 动画过度时间
            index: 1               // 指定一开始切换到第几个索引，从 1 开始
        };

        if (G.getValType(opt) === 'Undefined') {
            var opt = this._defaultOpt;
        }

        this._con       = G(con);
        this._time      = G.getValType(opt['time']) !== 'Number'    ? this._defaultOpt['time']      : opt['time'];
        this._index     = G.getValType(opt['index']) !== 'Number'   ? this._defaultOpt['index']     : parseInt(opt['index']);

        this._run();
    }

    Switch.prototype = {
        constructor: Switch ,

        _initStaticHTML: function(){
            this._switch        = G('.switch' , this._con.get()).first();
            this._content       = G('.content'   , this._switch.get()).first();
            this._inForCon      = G('.in'           , this._content.get()).first();
            this.__index        = G('.index'        , this._switch.get()).first();
            this._inForIndex    = G('.in'           , this.__index.get()).first();
            this._itemSet       = G('.item'         , this._inForCon.get());

            // 相关计算量
            this._contentW       = this._content.getEleW('border-box');
            this._inForConW     = 0;

            var i   = 0;
            var cur = null;

            for (i = 0; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);
                this._inForConW += cur.getTW();
            }

            this._indexNum      = Math.ceil(this._inForConW / this._contentW);


            var html = [];

            // 填充索引字段
            for (i = 0; i < this._indexNum; ++i)
            {
                html.push('<div class="c-index ' + (i + 1 === this._index ? 'cur' : '') + '" data-index="' + (i + 1) + '" data-id="' + i + '">' + (i + 1) + '</div>');
            }

            this._inForIndex.get().innerHTML = html.join('');
        } ,

        _initStaticArgs: function(){
            // 元素
            this._indexSet      = G('.c-index'      , this._inForIndex.get());

            // 获取移动范围
            this._range = [];

            for (var i = 0; i < this._indexNum; ++i)
            {
                this._range.push(-(this._contentW * i));
            }

            // ID 的极限值
            this._minID   = 0;
            this._maxID    = this._range.length - 1;

            // 动画是否完成的指标
            this._isStopForNext = true;
            this._isStopForPrev = true;

            if (this._index < 1 || this._index > this._itemSet.length) {
                throw new Error("初始索引超出范围");
            }

            // 初始的 marginLeft 值
            this._initVal = this._range[this._index - 1];
        } ,

        _initStatic: function(){
            this._inForCon.css({
                width: this._inForConW + 'px' ,
                marginLeft: this._initVal + 'px'
            });
        } ,

        _initDynamicHTML: function(){

        } ,

        _initDynamicArgs: function(){

        } ,

        _initDynamic: function(){

        } ,

        // 获取当前索引
        id: function(){
           var i    = 0;
           var cur  = null;

           for (; i < this._indexSet.length; ++i)
            {
                cur = G(this._indexSet.get()[i]);

                if (cur.hasClass('cur')) {
                    return parseInt(cur.data('id'));
                }
            }

            throw new Error('找不到当前索引');
        } ,

        // 获取指定索引对应的元素
        index: function(id){
            var i    = 0;
            var cur  = null;

            for (; i < this._indexSet.length; ++i)
            {
                cur = G(this._indexSet.get()[i]);

                if (cur.data('id') == id) {
                    return cur.get();
                }
            }

            throw new Error('找不到索引对应的元素');
        } ,

        // 设置位置
        setPos: function(id){

        } ,

        next: function(){
            if (!this._isStopForNext) {
                return ;
            }

            var id  = this.id();
                id += 1;
                id  = id > this._maxID ? this._minID : id;

            var self   = this;
            var curVal = this._inForCon.getCoordVal('marginLeft');
            var endVal = this._range[id];
            var index  = G(this.index(id));

            this._isStopForNext = false;
            this._isStopForPrev = true;

            this._inForCon.animate({
                carTime: this._time ,
                json: [
                    {
                        attr: 'marginLeft' ,
                        sVal: curVal ,
                        eVal: endVal
                    }
                ] ,
                fn: function(){
                    // index 切换
                    index.highlight('cur' , self._indexSet.get());

                    // 设置动画状态
                    self._isStopForNext = true;
                }
            });
        } ,

        prev: function(){
            if (!this._isStopForPrev) {
                return ;
            }

            var id  = this.id();
            id -= 1;
            id  = id < 0 ? this._maxID : id;
            var self   = this;
            var curVal = this._inForCon.getCoordVal('marginLeft');
            var endVal = this._range[id];
            var index  = G(this.index(id));

            this._isStopForNext = true;
            this._isStopForPrev = false;

            this._inForCon.animate({
                carTime: this._time ,
                json: [
                    {
                        attr: 'marginLeft' ,
                        sVal: curVal ,
                        eVal: endVal
                    }
                ] ,
                fn: function(){
                    // index 切换
                    index.highlight('cur' , self._indexSet.get());

                    // 设置动画状态
                    self._isStopForPrev = true;
                }
            });
        } ,

        // index 精准跳跃
        jump: function(event){
            var tar     = G(event.currentTarget);
            var index   = parseInt(tar.data('index'));
            var curID   = this.id();
            var id      = index - 1;
            var dir     = curID > id ? 'prev' : 'next';

            if (dir === 'next' && !this._isStopForNext || dir === 'prev' && !this._isStopForPrev) {
                return ;
            }

            var self   = this;
            var curVal = this._inForCon.getCoordVal('marginLeft');
            var endVal = this._range[id];
            var index  = G(this.index(id));

            if (dir === 'next') {
                this._isStopForNext = false;
                this._isStopForPrev = true;
            } else {
                this._isStopForNext = true;
                this._isStopForPrev = false;
            }

            this._inForCon.animate({
                carTime: this._time ,
                json: [
                    {
                        attr: 'marginLeft' ,
                        sVal: curVal ,
                        eVal: endVal
                    }
                ] ,
                fn: function(){
                    // index 切换
                    index.highlight('cur' , self._indexSet.get());

                    // 设置状态
                    if (dir === 'next') {
                        self._isStopForNext = true;
                    } else {
                        self._isStopForPrev = true;
                    }
                }
            });
        } ,

        _defineEvent: function(){
            this._indexSet.loginEvent('click' , this.jump.bind(this) , true , false);
        } ,

        _run: function(){
            this._initStaticHTML();
            this._initStaticArgs()
            this._initStatic();
            this._initDynamicHTML();
            this._initDynamicArgs();
            this._initDynamic();

            this._defineEvent();
        }
    };

    return Switch;
})();