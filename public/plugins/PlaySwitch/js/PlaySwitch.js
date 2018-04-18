/**
 * **************************
 * 公告轮播
 * **************************
 */
var PlaySwitch = (function(){
	function PlaySwitch(con , opt){
		var thisRange = [window , null , undefined];

		if (G.contain(this , thisRange) || (!G.contain(this , thisRange) && this.constructor !== PlaySwitch)) {
			return new PlaySwitch(con , opt);
		}

		// 默认设置
		this._defaultOpt = {
			// 动画过度时间，单位：s
            time: 200 ,
			// 项 轮播间隔时间，单位：s
			duration: 2000 ,
			// 轮播方向：top  bottom left right
			dir: 'top' ,
			// 默认显示第几项
			index: 1 ,
			// 是否开启定时轮播
			timePlay: true
		};

        /**
		 * top 从下往上
		 * bottom 从上往下
		 * left 从右往左
		 * right 从左往右
         */
		this._dirRange           = ['top' , 'bottom' , 'left' , 'right'];

		if (G.getValType(opt) === 'Undefined') {
			opt = this._defaultOpt;
		}

		this._con				= G(con);

		this._time			= G.getValType(opt['time']) !== 'Number'	  		? this._defaultOpt['time'] 		: opt['time'];
		this._duration		= G.getValType(opt['duration']) !== 'Number' 		? this._defaultOpt['duration'] 	: opt['duration'];
        this._index		 	= G.getValType(opt['index']) !== 'Number' 			? this._defaultOpt['index'] 	: opt['index'];
		this._dir			= !G.contain(opt['dir'] , this._dirRange)	 		? this._defaultOpt['dir']	 	: opt['dir'];
		this._timePlay 		= G.getValType(opt['timePlay']) !== 'Boolean'		? this._defaultOpt['timePlay'] 	: opt['timePlay'];

		this._run();
	}  

	PlaySwitch.prototype = {
		version: '1.0' ,

		cTime: '2018-01-11 15:04:00' ,

		constructor: PlaySwitch ,

		_initStaticHTML: function(){
			// 元素
            this._playSwitch	= G('.play-switch' , this._con.get()).first();
            this._itemList 		= G('.item-list' , this._playSwitch.get()).first();

            var itemSet = G('.item' , this._itemList.get());

            // console.log(itemSet.get() , this._itemList.get());

            // 由于滚动会有一个切换，所以需要首位元素上各增加一个范围值
			var first = G(itemSet.get()[0]);
			var last  = G(itemSet.get()[itemSet.length - 1]);

			var cloneFirst 	= G(first.get().cloneNode(true));
			var cloneLast 	= G(last.get().cloneNode(true));

			// 首元素追加到尾元素
			first.get().parentNode.appendChild(cloneFirst.get());
			// 尾元素追加到首元素
			last.get().parentNode.insertBefore(cloneLast.get() , first.get());
		} ,

		_initStaticArgs: function(){
			// 元素
			this._itemSet 	= G('.item' , this._itemList.get());
			// item 的数量
			this._itemNum		= this._itemSet.length;

            // 获取相关参数
            this._playSwitchW = this._playSwitch.getEleW('border-box');
			this._playSwitchH = this._playSwitch.getEleH('border-box');
			this._itemW		  = this._playSwitchW;
			this._itemH		  = this._playSwitchH;

			// 待设置属性的名称
			this._attr = this._dir;

			/*
			// 事件集合
			this._event = {
				top: {
					next: this.nextForTop.bind(this) ,
					prev: this.prevForTop.bind(this)
				} ,
			};
			*/

			// 水平滚动 || 垂直滚动
			this._horizontal 	= ['left' , 'right'];
			this._vertical 		= ['top' , 'bottom'];

			// 水平滚动类名
			this._horizontalClass = 'play-switch-horizontal';

			// 垂直滚动类名
			this._verticalClass = 'play-switch-vertical';

			// 动画状态
			this._isStopForNext = true;
			this._isStopForPrev = true;

			// 定时器
			this._timer = null;
		} ,

		_initStatic: function(){
			// 设置 item-list 的 top 值 或者是 bottom 值

			// 设置 item 的高度
			var i 	= 0;
			var cur = null;

			for (i = 0; i < this._itemSet.length; ++i)
			{
				cur = G(this._itemSet.get()[i]);

				cur.css({
					width: this._itemW + 'px' ,
					height: this._itemH + 'px'
				});

				if (i === 0) {
                    cur.data('cur' , 'n');
                    // 这个是给开发人员看的布局顺序
					cur.data('index' , this._itemNum - 2);
				} else if (i === this._itemNum - 1) {
                    cur.data('cur' , 'n');
					cur.data('index' , 1);
				} else {
                    if (i == this._index) {
                    	cur.data('cur' , 'y');
					} else {
                        cur.data('cur' , 'n');
					}

                    // 这个是给开发人员看的布局顺序
					cur.data('index' , i);
				}

				// 这个是用于 1 对 1 确定 序号 和 元素对应关系的
				cur.data('id' , i);
			}

			if (G.contain(this._dir , this._horizontal)) {
				// 水平滚动切换
                this._itemList.css({
					width: this._itemNum * this._itemW + 'px'
				});
			}

			// 参数
			this._itemListH = this._itemList.getEleH('border-box');

			// 每次滚动的距离（根据不同的方向，实际就是属性）
			this._unitVal = G.contain(this._dir , this._horizontal) ? this._itemW : this._itemH;

			// 设置不同方向对应的不同类名
			this._playSwitch.addClass(G.contain(this._dir , this._horizontal) ? this._horizontalClass : this._verticalClass);

			// 范围值
			this._range = {
				top: {} ,
				bottom: {} ,
				left: {} ,
				right: {} ,
			};

            // 获取从下往上滚动范围
			for (i = 0; i <= this._itemSet.length - 1; ++i)
			{
				this._range[this._attr][i] = -(this._unitVal * i);
			}

            // 设置初始属性值
			if (this._index < 1 || this._index > this._itemNum - 2) {
				throw new Error('初始索引值超出范围');
			}

			// 初始化展示索引对应的项
            var css = {};
            css[this._attr] = this._range[this._attr][this._index] + 'px';
            this._itemList.css(css);

            // 第一个元素对应的 id
			this._firstID = parseInt(G(this._itemSet.get()[0]).data('id'));
			// 最后一个元素对应的 id
			this._lastID = parseInt(G(this._itemSet.get()[this._itemNum - 1]).data('id'));

			// 定时轮播
			if (this._timePlay) {
				this._timeEvent();
			}
		} ,

		_initDynamicHTML: function(){

		} ,

		_initDynamicArgs: function(){

		} ,

        _initDynamic: function(){

        } ,

		// 获取当前显示的项
		cur: function(){
        	var i = 0;
        	var cur = null;

        	for (; i < this._itemNum; ++i)
			{
				cur = G(this._itemSet.get()[i]);

				if (cur.data('cur') === 'y') {
					return cur.get();
				}
			}

			throw new Error("找不到当前项");
		} ,

		// 获取当前显示项的索引
		id: function(){
			return parseInt(G(this.cur()).data('id'));
		} ,

		// 给定对应属性值找到对应元素
		dom: function(id){
			var i = 0;
			var cur = null;

			for (; i < this._itemNum; ++i)
			{
				cur = G(this._itemSet.get()[i]);

				if (cur.data('id') == id) {
					return cur.get();
				}
			}

			throw new Error('未找到给定 ID 对应的元素');
		} ,

        // 设置当前项
        setCur: function(item){
            item = G(item);

            var i = 0;
            var cur = null;

            for (; i < this._itemNum; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.get() === item.get()) {
                    cur.data('cur' , 'y');
                } else {
                    cur.data('cur' , 'n');
                }
            }
        } ,

		// 下一项
		next: function(){
            if (!this._isStopForNext) {
            	// 不阻塞不同类型动画进行
                // console.log('同类型动画还在执行中：next');
                return ;
            }

            // 无论有没有开启轮播，清除定时器
            window.clearTimeout(this._timer);

			var self = this;
			var curVal = this._itemList.getCoordVal(this._attr);
			var id  = this.id();
				id += 1;
			var endVal = this._range[this._attr][id];

			this._isStopForNext = false;

			this._itemList.animate({
				time: this._time ,
				json: [
					{
						attr: this._attr ,
						sVal: curVal ,
						eVal: endVal
					}
				] ,
				fn: function(){
					// 如果已经是正常顺序最后一个，瞬间切换回预置对应的位置
					if (id == self._lastID) {
                        id = self._firstID + 1;

                        var css = {};

						css[self._attr] = self._range[self._attr][id] + 'px';

						self._itemList.css(css);
					}

					// 设置当前展示项
                    self.setCur(self.dom(id));

					// 设置动画状态
                    self._isStopForNext = true;

                    // 如果开启了定时轮播
                    if (self._timePlay) {
                    	self._timeEvent();
					}
				}
			});
		} ,

		// 上一项
        prev: function(){
			if (!this._isStopForPrev) {
				// console.log('同类型动画还在执行中：prev');
				return ;
			}

			// 无论定时器是否存在，清除定时器
			window.clearTimeout(this._timer);

            var self = this;

            var curVal = this._itemList.getCoordVal(this._attr);
            var id  = this.id();
				id -= 1;

            var endVal = this._range[this._attr][id];

            this._isStopForPrev = false;

            this._itemList.animate({
                time: this._time ,
                json: [
                    {
                        attr: this._attr ,
                        sVal: curVal ,
                        eVal: endVal
                    }
                ] ,
                fn: function(){
                    // 如果已经是第一个，切换回最后一个
                    if (id == self._firstID) {
                    	id = self._lastID - 1;

                        var css = {};

                        css[self._attr] = self._range[self._attr][id] + 'px';

                        self._itemList.css(css);
                    }

                    self.setCur(self.dom(id));

                    // 设置动画状态
					self._isStopForPrev = true;

                    // 如果开启了定时轮播
                    if (self._timePlay) {
                        self._timeEvent();
                    }
                }
            });
        } ,

		// 定时任务
		_timeEvent: function(){
        	var self = this;

        	this._timer = window.setTimeout(function(){
                self.next();
			} , this._duration);
		} ,

		// 定义事件
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

	return PlaySwitch;
})();