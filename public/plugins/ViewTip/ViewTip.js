var ViewTip = (function(){

	"use strict";
	
	var q = new G.queue();

	function ViewTip(ele , opt){
		var thisRange = [undefined , null , window];

		if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== ViewTip) {
			return new ViewTip(ele , opt);
		}

		if (!G.isDOMEle(ele)) {
			throw new TypeError('只持支DOM元素！');
		}

		this._minTopVal		  = 6;
		this._defaultOpt = {
			text: '未传入显示的文本数据' ,
			carTime: 200 ,
			topDistance: this._minTopVal ,
			opacity: 0 ,
			borderRadius: 3 ,
			height: 26 ,
			paddingLR: 10 ,
			fontColor: 'white' ,
			backgroundColor: 'rgba(60 , 60 , 60 , 0.8)' ,
			isShowTriangle: false , 
			isBindEvent: true , 
			showTipDuration: 1500 ,
			coordType: 'win' , // 坐标类型（doc|win），文档坐标，还是视口坐标
		};

		if (opt === undefined) {
			var opt = this._defaultOpt;
		}

		this._coordTypeRange = ['doc' , 'win'];
		
		// 当前操作元素
		this._curOprEle		  = G(ele);
		this._text			  = G.getValType(opt['text']) !== 'String'				? this._defaultOpt['text']				: opt['text'];
		this._carTime		  = G.getValType(opt['carTime']) !== 'Number'			? this._defaultOpt['carTime']			: opt['carTime'];
		this._topDistance     = G.getValType(opt['topDistance']) !== 'Number'		? this._defaultOpt['topDistance']		: Math.max(this._minTopVal , opt['topDistance']);
		this._divH			  = G.getValType(opt['height']) !== 'Number'			? this._defaultOpt['height']			: opt['height'];
		this._paddingLR		  = G.getValType(opt['paddingLR']) !== 'Number'			? this._defaultOpt['paddingLR']			: opt['paddingLR'];
		this._borderRadius	  = G.getValType(opt['borderRadius']) !== 'Number'		? this._defaultOpt['borderRadius']		: opt['borderRadius'];
		this._opacity		  = G.getValType(opt['opacity']) !== 'Number'			? this._defaultOpt['opacity']			: opt['opacity'];
		this._fontColor		  = G.getValType(opt['fontColor']) !== 'String'	        ? this._defaultOpt['fontColor']			: opt['fontColor'];
		this._backgroundColor = G.getValType(opt['backgroundColor']) !== 'String'	? this._defaultOpt['backgroundColor']	: opt['backgroundColor'];
		this._isShowTriangle  = G.getValType(opt['isShowTriangle']) !== 'Boolean'	? this._defaultOpt['isShowTriangle']	: opt['isShowTriangle'];
		this._isBindEvent     = G.getValType(opt['isBindEvent']) !== 'Boolean'		? this._defaultOpt['isBindEvent']		: opt['isBindEvent'];
		this._showTipDuration = G.getValType(opt['showTipDuration']) !== 'Number'	? this._defaultOpt['showTipDuration']	: opt['showTipDuration'];
		this._coordType 	  = !G.contain(opt['coordType'] , this._coordTypeRange)	? this._defaultOpt['coordType']			: opt['coordType'];

		this._run();
	}

	ViewTip.prototype = {
		version: '1.0' ,
		cTime: '2016-10-30 23:44:00' ,
		constructor: ViewTip ,
		
		_initHTML: function(){
			
			this._divClassName		= 'view_tip_single';
			this._explainClassName  = 'view_tip_explain';
			this._triangleClassName = 'view_tip_triangle';
			
			if (G('.' + this._divClassName , document.body).length === 0) {
				var div      = document.createElement('div');
				var text     = document.createElement('div');
				var triangle = document.createElement('div');

				div.appendChild(text);
				div.appendChild(triangle);
				document.body.appendChild(div);

				q.clear();

				q.push({
					ele: div ,
					isExists: false
				});
				
				this._div	   = G(div);
				this._explain  = G(text);
				this._triangle = G(triangle);
				this._setFixedStyle();

			} else {
				q.first()['isExists'] = true;

				this._div      = G('.' + this._divClassName , document.body).first();
				this._explain  = G(this._div.get()).childFind({tagName: 'div' , className: this._explainClassName});
				this._triangle = G(this._div.get()).childFind({tagName: 'div' , className: this._triangleClassName});
			}
		} ,

		_setFixedStyle: function(){
			this._div.addClass(this._divClassName);
			this._explain.addClass(this._explainClassName);
			this._triangle.addClass(this._triangleClassName);

			this._div.css({
				paddingLeft:   this._paddingLR + 'px' ,
				paddingRight:  this._paddingLR + 'px' , 
				height: this._divH + 'px' , 
				lineHeight: this._divH + 'px' ,
				minWidth: this._divH + 'px' , 
				position: 'fixed' ,
				zoom: '1' ,
				color: this._fontColor ,
				backgroundColor: this._backgroundColor ,
				textAlign: 'center' ,
				verticalAlign: 'middle' ,
				opacity: this._opacity ,
				fontSize: '12' + 'px' ,
				zIndex: 100 ,
				borderRadius: this._borderRadius + 'px' ,
			});

			this._explain.css({
				width: '100%' ,
				height: '100%'
			});

			this._triangle.css({
				width: '0px' ,
				height: '0px ' ,
				borderTop: this._minTopVal + 'px solid ' + this._backgroundColor ,
				borderLeft: this._minTopVal + 'px solid transparent' ,
				borderBottom: 'none' ,
				position: 'absolute' ,
				bottom: '-' + this._minTopVal + 'px' ,
				left: '50%' ,
				marginLeft: '-' + this._minTopVal + 'px'
			});

			if (!this._isShowTriangle) {
				this._triangle.addClass('hide');
			}

		} ,

		_init: function(){
			if (this._coordType === 'doc') {
                // 优缺点：一旦元素内部出现滚动条（非文档滚动条，是元素内滚动条），会出现值偏大的问题!
                this._eleL            = this._curOprEle.getDocOffsetVal('left');
                this._eleT            = this._curOprEle.getDocOffsetVal('top');
			} else {
                this._eleL            = this._curOprEle.getWindowOffsetVal('left');
                this._eleT            = this._curOprEle.getWindowOffsetVal('top');
			}
			
			// console.log(this._eleL , this._eleT);
			// console.log(this._eleL1 , this._eleT1);

			this._eleW			  = this._curOprEle.getTW();
			this._divW			= 0;
			this._divL			= 0;
			this._divT			= 0;

			this._explain.get().textContent = this._text;

			this._divW			= this._div.getEleW('border-box');
			this._divL			= this._eleL + this._eleW / 2 - this._divW / 2;
			this._divT			= this._eleT - this._divH - (q.first()['isExists'] ? this._topDistance : this._topDistance * 0.4);
			this._sTopVal	    = this._divT;
			this._eTopVal       = this._eleT - this._divH - this._topDistance;

			// console.log(this._sTopVal , this._eTopVal);

			this._sOpacityVal   = this._opacity;
			this._eOpacityVal   = 1;
			
			this._div.css({
				left: this._divL + 'px' ,
				top: this._divT + 'px' ,
			});

			this._curSpanTopVal   = this._divT;
			this._curSpanOpacity  = this._opacity;
		} ,

		show: function(){	
			var curTopVal	  = null;
			var curOpacityVal = null;
			var self		  = this;

			if (!this._isBindEvent) {
				window.clearTimeout(this._showTipTimer);
			}

			this._initHTML();
			this._init();

			curTopVal	   = this._div.getCoordVal('top');
			curOpacityVal  = parseFloat(this._div.getStyleVal('opacity'));

			this._div.animate({
				carTime: this._carTime , 
				json: [
						{
							attr: 'top' ,
							sVal: curTopVal ,
							eVal: this._eTopVal
						} ,
						{
							attr: 'opacity' ,
							sVal: curOpacityVal ,
							eVal: this._eOpacityVal
						} ,
					  ] , 
				fn: function(){
					if (!self._isBindEvent) {
						self._showTipTimer = window.setTimeout(self.hide.bind(self) , self._showTipDuration);
					}		
				}
			});
		} , 
		
		hide: function(){
			var self		   = this;
			var curTopVal	   = this._div.getCoordVal('top');
			var curOpacityVal  = parseFloat(this._div.getStyleVal('opacity'));

			this._div.animate({
				carTime: this._carTime , 
				json: [
						{
							attr: 'opacity' ,
							sVal: curOpacityVal ,
							eVal: this._sOpacityVal
						} ,
					  ] ,
				 fn: function(){

					if (G(document.body).checkChild(self._div.get())) {
						document.body.removeChild(self._div.get());
					}

					q.clear();
				 }
			});
		} , 
		
		setText: function(text){
			this._text = text;
		} ,

		_defineEvent: function(){
			if (this._isBindEvent) {
				this._curOprEle.loginEvent('mouseover' , this.show.bind(this) , true , false);
				this._curOprEle.loginEvent('mouseout'  , this.hide.bind(this)  , true , false);
			}
		} ,

		_run: function(){
			this._defineEvent();
		}
	};

	return ViewTip;
})();