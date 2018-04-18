/*
 * author grayVTouch
 * 链接方式跳转分页类
 * @param  Element con
 * @param  Object  opt
 */
var LinkPage = (function(){
	var LinkPage = function(con , opt){
		var thisRange = [undefined , null , window];

		if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== LinkPage) {
			return new LinkPage(con , opt);
		}

		if (!G.isDOMEle(con)) {
			throw new Error('参数 1 类型错误');
		}
		
		this._defaultOpt = {
			tr: 1 , 
			curPage: 1 , 
			maxPage: 1 , 
			sPage: 1 , 
			ePage: 1 , 
			linkTo: '' , 
			carTime: 150 , 
			field: 'cur_page' , // 分页字段
			suffix: '' // 链接尾部附加数据
		};

		if (G.getValType(opt) === 'Undefined') {
			opt = this._defaultOpt;
		}
		
		this._totalRecord = G.getValType(opt['tr']) !== 'Number'  ? this._defaultOpt['tr']		: opt['tr'];
		this._curPage = G.getValType(opt['curPage']) !== 'Number' ? this._defaultOpt['curPage'] : opt['curPage'];
		this._maxPage = G.getValType(opt['maxPage']) !== 'Number' ? this._defaultOpt['maxPage'] : opt['maxPage'];
		this._sPage	  = G.getValType(opt['sPage']) !== 'Number'	  ? this._defaultOpt['sPage']	: opt['sPage'];
		this._ePage   = G.getValType(opt['ePage']) !== 'Number'   ? this._defaultOpt['ePage']	: opt['ePage'];
		this._carTime = G.getValType(opt['carTime']) !== 'Number' ? this._defaultOpt['carTime'] : opt['carTime'];
		this._linkTo  = G.getValType(opt['linkTo']) !== 'String'  ? this._defaultOpt['linkTo']  : opt['linkTo'];
		this._field   = G.getValType(opt['field']) !== 'String'   ? this._defaultOpt['field']   : opt['field'];
		this._suffix  = G.getValType(opt['suffix']) !== 'String'  ? this._defaultOpt['suffix']  : opt['suffix'];

		// 获取相关元素
		this._con			 = G(con);
		this._pageArea		 = G('.page-area'		, this._con.get()).first();
		this._homepageBtn	 = G('.homepage-btn'	, this._pageArea.get()).first(); 
		this._prevBtn		 = G('.prev-btn'		, this._pageArea.get()).first();
		this._nextBtn		 = G('.next-btn'		, this._pageArea.get()).first();
		this._curPageEle     = G('.cur-page'		, this._pageArea.get()).first();
		this._totalPageEle	 = G('.total-page'		, this._pageArea.get()).first();
		this._totalRecordEle = G('.total-record'	, this._pageArea.get()).first();
		this._pageGoToInp	 = G('.page-goto-inp'	, this._pageArea.get()).first();
		this._pageGoToBtn	 = G('.page-goto-btn'	, this._pageArea.get()).first();
		this._endpageBtn	 = G('.endpage-btn'		, this._pageArea.get()).first();
		this._linkListCon    = G('.link-list'		, this._pageArea.get()).first();

		// 初始化程序
		this._run();
	};

	LinkPage.prototype = {
		constructor: LinkPage , 
		author: 'grayVTouch' , 
		version: '1.0' ,

		_initStaticHTML: function(){
			if (this._curPage === 1) {
				this._prevBtn.get().setAttribute('data-canPrev' , 'n');
				this._prevBtn.addClass('disabled-btn');
			} else {
				this._prevBtn.get().setAttribute('data-canPrev' , 'y');
				this._prevBtn.removeClass('disabled-btn');
			}

			if (this._curPage === this._maxPage) {
				this._nextBtn.get().setAttribute('data-canNext' , 'n');
				this._nextBtn.addClass('disabled-btn');
			} else {
				this._nextBtn.get().setAttribute('data-canNext' , 'y');
				this._nextBtn.removeClass('disabled-btn');
			}

			// 填充分页按钮
			var i	 = 0;
			var html = '';
			
			// console.log(this._sPage , this._ePage);
			for (i = this._sPage; i <= this._ePage; ++i)
				{
					html += '<a href="' + this._genLink(i) + '" class="page-btn page-link ' + (this._curPage === i ? 'focus-page-btn' : '') + '">' + i + '</a>';
				}
			
			this._linkListCon.get().innerHTML = html;

			this._curPageEle.get().textContent     = this._curPage;
			this._totalPageEle.get().textContent   = this._maxPage;
			this._totalRecordEle.get().textContent = this._totalRecord;
		} ,

		_initDynamicHTML: function(){
		
		} ,

		_initStaticArgs: function(){
			this._inpViewTip = new ViewTip(this._pageGoToInp.get() , {
				text: '' , 
				carTime: this._carTime , 
				isShowTriangle: true , 
				isBindEvent: false , 
				showTipDuration: 800 ,
				// 坐标类型
				coordType: 'win'
			});

			// 页数正则
			this._pageReg = /^\d+$/;
			
			// 页数提示
			this._pageGoToInpEmptyTip = '页数尚未填写';

			// 页数正则提示
			this._pageGoToInpRegTip   = '页数格式错误';
		} ,

		_initDynamicArgs: function(){
		
		} ,

		// 分页自定义页数验证
		_checkPageInp: function(){
			var pageVal = this._pageGoToInp.get().value;

			if (pageVal === '') {
				this._inpViewTip.setText(this._pageGoToInpEmptyTip);
				this._inpViewTip.show();
				return false;
			}

			if (!this._pageReg.test(pageVal)) {
				this._inpViewTip.setText(this._pageGoToInpRegTip);
				this._inpViewTip.show();
				return false;
			}

			return true;
		} ,
		
		// 生成链接
		_genLink: function(page){
			// 如果链接中存在 cur_page 连接，则需要过滤掉.
			if (this._linkTo.search(this._field) !== -1) {
				var rReg = new RegExp('(\\?|&){1}' + this._field + '=\\d*(#.+)?' , 'g');

				this._linkTo  = this._linkTo.replace(rReg , '');
				
				// 查看替换后链接最后一个字符
				var lastStr = this._linkTo.slice(-1);
				
				// 链接处理
				if (lastStr !== '?' && lastStr !== '&') {
					if (this._linkTo.lastIndexOf('?') === -1) {
						this._linkTo += '?';
					} else {
						this._linkTo += '&';
					}
				}

				this._linkTo += this._field + '=';
			}
			
			// 生成链接信息
			return this._linkTo + page + this._suffix;
		} ,
		
		_homepageEvent: function(){
			window.location.href = this._genLink(1);
		} ,

		_endpageEvent: function(){
			window.location.href = this._genLink(this._maxPage);
		} ,

		_prevEvent: function(){
			var canPrev = this._prevBtn.get().getAttribute('data-canPrev') === 'y' ? true : false;

			if (canPrev) {
				window.location.href = this._genLink(this._curPage - 1);
			}
		} ,
		
		_nextEvent: function(){
			var canNext = this._nextBtn.get().getAttribute('data-canNext') === 'y' ? true : false;

			if (canNext) {
				window.location.href = this._genLink(this._curPage + 1);
			}
		} ,
		
		_inpGoToEvent: function(event){
			if (event.keyCode === 13) {
				// 分页验证
				if (!this._checkPageInp()) {
					return ;
				}
				
				var pageVal = this._pageGoToInp.get().value;

				window.location.href = this._genLink(pageVal);
			}
		} , 
		
		_linkGoToEvent: function(){
			// 分页验证
			if (!this._checkPageInp()) {
				return ;
			}
			
			var pageVal = this._pageGoToInp.get().value;

			window.location.href = this._genLink(pageVal);
		} ,

		_defineEvent: function(){
			this._homepageBtn.loginEvent('click'   , this._homepageEvent.bind(this)  , false , false);
			this._prevBtn.loginEvent('click'	   , this._prevEvent.bind(this)		 , false , false);
			this._nextBtn.loginEvent('click'	   , this._nextEvent.bind(this)		 , false , false);
			this._pageGoToInp.loginEvent('keydown' , this._inpGoToEvent.bind(this)   , false , false);
			this._pageGoToBtn.loginEvent('click'   , this._linkGoToEvent.bind(this)  , false , false);
			this._endpageBtn.loginEvent('click'    , this._endpageEvent.bind(this)   , false , false);
		} ,
		
		_run: function(){
			this._initStaticHTML();
			this._initDynamicHTML();
			this._initStaticArgs();
			this._initDynamicArgs();
			this._defineEvent();
		}
	};

	return LinkPage;
})();