/**
 * Created by grayVTouch on 2017/12/27.
 * 日期选择器（select 类型）
 */
var DatePicker = (function(){
    function DatePicker(con , opt){
        var thisRange = [undefined , null , window];

        if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== DatePicker) {
            return new DatePicker(con , opt);
        }

        // 默认设置
        this._defaultOpt = {
            // 开始年份
            sYear: (new Date()).getFullYear() - 15 ,
            // 结束年份
            eYear: (new Date()).getFullYear() + 15 ,
            // 选择器类型：year | month | day
            type: 'date' ,
            // 是否允许单选/多选
            multiple: true ,
            // 年份变化回调
            yearFn: null ,
            // 月份变化回调
            monthFn: null ,
            // 日期变化回调
            dateFn: null ,
            // 显示类型: vertical/horizontal
            posType: 'vertical' ,
        };

        // 类型区间
        this._typeRange = ['year' , 'month' , 'date' , 'quarterly'];
        this._posTypeRange = ['vertical' , 'horizontal'];

        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

        // 参数设置
        this._con           = G(con);

        this._datePicker    = G('.date-picker' , this._con.get()).first();

        this._sYear     = G.getValType(opt['sYear']) === 'Number'       ? opt['sYear']      : this._defaultOpt['sYear'];
        this._eYear     = G.getValType(opt['eYear']) === 'Number'       ? opt['eYear']      : this._defaultOpt['eYear'];
        this._type      = G.contain(opt['type'] , this._typeRange)      ? opt['type']       : this._defaultOpt['type'];
        this._multiple  = G.getValType(opt['multiple']) === 'Boolean'   ? opt['multiple']   : this._defaultOpt['multiple'];
        this._yearFn    = G.getValType(opt['yearFn']) === 'Function'    ? opt['yearFn']     : this._defaultOpt['yearFn'];
        this._monthFn   = G.getValType(opt['monthFn']) === 'Function'   ? opt['monthFn']    : this._defaultOpt['monthFn'];
        this._dateFn    = G.getValType(opt['dateFn']) === 'Function'    ? opt['dateFn']     : this._defaultOpt['dateFn'];
        this._posType   = G.contain(opt['posType'] , this._posTypeRange)      ? opt['posType']       : this._defaultOpt['posType'];

        this._run();
    }

    DatePicker.prototype = {
        constructor: DatePicker ,

        _initStaticHTML: function(){
            this._yearSelectItem    = G('.year-select-item' , this._datePicker.get()).first();
            this._monthSelectItem   = G('.month-select-item' , this._datePicker.get()).first();
            this._dateSelectItem    = G('.date-select-item' , this._datePicker.get()).first();
            this._quarterlySelectItem    = G('.quarterly-select-item' , this._datePicker.get()).first();
            this._yearSelect        = G('.year-select' , this._yearSelectItem.get()).first();
            this._monthSelect       = G('.month-select' , this._monthSelectItem.get()).first();
            this._dateSelect        = G('.date-select' , this._dateSelectItem.get()).first();
            this._quarterlySelect        = G('.quarterly-select' , this._quarterlySelectItem.get()).first();

            this._initSelectHTML = "<option value=''>请选择...</option>";

            this._yearSelect.get().innerHTML    = this._genOptions('year' , this._sYear , this._eYear);
            this._monthSelect.get().innerHTML   = this._genOptions('month' , 1 , 12);

            // 设置日期（后期会重复调用）
            this._setDate();

            // 设置季度
            var quarterlyHTML = this._initSelectHTML;
            var quarterlyVal = this._quarterlySelect.data('value');

            for (var i = 1; i <= 4; ++i)
            {
                quarterlyHTML += "<option value='" + i + "'" + (quarterlyVal == i  ? 'selected="selected"' : '') + ">第" + i + "季度</option>";
            }

            this._quarterlySelect.get().innerHTML = quarterlyHTML;
        } ,

        _initDynamicHTML: function(){

        } ,

        _initStaticArgs: function(){
            this._yearInputItem = G('.year-input-item' , this._datePicker.get()).first();
            this._monthInputItem = G('.month-input-item' , this._datePicker.get()).first();
            this._dateInputItem = G('.date-input-item' , this._datePicker.get()).first();
            this._quarterlyInputItem = G('.quarterly-input-item' , this._datePicker.get()).first();
            this._yearInput     = G('.year-input' , this._yearInputItem.get()).first();
            this._monthInput   = G('.month-input' , this._monthInputItem.get()).first();
            this._dateInput     = G('.date-input' , this._dateInputItem.get()).first();
            this._quarterlyInput     = G('.quarterly-input' , this._quarterlyInputItem.get()).first();

            // 多选 / 单选
            var input       = G(this.getInputForType(this._type));
            var inputVal    = input.data('value');
            this._status    = G.getValType(inputVal) === 'Null' || inputVal === '' ? 'single' : 'multiple';

            // 多选
            this._multipleBtn = G('.switch-btn' , this['_' + this._type + 'SelectItem'].get()).first();

            // 单选
            this._singleBtn = G('.switch-btn' , this['_' + this._type + 'InputItem'].get()).first();
        } ,

        _initStatic: function(){
            if (this._posType === 'vertical') {
                this._datePicker.addClass('date-picker-vertical');
            } else {
                this._datePicker.addClass('date-picker-horizontal');
            }

            this._switchBtnSet = G('.switch-btn' , this._datePicker.get());

            if (!this._multiple) {
                this._multipleBtn.addClass('hide');
            }

            // 初始化设置 input 的值
            var yearInputVal    = this._yearInput.data('value');
            var monthInputVal   = this._monthInput.data('value');
            var dateInputVal    = this._dateInput.data('value');
            var quarterlyInputVal = this._quarterlyInput.data('value');

            yearInputVal = G.getValType(yearInputVal) === 'Null' || yearInputVal === '' ? '' : G.jsonDecode(yearInputVal).join(',');
            monthInputVal = G.getValType(monthInputVal) === 'Null' || monthInputVal === '' ? '' : G.jsonDecode(monthInputVal).join(',');
            dateInputVal = G.getValType(dateInputVal) === 'Null' || dateInputVal === '' ? '' : G.jsonDecode(dateInputVal).join(',');
            quarterlyInputVal = G.getValType(quarterlyInputVal) === 'Null' || quarterlyInputVal === '' ? '' : G.jsonDecode(quarterlyInputVal).join(',');

            this._yearInput.get().value = yearInputVal;
            this._monthInput.get().value = monthInputVal;
            this._dateInput.get().value = dateInputVal;
            this._quarterlyInput.get().value = quarterlyInputVal;
        } ,

        _initDynamicArgs: function(){

        } ,

        _initDynamic: function(){
            this.setView();
        } ,

        // 设置日期
        _setDate: function(){
            // 年份
            var year = this._yearSelect.get().value;
            var month = this._monthSelect.get().value;

            if (month !== '') {
                var sDay = 1;
                var eDay = G.getMonthDays(year , month);

                this._dateSelect.get().innerHTML = this._genOptions('date' , sDay , eDay)
            } else {
                this._dateSelect.get().innerHTML = this._initSelectHTML;
            }
        } ,

        // 按钮切换
        switchBtn: function(btn){
            if (!this._multiple) {
                // 单选，不允许切换
                return ;
            }

            var i = 0;
            var cur = null;

            for (; i < this._switchBtnSet.length; ++i)
            {
                cur = G(this._switchBtnSet.get()[i]);

                if (btn === cur.get()) {
                    cur.removeClass('hide');
                } else {
                    cur.addClass('hide');
                }
            }
        } ,

        // 获取类型对应的 item
        getItemForType: function(type){
            return this['_' + type + (this._status == 'single' ? 'Select' : 'Input') + 'Item'].get();
        } ,

        // 获取类型对应的 select
        getSelectForType: function(type){
            return this['_' + type + 'Select'].get();
        } ,

        // 获取类型对应的 input
        getInputForType: function(type){
            return this['_' + type + 'Input'].get();
        } ,

        // 根据类型获取 switch-btn
        getBtnForType: function(type){
            var item = this.getItemForType(type);


            return G('.switch-btn' , item).first().get();
        } ,

        // 生成 select 的 option
        _genOptions: function(type , start , end){
            var dom         = G(this.getSelectForType(type));
            var curVal      = dom.data('value');
            var i = 0;
            var yearReg     = /^\d+$/;

            curVal = type === 'year' && !yearReg.test(curVal) ? (new Date()).getFullYear() : curVal;

            var html = this._initSelectHTML;

            for (i = start; i <= end; ++i)
            {
                html += "<option value='" + i+ "'" + (curVal == i ? "selected='selected'" : "") + ">" + i + "</option>";
            }

            return html;
        } ,

        // 单选元素设置
        setForSingle: function(){
            this._yearInputItem.addClass('hide');
            this._monthInputItem.addClass('hide');
            this._dateInputItem.addClass('hide');
            this._quarterlyInputItem.addClass('hide');

            if (this._type === 'year') {
                this._yearSelectItem.removeClass('hide');
                this._monthSelectItem.addClass('hide');
                this._dateSelectItem.addClass('hide');
                this._quarterlySelectItem.addClass('hide');
            }

            if (this._type === 'month') {
                this._yearSelectItem.removeClass('hide');
                this._monthSelectItem.removeClass('hide');
                this._dateSelectItem.addClass('hide');
                this._quarterlySelectItem.addClass('hide');
            }

            if (this._type === 'date') {
                this._yearSelectItem.removeClass('hide');
                this._monthSelectItem.removeClass('hide');
                this._dateSelectItem.removeClass('hide');
                this._quarterlySelectItem.addClass('hide');
            }

            if (this._type === 'quarterly') {
                this._yearSelectItem.removeClass('hide');
                this._monthSelectItem.addClass('hide');
                this._dateSelectItem.addClass('hide');
                this._quarterlySelectItem.removeClass('hide');
            }

            this._switchBtn = G(this.getBtnForType(this._type));

            // 切换显示按钮
            this.switchBtn(this._switchBtn.get());
        } ,

        // 多选元素设置
        setForMultiple: function(){
            if (this._type === 'year') {
                this._yearSelectItem.addClass('hide');
                this._monthSelectItem.addClass('hide');
                this._dateSelectItem.addClass('hide');
                this._quarterlySelectItem.addClass('hide');

                this._yearInputItem.removeClass('hide');
                this._monthInputItem.addClass('hide');
                this._dateInputItem.addClass('hide');
                this._quarterlyInputItem.addClass('hide');
            }

            if (this._type === 'month') {
                this._yearSelectItem.removeClass('hide');
                this._monthSelectItem.addClass('hide');
                this._dateSelectItem.addClass('hide');
                this._quarterlySelectItem.addClass('hide');

                this._yearInputItem.addClass('hide');
                this._monthInputItem.removeClass('hide');
                this._dateInputItem.addClass('hide');
                this._quarterlyInputItem.addClass('hide');
            }

            if (this._type === 'date') {
                this._yearSelectItem.removeClass('hide');
                this._monthSelectItem.removeClass('hide');
                this._dateSelectItem.addClass('hide');
                this._quarterlySelectItem.addClass('hide');

                this._yearInputItem.addClass('hide');
                this._monthInputItem.addClass('hide');
                this._dateInputItem.removeClass('hide');
                this._quarterlyInputItem.addClass('hide');
            }

            if (this._type === 'quarterly') {
                this._yearSelectItem.removeClass('hide');
                this._monthSelectItem.addClass('hide');
                this._dateSelectItem.addClass('hide');
                this._quarterlySelectItem.addClass('hide');

                this._yearInputItem.addClass('hide');
                this._monthInputItem.addClass('hide');
                this._dateInputItem.addClass('hide');
                this._quarterlyInputItem.removeClass('hide');
            }

            var btn = this.getBtnForType(this._type);

            // 切换显示按钮
            this.switchBtn(btn);
        } ,

        // 设置显示界面
        setView: function(){
            if (this._multiple && this._status === 'multiple') {
                this.setForMultiple();
            } else {
                this.setForSingle();
            }
        } ,

        // 获取年
        getVal: function(type){
            if (this._type !== type) {
                return this['_' + type + 'Select'].get().value;
            }

            if (this._multiple && this._status === 'multiple') {
                return G.filterObj(this['_' + type + 'Input'].get().value.split(',') , true);
            }

            return this['_' + type + 'Select'].get().value;
        } ,

        // 格式化显示（仅支持单选模式）
        format: function(){
            if (this._multiple) {
                throw new Error('仅支持单选模式格式化返回时间字符串');
            }

            if (this._type === 'quarterly') {
                throw new Error("不支持季度的格式化字符串");
            }

            var timeStr = this.getYear();

            if (this._type === 'year') {
                return timeStr;
            }

            var month = this.getMonth();
                month = month < 10 ? '0' + month : month;

            timeStr += '-' + month;

            if (this._type === 'month') {
                return timeStr;
            }

            var date = this.getDate();
                date = date < 10 ? '0' + date : date;

            return timeStr + '-' + date;
        } ,


        // 获取年
        getYear: function(){
            return this.getVal('year');
        } ,

        // 获取月
        getMonth: function(){
            return this.getVal('month');
        } ,

        // 获取日
        getDate: function(){
            return this.getVal('date');
        } ,

        // 获取季度
        getQuarterly: function(){
            return this.getVal('quarterly');
        } ,

        // 年份变化事件
        _yearSelectChangeEvent: function(event){
            var tar = G(event.currentTarget);

            G.select(this._monthSelect.get() , '');
            this._setDate();

            this._yearCallback();
        } ,

        // 月份变化事件
        _monthSelectChangeEvent: function(event){
            var tar = G(event.currentTarget);

            this._setDate();

            this._monthCallback();
        } ,

        // 日期变化事件
        _dateSelectChangeEvent: function(){
            this._dateCallback();
        } ,

        // 年回到时间
        _yearCallback: function(){
            if (G.getValType(this._yearFn) === 'Function') {
                if (this._type === 'year') {
                    this._yearFn(this.getYear());
                }

                if (this._type === 'month') {
                    this._yearFn(this.getYear() , this.getMonth());
                }

                if (this._type === 'date') {
                    this._yearFn(this.getYear() , this.getMonth() , this.getDate());
                }
            }
        } ,

        // 月回调事件
        _monthCallback: function(){
            if (G.getValType(this._monthFn) === 'Function') {
                if (this._type === 'year') {
                    this._monthFn(this.getYear());
                }

                if (this._type === 'month') {
                    this._monthFn(this.getYear() , this.getMonth());
                }

                if (this._type === 'date') {
                    this._monthFn(this.getYear() , this.getMonth() , this.getDate());
                }
            }
        } ,

        // 日期回调事件
        _dateCallback: function(){
            if (G.getValType(this._dateFn) === 'Function') {
                if (this._type === 'year') {
                    this._monthFn(this.getYear());
                }

                if (this._type === 'month') {
                    this._monthFn(this.getYear() , this.getMonth());
                }

                if (this._type === 'date') {
                    this._monthFn(this.getYear() , this.getMonth() , this.getDate());
                }
            }
        } ,

        // 多选事件
        _multipleEvent: function(){
            this._status = 'multiple';
            this.setForMultiple();
        } ,

        // 单选事件
        _singleEvent: function(){
            this._status = 'single';

            this.setForSingle();
        } ,

        // 取值
        value: function(){
            if (this._type === 'year') {
                return this.getYear();
            }

            if (this._type === 'month') {
                return {
                    year: this.getYear() ,
                    month: this.getMonth()
                };
            }

            if (this._type === 'quarterly') {
                return {
                    year: this.getYear() ,
                    quarterly: this.getQuarterly()
                };
            }

            return {
                year: this.getYear() ,
                month: this.getMonth() ,
                date: this.getDate()
            };
        } ,

        // 获取状态
        getStatus: function(){
            return this._multiple ? this._status : 'single';
        } ,

        _defineEvent: function(){
            // select 变化事件
            this._yearSelect.loginEvent('change' , this._yearSelectChangeEvent.bind(this) , true , false);
            this._monthSelect.loginEvent('change' , this._monthSelectChangeEvent.bind(this) , true , false);
            this._dateSelect.loginEvent('change' , this._dateSelectChangeEvent.bind(this) , true , false);

            // input 变化事件
            this._yearInput.loginEvent('change' , this._yearCallback.bind(this) , true , false);
            this._monthInput.loginEvent('change' , this._monthCallback.bind(this) , true , false);
            this._dateInput.loginEvent('change' , this._dateCallback.bind(this) , true , false);

            // 切换事件
            this._multipleBtn.loginEvent('click' , this._multipleEvent.bind(this) , true , false);
            this._singleBtn.loginEvent('click' , this._singleEvent.bind(this) , true , false);
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

    return DatePicker;
})();