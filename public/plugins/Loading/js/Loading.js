/*
 * author 陈学龙 2016-12-12 17:03:00
 * 兼容性：IE 10及以上或同等级别其他浏览器
 */
var Loading = (function(){
	'use strict';

	function Loading(ele , opt){
		var thisRange = [undefined , null , window];

		if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== Loading) {
			return new Loading(ele , opt);
		}

		if (!G.isDOMEle(ele)) {
			throw new TypeError('参数 1 类型错误');
		}

		this._defaultOpt = {
			carTime: 200 ,
			// Loading.png 图片存放路径
			pluginUrl: '' ,
			className: 'Loading' ,
			initStatus: 'show' , // 支持 'show' , 'hide'
			type: 'html' , // 类型：image（直接一张图片方式） 、 html（元素方式）
			style: 1 , // 具体风格
			json: {} ,  // 图片设置
			cJson: {} // 容器样式
		};

        this._initStatusRange = ['show' , 'hide'];
        this._typeRange       = ['image' , 'html'];

		this._con	  		= G(ele);
		this._carTime 		= G.getValType(opt['carTime'])	 !== 'Number'			 			? this._defaultOpt['carTime']	   : opt['carTime'];
		this._pluginUrl	  	= G.getValType(opt['pluginUrl'])		 !== 'String'			 	? this._defaultOpt['pluginUrl']         : opt['pluginUrl'];
        this._className	  	= G.getValType(opt['className'])		 !== 'String'			 	? this._defaultOpt['className']         : opt['className'];
		this._initStatus 	= !G.contain(opt['initStatus'] , this._initStatusRange) 			? this._defaultOpt['initStatus']  : opt['initStatus'];
		this._type 			= !G.contain(opt['type'] , this._typeRange) 						? this._defaultOpt['type']  : opt['type'];
		this._style 		= G.getValType(opt['style']) !== 'Number' 							? this._defaultOpt['style']  : opt['style'];
		this._json 			= G.getValType(opt['json']) !== 'Object' 							? this._defaultOpt['json']  : opt['json'];
        this._cJson	  		= G.getValType(opt['cJson'])		 !== 'Object'					? this._defaultOpt['cJson']         : opt['cJson'];

		this._run();
	}

	Loading.prototype = {
		author: '陈学龙' , 
		cTime: '2016/12/12 17:53:00' , 
		constructor: Loading , 

		_initStaticHTML: function(){
			var div = document.createElement('div');
				div.className = (this._className === 'Loading' ? this._className : this._className + ' Loading') + ' hide';

            var html = '';

				html += '<!-- 背景颜色 -->';
				html += "<div class='background'></div>";
				html += '<!-- 图片加载动画 -->';
				html += "<img src='" + this._pluginUrl + "/Images/style-" + this._style + ".png' class='pic hide' />";
				html += '<!-- 线条加载动画 -->';
				html += '<div class="html-style-1 line-scale hide">';
				html += '	<div></div>';
				html += '	<div></div>';
				html += '	<div></div>';
				html += '	<div></div>';
				html += '	<div></div>';
				html += '</div>';

            div.innerHTML = html;

			this._con.get().appendChild(div);
		} , 
		
		_initDynamicHTML: function(){
		
		} , 
		
		_initStaticArgs: function(){
			this._loading 	 = G('.' + this._className 	, this._con.get()).first();
            this._background = G('.background' 	, this._loading.get()).first();
			this._pic 		 = G('.pic' 		, this._loading.get()).first();
			
			this._startOpacity = 0;
			this._endOpacity = 0.7;


		} ,

		_initStatic: function(){
            // 图片容器设置
            this._loading.css(this._cJson);

            this._load = this._type === 'image' ? this._pic : G('.html-style-' + this._style , this._con.get()).first();

            // 根据类型展现不同的内容
            this._load.css(this._json)
            this._load.removeClass('hide');

            // 高宽（居中的时候有用）
			this._loadW = this._load.getEleW('border-box');
			this._loadH = this._load.getEleH('border-box');

            // 初始化状态设置
            if (this._initStatus === 'show') {
                this.show();
            } else {
                this.hide();
            }
		} ,

		// 获取容器元素
		getContainer: function(){
			return this._loading.get();
		} ,

		// 获取内部加载元素
		getLoad: function(){
			return this._load.get();
		} ,

        /**
		 * 让 加载元素 居中
         */
		center: function(type , w , h){
			var typeRange = ['horizontal' , 'vertical' , 'all'];

			if (!G.contain(type , typeRange)) {
				throw new Error('参数 2 错误');
			}

			w = G.getValType(w) === 'Undefined' ? this._loading.getEleW('content-box')  : parseFloat(w);
			h = G.getValType(h) === 'Undefined' ? this._loading.getEleH('content-box')  : parseFloat(h);

			var css = {};

			if (type === 'horizontal') {
				css['left'] = w / 2;
			} else if (type === 'vertical') {
				css['top'] = h / 2;
			} else {
				css['left'] = w / 2;
				css['top']  = h / 2;
			}

			this._load.css(css);
		} ,
		
		_initDynamicArgs: function(){
			
		} ,

		_initDynamic: function(){

		} ,

		show: function(){
			// console.log(this._background.get() , this._background.getStyleVal('opacity'));
			var curOpacity = parseFloat(this._background.getStyleVal('opacity'));
			var endOpacity = this._endOpacity;
			var self = this;
			
			this._loading.removeClass('hide');

			// console.log(this._background.getStyleVal('opacity') , curOpacity , endOpacity , this._background);

			this._background.animate({
				carTime: this._carTime , 
				json: [
						{
							attr: 'opacity' , 
							sVal: curOpacity , 
							eVal: endOpacity
						}
					  ]
			});
		} , 

		hide: function(){
			var curOpacity = parseFloat(this._background.getStyleVal('opacity'));
			var endOpacity = this._startOpacity;
			var self = this;
			
			this._background.animate({
				carTime: this._carTime , 
				json: [
						{
							attr: 'opacity' , 
							sVal: curOpacity , 
							eVal: endOpacity
						}
					  ] , 
				fn: function(){
					self._loading.addClass('hide');	  
				}
			});
		} ,

		// 动态设置图片样式
		cssForImage: function(json){
			this._load.css(json);
		} ,

		// 动态设置图片容器样式
		cssForContainer: function(json){
			this._loading.css(json);
		} ,

		// 定义事件
        _defineEvent: function(){

		} ,
		
		_run: function(){
			this._initStaticHTML();
			this._initDynamicHTML();
			this._initStaticArgs();
			this._initStatic();
			this._initDynamicArgs();
			this._initDynamic();

			this._defineEvent();
		}
	};

	return Loading;
})();