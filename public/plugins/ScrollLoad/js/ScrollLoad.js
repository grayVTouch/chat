/*
 ***********************************
 * Author 陈学龙 2016-11-16 22:20:00
 * 修改时间

   第一次修改时间：2017/02/24 15:13:00
 ***********************************
 */
var ScrollLoad = (function(){
	'use strcit';

	function ScrollLoad(con , opt){
		var thisRange = [window , undefined , null];

		if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== ScrollLoad) {
			return new ScrollLoad(con , opt);
		}
		
		this._defaultOpt = {
			scrollCon: window ,		// 滚动加载的容器元素（默认是以 body 元素作为容器元素）
			url: '' ,						// 请求路径 
			success: null ,					// 成功时回调
			error: null ,					// 失败时回调
			initStatus: 'request' ,			// 页面载入完成后就请求还是不请求
			method: 'get' ,					// 请求方法
			sendData: null ,				// 要发送的数据
			curPage: 1 ,					// 当前页
			extraH: 200	 ,					// 当滚动到距离元素底部多少时开始请求
			beforeAjaxOpen: null ,			// 在 Ajax 发送请求之前
			urlIsAddPage: true				// 是否追加 curPage

		};

		if (G.getValType(opt) === 'Undefined') {
			var opt = this._defaultOpt;
		}
		
		this._initStatusRange	= ['request' , 'none'];
		this._methodRange		= ['get' , 'post'];
		this._url				= G.getValType(opt['url']) !== 'String'					? this._defaultOpt['url']			: opt['url'];
		this._initStatus		= !G.contain(opt['initStatus'] , this._initStatusRange) ? this._defaultOpt['initStatus']	: opt['initStatus'];
		this._method			= !G.contain(opt['method'] , this._methodRange)			? this._defaultOpt['method']		: opt['method'];
		this._curPage			= G.getValType(opt['curPage']) !== 'Number'				? this._defaultOpt['curPage']		: opt['curPage'];
		this._extraH			= G.getValType(opt['extraH']) !== 'Number'				? this._defaultOpt['extraH']		: opt['extraH'];
		this._urlIsAddPage		= G.getValType(opt['urlIsAddPage']) !== 'Boolean'		? this._defaultOpt['urlIsAddPage']	: opt['urlIsAddPage'];
		this._scrollCon			= !G.isDOMEle(opt['scrollCon'])							? G(this._defaultOpt['scrollCon'])	: G(opt['scrollCon']);
		this._con = G(con);
		this._sendData			= opt['sendData'];
		this._beforeAjaxOpen    = opt['beforeAjaxOpen'];
		this._success			= opt['success'];
		this._error				= opt['error'];
		this._tip				= G('.scroll_load'		, this._con.get()).first();
		this._loading			= G('.loading_data'		, this._tip.get()).first();
		this._loadMoreData		= G('.load_more_data'	, this._tip.get()).first();
		this._noMoreData		= G('.no_more_data'		, this._tip.get()).first();
		this._noData			= G('.no_data'			, this._tip.get()).first();
		
		this._run();
	}

	ScrollLoad.prototype = {
		cTime: '2016-11-16 22:36:00' ,
		version: '2.0' ,
		constructor: ScrollLoad ,
		author: '陈学龙' ,
		
		// 设置静态参数
		_initStaticArgs: function(){
			this._isLoading = false;
		} ,
		
		// 设置动态参数
		_initDynamicArgs: function(){
			
		} ,
		
		// 判断是否达到加载的位置
		_scrollEvent: function(){
			if (G.getValType(this._scrollCon.get()) === 'Window') {
				var maxH	   = document.documentElement.scrollHeight;
				var scrollYVal = window.pageYOffset;
				var clientH	   = document.documentElement.clientHeight;
				var curH	   = Math.max(0 , Math.min(maxH , scrollYVal + clientH));
				var extraH	   = this._extraH;
			} else {
				// scrollHeight - clientHeight =可滑动的范围！
				var maxH	   = this._scrollCon.get().scrollHeight - this._scrollCon.get().clientHeight;
				var curH	   = Math.max(0 , Math.min(maxH , this._scrollCon.get().scrollTop));
				var extraH	   = this._extraH;
			}

			if (curH >= maxH - extraH) {
				if (!this._isLoading) {
					this._loadMoreDataEvent();
				}
			}
		} , 
		
		// 加载更多
		_loadMoreDataEvent: function(){
			var self		= this;
			this._isLoading = true;

			this._switchTip('loading');
			
			// 发送请求之前调用
			if (G.getValType(this._beforeAjaxOpen) === 'Function') {
				this._beforeAjaxOpen(this);
			}
			
			G.ajax({
				method: this._method , 
				url: this._url + (this._urlIsAddPage ? this._curPage++ : '') ,
				isAsync: true , 
				sendData: this._sendData ,
				success: function(data){
					self._isLoading = false;
					

					if (G.getValType(self._success) === 'Function') {
						self._success.call(self , data);
					}
				} , 
				error: function(){
					if (G.getValType(self._error) === 'Function') {
						self._error();
					}
				}
			});

		} ,
		
		// 没有数据
		noData: function(){
			this._isLoading = true;

			this._switchTip('no_data');	
		} ,
		
		// 已经到底了
		noMoreData: function(){
			this._isLoading = true;

			this._switchTip('no_more');	
		} , 
		
		// 加载更多
		loadMore: function(){
			this._switchTip('load_more');
		} ,
		
		// 隐藏所有
		hide: function(){
			this._switchTip('none');
		} ,
		
		// 切换提示
		_switchTip: function(type){
			var typeRange = ['none' , 'loading' , 'load_more' , 'no_more' , 'no_data'];

			if (!G.contain(type , typeRange)) {
				throw new RangeError('不支持的类型，当前受支持的类型有：' + typeRange.join(' '));
			}
			
			this._tip.removeClass('hide');

			if (type === 'none') {
				this._tip.addClass('hide');
				this._loading.addClass('hide');
				this._loadMoreData.addClass('hide');
				this._noMoreData.addClass('hide');
				this._noData.addClass('hide');
			}

			if (type === 'loading') {
				this._loading.removeClass('hide');
				this._loadMoreData.addClass('hide');
				this._noMoreData.addClass('hide');
				this._noData.addClass('hide');
			}

			if (type === 'load_more') {
				console.log();
				this._loading.addClass('hide');
				this._loadMoreData.removeClass('hide');
				this._noMoreData.addClass('hide');
				this._noData.addClass('hide');
			}

			if (type === 'no_more') {
				this._loading.addClass('hide');
				this._loadMoreData.addClass('hide');
				this._noMoreData.removeClass('hide');
				this._noData.addClass('hide');
			}

			if (type === 'no_data') {
				this._loading.addClass('hide');
				this._loadMoreData.addClass('hide');
				this._noMoreData.addClass('hide');
				this._noData.removeClass('hide');
			}
		} ,
		
		// 事件定义
		_defineEvent: function(){
			this._scrollCon.loginEvent('scroll' , this._scrollEvent.bind(this) , true , false);
		} ,

		// URL 重定义
		setUrl: function(url){
			this._url = url;
		} ,
		
		// go
		_run: function(){
			this._initStaticArgs();
			this._initDynamicArgs();

			if (this._initStatus === 'request') {
				this._loadMoreDataEvent();
			} else {
				this._switchTip('none');
			}

			this._defineEvent();	
		}
	};

	return ScrollLoad;
})();