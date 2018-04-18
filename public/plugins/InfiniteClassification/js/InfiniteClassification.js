/**
 * InfiniteClassification 无限极分类
 * author 陈学龙 2017-09-10 14:00:00
 */

/**
 * 具体需要实现的功能
 *
 * 1. 点击项目(click)
 * 		1.1 触发回调函数
 * 		1.2 展开列表
 * 		1.3 展开列表 + 触发回调函数
 * 2. 右边的图标展示(iconType)
 		2.1 状态提示（新的功能点...，点击一次后消失 new）
 		2.2 数量提示(number)，可动态更新（这边要通过存取器属性来实现）
 		2.3 伸缩切换图标(switch)
 * 3. 无限极分类，不同的层级展现出不同的颜色
 * 4. 给定一个 或 多个项标识，触发 click
 * 5. 展开所有项
 * 6. 收缩所有项
 * 7. 同级是否排斥
 *
 * this._defaultOpt = {
 * 		carTime: 120 ,  		// 动画过渡时间
 * 		clickType: 'mixed' , 	// 点击项目的类型 callback || switch || mixed
 * 		iconType: 'switch' , 	// 展示的图标类型，new || number || switch
 * 		identifier: [] , 		// 标识符
 *      status: 'none' , 		// 状态，spread || shrink || none
 *      exclution: false 		// 同层级是否互斥
 *
 *      1. 回调函数
 *      2. 图标显示（大部分功能菜单是没有图标的！）
 *      3. 选中项问题
 * }
 */

