/*
 * author grayVTouch 2017-04-20
 * 图片展示插件
 */
var PicShow = (function(){
	'use strict';
	
	function PicShow(con , opt){
		var thisRange = [undefined , null , window];

		if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== PicShow) {
			return new PicShow(con , opt);
		}

		if (!G.isDOMEle(con)) {
			throw new Error('参数 1 类型错误');
		}
		
		// 默认设置
		this._defaultOpt = {
			// 动画过度时间
			carTime: 300 ,
            // h/w 图片高宽比
            HWRatio: 0.8 ,
            // 大图部分占据高度占容器高度的比率
			bigRatio: 0.8 ,
            // 展示小图数量
			indexCount: 5 ,
            // 初始索引
			index: 1 ,
			// 大图与小图部分的间隔
			interval: 10 ,
			// 插件 url
			pluginUrl: '' ,
			// 下一个回调
			nextFn: null ,
			prevFn: null ,
			clickFn: null ,
			// 滚动功能
			enableWheelFunc: true ,
			// 上一页、下一页功能
			enableOprFunc: true

		};
		
		// 如果没有设置项，则启用默认项
		if (G.getValType(opt) === 'Undefined') {
			opt = this._defaultOpt;
		}

		// 相关元素
		this._con = G(con);

		// 设置项
		this._carTime 		= G.getValType(opt['carTime']) === 'Number' ? opt['carTime'] : this._defaultOpt['carTime'];
		this._HWRatio 		= G.getValType(opt['HWRatio']) === 'Number' ? opt['HWRatio'] : this._defaultOpt['HWRatio'];
		this._bigRatio 		= G.getValType(opt['bigRatio']) === 'Number' ? opt['bigRatio'] : this._defaultOpt['bigRatio'];
		this._indexCount 	= G.getValType(opt['indexCount']) === 'Number' ? opt['indexCount'] : this._defaultOpt['indexCount'];
        this._index	  		= G.getValType(opt['index']) === 'Number' ? opt['index'] : this._defaultOpt['index'];
        this._interval	  	= G.getValType(opt['interval']) === 'Number' ? opt['interval'] : this._defaultOpt['interval'];
        this._pluginUrl	  	= G.getValType(opt['pluginUrl']) === 'String' ? opt['pluginUrl'] : this._defaultOpt['pluginUrl'];
        this._nextFn	  	= G.getValType(opt['nextFn']) === 'Function' ? opt['nextFn'] : this._defaultOpt['nextFn'];
        this._prevFn	  	= G.getValType(opt['prevFn']) === 'Function' ? opt['prevFn'] : this._defaultOpt['prevFn'];
        this._clickFn	  	= G.getValType(opt['clickFn']) === 'Function' ? opt['clickFn'] : this._defaultOpt['clickFn'];
        this._enableWheelFunc	  	= G.getValType(opt['enableWheelFunc']) === 'Boolean' ? opt['enableWheelFunc'] : this._defaultOpt['enableWheelFunc'];
        this._enableOprFunc	  	= G.getValType(opt['enableOprFunc']) === 'Boolean' ? opt['enableOprFunc'] : this._defaultOpt['enableOprFunc'];

		this._run();
	}

	PicShow.prototype = {
		constructor: PicShow , 
		author: '陈学龙' ,
		cTime: '2017-04-20' ,
		
		_initStaticHTML: function(){
            this._picShow 		= G('.pic-show' , this._con.get()).first();
            this._preview		= G('.preview'  , this._picShow.get()).first();
            this._content		= G('.content'  , this._picShow.get()).first();
            this._listForBig	= G('.list'  	, this._content.get()).first();
            this._picSetForBig	= G('.pic'		, this._listForBig.get());
            this.__index			= G('.index' , this._picShow.get()).first();
            this._small			= G('.small'   , this.__index.get()).first();
            this._listForSmall	= G('.list'	   , this._small.get()).first();

			// 初始化设置索引
			var html = [];

			var i = 0;
			var cur = null;

			for (i = 0; i < this._picSetForBig.length; ++i)
			{
				cur = G(this._picSetForBig.get()[i]);

				html.push('<div class="item" data-index="' + (i + 1) + '" data-id="' + i + '"><img src="' + cur.get().src + '" class="pic" /></div>')
			}

			this._listForSmall.get().innerHTML = html.join('');

			// 大图新增头尾元素
			var first = this._picSetForBig.first(true);
			var last  = this._picSetForBig.last(true);

			this._listForBig.get().insertBefore(last.get().cloneNode(true) , first.get());
			this._listForBig.get().appendChild(first.get().cloneNode(true));
		} ,
		
		// 静态参数
		_initStaticArgs: function(){
            this._picSetForBig			= G('.pic'		, this._listForBig.get());
            this._prevForBig			= G('.prev'		, this._preview.get()).first();
            this._nextForBig			= G('.next'		, this._preview.get()).first();
            this._itemSet				= G('.item'	   , this._listForSmall.get());
            this._prevForSmall			= G('.prev'	   , this.__index.get()).first();
            this._picForPrevWithSmall	= G('.pic'	   , this._prevForSmall.get()).first();
            this._nextForSmall			= G('.next'	   , this.__index.get()).first();
            this._picForNextWithSmall	= G('.pic'	   , this._nextForSmall.get()).first();

            // 容器的宽高
			this._picShowW = this._picShow.getEleW('border-box');
			this._picShowH = this._picShow.getEleH('border-box');

			// 内容的宽高
			this._previewW  = this._picShowW;
			this._previewH  = Math.floor((this._picShowH - this._interval) * this._bigRatio);

			// 图片容器的宽度
			this._listForBigW = this._previewW * this._picSetForBig.length;

			this.__indexW    = this._picShowW;
			this.__indexH	= this._picShowH - this._interval - this._previewH;

			// 按钮的宽度
			this._btnW = this._prevForSmall.getEleW('border-box');

			// 小图列表项顶级容器宽度
			this._smallW = this.__indexW - this._btnW * 2;

			// 小图的宽度
			this._itemW  		= Math.floor(this._smallW / this._indexCount);
			this._smallW 		= this._indexCount * this._itemW;
			this._listForSmallW = this._itemSet.length * this._itemW;

			// 范围值
            // id 的范围值
            this._minID 	= 0;
            this._maxID 	= this._picSetForBig.length - 1;
            this._minIndex 	= 1;
            this._maxIndex 	= this._itemSet.length;

            // 图片显示限制
			this._lenForBefore 	= G.oddEven(this._indexCount - 1) == 'even' ? (this._indexCount - 1) / 2 : this._indexCount / 2;
			this._lenForAfter 	= this._indexCount - 1 - this._lenForBefore;
		} ,

        // 一次性设置
        _initStatic: function(){
            var i 	= 0;
            var cur = null;

			// 设置大图
			for (i = 0; i < this._picSetForBig.length; ++i)
			{
				cur = G(this._picSetForBig.get()[i]);

				cur.data('id' , i);

				if (i === 0) {
                    cur.data('index' , this._picSetForBig.length - 2);
				} else if (i === this._picSetForBig.length - 1) {
					cur.data('index' , 1);
				} else {
					cur.data('index' , i);
				}

				// 设置当前项
				if (cur.data('id') == this._index) {
					cur.addClass('cur');
				} else {
					cur.removeClass('cur');
				}
			}

                // 设置大图容器高度
            this._preview.css({
                height: this._previewH + 'px' ,
				marginBottom: this._interval + 'px'
            });

			// 设置大图内容容器的宽度 + left 值！
			this._listForBig.css({
				width: this._listForBigW + 'px' ,
				left: -this.leftForBig(this._index) + 'px'
			});

			// 设置小图的宽！
			this._picSetForBig.css({
				width: this._previewW + 'px'
			});

            // 设置小图容器高度 + 行高（子元素会继承，要的就是继承效果）
            this.__index.css({
                height: this.__indexH + 'px'
            });

            // 设置图片列表顶级容器元素宽度
            this._small.css({
                width: this._smallW + 'px'
            });

            // 设置小图列表容器宽度
            this._listForSmall.css({
                width: this._listForSmallW + 'px' ,
            });

            // 设置小图的宽
            for (i = 0; i < this._itemSet.length; ++i)
            {
            	cur = G(this._itemSet.get()[i]);

                cur.css({
                    width: this._itemW + 'px'
                });

                if (cur.data('index') == this._index) {
                    cur.addClass('cur');
                } else {
                    cur.removeClass('cur');
                }
            }

            // 如果启用
			if (!this._enableOprFunc) {
            	this._prevForBig.addClass('hide');
            	this._nextForBig.addClass('hide');
			}
        } ,

        _initDynamicHTML: function(){

        } ,

        // 动态参数
		_initDynamicArgs: function(){
			// 
		} , 

		// 动态设置
		_initDynamic: function(){
		
		} ,

		// 通过 获取 left 值
		leftForBig: function(id){
			return id * this._previewW;
		} ,

		leftForSmall: function(index){
			return (index - 1) * this._itemW;
		} ,

		// 通过 id 找到大图（因为大图会有重复的 index，所以 id 和 大图一一对应）
		big: function(id){
			var i 	= 0;
			var cur = null;

			for (; i < this._picSetForBig.length; ++i)
			{
				cur = G(this._picSetForBig.get()[i]);

				if (cur.data('id') == id) {
					return cur.get();
				}
			}

			throw new Error("未找到对应项");
		} ,

		// 通过 index 找到小图
		small: function(index){
            var i 	= 0;
            var cur = null;

            for (; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.data('index') == index) {
                    return cur.get();
                }
            }

            throw new Error("未找到对应项");
		} ,

		// 大图切换到指定位置
		switchForBig: function(id){
			var self  = this;

			var curLeft = this._listForBig.getCoordVal('left');
			var endLeft = -this.leftForBig(id);

			this._listForBig.animate({
				carTime: this._carTime ,
				json: [
					{
						attr: 'left' ,
						sVal: curLeft ,
						eVal: endLeft
					}
				] ,
				fn: function(){
					if (id == self._minID) {
						id = self._maxID - 1;

						self._listForBig.css({
							left: -self.leftForBig(id) + 'px'
						});
					}

                    if (id == self._maxID) {
                        id = self._minID + 1;

                        self._listForBig.css({
                            left: -self.leftForBig(id) + 'px'
                        });
                    }

                    var image = self.big(id);
						image = G(image);

					image.highlight('cur' , self._picSetForBig.get());
				}
			});
		} ,

		// 小图切换到指定位置
		switchForSmall: function(index){
			var curLeft = this._listForSmall.getCoordVal('left');
			var endLeft = null;

            if (index < this._indexCount) {
                endLeft = -this.leftForSmall(this._minIndex);
            } else {
                if (index + this._lenForAfter >= this._maxIndex) {
                    endLeft = -this.leftForSmall(this._maxIndex - this._indexCount + 1);
                } else {
                    endLeft = -this.leftForSmall(index - this._lenForBefore);
                }
            }

			var image = this.small(index);
				image = G(image);

			// 切换样式
			image.highlight('cur' , this._itemSet.get());

			this._listForSmall.animate({
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
		
		// 图片点击事件
		_clickEventForSmall: function(event){
			var tar 	= G(event.currentTarget);
			var index 	= parseInt(tar.data('index'));

            // 大图切换
            this.switchForBig(index);

            // 小图切换
            this.switchForSmall(index);

            if (G.getValType(this._clickFn) === 'Function') {
				this._clickFn.call(this , index);
			}
		} ,

		// 获取小图当前选中项 index
		index: function(){
			var i = 0;
			var cur = null;

			for (; i < this._itemSet.length; ++i)
			{
				cur = G(this._itemSet.get()[i]);

				if (cur.hasClass('cur')) {
					return parseInt(cur.data('index'));
				}
			}

			throw new Error("未找到对应项");
		} ,
		
		// 上一个按钮
		prev: function(){
            var index = this.index();
            var curIndex = index - 1;
            	curIndex = curIndex  < this._minIndex ? this._maxIndex : curIndex;
            var id = index == this._minIndex ? this._minID : index - 1;

            // 大图切换
            this.switchForBig(id);

            // 小图切换
            this.switchForSmall(curIndex);

            if (G.getValType(this._prevFn) === 'Function') {
                this._prevFn.call(this , curIndex);
            }
		} , 
		
		// 下一个按钮
		next: function(){
            var index = this.index();
			var curIndex = index + 1;
				curIndex = curIndex  > this._maxIndex ? this._minIndex : curIndex;
            var id = index == this._maxIndex ? this._maxID : index + 1;

            // 大图切换
            this.switchForBig(id);

            // 小图切换
            this.switchForSmall(curIndex);

            if (G.getValType(this._nextFn) === 'Function') {
            	this._nextFn.call(this , curIndex);
			}
		} ,

		// 鼠标滚轮事件
        _wheelEvent: function(event){
			event.preventDefault();

			console.log('scroll');

            if (event.deltaY >= 0) {
                this.next();
            } else {
                this.prev();
            }
		} ,
		
		_defineEvent: function(){
			this._itemSet.loginEvent('click'	, this._clickEventForSmall.bind(this) , true , false);
            this._prevForBig.loginEvent('click'		, this.prev.bind(this) , true , false);
            this._nextForBig.loginEvent('click'		, this.next.bind(this) , true , false);
			this._prevForSmall.loginEvent('click'		, this.prev.bind(this) , true , false);
			this._nextForSmall.loginEvent('click'		, this.next.bind(this) , true , false);

			if (this._enableWheelFunc) {
                this.__index.loginEvent('wheel'		, this._wheelEvent.bind(this) , true , false);
			}
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

	return PicShow;
})();