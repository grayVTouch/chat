/**
 * Created by 陈学龙（grayVTouch） on 2017/7/21.
 */

/**
 * ************************
 * 搜索条件通用功能 集成类，不包含排序（另外自行实现，然后在回调函数中处理）
 * ************************
 */
var SearchCondition = (function(){
    'use strict';

    function SearchCondition(con , opt){
        var thisRange = [window , null , undefined];

        if (G.contain(this , thisRange) || (!G.contain(this , thisRange) && this.constructor !== SearchCondition)) {
            return new SearchCondition(con , opt);
        }

        this._defaultOpt = {
            // 上传时对应服务端指定的字段
            field: 'id_list' ,
            /**
             * one 一层极
             * two 二层级
             */
            type: 'one' ,
            // 模式：single | multiple
            mode: 'multiple' ,      // 模式
            spreadFn: null ,        // 展开后回调
            shrinkFn: null ,        // 收缩后回调
            singleFn: null ,        // 单选后回调
            multipleFn: null ,      // 多选后回调
            focusFn: null ,         // 选中后回调 ,
            unfocusFn: null ,       // 未选中后回调
            confirmFn: null ,       // 确认后回调
            cancelFn: null ,        // 取消后回调
            clearFn: null ,         // 清除单个属性所有条件后回调
            // 所有条件被清除后的回调函数
            emptyFn: null
        };

        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

        this._con           = G(con);

        this._modeRange     = ['single' , 'multiple'];
        this._mode 	        = G.contain(opt['mode'] , this._modeRange) ? opt['mode'] 	: this._defaultOpt['mode'];
        this._focusFn 	    = G.getValType(opt['focusFn']) !== 'Function' ? this._defaultOpt['focusFn'] : opt['focusFn'];
        this._unfocusFn 	= G.getValType(opt['unfocusFn']) !== 'Function' ? this._defaultOpt['unfocusFn'] : opt['unfocusFn'];
        this._callback 		= G.getValType(opt['callback']) !== 'Function' ? this._defaultOpt['callback'] : opt['callback'];
        this._singleFn 		= G.getValType(opt['singleFn']) !== 'Function' ? this._defaultOpt['singleFn'] : opt['singleFn'];
        this._multipleFn 	= G.getValType(opt['multipleFn']) !== 'Function' ? this._defaultOpt['multipleFn'] : opt['multipleFn'];
        this._spreadFn 		= G.getValType(opt['spreadFn']) !== 'Function' ? this._defaultOpt['spreadFn'] : opt['spreadFn'];
        this._shrinkFn 		= G.getValType(opt['shrinkFn']) !== 'Function' ? this._defaultOpt['shrinkFn'] : opt['shrinkFn'];
        this._confirmFn 	= G.getValType(opt['confirmFn']) !== 'Function' ? this._defaultOpt['confirmFn'] : opt['confirmFn'];
        this._cancelFn 	    = G.getValType(opt['cancelFn']) !== 'Function' ? this._defaultOpt['cancelFn'] : opt['cancelFn'];
        this._clearFn 		= G.getValType(opt['clearFn']) !== 'Function' ? this._defaultOpt['clearFn'] : opt['clearFn'];
        this._emptyFn       = G.getValType(opt['emptyFn']) === 'Function'       ? opt['emptyFn'] : this._defaultOpt['emptyFn'];

        this._run();
    }

    SearchCondition.prototype = {
        constructor: SearchCondition ,

        _initStaticHTML: function(){
            // 初始化生成已选择条件

        }  ,

        _initStaticArgs: function(){
            // 元素
            this._searchCondition       = G('.search-condition'     , this._con.get()).first();
            this._selectedCondition     = G('.selected-condition'   , this._searchCondition.get()).first();
            this._selectCondition	    = G('.select-condition'     , this._searchCondition.get()).first();
            this._itemSetForNormal      = G('.normal'               , this._selectCondition.get());
            this._advanced              = G('.advanced' , this._selectCondition.get()).first();
            this._content               = G('.content' , this._advanced.get()).first();

            // 相关参数
            this._focus = 'cur';
        }  ,

        _initStatic: function(){

        } ,

        _initDynamicArgs: function(){

        }  ,

        _initDynamicHTML: function(){

        }  ,

        _initDynamic: function(){

        } ,

        // 根据给定的类型获取对应的集合
        itemSetForIdnetifier: function(itemSetType){
            if (!G.contain(itemSetType , this._itemSetTypeForIdentifierRange)) {
                throw new Error("不支持的类型");
            }

            if (itemSetType === 'normal') {
                return this._itemSetForNormal;
            }

            if (itemSetType === 'content') {
                return this._cItemSetForAdvancedWithContent;
            }

            if (itemSetType === 'details') {
                return this._cItemSetForAdvancedWithDetails;
            }
        } ,

        // type + identifier => item
        // @param type normal|advanced
        item: function(type , itemSetType , identifier){
            var itemSet = this.itemSetForIdnetifier(itemSetType);
            var i       = 0;
            var cur     = null;
            var item    = null;

            for (; i < itemSet.length; ++i)
            {
                cur = G(itemSet.get()[i]);

                if (cur.data('identifier') == identifier) {
                    var option      = this.option(type);

                    if (type == 'normal') {
                        if (option['type'] == 'one') {
                            var
                        } else {

                        }
                    } else {

                    }

                    return item;
                }
            }

            throw new Error('找不到对应项');
        } ,
        
        // 获取给定 type + identifier
        // @param type normal|advanced
        itemSetForSelectData: function(type , identifier){
            var itemSet =
        } ,

        // 获取初始化条件 idList
        idListForInitialization: function(itemSetType , identifier){
            var itemSet = this.itemSetForIdnetifier(itemSetType);
            var i       = 0;
            var cur     = null;
            var idList  = null;

            for (; i < itemSet.length; ++i)
            {
                cur = G(itemSet.get()[i]);

                if (cur.data('identifier') == identifier) {
                    idList = cur.data('idList');

                    return G.getValType(idList) === 'Null' ? [] : G.jsonDecode(idList)
                }
            }

            throw new Error("未找到对应项");
        } ,

        nameForID: function(type , id){
            var itemSet = this.itemSet(type);
            var i       = 0;
            var cur     = null;

            for (; i < itemSet.length; ++i)
            {
                cur = G(itemSet.get()[i]);

                if (cur.data('id') == id) {
                    return cur.get();
                }
            }

            throw new Error("未找到对应项");
        } ,

        // 获取给定类型指定 identifier 获取对应的配置
        // @param type => normal|advanced
        option: function(type , identifier){
            return this._option[type][identifier];
        } ,

        // normal: 获取指定 identifier 对应的项
        itemForNormal: function(identifier){
            var i = 0;
            var cur = null;

            for (; i < this._itemSetForNormal.length; ++i)
            {
                cur = G(this._itemSetForNormal.get()[i]);

                if (cur.data('identifier') == identifier) {
                    return cur.get();
                }
            }

            throw new Error("获取不到 identifier 对应的项");
        } ,

        // advanced：获取指定 identifier 对应的项
        itemForAdvancedWithContent: function(){
            var i = 0;
            var cur = null;

            for (; i < this._cItemSetForAdvancedWithContent.length; ++i)
            {
                cur = G(this._cItemSetForAdvancedWithContent.get()[i]);

                if (cur.data('identifier') == identifier) {
                    return cur.get();
                }
            }

            throw new Error("获取不到 identifier 对应的项");
        } ,

        itemForAdvancedWithDetails: function(){
            var i = 0;
            var cur = null;

            for (; i < this._cItemSetForAdvancedWithDetails.length; ++i)
            {
                cur = G(this._cItemSetForAdvancedWithDetails.get()[i]);

                if (cur.data('identifier') == identifier) {
                    return cur.get();
                }
            }

            throw new Error("获取不到 identifier 对应的项");
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

    return SearchCondition;
})();