var InfiniteClassification = (function(){
	'use strict';

	function InfiniteClassification(dom , opt){
        var thisRange = [undefined , null , window];

        if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== InfiniteClassification) {
            return new InfiniteClassification(dom , opt);
        }

        if (!G.isDOMEle(dom)) {
            throw new TypeError('参数 1 类型错误');
        }

        // 默认设置
		this._defaultOpt = {
            // 菜单展开动画过渡时间
        	carTime: 120 ,
            // 展示的图标类型，ico || text || none
            leftIconType: 'text' ,
            // 展示的图标类型，new || number || switch
			rightIconType: 'switch' ,
            // 标识符，展开的项；1. 在元素里面设置 data-focus='y' +
			identifier: [] ,
            // 初始状态，spread || shrink || none
			status: 'none' ,
            // 层级视觉显示效果
            paddingAmount: 12 ,
            // 同层级是否互斥
			exclution: false ,
			// 展开回调
			spreadFn: null ,
			// 收缩回调
			shrinkFn: null ,
            // 项点击回调函数
            clickFn: null ,
		};

		if (G.getValType(opt) === 'Undefined') {
        	opt = this._defaultOpt;
		}

		// 元素容器
		this._con = G(dom);

		// 设置参数
		// this._clickTypeRange 	= ['callback' , 'switch' , 'mixed'];
		this._rightIconTypeRange  	= ['new' , 'number' , 'switch'];
		this._statusRange    		= ['spread' , 'shrink' , 'none'];
		this._leftIconTypeRange    	= ['ico' , 'text' , 'none'];

		this._carTime 	 = G.getValType(opt['carTime']) !== 'Number' ? this._defaultOpt['carTime'] : opt['carTime'];
        this._identifier = G.getValType(opt['identifier']) !== 'Array' ? this._defaultOpt['identifier'] : opt['identifier'];
        this._status     = !G.contain(opt['status'] , this._statusRange) ? this._defaultOpt['status'] : opt['status'];
        this._paddingAmount     = G.getValType(opt['paddingAmount']) !== 'Number' ? this._defaultOpt['paddingAmount'] : opt['paddingAmount'];
        this._leftIconType = !G.contain(opt['leftIconType'] , this._leftIconTypeRange) ? this._defaultOpt['leftIconType'] : opt['leftIconType'];
        this._exclution  	= G.getValType(opt['exclution']) !== 'Boolean' ? this._defaultOpt['exclution'] : opt['exclution'];
        this._spreadFn   	= G.getValType(opt['spreadFn']) !== 'Function' ? this._defaultOpt['spreadFn'] : opt['spreadFn'];
        this._shrinkFn   	= G.getValType(opt['shrinkFn']) !== 'Function' ? this._defaultOpt['shrinkFn'] : opt['shrinkFn'];
        this._clickFn   	= G.getValType(opt['clickFn']) !== 'Function' ? this._defaultOpt['clickFn'] : opt['clickFn'];

		this._run();
	}

	InfiniteClassification.prototype = {
		constructor: InfiniteClassification ,
		version: '1.0' ,
		author: '陈学龙' ,

		_initStaticHTML: function(){

		} ,

        _initDynamicHTML: function(){

		} ,

		_initStaticArgs: function(){
        	// 元素
            this._infiniteClassification = G('.infinite-classification' , this._con.get()).first();
            this._itemListSet			 = G('.item-list' 				, this._infiniteClassification.get());
            this._itemSet				 = G('.item' 					, this._infiniteClassification.get());
            this._parentSet			 	 = G('.parent' 					, this._infiniteClassification.get());
            this._newSet                 = G('.new' 					, this._infiniteClassification.get());
            this._numberSet              = G('.number' 					, this._infiniteClassification.get());
            this._switchSet              = G('.switch' 					, this._infiniteClassification.get());

            // 参数类
			this._isOnce = false;
		} ,

        _initDynamicArgs: function(){

		} ,

		_initStatic: function(){
            // 初始化设置
            var i 	= 0;
            var itemList = null;
            var cur      = null;

            /**
             * 初始化设置图标，默认隐藏
             * new
             * number
             * switch
             */
            for (i = 0; i < this._newSet.length; ++i)
            {
                cur = G(this._newSet.get()[i]);

                cur.addClass('hide');
            }

            for (i = 0; i < this._numberSet.length; ++i)
            {
                cur = G(this._newSet.get()[i]);

                cur.addClass('hide');
            }

            for (i = 0; i < this._switchSet.length; ++i)
            {
                cur = G(this._switchSet.get()[i]);

                cur.addClass('hide');
            }

            // 初始化元素相关属性
            for (i = 0; i < this._itemListSet.length; ++i)
            {
                itemList = G(this._itemListSet.get()[i]);

                this._data(itemList.get());
            }

			/*
			 * 根据 status 初始化 spread or shrink，如果是 status = none ，则不做处理
			 */
            if (this._status === 'spread') {
                this.spreadAll();
            }

            if (this._status === 'shrink') {
                this.shrinkAll();
            }

            /**
             * 展开给定的项
             */
            this._spreadSpecifiedItems();

		} ,

		_initDynamic: function(){

		} ,

		// 初始化展开所有提供项
        _spreadSpecifiedItems: function(){
			var itemSet 	= [];
			var i 			= 0;
			var cur     	= null;
			var identifier 	= null;
			var specified   = null;
			var parent		= null;

			for (; i < this._itemSet.length; ++i)
			{
				cur 	   = G(this._itemSet.get()[i]);
				identifier = cur.data('identifier');
				specified  = cur.data('specified');

				if (specified === 'y') {
					this.spreadSpecifiedItem(cur.get());
				} else {
					if (G.contain(identifier , this._identifier)) {
						parent = G('.parent' , cur.get()).first();

						parent.highlight('cur' , this._parentSet.get());

						this.spreadSpecifiedItem(cur.get());
					}
				}
			}
		} ,

        /**
		 * 展开指定项，如果该项是某项的子项，那么其父级也会被展开（按照 父级 -> 子级的顺序展开）
         */
        spreadSpecifiedItem: function(item){
			item = G(item);

			var itemSet = item.parentFind({
				tagName: 'div' ,
				className: 'item'
			} , this._infiniteClassification.get() , false , true).not({
				className: 'item-list'
			}).get();

            itemSet.unshift(item.get());
            itemSet = itemSet.reverse();

			var i 			= 0;
			var cur 		= null;
			var parent		= null;
			var isMenu 		= null;
			var isSpread 	= null;

			for (; i < itemSet.length; ++i)
			{
				cur 	= G(itemSet[i]);
				parent 	= G('.parent' , cur.get()).first();

				isMenu	 = parent.data('isMenu');
				isSpread = parent.data('isSpread');

				if (isMenu === 'n') {
					this.clickForItem(cur.get());
				} else {
					if (isSpread === 'n') {
						this.spread(cur.get());
					}
				}
			}
		} ,

		spreadAll: function(){
        	var i 		= 0;
        	var cur 	= null;
        	var isMenu 	= null;
        	var isSpread = null;
        	var item	 = null;


			for (; i < this._parentSet.length; ++i)
			{
				cur 		= G(this._parentSet.get()[i]);
				isMenu 		= cur.data('isMenu');
				isSpread 	= cur.data('isSpread');

				if (isMenu === 'y' && isSpread === 'n') {
					item = cur.parentFind({
						tagName: 'div' ,
						className: 'item'
					}).not({
						className: 'item-list'
					}).first();

                    this.spread(item.get());
				}
			}
		} ,

		shrinkAll: function(){
            var i 		= 0;
            var cur 	= null;
            var isMenu 	= null;
            var isSpread = null;
            var item	 = null;


            for (; i < this._parentSet.length; ++i)
            {
                cur 		= G(this._parentSet.get()[i]);
                isMenu 		= cur.data('isMenu');
                isSpread 	= cur.data('isSpread');

                if (isMenu === 'y' && isSpread === 'y') {
                    item = cur.parentFind({
                        tagName: 'div' ,
                        className: 'item'
                    }).not({
                        className: 'item-list'
                    }).first();

                    this.shrink(item.get());
                }
            }
		} ,

		// 获取给定 item-list 的层级
		_getFloor: function(itemList){
            itemList = G(itemList);

            // 获取当前项的所有父级 item-list 数量（不包括当前项）
            var itemListSet = itemList.parentFind({
                tagName: 'div' ,
                className: 'item-list'
            } , this._infiniteClassification.get() , false , true);

			// 层级 = 当前项的所有父级项数量 + 当前项（1）
            return itemListSet.length + 1;
		} ,

		// 设置层级
		_setFloor: function(itemList){
			itemList = G(itemList);

			var floorNum = this._getFloor(itemList.get());

            itemList.addClass('floor-' + floorNum);
		} ,

		// 设置层级视觉效果
        _setFloorVisualEffective: function(parent){
			parent = G(parent);

			var itemList = parent.parentFind({
				tagName: 'div' ,
				className: 'item-list'
			} , this._infiniteClassification.get() , false , true).first();

			// console.log(parent.get() , itemList.get());

			var floorNum = this._getFloor(itemList.get());
			var explain  = G('.explain' , parent.get()).first();

            explain.css({
				paddingLeft: (floorNum - 1) * this._paddingAmount + 'px'
			});
		} ,

		// 设置标识符
        _data: function(itemList){
        	itemList = G(itemList);

        	// 当前 item-list 所在层级
        	var floorNum = this._getFloor(itemList.get());

            var itemSet = itemList.children({
                tagName: 'div' ,
                className: 'item'
            } , false , true);

			// 设置当前层的层级
			this._setFloor(itemList.get());

			if (itemSet.length === 0) {
				// console.log('item-list 元素内没有 item 元素');
				return false;
			} else {
				var i 			= 0;
				var cur 		= null;
				var parent 		= null;
				var child		= null;
				var curItemList  = null;
				var curItemSet  = null;
				var flag	    = null;
				var rightIconType    = null;
				var dom_switch	= null;
				var dom_new     = null;
				var number      = null;
				var newCount    = null;
				var newKey      = null;
				var icon		= null;
				var text		= null;
				var explain		= null;

				for (; i < itemSet.length; ++i)
				{
					cur 	    = G(itemSet.get()[i]);
					parent 	    = G('.parent'   , cur.get()).first();
					icon		= G('.icon'   	, parent.get()).first();
                    explain		= G('.explain'     , parent.get()).first();
                    text		= G('.text'     , explain.get()).first();
					flag	    = G('.flag'     , parent.get()).first();
                    rightIconType    = flag.data('iconType');
                    rightIconType    = G.contain(rightIconType , this._rightIconTypeRange) ? rightIconType : this._defaultOpt['rightIconType'];
					dom_new     = G('.new'      , flag.get()).first();
					number      = G('.number'   , flag.get()).first();
					dom_switch  = G('.switch'   , flag.get()).first();
					child  	    = G('.child'    , cur.get()).first();
					curItemList = G('.item-list' , child.get()).first();
					curItemSet  = curItemList.children({
                        tagName: 'div' ,
                        className: 'item'
                    } , false , true);

					// 设置默认收缩值
					parent.data('isSpread' , 'n');

                    child.css({
						height: '0px'
					});

                    // 右边的图表类型
                    if (rightIconType === 'new') {
                        newKey   = this._getNewKey(dom_new.get());
                        newCount = window.localStorage.getItem(newKey);

                        if (G.getValType(newCount) === 'Null') {
                            dom_new.removeClass('hide');
                        } else {
                            dom_switch.removeClass('hide');
                        }
                    }

                    if (rightIconType === 'number') {
                       number.removeClass('hide');
                    }

                    if (rightIconType === 'switch') {
                        dom_switch.removeClass('hide');
                    }

                    // 左边的图标类型（不在第一层级）
					if (floorNum > 1) {
						if (this._leftIconType === 'ico') {
							icon.removeClass('hide');
                            icon.addClass('icon-ico');
						}

                        if (this._leftIconType === 'text') {
							icon.removeClass('hide');
							icon.addClass('icon-text');
                            icon.get().innerHTML = text.get().textContent.slice(0 , 1);
                        }

                        icon.addClass('hide');
					}

					// 设置是否菜单的标识
					if (curItemSet.length === 0) {
                        parent.data('isMenu' , 'n');
                        dom_switch.addClass('hide');
					} else {
                        parent.data('isMenu' , 'y');
					}

					// 设置层级
                    this._setFloor(curItemList.get());

					// 设置层级视觉效果
					this._setFloorVisualEffective(parent.get());

					// 递归 item 设置
					this._data(curItemList.get());
				}
			}
		} ,

		// 展示
		spread: function(item){
			item = G(item);

			var self   = this;
			var isMenu	= item.data('isMenu');
			var parent = G('.parent' , item.get()).first();
			var dom_switch = G('.switch' , parent.get()).first();
            var dom_new  = G('.new' , parent.get()).first();
			var child    = G('.child' , item.get()).first();
			var itemList = G('.item-list' , child.get()).first();

			var curH  = child.getEleH('content-box');
			var endH  = itemList.getEleH('content-box');

            parent.removeClass('parent-shrink');
            parent.addClass('parent-spread');
            parent.addClass('focus');

			parent.data('isSpread' , 'y');

            // 记录项点击次数
            this._setClickCount(dom_new.get());

            // 获取点击次数
            var key 	= this._getNewKey(dom_new.get());
            var count 	= window.localStorage.getItem(key);

            if (G.getValType(count) !== 'Null') {
                count = parseInt(count);

                if (count >= 1) {
                    dom_new.addClass('hide');

                    if (isMenu === 'y') {
                        dom_switch.removeClass('hide');
                    }
                }
            }

			child.animate({
				carTime: this._carTime ,
				json: [
					{
						attr: 'height' ,
						sVal: curH ,
						eVal: endH
					}
				] ,
				fn: function(){
					// 之所以要设置成 auto，是因为其内部可能也有收缩的菜单项
					// 一旦其展开，height 势必会增加，所以不能固定死
					child.css({
						height: 'auto'
					});
				}
			});

			// 判断是否同层级互斥
			if (this._exclution) {
				var siblings = item.siblingFind({} , false , true);
				var i 		 = 0;
				var cur		 = null;

				for (; i < siblings.length; ++i)
				{
					cur = G(siblings.get()[i]);

					this.shrink(cur.get());
				}
			}

            // 展开后回调函数
            if (G.getValType(this._spreadFn) === 'Function') {
                this._spreadFn.call(this , item.get());
            }
		} ,

		// 收缩
		shrink: function(item){
            item = G(item);

            var parent   = G('.parent' , item.get()).first();
            var dom_new  = G('.new' , parent.get()).first();
            var child    = G('.child' , item.get()).first();

            var curH  = child.getEleH('content-box');
            var endH  = 0;

            parent.removeClass('parent-spread');
            parent.addClass('parent-shrink');
			parent.removeClass('focus');

            parent.data('isSpread' , 'n');

            // 记录项点击次数
            this._setClickCount(dom_new.get());

            child.animate({
                carTime: this._carTime ,
                json: [
                    {
                        attr: 'height' ,
                        sVal: curH ,
                        eVal: endH
                    }
                ]
            });

            // 展开后回调函数
            if (G.getValType(this._shrinkFn) === 'Function') {
                this._shrinkFn.call(this , item.get());
            }
		} ,

		// 非多级菜单项点击
		clickForItem: function(item){
            item = G(item);

            var parent   = G('.parent' , item.get()).first();
            var isMenu	 = parent.data('isMenu');
            var dom_new  = G('.new' , parent.get()).first();
            var dom_switch  = G('.switch' , parent.get()).first();

            // 菜单点击才会有这种效果
            if (isMenu === 'y') {
                parent.addClass('focus');
            }

            parent.highlight('cur' , this._parentSet.get());

            // 记录项点击次数
            this._setClickCount(dom_new.get());

            // 获取点击次数
            var key 	= this._getNewKey(dom_new.get());
            var count 	= window.localStorage.getItem(key);

            if (G.getValType(count) !== 'Null') {
                count = parseInt(count);

                if (count >= 1) {
                    dom_new.addClass('hide');

                    if (isMenu === 'y') {
                        dom_switch.removeClass('hide');
                    }
                }
            }
		} ,

		// .item .parent 项点击事件
		clickForParent: function(parent){
			parent		= G(parent);

            var isSpread 	= parent.data('isSpread');
            var isMenu 		= parent.data('isMenu');
            var item		= G(this._getItem(parent.get()));

            if (isMenu === 'n') {
                this._clickEventForItem(item.get());
                return ;
            }

            // 当前项事件
            parent.highlight('cur' , this._parentSet.get());

            if (isSpread === 'y') {
                this.shrink(item.get());
            } else {
                this.spread(item.get());
            }
		} ,
		
		// 非多级菜单项点击事件
		_clickEventForItem: function(item){
			item = G(item);

			this.clickForItem(item.get());

            // 点击类型
            if (G.getValType(this._clickFn) === 'Function') {
                this._clickFn.call(this , item.get());
            }
		} ,

		// 获取 parent 点击项对应的 item 项
		_getItem: function(parent){
			return parent.parentNode;
		} ,

		// .item .parent 项点击事件
        _clickEventForParent: function(event){
			var tar  = G(event.currentTarget);
            var item = G(this._getItem(tar.get()));

			this.clickForParent(tar.get());

			if (G.getValType(this._clickFn) === 'Function') {
				this._clickFn.call(this , item.get());
			}
		} ,

        // 获取给定 item-list 在第一层级对应 item 的 index
        _getTopItemIndex: function(item){
            item = G(item);

            var topItemSet = this._infiniteClassification.children({
                tagName: 'div' ,
                className: 'item-list'
            } , false , true).first().children({
                tagName: 'div' ,
                className: 'item'
            } , false , true);

            var i = 0;
            var cur = null;

            for (; i < topItemSet.length; ++i)
            {
                cur = G(topItemSet.get()[i]);

                if (cur.get() === item.get()) {
                    return i;
                }
            }

            throw new Error('在顶级 item-list 结果集中找不到当前提供项的索引');
        } ,

        // 获取给定 new 元素对应的 localStorage 的 key
        _getNewKey: function(dom_new){
            dom_new = G(dom_new);

            var parentForNewSet = dom_new.parentFind({
                tagName: 'div' ,
                className: 'item'
            } , this._infiniteClassification.get() , false , true).not({
                className: 'item-list'
            });
            var floorNum        = parentForNewSet.length;
            var topItemIndex    = this._getTopItemIndex(parentForNewSet.last().get());
            var sameFloorIndex = dom_new.parentFind({
                tagName: 'div' ,
                className: 'item'
            } , this._infiniteClassification.get() , false , true).not({
                className: 'item-list'
            }).first().siblingTopFind({}).length;

            return 'new-' + topItemIndex + '-' + floorNum + '-' + sameFloorIndex;
        } ,

        // 设置项点击次数（针对 iconType 而言需要统计的资料）
        _setClickCount: function(dom_new){
            dom_new = G(dom_new);

            var key   = this._getNewKey(dom_new.get());
            var count = window.localStorage.getItem(key);

            if (G.getValType(count) === 'Null') {
                window.localStorage.setItem(key , 1);
            } else {
                count = parseInt(count);
                count++;

                window.localStorage.setItem(key , count);
            }
        } ,

		// 显示菜单左边图片/文本
		showIcon: function(){
            var icoSet	= G('.icon-ico'  , this._con.get());
            var textSet	= G('.icon-text' , this._con.get());
            var iconSet = this._leftIconType === 'text' ? textSet : icoSet;
        	var i 	= 0;
        	var cur = null;

        	for (; i < iconSet.length; ++i)
			{
				cur = G(iconSet.get()[i]);

				cur.removeClass('hide');
			}
		} ,

		// 隐藏菜单左边图片|文本
		hideIcon: function(){
            var icoSet	= G('.icon-ico'  , this._con.get());
            var textSet	= G('.icon-text' , this._con.get());
            var iconSet = this._leftIconType === 'text' ? textSet : icoSet;
            var i 	= 0;
            var cur = null;

            for (; i < iconSet.length; ++i)
            {
                cur = G(iconSet.get()[i]);

                cur.addClass('hide');
            }
		} ,

		_defineEvent: function(){
			this._parentSet.loginEvent('click' , this._clickEventForParent.bind(this) , true , false);
		} ,

		_run: function(){
            this._initStaticArgs();
			this._initStaticHTML();
			this._initStatic();
            this._initDynamicArgs();
			this._initDynamicHTML();
			this._initDynamic();

			this._defineEvent();
		}
	};

	return InfiniteClassification;
})();
