/*
 * ***************************************
 * 品牌选择系列事件
 * author 陈学龙 2017-06-26
 * ***************************************
 */
var Brand = (function(){
    'use strict';

    function Brand(con , opt){
        var thisRange = [window , null , undefined];

        if (G.contain(this , thisRange) || (!G.contain(this , thisRange) && this.constructor !== Brand)) {
            return new Brand(con , opt);
        }

        this._defaultOpt = {
            /**
             * 核心字段对照表
             */
            field: {
                id: 'id' , 		// 品牌ID
                name: 'name' , 		// 品牌名称
                letter: 'letter' , 	// 品牌首字母
                isCommon: 'is_common' , // 是否是通用品牌，支持的值 y | n
                ico:'ico' 			// 图片 URL
            } ,
            // 选择模式： multiple | single（单选/多选）
            mode: 'multiple' ,
            pluginUrl: '' ,     // brand 插件目录
            url: '' ,           // 请求品牌的 URL
            clickFn: null ,     // 项点击时触发
            focusFn: null ,     //  品牌选中后回调
            unfocusFn: null ,   // 品牌未选中后回调
            singleFn: null ,    // 单选时回调
            multipleFn: null ,  // 多选时回调
            spreadFn: null ,    // 展开时回调
            shrinkFn: null ,    // 收缩时回调
            confirmFn: null ,   // 确认时回调
            cancelFn: null ,    // 取消时回调
            clearFn: null ,     // 清除状态时回调
            initializeFn: null       // 初始化完成后回调
        };

        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

        this._modeRange = ['single' , 'multiple'];

        this._con		    = G(con);
        this._field         = G.getValType(opt['field']) === 'Object' 		? opt['field'] 		: this._defaultOpt['field'];
        this._mode 	        = G.contain(opt['mode'] , this._modeRange) ? opt['mode'] 	: this._defaultOpt['mode'];
        this._pluginUrl 	= G.getValType(opt['pluginUrl']) === 'String' 	? opt['pluginUrl'] 	: this._defaultOpt['pluginUrl'];
        this._url 	        = G.getValType(opt['url']) === 'String' 		? opt['url'] 	: this._defaultOpt['url'];
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

    Brand.prototype = {
        constructor: Brand ,

        _initStaticHTML: function(){
            // 元素
            this._brand                 = G('.brand' , this._con.get()).first();
            this._selectLetter	        = G('.select-letter'  		, this._brand.get()).first();
            this._selectBrand	        = G('.select-brand'  		, this._brand.get()).first();
            this.__brandList		        = G('.brand-list'     		, this._selectBrand.get()).first();
            this._selectedBrand		    = G('.selected-brand' 	, this._brand.get()).first();
            this._listForSelectedBrand  = G('.list' 	        , this._selectedBrand.get()).first();

            // 参数
            this._selectedIDList = this._brand.data('idList');
            this._selectedIDList = G.getValType(this._selectedIDList) === 'Null' ? [] : G.jsonDecode(this._selectedIDList);

            // 选中项的类名
            this._focusItem = 'focus-item';

            var html    = [];
            var i       = 0;
            var cur     = null;
            var span    = null;
            var isFocus = null;

            // 填充字母
            for (i = 0; i < this._letter.length; ++i)
            {
                cur = this._letter[i];
                span = document.createElement('span');
                span = G(span);
                span.addClass(['letter' , 'character' , cur]);
                span.get().textContent = cur;

                this._selectLetter.get().appendChild(span.get());
            }

            // 填充品牌
            for (i = 0; i < this.__brand.length; ++i)
            {
                cur = this.__brand[i];
                isFocus = G.contain(cur[this._field['id']] , this._selectedIDList);
                isFocus = isFocus ? 'y' : 'n';

                html.push('<div class="item ' + (isFocus === 'y' ? this._focusItem : '') + '" data-id="' + cur['id'] + '" data-isFocus="' + isFocus + '" title="' + cur[this._field['name']] + '" data-name="' + cur[this._field['name']] + '" data-isCommon="' + cur[this._field['isCommon']] + '" data-letter="' + cur[this._field[this._field['letter']]] + '">');
                html.push('<div class="in">');
                html.push('<!-- 品牌图片展示 -->');
                html.push('<div class="picture">');
                html.push('<img src="' + cur[this._field['ico']] + '" class="pic">');
                html.push('</div>');
                html.push('<!-- 品牌文本展示 -->');
                html.push('<div class="explain">' + cur[this._field['name']] + '</div>');
                html.push('<!-- 选中的品牌表现 -->');
                html.push('<div class="focus"><img src="' + this._pluginUrl + 'images/selected_status.png" class="pic"></div>');
                html.push('</div>');
                html.push('</div>');
            }

            this.__brandList.get().innerHTML = html.join('');

            // 填充已选择的品牌 + 定义事件
            for (i = 0; i < this._selectedIDList.length; ++i)
            {
                cur = this._selectedIDList[i];

                this.addToSelectedBrand(cur);
            }
        } ,

        _initStaticArgs: function(){
            // 元素
            this._letterSet         = G('.letter'               , this._selectLetter.get());
            this._allBrand	    	= G('.all-brand'	  		, this._selectLetter.get()).first();
            this._commonBrand		= G('.common-brand'   		, this._selectLetter.get()).first();
            this._characterSet      = G('.character'   		    , this._selectLetter.get());
            this._itemSetForSelectBrand = G('.item'   		    , this.__brandList.get());
            this._function          = G('.function' 		    , this._brand.get()).first();
            this._more		        = G('.more' 		        , this._function.get()).first();
            this._smSwitch		    = G('.sm-switch' 		    , this._function.get()).first();
            this._decide            = G('.decide' 	            , this._brand.get()).first();
            this._confirm		    = G('.confirm' 	            , this._decide.get()).first();
            this._cancel		    = G('.cancel' 	            , this._decide.get()).first();

            // 记录初始的容器高度
            this._originH = this._selectBrand.getEleH('content-box');

            // 参数
            this._focusLetter = 'focus';
            this._multipleClass = 'multiple-for-get-brand';

            // 多选时选择的 id（临时记录）
            this._idListForMultiple = {};
        } ,

        // 初始化静态参数
        _initStatic: function(){
            if (this._mode === 'single') {
                this._smSwitch.addClass('hide');
            }
        } ,

        _initDynamicHTML: function(){

        } ,

        // 初始化参数
        _initDynamicArgs: function(){
            this._itemSetForSelectedBrand = G('.item' , this._listForSelectedBrand.get());
        } ,

        _initDynamic: function(){

        } ,

        // 通过 id 找到对应的品牌记录
        getBrand: function(id){
            var i = 0;
            var cur = null;

            for (; i < this.__brand.length; ++i)
            {
                cur = this.__brand[i];

                if (cur[this._field['id']] == id) {
                    return cur;
                }
            }

            throw new Error("不存在当前 id 对应品牌数据");
        } ,

        // 已选择品牌定义事件
        _eventForSelectedBrand: function(item){
            item = G(item);

            item.loginEvent('click' , this._clickEventForSelectedBrand.bind(this) , true , false);
        } ,

        // 已选择的品牌
        addToSelectedBrand: function(id){
            var brand = this.getBrand(id);

            var span = document.createElement('span');
                span = G(span);
                span.addClass('item');
                span.data('id' , id);
                span.get().textContent = brand[this._field['name']];

            this._listForSelectedBrand.get().appendChild(span.get());

            // 动态参数重新初始化
            this._initDynamicArgs();
            this._initDynamic();

            this._eventForSelectedBrand(span.get());
        } ,

        // 从已选择品牌中删除
        removeFromSelectedBrand: function(id){
            var i   = 0;
            var cur = null;

            for (; i < this._itemSetForSelectedBrand.length; ++i)
            {
                cur = G(this._itemSetForSelectedBrand.get()[i]);

                if (cur.data('id') == id) {
                    // 移除，已选择列表中绝对不会出现重复 id 的项，所以可以放心退出循环
                    cur.get().parentNode.removeChild(cur.get());
                    break;
                }
            }

            // 重新初始化参数
            this._initDynamicArgs();
            this._initDynamic();
        } ,

        // 多选时，设置/添加 临时选择的 id 状态
        _setIDForMultiple: function(id , isFocus){
            this._idListForMultiple[id] = isFocus;
        } ,

        // 给定 id 设置为选中项
        focus: function(id){
            var i   = 0;
            var cur = null;
            var isMultiple = this._smSwitch.data('isMultiple');

            for (; i < this._itemSetForSelectBrand.length; ++i)
            {
                cur = G(this._itemSetForSelectBrand.get()[i]);

                if (cur.data('id') == id) {
                    // 选中当前品牌
                    cur.addClass(this._focusItem);
                    cur.data('isFocus' , 'y');

                    // 添加到已选择的品牌
                    this.addToSelectedBrand(id);
                    break;
                }
            }

            if (isMultiple != 'y' && G.getValType(this._focusFn) === 'Function') {
                this._focusFn.call(this , id);
            }
        } ,

        // 取消选中
        unfocus: function(id){
            var i   = 0;
            var cur = null;
            var isMultiple = this._smSwitch.data('isMultiple');

            for (; i < this._itemSetForSelectBrand.length; ++i)
            {
                cur = G(this._itemSetForSelectBrand.get()[i]);

                if (cur.data('id') == id) {
                    // 选中当前品牌
                    cur.removeClass(this._focusItem);
                    cur.data('isFocus' , 'n');

                    // 从已选择的品牌删除
                    this.removeFromSelectedBrand(id);
                    break;
                }
            }

            // 回调函数
            if (isMultiple != 'y' && G.getValType(this._unfocusFn) === 'Function') {
                this._unfocusFn.call(this , id);
            }
        } ,

        // 品牌单选（排他）
        exclude: function(id){
            var self    = this;
            var i       = 0;
            var cur     = null;
            var isFocus = null;
            var isMultiple = this._smSwitch.data('isMultiple');

            var focus = function(item){
                item = G(item);

                item.addClass(self._focusItem);
                item.data('isFocus' , 'y');

                // 添加到已选择的品牌
                self.addToSelectedBrand(item.data('id'));
            };

            var unfocus = function(item){
                item = G(item);

                item.removeClass(self._focusItem);
                item.data('isFocus' , 'n');

                // 从已选择的品牌删除
                self.removeFromSelectedBrand(item.data('id'));
            };

            for (; i < this._itemSetForSelectBrand.length; ++i)
            {
                cur = G(this._itemSetForSelectBrand.get()[i]);

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
                    if (G.getValType(this._focusFn) === 'Function') {
                        this._focusFn.call(this , id);
                    }
                }
            }
        } ,

        // 品牌悬浮
        _mouseOverForAllBrand: function(event){
            var tar = G(event.currentTarget);
            var i   = 0;
            var cur = null;

            tar.highlight(this._focusLetter , this._letterSet.get());

            for (; i < this._itemSetForSelectBrand.length; ++i)
            {
                cur = G(this._itemSetForSelectBrand.get()[i]);
                cur.removeClass('hide');
            }
        } ,

        // 常用品牌悬浮
        _mouseOverForCommonBrand: function(event){
            var tar = G(event.currentTarget);
            var i   = 0;
            var cur = null;

            tar.highlight(this._focusLetter , this._letterSet.get());

            for (; i < this._itemSetForSelectBrand.length; ++i)
            {
                cur = G(this._itemSetForSelectBrand.get()[i]);

                if (cur.data('isCommon') == 1) {
                    cur.removeClass('hide');
                } else {
                    cur.addClass('hide');
                }
            }
        } ,

        // 首字母悬浮
        _mouseOverForCharacter: function(event){
            var tar     = G(event.currentTarget);
            var i       = 0;
            var cur     = null;
            var letter  = tar.get().textContent;

            tar.highlight(this._focusLetter , this._letterSet.get());

            for (; i < this._itemSetForSelectBrand.length; ++i)
            {
                cur = G(this._itemSetForSelectBrand.get()[i]);

                if (cur.data('letter') == letter) {
                    cur.removeClass('hide');
                } else {
                    cur.addClass('hide');
                }
            }
        } ,

        // 选择品牌点击事件
        _clickEventForSelectBrand: function(event){
            var tar     = G(event.currentTarget);
            var id      = tar.data('id');
            var isMultiple = this._smSwitch.data('isMultiple');

            if (this._mode === 'multiple') {
                var isFocus = tar.data('isFocus');

                if (isFocus === 'y') {
                    this.unfocus(id);
                } else {
                    this.focus(id);
                }
            } else {
                this.exclude(id);
            }

            // 回调函数
            if (isMultiple != 'y' && G.getValType(this._clickFn) === 'Function') {
                this._clickFn.call(this , id);
            }
        } ,

        // 已选择品牌点击事件
        _clickEventForSelectedBrand: function(event){
            var tar = G(event.currentTarget);
            var id  = tar.data('id');
            var isMultiple = this._smSwitch.data('isMultiple');

            this.unfocus(id);

            // 回调函数
            if (isMultiple != 'y' && G.getValType(this._clickFn) === 'Function') {
                this._clickFn.call(this , id);
            }
        } ,

        // 选中提供项，不选中其他项（单选）
        exclusiveBrand: function(item){
            var itemSet 	= G('.item' , this.__brandList.get());
            var i			= 0;
            var cur			= null;

            for (; i < itemSet.length; ++i)
            {
                cur = G(itemSet.get()[i]);

                if (cur.get() !== item) {
                    this.brandItemNotFocus(cur.get());
                    this._selectedBrandItemDelete(cur.get().getAttribute('data-brandId'));
                }
            }
        } ,

        // 切换面板
        _moreEvent: function(event){
            var target = G(event.currentTarget);
            var isSpread = target.data('isSpread');

            if (isSpread === 'y') {
                this.shrink();
            } else {
                this.spread();
            }
        } ,

        // 展开所有品牌
        spread: function(){
            var html = '-&nbsp;收缩';

            this._more.data('isSpread' , 'y');
            this._more.get().innerHTML = html;

            this.__brandList.css({
                maxHeight: 'none'
            });

            if (G.getValType(this._spreadFn) === 'Function') {
                this._spreadFn.call(this);
            }
        } ,

        // 收缩品牌列表
        shrink: function(btn){
            var html = '+&nbsp;展开';

            this._more.data('isSpread' , 'n');
            this._more.get().innerHTML = html;

            this.__brandList.css({
                maxHeight: this._originH + 'px'
            });

            if (G.getValType(this._shrinkFn) === 'Function') {
                this._shrinkFn.call(this);
            }
        } ,

        // 单选/多选 切换事件
        _modeSwitchEvent: function(event){
            var tar             = G(event.currentTarget);
            var isMultiple      = tar.data('isMultiple');

            // 执行
            if (isMultiple === 'y') {
                this.single();
            } else {
                this.multiple();
            }
        } ,

        // 显示 decide
        showDecide: function(){
            this._decide.removeClass('hide');
        } ,

        // 隐藏 decide
        hideDecide: function(){
            this._decide.addClass('hide');
        } ,

        // 隐藏已选择部分
        hideSelected: function(){
            this._selectedBrand.addClass('hide');
        } ,

        // 显示已选择部分
        showSelected: function(){
            this._selectedBrand.removeClass('hide');
        } ,

        // 多选
        multiple: function(){
            var text = "单选";

            this._smSwitch.get().innerHTML = text;
            this._smSwitch.data('isMultiple' , 'y');

            this._brand.addClass(this._multipleClass);

            // 展开选项
            this.spread();

            // 显示已选择部分
            this.showSelected();

            // 显示选择栏
            this.showDecide();

            this.save();

            // 调用回调
            if (G.getValType(this._multipleFn) === 'Function') {
                this._multipleFn.call(this);
            }
        } ,

        // 单选
        single: function(isReset){
            isReset = G.getValType(isReset) === 'Boolean' ? isReset : true;

            var text = "多选";

			// 这一步一定要先执行！否则会触发 focusFn or unfocusFn ...
            isReset ? this._reset() : null;

            this._smSwitch.get().innerHTML = text;
            this._smSwitch.data('isMultiple' , 'n');

            this._brand.removeClass(this._multipleClass);

            // 收缩选项
            this.shrink();

            // 隐藏已选择部分
            this.hideSelected();

            // 隐藏选择栏
            this.hideDecide();

            // 调用回调
            if (G.getValType(this._singleFn) === 'Function') {
                this._singleFn.call(this);
            }
        } ,

        // 确定操作
        _confirmEvent: function(){
            // 设置单选状态
            this.single(false);

            if (G.getValType(this._confirmFn) === 'Function') {
                this._confirmFn.call(this);
            }
        } ,

        // 保存初始状态
        save: function(){
            // 重置列表
            this._idListForMultiple = {};

            var i   = 0;
            var cur = null;

            for (; i < this._itemSetForSelectBrand.length; ++i)
            {
                cur = G(this._itemSetForSelectBrand.get()[i]);
                this._idListForMultiple[cur.data('id')] = cur.data('isFocus');
            }
        } ,

        // 重置多选时临时设置的状态
        _reset: function(){
            var k   = null;
            var v   = null;

            for (k in this._idListForMultiple)
            {
                v = this._idListForMultiple[k];

                if (v === 'y') {
                    this.focus(k);
                } else {
                    this.unfocus(k);
                }
            }
        } ,

        // 取消操作
        _cancelEvent: function(){
            // 设置单选状态
            this.single();

            if (G.getValType(this._cancelFn) === 'Function') {
                this._cancelFn.call(this);
            } else {
                console.log("未提供点击取消后的回调函数");
            }
        } ,

        // 清除现有状态（重置）
        clear: function(){
            var i       = 0;
            var cur     = null;
            var idList  = this.idList();

            for (; i < idList.length; ++i)
            {
               cur = idList[i];
               this.unfocus(cur);
            }

            if (G.getValType(this._clearFn) === 'Function') {
                this._clearFn(this);
            }
        } ,

        // 获取选中的 id 集合
        idList: function(){
            var idList  = [];
            var i       = 0;
            var cur     = null;

            for (; i < this._itemSetForSelectedBrand.length; ++i)
            {
                cur = G(this._itemSetForSelectedBrand.get()[i]);

                idList.push(cur.data('id'));
            }

            return idList;
        } ,

        nameList: function(){
            var nameList  = [];
            var i       = 0;
            var cur     = null;

            for (; i < this._itemSetForSelectedBrand.length; ++i)
            {
                cur = G(this._itemSetForSelectedBrand.get()[i]);

                nameList.push(cur.get().textContent);
            }

            return nameList;
        } ,

        // 已选择条件的 id & name 的键值对
        idAndName: function(){
            var idList = this.idList();
            var data   = {};
            var i      = 0;
            var cur    = null;

            for (; i < idList.length; ++i)
            {
                cur = idList[i];

                data[cur] = this.getBrand(cur)[this._field['name']];
            }

            return data;
        } ,

        // 品牌操作
        _defineEvent: function(){
            // 所有品牌
            this._allBrand.loginEvent('mouseover' 		, this._mouseOverForAllBrand.bind(this) 		, true , false);
            // 常用品牌
            this._commonBrand.loginEvent('mouseover' 	, this._mouseOverForCommonBrand.bind(this) 	, true , false);
            // 字母 A、B、C、D...
            this._characterSet.loginEvent('mouseover' 	    , this._mouseOverForCharacter.bind(this) 		, true , false);
            // 品牌点击事件
            this._itemSetForSelectBrand.loginEvent('click'  , this._clickEventForSelectBrand.bind(this) , true , false);
            // 显示更多
            this._more.loginEvent('click'            , this._moreEvent.bind(this)                  , true , false);
            // 多选
            this._smSwitch.loginEvent('click'            , this._modeSwitchEvent.bind(this)                  , true , false);
            // 确定
            this._confirm.loginEvent('click' , this._confirmEvent.bind(this) , true , false);
            // 取消
            this._cancel.loginEvent('click' , this._cancelEvent.bind(this) , true , false);
        } ,

        // 获取字母集合
        _getLetter: function(){
            var letter = [];

            var i = 0;
            var cur = null;

            for (; i < this.__brand.length; ++i)
            {
                cur = this.__brand[i];

                if (!G.contain(cur[this._field['letter']] , letter)) {
                    letter.push(cur[this._field['letter']]);
                }
            }

            return letter;
        } ,

        // 获取容器
        con: function(){
            return this._brand.get();
        } ,

        // 判断是否无任何初始化数据
        empty: function(){
            return !Boolean(this.__brand.length);
        } ,

        // 检查是否有选中项
        exists: function(){
            return Boolean(this.idList().length);
        } ,

        // 获取品牌数据
        _brandEvent: function(callback){
            var self = this;

            G.ajax({
                url: this._url ,
                method: 'get' ,
                success: function(json){
                    var data = G.jsonDecode(json);

                    if (data['status'] === 'failed') {
                        console.log('获取品牌出错：' , data['msg']);
                    } else {
                        // 品牌数据
                        self.__brand     = data['msg'];
                        // 字母数据
                        self._letter    = self._getLetter();

                        callback();
                    }
                } ,
                error: G.ajaxError
            });
        } ,

        _run: function(){
            var self = this;

            this._brandEvent(function(){
                self._initStaticHTML();
                self._initStaticArgs();
                self._initStatic();
                self._initDynamicHTML();
                self._initDynamicArgs();
                self._initDynamic();
                self._defineEvent();

                // 如果是单个函数则直接执行
                if (G.getValType(self._initializeFn) === 'Function') {
                    self._initializeFn.call(self);
                }

                // 如果是一系列函数，则逐个执行
                if (G.getValType(self._initializeFn) === 'Array') {
                    var i   = 0;
                    var cur = null;

                    for (; i < self._initializeFn.length; ++i)
                    {
                        cur = self._initializeFn[i];

                        if (G.getValType(cur) === 'Function') {
                            cur.call(self);
                        }
                    }
                }
            });
        }
    };

    return Brand;
})();