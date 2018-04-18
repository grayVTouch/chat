/**
 * 电话对象（可添加多个电话）
 */
var Phone = (function(){
    'use strict';

    function Phone(con , opt){
        var thisRange = [undefined , null , window];

        if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== Phone) {
            return new Phone(con , opt);
        }

        this._defaultOpt = {};

        if (G.getValType(opt) === 'Undefined') {
            this.opt = this._defaultOpt;
        }
        
        this._con = G(con);

        this._run();
    }

    Phone.prototype = {
        constructor: Phone ,

        _initStaticHTML: function(){
            this._phone         = G('.phone'        , this._con.get()).first();
            this._addedPhone    = G('.added-phone'  , this._phone.get()).first();
            this._list          = G('.list'         , this._addedPhone.get()).first();

            // 初始化 phone 列表
            this.__phone = this._phone.data('phone');
            this.__phone = G.isValidVal(this.__phone) ? G.jsonDecode(this.__phone) : [];

            var i = 0;
            var cur = null;

            for (i = 0; i < this.__phone.length; ++i)
            {
                cur = this.__phone[i];

                // 添加节点
                this.add(cur);
            }
        } ,

        _initStaticArgs: function(){
            this._addPhone      = G('.add-phone' , this._phone.get()).first();
            this._input         = G('.input' , this._addPhone.get()).first();
            this._add           = G('.add' , this._addPhone.get()).first();
            this._tip           = G('.tip' , this._addPhone.get()).first();

            // 原始值
            this._textForTip = this._tip.get().textContent;

            // 错误提示
            this._formatError = '格式错误，请重新填写';
            this._existsError = '该手机号已经存在，请勿重复填写';

            // 定时器（还原原始提示）
            this._timer = null;

            // 提示事件
            this._tipTime = 2000;
        } ,

        _initStatic: function(){

        } ,

        _initDynamicHTML: function(){

        } ,

        _initDynamicArgs: function(){
            this._itemSet = G('.item' , this._list.get());
        } ,

        _initDynamic: function(){

        } ,

        // 定义节点事件
        eventForItem: function(item){
            var self = this;
            item = G(item);

            var deleteBtn = G('.delete' , item.get()).first();

            deleteBtn.loginEvent('click' , function(){
                // 删除节点
                self.delete(item.get());
            } , true , false);
        } ,

        // 格式错误提示
        error: function(error){
            this._tip.get().textContent = error;
            this._tip.addClass('red');
        } ,

        // 格式正确提示（还原）
        origin: function(){
            this._tip.get().textContent = this._textForTip;
            this._tip.removeClass('red');
        } ,


        // 添加节点
        add: function(phone){
            var div = document.createElement('div');
                div = G(div);
                div.addClass('item');

            var html = [];
                html.push(' <div class="in">');
                html.push('     <div class="text"><input type="text" class="input" value="' + phone + '" /></div>');
                html.push('     <div class="delete">X</div>');
                html.push(' </div>');

            div.get().innerHTML = html.join('');

            this._list.get().appendChild(div.get());

            // 添加事件
            this.eventForItem(div.get());

            // 更新
            this._initDynamicHTML();
            this._initDynamicArgs();
            this._initDynamic();
        } ,

        // 删除节点
        delete: function(item){
            item.parentNode.removeChild(item);

            // 更新
            this._initDynamicHTML();
            this._initDynamicArgs();
            this._initDynamic();
        } ,

        // 获取现有的值列表
        phone: function(){
            var i       = 0;
            var cur     = null;
            var input   = null;
            var phone   = [];

            for (; i < this._itemSet.length; ++i)
            {
                cur     = G(this._itemSet.get()[i]);
                input   = G('.input' , cur.get()).first();
                phone.push(input.get().value);
            }

            return phone;
        } ,

        // 检查是否已经存在某个值了
        exists: function(phone){
            var list = this.phone();

            if (G.contain(phone , list)) {
                return true;
            }

            return false;
        } ,

        /**
         * 检查电话格式
         * 格式1：手机号码 13375086826
         * 格式2：电话号码 05973544112
         * 格式3：特殊号码 0597-3544112
         */
        check: function(phone){
            var reg = /^\d{11}|\d+\-\d+$/;

            return reg.test(phone);
        } ,

        _addEvent: function(){
            window.clearTimeout(this._timer);

            var v = this._input.get().value;

            if (this.exists(v)) {
                // 如果已经存在，错误提示
                this.error(this._existsError);

                this._timer = window.setTimeout(this.origin.bind(this) , this._tipTime);
            } else if (!this.check(v)) {
                // 如果格式错误，错误提示
                this.error(this._formatError);

                this._timer = window.setTimeout(this.origin.bind(this) , this._tipTime);
            } else {
                this.add(v);
            }
        } ,

        _defineEvent: function(){
            this._add.loginEvent('click' , this._addEvent.bind(this) , true , false);
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

    return Phone;
})();