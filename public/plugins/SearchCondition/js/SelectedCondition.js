/**
 * Created by 陈学龙（grayVTouch） on 2017/7/21.
 */

/**
 * ************************
 * 已选择条件
 * ************************
 */
var SelectedCondition = (function(){
    'use strict';

    function SelectedCondition(con , opt){
        var thisRange = [window , null , undefined];

        if (G.contain(this , thisRange) || (!G.contain(this , thisRange) && this.constructor !== SelectedCondition)) {
            return new SelectedCondition(con , opt);
        }

        this._defaultOpt = {
            // 文本条件创建后调用
            createFn: null ,
            // 文本条件被删除后调用
            deleteFn: null ,
            // 关键字创建后调用
            createForKeywordsFn: null ,
            // 关键字删除后调用
            deleteForKeywordsFn: null
        };

        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

        this._con = G(con);

        this._createFn              = G.getValType(opt['createFn']) === 'Function' ? opt['createFn'] : this._defaultOpt['createFn'];
        this._deleteFn              = G.getValType(opt['deleteFn']) === 'Function' ? opt['deleteFn'] : this._defaultOpt['deleteFn'];
        this._createForKeywordsFn   = G.getValType(opt['createForKeywordsFn']) === 'Function' ? opt['createForKeywordsFn'] : this._defaultOpt['createForKeywordsFn'];
        this._deleteForKeywordsFn   = G.getValType(opt['deleteForKeywordsFn']) === 'Function' ? opt['deleteForKeywordsFn'] : this._defaultOpt['deleteForKeywordsFn'];

        this._run();
    }

    SelectedCondition.prototype = {
        constructor: SelectedCondition ,

        _initStaticHTML: function(){


        }  ,

        _initStaticArgs: function(){
            this._selectedCondition = G('.selected-condition' , this._con.get()).first();
            // 关键字：有且仅有一个!
            this._keywords      = null;

            this._hasKeywords   = false;
        }  ,

        _initStatic: function(){

        } ,

        _initDynamicHTML: function(){

        }  ,

        _initDynamicArgs: function(){
            this._textSet  = G('.text' , this._selectedCondition.get());
        }  ,

        _initDynamic: function(){

        } ,

        // 定义删除条件事件
        _eventForText: function(div){
            div = G(div);

            var self = this;

            div.loginEvent('click' , function(){
                var tar       = G(this);
                var identifier = tar.data('identifier');

                self.delete(identifier);
            } , true , false);
        } ,

        // 创建条件
        create: function(field , value , identifier , shift){
            shift = G.getValType(shift) === 'Boolean' ? shift : false;
            var div  = document.createElement('div');
                div = G(div);
                div.data('identifier' , identifier);
                div.addClass(['item' , 'text']);

            var html = [];
            html.push(' <div class="content">');
            html.push('     <div class="explain">');
            html.push('         <span class="field">' + field + '</span>');
            html.push('         <span class="value">' + value + '</span>');
            html.push('     </div>');
            html.push('     <div class="close">X</div>');
            html.push(' </div>');
            html.push(' <div class="sign">&gt;</div>');

            div.get().innerHTML = html.join('');

            // 添加节点
            if (!shift) {
                if (this._hasKeywords) {
                    this._selectedCondition.get().insertBefore(div.get() , this._keywords.get());
                } else {
                    this._selectedCondition.get().appendChild(div.get());
                }
            } else {
                if (this._selectedCondition.get().childElementCount === 0) {
                    this._selectedCondition.get().appendChild(div.get());
                } else {
                    this._selectedCondition.get().insertBefore(div.get() , this._selectedCondition.get().children[0]);
                }
            }

            // 定义事件
            this._eventForText(div.get());

            // 更新参数
            this._initDynamicHTML();
            this._initDynamicArgs();
            this._initDynamic();

            if (G.getValType(this._createFn) === 'Function') {
                this._createFn.call(this);
            }
        } ,

        // 通过 identifier 删除
        delete: function(identifier){
            var i   = 0;
            var cur = null;

            for (; i < this._textSet.length; ++i)
            {
                cur = G(this._textSet.get()[i]);

                if (cur.data('identifier') == identifier) {
                    cur.get().parentNode.removeChild(cur.get());
                    // 索引减少
                    i--;
                    // 范围减少
                    this._textSet.length--;
                }
            }

            if (G.getValType(this._deleteFn) === 'Function') {
                this._deleteFn.call(this , identifier);
            }
        } ,

        // 定义关键字相关事件
        _eventForKeywords: function(div){
            div = G(div);

            var self = this;

            div.loginEvent('click' , function(){
                self.deleteKeywords();
            } , true , false);
        } ,

        // 删除关键字
        deleteKeywords: function(isCall){
            isCall = G.getValType(isCall) === 'Boolean' ? isCall : true;

            this._keywords.get().parentNode.removeChild(this._keywords.get());

            this._hasKeywords = false;

            this._initDynamicHTML();
            this._initDynamicArgs();
            this._initDynamic();

            if (isCall && G.getValType(this._deleteForKeywordsFn) === 'Function') {
                this._deleteForKeywordsFn.call(this);
            }
        } ,

        // 创建关键字
        // 重复创建会删除上一次创建的关键字
        createKeywords: function(value){
            if (this._hasKeywords) {
                this.deleteKeywords(false);
            }

            var html = [];
            var div = document.createElement('div');
                div = G(div);
                div.addClass(['item' , 'keywords']);

            html.push('“<span class="text">' + value + '</span>”');

            div.get().innerHTML = html.join('');

            this._selectedCondition.get().appendChild(div.get());

            this._eventForKeywords(div.get());

            // 更新
            this._keywords = G('.keywords' , this._selectedCondition.get()).first();

            this._hasKeywords = true;

            this._initDynamicHTML();
            this._initDynamicArgs();
            this._initDynamic();

            if (G.getValType(this._createForKeywordsFn) === 'Function') {
                this._createForKeywordsFn.call(this);
            }
        } ,

        _defineEvent: function(){

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

    return SelectedCondition;
})();