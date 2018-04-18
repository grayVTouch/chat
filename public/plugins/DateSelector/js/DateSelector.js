/*
  * author 陈学龙 2016-09-16
*/

/*
  * 日期选择器
  * @param  Element  ele   表单元素
  * @param  Object   opt   设置
	// 默认设置
	opt = {
		type: 'date_time' ,		// 选择器类型：date | date_time
		duration: 10 ,		    // 根据当前年份，前后年份间隔（例如：当前是2017年，间隔10，则最小年份：2017-10=2007；最大年份2017+10=2027） 
		carTime: 250			// 动画效果时间
	};
  * @return undefined
*/
var DateSelector = (function(){
	'use strict';

	function DateSelector(ele , opt){
		var thisRange = [window , null , undefined];

		if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== DateSelector) {
			return new DateSelector(ele , opt);
		}

		var d	 = new Date();
		var year = d.getFullYear();

		// 添加日期节点
		if (G.getValType(ele._dateSelector) === 'Undefined') {
			var div = document.createElement('div');
				div.className = 'date_picker';

			document.body.appendChild(div);

			this._con		   = G(div);
			ele._dateSelector  = div;
		} else {
			this._con = G(ele._dateSelector);
		}

		// 默认设置
		this._defaultOpt = {
			type: 'date_time' ,		// 选择器类型：date | date_time
			duration: 10 ,		    // 根据当前年份，前后年份间隔（例如：当前是2017年，间隔10，则最小年份：2017-10=2007；最大年份2017+10=2027）
			sYear: 1990 , 			// 开始年份
			eYear: (new Date()).getFullYear() + 30 , // 结束年份：往后 30 年
			carTime: 250			// 动画效果时间
		};
		
		if (G.getValType(opt) === 'Undefined') {
			opt = this._defaultOpt;
		}

		this._typeRange			= ['date' , 'date_time'];
		this._duration			= G.getValType(opt['duration']) !== 'Number' ? this._defaultOpt['duration'] : opt['duration'];
		this._sYear				= G.getValType(opt['sYear']) !== 'Number' ? this._defaultOpt['sYear'] : opt['sYear'];
		this._eYear				= G.getValType(opt['eYear']) !== 'Number' ? this._defaultOpt['eYear'] : opt['eYear'];
		this._carTime           = G.getValType(opt['carTime']) !== 'Number'  ? this._defaultOpt['carTime']  : opt['carTime'];
		this._type              = !G.contain(opt['type'] , this._typeRange)  ? this._defaultOpt['type']     : opt['type'];
		this._ele				= G(ele);

		this._run();
	}
   
	DateSelector.prototype = {
		author: 'cxl' , 
		cTime: '2016-09-16' , 
		constructor: DateSelector , 

		_initHTML: function(){
			var html = '';
			html+="  <div class='year_month'>  ";
			html+="  <div class='prev'>&lt;</div>  ";
			html+="  <div class='next'>&gt;</div>  ";
			html+="  <div class='ym_con'>  ";
			html+="  <select class='year_selector hide'></select><span class='year'>0000</span>&nbsp;年  ";
			html+="  <select class='month_selector hide'></select><span class='month'>0</span>&nbsp;月  ";
			html+="  </div>  ";
			html+="  </div>  ";
			html+="  <div class='date'>  ";
			html+="  <div class='date_of_week selector'>  ";
			html+="  <span class='num'>日</span>  ";
			html+="  <span class='num'>一</span>  ";
			html+="  <span class='num'>二</span>  ";
			html+="  <span class='num'>三</span>  ";
			html+="  <span class='num'>四</span>  ";
			html+="  <span class='num'>五</span>  ";
			html+="  <span class='num'>六</span>  ";
			html+="  </div>  ";
			html+="  <div class='date_selector selector'></div>  ";
			html+="  </div>  ";
			html+="  <div class='close'>  ";
			html+="  <div class='select_time'>  ";
			html+="  <div class='cur_time'>  ";
			html+="  <span class='time_explain'>时间</span>  ";
			html+="  <span class='hour'>00</span>&nbsp;: ";
			html+="  <span class='min'>00</span>&nbsp;:  ";
			html+="  <span class='sec'>00</span>  ";
			html+="  </div>  ";
			html+="  <div class='close_btn'>确认</div>  ";
			html+="  <div class='today'>今天</div>  ";
			html+="  <div class='hour_selector selector_con hide'>  ";
			html+="  <h5 class='tit'>选择时</h5>  ";
			html+="  <div class='selector'></div>  ";
			html+="  </div>  ";
			html+="  <div class='min_selector selector_con hide'>  ";
			html+="  <h5 class='tit'>选择分</h5>  ";
			html+="  <div class='selector'></div>  ";
			html+="  </div>  ";
			html+="  <div class='sec_selector selector_con hide'>  ";
			html+="  <h5 class='tit'>选择秒</h5>  ";
			html+="  <div class='selector'></div>  ";
			html+="  </div>  ";
			html+="  </div>  ";
			html+="  </div>  ";

			this._con.get().innerHTML = html;

		} , 
		
		_initStaticArgs: function(){
			// var year = new Date().getFullYear();

			// this._startYear	= year - this._duration;
			// this._endYear	= year + this._duration;
			this._startYear = this._sYear;
			this._endYear   = this._eYear;
		} ,
		
		_initDynamicArgs: function(isResetPos , isToday){
			this._yearMonthCon    = G('.year_month'		, this._con.get()).first();
			this._dateCon		  = G('.date'			, this._con.get()).first();
			this._closeCon		  = G('.close'			, this._con.get()).first();
			this._prevBtn         = G('.prev'			, this._yearMonthCon.get()).first();
			this._nextBtn         = G('.next'			, this._yearMonthCon.get()).first();
			this._yearSelector    = G('.year_selector'	, this._yearMonthCon.get()).first();
			this._monthSelector   = G('.month_selector' , this._yearMonthCon.get()).first();
			this._year			  = G('.year'			, this._yearMonthCon.get()).first();
			this._month			  = G('.month'			, this._yearMonthCon.get()).first();
			this._dateOfWeek	  = G('.date_of_week'	, this._dateCon.get()).first();
			this._dSelector		  = G('.date_selector'	, this._dateCon.get()).first();
			this._weekNum		  = G('.num'			, this._dateOfWeek.get());

			// 按钮 + 时间区域
			this._selectTimeCon   = G('.select_time' , this._closeCon.get()).first();
			// 时间操作区域
			this._timeSelectorCon = G('.cur_time'	 , this._selectTimeCon.get()).first();

			// 时分秒 显示内容
			this._hour = G('.hour'  , this._selectTimeCon.get()).first();
			this._min  = G('.min'	, this._selectTimeCon.get()).first();
			this._sec  = G('.sec'	, this._selectTimeCon.get()).first();
			
			// 时分秒 操作区域
			this._hourSelectorCon	= G('.hour_selector'	, this._selectTimeCon.get()).first();
			this._minSelectorCon	= G('.min_selector'		, this._selectTimeCon.get()).first();
			this._secSelectorCon	= G('.sec_selector'		, this._selectTimeCon.get()).first();

			// 时分秒 选择区域
			this._hourSelector	= G('.selector' , this._hourSelectorCon.get()).first();
			this._minSelector	= G('.selector' , this._minSelectorCon.get()).first();
			this._secSelector	= G('.selector' , this._secSelectorCon.get()).first();
			
			// 按钮：今天
			this._todayBtn		= G('.today'	 , this._selectTimeCon.get()).first();
			// 按钮：确认
			this._closeBtn		= G('.close_btn' , this._selectTimeCon.get()).first();
		   
			this._unit		= 'px';
			this._unitageW	= this._weekNum.first(true).getTW();
			this._unitageH  = this._unitageW;
			this._maxW		= this._unitageW * this._weekNum.length;
			this._closeH	= this._closeCon.getEleH('content-box');


			/*** 初始化操作 ***/
			this._ele.get()['readOnly'] = true;
			this._YMSelectorOpr();

			if (this._type === 'date') {
			  this._timeSelectorCon.addClass('hide');
			}
			
			this._con.css({
				width: this._maxW + this._unit
			});

			this._prevBtn.css({
				width: this._unitageW + this._unit ,
				height: this._unitageH + this._unit , 
				lineHeight: this._unitageH + this._unit
			});

			this._nextBtn.css({
				width: this._unitageW + this._unit ,
				height: this._unitageH + this._unit ,
				lineHeight: this._unitageH + this._unit
			});

			var isResetPos = G.getValType(isResetPos) !== 'Boolean' ? true  : isResetPos;
			var isToday	   = G.getValType(isToday)    !== 'Boolean' ? false : isToday;

			if (this._type === 'date_time') {
				if (this._ele.get().value !== '' && isToday === false) {
					var val = this._ele.get().value;
					var arr = val.split(' ');

					if (arr.length === 2) {
						var d = arr[0].split('-');
						var carTime = arr[1].split(':');

						if (d.length !== 3 || carTime.length !==3) {
							throw new Error('日期时间格式不正确！！');
						}

						var year  = parseInt(d[0]);
						var month = parseInt(d[1]);
						var date  = parseInt(d[2]);
						var hour  = parseInt(carTime[0]);
						var min   = parseInt(carTime[1]);
						var sec   = parseInt(carTime[2]);
					} else {
                        throw new Error('日期时间格式不正确！！');
					}
				} else {
					var d	  = new Date();
					var year  = d.getFullYear();
					var month = d.getMonth() + 1;
					var date  = d.getDate();
					var hour  = d.getHours();
					var min   = d.getMinutes();
					var sec   = d.getSeconds();
				}

				if (hour < 10) {
					hour = '0' + hour;
				}

				if (min < 10) {
					min = '0' + min;
				}

				if (sec < 10) {
					sec = '0' + sec;
				}

				this._hour.get().textContent = hour;
				this._min.get().textContent  = min;
				this._sec.get().textContent  = sec;

				this._initYear(year);
				this._initMonth(month);
				this._initDate(year , month , date);

				this._initHour(hour);
				this._initMinute(min);
				this._initSecond(sec);

				this._dateNum		  = G('.cur_num'  , this._dateCon.get()); 
				this._dateNumDiabled  = G('.disabled' , this._dateCon.get());
				this._hourNum		  = G('.num' , this._hourSelector.get());
				this._minNum		  = G('.num' , this._minSelector.get());
				this._secNum		  = G('.num' , this._secSelector.get());
			} else {
				if (this._ele.get().value !== '' && isToday === false) {
					var val = this._ele.get().value;
					  var d = val.split('-');

					  if (d.length !== 3) {
						console.log('日期时间格式不正确！！');
						return ;
					  }

					  year  = parseInt(d[0]);
					  month = parseInt(d[1]);
					  date  = parseInt(d[2]);
				} else {
					var d	  = new Date();
					var year  = d.getFullYear();
					var month = d.getMonth() + 1;
					var date  = d.getDate();
				}

				this._initYear(year);
				this._initMonth(month);
				this._initDate(year , month , date);

				this._dateNum = G('.cur_num' , this._dateCon.get());

				this._dateNumDiabled  = G('.disabled' , this._dateCon.get());
			}

			if (isResetPos) {
				var leftVal = this._ele.getDocOffsetVal('left');
				var topVal  = this._ele.getDocOffsetVal('top') + this._ele.getEleH('border-box') + 5; 

				this._con.css({
					left: leftVal + this._unit , 
					top: topVal + this._unit
				});
			}

			this._curYear  = year;
			this._curMonth = month;
			this._curDate  = date;
			
			// 如果未定义移动事件，则定义移动事件
			if (G.getValType(this._con.get().isDefineMoveEvent) !== 'Boolean') {
				this._con.move(document.body);
			}
		} ,

		/*
		   * 公历
		   * 1 3 5 7 8 10 12  都是31天
		   * 4 6 9 11         都是30天
		   * 2 月 平年28天 ， 闰年29天
		   * 平年 365 天 ， 闰年 366天
		*/
		getTotalDay: function(year , month){
			var to = [1 , 3 ,5 , 7 , 8 , 10 , 12];
			var tt = [4 , 6 , 9 , 11];

			if (G.contain(month , to)) {
				return 31;
			}

			if (G.contain(month , tt)) {
				return 30;
			}

			if (year % 4 === 0) {
				return 29;
			}

			return 28;
		} ,
		// 获取一月中最后一天对应的 星期
		getLastDayWeek: function(year , month , date){
		  var d = new Date();
			  d.setFullYear(year);
			  d.setMonth(month - 1);
			  d.setDate(date);

		  return d.getDay();
		} , 

		// 操作 年选择器 月选择器
		_YMSelectorOpr: function(act , type){
			var type = G.getValType(type) === 'Undefined'  || (type !== 'year' && type !== 'month') ? 'all'  : type;
			var act  = G.getValType(act)  === 'Undefined'  || (act !== 'show' && act !== 'hide')    ? 'hide' : act;

			if (act === 'show') {
				if (type === 'all') {
					this._yearSelector.removeClass('hide');
					this._monthSelector.removeClass('hide');
				} else if (type === 'year') {
					this._yearSelector.removeClass('hide');
				} else {
					this._monthSelector.removeClass('hide');		
				}
			} else {
				if (type === 'all') {
					this._yearSelector.addClass('hide');
					this._monthSelector.addClass('hide');
				} else if (type === 'year') {
					this._yearSelector.addClass('hide');
				} else {
					this._monthSelector.addClass('hide');		
				}
			}
		} ,

		// 操作 年显示文本 月显示文本
		_YMOpr: function(act , type){
			var typeRange = ['year' , 'month'];
			var actRange  = ['show' , 'hide'];
			var type      = !G.contain(type , typeRange) ? 'all'  : type;
			var act		  = !G.contain(act , actRange)   ? 'hide' : act;

			if (act === 'show') {
				if (type === 'all') {
					this._year.removeClass('hide');
					this._month.removeClass('hide');
				} else if (type === 'year') {
					this._year.removeClass('hide');
				} else {
					this._month.removeClass('hide');		
				}
			} else {
				if (type === 'all') {
					this._year.addClass('hide');
					this._month.addClass('hide');
				} else if (type === 'year') {
					this._year.addClass('hide');
				} else {
					this._month.addClass('hide');		
				}
			}
		} ,
		
		// 初始化年份
		_initYear: function(year){
			var html = '';

			for (var i = this._startYear; i <= this._endYear; ++i)
				{
					if (i === year) {
						html += "<option value='" + i + "' selected='selected'>" + i + "</option>";
					} else {
						html += "<option value='" + i + "'>" + i + "</option>";
					}
				}

			this._yearSelector.get().innerHTML = html;
			this._year.get().textContent = year;
		} ,
		
		// 初始化月份
		_initMonth: function(month){
			var html = '';

			for (var i = 1; i <= 12; ++i)
				{
					if (i === month) {
						html += "<option value='" + i + "' selected='selected'>" + i + "</option>";
					} else {
						html += "<option value='" + i + "'>" + i + "</option>";
					}
				}

			this._monthSelector.get().innerHTML = html;
			this._month.get().textContent = month;
		} ,

		// 初始化 + 设置
		_initDate: function(year , month , date){
			var prevYear  = 0;
			var prevMonth = 0;

			if (month === 1) {
				prevYear = year - 1;
				prevMonth = 12;
			} else if (month === 12) {
				prevYear = year;
				prevMonth = month - 1;
			} else {
				prevYear = year;
				prevMonth = month - 1;
			}

			var prevTDay		= this.getTotalDay(prevYear , prevMonth);
			var curTDay			= this.getTotalDay(year , month);
			var prevLastDayWeek = this.getLastDayWeek(prevYear , prevMonth , prevTDay);
			var curLastDayWeek  = 7 - (this.getLastDayWeek(year , month , curTDay) + 1);
			var html			= '';

			// 上月
			for (var i = prevTDay - prevLastDayWeek; i <= prevTDay; ++i)
				{
					html += " <span class='num disabled'>" + i + "</span> ";
				}

			// 当月
			for (var i = 1; i <= curTDay; ++i)
				{
					if (G.getValType(date) === 'Undefined') {
						var curYear  = parseInt(this._year.get().textContent);
						var curMonth = parseInt(this._month.get().textContent);

						if (curYear === this._curYear && curMonth === this._curMonth) {
							if (this._curDate === i) {
								html += " <span class='num cur_num focus_num'>" + i + "</span> ";
							} else {
								html += " <span class='num cur_num'>" + i + "</span> ";
							}
						} else {
							html += " <span class='num cur_num'>" + i + "</span> ";
						}
					} else if (G.getValType(date) !== 'Undefined' && i === date) {
						html += " <span class='num cur_num focus_num'>" + i + "</span> ";
					} else {
						html += " <span class='num cur_num'>" + i + "</span> ";
					}
				}

			// 下月
			for (var i = 1; i <= curLastDayWeek; ++i)
				{
					html += " <span class='num disabled'>" + i + "</span> ";
				}

			this._dSelector.get().innerHTML = html;
		} ,

		_initHour: function(){
			var s = 0;
			var e = 23;
			var hour = parseInt(this._hour.get().textContent);
			var html = '';

			for (var i = s; i <= e; ++i)
				{
					if (hour === i) {
						html += " <span class='num focus_num'>" + i + "</span> ";
					} else {
						html += " <span class='num'>" + i + "</span> ";
					}
				}

			this._hourSelector.get().innerHTML = html; 
		} ,

		_initMinute: function(){
			var s = 0;
			var e = 59;
			var min = parseInt(this._min.get().textContent);
			var html = '';

			for (var i = s; i <= e; ++i)
				{
					if (min === 0) {
						html += " <span class='num focus_num'>" + i + "</span> ";
						min   = false;;
					} else if (min === i) {
						html += " <span class='num focus_num'>" + i + "</span> ";
					} else {
						html += " <span class='num'>" + i + "</span> ";
					}
				}

			this._minSelector.get().innerHTML = html;
		} ,

		_initSecond: function(){
			var s = 0;
			var e = 59;
			var sec = parseInt(this._sec.get().textContent);
			var html = '';

			for (var i = s; i <= e; ++i)
				{
					if (sec === 0) {
						html += " <span class='num focus_num'>" + i + "</span> ";
						sec   = false;
					} else if (sec === i) {
						html += " <span class='num focus_num'>" + i + "</span> ";
					} else {
						html += " <span class='num'>" + i + "</span> ";
					}
				}

			this._secSelector.get().innerHTML = html;
		} ,

		_setYear: function(year){
			if (year > this._endYear) {
				year = this._endYear;
			} else if (year < this.startYear) {
				year = this._startYear;
			}

			this._YMSelectorOpr();
			this._year.get().textContent = year;
			this._YMOpr('show' , 'year');
		} ,

		_setMonth: function(month){
			if (month > 12) {
				month = 12;
			} else if (month < 1) {
				month = 1
			}

			this._YMSelectorOpr();
			this._month.get().textContent = month;
			this._YMOpr('show' , 'month');
		} ,

		_setDate: function(year , month , date){
			this._setYear(year);
			this._setMonth(month);
			this._initDate(year , month , date);
		} ,

		_prevEvent: function(event){
			var e = event || window.event;
				e.stopPropagation();	 

			var curYear  = parseInt(this._year.get().textContent);
			var curMonth = parseInt(this._month.get().textContent);
			var endYear  = 0;
			var endMonth = 0;

			if (curMonth === 1) {
				endYear = curYear - 1;
				endMonth = 12;
			} else {
				endYear = curYear;
				endMonth = curMonth - 1;
			}

			this._setDate(endYear , endMonth);
			this._defineDateClickEvent();
		} ,

		_nextEvent: function(event){
			var e = event || window.event;
				e.stopPropagation();	 

			var curYear = parseInt(this._year.get().textContent);
			var curMonth = parseInt(this._month.get().textContent);
			var endYear = 0;
			var endMonth = 0;

			if (curMonth === 12) {
				endYear = curYear + 1;
				endMonth = 1;
			} else {
				endYear  = curYear;
				endMonth = curMonth + 1;
			}

			this._setDate(endYear , endMonth);
			this._defineDateClickEvent();
		} ,

		_yearEvent: function(event){
			var e = event || window.event;
				e.stopPropagation();

			this._YMOpr('hide' , 'year');
			this._YMSelectorOpr('show' , 'year');
		} ,

		_monthEvent: function(event){
			var e = event || window.event;
				e.stopPropagation();

			this._YMOpr('hide' , 'month');
			this._YMSelectorOpr('show' , 'month');
		} ,

		_yearSelectorEvent: function(event){
			var e = event || window.event;
				e.stopPropagation();

			var endYear  = parseInt(this._yearSelector.get().value);
			var endMonth = parseInt(this._month.get().textContent);

			this._year.get().textContent = parseInt(this._yearSelector.get().value);
			this._setDate(endYear , endMonth);
			this._defineDateClickEvent();
		} ,
			
		_monthSelectorEvent: function(event){
			var e = event || window.event;
				e.stopPropagation();

			var endYear  = parseInt(this._year.get().textContent);
			var endMonth = parseInt(this._monthSelector.get().value);

			this._month.get().textContent = parseInt(this._monthSelector.get().value);
			this._setDate(endYear , endMonth);
			this._defineDateClickEvent();
		} ,
		
		// 初始化时分秒查看事件
		_initViewEvent: function(type){
			var typeRange = ['hour' , 'min' , 'sec'];

			if (G.contain(type , typeRange) === false) {
				return false;
			}

			if (type === 'hour') {
				this._minSelectorCon.css({
					top: 0 ,
					opacity: 0
				});

				this._secSelectorCon.css({
					top: 0 ,
					opacity: 0
				});

				this._minSelectorCon.addClass('hide');
				this._secSelectorCon.addClass('hide');
			} else if (type === 'min') {
				this._hourSelectorCon.css({
					top: 0 ,
					opacity: 0
				});

				this._hourSelectorCon.css({
					top: 0 ,
					opacity: 0
				});

				this._hourSelectorCon.addClass('hide');
				this._secSelectorCon.addClass('hide');
			} else {
				this._hourSelectorCon.css({
					top: 0 ,
					opacity: 0
				});

				this._minSelectorCon.css({
					top: 0 ,
					opacity: 0
				});

				this._hourSelectorCon.addClass('hide');
				this._minSelectorCon.addClass('hide');
			}
		} , 

		// 小时选择事件
		_hourViewEvent: function(type , isQuick){
			var self = this;
			var range   = ['show' , 'hide'];
			var type    = G.contain(type , range) === false     ? 'show' : type;
			var isQuick = G.getValType(isQuick) !== 'Boolean' ? true : isQuick;

			if (isQuick) {
				this._initViewEvent('hour');
			}
			
			if (type === 'show') {
				this._hourSelectorCon.removeClass('hide');

				var curOpacity = parseFloat(this._hourSelectorCon.getStyleVal('opacity'));
				var endOpacity = 1;
				var curTopVal  = this._hourSelectorCon.getCoordVal('top');
				var endTopVal  = -this._hourSelectorCon.getEleH('border-box');

				this._hourSelectorCon.animate({
					carTime: this._carTime ,
					json: [
						{
							attr: 'opacity' , 
							sVal: curOpacity , 
							eVal: endOpacity
						} , 
						{
							attr: 'top' , 
							sVal: curTopVal , 
							eVal: endTopVal
						}
					] ,
					fn: function(){
						self._isHideDateSelector = false;	
					}
				});
			} else {
				var curOpacity = parseFloat(this._hourSelectorCon.getStyleVal('opacity'));
				var endOpacity = 0;
				var curTopVal  = this._hourSelectorCon.getCoordVal('top');
				var endTopVal  = 0;

				this._hourSelectorCon.animate({
					carTime: this._carTime ,
					json: [
						{
							attr: 'opacity' , 
							sVal: curOpacity , 
							eVal: endOpacity
						} , 
						{
							attr: 'top' , 
							sVal: curTopVal , 
							eVal: endTopVal
						}
					] ,
					fn: function(){
						self._hourSelectorCon.addClass('hide');
						self._isHideDateSelector = true;	
					}
					});
			}
		} ,

		_minViewEvent: function(type , isQuick){
			var self = this;
			var range   = ['show' , 'hide'];
			var type    = G.contain(type , range) === false     ? 'show' : type;
			var isQuick = G.getValType(isQuick) !== 'Boolean' ? true : isQuick;

			if (isQuick) {
				this._initViewEvent('min');
			}
			
			if (type === 'show') {
				this._minSelectorCon.removeClass('hide');

				var curOpacity = parseFloat(this._minSelectorCon.getStyleVal('opacity'));
				var endOpacity = 1;
				var curTopVal  = this._minSelectorCon.getCoordVal('top');
				var endTopVal  = -this._minSelectorCon.getEleH('border-box');

				this._minSelectorCon.animate({
					carTime: this._carTime ,
					json: [
						{
							attr: 'opacity' , 
							sVal: curOpacity , 
							eVal: endOpacity
						} , 
						{
							attr: 'top' , 
							sVal: curTopVal , 
							eVal: endTopVal
						}
					] ,
					fn: function(){
						self._isHideDateSelector = false;	
					}
				});
			} else {
				var curOpacity = parseFloat(this._minSelectorCon.getStyleVal('opacity'));
				var endOpacity = 0;
				var curTopVal  = this._minSelectorCon.getCoordVal('top');
				var endTopVal  = 0;

				this._minSelectorCon.animate({
					carTime: this._carTime ,
					json: [
						{
							attr: 'opacity' , 
							sVal: curOpacity , 
							eVal: endOpacity
						} , 
						{
							attr: 'top' , 
							sVal: curTopVal , 
							eVal: endTopVal
						}
					] ,
					fn: function(){
						self._minSelectorCon.addClass('hide');
						self._isHideDateSelector = true;	
					}
				});
			}
		} ,

		_secViewEvent: function(type , isQuick){
			var self = this;
			var range   = ['show' , 'hide'];
			var type    = G.contain(type , range) === false     ? 'show' : type;
			var isQuick = G.getValType(isQuick) !== 'Boolean' ? true : isQuick;

			if (isQuick) {
				this._initViewEvent('sec');
			}
			
			if (type === 'show') {
				this._secSelectorCon.removeClass('hide');

				var curOpacity = parseFloat(this._secSelectorCon.getStyleVal('opacity'));
				var endOpacity = 1;
				var curTopVal  = this._secSelectorCon.getCoordVal('top');
				var endTopVal  = -this._secSelectorCon.getEleH('border-box');

				this._secSelectorCon.animate({
					carTime: this._carTime ,
					json: [
						{
							attr: 'opacity' , 
							sVal: curOpacity , 
							eVal: endOpacity
						} , 
						{
							attr: 'top' , 
							sVal: curTopVal , 
							eVal: endTopVal
						}
					] ,
					fn: function(){
						self._isHideDateSelector = false;	
					}
				});
			} else {
				var curOpacity = parseFloat(this._secSelectorCon.getStyleVal('opacity'));
				var endOpacity = 0;
				var curTopVal  = this._secSelectorCon.getCoordVal('top');
				var endTopVal  = 0;

				this._secSelectorCon.animate({
					carTime: this._carTime ,
					json: [
						{
							attr: 'opacity' , 
							sVal: curOpacity , 
							eVal: endOpacity
						} , 
						{
							attr: 'top' , 
							sVal: curTopVal , 
							eVal: endTopVal
						}
					] ,
					fn: function(){
						self._secSelectorCon.addClass('hide');
						self._isHideDateSelector = true;	
					}
					});
			}
		} ,

		_hourClickEvent: function(event){
		  var e = event || window.evnet;
		  e.stopPropagation();
		  
		  if (this._hourSelectorCon.hasClass('hide')) {
			 this._hourViewEvent();
			  
		  } else {
			 this._hourViewEvent('hide');
			  
		  }
		} , 

		_minClickEvent: function(event){
		  var e = event || window.evnet;
			e.stopPropagation();

		  if (this._minSelectorCon.hasClass('hide')) {
			 this._minViewEvent();
			  
		  } else {
			 this._minViewEvent('hide');
			  
		  }
		} ,

		_secClickEvent: function(event){
		  var e = event || window.evnet;
		  e.stopPropagation();
		  
		  if (this._secSelectorCon.hasClass('hide')) {
			 this._secViewEvent();
			  
		  } else {
			 this._secViewEvent('hide');
			  
		  }
		} , 

		_hideDateSelectorEvent: function(event){
			var e = event || window.evnet;
				e.stopPropagation();

			if (e.currentTarget === window) {
				if (this._type === 'date_time') {
					if (!this._hourSelectorCon.hasClass('hide')) {
						this._hourViewEvent('hide' , false);
					} else if (!this._minSelectorCon.hasClass('hide')) {
						this._minViewEvent('hide' , false);
					} else {
						this._secViewEvent('hide' , false);
					}
				}

				if (this._isHideDateSelector === false) {
					return false;
				} 
			} else {
				if (this._type === 'date_time') {
					if (!this._hourSelectorCon.hasClass('hide')) {
						this._hourViewEvent('hide' , true);
					} else if (!this._minSelectorCon.hasClass('hide')) {
						this._minViewEvent('hide' , true);
					} else {
						this._secViewEvent('hide' , true);
					}
				}
			}

			var year  = this._year.get().textContent;
			var month = parseInt(this._month.get().textContent);
			var date  = parseInt(this._getCurDate());
			
			// debugger

			if (month < 10) {
				month = '0' + month;
			}

			if (date < 10) {
				date = '0' + date;
			}

			if (this._type === 'date_time') {
				var hour = this._hour.get().textContent;
				var min = this._min.get().textContent;
				var sec = this._sec.get().textContent;
				
				this._ele.get().value = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
			} else {
				this._ele.get().value = year + '-' + month + '-' + date;
			}

			if (G(document.body).checkChild(this._con.get())) {
				document.body.removeChild(this._con.get());

				this._ele.get()._dateSelector = undefined;
			}
		} ,

		_todayEvent: function(event){
			var e = event || window.event;
				e.stopPropagation();	 

			this._initDynamicArgs(false , true);
			this._defineDynamicEvent();
		} ,

		_getCurDate: function(){
			for (var i = 0; i < this._dateNum.length; ++i)
				{
					if (G(this._dateNum.get()[i]).hasClass('focus_num')) {
						return this._dateNum.get()[i].textContent;
					}
				}

			return this._curDate;
		} ,

		_dateNumClickEvent: function(event){
			var e         = event || window.event;
			var date      = G(e.currentTarget);
			var curYear   = parseInt(this._year.get().textContent);
			var curMonth  = parseInt(this._month.get().textContent);
			var curDate   = parseInt(date.get().textContent); 

			this._curYear  = curYear;
			this._curMonth = curMonth;
			this._curDate  = curDate;

			date.highlight('focus_num' , this._dateNum.get());
		} ,

		_hourNumClickEvent: function(event){
			var e = event || window.event;
			var hour = G(e.currentTarget);
			var curHour = parseInt(hour.get().textContent);

			if (curHour < 10) {
				curHour = '0' + curHour;
			}

			this._hour.get().textContent = curHour;
			hour.highlight('focus_num' , this._hourNum.get());
			this._hourViewEvent('hide');
		} ,

		_minNumClickEvent: function(){
			var e = event || window.event;
			var min = G(e.currentTarget);
			var curMin = parseInt(min.get().textContent);

			if (curMin < 10) {
				curMin = '0' + curMin;
			}

			this._min.get().textContent = curMin;
			min.highlight('focus_num' , this._minNum.get());
			this._minViewEvent('hide');
		} ,

		_secNumClickEvent: function(){
			var e = event || window.event;
			var sec = G(e.currentTarget);
			var curSec = parseInt(sec.get().textContent);

			if (curSec < 10) {
				curSec = '0' + curSec;
			}

			this._sec.get().textContent = curSec;
			sec.highlight('focus_num' , this._secNum.get());
			this._secViewEvent('hide');
		} ,

		_defineDateClickEvent: function(){
			var browser = G.getBrowser();
			var click   = browser === 'mobile' ? 'touchstart' : 'click';

			// 日期
			for (var i = 0; i < this._dateNum.length; ++i)
				{
					G(this._dateNum.get()[i]).loginEvent(click , this._dateNumClickEvent.bind(this) , false , false);
					G(this._dateNum.get()[i]).loginEvent('mousedown' , function(event){
						var e = event || window.event;
							e.stopPropagation();
					} , false , false);
				}
		} ,
		
		// 定义静态事件
		_defineStaticEvent: function(){
			var self = this;
			var win  = G(window);
			var browser = G.getBrowser();
			var click = browser === 'mobile' ? 'touchstart' : 'click';

			this._prevBtn.loginEvent(click , this._prevEvent.bind(this) , false , false);
			this._nextBtn.loginEvent(click , this._nextEvent.bind(this) , false , false);
			this._year.loginEvent(click , this._yearEvent.bind(this) , false , false);
			this._month.loginEvent(click , this._monthEvent.bind(this) , false , false);
			this._yearSelector.loginEvent('change' , this._yearSelectorEvent.bind(this) , false , false);
			this._monthSelector.loginEvent('change' , this._monthSelectorEvent.bind(this) , false , false);
			
			// 阻止 input 元素 click 冒泡
			if (!G.event.isBindEvent(this._ele.get() , click)) {
				this._ele.loginEvent(click , function(event){
					var e = event || window.evnet;
						e.stopPropagation();
				} , false , false);
			}

			// 阻止 click 事件冒泡 
			this._con.loginEvent(click , function(event){
				var e = event || window.event;
					e.stopPropagation();
			} , false , false);

			this._yearSelector.loginEvent(click , function(event){
				var e = event || window.event;
					e.stopPropagation();	  
			} , false , false);

			this._monthSelector.loginEvent(click , function(event){
				var e = event || window.event;
					e.stopPropagation();	  
			} , false , false);
			
			// 阻止 mousedown 事件冒泡
			this._year.loginEvent('mousedown' , function(event){
				var e = event || window.event;
					e.stopPropagation();	  
			} , false , false);

			this._month.loginEvent('mousedown' , function(event){
				var e = event || window.event;
					e.stopPropagation();	  
			} , false , false);

			this._prevBtn.loginEvent('mousedown' , function(event){
				var e = event || window.event;
					e.stopPropagation();	  
			} , false , false);

			this._nextBtn.loginEvent('mousedown' , function(event){
				var e = event || window.event;
					e.stopPropagation();	  
			} , false , false);

			this._yearSelector.loginEvent('mousedown' , function(event){
				var e = event || window.event;
					e.stopPropagation();	  
			} , false , false);

			this._monthSelector.loginEvent('mousedown' , function(event){
				var e = event || window.event;
					e.stopPropagation();	  
			} , false , false);

			win.loginEvent(click , this._hideDateSelectorEvent.bind(this) , true , false);
			this._todayBtn.loginEvent(click , this._todayEvent.bind(this) , false , false);
			this._closeBtn.loginEvent(click , this._hideDateSelectorEvent.bind(this) , false , false);

			if (this._type === 'date_time') {
				this._hour.loginEvent(click , this._hourClickEvent.bind(this) , false , false);
				this._min.loginEvent(click  , this._minClickEvent.bind(this)  , false , false);
				this._sec.loginEvent(click  , this._secClickEvent.bind(this)  , false , false);
				
				// 阻止click事件冒泡
				this._hourSelectorCon.loginEvent(click , function(event){
					var e = event || window.evnet;
						e.stopPropagation();
				} , false , false);

				this._minSelectorCon.loginEvent(click , function(event){
					var e = event || window.evnet;
						e.stopPropagation();
				} , false , false);

				this._secSelectorCon.loginEvent(click , function(event){
					var e = event || window.evnet;
						e.stopPropagation();
				} , false , false);
			}
		} , 

		// 定义动态事件
		_defineDynamicEvent: function(){
			var self = this;
			var win  = G(window);
			var browser = G.getBrowser();
			var click = browser === 'mobile' ? 'touchstart' : 'click';

			this._defineDateClickEvent();

			if (this._type === 'date_time') {
				// 时
				for (var i = 0; i < this._hourNum.length; ++i)
					{
						G(this._hourNum.get()[i]).loginEvent(click , this._hourNumClickEvent.bind(this) , false , false);
						G(this._hourNum.get()[i]).loginEvent('mousedown' , function(event){
							var e = event || window.event;
								e.stopPropagation();
						} , false , false);
					}

				// 分
				for (var i = 0; i < this._minNum.length; ++i)
					{
						G(this._minNum.get()[i]).loginEvent(click , this._minNumClickEvent.bind(this) , false , false);
						G(this._minNum.get()[i]).loginEvent('mousedown' , function(event){
							var e = event || window.event;
								e.stopPropagation();
						} , false , false);
					}

				// 秒
				for (var i = 0; i < this._secNum.length; ++i)
					{
						G(this._secNum.get()[i]).loginEvent(click , this._secNumClickEvent.bind(this) , false , false);
						G(this._secNum.get()[i]).loginEvent('mousedown' , function(event){
							var e = event || window.event;
								e.stopPropagation();
						} , false , false);
					}
			}
		} ,
		_run: function(){
		  this._initHTML();
		  this._initStaticArgs();
		  this._initDynamicArgs();
		  this._defineStaticEvent();
		  this._defineDynamicEvent();
		}
	};

  return DateSelector;
})();