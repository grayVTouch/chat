/*
	* author cxl 2016-09-16

	* 图片轮播
	* 支持 多开 拖拽 滚动 下标点击 前后按键点击 定时轮播 切换 ， 普通下标 或者 图片缩略图下标
	* 前提： 必须设置容器元素宽度！
	* @param Element con           容器元素
	* @param Object  opt           设置选项
		  opt = {
			carTime: 200 ,           // 动画过度时间
			carDuration: 5000 ,      // 定时器时间
			idxType: 'idx' ,         // 索引类型，支持 idx   | pic-idx | none 三种
			idxPos: 'inset' ,        // 索引位置，支持 inset | outset 两种
			placementType: 'horizontal' ,       // // 索引摆放类型（horizontal|vertical）
			placementPos: 'bottom' ,        	// 索引摆放位置（top|right|bottom|left）取决于 placementType！如果 placementType = horizontal；则允许的值有 top|bottom；如果 placementType = vertical，则允许得值有 left|right
			enableOprFunc: true ,    // 是否启用 上一张 | 下一张 功能
			enableScrollFunc: true , // 是否启用滚动功能
			enableDragFunc: true ,   // 是否开启拖拽功能
			enableTimerFunc: true    // 是否开启定时轮播功能
		  };
	* @return undefined
*/
var PicPlayTouch = (function(){
	'use strict';

	function PicPlayTouch(con , opt){
		var thisRange = [window , null , undefined];

		if (G.contain(this , thisRange) || (!G.contain(this , thisRange) && this.constructor !== PicPlayTouch)) {
			return new PicPlayTouch(con , opt);
		}

		this._defaultOpt = {
			carTime: 200 ,           // 动画过度时间
			carDuration: 5000 ,      // 定时器时间
			idxType: 'idx' ,         // 索引类型
			idxPos: 'inset' ,        // 索引容器位置 (inset | outset)
			placementType: 'horizontal' ,      	// 索引摆放类型（horizontal|vertical）
			placementPos: '' 		,      		// 索引摆放位置（top|right|bottom|left）取决于 placementType！如果 placementType = horizontal；则允许的值有 top|bottom；如果 placementType = vertical，则允许得值有 left|right
			isLinkTo: true ,         // 默认点击图片会进行跳转
			enableOprFunc: true ,    // 是否启用 上一张 | 下一张 功能
			enableScrollFunc: true , // 是否启用滚动功能
			enableDragFunc: true ,   // 是否开启拖拽功能
			enableTimerFunc: true    // 是否开启定时轮播功能
		};

		if (G.getValType(opt) === "Undefined") {
			opt = this._defaultOpt;
		}

		this._idxTypeRange					= ['idx' , 'pic-idx' , 'none'];
		this._placementTypeRange			= ['horizontal' , 'vertical'];
		this._horizontalPlacementPosRange	= ['top' , 'bottom'];
		this._verticalPlacementPosRange		= ['left' , 'right'];
		this._defaultHorizontalPlacementPos = 'bottom';
		this._defaultVerticalPlacementPos 	= 'right';
		this._idxPosRange					= ['outset' , 'inset'];

		this._con				= G(con);

		this._carTime			= G.getValType(opt['carTime']) !== 'Number'			? this._defaultOpt['carTime']		: opt['carTime'];
		this._carDuration		= G.getValType(opt['carDuration']) !== 'Number'		? this._defaultOpt['carDuration']	: opt['carDuration'];
		this._idxType			= !G.contain(opt['idxType'] , this._idxTypeRange)   ? this._defaultOpt['idxType']		: opt['idxType'];
		this._idxPos			= !G.contain(opt['idxPos'] , this._idxPosRange)     ? this._defaultOpt['idxPos']		: opt['idxPos'];
		this._placementType		= !G.contain(opt['placementType'] , this._placementTypeRange)     ? this._defaultOpt['placementType']		: opt['placementType'];
		this._placementPos		= this._placementType === 'horizontal' ? (G.contain(opt['placementPos'] , this._horizontalPlacementPosRange) ? opt['placementPos'] : this._defaultHorizontalPlacementPos) : (G.contain(opt['placementPos'] , this._verticalPlacementPosRange) ? opt['placementPos'] : this._defaultVerticalPlacementPos);
		this._enableOprFunc		= G.getValType(opt['enableOprFunc']) !== 'Boolean'  ? this._defaultOpt['enableOprFunc'] : opt['enableOprFunc'];
		this._enableScrollFunc  = G.getValType(opt['enableScrollFunc']) !== 'Boolean'  ? this._defaultOpt['enableScrollFunc'] : opt['enableScrollFunc'];
		this._enableDragFunc	= G.getValType(opt['enableDragFunc']) !== 'Boolean'  ? this._defaultOpt['enableDragFunc'] : opt['enableDragFunc'];
		this._enableTimerFunc	= G.getValType(opt['enableTimerFunc']) !== 'Boolean'  ? this._defaultOpt['enableTimerFunc'] : opt['enableTimerFunc'];
		this._isLinkTo			= G.getValType(opt['isLinkTo']) !== 'Boolean'			? this._defaultOpt['isLinkTo'] : opt['isLinkTo'];

        this._curIdx			= 1;
        this._fIdx				= 'focus-idx';
        this._fPicIdx			= 'focus-pic-idx';

		this._run();
	}

	PicPlayTouch.prototype = {
		version: '1.0' ,

		cTime: '2016-09-16 10:20:00' ,

		constructor: PicPlayTouch ,

		// 定义静态变量
		_initStaticArgs: function(){
            this._picPlayCon		= G('.pic-play' , this._con.get()).first();
            this._imageCon			= G('.images' , this._picPlayCon.get()).first();
            this._picZoneCon		= G('.pic-zone' , this._picPlayCon.get()).first();
            this._link				= G('.pic-link' , this._picPlayCon.get());
            this._pic				= G('.pic' , this._picZoneCon.get());
            this._prevBtn			= G('.prev' , this._picPlayCon.get()).first();
            this._nextBtn			= G('.next' , this._picPlayCon.get()).first();
            this._idxCon			= G('.idx-zone' , this._picPlayCon.get()).first();
            this._picIdxCon			= G('.pic-idx-zone' , this._picPlayCon.get()).first();
		} ,

		_initDynamicArgs: function(){

		} ,

		_initStaticHTML: function(){
            /**
			 * 充盈数字索引（无论索引类型为哪一种，都必须充盈数字索引）
             */
			if (this._idxType === 'idx') {

				this._picIdxCon.addClass('hide');
				this._idxCon.removeClass('hide');

			} else if (this._idxType === 'pic-idx') {

				this._idxCon.addClass('hide');
				this._picIdxCon.removeClass('hide');

			} else if (this._idxType === 'none') {

				this._idxCon.addClass('hide');
				this._picIdxCon.addClass('hide');
				this._idxType = 'idx';
			}

			var idxHTML = '';
			var picIdxHTML = '';

			for (var i = 1; i <= this._pic.length - 2; ++i)
				{
					if (i === this._curIdx) {
						idxHTML    += " <div class='idx " + this._fIdx + "' data-idx='" + i + "'></div> ";
						picIdxHTML += " <div class='pic-idx " + this._fPicIdx + "' data-idx='" + i + "'>  ";
						picIdxHTML += "   <div class='bg'></div>  ";
						picIdxHTML += "   <img src='" + this._pic.get()[i].src + "' class='pic' />  ";
						picIdxHTML += " </div> ";
					} else {
						idxHTML	   += " <div class='idx' data-idx='" + i + "'></div> ";
						picIdxHTML += " <div class='pic-idx' data-idx='" + i + "'>  ";
						picIdxHTML += "   <div class='bg'></div>  ";
						picIdxHTML += "   <img src='" + this._pic.get()[i].src + "' class='pic' />  ";
						picIdxHTML += " </div> ";
					}
				}

			this._idxCon.get().innerHTML	 = idxHTML;
			this._picIdxCon.get().innerHTML  = picIdxHTML;
		} ,

		_initDynamicHTML: function(){

		} ,

		_initStatic: function(){

		} ,

		_initDynamic: function(){
            var i = 0;
            /**
             * 容器 w + h
             */
            this._maxW				 = Math.max(0 , this._con.getEleW('content-box'));
            this._maxH				 = Math.max(0 , this._con.getEleH('content-box'));

            this._unit				 = 'px';
            this._realPicCount		 = this._pic.length - 2;
            this._idx				 = G('.idx' , this._idxCon.get());
            this._picIdx			 = G('.pic-idx' , this._picIdxCon.get());

            if (this._idxType === 'pic-idx') {
                // 图片索引

                this._index = this._picIdxCon;

                // idxType = pic-idx时，单个图片索引的宽高
                if (this._placementType === 'horizontal') {
                    // 水平摆放索引
                    this._picIdxRVal		 = G(this._picIdx.get()[0]).getCoordVal('marginRight');
                    this._extraPicW			 = this._picIdxRVal * (this._pic.length - 3);

                    // 索引 h / w 比例
                    this._picSHRatio		 = 0.3;

                    this._picSW				 = Math.max(0 , Math.floor((this._maxW - this._extraPicW) / this._realPicCount));
                    this._picSH				 = Math.max(0 , Math.floor(this._picSW * this._picSHRatio));

                    // 索引摆放类型带来的变化
                    this._picZoneCon.addClass('pic-zone-horizontal');
                    this._picZoneCon.addClass('pic-zone-horizontal-'+ this._placementPos);
                    this._picIdxCon.addClass('pic-idx-zone-horizontal');
                    this._picIdxCon.addClass('pic-idx-zone-horizontal-' + this._placementPos);

                    this._indexW = this._maxW;
                    this._indexH = this._picSH;
                } else {
                    // 垂直摆放索引
                    this._picIdxBVal		 = G(this._picIdx.get()[0]).getCoordVal('marginBottom');
                    this._extraPicW			 = this._picIdxBVal * (this._pic.length - 3);

                    // 索引 w / h 比率
                    this._picSWRatio		 = 2;

                    this._picSH				 = Math.max(0 , Math.floor((this._maxH - this._extraPicW) / this._realPicCount));
                    this._picSW				 = Math.max(0 , Math.floor(this._picSH * this._picSWRatio));

                    // 索引摆放类型带来的变化
                    this._picZoneCon.addClass('pic-zone-vertical');
                    this._picZoneCon.addClass('pic-zone-vertical-' + this._placementPos);
                    this._picIdxCon.addClass('pic-idx-zone-vertical');
                    this._picIdxCon.addClass('pic-idx-zone-vertical-' + this._placementPos);

                    this._indexW = this._picSW;
                    this._indexH = this._picSH;
                }
            } else if (this._idxType === 'idx') {
                // 普通索引
                this._index = this._idxCon;

                if (this._placementType === 'horizontal') {
                    this._picZoneCon.addClass('pic-zone-horizontal');
                    this._picZoneCon.addClass('pic-zone-horizontal-'+ this._placementPos);
                    this._idxCon.addClass('idx-zone-horizontal');
                    this._idxCon.addClass('idx-zone-horizontal-' + this._placementPos);
                } else {
                    this._picZoneCon.addClass('pic-zone-vertical');
                    this._picZoneCon.addClass('pic-zone-vertical-' + this._placementPos);
                    this._idxCon.addClass('idx-zone-vertical');
                    this._idxCon.addClass('idx-zone-vertical-' + this._placementPos);
                }
            } else {
                // 无索引的时候默认普通索引
                this._index = this._idxCon;

                if (this._placementType === 'horizontal') {
                    this._picZoneCon.addClass('pic-zone-horizontal');
                    this._picZoneCon.addClass('pic-zone-horizontal-'+ this._placementPos);
                    this._idxCon.addClass('idx-zone-horizontal');
                    this._idxCon.addClass('idx-zone-horizontal-' + this._placementPos);
                } else {
                    this._picZoneCon.addClass('pic-zone-vertical');
                    this._picZoneCon.addClass('pic-zone-vertical-' + this._placementPos);
                    this._idxCon.addClass('idx-zone-vertical');
                    this._idxCon.addClass('idx-zone-vertical-' + this._placementPos);
                }
            }

            if (this._idxPos === 'outset') {
                // 容器外
                this._picW = this._maxW;
                this._picH = this._maxH;
            } else {
                if (this._idxType === 'pic-idx') {
                    // 容器内
                    if (this._placementType === 'horizontal') {
                        // 水平摆放索引
                        this._picW = this._maxW;
                        this._picH = Math.max( 0 , this._maxH - this._indexH);
                    } else {
                        // 垂直摆放
                        this._picW = Math.max( 0 , this._maxW - this._indexW);
                        this._picH = this._maxH;
                    }
                } else {
                    // 容器内
                    if (this._placementType === 'horizontal') {
                        // 水平摆放索引
                        this._picW = this._maxW;
                        this._picH = this._maxH;
                    } else {
                        // 垂直摆放
                        this._picW = this._maxW;
                        this._picH = this._maxH;
                    }
                }
            }

            /**
             * 计算大图容器的相关参数
             */
            this._picZoneConW = this._placementType === 'horizontal' ? this._picW * this._pic.length : this._picW;
            this._picZoneConH = this._placementType === 'horizontal' ? this._picH : this._picH * this._pic.length;

            /**
             * 水平切换的时候
             */
            this._minLeftVal		 = -((this._pic.length - 1) * this._picW);
            this._maxLeftVal		 = 0;

            /**
             * 垂直切换的时候
             */
            this._minTopVal			= -((this._pic.length - 1) * this._picH);
            this._maxTopVal			= 0;

            this._horizontalPos 	= {};
            this._verticalPos 		= {};

            /**
             * 设置大图容器宽高 + 位置
             */
            var imageConCssJson = {
                width:  this._picW + this._unit ,
                height: this._picH + this._unit
            };

            var picZoneCssJson = {
                width:  this._picZoneConW + this._unit ,
                height: this._picZoneConH + this._unit
            };

            var indexCssJson = {
                width: this._indexW + this._unit ,
                height: (this._placementType === 'horizontal' ? this._indexH : this._indexH * this._realPicCount) + this._unit
            };

            if (this._placementType === 'horizontal') {
                picZoneCssJson['left'] = -this._picW + this._unit;
                indexCssJson['left']   = '0px';

                if (this._placementPos === 'top') {
                    imageConCssJson['marginTop'] = this._indexH + this._unit;
                    indexCssJson['top'] = '0px';
                } else {
                    imageConCssJson['marginBottom'] = this._indexH + this._unit;
                    indexCssJson['bottom'] = '0px';
                }

                this._animateAttr = 'left';
                this._picAmount   = this._picW;
                this._minVal 	  = this._minLeftVal;
                this._maxVal	  = this._maxLeftVal;
                this._pos         = this._horizontalPos;

            } else {
                picZoneCssJson['top'] = -this._picH + this._unit;
                indexCssJson['top']   = '0px';

                if (this._placementPos === 'left') {
                    imageConCssJson['marginLeft'] = this._indexW + this._unit;
                    indexCssJson['left'] = '0px';
                } else {
                    imageConCssJson['marginRight'] = this._indexW + this._unit;
                    indexCssJson['right'] = '0px';
                }

                this._animateAttr = 'top';
                this._picAmount   = this._picH;
                this._minVal 	  = this._minTopVal;
                this._maxVal	  = this._maxTopVal;
                this._pos         = this._verticalPos;
            }

            // 设置图片容器
            this._imageCon.css(imageConCssJson);
            // 图片轮播容器
            this._picZoneCon.css(picZoneCssJson);

            // 设置索引容器
            if (this._idxType === 'pic-idx') {
                this._index.css(indexCssJson);
            }

            /**
             * 跳转链接集合
             */
            this._linkHrefList = [];

            // 保存图片链接
            for (i = 1; i < this._link.length - 2; ++i)
            {
                this._linkHrefList.push(this._link.get()[i].href);
            }

            /**
             * 移动端 或 enableOprFunc = false
             * 是否展示 上一页 | 下一页功能
             */
            var browser = G.getBrowser();

            if (browser === 'mobile' || !this._enableOprFunc) {
                this._prevBtn.addClass('hide');
                this._nextBtn.addClass('hide');
            }

            /**
             * 索引的位置带来的变化
             */
            if (this._idxPos === 'outset') {
                this._picIdxCon.removeClass('pic-idx-zone-inset');
                this._picIdxCon.addClass('pic-idx-zone-outset');
                this._idxCon.removeClass('idx-zone-inset');
                this._idxCon.addClass('idx-zone-outset');
            } else {
                this._picIdxCon.addClass('pic-idx-zone-inset');
                this._picIdxCon.removeClass('pic-idx-zone-outset');
                this._idxCon.addClass('idx-zone-inset');
                this._idxCon.removeClass('idx-zone-outset');
            }

            // 是否能够拖拽移动
            this._canMove = false;

            // horizontal 拖拽时，拖拽超过长度允许切换
            this._horizontalMRange 	= this._picW * 0.4;

            // vertical 拖拽时，拖拽超过长度允许切换
            this._verticalMRange 	= this._picW * 0.4;

            // 拖拽超过多少时间执行范围判断
            this._checkTime = 200;

            // 定时器
            this._con.timer = null;
            // 是否已经停止动画（动画过度是否完成）
            this._con.isCarStop = false;

            // 设置小图
            for (i = 0; i < this._picIdx.length; ++i)
            {
                G(this._picIdx.get()[i]).css({
                    width: this._picSW + this._unit ,
                    height: this._picSH  + this._unit
                });
            }

            this._btnW				 = Math.max(0 , this._prevBtn.getEleW('border-box'));
            this._btnH				 = this._picH;

            // 初始大图图片直属父系容器（link）
            for (i = 0; i < this._link.length; ++i)
            {
                G(this._link.get()[i]).css({
                    width: this._picW + this._unit ,
                    height: this._picH + this._unit
                });
            }

            // 设置按钮
            this._prevBtn.css({
                height: this._btnH + this._unit ,
                lineHeight: this._btnH + this._unit ,
                // left: -this._btnW + this._unit
            });

            this._nextBtn.css({
                height: this._btnH + this._unit ,
                lineHeight: this._btnH + this._unit ,
                // right: -this._btnW + this._unit
            });

            /**
             * 初始化位置信息 和 下标对应关系
             * 水平时的位置对应关系
             */
            // this._horizontalPos = {};

            for (i = 1; i <= this._pic.length - 2; ++i)
            {
                this._horizontalPos[i] = (-this._picW) * i;
            }

            /**
             * 初始化位置信息 和 下标对应关系
             * 垂直时的位置对应关系
             */
            // this._verticalPos = {};

            for (i = 1; i <= this._pic.length - 2; ++i)
            {
                this._verticalPos[i] = (-this._picH) * i;
            }

            // console.log(this._pos);

            /**
             * 完整的pos列表
             * 数据测试用
             */
            this._fullPos = [0];

            for (i = 1; i <= this._pic.length - 1; ++i)
            {
                this._fullPos.push(-(this._picW * i));
            }
		} ,

		_init: function(){

		} , 

		_getLinkHref: function(){
			return this._linkHrefList[this._getFIdx()];
		} ,  

		// 根据位置 获取对应的 下标
		_getIdx: function(){
			var curVal = Math.floor(this._picZoneCon.getCoordVal(this._animateAttr));

			for (var key in this._pos)
			{
				if (this._pos[key] === curVal) {
					return parseFloat(key);
				}
			}

			// console.log(curVal , this._pos);

			throw new Error('超出受支持的范围');
		} ,
		// 根据类名 获取当前显示的 下标
		_getFIdx: function(){
			if (this._idxType === 'pic-idx') {
				for (var i = 0; i < this._picIdx.length; ++i)
					{
						if (G(this._picIdx.get()[i]).hasClass(this._fPicIdx)) {
							return Math.floor(parseFloat(this._picIdx.get()[i].getAttribute('data-idx')));
						}
					}
			} else if (this._idxType === 'idx') {
				for (var i = 0; i < this._idx.length; ++i)
					{
						if (G(this._idx.get()[i]).hasClass(this._fIdx)) {
							return Math.floor(parseFloat(this._idx.get()[i].getAttribute('data-idx')));
						}
					}
			} else {
				throw new RangeError('不支持的索引类型！');
			}
		} , 

		_getPos: function(idx){
			return this._pos[idx];
		} ,

		_animate: function(SmallJsObj , curVal , endVal){
			var self = this;

			// console.log(curVal , endVal);

			SmallJsObj.animate({
				carTime: this._carTime ,
				json: [
						{
							attr: this._animateAttr ,
							sVal: curVal ,
							eVal: endVal
						}
					  ],
				fn: function(){
					var curVal 			= Math.floor(self._picZoneCon.getCoordVal(self._animateAttr));
					var idx		   		= false;
					var picZoneCssJson 	= {};

					// console.log(curVal , self._minVal , self._maxVal);

					if (curVal === self._minVal) {
						idx = 1;

                        picZoneCssJson[self._animateAttr] = self._pos[idx] + self._unit;

                        self._picZoneCon.css(picZoneCssJson);
					} else if (curVal === self._maxVal) {

						idx = self._idx.length;

                        picZoneCssJson[self._animateAttr] = self._pos[idx] + self._unit;

						self._picZoneCon.css(picZoneCssJson);

					} else {

						idx = self._getIdx();

					}

					idx -= 1;
					self._curIdx = idx + 1;

					if (self._idxType === 'pic-idx') {

						G(self._picIdx.get()[idx]).highlight(self._fPicIdx , self._picIdx.get());

					} else if (self._idxType === 'idx') {

						G(self._idx.get()[idx]).highlight(self._fIdx , self._idx.get());

					} else {

						throw new RangeError('不支持的索引类型！');

					}

                    /**
					 * 是否支持自动轮播
                     */
					if (self._enableTimerFunc) {
						self._timeEvent();
					}
				 }
			});
		} ,

		_prevEvent: function(){
		  if (this._picZoneCon.animateObj &&  !this._picZoneCon.animateObj.isStop) {
			return ;
		  }

		  this._clearTimeEvent();



		  var curVal = this._picZoneCon.getCoordVal(this._animateAttr);
		  var endVal = curVal + this._picAmount;
		  
		  this._animate(this._picZoneCon , curVal , endVal);
		} ,

		_nextEvent: function(){
			if (this._picZoneCon.animateObj &&  !this._picZoneCon.animateObj.isStop) {
				return ;
			}

			this._clearTimeEvent();

			var curVal = this._picZoneCon.getCoordVal(this._animateAttr);
			var endVal = curVal - this._picAmount;

			this._animate(this._picZoneCon , curVal , endVal);
		} ,

		_wheelEvent: function(event){
			var e = event || window.event;

			e.preventDefault();

			if (e.deltaY >= 0) {

				this._nextEvent();

			} else {

				this._prevEvent();

			}
		} ,

		_idxEvent: function(event){
			var e			= event || window.event;
			var tarEle		= e.currentTarget;
			var self		= this
			var idx			= false;
			var curVal	= 0;
			var endVal  = 0;

			if (this._idxType === 'pic-idx') {
				idx = tarEle.getAttribute('data-idx');
			}
			
			if (this._idxType === 'idx') {
				idx = tarEle.getAttribute('data-idx');
			}

			this._clearTimeEvent();

            curVal = this._picZoneCon.getCoordVal(this._animateAttr);
            endVal = this._getPos(idx);

			this._animate(this._picZoneCon , curVal , endVal);
		} ,

		_mouseDownEvent: function(event){
			this._clearTimeEvent();

			var e			= event || window.event;
			var browser		= G.getBrowser();
			this._sTime		= new Date().getTime();
			this._canMove	= true;

			if (this._placementType === 'horizontal') {
                this._sox		= browser === 'mobile' ? e.touches[0].clientX : e.clientX;
			} else {
                this._soy		= browser === 'mobile' ? e.touches[0].clientY : e.clientY;
			}

			this._sVal		= this._picZoneCon.getCoordVal(this._animateAttr);
		} ,

		_mouseMoveEvent: function(event){
			if (this._canMove) {
				var e			= event || window.event;

				e.preventDefault();

				var browser		 = G.getBrowser();

                if (this._placementType === 'horizontal') {
                    this._eox		= browser === 'mobile' ? e.touches[0].clientX : e.clientX;
                    this._ox		 = this._eox - this._sox;
                    this._endVal 	= Math.max(this._minVal , Math.min(0 , this._sVal + this._ox));
                } else {
                    this._eoy		= browser === 'mobile' ? e.touches[0].clientY : e.clientY;
                    this._oy		= this._eoy - this._soy;
                    this._endVal 	= Math.max(this._minVal , Math.min(0 , this._sVal + this._oy));
                }

                var picZoneCssJson = {};
                	picZoneCssJson[this._animateAttr] = this._endVal + this._unit

				// console.log(picZoneCssJson);

				this._picZoneCon.css(picZoneCssJson);
			}
		} ,

		_mouseUpEvent: function(){
			var self = this;

			if (this._canMove === false) {
				return false;
			}

			this._canMove	= false;
			this._eTime		= new Date().getTime();
			var curVal  	= this._picZoneCon.getCoordVal(this._animateAttr);
			var duration	= this._eTime - this._sTime;
			var initVal 	= this._getPos(this._getFIdx());
			var endVal  	= false;

			if (duration >= this._checkTime) {
                if (this._placementType === 'horizontal') {
                    var ox = Math.abs(this._ox);

                    if (ox > this._horizontalMRange) {
                        if (this._ox > 0) {

                            endVal = initVal + this._picW;

                            this._animate(this._picZoneCon , curVal , endVal);

                        } else if (this._ox < 0) {

                            endVal = initVal - this._picW;

                            this._animate(this._picZoneCon , curVal , endVal);

                        } else {
                            if (this.isLinkTo) {
                                window.location.href = this._getLinkHref();
                            }
                        }
                    } else {
                        var endVal = initVal;

                        this._animate(this._picZoneCon , curVal , endVal);
                    }
				} else {
                    var oy = Math.abs(this._oy);

                    if (oy > this._verticalMRange) {
                        if (this._oy > 0) {

                            endVal = initVal + this._picH;

                            this._animate(this._picZoneCon , curVal , endVal);

                        } else if (this._ox < 0) {

                            endVal = initVal - this._picH;

                            this._animate(this._picZoneCon , curVal , endVal);

                        } else {
                            if (this.isLinkTo) {
                                window.location.href = this._getLinkHref();
                            }
                        }
                    } else {
                        var endVal = initVal;

                        this._animate(this._picZoneCon , curVal , endVal);
                    }
				}
			} else {
				if (this._placementType === 'horizontal') {
                    if (curVal > initVal) {

                        endVal = initVal + this._picW;

                        this._animate(this._picZoneCon , curVal , endVal);

                    } else if (curVal < initVal) {

                        endVal = initVal - this._picW;

                        this._animate(this._picZoneCon , curVal , endVal);

                    } else {
                        if (this.isLinkTo) {
                            window.location.href = this._getLinkHref();
                        }
                    }
				} else {
                    if (curVal > initVal) {

                        endVal = initVal + this._picH;

                        this._animate(this._picZoneCon , curVal , endVal);

                    } else if (curVal < initVal) {

                        endVal = initVal - this._picH;

                        this._animate(this._picZoneCon , curVal , endVal);

                    } else {
                        if (this.isLinkTo) {
                            window.location.href = this._getLinkHref();
                        }
                    }
				}
			}
		} ,

        /**
		 * 清除定时器
         */
		_clearTimeEvent: function(){
			this._con.isCarStop = true;
			window.clearTimeout(this._con.timer);
		} ,

        /**
		 * 定义定时器
         */
		_timeEvent: function(){
			var self = this;
			var fn   = this._timeEvent.bind(this);

			this._con.isCarStop = false;
			this._con.timer     = window.setTimeout(function(){
				self._nextEvent();

				if (self._con.isCarStop === false) {
					self._con.timer = window.setTimeout(fn , self._carDuration);
				}
			} , this._carDuration);
		} ,

		// 调整事件
        _resizeEvent: function(){
			this._clearTimeEvent();
			this._initDynamic();

            if (this._enableTimerFunc) {
                this._timeEvent();
            }
		} ,

		_defineEvent: function(){
			var browser = G.getBrowser();
			// PC端事件（由于移动端若是增加下面这些事件，反而使用户体验急剧下降，故而自动移除）
			if (browser !== 'mobile') {
				// 上一张 | 下一张功能
				if (this._enableOprFunc) {
					this._prevBtn.loginEvent('click' , this._prevEvent.bind(this) , false , false);
					this._nextBtn.loginEvent('click' , this._nextEvent.bind(this) , false , false);
				}

				// 鼠标滚动 上一张 | 下一张 事件
				if (this._enableScrollFunc) {
					this._imageCon.loginEvent('wheel' , this._wheelEvent.bind(this) , false , false);
				}
			}

			// 拖拽功能
			if (browser === 'mobile' || this._enableDragFunc) {
				var mousedown = browser === 'mobile' ? 'touchstart' : 'mousedown';
				var mousemove = browser === 'mobile' ? 'touchmove'  : 'mousemove';
				var mouseup   = browser === 'mobile' ? 'touchend'   : 'mouseup';

				this._picZoneCon.loginEvent('click' , function(event){
					var e = event || window.event;

					if (!e.defaultPrevented) {
						e.preventDefault();
					}

					if (e.cancelable) {
						e.stopPropagation();
						e.stopImmediatePropagation();
					}

					return false;
				} , false , false);

				this._picZoneCon.loginEvent(mousedown , this._mouseDownEvent.bind(this) , false , false);

				G(window).loginEvent(mousemove , this._mouseMoveEvent.bind(this) , true , false);
				G(window).loginEvent(mouseup , this._mouseUpEvent.bind(this) , true , false);

				// 阻止图片拖拽
				var imgList = G('img' , this._con.get());
				for (var i = 0; i < imgList.length; ++i)
					{
						G(imgList.get()[i]).loginEvent('dragstart' , function(event){
							var e = event || window.event;

							if (!e.defaultPrevented) {
								e.preventDefault();
							}

							if (e.cancelable) {
								e.stopPropagation();
								e.stopImmediatePropagation();
							}

							return false;
						} , false , false);
					}

				// 阻止链接拖拽
				for (var i = 0; i < this._link.length; ++i)
					{
						G(this._link.get()[i]).loginEvent('dragstart' , function(event){
							var e = event || window.event;

							if (!e.defaultPrevented) {
								e.preventDefault();
							}

							if (e.cancelable) {
								e.stopPropagation();
								e.stopImmediatePropagation();
							}

							return false;
						} , false , false);
					}
			}

			// 索引事件
			if (this._idxType === 'pic-idx') {
				for (var i = 0; i < this._picIdx.length; ++i)
					{
						G(this._picIdx.get()[i]).loginEvent('click' , this._idxEvent.bind(this) , false , false);
					}
			}
			
			if (this._idxType === 'idx') {
				for (var i = 0; i < this._idx.length; ++i)
					{
						G(this._idx.get()[i]).loginEvent('click' , this._idxEvent.bind(this) , false , false);
					}
			}

			// 动态调整
			G(window).loginEvent('resize' , this._resizeEvent.bind(this) , true , false);
		} ,

		_run: function(){
			this._initStaticArgs();
			this._initStaticHTML();
			this._initDynamicArgs();
			this._initStatic();
			this._initDynamic();
			this._defineEvent();

			if (this._enableOprFunc) {
				this._prevBtn.removeClass('hide');
				this._nextBtn.removeClass('hide');
			}

			if (this._enableTimerFunc) {
				this._clearTimeEvent();
				this._timeEvent();
			}
		} ,
	};
	return PicPlayTouch;
})();