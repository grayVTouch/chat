/*
 * author cxl 2016-09-16
 */

/*
  * 分页类
  * @param Element   con          分页容器
  * @param Number    curPage      当前页
  * @param Number    maxPage      总页数
  * @param Number    dp           显示多少分页按钮
  * @param Function  fn           按钮对应的事件

  * 后台反馈会的数据结构：
	{
		status: 'success' ,
		msg: {
			data: [

			] ,
			tr: 10 , 		// 记录数
			dr: 10 , 		// 单页显示多少条记录
			dp: 10 , 		// 文档显示多少个分页按钮
			cur_page: 1 ,  	// 当前页
			max_page: 1	 	// 总页数
		} ,
	}
*/
var AjaxPage = (function(){
	'use strict';

	function AjaxPage(con , opt){
		var thisRange = [null , undefined , window];

		if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== AjaxPage) {
			return new AjaxPage(con , opt);
		}

		this._defaultOpt = {
			curPage: 1 ,
			url: '' ,
			before: null , // 发起请求之前回调（下一步就是发起请求）
            success: null // 成功获取请求之后回调
		};
		
		this._con	  = G(con);
		this._curPage = G.getValType(opt['curPage']) !== 'Number' ? this._defaultOpt['curPage'] : opt['curPage'];
		this._url	  = G.getValType(opt['url']) 	 !== 'String' ? this._defaultOpt['url'] : opt['url'];
		this._before  = G.getValType(opt['before'])  !== 'Function' ? this._defaultOpt['before'] : opt['before'];
		this._success = G.getValType(opt['success']) !== 'Function' ? this._defaultOpt['success'] : opt['success'];

		this._run();
	}

    AjaxPage.prototype = {
		cTime: '2016-09-11 09:52:00' ,
		author: 'cxl' , 
		constructor: AjaxPage ,

		_initStaticHTML: function(){

		} ,
		
		_initDynamicHTML: function(){
			var numType = G.oddEven(this._dp);
			var sp = 1;
			var ep = 1;
			var of = 0;
			var oa = 0;
			var html = [];

			if (numType === 'odd'){
				of = Math.max(0 , Math.ceil((this._dp - 1) / 2));
				oa = Math.max(0 , this._dp - 1 - of);
			}

			if (numType === 'even'){
				of = Math.max(0 , this._dp / 2 - 1);
				oa = Math.max(0 , this._dp / 2);
			}

			if (this.maxPage <= this._dp) {
				sp = 1;
				ep = this.maxPage;
			} else {
				if (this._curPage <= this._dp) {
					sp = 1;
					ep = this._dp;
				} else {
					if (this._curPage + oa >= this.maxPage) {
						sp = this.maxPage - of - oa;
						ep = this.maxPage;
					} else {
						sp = this._curPage - of;
						ep = this._curPage + oa;
					}
				}
			}

			for (var i = sp; i <= ep; ++i)
				{

						html.push("<button class='page-btn " + ((i === this._curPage) ? 'cur-page-btn' : '') + "'>" + i + "</button> ");
				}

			this._pageBtnList.get().innerHTML 	= html.join('');
			this._curPageEle.get().textContent  = this._curPage;
			this._totalPage.get().textContent 	= this.maxPage;
			this._totalRecord.get().textContent = this.tr;
		} ,

		_initStaticArgs: function(){
			this._ajaxPage = G('.ajax-page' , this._con.get()).first();
			this._pageBtnList    = G('.page-btn-list' , this._ajaxPage.get()).first();
			this._home    = G('.homepage-btn' , this._ajaxPage.get()).first();
			this._prev    = G('.prev-btn' , this._ajaxPage.get()).first();
			this._next    = G('.next-btn' , this._ajaxPage.get()).first();
			this._pageInfoContainer = G('.page-info-container' , this._ajaxPage.get()).first();
			this._curPageEle		= G('.cur-page' , this._pageInfoContainer.get()).first();
			this._totalPage			= G('.total-page' , this._pageInfoContainer.get()).first();
			this._totalRecord		= G('.total-record' , this._pageInfoContainer.get()).first();
			this._toPage 		= G('.to-page' , this._ajaxPage.get()).first();
			this._toPageInput   = G('.to-page-input' , this._toPage.get()).first();
			this._toPageBtn   	= G('.to-page-btn' , this._toPage.get()).first();
			this._goToPage 		= G('.go-to-page' , this._toPageInput.get()).first();
			this._goToBtn    	= G('.go-to-btn' , this._toPageBtn.get()).first();
			this._end			= G('.endpage-btn' , this._ajaxPage.get()).first();

			this._disabledCn = 'disabled';

			this._ajaxObj = null;

			this._viewTip = new ViewTip(this._toPageInput.get() , {
				text: '请输入数字' , 
				carTime: 200 ,
				isShowTriangle: true ,
                showTipDuration: 800 ,
				isBindEvent: false
			});
		} ,
		
		_initDynamicArgs: function(){
			this._btnSet    = G('.page-btn' , this._pageBtnList.get());

			// 设置按钮风格
			this.setPageStyle();

			if (this.tr > 0) {
				this._ajaxPage.removeClass('hide');
			} else {
				this._ajaxPage.addClass('hide');
			}
		} ,


        _init: function(){
            var self = this;
            this._initStaticHTML();
            this._initStaticArgs();

            this._requestData(function(){
                self._initStaticHTML();
                self._initStaticArgs();
                self._initDynamicHTML();
                self._initDynamicArgs();
                self._defineStaticEvent();
                self._defineDynamicEvent();
            });
        } ,

		home: function(){
			this.linkTo(1);
		} , 
		
		prev: function(){
			if (this._curPage > 1) {
                this.linkTo(this._curPage - 1);
			}
		} , 
		
		next: function(event){
			if (this._curPage < this.maxPage) {
				this.linkTo(this._curPage + 1);
			}
		} , 
		
		_goTo: function(){
			var page = this._goToPage.get().value;
			var reg  = /^\d+$/;

			if (reg.test(page) === false) {
				this._viewTip.setText('格式不正确');
				this._viewTip.show();
                return ;
			}

			page = parseInt(page);

            if (page > this.maxPage) {
                this._viewTip.setText('大于最大值');
                this._viewTip.show();
                return ;
            }

            if (page < 1) {
                this._viewTip.setText('小于最小值');
                this._viewTip.show();
                return ;
            }

            this.linkTo(page);
		} ,

        _goToPageEvent: function(event){
			if (event.keyCode === 13) {
				this._goTo();
			}
		} ,
		
		_btnEvent: function(event){
			var cur  = G(event.currentTarget);
			var page = parseInt(cur.get().textContent);

			this.linkTo(page);
		} , 
		
		end: function(){
			this.linkTo(this.maxPage);
		} ,
		
		setPageStyle: function(){
			if (this._curPage > 1 && this._curPage < this.maxPage) {
				this._prev.removeClass(this._disabledCn);
				this._next.removeClass(this._disabledCn);
			} else {
				if (this._curPage == 1) {
					this._prev.addClass(this._disabledCn);
				} else {
                    this._prev.removeClass(this._disabledCn);
				}
				
				if (this._curPage == this.maxPage) {
					this._next.addClass(this._disabledCn);
				} else {
                    this._next.removeClass(this._disabledCn);
				}
			}
		} , 
		
		linkTo: function(page){
			var self 		= this;
			this._curPage 	= page;

            // this.setPageStyle();

			this._requestData(function(){
                self._initDynamicHTML();
                self._initDynamicArgs();
                self._defineDynamicEvent();
            });
		} ,
		
		_requestData: function(success){
			var self = this;

			if (G.getValType(this._before) === 'Function') {
				this._before.call(this);
			}

			if (G.isValidVal(this._ajaxObj)) {
				this._ajaxObj.get().abort();
			}

			this._ajaxObj = G.ajax({
				method: 'get' ,
				url: this._url + this._curPage ,
				isAsync: true , 
				success: function(json){
					var data = G.jsonDecode(json);

					if (data['status'] === 'failed') {
						if (G.getValType(self._fail) === 'Function') {
							self._fail.call(self);
						} else {
							console.log(data['msg']);
						}
					} else {
						data = data['msg'];

                        self.curPage 	= parseInt(data['cur_page']);
                        self.maxPage 	= parseInt(data['max_page']);
                        self.tr 		= parseInt(data['tr']);
                        self._dp 		= parseInt(data['dp']);
                        self._dr   		= parseInt(data['dr']);
                        self.data 		= data['data'];

                        // 数据初始化后必须要做的事情
                        if (G.getValType(success) === 'Function') {
                            success();
						}

						// 完成 AjaxPage 整套工作流程后执行的回调
                        if (G.getValType(self._success) === 'Function') {
                            self._success.call(this , {
                            	curPage: self.curPage ,
								maxPage: self.maxPage ,
								tr: self.tr ,
								data: self.data
							});
                        }
					}
				}
			});
		} ,

		// 重载数据(服务器端更新后)
		reload: function(){
			this.linkTo(this.curPage);
		} ,

        // 定义静态事件
        _defineStaticEvent: function(){
            this._home.loginEvent('click' , this.home.bind(this) , false , false);
            this._prev.loginEvent('click' , this.prev.bind(this) , false , false);
            this._next.loginEvent('click' , this.next.bind(this) , false , false);
            this._goToPage.loginEvent('keyup' , this._goToPageEvent.bind(this) , false , false);
            this._goToBtn.loginEvent('click' , this._goTo.bind(this) , false , false);
            this._end.loginEvent('click' , this.end.bind(this) , false , false);
        } ,

        // 定义动态事件
        _defineDynamicEvent: function(){
            this._btnSet.loginEvent('click' , this._btnEvent.bind(this) , false , false);
        } ,

		_run: function(){
			this._init();
		}
	};

	return AjaxPage;
})();