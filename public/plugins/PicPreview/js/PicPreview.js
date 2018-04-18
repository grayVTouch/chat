/*
 ***********************************
 * Author 陈学龙 2016-11-16 21:57:00
 * 更新：2018-01-25 11:57:00
 *
 * 大图预览
 ***********************************
 */
var PicPreview = (function(){
	'use strict';

	function PicPreview(con , opt){
		var thisRange = [window , undefined , null];

		if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== PicPreview) {
			return new PicPreview(con , opt);
		}
		
		this._defaultOpt = {
			index: 1 ,					// 初始显示列表中第几张图片，从 1 开始
			carTime: 300 ,				// 动画时间
			scaleRatio: 0.08 ,			// 单位缩放百分比 8%
			tipTime: 1200 ,				// 提示最后一张 || 第一张 驻留时间
			controlWRatio: 0.6 ,        // 控制区最多占屏宽度
			imageCount: 6 ,				// 控制区显示多少张完整的图片 ,最少 5 个！！
			extraW: 0 ,					// 控制区除了完整图片外在额外多出的部分宽度，不建议使用（存在 bug）
			enableOprFunc: true ,		// 是否启用上一张 || 下一张功能键
			enableScorllFunc: true ,	// 是否启用滚动上一张 || 下一张 功能键
			enableScaleFunc: true,      // 是否启用缩放功能
            enableMoveFunc: true,       // 是否启用预览图移动功能
			showFn: null ,				// 容器显示后回调
			hideFn: null ,				// 容器隐藏后回调
			focusScale: false ,			// 是否允许焦点缩放
            action: 'show' ,			// 初始化动作：show | hide
		};

		if (G.getValType(opt) === 'Undefined') {
			opt = this._defaultOpt;
		}
		
		this._actionRange = ['show' , 'hide'];
		
		this._con = G(con);

        this._index			= G.getValType(opt['index'])  !== 'Number'  		? this._defaultOpt['index']  		: opt['index'];
		this._carTime		= G.getValType(opt['carTime']) !== 'Number'  		? this._defaultOpt['carTime'] 		: opt['carTime'];
        this._scaleRatio 	= G.getValType(opt['scaleRatio']) !== 'Number' 	? this._defaultOpt['scaleRatio'] 	: opt['scaleRatio'];
        this._tipTime 		= G.getValType(opt['tipTime']) !== 'Number' 		? this._defaultOpt['tipTime'] 		: opt['tipTime'];
        this._controlWRatio	= G.getValType(opt['controlWRatio']) !== 'Number'  	? this._defaultOpt['controlWRatio'] : opt['controlWRatio'];
		this._imageCount	= G.getValType(opt['imageCount']) !== 'Number'  	? this._defaultOpt['imageCount'] 	: opt['imageCount'];
        this._extraW		= G.getValType(opt['extraW'])  !== 'Number'  		? this._defaultOpt['extraW']  		: opt['extraW'];
        this._enableOprFunc = G.getValType(opt['enableOprFunc']) !== 'Boolean' 	? this._defaultOpt['enableOprFunc'] : opt['enableOprFunc'];
        this._enableScorllFunc 	= G.getValType(opt['enableScorllFunc']) !== 'Boolean' 	? this._defaultOpt['enableScorllFunc'] 	: opt['enableScorllFunc'];
        this._enableScaleFunc 	= G.getValType(opt['enableScaleFunc']) !== 'Boolean' 	? this._defaultOpt['enableScaleFunc'] 	: opt['enableScaleFunc'];
        this._enableMoveFunc 	= G.getValType(opt['enableMoveFunc']) !== 'Boolean' 	? this._defaultOpt['enableMoveFunc'] 	: opt['enableMoveFunc'];
        this._focusScale 	= G.getValType(opt['focusScale']) !== 'Boolean' 	? this._defaultOpt['focusScale'] 	: opt['focusScale'];
        this._showFn 	= G.getValType(opt['showFn']) !== 'Function' 	? this._defaultOpt['showFn'] 	: opt['showFn'];
        this._hideFn 	= G.getValType(opt['hideFn']) !== 'Function' 	? this._defaultOpt['hideFn'] 	: opt['hideFn'];
		this._action = !G.contain(opt['action'] , this._actionRange) ? this._defaultOpt['action'] : opt['action'];

		this._run();
	}

	PicPreview.prototype = {
		cTime: '2016-11-05 22:36:00' ,
		version: '1.0' ,
		constructor: PicPreview ,
		author: '陈学龙' ,

		_initStaticHTML: function(){
            this._picPreview 		= G('.pic-preview'  , this._con.get()).first();
            this._preview			= G('.preview'	, this._picPreview.get()).first();
            this._inForPreview		= G('.in'   	, this._preview.get()).first();
            this._picSetForPreview	= G('.pic'   	, this._inForPreview.get());
            this._control			= G('.control'	, this._picPreview.get()).first();
            this._image				= G('.image'	, this._control.get()).first();
            this._itemList			= G('.item-list' , this._image.get()).first();

			// 初始化图片索引
			var i 		= 0;
			var cur 	= null;
			var item 	= null;
			var html    = [];
			
			for (i = 0; i < this._picSetForPreview.length; ++i)
			{
				cur = G(this._picSetForPreview.get()[i]);

				html.push('<div class="item" data-index="' + (i + 1) + '" data-id="' + i + '">');
				html.push('		<img src="' + cur.get().src + '" class="pic" />');
				html.push('</div>');
			}
			
			this._itemList.get().innerHTML = html.join('');
		} ,

		_initStaticArgs: function(){
			// 元素
            this._itemSet 	= G('.item' , this._itemList.get());
            this._tip			= G('.tip'			, this._picPreview.get()).first();
            this._firstTip		= G('.first-tip'	, this._tip.get()).first();
            this._lastTip		= G('.last-tip'		, this._tip.get()).first();
            this._bg			= G('.bg'			, this._picPreview.get()).first();
            this.__index			= G('.index'	, this._control.get()).first();
            this._viewOriginPic     = G('.view-origin-image' , this.__index.get()).first();
            this._cur				= G('.cur' , this.__index.get()).first();
            this._count				= G('.count' , this.__index.get()).first();
            this._prev			= G('.prev'		, this._picPreview.get()).first();
            this._next			= G('.next'		, this._picPreview.get()).first();
            this._close			= G('.close'	, this._picPreview.get()).first();

            // 最小索引（从 1 开始算起）
			this._minIndex = 1;
			// 最大索引
			this._maxIndex = this._picSetForPreview.length;

			// 提示定时器
			this._tipTimer = null;

			// 显示的图片数量
			// this._lenForBefore = Math.floor((this._imageCount - 1) / 2);
			// this._lenForBefore = Math.max(0 , this._lenForBefore);
			// 不允许图片显示数量小于 5
			this._imageCount = this._imageCount < 5 ? 5 : this._imageCount;

			var len	 = this._imageCount - 1;
            var type = G.oddEven(len);

			this._lenForBefore  = type === 'odd' ? (len + 1) / 2 : len / 2;
            this._lenForAfter 	= len - this._lenForBefore;

            this._isOnce = true;
		} ,

		_initStatic: function(){
            var i 		= 0;
            var cur 	= null;
            var self	= this;

            // 初始化设置大图相关属性
            for (i = 0; i < this._picSetForPreview.length; ++i)
			{
				cur = G(this._picSetForPreview.get()[i]);

				cur.data('index' , i + 1);
				cur.data('id' , i);

                // 初始化图片
                G.getImageInfo(cur.get().src , (function(info){
                    var tar = G(this);

                    // 初始化设置一波
                    self.setBig(this , info['width'] , info['height']);

                    if (tar.data('index') == self._index) {
                    	self.resetPreview(tar.get());
                    	self._isOnce = false;
					}
                }).bind(cur.get()));
			}

			var small = G(this.small(this._index));
			var big   = G(this.big(this._index));

			// 高亮显示
			small.highlight('cur' , this._itemSet.get());

			// 显示对应的大图
			big.css({
				opacity: 1
			});

			if (this._enableOprFunc) {
                this._prev.removeClass('hide');
                this._next.removeClass('hide');
			}

			// 是否显示容器
			if (this._action === 'show') {
				this.showPicPreview();
            } else {
            	this.hidePicPreview();
			}
		} ,

		_initDynamicHTML: function(){

		} ,
		
		_initDynamicArgs: function(){
            // 元素
			this._maxW 		= document.documentElement.clientWidth;
			this._maxH 		= document.documentElement.clientHeight;

            this._baseVal 	= this._maxW >= this._maxH ? this._maxH : this._maxW;

            // 缩放的最小比率
            this._scaleMinRatio = 0.2;
			
			// 设置大图宽高
			var i 		= 0;
			var cur 	= null;
			
			// 控制面板相关设置
			this._controlW = Math.floor(this._maxW * this._controlWRatio + this._extraW);

			// 边界显示宽度：H / W
			this._itemHRatio = 0.6;
			// 注意 this._itemSet.length 如果为 0 可能会出现死循环
			this._itemW = (this._controlW - this._extraW) / this._imageCount;
			this._itemW = Math.floor(this._itemW);
			this._itemH = this._itemW * this._itemHRatio;
			this._itemH = Math.floor(this._itemH);

			// 由于会出现精度损失，所以其宽度重新计算
			this._controlW  = this._itemW * (this._itemSet.length > this._imageCount ? this._imageCount : this._itemSet.length);
			this._controlW += this._extraW;
			this._controlH  = this._itemH;
			this._itemListW = this._itemW * this._itemSet.length;

			// 准确确定值
			this._itemListW = this._itemListW < this._controlW ? this._controlW : this._itemListW;

			this._control.css({
				width: this._controlW + 'px' ,
				height: this._controlH + 'px'
			});

			// 设置元素水平居中
			this._control.center(this._picPreview.get() , 'horizontal');

			this._itemList.css({
				width: this._itemListW + 'px'
			});

			// 初始化设置小图
			for (i = 0; i < this._itemSet.length; ++i)
			{
				cur = G(this._itemSet.get()[i]);

				cur.css({
					width: this._itemW + 'px' ,
					height: this._itemH + 'px'
				});
			}

			// 初始化设置索引值
			this._cur.get().textContent = this._index;
			this._count.get().textContent = this._itemSet.length;

			/*
			// 获取滚动展示的条件值
			// this._itemListConW = this._itemListCon.getEleW('border-box');
			this._scrollInCW = this._image.getEleW('content-box');
			this._minLeftVal = -(this._itemListConW - this._scrollInCW);
			this._maxLeftVal = 0;

			// 设置滚动的范围值
			this._getScrollVal();

			// 预览视区
			this._previewW = this._maxW;
			this._previewH = this._maxH;

			// 按钮垂直居中
			this._prev.css({
				lineHeight: this._maxH + 'px'
			});

			this._next.css({
				lineHeight: this._maxH + 'px'
			});
			*/
		} ,

		_initDynamic: function(){
			if (!this._isOnce) {
				this.render(this.index());
			}
		} ,

		// 重新渲染大图
		render: function(index){
            var image = this.image(index);
            	image = G(image);

            var originW = parseFloat(image.data('oW'));
            var originH = parseFloat(image.data('oH'));

            this.setBig(image.get() , originW , originH);

            this.resetPreview(image.get());
		} ,

		// 初始化设置大图预览图
		setBig: function(tar , originW , originH){
            tar   = G(tar);

            var w = 0;
            var h = 0;

            if (originW > originH) {
                w = this._baseVal;
                h = w / originW * originH;
            } else if (originW < originH) {
                h = this._baseVal;
                w = h / originH * originW;
            } else {
                w = this._baseVal;
                h = w;
            }

            tar.data('oW' , originW);
            tar.data('oH' , originH);

            tar.data('w' , w);
            tar.data('h' , h);

            // 缩放单位量：根据每张图不同，其缩放单位量和极限值都不一样
            tar.data('scaleUW' , Math.round(w * this._scaleRatio));
            tar.data('scaleUH' , Math.round(h * this._scaleRatio));

            // 缩放极限值
            tar.data('scaleMinW' , Math.round(w * this._scaleMinRatio));
            tar.data('scaleMinH' , Math.round(h * this._scaleMinRatio));
		} ,

		// 切换不同的图片，重新设置预览图的宽高
		resetPreview: function(image){
			image = G(image);

			var w = parseFloat(image.data('w'));
			var h = parseFloat(image.data('h'));

            this._inForPreview.css({
                width: w + 'px' ,
                height: h + 'px'
            });

            this._inForPreview.center(this._preview.get() , 'all');
		} ,
		
		_winResize: function(){
			this._initDynamicHTML();
			this._initDynamicArgs();
			this._initDynamic();
		} ,
		
		// 鼠标滚轮事件
		_switchMouseScrollEvent: function(event){
			var e = event || window.event;
			e.preventDefault();
			e.stopPropagation();

			if (e.deltaY >= 0) {
				this.next();
			} else {
				this.prev();
			}
		} ,
		
		id: function(){
			var i   = 0;
			var cur = null;

			for (i = 0; i < this._itemSet.length; ++i)
			{
				cur = G(this._itemSet.get()[i]);

				if (cur.hasClass('cur')) {
					return parseInt(cur.data('id'));
				}
			}

			throw Error('无法获取 id！');
		} ,

        index: function(){
            var i   = 0;
            var cur = null;

            for (i = 0; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.hasClass('cur')) {
                    return parseInt(cur.data('index'));
                }
            }

            throw Error('无法获取 id！');
        } ,

		// 获取当前显示的图片
		image: function(index){
        	index = G.getValType(index) !== 'Number' ? this.index() : index;

            var i   	= 0;
            var cur 	= null;

            for (i = 0; i < this._picSetForPreview.length; ++i)
            {
                cur = G(this._picSetForPreview.get()[i]);

                if (cur.data('index') == index) {
                    return cur.get();
                }
            }

            throw Error('无法获取 image！');
		} ,
		
		// 显示提示
		tip: function(type){
			var typeRange = ['first' , 'last'];

			if (!G.contain(type , typeRange)) {
				throw new RangeError('参数 1 错误');
			}

			window.clearTimeout(this._tipTimer);

			var self = this;
			var curOpacity = parseFloat(this._tip.getStyleVal('opacity'));
			var endOpacity = 0.8;

			if (type === 'last') {
				this._firstTip.addClass('hide');
				this._lastTip.removeClass('hide');	
			}

			if (type === 'first') {
				this._lastTip.addClass('hide');	
				this._firstTip.removeClass('hide');
			}

			this._tip.removeClass('hide');
			this._tip.center(this._picPreview.get() , 'all');

			// 显示提示
			this._tip.animate({
				carTime: this._carTime ,
				json: [
						{
							attr: 'opacity' ,
							sVal: curOpacity , 
							eVal: endOpacity
						}
					  ] ,
				fn: function(){
					// 指定时间后隐藏提示
					self.tipTimer = window.setTimeout(function(){
						self._tip.animate({
							carTime: self._carTime ,
							json: [
									{
										attr: 'opacity' ,
										sVal: endOpacity , 
										eVal: 0 
									}
								  ] ,
							fn: function(){
								self._tip.addClass('hide'); 
							}
						});
					} , self._tipTime);	  
				}
			});
		} ,

		// 通过 index 获取 大图
		big: function(index) {
            var i = 0;
            var cur = null;

            for (; i < this._picSetForPreview.length; ++i)
			{
				cur = G(this._picSetForPreview.get()[i]);

				if (cur.data('index') == index) {
					return cur.get();
				}
			}

			throw new Error("未找到对应的大图");
		} ,

        // 通过 index 获取 小图
        small: function(index) {
            var i = 0;
            var cur = null;

            for (; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.data('index') == index) {
                    return cur.get();
                }
            }

            throw new Error("未找到对应的小图");
        } ,

        // 大图：切换到指定索引位置
        switchForBig: function(index){
			var self      = this;
			var prevIndex = this.index();

            // 大图切换
            var hide = G(this.big(prevIndex));
            var show = G(this.big(index));

            // 重新渲染视图
            self.render(index);

            var curOpacityForHide = parseFloat(hide.getStyleVal('opacity'));
            var endOpacityForHide = 0;
            var curOpacityForShow = parseFloat(show.getStyleVal('opacity'));
            var endOpacityForShow = 1;

            hide.animate({
                carTime: this._carTime ,
                json: [
                    {
                        attr: 'opacity' ,
                        sVal: curOpacityForHide ,
                        eVal: endOpacityForHide
                    }
                ]
            });

            show.animate({
                carTime: this._carTime ,
                json: [
                    {
                        attr: 'opacity' ,
                        sVal: curOpacityForShow ,
                        eVal: endOpacityForShow
                    }
                ]
            });
        } ,

		// 小图：切换到指定索引位置
		switchForSmall: function(index){
			var prevIndex = this.index();

			prevIndex > index ? this.prevForSmall(index) : this.nextForSmall(index);
		} ,

		// 大图切换到上一张
		prevForBig: function(index){
            var prevIndex = index + 1;

            this.switchForBig(index);
		} ,

		// 大图切换到下一张
		// @param number index 他是结果索引（切换完成后的索引）
		nextForBig: function(index){
			var prevIndex = index - 1;

			this.switchForBig(index);
		} ,

		// 小图切换到上一张
		prevForSmall: function(index){
			var prevIndex = index + 1;
            // 小图切换
            var small = this.small(index);

            small = G(small);
            small.highlight('cur' , this._itemSet.get());

            // 判断小图容器是否要进行移动
            if (prevIndex < this._imageCount) {
                return ;
            }

            // 如果当前索引的值 >= 显示图片数量的话，小图区域进行移动
            // 移动的值怎么获取呢？？
            var firstIndex 	= index + this._lenForAfter >= this._maxIndex ? this._maxIndex - this._imageCount + 1 : index - this._lenForBefore;
            var curLeft		= this._itemList.getCoordVal('left');
            var endLeft    	= index <= this._imageCount ? 0 : -((firstIndex - 1) * this._itemW);

            this._itemList.animate({
                carTime: this._carTime ,
                json: [
                    {
                        attr: 'left' ,
                        sVal: curLeft ,
                        eVal: endLeft
                    }
                ]
            });
		} ,

		// 小图切换到下一张
		nextForSmall: function(index){
            // 小图切换
            var small = this.small(index);

            small = G(small);
            small.highlight('cur' , this._itemSet.get());

            // 判断小图容器是否要进行移动
            if (index < this._imageCount) {
            	return ;
            }

            // 如果当前索引的值 >= 显示图片数量的话，小图区域进行移动
            // 移动的值怎么获取呢？？
            var firstIndex 	= index + this._lenForAfter >= this._maxIndex ? this._maxIndex - this._imageCount + 1 : index - this._lenForBefore;
            var curLeft		= this._itemList.getCoordVal('left');
            // 如果 firstIndex 不减 1 的话,则不会显示该对应内容！
            var endLeft    	= -((firstIndex - 1) * this._itemW);


            this._itemList.animate({
				carTime: this._carTime ,
				json: [
					{
						attr: 'left' ,
						sVal: curLeft ,
						eVal: endLeft
					}
				]
			});
		} ,

		// 设置显示的索引值
		setIndex: function(index){
			this._cur.get().textContent = index;
		} ,

		// 下一张
		next: function(){
			var index  = this.index();
				index += 1;

			if (index > this._maxIndex) {
				return this.tip('last');
			}

			// 大图切换到指定索引位置
			this.nextForBig(index);

            // 小图切换到指定索引位置
			this.nextForSmall(index);

            // 设置当前索引
			this.setIndex(index);
		} ,

		// 上一张
		prev: function(){
            var index  = this.index();
            index -= 1;

            if (index < this._minIndex) {
                return this.tip('first');
            }

            // 大图切换到指定索引位置
            this.prevForBig(index);

            // 小图切换到指定索引位置
            this.prevForSmall(index);
            // 设置当前索引
            this.setIndex(index);
		} ,
		
		// 图片放大
		enlarge: function(mouseX , mouseY){
			// 图片的容器范围

			var curW = this._inForPreview.getEleW('border-box');
			var curH = this._inForPreview.getEleH('border-box');
			var curL = this._inForPreview.getCoordVal('left');
			var curT = this._inForPreview.getCoordVal('top');

            var minX = curL;
            var maxX = curL + curW;
            var minY = curT;
            var maxY = curT + curH;

            var image = G(this.image());

			var scaleUW = parseFloat(image.data('scaleUW'));
			var scaleUH = parseFloat(image.data('scaleUH'));

			var endW = curW + scaleUW;
			var endH = curH + scaleUH;

			var endL = 0;
			var endT = 0;


			// console.log('mouseX: ' + mouseX , 'mouseY:' + mouseY , 'minX:' + minX , 'maxX:' + maxX , 'minY:' + minY , 'maxY:' + maxY);

			if (!this._focusScale || mouseX < minX || mouseX > maxX ||  mouseY < minY || mouseY > maxY) {
                endL = curL - (scaleUW / 2);
                endT = curT - (scaleUH / 2);
			} else {
                // 原始 x、y 长度
                var originX = mouseX - minX;
                var originY = mouseY - minY;

                // 缩放后 x、y 长度
                var curX = originX / curW * endW;
                var curY = originY / curH * endH;

				// 变化量
				var ox = curX - originX;
				var oy = curY - originY;

				// 最终确定物体位置
				endL = curL - ox;
				endT = curT - oy;
			}
			
			this._inForPreview.css({
				width: endW + 'px' ,
				height: endH + 'px' ,
				left: endL + 'px' ,
				top: endT + 'px' ,
			});
			
			image.data('scaleUW' , endW * this._scaleRatio);
            image.data('scaleUH' , endH * this._scaleRatio);
		} ,
		
		// 图片缩小
		narrow: function(mouseX , mouseY){
			var curW = this._inForPreview.getEleW('border-box');
			var curH = this._inForPreview.getEleH('border-box');
			var curL = this._inForPreview.getCoordVal('left');
			var curT = this._inForPreview.getCoordVal('top');

            var minX = curL;
            var maxX = curL + curW;
            var minY = curT;
            var maxY = curT + curH;

            var image = G(this.image());

            var scaleUW = parseFloat(image.data('scaleUW'));
            var scaleUH = parseFloat(image.data('scaleUH'));
            var scaleMinW = parseFloat(image.data('scaleMinW'));
            var scaleMinH = parseFloat(image.data('scaleMinH'));

            var endW = Math.max(scaleMinW , curW - scaleUW);
            var endH = Math.max(scaleMinH , curH - scaleUH);

			var endL = 0;
			var endT = 0;

            // console.log('mouseX: ' + mouseX , 'mouseY:' + mouseY , 'minX:' + minX , 'maxX:' + maxX , 'minY:' + minY , 'maxY:' + maxY , 'scaleMinW:' + scaleMinW , 'scaleMinH:' + scaleMinH , 'curW:' + curW , 'curH:' + curH);

			if (curW == scaleMinW && curH == scaleMinH) {
				return ;
			}

            if (!this._focusScale || mouseX < minX || mouseX > maxX ||  mouseY < minY || mouseY > maxY) {
                endL = curL + (scaleUW / 2);
                endT = curT + (scaleUH / 2);
            } else {
                // 原始 x、y 长度
                var originX = mouseX - minX;
                var originY = mouseY - minY;

                // 缩放后 x、y 长度
                var curX = originX / curW * endW;
                var curY = originY / curH * endH;

                // 变化量
                var ox = Math.abs(curX - originX);
                var oy = Math.abs(curY - originY);

                // 最终确定物体位置
                endL = curL + ox;
                endT = curT + oy;
            }

			this._inForPreview.css({
				width: endW + 'px' ,
				height: endH + 'px' ,
				left: endL + 'px' ,
				top: endT + 'px' ,
			});

            image.data('scaleUW' , endW * this._scaleRatio);
            image.data('scaleUH' , endH * this._scaleRatio);
		} ,

		// 缩放事件
		_scaleMouseScrollEvent: function(event){
			event.preventDefault();
			event.stopPropagation();
			
			if (event.deltaY >= 0) {
				this.enlarge(event.clientX , event.clientY);
			} else {
				this.narrow(event.clientX , event.clientY);
			}
		} ,

		// 切换到指定索引的图片
		switch: function(index){
            // 大图切换到指定位置
            this.switchForBig(index);

            // 小图切换到指定位置
            this.switchForSmall(index);

            // 设置当前索引
            this.setIndex(index);
		} ,

		// 小图点击事件
		_clickEventForItem: function(event){
			event.stopPropagation();

			var tar 	= G(event.currentTarget);
			var index 	= parseInt(tar.data('index'));

			this.switch(index);
		} ,
		
		// 获取 item 元素列表
		_getItemList: function(){
			return G('.item' , this._itemListCon.get()).get();
		} ,
		
		// 显示容器
		showPicPreview: function(){
            this._picPreview.removeClass('hide');

			var self		= this;
			var curOpacity 	= parseFloat(this._picPreview.getStyleVal('opacity'));
			var endOpacity 	= 1;

			this._picPreview.animate({
				carTime: 200 ,
				json: [
						{
							attr: 'opacity' ,
							sVal: curOpacity ,
							eVal: endOpacity
						}
					  ] ,
				fn: function(){
					// 重新初始化参数
                    self._initDynamicHTML();
                    self._initDynamicArgs();
                    self._initDynamic();

                    if (G.getValType(self._showFn) === 'Function') {
                        self._showFn.call(self);
                    }
				}
			});
		} ,

		// 隐藏容器
		hidePicPreview: function(){
			var curOpacity 	= parseFloat(this._picPreview.getStyleVal('opacity'));
			var endOpacity 	= 0;
			var self 		= this;

			this._picPreview.animate({
				carTime: this._carTime ,
				json: [
						{
							attr: 'opacity' ,
							sVal: curOpacity ,
							eVal: endOpacity
						}
					  ] ,
				 fn: function(){
					self._picPreview.addClass('hide');

					if (G.getValType(self._hideFn) === 'Function') {
						self._hideFn.call(self);
					}
				 }
			});
		} ,

		// 关闭事件
		_closeEvent: function(event){
			var tar = G(event.currentTarget);

            this.hidePicPreview();

            if (G.getValType(this._closeFn) === 'Function') {
            	this._closeFn.call(this);
			}
		} ,

		// 查看原图
        viewOriginImage: function(){
			// 当前的图片
			var image = this.image();

			window.open(image.src , '_blank');
		} ,

		/*
		 * 事件定义
		 */
		_defineEvent: function(){
			var win = G(window);

			// 鼠标滚轮切换
			if (this._enableScorllFunc) {
                this._control.loginEvent('wheel' , this._switchMouseScrollEvent.bind(this) , true , false);
			}

			// 缩放事件
            if (this._enableScaleFunc) {
                this._preview.loginEvent('wheel' , this._scaleMouseScrollEvent.bind(this) , true , false);
            }

			// 按钮事件
			if (this._enableOprFunc) {
                this._prev.loginEvent('click' , this.prev.bind(this) , true , false);
                this._next.loginEvent('click' , this.next.bind(this) , true , false);
			}

			this._close.loginEvent('click' , this._closeEvent.bind(this) , true , false);

			// 屏幕调整事件
			win.loginEvent('resize' , this._winResize.bind(this) , true , false);

			// 图片点击事件
			this._itemSet.loginEvent('click' , this._clickEventForItem.bind(this) , true , false);

			// 预览图移动事件
			if (this._enableMoveFunc) {
                this._inForPreview.move(this._preview.get());
			}

			// 查看原图
			this._viewOriginPic.loginEvent('click' , this.viewOriginImage.bind(this) , true , false);
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

	return PicPreview;
})();
