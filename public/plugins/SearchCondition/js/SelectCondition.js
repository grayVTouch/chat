/**
 * Created by 陈学龙（grayVTouch） on 2017/7/21.
 */

/**
 * ************************
 * 搜索条件通用功能 集成类，不包含排序（另外自行实现，然后在回调函数中处理）
 * ************************
 */
var SelectCondition = (function(){
    'use strict';

    function SelectCondition(con , opt){
        var thisRange = [window , null , undefined];

        if (G.contain(this , thisRange) || (!G.contain(this , thisRange) && this.constructor !== SelectCondition)) {
            return new SelectCondition(con , opt);
        }

        this._defaultOpt = {
            /**
             * 不同的层级对应不同的 html 结构
             * one 一层极
             * two 二层级
             */
            type: 'one' ,
            // 模式：single | multiple
            mode: 'multiple' ,      // 模式
            clickFn: null ,     // 项点击时触发
            spreadFn: null ,        // 展开后回调
            shrinkFn: null ,        // 收缩后回调
            singleFn: null ,        // 单选后回调
            multipleFn: null ,      // 多选后回调
            focusFn: null ,         // 选中后回调 ,
            unfocusFn: null ,       // 未选中后回调
            confirmFn: null ,       // 确认后回调
            cancelFn: null ,        // 取消后回调
            clearFn: null ,         // 清除单个属性所有条件后回调
            initializeFn: null     // 初始化完毕后回调
        };

        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

        this._modeRange     = ['single' , 'multiple'];
        this._typeRange     = ['one' , 'two'];

        this._con           = G(con);
        this._mode 	        = G.contain(opt['mode'] , this._modeRange) ? opt['mode'] 	: this._defaultOpt['mode'];
        this._type          = G.contain(opt['type'] , this._typeRange) ? opt['type']    : this._defaultOpt['type'];
        this._clickFn 	    = G.getValType(opt['clickFn']) !== 'Function' ? this._defaultOpt['clickFn'] : opt['clickFn'];
        this._focusFn 	    = G.getValType(opt['focusFn']) !== 'Function' ? this._defaultOpt['focusFn'] : opt['focusFn'];
        this._unfocusFn 	= G.getValType(opt['unfocusFn']) !== 'Function' ? this._defaultOpt['unfocusFn'] : opt['unfocusFn'];
        this._singleFn 		= G.getValType(opt['singleFn']) !== 'Function' ? this._defaultOpt['singleFn'] : opt['singleFn'];
        this._multipleFn 	= G.getValType(opt['multipleFn']) !== 'Function' ? this._defaultOpt['multipleFn'] : opt['multipleFn'];
        this._spreadFn 		= G.getValType(opt['spreadFn']) !== 'Function' ? this._defaultOpt['spreadFn'] : opt['spreadFn'];
        this._shrinkFn 		= G.getValType(opt['shrinkFn']) !== 'Function' ? this._defaultOpt['shrinkFn'] : opt['shrinkFn'];
        this._confirmFn 	= G.getValType(opt['confirmFn']) !== 'Function' ? this._defaultOpt['confirmFn'] : opt['confirmFn'];
        this._cancelFn 	    = G.getValType(opt['cancelFn']) !== 'Function' ? this._defaultOpt['cancelFn'] : opt['cancelFn'];
        this._clearFn 		= G.getValType(opt['clearFn']) !== 'Function' ? this._defaultOpt['clearFn'] : opt['clearFn'];
        this._initializeFn 	= G.getValType(opt['initializeFn']) !== 'Function' && G.getValType(opt['initializeFn']) !== 'Array' ? this._defaultOpt['initializeFn'] : opt['initializeFn'];

        this._run();
    }

    SelectCondition.prototype = {
        constructor: SelectCondition ,

        _initStaticHTML: function(){
            // 初始化生成已选择条件

        }  ,

        _initStaticArgs: function(){
            // 搜索完整的 id & name 的键值对
            this._data = {};

            // 元素：公共部分
            this._selectCondition = G('.select-condition' , this._con.get()).first();
            this._selectData    = G('.select-data'      , this._selectCondition.get()).first();
            this._selectedData  = G('.selected-data'    , this._selectCondition.get()).first();
            this._function      = G('.function'         , this._selectCondition.get()).first();
            this._decide        = G('.decide'           , this._selectCondition.get()).first();
            this._listForSelectedData = G('.list'       , this._selectedData.get()).first();
            this._more      = G('.more'         , this._function.get()).first();
            this._smSwitch  = G('.sm-switch'    , this._function.get()).first();
            this._confirm   = G('.confirm'      , this._decide.get()).first();
            this._cancel    = G('.cancel'       , this._decide.get()).first();

            // 元素：非公共部分
            this._type === 'one' ? this._initStaticArgsForOne() : this._initStaticArgsForTwo();

            // 参数
            this._classForFocus = 'cur';
            this._classForOne   = 'select-condition-for-one';
            this._classForTwo   = 'select-condition-for-two';
            this._classForMultiple = 'select-condition-for-multiple';


            this._originHForSelectData = this._selectData.getEleH('border-box');

            // 初始化已选择的项
            this._idListForInitialization = this._selectCondition.data('idList');
            this._idListForInitialization = !G.isValidVal(this._idListForInitialization) ? [] : G.jsonDecode(this._idListForInitialization);
            this._isInitialize = false;

            // 多选时临时设置的状态
            this._idListForMultiple = {};
        }  ,

        _initStatic: function(){
            // 层级样式设置
            if (this._type === 'one') {
                this._selectCondition.addClass(this._classForOne);
            } else {
                this._selectCondition.addClass(this._classForTwo);
            }
        } ,

        _initDynamicHTML: function(){

        }  ,

        _initDynamicArgs: function(){
            // 元素
            this._itemSetForSelectedData = G('.item' , this._listForSelectedData.get());
        }  ,

        _initDynamic: function(){
            if (!this._isInitialize) {
                // 由于下面存在重复调用 _initDynamic 的步骤，所以需要提前设置标志！！
                // 避免进入死循环
                this._isInitialize = true;

                // 初始化选中项
                var i   = 0;
                var cur = null;

                for (i = 0; i < this._idListForInitialization.length; ++i)
                {
                    cur = this._idListForInitialization[i];

                    // 这一步存在重新调用 _initDynamic 的步骤
                    this.focus(cur);
                }
            }
        } ,

        // 初始化层级 one
        _initStaticArgsForOne: function(){
            this._itemSetForAll     = G('.item'     , this._selectData.get());
            this._itemSetForSearch  = G('.search'   , this._selectData.get());
            this._clear             = G('.clear'    , this._selectData.get()).first();

            var i   = 0;
            var cur = null;

            for (; i < this._itemSetForSearch.length; ++i)
            {
                cur = G(this._itemSetForSearch.get()[i]);
                this._data[cur.data('id')] = cur.get().textContent;
            }
        } ,

        // 初始化层级 two
        _initStaticArgsForTwo: function(){
            this._someData  = G('.some-data' , this._selectData.get()).first();
            this._allData   = G('.all-data'  , this._selectData.get()).first();
            this._clear     = G('.clear'    , this._someData.get()).first();

            // 热门数据
            this._itemSetForHotWithAll      = G('.item'     , this._someData.get());
            this._itemSetForHotWithSearch   = G('.search'   , this._someData.get());

            // 完整数据
            this._itemSet = G('.c-item' , this._allData.get());

            var i   = 0;
            var cur = null;

            for (; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);
                this._data[cur.data('id')] = cur.get().textContent;
            }
        } ,

        // 添加限制
        limit: function(){
            this._clear.removeClass(this._classForFocus);
            this._clear.data('isFocus' , 'n');
        } ,

        // 去除限制
        removeLimit: function(){
            this._clear.addClass(this._classForFocus);
            this._clear.data('isFocus' , 'y');
        } ,

        // 清空所有已选项
        clear: function(){
            var k   = 0;
            var cur = null;

            for (k in this._data)
            {
                this.unfocus(k);
            }

            if (G.getValType(this._clearFn) === 'Function') {
                this._clearFn.call(this);
            }
        } ,

        // 添加到已选择的数据中
        addToSelectedData: function(id){
            var span = document.createElement('span');
                span = G(span);
                span.data('id' , id);
                span.addClass('item');
                span.get().textContent = this._data[id];

            this._eventForSelectedData(span.get());

            this._listForSelectedData.get().appendChild(span.get());

            // 重新计算相关动态参数
            this._initDynamicHTML();
            this._initDynamicArgs();
            this._initDynamic();
        } ,

        // 从已选择数据中删除指定项
        removeFromSelectedData: function(id){
            var i   = 0;
            var cur = null;

            for (; i < this._itemSetForSelectedData.length; ++i)
            {
                cur = G(this._itemSetForSelectedData.get()[i]);

                if (cur.data('id') == id) {
                    // 移除
                    cur.get().parentNode.removeChild(cur.get());
                    // 由于已选择的区域不可能会有重复的 id 的元素，所以，找到后终止
                    break;
                }
            }

            // 重新计算相关动态参数
            this._initDynamicHTML();
            this._initDynamicArgs();
            this._initDynamic();
        } ,

        // 一层极：选中
        focusForOne: function(id){
            var i           = 0;
            var cur         = null;
            var isMultiple  = this._smSwitch.data('isMultiple');

            for (; i < this._itemSetForSearch.length; ++i)
            {
                cur = G(this._itemSetForSearch.get()[i]);

                if (cur.data('id') == id) {
                    cur.data('isFocus' , 'y');
                    cur.addClass(this._classForFocus);

                    // 添加到已选择的数据中
                    this.addToSelectedData(id);

                    break;
                }
            }

            var idList = this.idList();

            // 如果选择条件，则去除无限制条件的状态指示
            if (idList.length > 0) {
                this.limit();
            }

            if (isMultiple !== 'y' && G.getValType(this._focusFn) === 'Function') {
                this._focusFn.call(this , id);
            }
        } ,

        // 二层级：选中
        focusForTwo: function(id){
            var i           = 0;
            var cur         = null;
            var isMultiple  = this._smSwitch.data('isMultiple');

            for (i = 0; i < this._itemSetForHotWithAll.length; ++i)
            {
                cur = G(this._itemSetForHotWithAll.get()[i]);

                if (cur.data('id') == id) {
                    cur.data('isFocus' , 'y');
                    cur.addClass(this._classForFocus);
                }
            }

            for (i = 0; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.data('id') == id) {
                    cur.data('isFocus' , 'y');
                    cur.addClass(this._classForFocus);

                    // 添加到已选择的数据中
                    this.addToSelectedData(id);

                    break;
                }
            }

            var idList = this.idList();

            // 如果选择条件，则去除无限制条件的状态指示
            if (idList.length > 0) {
                this.limit();
            }

            if (isMultiple !== 'y' && G.getValType(this._focusFn) === 'Function') {
                this._focusFn.call(this , id);
            }
        } ,

        // 一层极：不选中
        unfocusForOne: function(id){
            var i           = 0;
            var cur         = null;
            var isMultiple  = this._smSwitch.data('isMultiple');

            for (; i < this._itemSetForAll.length; ++i)
            {
                cur = G(this._itemSetForAll.get()[i]);

                if (cur.data('id') == id) {
                    cur.data('isFocus' , 'n');
                    cur.removeClass(this._classForFocus);
                    this.removeFromSelectedData(id);

                    break;
                }
            }

            var idList = this.idList();

            // 如果选择条件，则添加无限制条件的状态指示
            if (idList.length === 0) {
                this.removeLimit();
            }

            if (isMultiple !== 'y' && G.getValType(this._unfocusFn) === 'Function') {
                this._unfocusFn.call(this , id);
            }
        } ,

        // 二层级：不选中
        unfocusForTwo: function(id){
            var i           = 0;
            var cur         = null;
            var isMultiple  = this._smSwitch.data('isMultiple');

            for (i = 0; i < this._itemSetForHotWithAll.length; ++i)
            {
                cur = G(this._itemSetForHotWithAll.get()[i]);

                if (cur.data('id') == id) {
                    cur.data('isFocus' , 'n');
                    cur.removeClass(this._classForFocus);

                    break;
                }
            }

            for (i = 0; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.data('id') == id) {
                    cur.data('isFocus' , 'n');
                    cur.removeClass(this._classForFocus);
                    this.removeFromSelectedData(id);

                    break;
                }
            }

            var idList = this.idList();

            // 如果选择条件，则添加无限制条件的状态指示
            if (idList.length === 0) {
                this.removeLimit();
            }

            if (isMultiple !== 'y' && G.getValType(this._unfocusFn) === 'Function') {
                this._unfocusFn.call(this , id);
            }
        } ,

        focus: function(id){
            this._type === 'one' ? this.focusForOne(id) : this.focusForTwo(id);
        } ,

        unfocus: function(id){
            this._type === 'one' ? this.unfocusForOne(id) : this.unfocusForTwo(id);
        } ,

        // 单选（排他）：一层极
        excludeForOne: function(id){
            var self        = this;
            var i           = 0;
            var cur         = null;
            var isFocus     = null;
            var isMultiple  = this._smSwitch.data('isMultiple');

            var focus = function(item){
                item = G(item);

                item.addClass(self._classForFocus);
                item.data('isFocus' , 'y');

                // 添加到已选择的数据
                self.addToSelectedData(item.data('id'));
            };

            var unfocus = function(item){
                item = G(item);

                item.removeClass(self._classForFocus);
                item.data('isFocus' , 'n');

                // 从已选择的数据中删除
                self.removeFromSelectedData(item.data('id'));
            };

            for (; i < this._itemSetForSearch.length; ++i)
            {
                cur = G(this._itemSetForSearch.get()[i]);

                if (cur.data('id') == id) {
                    isFocus = cur.data('isFocus');

                    if (isFocus === 'y') {
                        unfocus(cur.get());
                    } else {
                        focus(cur.get());
                    }
                } else {
                    unfocus(cur.get());
                }
            }

            // 回调函数
            if (isMultiple != 'y') {
                if (isFocus === 'y') {
                    if (G.getValType(this._unfocusFn) === 'Function') {
                        this._unfocusFn.call(this , id);
                    }
                } else {
                    if (G.getValType(this._unfocusFn) === 'Function') {
                        this._focusFn.call(this , id);
                    }
                }
            }
        } ,

        excludeForTwo: function(id){
            var self        = this;
            var i           = 0;
            var cur         = null;
            var isFocus     = null;
            var isMultiple  = this._smSwitch.data('isMultiple');

            var focus = function(item){
                item = G(item);

                item.addClass(self._classForFocus);
                item.data('isFocus' , 'y');

                // 添加到已选择的数据
                self.addToSelectedData(item.data('id'));
            };

            var unfocus = function(item){
                item = G(item);

                item.removeClass(self._classForFocus);
                item.data('isFocus' , 'n');

                // 从已选择的数据中删除
                self.removeFromSelectedData(item.data('id'));
            };

            for (; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.data('id') == id) {
                    isFocus = cur.data('isFocus');

                    if (isFocus === 'y') {
                        unfocus(cur.get());
                    } else {
                        focus(cur.get());
                    }
                } else {
                    unfocus(cur.get());
                }
            }

            // 回调函数
            if (isMultiple != 'y') {
                if (isFocus === 'y') {
                    if (G.getValType(this._unfocusFn) === 'Function') {
                        this._unfocusFn.call(this , id);
                    }
                } else {
                    if (G.getValType(this._unfocusFn) === 'Function') {
                        this._focusFn.call(this , id);
                    }
                }
            }
        } ,

        exclude: function(id){
            this._type === 'one' ? this.excludeForOne(id) : this.excludeForTwo(id);
        } ,

        spread: function(){
            var text = "-&nbsp;收缩";

            this._more.get().innerHTML = text;
            this._more.data('isSpread' , 'y');

            this._selectData.css({
                height: 'auto' ,
            });
        } ,

        shrink: function(){
            var text = "+&nbsp;展开";

            this._more.get().innerHTML = text;
            this._more.data('isSpread' , 'n');

            this._selectData.css({
                height: this._originHForSelectData + 'px' ,
            });
        } ,

        // 单选
        single: function(isReset){
            isReset  = G.getValType(isReset) === 'Boolean' ? isReset : true;
            var text = "多选";

            // 这一步一定要先执行！否则会触发 focusFn or unfocusFn ...
            isReset ? this._reset() : null;

            this._smSwitch.data('isMultiple' , 'n');
            this._smSwitch.get().innerHTML = text;
            this._selectCondition.removeClass(this._classForMultiple);

            // 展开
            this.shrink();
            this.hideDecide();
            this.hideSelectedData();

            if (G.getValType(this._singleFn) === 'Function') {
                this._singleFn.call(this);
            }
        } ,

        // 保存初始状态：one
        saveForOne: function(){
            // 重置
            this._idListForMultiple = {};

            var i   = 0;
            var cur = null;

            for (; i < this._itemSetForSearch.length; ++i)
            {
                cur = G(this._itemSetForSearch.get()[i]);
                this._idListForMultiple[cur.data('id')] = cur.data('isFocus');
            }
        } ,

        // 保存初始状态：two
        saveForTwo: function(){
            // 重置
            this._idListForMultiple = {};

            var i   = 0;
            var cur = null;

            for (; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);
                this._idListForMultiple[cur.data('id')] = cur.data('isFocus');
            }
        } ,


        // 保存初始状态
        save: function(){
            this._type === 'one' ? this.saveForOne() : this.saveForTwo();
        } ,

        // 多选
        multiple: function(){
            var text = "单选";

            this._smSwitch.data('isMultiple' , 'y');
            this._smSwitch.get().innerHTML = text;
            this._selectCondition.addClass(this._classForMultiple);

            // 展开
            this.spread();
            this.showDecide();
            this.showSelectedData();
            // 保存初始状态，当用户未点击确定按钮时，回复初始状态
            this.save();

            if (G.getValType(this._multipleFn) === 'Function') {
                this._multipleFn.call(this);
            }
        } ,


        _confirmEvent: function(){
            this.single(false);

            if (G.getValType(this._confirmFn) === 'Function') {
                this._confirmFn.call(this);
            }
        } ,

        _cancelEvent: function(){
            // 单选
            this.single();

            if (G.getValType(this._cancelFn) === 'Function') {
                this._cancelFn.call(this);
            }
        } ,

        // 重置多选时未确定状态下临时设置的状态
        _reset: function(){
            var k   = 0;
            var cur = null;

            for (k in this._idListForMultiple)
            {
                cur = this._idListForMultiple[k];

                if (cur === 'y') {
                    this.focus(k);
                } else {
                    this.unfocus(k);
                }
            }
        } ,

        showDecide: function(){
            this._decide.removeClass('hide');
        } ,

        hideDecide: function(){
            this._decide.addClass('hide');
        } ,

        showSelectedData: function(){
            this._selectedData.removeClass('hide');
        } ,

        hideSelectedData: function(){
            this._selectedData.addClass('hide');
        } ,

        // 获取已选择项 idList
        idList: function(){
            var i       = 0;
            var cur     = null;
            var idList  = [];

            for (; i < this._itemSetForSelectedData.length; ++i)
            {
                cur = G(this._itemSetForSelectedData.get()[i]);

                idList.push(cur.data('id'));
            }

            return idList;
        } ,

        // 获取已选择项 nameList
        nameList: function(){
            var i           = 0;
            var cur         = null;
            var nameList    = [];

            for (; i < this._itemSetForSelectedData.length; ++i)
            {
                cur = G(this._itemSetForSelectedData.get()[i]);

                nameList.push(cur.get().textContent);
            }

            return nameList;
        } ,

        // 获取已选择项 id & name 的键值对集合
        idAndName: function(){
            var i       = 0;
            var cur     = null;
            var res     = {};

            for (; i < this._itemSetForSelectedData.length; ++i)
            {
                cur = G(this._itemSetForSelectedData.get()[i]);

                res[cur.data('id')] = cur.get().textContent;
            }

            return res;
        } ,

        // 返回当前容器元素
        con: function(){
            return this._selectCondition.get();
        } ,

        // 判断是否无任何初始化数据
        empty: function(){
            var k = null;

            for (k in this._data)
            {
                return false;
            }

            return true;
        } ,

        // 判断是否有初始化选择数据
        exists: function(){
            return Boolean(this.idList().length);
        } ,

        _eventForSelectedData: function(item){
            item = G(item);

            var self = this;

            item.loginEvent('click' , function(){
                var tar = G(this);
                var id  = tar.data('id');
                var isMultiple = self._smSwitch.data('isMultiple');

                self.unfocus(id);

                // 回调函数
                if (isMultiple != 'y' && G.getValType(self._clickFn) === 'Function') {
                    self._clickFn.call(self , id);
                }
            } , true , false);
        } ,

        _clickEventForSelectData: function(event){
            var tar     = G(event.currentTarget);
            var id      = tar.data('id');
            var isFocus = tar.data('isFocus');
            var isMultiple = this._smSwitch.data('isMultiple');

            if (this._mode === 'multiple') {
                if (isFocus === 'y') {
                    this.unfocus(id);
                } else {
                    this.focus(id);
                }
            } else {
                // 只允许单选
                this.exclude(id);
            }

            // 回调函数
            if (isMultiple != 'y' && G.getValType(this._clickFn) === 'Function') {
                this._clickFn.call(this , id);
            }
        } ,

        _moreEvent: function(event){
            var tar         = G(event.currentTarget);
            var isSpread    = tar.data('isSpread');

            if (isSpread == 'y') {
                this.shrink();
            } else {
                this.spread();
            }
        } ,

        _modeSwitchEvent: function(){
            var tar         = G(event.currentTarget);
            var isMultiple  = tar.data('isMultiple');

            if (isMultiple == 'y') {
                this.single();
            } else {
                this.multiple();
            }
        } ,

        _clearEvent: function(event){
            this.clear();
        } ,

        _defineEventForOne: function(){
            this._itemSetForAll.loginEvent('click' , this._clickEventForSelectData.bind(this) , true , false);
        } ,

        _defineEventForTwo: function(){
            this._itemSetForHotWithAll.loginEvent('click' , this._clickEventForSelectData.bind(this) , true , false);
            this._itemSet.loginEvent('click' , this._clickEventForSelectData.bind(this) , true , false);
        } ,

        _defineEvent: function(){
            this._more.loginEvent('click'       , this._moreEvent.bind(this)        , true , false);
            this._smSwitch.loginEvent('click'   , this._modeSwitchEvent.bind(this)  , true , false);
            this._confirm.loginEvent('click'    , this._confirmEvent.bind(this)     , true , false);
            this._cancel.loginEvent('click'     , this._cancelEvent.bind(this)      , true , false);
            this._clear.loginEvent('click'      , this._clearEvent.bind(this)       , true , false);

            // 差别事件
            this._type === 'one' ? this._defineEventForOne() : this._defineEventForTwo();
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

    return SelectCondition;
})();