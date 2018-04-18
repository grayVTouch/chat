/*
 * 倒计时
 * @author 陈学龙 2017-05-25 09:39:00
 * @param String  sTime ，格式: 2017-05-25 09:09:00
 * @param String  eTime ，格式: 2017-05-25 09:09:00
 * @param Element showCon
 * @return undefined
 */
var TimeCount = (function(){
	'use strict';

	function TimeCount(con , opt){
		var thisRange = [null , undefined , window];

		if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== TimeCount) {
			return new TimeCount(con , opt);
		}

		if (!G.isDOMEle(con)) {
			throw new Error('参数 1 类型错误');
		}
		
		// 默认设置
		this._defaultOpt = {
			sTime: '2017-05-25 09:12:00' ,  // 格式: 2017-05-25 09:09:00 | 2017-05-25
			eTime: '2017-05-25 09:12:00' ,  // 格式: 2017-05-25 09:09:00 | 2017-05-25
			distance: 'sTime' ,				// 距离开始时间(sTime) | 距离结束时间(eTime)
			showFormat: 'D天H时I分S秒' ,	// ['D天H时I分S秒' , 'HH:II:SS' , 'HH时II分SS秒']
			valAttr: 'textContent' ,		// value | textContent | innerHTML | outerHTML
			eachFn: null ,					// 每次倒计时都会调用
			endFn:  null					// 倒计时结束的时候调用
			
		};

		if (G.getValType(opt) === 'Undefined') {
			throw new Error('参数 2 类型错误');
		}
		
		this._con			= con;
		this._sTime			= G.getValType(opt['sTime']) !== 'String'			? this._defaultOpt['sTime']			: opt['sTime'];
		this._eTime			= G.getValType(opt['eTime']) !== 'String'			? this._defaultOpt['eTime']			: opt['eTime'];
		this._showFormat	= G.getValType(opt['showFormat']) !== 'String'		? this._defaultOpt['showFormat']	: opt['showFormat'];
		this._valAttr		= G.getValType(opt['valAttr']) !== 'String'			? this._defaultOpt['valAttr']		: opt['valAttr'];
		this._distance		= G.getValType(opt['distance']) !== 'String'		? this._defaultOpt['distance']		: opt['distance'];
		this._eachFn		= opt['eachFn'];
		this._endFn			= opt['endFn'];

		this._run();
	}

	TimeCount.prototype = {
		constructor: TimeCount ,

		_run: function(){

			// 毫秒
			var timeDiff	= null;
			var curTime = G.getCurTimeData(true , true);

			if (this._distance === 'sTime') {
				timeDiff = G.timestampDiff(curTime , this._sTime , 'datetime');
			}

			if (this._distance === 'eTime') {
				timeDiff = G.timestampDiff(curTime , this._eTime , 'datetime');
			}

			timeDiff = Math.max(0 , timeDiff / 1000);

			// 展现			
			this._con[this._valAttr] = G.formatTime(timeDiff , this._showFormat);

			// 已经到时间点了
			if (timeDiff === 0) {
				if (G.getValType(this._endFn) === 'Function') {
					this._endFn(timeDiff);
				}
			} else {
				if (G.getValType(this._eachFn) === 'Function') {
					this._eachFn(timeDiff);
				}
				
				// 每隔 20ms 执行一次跑一次计时函数（确保时间准确）
				window.setTimeout(this._run.bind(this) , 20);
			}
		}
	};
	
	return TimeCount;
})();