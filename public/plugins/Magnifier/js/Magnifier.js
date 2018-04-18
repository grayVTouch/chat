/*
 * author 陈学龙（grayVTouch） 2018-01-27 11:03:00
 *
 * 图片放大镜
 *
 * 在需要对图片进行放大镜处理的地方，增加类名： magnifier-image
 * 一个页面只允许有一个图片放大镜的 html 结构！
 * 一个页面只允许实例化一次 Magnifier 对象
 */

var Magnifier = (function(){
	function Magnifier(con , opt){
		var thisRange = [undefined , null , window];

		if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== Magnifier) {
			return new Magnifier(con , opt);
		}
		
		// 默认设置
		this._defaultOpt = {
			// 放大镜的宽
			width: 400 ,
			// 放大镜的高
			height: 400 ,
			// 放大镜与原图的间隔
			interval: 20 ,
			// 块移动范围容器
			block: null
		};

		if (G.getValType(opt) === 'Undefined') {
			opt = this._defaultOpt;
		}

		// 在哪个区域范围内获取 magnifier-item 元素
		// 需要进行图片放大的元素集合
		this._con = G(con);

		this._width 	= G.getValType(opt['width']) === 'Number' 		? opt['width'] 		: this._defaultOpt['width'];
		this._height 	= G.getValType(opt['height']) === 'Number' 		? opt['height'] 	: this._defaultOpt['height'];
		this._interval 	= G.getValType(opt['interval']) === 'Number' 	? opt['interval'] 	: this._defaultOpt['interval'];
		this._block 	= G.isDOMEle(opt['block']) 						? G(opt['block']) 	: this._defaultOpt['block'];

		this._run();
	}

	Magnifier.prototype = {
		constructor: Magnifier ,
		author: 'grayVTouch' , 
		cTime: '2017-04-20' ,
		
		_initStaticHTML: function(){
            this._magnifier = G('.magnifier').first();
            this._list		= G('.list' , this._magnifier.get()).first();
            this._itemSet 	= G('.magnifier-item' , this._con.get());

            // 属性名称
            this._identifier = '_magnifierIdentifier';

            var i 		= 0;
            var cur 	= null;
            var html 	= [];
            var identifier = null;

            for (; i < this._itemSet.length; ++i)
			{
				cur = G(this._itemSet.get()[i]);

                identifier = G.randomArr(100 , 'mixed').join('');

                // 设置标志：一一对应关系
				cur.data(this._identifier , identifier);

				// 设置标志：一一对应关系
				html.push('<img src="' + cur.get().src + '" class="pic" data-' + this._identifier + '="' + identifier +'" />');
			}

			this._list.get().innerHTML = html.join('');
		} ,
		
		_initStaticArgs: function(){
			// 元素
			this._images 	= G('.pic' , this._list.get());
            this.__block 	= G('.block' , this._magnifier.get()).first();

			// 鼠标当前进入的图片
			this._cur = null;
		} ,

        _initStatic: function(){
			// 设置放大镜宽高
			this._list.css({
				width: this._width + 'px' ,
				height: this._height + 'px'
			});

            this._listW = this._list.getEleW('border-box');
            this._listH = this._list.getEleH('border-box');
            this.__blockW = this.__block.getEleW('border-box');
            this.__blockH = this.__block.getEleH('border-box');
            this._wRatio = this.__blockW / this._listW;
            this._hRatio = this.__blockH / this._listH;

            var i 	= 0;
            var cur = null;
            var picW = 0;
            var picH = 0;
            var curW = 0;
            var curH = 0;
            var origin = null;

			// 获取大图的原始尺寸
			for (i = 0; i < this._images.length; ++i)
			{
				cur = G(this._images.get()[i]);

                origin = this.imageFromOrigin(cur.data(this._identifier));
                origin = G(origin);

				picW = origin.getEleW('border-box');
				picH = origin.getEleH('border-box');

				curW = picW / this._wRatio;
				curH = picH / this._hRatio;

				cur.css({
					width: curW + 'px' ,
					height: curH + 'px'
				});
			}

			// 隐藏
			this.__block.addClass('hide');
			this._list.addClass('hide');

			// 当前所在的 image 对象上
			this._canMove = false;
		} ,

        _initDynamicHTML: function(){

        } ,

        _initDynamicArgs: function(){

		} ,

		_initDynamic: function(){

		} ,

		// 获取对应的图片
		image: function(identifier){
			var i = 0;
			var cur =  null;

			for (; i <this._images.length; ++i)
			{
				cur = G(this._images.get()[i]);

				if (cur.data(this._identifier) == identifier) {
					return cur.get();
				}
			}

			throw new Error("未找到对应项");
		} ,

		// 通过 identifier 从图片源找到对应的图片
		imageFromOrigin: function(identifier){
            var i = 0;
            var cur =  null;

            for (; i <this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.data(this._identifier) == identifier) {
                    return cur.get();
                }
            }

            throw new Error("未找到对应项");
		} ,

		// 设置 block 块位置
		setBlock: function(){
			x = this._clientX;
			y = this._clientY;

            var left = x - this.__blockW / 2;
            left = Math.max(this._minL , left);
            left = Math.min(this._maxL , left);

            var top = y - this.__blockH / 2;
            top = Math.max(this._minT , top);
            top = Math.min(this._maxT , top);


            this.__block.css({
                left: left + 'px' ,
                top: top + 'px'
            });
		} ,

		// 鼠标悬浮
		_mouseOverEvent: function(event){
			var tar = G(event.currentTarget);

			this._cur = tar;

			// 设置
			this._canMove = true;

            this.__block.removeClass('hide');

            // 图片参数
            this._picL = tar.getWindowOffsetVal('left');
            this._picT = tar.getWindowOffsetVal('top');
            this._picW = tar.getEleW('border-box');
            this._picH = tar.getEleH('border-box');

            var w = null;
            var h = null;
            var l = null;
            var t = null;

            // 决定采取图片作为范围限定还是以图片作为范围限定
			// 这通常用于限定放大镜有效范围
			// 防止如果图片被隐藏的情况下，块却能够在看不到图片的情况下移动
			if (this._block instanceof G) {
                w = this._block.getEleW('border-box');
                h = this._block.getEleH('border-box');
                l = this._block.getWindowOffsetVal('left');
                t = this._block.getWindowOffsetVal('top');
			} else {
				w = this._picW;
				h = this._picH;
				l = this._picL;
				t = this._picT;
			}

            // 图片放大镜响应范围（以图片容器范围进行限定）
            this._minX = l;
            this._maxX = l + w;
            this._minY = t;
            this._maxY = t + h;

            // 块移动范围（以图片容器范围进行限定）
            this._minL = l;
            this._maxL = l + w - this.__blockW;
            this._minT = t;
            this._maxT = t + h - this.__blockH;

            // 鼠标指针有效范围
            this._minClientX = l + this.__blockW / 2;
            this._maxClientX = l + w - this.__blockW / 2;
            this._minClientY = t + this.__blockH / 2;
            this._maxClientY = t + h - this.__blockH / 2;

            this._clientX = event.clientX;
            this._clientY = event.clientY;

            // 设置块
			this.setBlock();

			this._list.removeClass('hide');

			// 设置放大镜位置
			var left = this._picL + this._picW + this._interval;
			var top = this._picT;

			this._list.css({
				width: this._listW + 'px' ,
				height: this._listH + 'px' ,
				left: left + 'px' ,
				top: top + 'px' ,
			});

            // 设置放大镜（大图）
			this.setMagnifier();
		} ,

		// 设置放大镜（大图）
		setMagnifier: function(){
            var image = this.image(this._cur.data(this._identifier));
            	image = G(image);

			// 切换显示
			image.highlight('hide' , this._images.get() , true);

			var imageW = image.getEleW('border-box');
			var imageH = image.getEleH('border-box');

			// 边界检查太重要了！难点！！
			var x = Math.max(this._minClientX , Math.min(this._maxClientX , this._clientX));
			var y = Math.max(this._minClientY , Math.min(this._maxClientY , this._clientY));

            var oLeft = x - this._picL;
            var oTop  = y - this._picT;

            var curLeft = -(oLeft / this._picW * imageW - this._listW / 2);
            var curTop 	= -(oTop / this._picH * imageH - this._listH / 2);

            image.css({
				left: curLeft + 'px' ,
				top: curTop + 'px' ,
			});
		} ,

		// 鼠标移动
		_mouseMoveEvent: function(event){
			if (!this._canMove) {
				return ;
			}

			this._clientX = event.clientX;
			this._clientY = event.clientY;

            if (this._clientX < this._minX || this._clientX > this._maxX || this._clientY < this._minY || this._clientY > this._maxY) {
            	// 不允许移动
            	this._canMove = false;

            	this._list.addClass('hide');
                this.__block.addClass('hide');

                // console.log('鼠标移动导致鼠标指针超出范围');

                return ;
            }

            // 设置块
            this.setBlock();

            // 设置放大镜
            this.setMagnifier();
		} ,

		// 鼠标滚动（实验性功能！不要用！！）
		_scrollEvent: function(){
			// 尚未进行初始化
			if (!(this._cur instanceof G)) {
				return ;
			}

			var x = this._clientX;
			var y = this._clientY;

            x += window.pageXOffset;
            y += window.pageYOffset;

            if (x < this._minX || x > this._maxX || y < this._minY || y > this._maxY) {
                // 不允许移动
                this._canMove = false;

                this._list.addClass('hide');
                this.__block.addClass('hide');

                // console.log('鼠标滚动导致鼠标指针超出范围');
                return ;
            }

            // 设置块
            this.setBlock();

            // 设置放大镜
            this.setMagnifier();

		} ,

        _defineEvent: function(){
			var win = G(window);

			this._itemSet.loginEvent('mouseover' , this._mouseOverEvent.bind(this) , true , false);

			win.loginEvent('mousemove' , this._mouseMoveEvent.bind(this) , true , false);
			win.loginEvent('scroll' , this._scrollEvent.bind(this) , true , false);

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

	return Magnifier;
})();