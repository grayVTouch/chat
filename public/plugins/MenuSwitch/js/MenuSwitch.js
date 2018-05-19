/*
 * 导航菜单切换
 * author 陈学龙 2017-09-18 14:29:00
 */
var MenuSwitch = (function(){
	'use strict';

	function MenuSwitch(con , opt){
        var thisRange = [undefined , null , window];

        if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== MenuSwitch) {
            return new MenuSwitch(con , opt);
        }

        this._defaultOpt = {
            // 默认展示的界面
            identifier: '' ,
            // 项点击后回调
			clickFn: null ,
            // 切换后回调
            switchFn: null
        };

        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

        this._con = G(con);

        // 参数
		this._identifier    = !G.isValidVal(opt['identifier'])                  ? this._defaultOpt['identifier']    : opt['identifier'];
		this._clickFn       = G.getValType(opt['clickFn']) !== 'Function'       ? this._defaultOpt['clickFn']       : opt['clickFn'];
		this._switchFn      = G.getValType(opt['switchFn']) !== 'Function'      ? this._defaultOpt['switchFn']      : opt['switchFn'];

        this._run();
	}

	MenuSwitch.prototype = {
		constructor: MenuSwitch ,

        _initStaticHTML: function(){

        } ,

        _initStaticArgs: function(){
            this._switch    = G('.menu-switch'	, this._con.get()).first();
            this._itemSet	= G('.item'         , this._switch.get());
        } ,

        _initStatic: function(){
            // 针对未设置 identifier 的元素设置 identifier!
            // 确保导航菜单项能够通过给定一个标识符被唯一找到！！
            var i           = 0;
            var cur         = null;
            var identifier  = null;
            var first       = null;

            for (; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (!G.isValidVal(cur.data('identifier'))) {
                    identifier  = G.randomArr(100 , 'mixed').join('');

                    cur.data('identifier' , identifier);
                }

                if (first === null) {
                    first = cur.data('identifier');
                }
            }

            // 初始化选中项
            // 如果提供了设置项，则设置上去
            // 如果未提供设置项，则默认切换到第一个菜单项上
            G.isValidVal(this._identifier) ? this.switch(this._identifier) : this.switch(first);
        } ,

        _initDynamicHTML: function(){

        } ,

        _initDynamicArgs: function(){

        } ,

        _initDynamic: function(){

        } ,


        // 切换到指定 identifier
        switch: function(identifier){
        	var item = this.item(identifier);
        	    item = G(item);

        	item.highlight('cur' , this._itemSet.get());

        	if (G.getValType(this._switchFn) === 'Function') {
        	    this._switchFn.call(this , identifier);
            }
		} ,

        // 获取指定 identifier 对应的项
        item: function(identifier){
            var i   = 0;
            var cur = null;

            for (; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.data('identifier') == identifier) {
                    return cur.get();
                }
            }

            throw new Error("未找到当前项");
        } ,

        // 获取当前项
        current: function(){
            var i   = 0;
            var cur = null;

            for (; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.hasClass('cur')) {
                    return cur.get();
                }
            }

            throw new Error("未找到当前项");
        } ,

        // 获取当前项的 identifier
        identifier: function(){
            var item = G(this.current());

            return item.data('identifier');
        } ,

		// 导航标签点击事件
        _clickEvent: function(event){
        	var tar         = G(event.currentTarget);
        	var identifier  = tar.data('identifier');

        	this.switch(identifier);

            if (G.getValType(this._clickFn) === 'Function') {
                this._clickFn.call(this , identifier);
            }
		} ,


        _defineEvent: function(){
			// 标签切换事件
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
		}
	};

	return MenuSwitch;
})();