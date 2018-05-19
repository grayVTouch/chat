/*
 * author 陈学龙 2016/10/23 18:09:00
 * SmallJS 框架！ version 1.0
 * 运行环境：IE 10+（包括 IE10，绝大部分支持 IE 9，但是涉及到最新 HTML5技术的全部不支持） 或同等级别的其他浏览器
 * 更新时间：
 1. 2016/10/23 18:09:00
 2. 2017/02/03 10:22:00
 3. 2017/02/03 13:40:00
 4. 2017/02/06 12:34:00
 5. 2017/02/06 23:25:00
 6. 2017/02/13 16:59:00
 7. 2017/02/14 23:19:00
 8. 2017/03/18 14:05:00
 9. 2017/03/18 14:05:00
 内容：Ajax 对象新增方法 get，返回 XMLHttpRequest 对象
 10. 2017/03/24 16:40:00
 内容：新增阻止事件冒泡|阻止默认事件发生
 11. 2017/03/24 20:05:00
 内容：修改 Ajax 请求的 url 模式（6个）
 12. 2017/03/25 14:34:00
 内容：parseTime（返回时间信息） + timestampDiff（获取两个时间点相差的毫秒数）
 13. 2017/04/01 12:49:00
 内容：元素选择器 bug ，无法选取带有 除了字母、下划线、数字意外字符的元素，修正正则
 14. 2017/04/09 16:36:00
 内容：完善 timeCount 函数
 15. 2017/05/12 15:14:00
 内容：添加基础函数库功能：根据生日计算出年龄（周岁）
 16. 2017/05/14 21:44:00
 内容：修改 Ajax 对象，新增 get 方法，获取 XMLHttpRequest 对象
 17. 2017/05/14 21:58:00
 内容：新增 formBlur 静态方法，使表单失去焦点（防止重复提交）
 18. 2017/05/14 21:58:00
 内容：选择器类型判定 bug 修复
 19. 2017/07/03 18:14:00
 内容：rem 布局需要用到的设置根元素字体
 20. 2017/07/19 14:15:00
 内容：
 1. 获取 data-attribute 属性的快捷方法 getAttr
 2. 设置 data-attribute 属性的快捷方法 setAttr
 21. 2017/07/22 10:07:00
 内容：
 1. 新增错误处理基础函数 throw
 22. 2107/07/29 16:44:00
 内容：
 1. 类数组对象转换成数组
 23. 2107/07/29 16:44:00
 内容：
 1. 增加滚动到底部 或 滚动到顶部（scroll）
 24. 2017/09/11 09:18:00
 内容：
 1. 升级功能 parentFind、childFind
 2. 新增功能 parentFindAll、children 、not、find
 3. 修复功能 bug： isDOMEle
 25. 2017/10/10 13:34:00
 1. Ajax 请求都会添加一个 AJAX_REQUEST 的请求头
 26. 2017/11/17 23:53:00
 1. getDOMList，获取一个对象，DOM 元素组成的数组
 2. domSwitch，交换 DOM 元素位置
 3. insertBefore，简化版的 insertBefore
 4. insertAfter，自定义节点操作函数
 27. 2017/11/18 17:19:00
 1. fromUnixtime  格式化 unix 时间戳
 2. unixTimestamp 返回 unix 时间戳
 3. 新增 parents，替代 parentFindAll
 28. 2017/11/19 08:51:00
 1. 新增 data 元素方法获取数据集属性
 2. withCredentials 允许跨域
 3. 优化 getDocOffsetVal 性能
 29. 2017-11-21 16:23:00
 1. XHR 新增错误处理
 30. 2017-11-22 15:46:00
 1. 新增容量显示(b、byte、kb、mb、gb、tb、pb)
 2. 新增 getFormData | appendFormData
 31. 2017-12-13 10:50:00
    1. 新增基础函数 getRadioVal
32. 2017-12-27 13:37:00
    1. SmallJs.getMonthDyas
    2. SmallJs.isLeapYear
33. 2018-01-07 15:04:00
    1. addClass 允许一次性添加多类名
34. 2018-01-13 09:58:00
    1. highlight 新增第三个参数
    2. focus 获取一个集合中具有指定属性名的元素 current
35 2018-01-15 14:53:00
    1. 新增 scrollLoad 滚动加载函数
36 2018-01-27 09:11:00
    1. css 支持集合元素批量设置样式！
37 2018-01-29 16:59:00
    1. 修改 getEleIdx 为 index
38 2018-02-01 16:14:00
    1. 修改 SmallJs.scroll 函数，新增 SmallJs.top、SmallJs.bottom 函数等页面滚动处理函数
39. 2018-05-14 09:26:00
    1. 新增光标控制函数： getCursorPoint、setCursorPoint、getCursorPointForContentEditableElement、getCursorPointForInput、setCursorPointForInput、setCursorPointForInput
    2. 新增 isDomm、isDomList 等函数
    3. 修复元素查找属性查找不到的 bug

 命名规则：
 1. 变量：首字母小写 + 驼峰法
 2. 函数：首字母小写 + 驼峰法

 2.1 函数参数：1. 无扩展性的采取 function(args1 , args2 ..){....}

 2. 考虑到将来有可能会进行扩展的采取

 2.1 function(opt){...}
 2.1.1 opt = {key:val}

 2.2 function (){....}
 2.2.1 内部使用 arguments 对象来操作参数

 3. 搜索型：function search(val , range){..}					  // 待搜索的值   ， 搜索的范围

 4. 追加型：function add(obj , val){...}						  // 待追加的对象 ， 追加的值

 5. 替换型：function replace(obj , originalVal , endVal)		  // 待操作的对象 ， 原值		     ，最终值

 6. 删除型：function remove(obj , val){...}					  // 待删除的对象 ， 待删除的值

 7. 切换型：function switchCn(focusCn , focusEle , list){...}  // 命中元素的类名 ，命中元素 ， 元素所在的集合

 8. 取值型：function getDocOffsetVal(doc , type){...}

 3. 类：  首字母大小 + 驼峰法

 3.1 类参数： 采取 {key:val} 格式（无扩展：直接参数 args1 , args2 ....）

 4. 类属性： 私有属性|受保护属性 _ + 首字母小写 + 驼峰法

 5. 类方法： 私有方法|受保护方法 _ + 首字母小写 + 驼峰法

 * 使用时注意： 前面带有 _ 的属性或方法，全都是不允许调用的（虽然实际上是可执行的，但是不赞成调用！因为调用后得到的结果未知....）！
 */

(function(window){

    "use strict";

    /*
     * ********
     构造函数
     * ********
     */
    function SmallJs(selector , context){
        var thisRange = [window , undefined , null];

        if (SmallJs.contain(this , thisRange) || !SmallJs.contain(this , thisRange) && this.constructor !== SmallJs) {
            return new SmallJs(selector , context);
        }
        // 使用时注意
        this._curEle = this._getEle(selector , context);

        if (!SmallJs.isObj(this._curEle)) {
            throw new TypeError('当前操作的不是对象');
        }

        this.length = !SmallJs.isDOMList(this._curEle) ? 1 : this._curEle.length;
    }

    /*
     * ************
     构造函数原型
     * ************
     */
    SmallJs.pro = SmallJs.prototype = {
        // author
        author: '陈学龙' ,

        // 版本
        version: '1.0' ,

        // 构造函数
        constructor: SmallJs ,

        // 当前引用的DOM对象
        _curEle: null ,

        // id 选择器
        _idSelector: function(selector){
            return document.getElementById(selector);
        } ,

        // class 选择器
        _classSelector: function(selector , context){
            return !context ? document.getElementsByClassName(selector) : context.getElementsByClassName(selector);
        } ,

        // tag 选择器
        _tagSelector: function(selector , context){
            return !context ? document.getElementsByTagName(selector) : context.getElementsByTagName(selector);
        } ,

        // name 选择器
        _nameSelector: function(selector){
            return document.getElementsByName(selector);
        } ,

        // querySelector
        _querySelector: function(selector , context){
            return !context ? document.querySelector(selector) : context.querySelector(selector);
        } ,

        // querySelectorAll 选择器
        _querySelectorAll: function(selector , context){
            return !context ? document.querySelectorAll(selector) : context.querySelectorAll(selector);
        } ,

        // 触发函数原生的事件
        trigger: function(event){
            var args = arguments;

            args = SmallJs.toArray(args);
            args = args.slice(1);

            if (this.isDom(this._curEle)) {
                this._curEle[event]();
            } else if (this.isDomList(this._curEle)) {
                var i   = 0;
                var cur = null;

                for (; i < this._curEle.length; ++i)
                {
                    cur = this._curEle[i];
                    cur[event]();
                }
            } else {
                throw new Error("操作要求提供 dom 元素或元素集合");
            }
        } ,

        /*
         * 1. 获取 DOM 元素
         * 2. 转换为 SmallJs 对象，并将 _curEle 属性设置为当前元素
         */
        _getEle: function(selector , context){
            var idSelector     = /^#[A-z0-9_-]+$/;
            var classSelector  = /^\.[A-z0-9_-]+$/;
            var tagSelector    = /^t\..+$/;
            var nameSelector   = /^n\..+$/;
            var querySelector = /^q:.+$/;
            var querySelectorAll = /^qa:.+$/;

            if (SmallJs.isObj(selector)) {
                return selector;
            }

            if (idSelector.test(selector)) {
                return this._idSelector(selector.substring(1));
            }

            if (classSelector.test(selector)) {
                return this._classSelector(selector.substring(1) , context);
            }

            if (tagSelector.test(selector)) {
                return this._tagSelector(selector.substring(2) , context);
            }

            if (nameSelector.test(selector)) {
                return this._nameSelector(selector.substring(2));
            }

            if (querySelector.test(selector)) {
                return this._querySelector(selector.substring(2) , context);
            }

            if (querySelectorAll.test(selector)) {
                return this._querySelectorAll(selector.substring(3) , context);
            }

            throw new Error('当前提供的选择器格式错误：' + selector);
        } ,

        // 获取 DOM 元素|集合，可直接使用 Javascript 原生语法
        get: function(){
            return this._curEle;
        } ,

        // 检查元素内滚动条是否在顶部
        isTop: function(){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            return this._curEle.scrollTop === 0;
        } ,

        // 检查元素滚动条是否在底部
        isBottom: function(){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            var clientH = this._curEle.clientHeight;
            var maxH    = this._curEle.scrollHeight;
            var maxT = maxH - clientH;
            var curT    = this._curEle.scrollTop;

            // console.log(curT , maxT , curT >= maxT);
            return curT >= maxT;
        } ,

        // 检查元素是否在最左边
        isLeft: function(){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            return this._curEle.scrollLeft === 0;
        } ,

        // 检查元素是否在最左边
        isRight: function(){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            var clientW = this._curEle.clientWidth;
            var maxW    = this._curEle.scrollWidth;
            var maxL    = maxW - clientW;
            var curL    = this._curEle.scrollLeft;

            if (curL >= maxL) {
                return true;
            }

            return false;
        } ,

        // 文本
        text: function(text){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            if (SmallJs.isUndefined(text)) {
                return this._curEle.textContent;
            }

            this._curEle.textContent = text;

            return this;
        } ,

        // 值
        val: function(v){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            if (SmallJs.isUndefined(v)) {
                return this._curEle.value;
            }

            this._curEle.value = v;

            return this;
        } ,

        // html
        html: function(html , type){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            var range = ['inner' , 'outer'];
            type = G.contain(type , range) ? type : 'inner';

            if (G.isNull(html) || G.isUndefined(html)) {
                return type === 'inner' ? this._curEle.innerHTML : this._curEle.outerHTML;
            }

            if (type === 'inner') {
                this._curEle.innerHTML = html;
            } else {
                this._curEle.outerHTML = html;
            }

            return this;
        } ,

        // 添加节点
        append: function(dom){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            this._curEle.appendChild(dom);

            return this;
        } ,

        // 移除节点
        remove: function(dom){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            return this._curEle.removeChild(dom);
        } ,

        // 插入节点
        insertBefore: function(before , parentNode){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            parentNode.insertBefore(this._curEle , before);

            return this;
        } ,

        // 滚动到顶部
        top: function(time , fn){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            var x = 0;
            var y = 0;

            this.scroll(time , 'y' , x , y , fn);
        } ,

        // 滚动到底部
        bottom: function(time , fn){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            var clientW = this._curEle.clientWidth;
            var clientH = this._curEle.clientHeight;
            var totalW  = this._curEle.scrollWidth;
            var totalH  = this._curEle.scrollHeight;
            var endX    = Math.ceil(totalW - clientW);
            var endY    = Math.ceil(totalH - clientH);

            this.scroll(time , 'y' , endX , endY , fn);
        } ,

        // 滚动到指定位置
        scroll: function(time , pos , x , y , fn) {
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            var posRange = ['x', 'y', 'all'];
            var typeRange = ['top', 'bottom'];

            time = G.getValType(time) !== 'Number' ? 300 : time;
            time = Math.max(0, time);
            pos = G.contain(pos, posRange) ? pos : 'all';

            // 计算参数
            var clientW = this._curEle.clientWidth;
            var clientH = this._curEle.clientHeight;
            var totalW  = this._curEle.scrollWidth;
            var totalH  = this._curEle.scrollHeight;

            // x y 范围值
            var minL = 0;
            var minH = 0;
            var maxL = totalW - clientW;
            var maxH = totalH - clientH;

            // 初始值
            var startX = this._curEle.scrollLeft;
            var startY = this._curEle.scrollTop;
            var sTime = new Date().getTime();

            // 变化量
            var ratio = 0;
            var minRatio = 0;
            var maxRatio = 1;
            var xRange = x - startX;
            var yRange = y - startY;

            // 结束值
            var endX = startX;
            var endY = startY;
            var eTime = sTime;

            var self = this;

            // 帧率
            var freq = 1000 / 60;

            var start = function () {
                eTime = new Date().getTime();
                ratio = (eTime - sTime) / time;
                ratio = Math.max(minRatio, Math.min(maxRatio, ratio));

                endX = startX + xRange * ratio;
                endY = startY + yRange * ratio;

                if (pos === 'x') {
                    self._curEle.scrollLeft = endX;
                    self._curEle.scrollTop = startY;
                }

                if (pos === 'y') {
                    self._curEle.scrollLeft = startX;
                    self._curEle.scrollTop = endY;
                }

                if (pos === 'all') {
                    self._curEle.scrollLeft = endX;
                    self._curEle.scrollTop = endY;
                }

                if (ratio === maxRatio) {
                    if (SmallJs.getValType(fn) === 'Function') {
                        fn();
                    }

                } else {
                    window.setTimeout(start, freq);
                }
            };

            // 开始执行
            start();
        } ,

        // 获取属性
        getAttr: function(attr){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            return this._curEle.getAttribute(attr);
        } ,

        // 设置属性
        setAttr: function(attr , value){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            return this._curEle.setAttribute(attr , value);
        } ,

        // 获取|设置数据集属性
        data: function(attr , val){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('操作要求是单元素而非元素集合');
            }

            if (G.getValType(val) === 'Undefined') {
                return this._curEle.getAttribute('data-' + attr);
            }

            this._curEle.setAttribute('data-' + attr , val);

            return this;
        } ,

        // 判断是否是 dom 元素
        isDom: function(){
            return SmallJs.isDOMEle(this._curEle);
        } ,

        // 是否是 dom 集合
        isDomList: function(){
            return SmallJs.isDOMList(this._curEle);
        } ,

        /*
         * 指针移动：第一个元素
         * @param  Boolean  isReturnNewObj 是否返回导航后副本
         * @return Object
         */
        first: function(isReturnCopy){
            var isReturnCopy = SmallJs.getValType(isReturnCopy) !== 'Boolean' ? false : isReturnCopy;

            if (!isReturnCopy) {
                if (!SmallJs.isDOMList(this._curEle)) {
                    return this;
                }

                this._curEle = this._curEle[0];
                this.length = 1;

                return this;
            }

            return SmallJs(this._curEle[0]);
        } ,

        /*
         * 指针移动：最后一个元素
         * @param  Boolean  isReturnNewObj 是否返回导航后副本
         * @return Object
         */
        last: function(isReturnCopy){
            var isReturnCopy = SmallJs.getValType(isReturnCopy) !== 'Boolean' ? false : isReturnCopy;

            if (!isReturnCopy) {
                if (!SmallJs.isDOMList(this._curEle)) {
                    return this._curEle;
                }

                this._curEle = this._curEle[this.length - 1];
                this.length = 1;

                return this;
            }

            return SmallJs(this._curEle[this.length - 1]);
        } ,

        /*
         * 指针移动：指定元素
         * 1. idx 类型不是 number 时，返回 第一个元素
         * 2. idx 的大小 大于等于 总长度时 ，返回最后一个元素
         */
        jump: function(idx , isReturnCopy){
            var idx = SmallJs.getValType(idx) !== 'Number' ? 0 : idx >= this.length ? this.length - 1 : idx;
            var isReturnCopy = SmallJs.getValType(isReturnCopy) !== 'Boolean' ? false : isReturnCopy;

            if (!isReturnCopy) {
                if (!SmallJs.isDOMList(this._curEle)) {
                    return this;
                }

                this._curEle = this._curEle[idx];
                this.length = 1;

                return this;
            }

            return SmallJs(this._curEle[idx]);
        } ,

        /*
         * 对象合并（继承），不建议使用。未经测试！
         * @param1 HTMLElement src
         * @param2 Object      copy
         * ....
         * @return 继承 SmallJs 后的 HTMLElement
         */
        _merge: function(){
            if (SmallJs.isDOMList(this._curEle)) {
                throw new Error('当前指针所指向的是一个 DOM 元素集合！不是单一的元素！请设置单一元素后在进行合并！');
            }

            var src       = arguments[0];
            var list      = SmallJs.mergeObj.apply(null , SmallJs.toArray(arguments , 1));
            for (var key in list)
            {
                if (SmallJs.getValType(src[key]) === 'Undefined') {
                    if (SmallJs.getValType(list[key]) === 'Array') {
                        src[key] = [];
                        this._merge(src[key] , list[key]);
                    } else if (SmallJs.getValType(list[key]) === 'Object') {
                        src[key] = {};
                        this._merge(src[key] , list[key]);
                    } else {
                        src[key] = list[key];
                    }
                }
            }
            return src;

        } ,

        // 获取样式值
        getStyleVal: function(attr , pseudo){
            pseudo = SmallJs.getValType(pseudo) === 'Undefined' ? null : pseudo;

            return window.getComputedStyle(this._curEle , pseudo)[attr];
        } ,

        // 设置元素 Css 样式
        css: function(json){
            json = SmallJs.getValType(json) !== 'Object' ? {} : json;

            var key  = null;

            if (SmallJs.isDOMList(this._curEle)) {
                var i   = 0;
                var cur = null;

                for (; i < this._curEle.length; ++i)
                {
                    for (key in json)
                    {
                        this._curEle[i].style[key] = json[key];
                    }
                }
            } else {
                for (key in json)
                {
                    this._curEle.style[key] = json[key];
                }
            }



            return this;
        } ,

        /*
         * 获取盒子 宽度
         * @param   Element  ele       待获取的元素
         * @param   String   boxType   待获取元素的盒子类型，支持 content-box | padding-box | border-box | true <=> content-box
         * @return  Number
         */
        getEleW: function(boxType){
            // 宽度
            var w = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('width'))));
            // padding
            var pl = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('paddingLeft'))));
            var pr = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('paddingRight'))));
            // 边框
            var bl = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('borderLeftWidth'))));
            var br = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('borderRightWidth'))));
            // 盒子类型
            var boxRange = ['border-box' , 'padding-box' , 'content-box'];
            // 当前的元素 box-sizing 值
            var boxSizing;
            var bReg;

            w  = isNaN(w)  ? 0 : w;
            pl = isNaN(pl) ? 0 : pl;
            pr = isNaN(pr) ? 0 : pr;
            bl = isNaN(bl) ? 0 : bl;
            br = isNaN(br) ? 0 : br;


            if (!SmallJs.contain(boxType , boxRange) && SmallJs.getValType(boxType) === 'Boolean') {
                boxType = 'content-box';
            }

            if (!SmallJs.contain(boxType , boxRange) && typeof boxType !== 'Boolean') {
                boxType = 'border-box';
            }

            // box-sizing
            boxSizing = this.getStyleVal('boxSizing');

            /*
             * 浏览器检测
             * 比较奇葩的是：
             * 例如， ele => box-sizing:border-box;
             * 在 chrome 内核浏览器 或 firefox 内核浏览器中， width = width + padding + border ; height = height + padding + border
             * 但是！在 ie 内核浏览器中， width = width ; height = height
             * 所以，在计算高度的时候，需要区别对待
             */
            bReg = /ie|edge/i;

            if (boxType === 'border-box') {
                if (boxSizing == 'content-box') {
                    return w + pl + pr + bl + br;
                }

                if (boxSizing == 'border-box') {
                    return bReg.test(browser) ? w + pl + pr + bl + br : w;
                }
            }

            if (boxType === 'padding-box') {
                if (boxSizing == 'content-box') {
                    return w + pl + pr;
                }

                if (boxSizing == 'border-box') {
                    return bReg.test(browser) ? w + pl + pr : w - bl - br;
                }
            }

            if (boxType === 'content-box') {
                if (boxSizing == 'content-box') {
                    return w;
                }

                if (boxSizing == 'border-box') {
                    return bReg.test(browser) ? w : w - bl - br - pl - pr;
                }
            }

            return false;
        } ,

        /*
         * 获取盒子 高度
         * @param   Element  ele       待获取的元素
         * @param   String   boxType   待获取元素的盒子类型，支持 content-box | padding-box | border-box | true <=> content-box
         * @return  Number
         */
        getEleH: function(boxType){
            // 高度
            var h = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('height'))));
            // padding
            var pt = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('paddingTop'))));
            var pb = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('paddingBottom'))));
            // 边框
            var bt = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('borderTopWidth'))));
            var bb = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('borderBottomWidth'))));
            // 盒子类型范围
            var boxRange = ['border-box' , 'padding-box' , 'content-box'];
            // 当前的元素 box-sizing 值
            var boxSizing;
            var bReg;

            h  = isNaN(h)  ? 0 : h;
            pt = isNaN(pt) ? 0 : pt;
            pb = isNaN(pb) ? 0 : pb;
            bt = isNaN(bt) ? 0 : bt;
            bb = isNaN(bb) ? 0 : bb;

            if (!SmallJs.contain(boxType , boxRange) && typeof boxType === 'Boolean') {
                boxType = 'content-box';
            }

            if (!SmallJs.contain(boxType , boxRange) && typeof boxType !== 'Boolean') {
                boxType = 'border-box';
            }

            bReg      = /ie|edge/i;
            // box-sizing
            boxSizing = this.getStyleVal('boxSizing');

            if (boxType === 'border-box') {
                if (boxSizing === 'content-box') {
                    return h + pt + pb + bt + bb;
                }

                if (boxSizing === 'border-box') {
                    return bReg.test(browser) ? h + pt + pb + bt + bb : h;
                }
            }

            if (boxType === 'padding-box') {
                if (boxSizing === 'content-box') {
                    return h + pt + pb;
                }

                if (boxSizing === 'border-box') {
                    return bReg.test(browser) ? h + pt + pb : h - bt - bb;
                }
            }

            if (boxType === 'content-box') {
                if (boxSizing == 'content-box') {
                    return h;
                }

                if (boxSizing == 'border-box') {
                    return bReg.test(browser) ? h : h - bt - bb - pt - pb;
                }
            }

            return false;
        } ,

        /*
         * 获取盒子 总宽度(margin + border + padding + width)
         * @return  Number
         */
        getTW: function(){
            // 宽度
            var w = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('width'))));
            // padding
            var pl = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('paddingLeft'))));
            var pr = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('paddingRight'))));
            // 边框
            var bl = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('borderLeftWidth'))));
            var br = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('borderRightWidth'))));
            // margin
            var ml = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('marginLeft'))));
            var mr = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('marginRight'))));
            var boxSizing;
            var bReg = /ie|edge/i;

            w  = isNaN(w)  ? 0 : w;
            pl = isNaN(pl) ? 0 : pl;
            pr = isNaN(pr) ? 0 : pr;
            bl = isNaN(bl) ? 0 : bl;
            br = isNaN(br) ? 0 : br;
            ml = isNaN(ml) ? 0 : ml;
            mr = isNaN(mr) ? 0 : mr;

            // box-sizing
            boxSizing = this.getStyleVal('boxSizing');

            if (boxSizing == 'content-box') {
                return  w + pl + pr + bl + br + ml + mr;
            }

            if (boxSizing == 'border-box') {
                return bReg.test(browser) ? w + pl + pr + bl + br + ml + mr : w + ml + mr;
            }

            return false;
        } ,


        /*
         * 获取盒子 总高度(margin + border + padding + height)
         * @return  Number
         */
        getTH: function(){
            // 高度
            var h = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('height'))));
            // padding
            var pt = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('paddingTop'))));
            var pb = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('paddingBottom'))));
            // 边框
            var bt = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('borderTopWidth'))));
            var bb = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('borderBottomWidth'))));
            // margin
            var mt = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('marginTop'))));
            var mb = Math.max(0 , Math.floor(parseFloat(this.getStyleVal('marginBottom'))));
            var boxSizing;
            var bReg = /ie|edge/i;

            h  = isNaN(h) ? 0  : h;
            pt = isNaN(pt) ? 0 : pt;
            pb = isNaN(pb) ? 0 : pb;
            bt = isNaN(bt) ? 0 : bt;
            bb = isNaN(bb) ? 0 : bb;
            mt = isNaN(mt) ? 0 : mt;
            mb = isNaN(mb) ? 0 : mb;

            // box-sizing
            boxSizing = this.getStyleVal('boxSizing');

            if (boxSizing == 'content-box') {
                return h + pt + pb + bt + bb + mt + mb;
            }

            if (boxSizing == 'border-box') {
                return bReg.test(browser) ? h + pt + pb + bt + bb + mt + mb : h + mt + mb;
            }

            return false;
        } ,

        // 获取样式位置值
        getCoordVal: function(type){
            var typeRange = ['left' , 'top' , 'right' , 'bottom' , 'marginLeft' , 'marginRight' , 'marginTop' , 'marginBottom'];

            if (!SmallJs.contain(type , typeRange)) {
                throw new RangeError('不支持的位置，受支持的位置有：' + typeRange.join(' '));
            }

            return parseFloat(this.getStyleVal(type));
        } ,

        /*
         * 视口坐标
         * 获取相对于浏览器窗口 可见区域左上角的 left top
         * 有滚动条时，结果依旧正确！放心使用
         * @param  Element ele   待获取元素
         * @param  String  type  获取的类型
         * @return Number
         */
        getWindowOffsetVal: function(type){
            var typeRange = ['left' , 'top' , 'all'];
            var ele	      = this._curEle;

            if (!SmallJs.contain(type , typeRange)) {
                throw new TypeError('获取的值的类型不在范围内！支持的范围：' + typeRange.join(' '));
            }

            if (type === 'left') {
                return this._curEle.getBoundingClientRect().left;
            }

            if (type === 'top') {
                return this._curEle.getBoundingClientRect().top;
            }

            return {
                'left': this._curEle.getBoundingClientRect().left  ,
                'top':  this._curEle.getBoundingClientRect().top
            }


        } ,

        /*
         * 文档坐标
         * 获取相对于文档左上角的 left top
         * 有滚动条时，结果依旧正确！放心使用
         * @param  Element ele   待获取元素
         * @param  String  type  获取的类型
         * @return Number
         */
        getDocOffsetVal: function(type , until){
            var typeRange = ['left' , 'top' , 'all'];
            var dom		  = this._curEle;
            until = SmallJs.isDOMEle(until) ? until : document.body;

            if (!SmallJs.contain(type , typeRange)) {
                throw new TypeError('获取的值的类型不在范围内！支持的范围：' + typeRange.join(' '));
            }

            var leftVal = 0;
            var topVal  = 0;
            var w		= this.getEleW('border-box');
            var h		= this.getEleH('border-box');

            while (dom !== until)
            {
                if (SmallJs.isDOMEle(dom) && SmallJs.getValType(dom.offsetLeft) !== 'Undefined') {
                    leftVal += dom.offsetLeft;
                }

                if (SmallJs.isDOMEle(dom) && SmallJs.getValType(dom.offsetTop) !== 'Undefined') {
                    topVal += dom.offsetTop;
                }

                if (!dom.offsetParent) {
                    break;
                }

                dom = dom.offsetParent;
            }

            switch (type)
            {
                case 'left': return leftVal;
                case 'top': return topVal;
                case 'all': return {
                    left: leftVal ,
                    top:  topVal
                };
            }
        } ,

        /*
         * 事件注册，支持批量操作
         * @param String      eventType
         * @param Function    fn
         * @param Boolean     isRepeat
         * @param Boolean     isCaptureCatch
         * @return undefined
         */
        loginEvent: function(eventType , fn , isRepeat , isCaptureCatch){
            if (SmallJs.getValType(eventType) !== 'String') {
                throw new TypeError('参数 1 类型错误');
            }

            if (SmallJs.getValType(fn) !== 'Function') {
                throw new TypeError('参数 2 类型错误');
            }

            isCaptureCatch = SmallJs.getValType(isCaptureCatch) !== 'Boolean' ? false : isCaptureCatch;
            isRepeat	   = SmallJs.getValType(isRepeat) !== 'Boolean'       ? true  : isRepeat;

            // 添加事件监听
            if (!SmallJs.isDOMList(this._curEle)) {
                if (!isRepeat && SmallJs.event.isBindEvent(this._curEle , eventType)) {
                    throw new Error('对象 ' + this._curEle.toString() +  '不允许重复绑定' + eventType + '事件！若想重复绑定，请在注册事件时设置第三个参数为 true');
                }

                this._curEle.addEventListener(eventType , fn , isCaptureCatch);

                // 向事件列表中添加记录
                var idx = SmallJs.event.getEventObjIdx(this._curEle);

                if (!idx) {
                    SmallJs.event.eventList.push({
                        ele: this._curEle ,
                        eventList: [
                            {
                                eventType: eventType ,
                                isLogin: true
                            }
                        ]
                    });
                } else {
                    SmallJs.event.eventList[idx]['eventList'].push({
                        eventType: eventType ,
                        isLogin: true
                    });
                }
            } else {
                for (var i = 0; i < this.length; ++i)
                {
                    if (!isRepeat && SmallJs.event.isBindEvent(this._curEle[i] , eventType)) {
                        throw new Error('对象 ' + this._curEle.toString() +  '不允许重复绑定该事件！若想重复绑定，请在注册事件时设置三个参数为 true');
                    }

                    this._curEle[i].addEventListener(eventType , fn , isCaptureCatch);

                    // 向事件列表中添加记录
                    var idx = SmallJs.event.getEventObjIdx(this._curEle[i]);

                    if (!idx) {
                        SmallJs.event.eventList.push({
                            ele: this._curEle[i] ,
                            eventList: [
                                {
                                    eventType: eventType ,
                                    isLogin: true
                                }
                            ]
                        });
                    } else {
                        SmallJs.event.eventList[idx]['eventList'].push({
                            eventType: eventType ,
                            isLogin: true
                        });
                    }
                }
            }

            return this;
        } ,

        // 元素方式检查是否存在某父元素
        checkParent: function(parent){
            var pNode = this._curEle.parentNode;

            while (pNode)
            {
                if (pNode === parent) {
                    return true;
                }

                pNode = pNode.parentNode;
            }

            return false;
        } ,

        // 元素方式检查是否存在某子元素
        checkChild: function(child){
            var parent	   = this._curEle;
            var searchRel  = false;
            var searchChild = function(parent){

                if (searchRel) {
                    return ;
                }

                var cNodes = parent.children;

                for (var i = 0; i < cNodes.length; ++i)
                {
                    if (cNodes[i] === child) {
                        searchRel = true;
                        return ;
                    }

                    if (cNodes[i].childElementCount !== 0) {
                        searchChild(cNodes[i]);
                    }
                }
            };

            searchChild(parent);

            return searchRel;
        } ,

        // 元素方式检查存在某兄弟元素
        checkSibling: function(sibling){

            if (this.checkTopSibling(sibling)) {
                return true;
            }

            if (this.checkBtmSibling(sibling)) {
                return true;
            }

            return false;
        } ,

        // 水平向上查找检查是否存在某元素的某兄弟元素
        checkTopSibling: function(topSibling){
            var topSearch = this._curEle.previousElementSibling;

            while (topSearch)
            {
                if (topSearch === topSibling) {
                    return true;
                }

                topSearch = topSearch.previousElementSibling;
            }

            return false;
        } ,

        // 水平向下查找检查是否存在某元素的某兄弟元素
        checkBtmSibling: function(btmSibling){
            var btmSearch = this._curEle.nextElementSibling;

            while (btmSearch)
            {
                if (btmSearch === btmSibling) {
                    return true;
                }

                btmSearch = btmSearch.nextElementSibling;
            }

            return false;
        } ,

        /*
         * 返回当前元素的直系子元素集中具有指定特征的子集
         * @param Object  json      属性
         * @param Boolean isStrict  是否严格查询
         * @param Boolean isCopy    是否生成副本
         */
        children: function(json , isStrict , isCopy){
            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new Error('当前元素不是单元素');
            }

            if (SmallJs.getValType(json) !== 'Object') {
                json = {};
            }

            if (SmallJs.getValType(isStrict) !== 'Boolean') {
                isStrict = false;
            }

            if (SmallJs.getValType(isCopy) !== 'Boolean') {
                isCopy = false;
            }

            var res 			= [];
            var cur 			= null;
            var attrVal 		= '';
            var checkVal 		= '';
            var attrValType 	= '';
            var checkValType 	= '';
            var i				= 0;
            var key				= null;
            var children		= this._curEle.children;
            var isSatisfy		= true;

            for (i = 0; i < children.length; ++i)
            {
                cur 		= children[i];
                isSatisfy	= true;

                for (key in json)
                {
                    attrVal 	 = SmallJs.isValidVal(cur[key]) ? cur[key] : cur.getAttribute(key);
                    checkVal 	 = json[key];
                    attrValType  = SmallJs.getValType(attrVal);
                    checkValType = SmallJs.getValType(checkValType);

                    if (isStrict) {
                        if (attrVal === checkVal) {
                            isSatisfy = true;
                        } else {
                            isSatisfy = false;
                            break;
                        }
                    } else {
                        attrValType 	= SmallJs.getValType(attrVal);
                        checkValType 	= SmallJs.getValType(checkVal);

                        if (attrValType === 'String') {
                            attrVal = attrVal.toLowerCase();
                        }

                        if (checkValType === 'String') {
                            checkVal = checkVal.toLowerCase();
                        }

                        if (attrValType === 'String') {
                            if (attrVal.search(checkVal) !== -1) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                                break;
                            }
                        } else {
                            // 非字符串值（我想着应该不可能出现....）
                            if (attrVal == checkVal) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                                break;
                            }
                        }
                    }
                }

                if (isSatisfy) {
                    res.push(cur);
                }
            }

            if (!isCopy) {
                this._curEle = res;
                this.length  = res.length;
                return this;
            } else {
                return SmallJs(res);
            }
        } ,

        /*
         * 向上查找符合条件的所有祖先元素，直到遇到给定的祖先元素为止
         * @param  Element ele
         * @param  Object  json
         * @param  bool    isStrict    是否开启严格模式搜索
         * @param  Boolean isSaveSelf  结果集中是否保留起始元素
         * @param  Boolean isSaveUntil 结果集中是否保留中断搜索的祖先元素
         * @res 满足条件的所有父元素集合
         * @return this
         */
        parentFind: function(json , until , isStrict ,  isCopy){

            if (SmallJs.getValType(json) !== 'Object') {
                json = {};
            }

            if (!SmallJs.isDOMEle(until)) {
                until = document.body;
            }

            if (SmallJs.getValType(isStrict) !== 'Boolean') {
                isStrict = false;
            }

            if (SmallJs.getValType(isCopy) !== 'Boolean') {
                isCopy = false;
            }

            var res		= [];
            var pNode 	= this._curEle.parentNode;
            var attrVal = '';
            var checkVal = '';
            var attrValType = '';
            var checkValType = '';
            var isSatisfy = true;

            while (pNode !== until)
            {
                isSatisfy 		= true;

                for (var key in json)
                {
                    attrVal 	    = SmallJs.isValidVal(pNode[key]) ? pNode[key] : pNode.getAttribute(key);
                    checkVal 		= json[key];

                    if (isStrict) {
                        if (attrVal === checkVal) {
                            isSatisfy = true;
                        } else {
                            isSatisfy = false;
                            break;
                        }
                    } else {
                        attrValType 	= SmallJs.getValType(attrVal);
                        checkValType 	= SmallJs.getValType(checkValType);

                        if (attrValType === 'String') {
                            attrVal = attrVal.toLowerCase();
                        }

                        if (checkValType === 'String') {
                            checkVal = checkVal.toLowerCase();
                        }

                        if (attrValType === 'String') {
                            if (attrVal.search(checkVal) !== -1) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                                break;
                            }
                        } else {
                            if (attrVal == checkVal) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                                break;
                            }
                        }
                    }
                }

                if (isSatisfy) {
                    res.push(pNode);
                }

                pNode = pNode.parentNode;
            }

            if (!isCopy) {
                this._curEle = res;
                this.length  = res.length;
                return this;
            } else {
                return SmallJs(res);
            }
        } ,

        /**
         * 返回当前元素的所有父元素（直到 document.body）
         */
        parents: function(isCopy){
            return this.parentFind({} , null , false , isCopy);
        } ,

        /*
         * 向上查找所有祖先元素，直到遇到给定的祖先元素为止
         * @param  Element until
         * @param  bool    isStrict    是否开启严格模式搜索
         * @param  Boolean isSaveSelf  结果集中是否保留起始元素
         * @param  Boolean isSaveUntil 结果集中是否保留中断搜索的祖先元素
         * @return Element | false
         */
        parentFindAll: function(until , isCopy){
            if (!SmallJs.isDOMEle(until)) {
                until = document.body;
            }

            if (SmallJs.getValType(isCopy) !== 'Boolean') {
                isCopy = false;
            }

            var res   = [];
            var pNode = this._curEle.parentNode;

            while (pNode !== until)
            {
                res.push(pNode);

                pNode = pNode.parentNode;
            }

            if (!isCopy) {
                this._curEle = res;
                this.length  = res.length;

                return this;
            } else {
                return SmallJs(res);
            }
        } ,

        /*
         * 向下查找所有符合条件的子元素
         * @param Element ele
         * @param Object  json
         * @param bool    isStrict 是否开启严格模式搜索 a === b 而不是 a.search(b) !==-1
         * @param Boolean isCopy   是否复制一份，而不是替换当前 context
         * @return Element | false
         */
        childFind: function(json , isStrict , isCopy){
            if (SmallJs.getValType(json) !== 'Object') {
                json = {};
            }

            if (SmallJs.getValType(isStrict) !== 'Boolean') {
                isStrict = false;
            }

            if (SmallJs.getValType(isCopy) !== 'Boolean') {
                isCopy = false;
            }

            var cNode 			= false;
            var self  			= this;
            var all   			= [];
            var isSatisfy 		= true;
            var attrVal  		= null;
            var checkVal 		= null;
            var attrValType		= null;
            var checkValType 	= null;

            var find = function(ele){
                if (!SmallJs.isDOMEle(self._curEle)) {
                    return false;
                }

                var cNodes = ele.children;

                for (var i = 0; i < cNodes.length; ++i)
                {
                    isSatisfy = true;
                    cNode 	  = cNodes[i];

                    for (var key in json)
                    {
                        attrVal 	    = SmallJs.isValidVal(cNode[key]) ? cNode[key] : cNode.getAttribute(key);
                        checkVal 		= json[key];

                        if (isStrict) {
                            if (attrVal === checkVal) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                                break;
                            }
                        } else {
                            // 字符串值
                            attrValType 	= SmallJs.getValType(attrVal);
                            checkValType 	= SmallJs.getValType(checkVal);

                            if (attrValType === 'String') {
                                attrVal = attrVal.toLowerCase();
                            }

                            if (checkValType === 'String') {
                                checkVal = checkVal.toLowerCase();
                            }

                            if (attrValType === 'String') {
                                if (attrVal.search(checkVal) !== -1) {
                                    isSatisfy = true;
                                } else {
                                    isSatisfy = false;
                                    break;
                                }
                            } else {
                                // 非字符串值（我想着应该不可能出现....）
                                if (attrVal == checkVal) {
                                    isSatisfy = true;
                                } else {
                                    isSatisfy = false;
                                    break;
                                }
                            }
                        }
                    }

                    if (isSatisfy) {
                        all.push(cNode);
                    }

                    if (cNode.childElementCount !== 0) {
                        find(cNode);
                    }
                }
            };

            find(this._curEle);

            if (!isCopy) {
                this._curEle = all;
                this.length  = this._curEle.length;
                return this;
            } else {
                return SmallJs(all);
            }
        } ,



        /**
         * 从当前元素集中排除具有指定特征的元素
         */
        not: function(json , isStrict , isCopy){
            if (SmallJs.getValType(json) !== 'Object') {
                throw new TypeError('json 类型错误！');
            }

            if (SmallJs.getValType(isStrict) !== 'Boolean') {
                isStrict = false;
            }

            if (SmallJs.getValType(isCopy) !== 'Boolean') {
                isCopy = false;
            }

            if (!SmallJs.isDOMList(this._curEle)) {
                throw new Error('当前元素不是元素集！');
            }

            var cur  	 	= null;
            var attrVal  	= '';
            var checkVal 	= '';
            var res      	= [];
            var isSatisfy 	= false;
            var i 			= 0;
            var key			= null;
            var attrValType  = '';
            var checkValType = '';

            for (i = 0; i < this.length; ++i)
            {
                cur = this._curEle[i];

                for (key in json)
                {
                    attrVal 	 = cur[key];
                    checkVal 	 = json[key];
                    attrValType  = SmallJs.getValType(attrVal);
                    checkValType = SmallJs.getValType(checkValType);

                    if (isStrict) {
                        if (attrVal !== checkVal) {
                            isSatisfy = true;
                        } else {
                            isSatisfy = false;
                        }
                    } else {
                        attrValType 	= SmallJs.getValType(attrVal);
                        checkValType 	= SmallJs.getValType(checkVal);

                        if (attrValType === 'String') {
                            attrVal = attrVal.toLowerCase();
                        }

                        if (checkValType === 'String') {
                            checkVal = checkVal.toLowerCase();
                        }

                        if (attrValType === 'String') {
                            if (attrVal.search(checkVal) === -1) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                            }
                        } else {
                            // 非字符串值（我想着应该不可能出现....）
                            if (attrVal != checkVal) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                            }
                        }
                    }
                }

                if (isSatisfy) {
                    res.push(cur);
                }
            }

            if (!isCopy) {
                this._curEle = res;
                this.length  = res.length;
                return this;
            } else {
                return SmallJs(res);
            }
        } ,

        /**
         * 从当前元素集中获取具有指定特征的元素
         */
        find: function(json , isStrict , isCopy){
            if (SmallJs.getValType(json) !== 'Object') {
                throw new TypeError('json 类型错误！');
            }

            if (SmallJs.getValType(isStrict) !== 'Boolean') {
                isStrict = false;
            }

            if (SmallJs.getValType(isCopy) !== 'Boolean') {
                isCopy = false;
            }

            if (!SmallJs.isDOMList(this._curEle)) {
                throw new Error('当前元素不是元素集！');
            }

            var cur  	 	= null;
            var attrVal  	= '';
            var checkVal 	= '';
            var res      	= [];
            var isSatisfy 	= false;
            var i 			= 0;
            var key			= null;
            var attrValType  = '';
            var checkValType = '';

            for (i = 0; i < this.length; ++i)
            {
                cur = this._curEle[i];

                for (key in json)
                {
                    attrVal 	 = cur[key];
                    checkVal 	 = json[key];
                    attrValType  = SmallJs.getValType(attrVal);
                    checkValType = SmallJs.getValType(checkValType);

                    if (isStrict) {
                        if (attrVal === checkVal) {
                            isSatisfy = true;
                        } else {
                            isSatisfy = false;
                        }
                    } else {
                        attrValType 	= SmallJs.getValType(attrVal);
                        checkValType 	= SmallJs.getValType(checkVal);

                        if (attrValType === 'String') {
                            attrVal = attrVal.toLowerCase();
                        }

                        if (checkValType === 'String') {
                            checkVal = checkVal.toLowerCase();
                        }

                        if (attrValType === 'String') {
                            if (attrVal.search(checkVal) !== -1) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                            }
                        } else {
                            // 非字符串值（我想着应该不可能出现....）
                            if (attrVal == checkVal) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                            }
                        }
                    }
                }

                if (isSatisfy) {
                    res.push(cur);
                }
            }

            if (!isCopy) {
                this._curEle = res;
                this.length  = res.length;
                return this;
            } else {
                return SmallJs(res);
            }
        } ,

        /*
         * 水平查找符合条件的兄弟元素
         * @param Element ele
         * @param Object json
         * @return Element | false
         */
        siblingFind: function(json , isStrict , isCopy){
            var res = [];

            var topSiblings = this.siblingTopFind(json , isStrict , isCopy);
            var btmSiblings = this.siblingBtmFind(json , isStrict , isCopy);

            topSiblings.get().forEach(function(val , key , arr){
                res.push(val);
            });

            btmSiblings.get().forEach(function(val , key , arr){
                res.push(val);
            });

            if (!isCopy) {
                this._curEle = res;
                this.length = res.length;

                return this;
            } else {
                return SmallJs(res);
            }
        } ,


        // 兄弟元素 水平向上查找指定特征的兄弟元素
        siblingTopFind: function(json , isStrict , isCopy){

            if (SmallJs.getValType(json) !== 'Object') {
                throw new TypeError('json 类型错误！');
            }

            if (SmallJs.getValType(isStrict) !== 'Boolean') {
                isStrict = false;
            }

            if (SmallJs.getValType(isCopy) !== 'Boolean') {
                isCopy = false;
            }

            var prevSibling = this._curEle.previousElementSibling;

            // console.log(this._curEle , prevSibling);

            var res			= [];
            var isSatisfy	= true;
            var attrVal		= '';
            var checkVal	= '';
            var attrValType = '';
            var checkValType = '';
            var key 		= null;

            while (G.isDOMEle(prevSibling))
            {
                isSatisfy = true;

                for (key in json)
                {
                    attrVal  		= prevSibling[key];
                    checkVal 		= json[key];

                    if (isStrict) {
                        if (attrVal === checkVal) {
                            isSatisfy = true;
                        } else {
                            isSatisfy = false;
                            break;
                        }
                    } else {
                        attrValType 	= SmallJs.getValType(attrVal);
                        checkValType 	= SmallJs.getValType(checkValType);

                        if (attrValType === 'String') {
                            attrVal = attrVal.toLowerCase();
                        }

                        if (checkValType === 'String') {
                            checkVal = checkVal.toLowerCase();
                        }

                        if (attrValType === 'String') {
                            if (attrVal.search(checkVal) !== -1) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                                break;
                            }
                        } else {
                            if (attrVal == checkVal) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                                break;
                            }
                        }
                    }
                }

                if (isSatisfy) {
                    res.push(prevSibling);
                }

                prevSibling = prevSibling.previousElementSibling;
            }

            if (!isCopy) {
                this._curEle = res;
                this.length  = res.length;
                return this;
            } else {
                return SmallJs(res);
            }
        } ,

        // 兄弟元素 水平向下查找
        siblingBtmFind: function(json ,isStrict , isCopy){

            if (SmallJs.getValType(json) !== 'Object') {
                throw new TypeError('json 类型错误！');
            }

            if (SmallJs.getValType(isStrict) !== 'Boolean') {
                isStrict = false;
            }

            if (SmallJs.getValType(isCopy) !== 'Boolean') {
                isCopy = false;
            }

            var nextSibling = this._curEle.nextElementSibling;
            var res			= [];
            var isSatisfy	= true;
            var attrVal		= '';
            var checkVal	= '';
            var attrValType = '';
            var checkValType = '';
            var key			 = null;

            while (G.isDOMEle(nextSibling))
            {
                isSatisfy = true;

                for (key in json)
                {
                    attrVal  		= nextSibling[key];
                    checkVal 		= json[key];

                    if (isStrict) {
                        if (attrVal === checkVal) {
                            isSatisfy = true;
                        } else {
                            isSatisfy = false;
                            break;
                        }
                    } else {
                        attrValType 	= SmallJs.getValType(attrVal);
                        checkValType 	= SmallJs.getValType(checkValType);

                        if (attrValType === 'String') {
                            attrVal = attrVal.toLowerCase();
                        }

                        if (checkValType === 'String') {
                            checkVal = checkVal.toLowerCase();
                        }

                        if (attrValType === 'String') {
                            if (attrVal.search(checkVal) !== -1) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                                break;
                            }
                        } else {
                            if (attrVal == checkVal) {
                                isSatisfy = true;
                            } else {
                                isSatisfy = false;
                                break;
                            }
                        }
                    }
                }

                if (isSatisfy) {
                    res.push(nextSibling);
                }

                nextSibling = nextSibling.nextElementSibling;
            }

            if (!isCopy) {
                this._curEle = res;
                this.length  = res.length;
                return this;
            } else {
                return SmallJs(res);
            }
        } ,

        // 添加类名
        addClass: function(cn){
            if (SmallJs.getValType(cn) === 'String') {
                this.removeClass(cn);
                var originalClassName  = this._curEle.className;
                this._curEle.className = originalClassName === '' ? cn : originalClassName + ' ' + cn;
            } else {
                if (SmallJs.getValType(cn) === 'Array') {
                    var i   = 0;
                    var cur = '';

                    for (; i < cn.length; ++i)
                    {
                        cur = cn[i];

                        this.removeClass(cur);
                        var originalClassName  = this._curEle.className;
                        this._curEle.className = originalClassName === '' ? cur : originalClassName + ' ' + cur;
                    }
                } else {
                    throw new Error("参数 1 类型错误");
                }
            }
        } ,

        // 移除类名
        removeClass: function(className){
            var originalClassName = this._curEle.className;
            var cn = '';

            if (SmallJs.getValType(cn) === 'array') {
                cn = className.shift();
            } else {
                cn = className;
            }

            if (originalClassName.search(cn) === -1){
                return ;
            }

            var result = originalClassName.split(' ');

            for (var i = 0; i < result.length; ++i)
            {
                if (result[i]=== cn){
                    result.splice(i , 1);
                    i--;
                }
            }

            result = result.join(' ');
            this._curEle.className = result;

            if (SmallJs.getValType(cn) === 'array' && className.length !== 0) {
                this.removeClass(className);
            }
        } ,

        // 替换类名
        replaceClass: function(oldCn , newCn){
            this.removeClass(oldCn);
            this.addClass(newCn);
        } ,

        /*
         * 判断类名是否存在！
         * @param String   cn
         * @param Boolean  isStrict
         */
        hasClass: function(cn , isStrict){
            if (SmallJs.getValType(this._curEle.className) === 'Undefined') {
                return false;
            }

            var cnList   = this._curEle.className.split(' ');
            var isStrict = SmallJs.getValType(isStrict) !== 'Boolean' ? true : isStrict;

            for (var i = 0; i < cnList.length; ++i)
            {
                if (isStrict ? cnList[i] === cn : cnList[i] == cn) {
                    return true;
                }
            }

            return false;
        } ,

        // 切换内容
        switchCon: function(list){
            var isExists = SmallJs.scn('hide');

            if (isExists === false) {
                document.styleSheets[0].addRule('.hide','display:none !important;' , 0);
            }

            this.removeClass('hide');

            for (var i = 0; i < list.length; ++i)
            {
                if (list[i] !== this._curEle){
                    SmallJs(list[i]).addClass('hide');
                }
            }
        } ,

        /*
         * 突出显示被选中的元素
         * @param String cn 类名
         * @param HTMLCollect list  元素集合
         * @param reverse 相反操作
         * @return undefined
         */
        highlight: function(cn , list , reverse){
            reverse = SmallJs.getValType(reverse) === 'Boolean' ? reverse : false;

            var cur = null;

            for (var i = 0; i < list.length; ++i)
            {
                cur = SmallJs(list[i]);

                if (!reverse) {
                    if (this._curEle !== list[i]) {
                        cur.removeClass(cn);
                    } else {
                        cur.addClass(cn);
                    }
                } else {
                    if (this._curEle !== list[i]) {
                        cur.addClass(cn);
                    } else {
                        cur.removeClass(cn);
                    }
                }
            }
        } ,

        // 获取元素索引
        index: function(list){
            for (var i = 0; i < list.length; ++i)
            {
                if (list[i] === this._curEle){
                    return i;
                }
            }

            return false;
        } ,

        /*
         * 初始化时间选择器函数
         * @param Element ele    待填充的元素
         * @param Number sn      开始的数字
         * @param Number en      结束的数字
         * @param Number focusN  被命中的数字
         * @return HTML String
         */
        initTimeSelect: function(sn , en , focusN){

            if (getValType(sn) !== 'Number') {
                throw new TypeError('sn 参数错误');
            }

            if (getValType(en) !== 'Number') {
                throw new TypeError('en 参数错误');
            }

            if (getValType(focusN) !== 'Number') {
                throw new TypeError('focusN 参数错误');
            }

            if (sn > en) {
                throw new RangeError('初始值大于最大值！');
            }

            var opt = '';
            var option = null;

            for (var i = sn; i <= en; ++i)
            {
                option = document.createElement('option');
                option.value = i;
                option.textContent = i;

                if (SmallJs.getValType(focusN) !== 'Undefined' && focusN === i) {
                    option.selected = true;
                }

                this._curEle.appendChild(option);
            }
        } ,


        /*
         * 全屏
         */
        requestFullScreen: function(){
            var ele				   = this._curEle;
            var fullScreenEnabled  = document.fullScreenEnabled || document.webkitFullScreenEnabled || document.mozFullScreenEnabled || document.msFullScreenEnabled;
            var isFullScreen	   = document.fullScreenElement || document.webkitFullScreenElement || document.mozFullScreenElement || document.msFullScreenElement;

            if (SmallJs.getValType(fullScreenEnabled) === 'Undefined' || fullScreenEnabled) {
                if (SmallJs.getValType(isFullScreen) === 'Undefined') {
                    if (ele.requestFullScreen) {
                        ele.requestFullScreen();
                    } else if (ele.webkitRequestFullScreen) {
                        ele.webkitRequestFullScreen();
                    } else if (ele.mozRequestFullScreen) {
                        ele.mozRequestFullScreen();
                    } else if (ele.requestFullscreen) {
                        ele.requestFullscreen();
                    } else if (ele.msRequestFullscreen) {
                        ele.msRequestFullscreen();
                    } else {
                        console.log('不存在进入全屏的方法！ => undefined');
                    }
                } else if (isFullScreen === null) {
                    if (ele.requestFullScreen) {
                        ele.requestFullScreen();
                    } else if (ele.webkitRequestFullScreen) {
                        ele.webkitRequestFullScreen();
                    } else if (ele.mozRequestFullScreen) {
                        ele.mozRequestFullScreen();
                    } else if (ele.requestFullscreen) {
                        ele.requestFullscreen();
                    } else if (ele.msRequestFullscreen) {
                        ele.msRequestFullscreen();
                    } else {
                        console.log('不存在进入全屏的方法！ => null');
                    }
                } else {
                    console.log('元素已经是全屏状态了！');
                    return true;
                }
            } else {
                console.log('不支持全屏模式！');
            }
        } ,

        /*
         * 退出全屏
         */
        exitFullScreen: function(){
            var fullScreenEnabled  = document.fullScreenEnabled || document.webkitFullScreenEnabled || document.mozFullScreenEnabled || document.msFullScreenEnabled;
            var isFullScreen	   = document.fullScreenElement || document.webkitFullScreenElement || document.mozFullScreenElement || document.msFullScreenElement;

            if (SmallJs.getValType(fullScreenEnabled) === 'Undefined' || fullScreenEnabled) {
                if (SmallJs.getValType(isFullScreen) === 'Undefined') {
                    if (document.exitFullScreen) {
                        document.exitFullScreen();
                    } else if (document.webkitExitFullScreen) {
                        document.webkitExitFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else {
                        console.log('不存在退出全屏的方法！ => undefined');
                    }
                } else if (isFullScreen !== null) {
                    if (document.exitFullScreen) {
                        document.exitFullScreen();
                    } else if (document.webkitExitFullScreen) {
                        document.webkitExitFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else {
                        console.log('不存在退出全屏的方法！ => null');
                    }
                } else {
                    console.log('元素已经是非全屏状态了！');
                    return true;
                }
            } else {
                console.log('不支持全屏模式！');
            }
        } ,

        // 动画扩展
        animate: function(opt){
            if (SmallJs.getValType(opt['ele']) === 'Undefined') {
                opt['ele'] = this._curEle;
            }

            this.animateObj = Animate(opt);

            return this;
        } ,

        // 动画扩展
        move: function(con){
            this.moveId = new MoveEle(this._curEle , con);
            this._curEle.isDefineMoveEvent = true;

            return this;
        } ,

        /*
         * 使元素居中
         * @param Element   ele
         * @param Element   container
         * @param String    pos            水平居中（horizontal） | 垂直居中(vertical) | 水平垂直居中（all）
         */
        center: function(container , pos){

            if (!SmallJs.isDOMEle(this._curEle)) {
                throw new TypeError('不是 DOM 元素s');
            }

            var posRange = ['horizontal' , 'vertical' , 'all'];
            var lv		 = null;
            var tv		 = null;

            if (SmallJs.contain(SmallJs.getValType(pos) , posRange)) {

                pos = 'all';

            }

            var unit = 'px';
            var con	   = SmallJs(container);
            var conW   = con.getEleW('padding-box');
            var conH   = con.getEleH('padding-box');
            var myW    = this.getEleW('border-box');
            var myH    = this.getEleH('border-box');

            switch (pos)
            {
                case 'horizontal':
                    lv = Math.max(0 , Math.floor((conW - myW) / 2));

                    this.css({left: lv + unit});

                    break;
                case 'vertical':
                    tv = Math.max(0 , Math.floor((conH - myH) / 2));

                    this.css({top: tv + unit});

                    break;
                case 'all':
                    lv = Math.max(0 , Math.floor((conW - myW) / 2));
                    tv = Math.max(0 , Math.floor((conH - myH) / 2));

                    this.css({left: lv + unit , top: tv + unit});
                    break;

                default: throw new RangeError('不支持的位置类型！当前受支持的位置类型有：' + posRange.join(' '));
            }

        }
    };

    /*
     * ******************************************
     以下是以 SmallJs 作为命名空间的 基础函数库
     * ******************************************
     */

    // 输入域：获取选区范围
    SmallJs.getSelectionForInput = function(dom){
        return {
            startOffset: dom.selectionStart ,
            endOffset: dom.selectionEnd
        };
    };

    // 可编辑的 html：获取选区范围
    SmallJs.getSelectionForContentEditableElement = function(dom){
        var selection = window.getSelection();

        if (selection.rangeCount === 0) {
            return false;
        }

        var range = selection.getRangeAt(0);

        var cRange = range.cloneRange();

        cRange.selectNodeContents(dom);
        cRange.setStart(range.startContainer , range.startOffset);
        cRange.setEnd(range.endContainer , range.endOffset);

        return {
            startOffset: range.startOffset ,
            endOffset: range.endOffset
        };
    };

    // 获取选区
    SmallJs.getSelection = function(dom){
        if (dom.contentEditable !== 'true') {
            return this.getSelectionForInput(dom);
        }

        return this.getSelectionForContentEditableElement(dom);
    };

    // 检查是否存在选区
    SmallJs.isCollapse = function(dom){
        dom.focus();

        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var cRange = range.cloneRange();

        cRange.selectNodeContents(dom);
        cRange.setStart(range.startContainer , range.startOffset);
        cRange.setEnd(range.endContainer , range.endOffset);

        return cRange.collapsed;
    };

    // 获取可编辑元素的光标位置
    SmallJs.getCursorPointForContentEditableElement = function(dom){
        var selection = window.getSelection();

        if (selection.rangeCount === 0) {
            return false;
        }

        var range = selection.getRangeAt(0);
        var cRange = range.cloneRange();

        cRange.selectNodeContents(dom);
        cRange.setEnd(range.endContainer , range.endOffset);

        return cRange.toString().length;
    };

    // 获取 textarea/input 等带有输入域的文本框的光标位置
    SmallJs.getCursorPointForInput = function(dom){
        return dom.selectionEnd;
    };

    // 获取光标当前位置
    SmallJs.getCursorPoint = function(dom){
        if (dom.contentEditable !== 'true') {
            return this.getCursorPointForInput(dom);
        }

        return this.getCursorPointForContentEditableElement(dom);
    };

    // 可编辑 html: 设置光标位置
    SmallJs.setCursorPointForContentEditableElement = function(dom , pos){
        dom.focus();

        // 快捷方式
        var posRange = ['first' , 'last'];

        if (this.contain(pos , posRange)) {
            if (pos === 'first') {
                pos = 0;
            } else {
                pos = dom.childNodes.length;
            }
        }

        var range = document.createRange();

        range.selectNodeContents(dom);

        range.setStart(dom , pos);

        range.collapse(true);

        var selection = window.getSelection();

        selection.removeAllRanges();
        selection.addRange(range);
    };

    // 文本域：设置光标位置
    SmallJs.setCursorPointForInput = function(dom , pos){
        dom.focus();

        dom.setSelectionRange(pos , pos , 'none');
    };

    // 设置光标位置
    SmallJs.setCursorPoint = function(dom , pos){
        if (dom.contentEditable !== 'true') {
            this.setCursorPointForInput(dom , pos);
            return ;
        }

        this.setCursorPointForContentEditableElement(dom , pos);
    };

    // 获取某个元素距离给定父元素的位置
    // 滚动到顶部
    SmallJs.top = function (time , pos , fn){
        var x = 0;
        var y = 0;

        this.scroll(time , pos , x , y , fn);
    };

    // 滚动到底部
    SmallJs.bottom = function(time , pos , fn){
        var doc     = document.documentElement;
        var body    = document.body;
        var clientW = doc.clientWidth;
        var clientH = doc.clientHeight;
        var docW    = body.scrollWidth;
        var docH    = body.scrollHeight;
        var endX    = docW - clientW;
        var endY    = docH - clientH;

        this.scroll(time , pos , endX , endY , fn);
    };

    /**
     * 平滑滚动顶部或者顶部
     * @param String type top bottom
     * @param Number time
     * @param fn 回调函数
     */
    SmallJs.scroll = function(time , pos , x , y , fn){
        var posRange    = ['x' , 'y' , 'all'];
        var typeRange   = ['top' , 'bottom'];

        time = G.getValType(time) !== 'Number' ? 300 : time;
        time = Math.max(0 , time);
        pos  = G.contain(pos , posRange) ? pos : 'all';

        // 计算参数
        var doc     = document.documentElement;
        var body    = document.body;
        var clientW = doc.clientWidth;
        var clientH = doc.clientHeight;
        var docW    = body.scrollWidth;
        var docH    = body.scrollHeight;

        // x y 范围值
        var minL    = 0;
        var minH    = 0;
        var maxL    = docW - clientW;
        var maxH    = docH - clientH;

        // 初始值
        var startX  = window.pageXOffset;
        var startY  = window.pageYOffset;
        var sTime = new Date().getTime();

        // 变化量
        var ratio = 0;
        var minRatio = 0;
        var maxRatio = 1;
        var xRange = x - startX;
        var yRange = y - startY;

        // 结束值
        var endX  = startX;
        var endY  = startY;
        var eTime = sTime;

        // 帧率
        var freq = 1000 / 60;

        var start = function(){
            eTime   = new Date().getTime();
            ratio   = (eTime - sTime) / time;
            ratio   = Math.max(minRatio , Math.min(maxRatio , ratio));

            endX = startX + xRange * ratio;
            endY = startY + yRange * ratio;

            if (pos === 'x') {
                window.scrollTo(endX , startX);
            }

            if (pos === 'y') {
                window.scrollTo(startX , endY);
            }

            if (pos === 'all') {
                window.scrollTo(endX , endY);
            }

            if (ratio === maxRatio) {
                if (G.getValType(fn) === 'Function') {
                    fn();
                }

            } else {
                window.setTimeout(start , freq);
            }
        };

        // 开始执行
        start();
    };

    /**
     * 滚动加载（到了可视区域时候）
     * @param element  dom
     * @param function callbackForEvery 每次浏览器滚动，都会触发
     * @param function callback
     * @return void
     */
    SmallJs.scrollLoad = function(dom , callbackForEvery , callback){
        dom     = G(dom);

        // 判断是否已经在可视区域
        var inVisible = function(){
            var curT = dom.getDocOffsetVal('top');
            var endT = curT + dom.getEleH('border-box');

            if (SmallJs.inVisible(curT) || SmallJs.inVisible(endT)) {
                if (G.getValType(callback) === 'Function') {
                    callback(dom.get());
                } else {
                    console.log('滚动加载未设置回调函数');
                }
            }
        };

        // 定义滚动事件
        G(window).loginEvent('scroll' , function(){
            if (G.getValType(callbackForEvery) === 'Function') {
                callbackForEvery();
            }

            inVisible();
        } , true , false);

        // 初始化定义的时候调用一次，进行初始化加载
        inVisible();
    };

    /**
     * 获取一个集合中的包含指定类名的项
     * @param attr
     * @param value
     * @param list
     * @returns {boolean}
     */
    SmallJs.current = function(value , list){
        var i   = 0;
        var cur = null;

        for (; i < list.length; ++i)
        {
            cur = SmallJs(list[i]);

            if (cur.hasClass(value)) {
                return cur.get();
            }
        }

        return false;
    };

    // 判断一个值是否在文档可见区域内
    // @param number val 是文档坐标值!!
    SmallJs.inVisible = function(val){
        var minVal = window.pageYOffset;
        var maxVal = minVal + document.documentElement.clientHeight;

        if (val >= minVal && val <= maxVal) {
            return true;
        }

        return false;
    };

    /*
     * 获取某个月份的天数
     * 公历：获取某年某月的总天数
     * 1 3 5 7 8 10 12  都是31天
     * 4 6 9 11         都是30天
     * 2 月 平年28天 ， 闰年29天
     * 平年 365 天	 ， 闰年 366天
     */
    SmallJs.getMonthDays = function(year , month){
        year    = parseInt(year);
        month   = parseInt(month);

        var to = [1 , 3 ,5 , 7 , 8 , 10 , 12];
        var tt = [4 , 6 , 9 , 11];

        if (this.contain(month , to)) {
            return 31;
        }

        if (this.contain(month , tt)) {
            return 30;
        }

        /*
         * 闰年判断规则
         * 1. 普通年能被4整除且不能被100整除的为闰年.
         * 2. 世纪年能被400整除的是闰年

         * 满足以上任一规则都是闰年
         */
        if (this.isLeapYear(year)) {
            return 29;
        }

        return 28;
    };

    // 指定 select 和 值，选中
    SmallJs.select = function(select , value){
        var options = G('t.option' , select);
        var i = 0;
        var cur = null;

        for (; i < options.length; ++i)
        {
            cur = G(options.get()[i]);

            if (cur.get().value != value) {
                cur.get().selected = false;
            } else {
                cur.get().selected = true;
            }
        }
    };

    /*
     * 判断是否为闰年
     * 闰年判断规则
     * 1. 普通年能被4整除且不能被100整除的为闰年.
     * 2. 世纪年能被400整除的是闰年

     * 满足以上任一规则都是闰年
     */
    SmallJs.isLeapYear = function(year){
        return ((year % 4 === 0) && (year % 100 !== 0)) || year % 400 === 0;
    };

    /*
     * 阻止事件冒泡
     */
    SmallJs.stopPropagation = function(event){
        event.stopPropagation();
    };

    // 获取单选框的值
    SmallJs.getRadioVal = function (set){
        var i   = 0;
        var cur = null;

        for (; i < set.length; ++i)
        {
            cur = set[i];

            if (cur.checked) {
                return cur.value;
            }
        }

        return false;
    };

    // 获取复选款选择的内容
    SmallJs.getBoxVal = function(set){
        var i       = 0;
        var cur     = null;
        var values  = [];

        for (; i < set.length; ++i)
        {
            cur = set[i];

            if (cur.checked) {
                values.push(cur.value);
            }
        }

        return values;
    };

    /**
     * 设置定时器
     */
    SmallJs.setTimeout = function(fn , time){
        var self = this;

        var timerID = window.setTimeout(function(){
            self.timers[timerID] = 'off';

            if (G.getValType(fn) === 'Function') {
                fn();
            }
        } , time);

        this.timers[timerID] = 'on';
    };

    // 清除定时器
    SmallJs.clearTimeout = function(timerID){
        window.clearTimeout(timerID);

        this.timers[timerID] = 'off';
    };

    // 滚动条滚动到指定位置
    SmallJs.scrollTo = function(obj , x , y , time , fn){
        if (obj['__scrollRunning__'] === 'y') {
            console.log('滚动中，请稍等...');
            return ;
        }

        var self  = this;
        var sTime = new Date().getTime();
        var eTime = 0;
        var ratio = 0;
        var curX = this.getValType(obj) === 'Window' ? obj.pageXOffset : obj.scrollLeft;
        var curY = this.getValType(obj) === 'Window' ? obj.pageYOffset : obj.scrollTop;
        var xAmount = x - curX;
        var yAmount = y - curY;
        var endX;
        var endY;

        // 开始动画
        var start = function(){
            self.CAF(obj['__scrollTimer__']);

            eTime = new Date().getTime();
            ratio = Math.max(0 , Math.min(1 , (eTime - sTime) / time));
            endX = curX + xAmount * ratio;
            endY = curY + yAmount * ratio;

            obj.scrollTo(endX , endY);

            if (ratio !== 1) {
                obj['__scrollTimer__'] = self.RAF(start);
            } else {
                obj['__scrollRunning__'] = 'n';

                if (G.getValType(fn) === 'Function') {
                    fn();
                }
            }
        };

        obj['__scrollRunning__'] = 'n';

        start();
    };

    /**
     * 获取 FormData 对象，可添加初始化键值对
     */
    SmallJs.getFormData = function(){
        var formData = new FormData();

        if (arguments.length === 2) {
            formData.append(arguments[0] , arguments[1]);
        }

        if (arguments.length === 1) {
            var data = arguments[0];

            for (var key in data)
            {
                formData.append(key , data[key]);
            }
        }

        return formData;
    };

    /**
     * 向一个 formData 对象添加键值对
     */
    SmallJs.appendFormData = function(){
        var formData = arguments[0];

        if (arguments.length === 3) {
            formData.append(arguments[1] , arguments[2]);
        }

        if (arguments.length === 2) {
            for (var key in arguments[1])
            {
                formData.append(key , arguments[1][key]);
            }
        }

        return formData;
    };

    /**
     * 获取容量
     * @param Number size 容量
     * @param String type 单位
     * @return String，最大支持显示 PB
     */
    SmallJs.getStorage = function(size , type){
        size = parseInt(size);
        type = type.toLowerCase();

        var typeRange = ['b' , 'byte' , 'kb' , 'mb' , 'gb' , 'tb' , 'pb'];

        if (!this.contain(type , typeRange)) {
            throw new Error('参数 2 错误');
        }

        // 进率
        var b  = 1;
        var kb = 1024;
        var mb = kb * 1024;
        var gb = mb * 1024;
        var tb = gb * 1024;
        var pb = tb * 1024;

        var explain = ['B' , 'KB' , 'MB' , 'GB' , 'TB' , 'PB'];

        // 获取值
        var get = function(val){
            var index 	= 0;
            var cur 	= null;

            while (index < explain.length)
            {
                cur = val / 1024;

                if (cur < 1 || index === explain.length - 1) {
                    return val.toFixed(2) + explain[index];
                }

                val = cur;

                index++;
            }

            return false;
        };

        switch (type)
        {
            case 'kb':
                size *= kb;
                break;
            case 'mb':
                size *= mb;
                break;
            case 'gb':
                size *= gb;
                break;
            case 'tb':
                size *= tb;
                break;
            case 'pb':
                size *= pb;
                break;
        }

        return get(size);
    };

    /**
     * 节点交换，要求：必须是同一个元素的子元素之间进行交换
     */
    SmallJs.domSwitch = function(a , b){
        // 只有一个元素
        if (this.getValType(a) === 'Undefined' || this.getValType(b) === 'Undefined') {
            return ;
        }

        var aN = a.nextElementSibling;
        var bN = b.nextElementSibling;

        // 相邻的兄弟元素
        if (aN === b || bN === a) {
            if (aN === b) {
                return b.parentNode.insertBefore(b , a);
            }

            if (bN === a) {
                return a.parentNode.insertBefore(a , b);
            }
        }

        // 其中一个元素没有兄弟元素
        if (this.getValType(aN) === 'Undefined' || this.getValType(bN) === 'Undefined') {
            if (this.getValType(aN) === 'Undefined') {
                a.parentNode.insertBefore(a , b);
                b.parentNode.appendChild(a);
            }

            if (this.getValType(bN) === 'Undefined') {
                b.parentNode.insertBefore(b , a);
                a.parentNode.appendChild(a);
            }

            return ;
        }

        // 都有兄弟元素
        a.parentNode.insertBefore(a , bN);
        b.parentNode.insertBefore(b , aN);
    };

    /**
     * 在某个元素的前面添加（移动）元素
     */
    SmallJs.insertBefore = function(newDOM , existsDOM){
        return existsDOM.parentNode.insertBefore(newDOM , existsDOM);
    };

    // 屏蔽浏览器右键功能
    SmallJs.contextmenu = function(){
        if (!this.isUndefined(window._disabledContextMenu__)) {
            return ;
        }

        window.oncontextmenu = function(){
            return false;
        };

        window._disabledContextMenu_ = true;
    };

    /**
     * 在某个元素的后面添加（移动）元素
     */
    SmallJs.insertAfter = function(newDOM , existsDOM){
        var nextS = existsDOM.nextElementSibling;

        if (this.getValType(nextS) === 'Null') {
            return existsDOM.parentNode.appendChild(newDOM);
        }

        return this.insertBefore(newDOM , nextS);
    };

    /**
     * 获取DOM元素集合
     */
    SmallJs.getDOMList = function(obj){
        var k 	= null;
        var cur = null;
        var list = [];

        for (k in obj)
        {
            cur = obj[k];

            if (this.isDOMEle(cur)) {
                list.push(cur);
            }
        }

        return list;
    };

    /*
     * 错误处理
     * @param error 错误对象
     */
    SmallJs.throw = function(error){
        throw new Error(
            "错误文件：" + error.fileName + "\r\n" +
            "错误行数：" + error.lineNumber + "\r\n" +
            "错误信息" + error.message
        );
    };

    /*
     * 阻止默认事件发生
     */
    SmallJs.preventDefault = function(event){
        event.preventDefault();
    };

    /*
     * 使表单失去焦点（防止表单重复提交）
     */
    SmallJs.formBlur = function(form){
        var inputList = G('input' , form);
        var i		  = 0;

        for (; i < inputList.length; ++i)
        {
            inputList.get()[i].blur();
        }
    };

    /*
     * 设计的时候必须用一个屏幕尺寸作为参考！
     * 例如我这边就用一下屏幕尺寸作为设计稿，进行设计。
     * 宽度为 640px 时，1rem = 100px
     * @param Int width
     * @param Int rem
     * @param Int px
     */
    SmallJs.setRootFontSize = function(width , rem , px){
        var root		= SmallJs(document.documentElement);
        var clientW     = root.get().clientWidth;

        root.css({
            fontSize: (100 / rem) * (clientW / width) + 'px'
        });
    };

    /*
     * 普通对象继承 （不支持元素）

     * 第一种模式
     * @param  isOverExistsKey   是否覆盖已有键名的键值
     * @param  isExtends         是否直接在原对象上进行更改
     * @param  isDeep            是否进行深层次递归拷贝
     * @param Object  args3      继承对象
     * @param Object  args4      被继承对象
     * @param Object  args5      被继承对象
     ....

     * 第二种模式
     * @param Object args1 继承对象
     * @param Object args2 被继承对象
     * @param Object args3 被继承对象
     ....
     * @return object
     */
    SmallJs.mergeObj = function(){
        var args		    = arguments;
        var isOverExistsKey = false;
        var isExtends		= false;
        var isDeep			= true;
        var list			= null;
        var typeRange		= ['Array' , 'Object'];
        var oneArgs         = args[0];
        var twoArgs         = args[1];
        var threeArgs       = args[2];
        var oneArgsDesc     = SmallJs.getValType(oneArgs);
        var twoArgsDesc     = SmallJs.getValType(twoArgs);
        var threeArgsDesc   = SmallJs.getValType(threeArgs);
        var copy;
        var oSIdx;
        var i;
        var n;
        var curDesc;
        var curCDesc;
        var cur;

        if (args.length === 0) {
            return false;
        }

        // 初始化参数
        if (oneArgsDesc === 'Boolean') {
            isOverExistsKey = oneArgs;

            if (twoArgsDesc === 'Boolean') {
                isExtends = twoArgs;

                if (threeArgsDesc === 'Boolean') {
                    isDeep = threeArgs;
                    oSIdx  = 3;
                } else {
                    oSIdx  = 2;
                }
            } else {
                oSIdx = 1;
            }
        } else {
            oSIdx = 0;
        }

        // 参数长度检测
        if (oSIdx === 0 && args.length === 1) {
            return oneArgs;
        }

        if (oSIdx === 1 && args.length < oSIdx + 1) {
            return false;
        }

        if (oSIdx === 2 && args.length < oSIdx + 1) {
            return false;
        }

        if (oSIdx === 3 && args.length < oSIdx + 1) {
            return false;
        }

        // 检查类型检测
        for ( i = oSIdx ; i < args.length; ++i)
        {
            if (!SmallJs.contain(SmallJs.getValType(args[i]) , typeRange)) {
                throw new TypeError('参数 ' + (i + 1) + ' 类型错误');
            }
        }

        // 参数类型是否一致检测
        for (i = oSIdx ; i < args.length; ++i)
        {
            curDesc = SmallJs.getValType(args[i]);

            for (n = i + 1; n < args.length; ++n)
            {
                curCDesc = SmallJs.getValType(args[n]);

                if (curDesc !== curCDesc) {
                    throw new TypeError('除特殊参数外，其他所有参数类型不一致');
                }
            }

            break;
        }

        /*
         * 数据拷贝
         * 拷贝 B 到 A 中
         */
        copy = function(A , B){
            var aDesc = SmallJs.getValType(A);
            var bDesc = SmallJs.getValType(B);
            var k;
            var i;
            var cur;
            var curDesc;
            var curC;
            var curCDesc;

            if (aDesc === 'Object') {
                for (k in B)
                {
                    cur       = B[k];
                    curDesc = SmallJs.getValType(cur);

                    if (SmallJs.getValType(A[k]) !== 'Undefined') {
                        // 是否覆盖原值
                        if (isOverExistsKey) {
                            if (SmallJs.contain(curDesc , typeRange)) {
                                A[k] = curDesc === 'Object' ? {} : [];

                                // 是否递归拷贝
                                if (isDeep) {
                                    copy(A[k] , cur);
                                } else {
                                    A[k] = cur;
                                }
                            } else {
                                A[k] = cur;
                            }
                        }
                    } else {
                        if (SmallJs.contain(curDesc , typeRange)) {
                            A[k] = curDesc === 'Object' ? {} : [];

                            // 是否递归拷贝
                            if (isDeep) {
                                copy(A[k] , cur);
                            } else {
                                A[k] = cur;
                            }
                        } else {
                            A[k] = cur;
                        }
                    }
                }
            }

            if (aDesc === 'Array') {
                for (i = 0; i < B.length; ++i)
                {
                    cur     = B[i];
                    curDesc = SmallJs.getValType(cur);

                    if (SmallJs.contain(curDesc , typeRange)) {
                        A[i] = curDesc === 'Object' ? {} : [];

                        // 是否递归拷贝
                        if (isDeep) {
                            copy(A[i] , cur);
                        } else {
                            A.push(cur);
                        }
                    } else {
                        A.push(cur);
                    }
                }
            }

        };

        for (i = oSIdx ; i < args.length; ++i)
        {
            if (list === null) {
                cur     = args[i];
                curDesc = SmallJs.getValType(cur);
                list    = isExtends ? args[i] : curDesc === 'Object' ? {} : [];
            } else {
                copy(list , args[i]);
            }
        }

        return isExtends ? undefined : list;
    };

    // 还原全局变量，避免冲突
    SmallJs.noConflict = function(){
        if (SmallJs.getValType(window['_' + defaultApiName]) !== 'Undefined') {
            window[defaultApiName] = window['_' + defaultApiName];
        }

        return true;
    };

    // 重命名对外暴露的 API 接口名称
    SmallJs.renameDefaultApiName = function(name){
        var name = SmallJs.getValType(name) !== 'String' ? defaultApiName : name;

        // this.noConflict();

        // 清除原来的命名
        window[defaultApiName] = undefined;

        // 定义新名称
        defaultApiName = name;

        // 设置新名称
        SmallJs._setApiName();
    };

    /*
     * 返回随机数组
     * @param  Interger len    长度
     * @param  String   type   类型
     * @return Array
     */
    SmallJs.randomArr = function(len , type){
        var typeRange = ['number' , 'letter' , 'mixed'];
        var type      = !SmallJs.contain(type , typeRange) ? 'number' : type;
        var rel		  = [];
        var min;
        var max;
        var letterList;
        var letterListLen;
        var i;
        var curNum;
        var curLetter;
        var tmpRel;
        var lMin;
        var lMax;
        var idx;

        letterList    = ['a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' , 'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z'];
        letterListLen = letterList.length;

        // 生成 A-z 5 个字母
        for (i = 0; i < letterListLen; ++i)
        {
            letterList.push(letterList[i].toUpperCase());
        }

        if (type === 'letter') {
            min = 0;
            max = letterList.length - 1;

            for (i = 1; i <= len; ++i)
            {
                idx = SmallJs.random(min , max);
                rel.push(letterList[idx]);
            }
        }

        if (type === 'number') {
            min = 0;
            max = len;
            for (i = 1; i <= len; ++i)
            {
                rel.push(SmallJs.random(min , max));
            }
        }

        if (type === 'mixed') {
            min		  = 0;
            max		  = len;
            lMin	  = 0;
            lMax	  = letterList.length - 1;

            for (i = 1; i <= len; ++i)
            {
                tmpRel    = [];
                idx		  = SmallJs.random(lMin , lMax);
                // 随机数字
                curNum    = SmallJs.random(min , max);
                // 随机字母
                curLetter = letterList[idx];
                // 随机字母 数字 或者数组
                tmpRel.push(curNum , curLetter);
                // 从随机数组中随机取一个（字母：50%，数字：50%概率）值
                rel.push(tmpRel[SmallJs.random(0 , 1)]);
            }
        }

        return rel;
    };

    /*
     * 根据生日计算得出年龄（周岁）
     * 时间格式：'YYYY-mm-dd HH:II:SS' or 'YYYY-mm-dd'
     * @param  String birthday 生日
     * @return 年龄 or 在生日时间大于当前时间的时候，返回 false
     */
    SmallJs.getAge = function(birthday){
        var timeJson    = G.parseTime(birthday , 'date');
        var curD		= new Date();
        var curYear		= curD.getFullYear();
        var curMonth	= curD.getMonth() + 1;
        var curDate		= curD.getDate();
        var yearDiff	= curYear  - timeJson['year'];
        var monthDiff	= curMonth - timeJson['month'];
        var dateDiff	= curDate  - timeJson['date'];

        // 出生日期 大于 当前日期的时候返回 false
        if (yearDiff < 0 || yearDiff === 0 && monthDiff < 0  || yearDiff === 0 && monthDiff === 0 && dateDiff < 0) {
            return false;
        }

        // 未到月份
        if (monthDiff < 0) {
            yearDiff -= 1;
        }

        // 已到月份，未到日期
        if (monthDiff === 0 && dateDiff < 0) {
            yearDiff -= 1;
        }

        return yearDiff;
    };

    /*
     * 返回某个范围内的随机数字
     * @param  Interger min       最小值
     * @param  Interger max       最大值
     * @param  Boolean  isInt     是否返回整数
     * @param  Interger fixedNum  isInt = false 时（返回浮点数，即带小数的数），保留多少位小数点，默认保留：3位小数
     * @return Mixed
     */
    SmallJs.random = function(min , max , isInt , fixedNum){
        var isInt	 = SmallJs.getValType(isInt)    !== 'Boolean' ? true : isInt;
        var fixedNum = SmallJs.getValType(fixedNum) !== 'Number'  ? 3    : fixedNum;
        var range	 = max - min;
        var rel		 = Math.max(min , Math.min(max , range * Math.random()));

        if (isInt) {
            // 四舍五入
            return Math.round(rel);
        }

        return parseFloat(rel).toFixed(fixedNum);
    };

    /*
     * 返回单选按钮选中的值
     * @param  NodeList|HTMLCollection list
     * @return 成功时返回单选值；失败时返回 false
     */
    SmallJs.getRadioVal = function(list){
        var i = 0;

        for (; i < list.length; ++i)
        {
            if (list[i].checked) {
                return list[i].value;
            }
        }

        return false;
    };

    /*
     * 判断一个值是否是一个元素
     * @param  Mixed val
     * @return Boolean
     */
    SmallJs.isDOMEle = function(val){
        if (!SmallJs.isObj(val)) {
            return false;
        }

        if (!SmallJs.isValidVal(val)) {
            return false;
        }

        if (SmallJs.getValType(val.nodeType) === 'Undefined') {
            return false;
        }

        if (val.nodeType !== 1) {
            return false;
        }

        return true;
    };

    /*
     * 判断一个值是否时元素集合
     * @param  Mixed val
     * @return Boolean
     */
    SmallJs.isDOMList = function(val){
        var type;
        var i;

        if (!SmallJs.isObj(val)) {
            return false;
        }

        type = SmallJs.getValType(val);

        if (type === 'HTMLCollection') {
            return true;
        }

        if (type === 'NodeList') {
            return true;
        }

        if (type === 'Array') {
            for (i = 0; i < val.length; ++i)
            {
                if (!SmallJs.isDOMEle(val[i])) {
                    return false;
                }
            }

            return true;
        }

        return false;
    };

    /*
     * 判断是否为对象
     * @param  Mixed val
     * @return Boolean
     */
    SmallJs.isObj = function(val){
        if (typeof val === 'object') {
            return true;
        }

        return false;
    };

    /**
     * 检查是否是函数
     */
    SmallJs.isFunction = function(data){
        return this.getValType(data) === 'Function';
    };

    /**
     * 检查是否是字符串
     */
    SmallJs.isString = function(data){
        return this.getValType(data) === 'String';
    };

    /**
     * 检查是否是数字
     */
    SmallJs.isNumber = function(data){
        return this.getValType(data) === 'Number';
    };

    /**
     * 检查是否是布尔值
     */
    SmallJs.isBoolean = function(data){
        return this.getValType(data) === 'Boolean';
    };

    /**
     * 检查是否是 Null
     */
    SmallJs.isNull = function(data){
        return this.getValType(data) === 'Null';
    };

    /**
     * 检查是否是 Undefined
     */
    SmallJs.isUndefined = function(data){
        return this.getValType(data) === 'Undefined';
    };

    /**
     * 检查是否是 数组
     */
    SmallJs.isArray = function(data){
        return this.getValType(data) === 'Array';
    };

    /**
     * 检查是否是 对象
     * isObj 的别名
     */
    SmallJs.isObject = SmallJs.isObj;

    /*
     * 正确获取值的类型
     * @param Mixed val 待判断的值
     * @return string number Boolean null undefined regexp date function array object
     */
    SmallJs.getValType = function(val){
        var sIdx = new String('[object ').length;
        var eIdx = -1;

        return Object.prototype.toString.call(val).slice(sIdx , eIdx);
    };

    /*
     * 判断一个值是否是有效值
     */
    SmallJs.isValidVal = function(val){
        if (val === '') {
            return false;
        }

        if (SmallJs.getValType(val) === 'Undefined') {
            return false;
        }

        if (val === null) {
            return false;
        }

        return true;
    };

    /*
     * 数组 | 对象 判断是否存在值！
     * @param  Mixed           unit
     * @param  Object | Array  obj
     * @param  Boolean         isDeep
     * @return Boolean         true | false
     */
    SmallJs.contain = function(unit , obj , isDeep){
        var typeRange	= ['Array' , 'Object'];
        var isExists	= false;
        var isDeep		= SmallJs.getValType(isDeep) !== 'Boolean' ? false : isDeep;
        var type		= SmallJs.getValType(obj);
        var isSupport   = false;
        var check;
        var checkRange;
        var i;
        var k;

        // 参数 2 类型检测
        checkRange = function(type){
            for (i = 0; i < typeRange.length; ++i)
            {
                if (type === typeRange[i]) {
                    return true;
                }
            }

            return false;
        };

        if (!checkRange(type)) {
            throw new TypeError('参数 2 类型错误');
        }

        var i = 0;

        // 检索函数：顺序检索
        check = function(obj){
            for (k in obj)
            {
                if (unit === obj[k]) {
                    isExists = true;
                    break;
                }

                type = SmallJs.getValType(obj[k]);

                if (isDeep && checkRange(type)) {
                    check(obj[k]);
                }
            }
        };

        check(obj);

        return isExists;
    };

    /*
     * 获取文档的宽高信息
     */
    SmallJs.getDocInfo = function(type){
        var typeRange = ['clientWidth' , 'clientHeight' , 'all'];
        var type = SmallJs.contain(type , typeRange) ? type : 'all';
        var sW = document.documentElement.clientWidth;
        var sH = document.documentElement.clientHeight;

        var info = {
            'clientWidth': sW ,
            'clientHeight': sH
        };

        if (type === 'all') {
            return info;
        }

        return info[type];
    };

    /*
     * 将对象 转换为 json 字符串 json_encode 的增强版
     * @param Object | Array  obj
     * @return String
     * 支持中文的转译
     */
    SmallJs.jsonEncode = function(obj){
        return JSON.stringify(obj);
    };

    /*
     * 解码 json 字符串
     * @param String jsonStr
     * @return Object
     */
    SmallJs.jsonDecode = function(jsonStr){
        return JSON.parse(jsonStr);
    };

    /*
     * 过滤 非单词字符边界处 空格 \r \n \r\n
     * @param String str 将要过滤的字符串
     */
    SmallJs.trimAll = function(str){
        str = str.replace(/^( |\r|\n)+/g , '');
        str = str.replace(/( |\r|\n)+$/g , '');
        str = str.replace(/(\W)( |\r|\n)+/g , '$1');
        str = str.replace(/( |\r|\n)+(\W)/g , '$2');
        return str;
    };

    /*
     * 过滤 左右两边 空格 \r \n \r\n
     * @param String str 将要过滤的字符串
     */
    SmallJs.trim = function(str){
        str = str.replace(/^( |\r|\n)+/g , '');
        str = str.replace(/( |\r|\n)+$/g , '');
        return str;
    };

    /*
     * 过滤 左边开头的 空格 \r \n \r\n
     * @param String str 将要过滤的字符串
     */
    SmallJs.lTrim = function(str){
        return str.replace(/^( |\r|\n)+/g , '');
    };

    /*
     * 过滤 右边开头的 空格 \r \n \r\n
     * @param String str 将要过滤的字符串
     */
    SmallJs.rTrim = function(str){
        return str.replace(/( |\r|\n)+$/g , '');
    };

    /*
     * 过滤： 对象|数组 中 重复 无效 的单元
     * 不支持 DOM 元素的过滤
     * 过滤无效值 null undefined ''
     * @param Object|Array						    obj 对象|数组
     * @param Boolean isRemoveRepeatUnit			是否移除重复的单元
     * @param Boolean isDeep					    是否执行递归过滤
     * @return Object|Array
     */
    SmallJs.filterObj = function(obj , isRemoveRepeatUnit , isDeep){
        var typeRange = ['Array' , 'Object'];
        var type      = null;
        var objCopy   = null;
        var remove    = null;

        if (SmallJs.getValType(isRemoveRepeatUnit) !== 'Boolean') {
            isRemoveRepeatUnit = true;
        }

        if (SmallJs.getValType(isDeep) !== 'Boolean') {
            isDeep = true;
        }

        objCopy = SmallJs.copyObj(obj);
        remove = function(objCopy){
            var removeKey = [];
            var tempObj = {};

            type = SmallJs.getValType(objCopy);

            if (!SmallJs.contain(type , typeRange)) {
                throw new TypeError('type 参数错误');
            }

            if (type === 'Array') {

                // 过滤无效值
                for (var i = 0; i < objCopy.length; ++i)
                {
                    type = SmallJs.getValType(objCopy[i]);

                    if (SmallJs.contain(type , typeRange)) {
                        continue;
                    }

                    if (!SmallJs.isValidVal(objCopy[i])) {
                        objCopy.splice(i , 1);
                        i--;
                    }
                }

                // 删除重复值
                if (isRemoveRepeatUnit) {
                    for (var i = 0; i < objCopy.length; ++i)
                    {
                        for (var n = i + 1; n < objCopy.length; ++n)
                        {
                            if (objCopy[i] === objCopy[n]) {
                                objCopy.splice(n , 1);
                                i--;
                            }
                        }
                    }
                }

                // 是否递归过滤
                if (isDeep) {
                    for (var i = 0; i < objCopy.length; ++i)
                    {
                        type = SmallJs.getValType(objCopy[i]);

                        if (SmallJs.contain(type , typeRange)) {
                            remove(objCopy[i]);
                        }
                    }
                }
            } else {
                // 过滤无效值
                for (var key in objCopy)
                {
                    type = SmallJs.getValType(objCopy[key]);

                    if (SmallJs.contain(type , typeRange)) {
                        continue;
                    }

                    if (!SmallJs.isValidVal(objCopy[key])) {
                        delete objCopy[key];
                    }
                }

                // 删除重复值
                if (isRemoveRepeatUnit) {
                    for (var key in objCopy)
                    {
                        if (!SmallJs.contain(objCopy[key] , tempObj)) {
                            tempObj[key] = objCopy[key];
                        }
                    }
                    objCopy = tempObj;
                }

                // 是否递归过滤
                if (isDeep) {
                    for (var key in objCopy)
                    {
                        type = SmallJs.getValType(objCopy[key]);

                        if (SmallJs.contain(type , typeRange)) {
                            remove(objCopy[key]);
                        }
                    }
                }
            }
        };

        remove(objCopy);

        return objCopy;
    };


    /*
     * 递归 对象|数组 拷贝
     * @param Object obj 数组 | 对象
     * @return Object
     */
    SmallJs.copyObj = function(obj , isDeep){
        var typeRange = ['Array' , 'Object'];
        var rel		  = SmallJs.getValType(obj)    === 'Object'  ? {}     : [];
        var isDeep    = SmallJs.getValType(isDeep) === 'Boolean' ? isDeep : true;
        var copy;

        // 核心函数
        copy = function(A , B){
            var aDesc = SmallJs.getValType(A);
            var bDesc = SmallJs.getValType(B);
            var cur;
            var curDesc;
            var k;

            if (!SmallJs.contain(aDesc , typeRange)) {
                throw new TypeError('参数 1 类型错误');
            }

            if (!SmallJs.contain(bDesc , typeRange)) {
                throw new TypeError('参数 2 类型错误');
            }

            if (aDesc !== bDesc) {
                throw new TypeError('所有参数类型不一致');
            }

            for (k in B)
            {
                cur = B[k];
                curDesc = SmallJs.getValType(cur);

                if (isDeep && SmallJs.contain(curDesc , typeRange)) {
                    A[k] = curDesc === 'Object' ? {} : [];
                    copy(A[k] , cur);
                } else {
                    A[k] = cur;
                }
            }
        };

        copy(rel , obj);

        return rel;
    };

    /*
     * 将一个类数组对象转换为数组
     * @param  Object  obj
     * @param  Number  start
     * @param  Number  end
     * @return Array
     */
    SmallJs.toArray = function(obj , saveAll){
        saveAll = this.isBoolean(saveAll) ? saveAll : true;

        var arr = [];

        if (saveAll) {
            for (var key in obj)
            {
                arr.push(obj[key]);
            }
        } else {
            var i = 0;

            for (; i < obj.length; ++i)
            {
                arr.push(obj[i]);
            }
        }

        return arr;
    };

    // 一维数组：希尔排序（高级排序算法）
    SmallJs.shellSort = function(arr , sortType){
        var sortTypeRange = ['asc' , 'desc'];
        var sortType      = !SmallJs.contain(sortType , sortTypeRange) ? 'asc' : sortType;
        // 交换的中间值
        var tempVal		  = null;
        // 数组长度
        var arrLen		  = arr.length;
        // 基准值
        var divisor		  = 3;
        // 间隔
        var interval	  = 1;
        var i;
        var n;

        if (SmallJs.getValType(arr) !== 'Array') {
            throw new TypeError('参数 1 类型错误');
        }

        // 计算动态间隔序列
        while (interval < arrLen / divisor)
        {
            interval = interval * divisor + 1;
        }

        // 排序
        while (interval >= 1)
        {
            for (i = interval; i < arrLen; ++i)
            {
                for (n = i - interval; n >= 0; n -= interval)
                {
                    if (sortType === 'asc' ? arr[n + interval] < arr[n] : arr[n + interval] > arr[n]) {
                        tempVal    = arr[n];
                        arr[n]     = arr[n + interval];
                        arr[n + interval] = tempVal;
                    } else {
                        break;
                    }
                }
            }

            // 反向工程
            interval = (interval - 1) / divisor;
        }

        return arr;
    };

    /*
     * 一维数组：冒泡排序（基本排序算法）
     * 原理：每一次循环都会将最值移动到端电上
     * @param  Array   arr
     * @param  String  sortType
     * @return Array
     */
    SmallJs.bubbleSort = function(arr , sortType){
        var sortTypeRange = ['asc' , 'desc'];
        var sortType	  = !SmallJs.contain(sortType , sortTypeRange) ? 'asc' : sortType;
        // 作为中间值，进行交换
        var cur  = null;
        // 比较值的索引
        var compareIdx = null;
        var i;
        var n;

        if (SmallJs.getValType(arr) !== 'Array') {
            throw new TypeError('参数 1 类型错误');
        }

        for (i = 0; i < arr.length; ++i)
        {
            for (n = 0; n < arr.length - i; ++n)
            {
                compareIdx = n + 1;

                // 确保不会和无效值进行交换
                if (compareIdx >= arr.length - i) {
                    break;
                }

                if (sortType === 'asc' ? arr[n] > arr[compareIdx] : arr[n] < arr[compareIdx]) {
                    cur    = arr[n];
                    arr[n] = arr[compareIdx];
                    arr[compareIdx]   = cur;
                }
            }
        }

        return arr;
    };

    /*
     * 一维数组：选择排序（基本排序算法）
     * 原理：每一次循环都会将最值移动到端电上
     * @param  Array   arr
     * @param  String  sortType
     * @return Array
     */
    SmallJs.selectionSort = function(arr , sortType){
        var sortTypeRange = ['asc' , 'desc'];
        var sortType	  = !SmallJs.contain(sortType , sortTypeRange) ? 'asc' : sortType;
        // 作为中间值，进行交换
        var cur;
        var idx;
        var i;
        var n;

        if (SmallJs.getValType(arr) !== 'Array') {
            throw new TypeError('参数 1 类型错误');
        }


        for (i = 0; i < arr.length; ++i)
        {
            idx = i;

            for (n = i + 1; n < arr.length; ++n)
            {
                if (sortType === 'asc' ? arr[idx] > arr[n] : arr[idx] < arr[n]) {
                    idx = n;
                }
            }

            if (i !== idx) {
                cur       = arr[i];
                arr[i]    = arr[idx];
                arr[idx]  = cur;
            }
        }

        return arr;
    };

    // 判断奇数 偶数
    SmallJs.oddEven = function(num){
        var num = parseInt(num);
        var b = 2;
        if (num % b !== 0) {
            return 'odd';
        } else {
            return 'even';
        }
    };

    /*
     * 查询字符串解析
     * @return Ojbect 解析后的 key => val 键值对 对象
     */
    SmallJs.queryString = function(){
        var str    = decodeURIComponent(window.location.search);
        var result = '';
        var obj    = {};
        var assoc  = null;

        if (str === '') {
            return false;
        }

        str = SmallJs.trim(str.substring(1));

        result = str.split('&');

        for (var i = 0; i < result.length; ++i)
        {
            assoc = result[i].split('=');

            if (assoc.length !== 2) {
                continue;
            }

            obj[assoc[0]] = assoc[1];
        }

        return obj;
    };

    // 获取文件名
    SmallJs.getFilename = function(filePath){
        var filePath  = filePath.replace('\\' , '/');
        var sIdx      = filePath.lastIndexOf('/') + 1;
        var eIdx		= filePath.lastIndexOf('.');

        return filePath.substring(sIdx === -1 ? 0 : sIdx , eIdx);
    };

    // 获取文件后缀名（文件类型）
    SmallJs.getFileSuffix = function(filePath){
        return filePath.substring(filePath.lastIndexOf('.') + 1);
    };


    /**
     * 判断浏览器
     * @return mobile | firefox | edge | ie8 ie9 ie10 ie_lower | chrome | opera
     */
    SmallJs.getBrowser = function(){
        var b = window.navigator.userAgent.toLowerCase();

        if (b.search('mobile') !== -1) {
            return 'mobile';
        }

        if (b.search('firefox') !== -1) {
            return 'firefox';
        }

        if (b.search('trident') !== -1) {
            var pattern = /msie \d{1,2}\.0/i;
            var result = b.match(pattern);

            if (result === null) {
                return 'edge';
            }

            result = result[0].toLowerCase();

            switch(result)
            {
                case 'msie 7.0':
                    return 'ie_lower';
                case 'msie 8.0':
                    return 'ie8';
                case 'msie 9.0':
                    return 'ie9';
                case 'msie 10.0':
                    return 'ie10';
            }
        }

        if (b.search('opr') !== -1) {
            return 'opera';
        }

        return 'chrome';
    };

    /*
     * 检索样式表中是否存在某规则
     * @param String searchClassName
     * @return Boolean
     */
    SmallJs.scn = function(searchClassName){
        var sList	  = document.styleSheets;
        var cssRules = null;
        var selector = '';

        for (var i = 0; i < sList.length; ++i)
        {
            cssRules = sList[i].cssRules;

            for (var n = 0; n < cssRules.length; ++n)
            {
                selector = cssRules[n].selectorText;

                if (selector === searchClassName) {
                    return true;
                }
            }
        }

        return false;
    };

    /*
     * 倒计时函数
     * @param Number   time 	倒计时时长 单位：s
     * @param Number   step 	步进
     * @param Number   stepFn 	每次步进回调
     * @param function fn   	完成时回调
     * @return json
     */
    SmallJs.timeCount = function(time , step , stepFn , fn){
        var time = SmallJs.getValType(time) !== 'Number'   ? 5    : time;
        var step = SmallJs.getValType(step) !== 'Number'   ? 1    : step;
        var self = this;

        if (time >= 0){
            if (SmallJs.getValType(stepFn) === 'Function') {
                stepFn(time , self.timeCountTimer);
            }

            time -= step;

            self.timeCountTimer = window.setTimeout(function(){
                self.timeCount(time , step , stepFn , fn);
            } , 1000);
        } else {
            if (SmallJs.getValType(fn) === 'Function') {
                fn(self.timeCountTimer);
            }
        }
    };


    /*
     * 获取二进制文件的 间接 url
     * @param BlobFile   file |  二进制文件
     * @param Function   fn    处理生成的 blob url 的回调函数
     * @return undefined
     */
    SmallJs.getBlobUrl = function(file , fn){
        var URL		    = null;
        var fileReader  = null;
        var errMsg		= '';
        // try {
        URL = window.URL || window.webkitURL;

        if (SmallJs.getValType(URL) === 'Undefined') {

            fileReader = new FileReader();
            fileReader.readAsDataURL(file);	//  FileReader 支持的： readAsText | readAsArrayBuffer | readAsDataURL | readAsBinaryString

            SmallJs(fileReader).loginEvent('load' , function(){
                if (SmallJs.getValType(fn) === 'Function') {
                    fn(this.result);
                }
            } , false , false);

            return ;
        }

        if (SmallJs.getValType(fn) === 'Function') {
            fn(URL.createObjectURL(file));
        }
        /*
         } catch (err) {
         errMsg += '发生错误：' + err.message + "\n";
         errMsg += '提示： 处理blob 对象的 URL 或 FileReader 对象 需要 IE10+ 浏览器支持！';
         errMsg += '具体错误信息： ' + err;

         throw new Error(errMsg);
         }
         */
    };

    /*
     * 销毁一个由 URL.createObjectURL 创建的 blob://URL
     */
    SmallJs.revokeBlobUrl = function(blobUrl){
        var URL = window.URL || window.webkitURL || false;

        if (!URL) {
            throw new Error('浏览器不支持URL对象！请升级浏览器至IE10+');
        }

        URL.revokeObjectURL(blobUrl);
    };

    /*
     * 将一个 base64编码后的字符串 转为二进制对象！
     */
    SmallJs.base64ToBlob = function(base64String){
        var reg  = /^data:(.+);base64,(.)+$/;
        var mime = '';
        var blob = null;
        var arr  = null;
        var b    = null;

        if (!reg.test(base64String)) {
            throw new TypeError('不是 base64 编码后的字符串！');
        }

        mime = base64String.match(/data:(.+);/)[1];
        blob = window.atob(base64String.split(',')[1]);
        arr = [];
        arr.push(blob);
        b = new Blob(arr , {type:mime});
        return b;
    };

    /*
     * rem布局时，设置 html 元素字体大小的函数
     */
    SmallJs.setRootEleFontSize = function(minSW , maxSW , minFS , maxFS){
        var minSW = G.getValType(minSW) !== 'Number' ? 220  : minSW;
        var maxSW = G.getValType(maxSW) !== 'Number' ? 640  : maxSW;
        var minFS = G.getValType(minFS) !== 'Number' ? 0.01 : minFS;
        var maxFS = G.getValType(maxFS) !== 'Number' ? 100  : maxFS;
        var html  = G(document.documentElement);
        var curSW = document.body.scrollWidth;
        var unit  = (maxFS - minFS) / (maxSW - minSW);
        var rootFS;

        curSW  = curSW >= maxSW ? maxSW : curSW;
        curSW  = curSW <= minSW ? minSW : curSW;

        console.log(curSW , minSW , unit);
        rootFS = minFS + (curSW - minSW) * unit;
        rootFS = Math.max(minFS , Math.min(maxFS , rootFS));

        html.css({
            fontSize: rootFS + 'px'
        });
    };

    // 动画定时器
    SmallJs.RAF = function(fn){
        var freq = 1000 / 60;
        var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || false;

        if (requestAnimationFrame) {
            return requestAnimationFrame(fn);
        }

        return window.setTimeout(fn , freq);
    };

    // 清除动画定时器
    SmallJs.CAF = function(timerId){
        var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || false;

        if (cancelAnimationFrame) {
            return cancelAnimationFrame(timerId);
        }

        window.clearTimeout(timerId);
    };

    // 角度转换为弧度
    SmallJs.getRad = function(deg){
        return deg * Math.PI / 180;
    };

    // 弧度转换为角度
    SmallJs.getDeg = function(rad){
        return rad * 180 / Math.PI;
    };

    /*
     * 获取图片的真实尺寸
     * @param String    url 图片的 URL
     * @param Function  fn  回调函数
     * @return Array
     */
    SmallJs.getImageInfo = function(url , fn){
        var img = new Image();

        SmallJs(img).loginEvent('load' , function(){
            var info = {
                url:    img.src ,
                width:  img.width ,
                height: img.height
            };

            if (SmallJs.getValType(fn) === 'Function') {
                fn(info);
            } else {
                console.log('图片信息：' , info);
            }

        } , false , false);

        img.src = url;
    };

    /*
     * 随机获取颜色
     */
    SmallJs.generateRandomColor = function(opt){
        if (SmallJs.getValType(opt) === 'Undefined') {
            var opt = {
                minR: 0 ,
                maxR: 255 ,
                minG: 0 ,
                maxG: 255 ,
                minB: 0 ,
                maxB: 255 ,
                minA: 0 ,
                maxA: 1000 ,
                endA: undefined ,
                alpha: undefined ,
                len: 1000
            };
        }

        var R = null;
        var G = null;
        var B = null;
        var A = null;
        var alphaRatio = null;
        var colorList = null;

        opt['minR']	= SmallJs.getValType(opt['minR']) === 'Undefined'  || SmallJs.getValType(opt['minR']) !== 'Number'  || (opt['minR'] < 0  || opt['minR'] > 255) ? 0			: opt['minR'];
        opt['maxR']	= SmallJs.getValType(opt['maxR']) === 'Undefined'  || SmallJs.getValType(opt['maxR']) !== 'Number'  || (opt['maxR'] < 0  || opt['maxR'] > 255) ? 255		    : opt['maxR'];

        if (opt['minR'] > opt['maxR']) {
            throw new RangeError('R通道数据错乱！');
        }

        opt['minG']	= SmallJs.getValType(opt['minG']) === 'Undefined'  || SmallJs.getValType(opt['minG']) !== 'Number'  || (opt['minG'] < 0  || opt['minG'] > 255) ? 0			: opt['minG'];
        opt['maxG']	= SmallJs.getValType(opt['maxG']) === 'Undefined'  || SmallJs.getValType(opt['maxG']) !== 'Number'  || (opt['maxG'] < 0  || opt['maxG'] > 255) ? 255			: opt['maxG'];

        if (opt['minG'] > opt['maxG']) {
            throw new RangeError('G通道数据错乱！');
        }

        opt['minB']	= SmallJs.getValType(opt['minB']) === 'Undefined'  || SmallJs.getValType(opt['minB']) !== 'Number'  || (opt['minB'] < 0  || opt['minB'] > 255) ? 0			: opt['minB'];
        opt['maxB']	= SmallJs.getValType(opt['maxB']) === 'Undefined'  || SmallJs.getValType(opt['maxB']) !== 'Number'  || (opt['maxB'] < 0  || opt['maxB'] > 255) ? 255			: opt['maxB'];

        if (opt['minB'] > opt['maxB']) {
            throw new RangeError('B通道数据错乱！');
        }

        opt['minA']	= SmallJs.getValType(opt['minA']) === 'Undefined'  || SmallJs.getValType(opt['minA']) !== 'Number'  || (opt['minA'] < 0  || opt['minA'] > 1000) ? 0			: opt['minA'];
        opt['maxA']	= SmallJs.getValType(opt['maxA']) === 'Undefined'  || SmallJs.getValType(opt['maxA']) !== 'Number'  || (opt['maxA'] < 0  || opt['maxA'] > 1000) ? 1000		: opt['maxA'];

        if (opt['minA'] > opt['maxA']) {
            throw new RangeError('A通道数据错乱！');
        }

        opt['alpha'] = SmallJs.getValType(opt['alpha']) === 'Undefined' || SmallJs.getValType(opt['alpha']) !== 'Number' || (opt['alpha'] < 0 || opt['alpha'] > 1)    ? undefined	: opt['alpha'];
        opt['len']   = SmallJs.getValType(opt['len']) === 'Undefined'   || SmallJs.getValType(opt['len']) !== 'Number'   || (opt['len'] < 0   || opt['len'] > 600000) ? 1000		: opt['len'];
        alphaRatio = 1000;
        colorList = [];

        for (var i = 0; i < opt['len']; ++i)
        {
            R = random(opt['minR'] , opt['maxR']);
            G = random(opt['minG'] , opt['maxG']);
            B = random(opt['minB'] , opt['maxB']);
            A = SmallJs.getValType(opt['alpha']) === 'Undefined' ? random(opt['minA'] , opt['maxA']) / alphaRatio : opt['alpha'];

            colorList.push('RGBA(' + R + ' , ' + G + ' , ' + B + ' , ' + A + ')');
        }

        return colorList;
    };


    /*
     * 以指定长度将数组分割成更小的数组的集合
     * @param Array      arr        待分割的数组
     * @param Number     chunkLen   每隔多少个单元分一组
     * @param Array
     */
    SmallJs.arrChunk = function(arr , chunkLen){
        if (!(arr instanceof Array)) {
            throw new TypeError('arr 不是数组类型！');
        }

        if (SmallJs.getValType(chunkLen) !== 'Number') {
            throw new TypeError('chunkLen 不是数字');
        }

        var rel = [];
        var curRel = [];

        for (var i = 0; i < arr.length; ++i)
        {
            if ((i + 1) % chunkLen !== 0) {
                curRel.push(arr[i]);
            } else {
                curRel.push(arr[i]);
                rel.push(curRel);
                curRel = [];
            }
        }

        return rel;
    };

    /*
     * 将类型化数组 转换为 普通数组
     * @param   ArrayBuffer arr  带转换的类型化数组
     * @return  Array
     */
    SmallJs.abToa = function(ab){
        return Array.apply([] , ay);
    };

    /*
     * 设置 cookie

     * 第一种模式：
     * 一个参数 且 类型为 array： [{name: 'username' , value: '364793' , expires: '2016/10/26 02:10:00' , path: '/' , domain: '*'}]
     * @param array args1

     * 第二种模式：
     * @param string args1
     * @param string args2
     ....
     * @return undefined

     * 第一种模式使用范例：
     * setCookie([
     * {name:'name',value:'chenxuelong',expires:30*60},
     * {name:'sex',value:'male',expires:30*60},
     * {name:'height',value:'167',expires:30*60}
     * .....
     * ]);

     * 第二种模式使用范例：
     * setCookie(name , value , expires , path , domain);

     */
    SmallJs.setCookie = function(){
        var args	= arguments;
        var key		= '';							// cookie 键名
        var val		= '';							// cookie 键值
        var time    = 0;							// cookie 保存时间，单位：s
        var expires = 0;                            // 过期时间
        var path	= '';							// cookie 是否分层
        var domain  = '';							// 允许访问的域名
        var secure  = false;                        // 是否通过 https 协议来传输 cookie
        var nt		= new Date().getTime();			// 当前时间
        var cookie  = null;							// cookie 字符串
        var tmpCookie = null;
        // 默认值
        var defaultOpt = {
            name: '' ,
            value: '' ,
            duration: 30 * 60 * 1000 ,	// 默认保存 30 分钟
            path: '/' ,
            domain: '' ,
            secure: 'false'
        };

        if (args.length === 1) {
            args = args[0];

            if (SmallJs.getValType(args) === 'Array') {
                for (var i = 0; i < args.length; ++i)
                {
                    cookie = '';
                    tmpCookie = {};
                    key     = SmallJs.getValType(args[i]['name'])     !== 'String'  ? defaultOpt['name']	 : args[i]['name'];
                    val	    = SmallJs.getValType(args[i]['value'])    !== 'String'  ? defaultOpt['value']	 : args[i]['value'];
                    time    = SmallJs.getValType(args[i]['duration']) !== 'Number'  ? defaultOpt['duration'] : args[i]['duration'] * 1000;
                    expires = new Date(nt + time).toUTCString();
                    path    = SmallJs.getValType(args[i]['path'])	 !== 'String'   ? defaultOpt['path']		 : args[i]['path'];
                    domain  = SmallJs.getValType(args[i]['domain'])   !== 'String'  ? defaultOpt['domain']	 : args[i]['domain'];
                    secure  = SmallJs.getValType(args[i]['secure'])   !== 'Boolean' ? defaultOpt['secure']	 : args[i]['secure'] ? 'true' : 'false';

                    if (window.navigator.cookieEnabled) {
                        // 创建新数据
                        document.cookie = key + '=' + val + ';expires=' + expires + ';path=' + path + ';domain=' + domain + ';secure=' + secure;
                    } else {
                        if (SmallJs.getValType(window.localStorage) !== 'Undefined') {
                            tmpCookie['key']		= key;
                            tmpCookie['value']		= value;
                            tmpCookie['ctime']		= nt;
                            tmpCookie['duration']	= time;

                            window.localStorage.setItem(key , SmallJs.jsonEncode(tmpCookie));
                        }
                    }
                }
            }
        } else {
            cookie = '';
            tmpCookie = {};
            key     = SmallJs.getValType(args[0])    !== 'String'  ? defaultOpt['name']		 : args[0];
            val	    = SmallJs.getValType(args[1])    !== 'String'  ? defaultOpt['value']	 : args[1];
            time    = SmallJs.getValType(args[2])    !== 'Number'  ? defaultOpt['duration']  : args[2] * 1000;
            expires = new Date(nt + time).toUTCString();
            path    = SmallJs.getValType(args[3])	 !== 'String'  ? defaultOpt['path']		 : args[3];
            domain  = SmallJs.getValType(args[4])    !== 'String'  ? defaultOpt['domain']	 : args[4];
            secure  = SmallJs.getValType(args[5])    !== 'Boolean' ? defaultOpt['secure']	 : args[5] ? 'true' : 'false';

            if (window.navigator.cookieEnabled) {
                // 创建新数据
                document.cookie = key + '=' + val + ';expires=' + expires + ';path=' + path; + ';domain=' + domain; // + ';secure=' + secure;
            } else {
                if (SmallJs.getValType(window.localStorage) !== 'Undefined') {
                    tmpCookie['key']		= key;
                    tmpCookie['value']		= value;
                    tmpCookie['cTime']		= nt;
                    tmpCookie['duration']	= time;

                    window.localStorage.setItem(key , SmallJs.jsonEncode(tmpCookie));
                }
            }
        }
    };


    /*
     * 获取cookie
     * @param string key
     * @return cookie || false
     */
    SmallJs.getCookie = function(key){
        if (window.navigator.cookieEnabled) {
            var cookie = SmallJs.trimAll(document.cookie).split(';');
            var unit   = null;
            for (var i = 0; i < cookie.length; ++i)
            {
                unit = cookie[i].split('=');
                if (unit.length === 2 && unit[0] === key) {
                    return unit[1];
                }
            }
        } else {
            if (SmallJs.getValType(window.localStorage) !== 'Undefined') {
                var nt = new Date().getTime();
                cookie = window.localStorage.getItem(key);

                if (cookie !== null) {
                    cookie = SmallJs.jsonDecode(cookie);

                    if (nt - parseInt(cookie['cTime']) > parseInt(cookie['duration'])) {
                        window.localStorage.removeItem(key);
                    } else {
                        return cookie['value'];
                    }
                }
            }
        }

        return false;
    };

    /*
     * SmallJs 自有属性速查表
     */
    SmallJs.guide = function(){
        var methodList = {};
        var keys       = Object.getOwnPropertyNames(SmallJs);

        for (var i = 0; i < keys.length; ++i)
        {
            methodList[keys[i]] = SmallJs[keys[i]];
        }

        return methodList;
    };

    /*
     * 根据给定的时间长度转化为预定义格式的时间
     * @param Number  duration		时长，单位是 s
     * @param String  format		返回的时间格式
     * @param Boolean isZeroAdd		分以上值为 0 是否需要严格按照格式进行返回，是 值为0的也会自动填充，否则不会
     * @param Boolean isReturnJson	是否返回 Json 数据
     * @return Mixed
     */
    SmallJs.formatTime = function(duration , format , isZeroAdd , isReturnJson){
        var formatRange = ['D天H时I分S秒' , 'HH:II:SS' , 'HH时II分SS秒'];
        var format		= !SmallJs.contain(format , formatRange) ? 'D天H时I分S秒' : format;
        var isZeroAdd	= SmallJs.getValType(isZeroAdd) !== 'Boolean' ? true : isZeroAdd;
        var isReturnJson = SmallJs.getValType(isReturnJson) !== 'Boolean' ? false : isReturnJson;

        var sRatio      = 1;
        var iRatio		= 60;
        var hRatio		= 60 * 60;
        var dRatio		= 24 * 60 * 60;
        var d			= null;
        var h			= null;
        var i			= null;
        var s			= null;

        // 获取换算后时间
        var getTime		= function(time , ratio , stepRatio){
            time = Math.floor(time / ratio);

            while (time >= stepRatio)
            {
                time %= stepRatio;
            }

            return time;
        };

        // 时间格式化处理
        var stringProcessing = function(){
            if (G.getValType(d) !== 'Null' && d < 10 && isZeroAdd) {
                d = '0' + d;
            }

            if (G.getValType(h) !== 'Null' && h < 10 && isZeroAdd) {
                h = '0' + h;
            }

            if (G.getValType(i) !== 'Null' && i < 10 && isZeroAdd) {
                i = '0' + i;
            }

            if (G.getValType(s) !== 'Null' && s < 10 && isZeroAdd) {
                s = '0' + s;
            }
        };

        if (format === 'D天H时I分S秒') {
            s = getTime(duration , sRatio , 60);
            i = getTime(duration , iRatio , 60);
            h = getTime(duration , hRatio , 24);
            d = Math.floor(duration / dRatio);

            stringProcessing();

            if (isReturnJson) {
                return {
                    day: d ,
                    hour: h ,
                    minute: i ,
                    second: s
                };
            }

            return d + '天' + h + '时' + i + '分' + s + '秒';
        }

        if (format === 'HH:II:SS') {
            s = getTime(duration , sRatio , 60);
            i = getTime(duration , iRatio , 60);
            h = Math.floor(duration / hRatio);

            stringProcessing();

            if (isReturnJson) {
                return {
                    hour: h ,
                    minute: i ,
                    second: s
                };
            }

            return h + ':' + i + ':' + s;
        }

        if (format === 'HH时II分SS秒') {
            s = getTime(duration , sRatio , 60);
            i = getTime(duration , iRatio , 60);
            h = Math.floor(duration / hRatio);

            stringProcessing();

            if (isReturnJson) {
                return {
                    hour: h ,
                    minute: i ,
                    second: s
                };
            }

            return h + '时' + i + '分' + s + '秒';
        }
    };

    /*
     * 获取一个时间的个部分值，以对象形式返回
     * 支持的时间格式：
     * date: 2016-10-10
     * datetime: 2016-10-10 23:25:58
     */
    SmallJs.parseTime = function(time , type){
        var typeRange = ['date' , 'datetime'];
        var result    = {};

        if (!SmallJs.contain(type , typeRange)) {
            throw new Error('时间格式错误！时间格式要求，类型 date：2016-01-10 或 datetime：2017-03-05 10:11:00');
        }

        if (type === 'date') {
            time	  = time.split('-');

            var year  = parseInt(time[0]);
            var month = parseInt(time[1]);
            var date  = parseInt(time[2]);

            return {
                year: year ,
                month:month ,
                date: date
            }
        }

        if (type === 'datetime') {
            time	  = time.split(' ');

            var ymd   = time[0].split('-');
            var his   = time[1].split(':');

            var year  = parseInt(ymd[0]);
            var month = parseInt(ymd[1]);
            var date  = parseInt(ymd[2]);
            var hour  = parseInt(his[0]);
            var min	  = parseInt(his[1]);
            var sec   = parseInt(his[2]);

            return {
                year: year ,
                month:month ,
                date: date ,
                hour: hour ,
                minute: min ,
                second: sec
            };
        }
    };

    /*
     * 获取当前时间点信息，格式化返回 返回格式是： 2017-05-27 22:54:00
     * @param  Boolean isReturnFormatTimeString 是否返回处理后字符串
     * @param  Boolean isZeroAdd				月、日、时、分、秒小于 10 是否前面添加 0
     * @return Object|String
     */

    SmallJs.getCurTimeData = function(isReturnFormatTimeString , isZeroAdd){
        var isReturnFormatTimeString = G.getValType(isReturnFormatTimeString) !== 'Boolean' ? false : isReturnFormatTimeString;
        var isZeroAdd				 = G.getValType(isZeroAdd) !== 'Boolean' ? true : isZeroAdd;

        var d	 = new Date();
        var y	 = d.getFullYear();
        var m	 = d.getMonth() + 1;
        var date = d.getDate();
        var h	 = d.getHours();
        var i	 = d.getMinutes();
        var s	 = d.getSeconds();

        if (!isReturnFormatTimeString) {
            return {
                year:   y ,
                month:  m ,
                date:   date ,
                hour:   h ,
                minute: i ,
                second: s
            };
        }

        var formatTimeString = '';

        if (isZeroAdd) {
            formatTimeString += y;

            if (m < 10) {
                formatTimeString += '-' + '0' + m;
            } else {
                formatTimeString += '-' + m;
            }

            if (date < 10) {
                formatTimeString += '-' + '0' + date;
            } else {
                formatTimeString += '-' + date;
            }

            if (h < 10) {
                formatTimeString += ' ' + '0' + h;
            } else {
                formatTimeString += ' ' + h;
            }

            if (i < 10) {
                formatTimeString += ':' + '0' + i;
            } else {
                formatTimeString += ':' + i;
            }

            if (s < 10) {
                formatTimeString += ':' + '0' + s;
            } else {
                formatTimeString += ':' + s;
            }

            return formatTimeString;
        }

        // 月、日、时、分、秒 小于 10 的时候，默认前面不加 0
        return y + '-' + m + '-' + date + ' ' + h + ':' + ':' + m + ':' + s;
    };

    /*
     * 根据给定的时间戳获取每个项的值
     * 格式 2017-05-10 10:49:00
     * @param  String timestamp 时间戳
     * @return String
     */
    SmallJs.getTimeData = function(timestamp){
        var timeReg = /^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/;

        if (!timeReg.test(timestamp)) {
            throw new Error('时间格式不正确');
        }

        var data = timestamp.split(' ');
        var ymd  = data[0].split('-');
        var his  = data[1].split(':');

        return {
            year:   parseInt(ymd[0]) ,
            month:  parseInt(ymd[1]) ,
            date:   parseInt(ymd[2]) ,
            hour:   parseInt(his[0]) ,
            minute: parseInt(his[1]) ,
            second: parseInt(his[2])
        };
    };

    /*
     * 返回两个时间戳的相差的毫秒数
     * 格式要求：2017-10-10 10:10:10
     */
    SmallJs.timestampDiff = function(sTime , eTime , type){
        var typeRange = ['date' , 'datetime'];
        var type	  = G.contain(type , typeRange) ? type : 'datetime';
        var t1 = SmallJs.parseTime(sTime , type);
        var t2 = SmallJs.parseTime(eTime , type);

        var d1 = new Date();
        var d2 = new Date();

        // 时间点1
        d1.setFullYear(t1['year']);
        d1.setMonth(t1['month'] - 1);
        d1.setDate(t1['date']);

        // 时间点2
        d2.setFullYear(t2['year']);
        d2.setMonth(t2['month'] - 1);
        d2.setDate(t2['date']);

        // 如果类型是 datetime 的时候，设置时分秒
        if (type === 'datetime') {
            d1.setHours(t1['hour']);
            d1.setMinutes(t1['minute']);
            d1.setSeconds(t1['second']);

            d2.setHours(t2['hour']);
            d2.setMinutes(t2['minute']);
            d2.setSeconds(t2['second']);
        }

        var d1Mill = d1.getTime();
        var d2Mill = d2.getTime();

        return d2Mill - d1Mill;
    };

    /**
     * unixtime 转换成 正常时间
     * @param  number  unixtime unix 时间戳
     * @param  String  type 返回的类型
     * @param  Boolean isReturnFormatTimeString 是否返回字符串（默认返回对象）
     * @param  Boolean isZeroAdd 是否对小于 10 的数加上前导0
     * @return Object|String
     */
    SmallJs.fromUnixtime = function(unixtime , type , isReturnFormatTimeString , isZeroAdd){
        var typeRange                = ['datetime' , 'date'];
        type                     = G.contain(type , typeRange) ? type : 'datetime';
        var isReturnFormatTimeString = G.getValType(isReturnFormatTimeString) !== 'Boolean' ? false : isReturnFormatTimeString;
        var isZeroAdd				 = G.getValType(isZeroAdd) !== 'Boolean' ? true : isZeroAdd;

        var d	 = new Date(unixtime);
        var y	 = d.getFullYear();
        var m	 = d.getMonth() + 1;
        var date = d.getDate();
        var h	 = d.getHours();
        var i	 = d.getMinutes();
        var s	 = d.getSeconds();

        if (!isReturnFormatTimeString) {
            if (type === 'date') {
                return {
                    year:   y ,
                    month:  m ,
                    date:   date
                };
            }

            return {
                year:   y ,
                month:  m ,
                date:   date ,
                hour:   h ,
                minute: i ,
                second: s
            };
        }

        var formatTimeString = '';

        if (isZeroAdd) {
            formatTimeString += y;

            if (m < 10) {
                formatTimeString += '-' + '0' + m;
            } else {
                formatTimeString += '-' + m;
            }

            if (date < 10) {
                formatTimeString += '-' + '0' + date;
            } else {
                formatTimeString += '-' + date;
            }

            if (h < 10) {
                formatTimeString += ' ' + '0' + h;
            } else {
                formatTimeString += ' ' + h;
            }

            if (i < 10) {
                formatTimeString += ':' + '0' + i;
            } else {
                formatTimeString += ':' + i;
            }

            if (s < 10) {
                formatTimeString += ':' + '0' + s;
            } else {
                formatTimeString += ':' + s;
            }

            return formatTimeString;
        }

        // 月、日、时、分、秒 小于 10 的时候，默认前面不加 0
        if (type === 'date') {
            return y + '-' + m + '-' + date;
        }

        return y + '-' + m + '-' + date + ' ' + h + ':' + ':' + m + ':' + s;
    };

    /**
     * 从格式化时间中返回 unixtime
     * @param formatTime 格式化时间
     * @param type 指明时间类型：datetime、date
     * @returns {Number|number}
     */
    SmallJs.unixTimestamp = function(formatTime , type){
        var typeRange = ['datetime' , 'date'];

        if (!G.contain(type , typeRange)) {
            throw new Error('参数 2 错误');
        }

        var info = G.parseTime(formatTime , type);

        var d = new Date();
        d.setFullYear(info['year']);
        d.setMonth(info['month'] - 1);
        d.setDate(info['date']);

        if (type === 'datetime') {
            d.setHours(info['hour']);
            d.setMinutes(info['minute']);
            d.setSeconds(info['second']);
        } else {
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
        }

        return d.getTime();
    };

    /*
     * 倒计时函数
     * @param  Number   sn
     * @param  Number   en
     * @param  Callback refreshFunc
     * @param  Callback timeOverFunc
     * @return Undefined
     */
    SmallJs.countTimeDown = function(sn , en , refreshFunc , timeOverFunc){
        if (SmallJs.getValType(sn) !== 'Number') {
            throw new Error('参数 1 类型错误');
        }

        if (SmallJs.getValType(en) !== 'Number') {
            throw new Error('参数 2 类型错误');
        }

        if (SmallJs.getValType(refreshFunc) !== 'Function') {
            throw new Error('参数 3 类型错误');
        }

        if (SmallJs.getValType(timeOverFunc) !== 'Function') {
            throw new Error('参数 4 类型错误');
        }

        if (sn - en > 0) {
            throw new Error('参数 1 必须小于参数 2');
        }

        var duration = en - sn;

        var go = function(){
            if (duration !== 0) {
                duration--;
                refreshFunc(duration);
                window.setTimeout(go , 1000);
            } else {
                timeOverFunc();
            }
        };

        go();
    };

    /*
     * 获取视频第一帧展示图
     * @param  String    url 视频 URL
     * @param  Function  fn  处理完后的回调，会将处理完后的链接传给第一个参数
     * @param  Object    opt 视频截取的尺寸设置
     opt = {
     width: 300 ,   // > 0
     height: 300 ,  // > 0
     type: 'jpg' ,  // jpg | png
     quality: 1     // 0-1
     };
     * @return Undefined
     */
    SmallJs.getVideoShowPic = function(url , fn , opt){
        var v   = document.createElement('video');
        var cav = document.createElement('canvas');
        var ctx = cav.getContext('2d');

        v = G(v);

        v.loginEvent('loadeddata' , function(){
            var self  = this;

            this.currentTime = 1;

            v.loginEvent('seeked' , function(){
                var vW = 0;
                var vH = 0;
                var typeRange = ['jpg' , 'png'];
                var type      = 'jpg'; // 图片类型
                var src		  = '';	   // 截取后的图片源
                var quality   = 1;     // 截取质量

                // 未设置截取视频的尺寸时，自动设置为视频的尺寸大小
                if (SmallJs.getValType(opt) === 'Undefined') {
                    vW = this.videoWidth;
                    vH = this.videoHeight;

                    cav.width  = vW;
                    cav.height = vH;

                    ctx.drawImage(this , 0 , 0 , vW , vH , 0 , 0 , vW , vH);
                } else {
                    vW   = opt['width'];
                    vH   = opt['height'];
                    type = G.contain(opt['type'] , typeRange) ? opt['type'] : type;
                    quality = G.getValType(opt['quality']) !== 'Number' || G.getValType(opt['quality']) === 'Number' && opt['quality'] > 0 && opt['quality'] < 1 ? quality : opt['quality'];

                    cav.width  = vW;
                    cav.height = vH;

                    ctx.drawImage(this , 0 , 0 , vW , vH);
                }

                switch (type)
                {
                    case 'jpg':
                        src = cav.toDataURL('image/jpeg' , quality);
                        break;
                    case 'png':
                        src = cav.toDataURL('image/png'  , quality);
                        break;
                }

                if (SmallJs.getValType(fn) === 'Function') {
                    fn(src);
                } else {
                    console.log('没有注册回调函数，第一帧展示图src源：' + src);
                }
            } , false , false);
        } , false , false);

        v.get().src = url;
    };

    /*
     * 本地化显示当前时间
     */
    SmallJs.showClock = function(fn , isReturnJson){
        var isReturnJson = SmallJs.getValType(isReturnJson) !== 'Boolean' ? false : isReturnJson;

        var setTime = function(){
            var d	 = new Date();
            var y	 = d.getFullYear();
            var m	 = d.getMonth() + 1;
            var date = d.getDate();
            var day  = d.getDay() + 1;
            var h	 = d.getHours();
            var i	 = d.getMinutes();
            var s	 = d.getSeconds();

            m	= m < 10 ? '0' + m : m;
            date = date < 10 ? '0' + date : date;
            h	= h < 10 ? '0' + h : h;
            i	= i < 10 ? '0' + i : i;
            s	= s < 10 ? '0' + s : s;

            switch (day)
            {
                case 1:
                    day = '日';
                    break;

                case 2:
                    day = '一';
                    break;

                case 3:
                    day = '二';
                    break;

                case 4:
                    day = '三';
                    break;

                case 5:
                    day = '四';
                    break;

                case 6:
                    day = '五';
                    break;

                case 7:
                    day = '六';
                    break;
            }
            var data = null;

            data = y + '-' + m + '-' + date + ' 星期' + day  + ' ' + h + ':' + i + ':' + s;

            if (isReturnJson) {
                data = {
                    year: y ,
                    month: m ,
                    date: date ,
                    day: day ,
                    hour: h ,
                    minute: i ,
                    second: s
                };
            }

            if (SmallJs.getValType(fn) === 'Function') {
                fn(data);
            }
            window.setTimeout(setTime , 1000);
        };

        setTime();
    };

    /*
     * **************
     SmallJs 扩展库
     * **************
     */

    /*
     * author 陈学龙 2016/09/16 Version 1.0
     * 普通动画扩展
     * 速度恒定不变 | 时间恒定不变
     * 范围动画(时间)
     * 使用方法：
     * @param Object | Array
     opt = {
     ele: null ,														 // 变化的元素
     carTime: 200 ,													 // 动画时间
     // 变化的属性
     json: [
     {
     // 必备其中三个： attr , sVal , chgVal , eVal
     attr:'left' ,
     sVal: 0 ,
     chgVal: 500 ,
     eVal: 500 ,
     unit: 'px'
     }
     ]
     delay: 0 ,														   // 延迟动画的时间
     fn: null ,														   // 回调函数（若是存在，会将 当前作用元素 作为第一个参数传给 回调函数）
     runtimeOpr: 'do-and-clearQueue'                                      // 动画执行期间添加的操作的执行情况：无操作（no-opr）|| 等待当前完成后立即执行（wait-for-completion） || 立即执行但不删除队列（do-but-not-clearQueue） || 立即执行并删除队列（do-and-clearQueue）
     timingFunction: 'linear' ,										   // 动画类型（有待完善完善）
     isConstantSpeed: true												   // 恒定速度，默认：速度恒定
     };
     *   @return undefined
     */

    function Animate(opt){
        var thisRange = [window , null , undefined];

        if (SmallJs.contain(this , thisRange) || (!SmallJs.contain(this , thisRange) && this.constructor !== Animate)) {
            return new Animate(opt);
        }

        if (SmallJs.getValType(opt) !== 'Object') {
            throw new TypeError('参数 1 类型错误');
        }

        this._defaultOpt = {
            ele: null ,
            carTime: 200 ,
            json: {} ,
            // 当前动画结束后的回调
            fn: null ,
            delay: 0 ,
            timingFunction: 'linear' ,
            type: 'time' ,
            runtimeOpr: 'do-and-clearQueue' ,
            // 加入分组（组名）
            group: '' ,
            // 分组动画都结束之后调用的回调函数
            groupFn: null
        };

        // 静态参数
        this._ele				  = opt['ele'];
        this._timingFunctionRange = ['linear' , 'ease-in' , 'ease-out' , 'ease-in-out'];
        this._runtimeOprRange	  = ['no-opr' , 'wait-for-completion' , 'instant-completion-then-do-and-clearQueue' , 'instant-completion-then-do-but-no-clearQueue' ,  'do-but-no-clearQueue' , 'do-and-clearQueue'];
        this._typeRange			  = ['time' , 'speed'];
        this.isStop				  = false;

        this._opt				  = opt;

        this._run();
    }

    /**
     * 静态属性：动画分组
     * 作用：监听一组动画的动画状态，动画完成之后执行指定的回调函数
     * 结构：key:array
     * {
	 * 		'animate_group_1' : [
	 * 			animateObj1 ,
	 * 			animateObj2
	 	* 	]
	 * }
     */
    Animate.group = {};

    Animate.prototype = {
        version: '6.0' ,

        cTime: '2016/09/16 10:20:00' ,

        constructor: Animate ,

        // 初始化设置
        _setOpt: function(opt){
            if (SmallJs.getValType(opt) === 'Undefined') {
                return ;
            }

            // console.log(opt);

            // 动态参数
            this._carTime			  = SmallJs.getValType(opt['carTime']) !== 'Number'								  ?  this._defaultOpt['carTime']			 : opt['carTime'];
            this._json				  = SmallJs.getValType(opt['json']) === 'Undefined'								  ?  this._defaultOpt['json']				 : opt['json'];
            this._fn				  = SmallJs.getValType(opt['fn']) !== 'Function'								  ?  this._defaultOpt['fn']					 : opt['fn'];
            this._group			  	  = !SmallJs.isValidVal(opt['group'])						  	  			  	  ?  this._defaultOpt['group']			 	 : opt['group'];
            this._groupFn			  = SmallJs.getValType(opt['groupFn']) !== 'Function'						  	  ?  this._defaultOpt['groupFn']			 : opt['groupFn'];
            this._delay				  = SmallJs.getValType(opt['delay']) !== 'Number'								  ?  this._defaultOpt['delay']				 : opt['delay'];
            this._timingFunction	  = !SmallJs.contain(opt['timingFunction'] , this._timingFunctionRange)			  ?  this._defaultOpt['timingFunction']		 : opt['timingFunction'];
            this._type				  = SmallJs.contain(opt['type'] , this._typeRange)							      ?  this._defaultOpt['type']				 : opt['type'];
            this._runtimeOpr		  = !SmallJs.contain(opt['runtimeOpr'] , this._runtimeOprRange)					  ?  this._defaultOpt['runtimeOpr']			 : opt['runtimeOpr'];
            this._sTime				  = SmallJs.getValType(opt['sTime']) !== 'Number'                                 ?  new Date().getTime() + this._delay		 : opt['sTime'];
            this._eTime				  = SmallJs.getValType(opt['eTime']) !== 'Number'                                 ?  this._sTime + this._carTime			 : opt['eTime'];

            // console.log(this._group , this._groupFn);
        } ,

        // 初始化静态参数
        _initStaticArgs: function(){
            if (this._group !== '') {
                if (SmallJs.getValType(Animate.group[this._group]) !== 'Array') {
                    Animate.group[this._group] = [];
                }

                if (SmallJs.contain(this , Animate.group[this._group])) {
                    return ;
                }

                Animate.group[this._group].push(this);
            }
        } ,

        // 获取动画完成后的元素各属性值
        _getEndEffect: function(){
            var endEffect	   = [];
            var rel			   = null;
            var sVal		   = 0;
            var eVal		   = 0;
            var chgVal		   = 0;
            var unit			   = '';
            var noUnitAttrRange = ['opacity' , 'zIndex'];

            for (var i = 0; i < this._json.length; ++i)
            {
                if (SmallJs.getValType(this._json[i]['attr']) === 'Undefined') {
                    throw new Error('必须提供一个属性名！！');
                }

                if (SmallJs.getValType(this._json[i]['sVal']) === 'Number' && SmallJs.getValType(this._json[i]['chgVal']) === 'Number') {

                    this._json[i]['eVal']   = this._json[i]['sVal'] + this._json[i]['chgVal'];

                } else if (SmallJs.getValType(this._json[i]['sVal']) === 'Number' && SmallJs.getValType(this._json[i]['eVal']) === 'Number') {

                    this._json[i]['chgVal'] = this._json[i]['eVal'] - this._json[i]['sVal'];

                } else if (SmallJs.getValType(this._json[i]['chgVal']) === 'Number' && SmallJs.getValType(this._json[i]['eVal']) === 'Number') {

                    this._json[i]['sVal']   = this._json[i]['eVal'] - this._json[i]['chgVal'];

                } else {

                    throw new TypeError('sVal chgVal eVal 至少提供两个参数！');

                }

                this._json[i]['curVal'] = parseFloat(SmallJs(this._ele).getStyleVal(this._json[i]['attr']));
                this._json[i]['unit']   = !SmallJs.contain(this._json[i]['attr'] , noUnitAttrRange) ? 'px' : '';

                endEffect.push(this._json[i]);
            }

            this._endEffect = endEffect;
        } ,

        _setEndEffect: function(){
            var endEffect = this.getEndEffect();
            var rel = null;

            for (var i = 0; i < endEffect.length; ++i)
            {
                rel = {};
                rel[endEffect[i]['attr']] = endEffect[i]['eVal'] + endEffect[i]['unit'];
                SmallJs(this._ele).css(rel);
            }
        } ,

        getEndEffect: function(){
            return this._endEffect;
        } ,

        // 时间恒定动画
        _timeConstantAnimate: function(){
            var self		   = this;
            var effect		   = null;
            var sTime          = this._sTime;
            var curTime        = null;
            var eTime          = this._eTime;
            var duration       = 0;
            var ratio          = 0;
            var queue		   = this._getQueue();
            var endEffect	   = this.getEndEffect();
            this.isStop       = false;
            var animate = function(){
                curTime		= new Date().getTime();
                duration    = curTime - sTime;
                ratio       = duration / self._carTime;

                for (var i = 0; i < endEffect.length; ++i)
                {
                    if (endEffect[i]['curVal'] === endEffect[i]['eVal']) {
                        continue;
                    }

                    endEffect[i]['curVal'] = endEffect[i]['chgVal'] >= 0 ? Math.min(endEffect[i]['eVal'] , endEffect[i]['sVal'] + endEffect[i]['chgVal'] * ratio) : Math.max(endEffect[i]['eVal'] , endEffect[i]['sVal'] + endEffect[i]['chgVal'] * ratio);

                    effect = {};

                    effect[endEffect[i]['attr']] = endEffect[i]['curVal'] + endEffect[i]['unit'];

                    SmallJs(self._ele).css(effect);
                }

                if (curTime > eTime) {
                    // 动画结束
                    self.isStop = true;

                    SmallJs.CAF(queue['carTimer']);

                    self._setEndEffect();

                    if (SmallJs.getValType(self._fn) === 'Function') {
                        self._fn(self._ele);
                    }

                    queue['carTimer']	= undefined;

                    self._dequeue();

                    if (!self._checkQueueIsEmpty()) {
                        console.log('继续调用队列');

                        var queueHeader = self._getQueueHeader();

                        queueHeader['sTime'] = new Date().getTime() + queueHeader['delay'];
                        queueHeader['eTime'] = queueHeader['sTime'] + queueHeader['carTime'];

                        self._setOpt(queueHeader);
                        self._getEndEffect();
                        self._animate();
                    } else {
                        // 组内回调
                        if (self._group !== '') {
                            var group = Animate.group[self._group];
                            var i     = 0;
                            var cur   = null;
                            var count = 0;

                            for (; i < group.length; ++i)
                            {
                                cur = group[i];

                                if (cur.isStop) {
                                    count++;
                                }
                            }

                            // 调用分组回调函数
                            if (count === group.length && SmallJs.getValType(self._groupFn) === 'Function') {
                                self._groupFn();
                            }
                        }
                    }
                } else {
                    queue['carTimer'] = SmallJs.RAF(animate);
                }
            };

            window.clearTimeout(queue['delayTimer']);

            SmallJs.CAF(queue['carTimer']);

            queue['delayTimer'] = window.setTimeout(function(){

                queue['carTimer'] = SmallJs.RAF(animate);

                queue['delayTimer'] = undefined;

            } , this._delay);
        } ,

        // 速度恒定动画
        _speedConstantAnimate: function(){
            var self		   = this;
            var fps			   = 60 / 1000;
            var effect		   = null;
            var speed		   = 0;
            var tCount		   = this._carTime * fps;
            var isValOverRange = false;
            var queue		   = this._getQueue();
            var endEffect	   = this.getEndEffect();
            this.isStop	   = false;
            var animate		   = function(){
                for (var i = 0; i < endEffect.length; ++i)
                {
                    speed = (endEffect[i]['eVal'] - endEffect[i]['sVal']) / tCount;

                    endEffect[i]['curVal'] = speed >= 0 ? Math.min(endEffect[i]['eVal'] , endEffect[i]['curVal'] + speed) : Math.max(endEffect[i]['eVal'] , endEffect[i]['curVal'] + speed);

                    effect = {};

                    effect[endEffect[i]['attr']] = endEffect[i]['curVal'] + endEffect[i]['unit'];

                    SmallJs(self._ele).css(effect);
                }

                isValOverRange = false;

                for (var i = 0; i < endEffect.length; ++i)
                {
                    if (endEffect[i]['curVal'] === endEffect[i]['eVal']) {
                        isValOverRange = true;
                    } else {
                        isValOverRange = false;
                        break;
                    }
                }

                if (isValOverRange) {
                    self.isStop = true;

                    SmallJs.CAF(queue['carTimer']);

                    self._setEndEffect();

                    if (SmallJs.getValType(self._fn) === 'Function') {
                        self._fn(self._ele);
                    }

                    queue['carTimer'] = undefined;

                    self._dequeue();

                    if (!self._checkQueueIsEmpty()) {
                        self._setOpt(self._getQueueHeader());
                        self._getEndEffect();
                        self._animate();
                    } else {
                        // 组内回调
                        if (self._group !== '') {
                            var group = Animate.group[self._group];
                            var i     = 0;
                            var cur   = null;
                            var count = 0;

                            for (; i < group.length; ++i)
                            {
                                cur = group[i];

                                if (cur.isStop) {
                                    count++;
                                }
                            }

                            // 调用分组回调函数
                            if (count === group.length && SmallJs.getValType(self._groupFn) === 'Function') {
                                console.log(group);

                                self._groupFn();
                            }
                        }
                    }
                } else {
                    queue['carTimer'] = SmallJs.RAF(animate);
                }
            };

            window.clearTimeout(queue['delayTimer']);

            SmallJs.CAF(queue['carTimer']);

            queue['delayTimer'] = window.setTimeout(function(){
                queue['carTimer']   = SmallJs.RAF(animate);
                queue['delayTimer'] = undefined;
            } , this._delay);
        } ,

        stop: function(){
            var queue = this._getQueue();

            window.clearTimeout(queue['delayTimer']);

            SmallJs.CAF(queue['carTimer']);

            queue['delayTimer'] = undefined;
            queue['carTimer']   = undefined;

            this._dequeue();
        } ,

        _animate: function(){
            if (this._type === 'speed') {
                this._speedConstantAnimate();
            } else {
                this._timeConstantAnimate();
            }
        } ,

        // 判断元素是否在队列中
        _isExistsInQueue: function(){
            for (var i = 0; i < q.get().length; ++i)
            {
                if (q.get()[i]['ele'] === this._ele) {
                    return true;
                }
            }

            return false;
        } ,

        // 添加元素到队列中去
        _addEleToQueue: function(){
            var stepEvent = {
                ele: this._ele ,	 // 当前元素
                carTimer: null ,	 // 当前元素的动画定时器id
                delayTimer: null ,   // 当前元素的延迟定时器id
                queue: []			 // 队列列表
            };

            q.push(stepEvent);
        } ,

        // 获取元素列表
        _getQueue: function(){
            for (var i = 0; i < q.get().length; ++i)
            {
                if (q.get()[i]['ele'] === this._ele) {
                    return q.get()[i];
                }
            }

            throw new Error('当前元素不存在动画队列');
        } ,

        // 获取元素在队列中的事件列表
        _getEleQueue: function(){
            for (var i = 0; i < q.get().length; ++i)
            {
                if (q.get()[i]['ele'] === this._ele) {
                    return q.get()[i]['queue'];
                }
            }

            return false;
        } ,

        // 获取当前事件在队列中的下标
        _getQIdx: function(unit){
            if (!this._isExistsInQueue()) {
                throw new RangeError('不在队列中！');
            }

            var queue = this._getEleQueue();

            console.log('获取当前事件在队列中的下标：' , queue , unit);

            for(var i = 0; i < queue.length; ++i)
            {
                if (SmallJs.set.isSameSet(queue[i] , unit)) {
                    return i;
                }
            }

            throw new RangeError('队列事件中为查找到当前单元的相关信息！');

        } ,

        // 在队列头部插入
        _unshiftQueue: function(unit){
            this._getEleQueue().unshift(unit);
        } ,

        // 入队（在队列尾部插入）
        _enqueue: function(unit){
            this._getEleQueue().push(unit);
        } ,

        // 出队
        _dequeue: function(){
            return this._getEleQueue().shift();
        } ,

        // 不删除单元的情况下获取队首（也是一种：出队 操作）
        _getQueueHeader: function(){
            return this._getEleQueue()[0];
        } ,

        // 清空队列
        _clearQueue: function(){
            var queue = this._getEleQueue();

            var removeAttr = SmallJs.copyObj(queue);

            for (var i = 0; i < queue.length; ++i)
            {
                queue.splice(i , 1);
                i--;
            }

            return removeAttr;
        } ,

        // 检查队列是否消费完毕
        _checkQueueIsEmpty: function(){
            if (this._getEleQueue().length === 0) {
                return true;
            }

            return false;
        } ,

        // 测试用,获取当前元素所在队列
        debugQueue: function(){
            return this._getQueue();
        } ,

        // 队列操作
        _queueOpr: function(){
            var opt = null;
            var queue = this._getEleQueue();
            var endEffect = null;
            var sVal = null;
            var chgVal = null;

            if (!this._isExistsInQueue()) {
                this._addEleToQueue();
            }

            this._getEndEffect();

            endEffect = this.getEndEffect();

            // 当前参数列表
            opt = {
                ele: this._ele ,
                carTime: this._carTime ,
                json: this._json ,
                fn: this._fn ,
                delay: this._delay ,
                timingFunction: this._timingFunction ,
                type: this._type ,
                runtimeOpr: this._runtimeOpr ,
                group: this._group ,
                // 分组动画都结束之后调用的回调函数
                groupFn: this._groupFn ,
                sTime: this._sTime ,
                eTime: this._eTime ,
            };

            // 队列的核心思想！
            if (this._checkQueueIsEmpty()) {

                this._enqueue(opt);

            } else if (this._runtimeOpr === 'no-opr' && this._checkQueueIsEmpty()) {			// 动画期间：无操作

                this._enqueue(opt);

            } else if (this._runtimeOpr === 'wait-for-completion') {							// 动画期间：等待动画完成在操作

                this._enqueue(opt);

            } else if (this._runtimeOpr === 'instant-completion-then-do-and-clearQueue') {		// 动画期间：瞬间完成当前动画，并清空队列，然后执行接下去的动画

                if (this._type === 'speed') {

                    this._setOpt(this._getQueueHeader());

                    this.stop();

                    this._clearQueue();

                    this._setEndEffect();

                } else {

                    this.stop();
                    this._clearQueue();
                }

                this._enqueue(opt);

            } else if (this._runtimeOpr === 'instant-completion-then-do-but-no-clearQueue') {	// 动画期间：瞬间完成当前动画，不清空队列，然后执行接下去的动画

                if (this._type === 'speed') {

                    this._getEndEffect();

                    this.stop();

                    this._setEndEffect();

                } else {
                    this.stop();
                }

                this._unshiftQueue(opt);

            } else if (this._runtimeOpr === 'do-but-no-clearQueue') {							// 动画期间：立即开始动画，但不清空队列（实际上就是：优先执行当前动画的意思）

                this.stop();

                if (this._type === 'speed' === 'time') {
                    for (var i = 0; i < opt['json'].length; ++i)
                    {
                        opt['json'][i]['sVal']   = parseFloat(SmallJs(opt['ele']).getStyleVal(opt['json'][i]['attr']));
                        opt['json'][i]['chgVal'] = opt['json'][i]['eVal'] - opt['json'][i]['sVal'];
                        opt['json'][i]['curVal'] = opt['json'][i]['sVal'];
                    }
                }

                this._unshiftQueue(opt);

            } else if (this._runtimeOpr === 'do-and-clearQueue') {								// 动画期间：立即开始动画，并清空队列
                this.stop();
                this._clearQueue();

                if (this._type === 'time') {
                    for (var i = 0; i < opt['json'].length; ++i)
                    {
                        opt['json'][i]['sVal']   = parseFloat(SmallJs(opt['ele']).getStyleVal(opt['json'][i]['attr']));
                        opt['json'][i]['chgVal'] = opt['json'][i]['eVal'] - opt['json'][i]['sVal'];
                        opt['json'][i]['curVal'] = opt['json'][i]['sVal'];
                    }
                }

                this._unshiftQueue(opt);
            }
        } ,


        _run: function(){
            // 初始化用户参数
            this._setOpt(this._opt);
            // 初始化静态操作
            this._initStaticArgs();

            // console.log(this._group , Animate.group[this._group]);

            // 队列
            this._queueOpr();
            this._setOpt(this._getQueueHeader());
            this._getEndEffect();

            if (!this._checkQueueIsEmpty()) {
                // console.log(this._group , Animate.group[this._group]);

                this._animate();
            }
        }

    };

    /*
     * css3动画扩展 暂时放着
     * @param	HTMLElement		DOM元素
     * @param	Object			opt
     *        例如：
     {
     is3D: true ,		// 是否是 3d css3动画
     carTime: 200 ,
     json: [
     {
     attr: 'translateX' ,
     sVal: 0   ,
     eVal: 100
     } ,
     {
     attr: 'translateY' ,
     sVal: 0 ,
     eVal: 200
     }
     ] ,
     fn: null
     };
     * @return  'Function'



     function css3Animate(ele , opt){
     var thisRange = [window , null , 'Function'];

     if (SmallJs.contain(this , thisRange) || (!SmallJs.contain(this , thisRange) && this.constructor !== css3Animate)) {
     return new css3Animate(ele , opt);
     }

     this._defaultOpt = {
     type: 'translate' ,   // css3 动画类型 translate || rotate
     carTime: 200 ,
     json: null ,
     fn: null
     };

     if (opt === 'Function') {
     var opt = this._defaultOpt;
     }

     this._carTime	= SmallJs.getValType(opt['carTime']) !== ''Function''	? this._defaultOpt['carTime']	: opt['carTime'];
     this._json		= opt['json'];
     this._fn		= opt['fn'];

     this._run();
     }

     css3Animate.prototype = {
     version: '1.0' ,
     cTime: '2016/11/03 22:38:00' ,
     constructor: css3Animate ,

     _getEndEffect: function(){
     var px   = ['translateX' , 'translateY' , 'translateZ'];
     var deg  = ['rotateX' , 'rotateY' , 'rotateZ'];
     var endEffect = [];

     for (var i = 0; i < this._json.length; ++i)
     {
     this._json[i]['chgVal'] = this._json[i]['eVal'] - this._json[i]['sVal'];
     //this._json[i]['curVal'] =
     }
     } ,

     _run: function(){
     this._getEndEffect();
     }
     };
     */

    /*
     * author 陈学龙 2016/09/16

     * 元素移动类
     * 条件： ele 需设置 position:absolute ， 且初始化设置了 left , top 值
     * @param Element ele  待移动元素
     * @param Element con  移动元素所在移动的容器
     * @return 'Function'
     */
    function MoveEle(ele , con , isLimit){
        var thisRange = [window , null , undefined];

        if (SmallJs.contain(this , thisRange) || (!SmallJs.contain(this , thisRange) && this.constructor !== MoveEle)) {
            return new MoveEle(ele , con);
        }
        this._isLimit   = SmallJs.getValType(isLimit) !== 'Boolean' ? false : isLimit;
        this._ele		= ele;
        this._con		= con;
        this._canMove	=  false ;
        this._conW		= SmallJs(this._con).getEleW('content-box');
        this._conH		= SmallJs(this._con).getEleH('content-box');
        this._eleW		= SmallJs(this._ele).getEleW('content-box');
        this._eleH		= SmallJs(this._ele).getEleH('content-box');
        this._minLV		=  0 ;
        this._maxLV		= Math.floor(Math.max(0 , this._conW - this._eleW));
        this._minTV		=  0 ;
        this._maxTV		= Math.floor(Math.max(0 , this._conH - this._eleH));
        this._sox		=  0 ;
        this._soy		=  0 ;
        this._eox		=  0 ;
        this._eoy		=  0 ;
        this._ox		=  0 ;
        this._oy		=  0 ;
        this._curLV		=  0 ;
        this._curTV		=  0 ;
        this._eLV		=  0 ;
        this._eTV		=  0 ;

        // 注册事件
        SmallJs(this._ele).loginEvent(mouseDown  , this.mouseDown.bind(this)  , false , false);
        SmallJs(window).loginEvent(mouseMove     , this.mouseMove.bind(this)  , true  , false);
        SmallJs(window).loginEvent(mouseUp       , this.mouseUp.bind(this)    , true  , false);
    }

    MoveEle.prototype = {
        version: '1.0' ,
        cTime: '2016/10/28 10:05:00' ,
        constructor: MoveEle ,

        mouseDown: function(event){
            var e = event || window.event;
            e.stopPropagation();

            this._sox	  = browser === 'mobile' ? e.touches[0].clientX : e.clientX;
            this._soy	  = browser === 'mobile' ? e.touches[0].clientY : e.clientY;
            this._sLV	  = SmallJs(this._ele).getCoordVal('left');
            this._sTV	  = SmallJs(this._ele).getCoordVal('top');
            this._canMove = true;

            SmallJs(this._ele).css({
                cursor: 'move'
            });
        } ,

        mouseUp: function(event){
            this._canMove = false;

            SmallJs(this._ele).css({
                cursor: 'default'
            });
        } ,

        mouseMove: function(event){
            if (this._canMove) {
                var e = event || window.event;
                e.preventDefault();

                this._eox = browser === 'mobile' ? e.touches[0].clientX  : e.clientX;
                this._eoy = browser === 'mobile' ? e.touches[0].clientY  : e.clientY;
                this._ox  = this._eox - this._sox;
                this._oy  = this._eoy - this._soy;

                if (this._isLimit) {
                    this._eLV = Math.max(this._minLV , Math.min(this._maxLV , this._sLV + this._ox));
                    this._eTV = Math.max(this._minTV , Math.min(this._maxTV , this._sTV + this._oy));
                } else {
                    this._eLV = this._sLV + this._ox;
                    this._eTV = this._sTV + this._oy;
                }

                SmallJs(this._ele).css({
                    left: this._eLV + 'px' ,
                    top:  this._eTV + 'px'
                });
            }
        }
    };


    // 集合操作
    function Set(){}

    Set.prototype = {
        author: '陈学龙' ,
        cTime: '2016/12/20 01:08:00' ,
        version: '1.0' ,
        construct: Set ,
        /*
         * 集合间关系：子集
         * 要求：只能是 Object Array Element Null Undefined Number Boolean String 类型的集合，不允许出现 例如： Function RegExp Date Math
         * 判断 objA 是否是 objB 的子集
         * @param Object objA 待比较对象
         * @param Object objB 比较对象
         * @return Boolean
         */
        isSubSet: function(objA , objB , isStrict){
            var typeRange		= ['Object' , 'Array' , 'Element'];
            var isStrict		= SmallJs.getValType(isStrict) === 'Boolean' ? isStrict : true;
            var self			= this;
            var recTypeRange	= ['Object' , 'Array'];
            var isSame		    = false;
            var compare;

            if (!SmallJs.contain(SmallJs.getValType(objA) , typeRange)) {
                throw new TypeError('参数 1 类型错误');
            }

            if (!SmallJs.contain(SmallJs.getValType(objB) , typeRange)) {
                throw new TypeError('参数 2 类型错误');
            }

            // 核心：比较函数
            // 作用：判断 A 对象中的单元 在 B 对象中是否存在
            compare  = function(A , B){
                var aDesc = SmallJs.getValType(A);
                var bDesc = SmallJs.getValType(B);
                var cur;
                var curC;
                var curDesc;
                var curCDesc;
                var k;
                var k1;
                var i;
                var n;

                // 先判断描述是否一致
                if (aDesc !== bDesc) {
                    return false;
                }

                // DOM 元素时
                if (SmallJs.isDOMEle(A) || SmallJs.isDOMEle(B)) {
                    if (A === B) {
                        return isSame = true;
                    }

                    return false;
                }

                // 对象要考虑键名 和 键值
                if (aDesc === 'Object') {
                    for (k in A)
                    {
                        cur		= A[k];
                        curDesc = SmallJs.getValType(cur);

                        for (k1 in B)
                        {
                            curC	 = B[k1];
                            curCDesc = SmallJs.getValType(curC);

                            if (isStrict) { // 比较键名 + 键值
                                // 判断键值是否相等
                                if (k === k1) {
                                    // 判断类型是否相等
                                    if (curDesc === curCDesc) {
                                        // 是否是 DOM 元素
                                        if (SmallJs.isDOMEle(cur) || SmallJs.isDOMEle(curC)) {
                                            if (cur === curC) {
                                                isSame = true;
                                                break;
                                            } else {
                                                isSame = false;
                                            }
                                        } else {
                                            // Array || Object时，递归判断
                                            if (SmallJs.contain(curDesc , recTypeRange)) {
                                                compare(cur , curC);
                                                // 之所以要 break 的理由：首先键名相等，其次键值类型一致，再次符合当前判断条件，也就是说，执行到这儿，已经确定了 cur和curC 的值了
                                                break;
                                            } else {
                                                // 单纯的值则直接比较
                                                if (cur === curC) {
                                                    isSame = true;
                                                    break;
                                                } else {
                                                    isSame = false;
                                                }
                                            }
                                        }
                                    } else {
                                        isSame = false;
                                    }
                                } else {
                                    isSame = false;
                                }
                            } else {// 只比较键值，其他同上
                                if (curDesc === curCDesc) {
                                    if (SmallJs.isDOMEle(cur) || SmallJs.isDOMEle(curC)) {
                                        if (cur === curC) {
                                            isSame = true;
                                            break;
                                        } else {
                                            isSame = false;
                                        }
                                    } else {
                                        if (SmallJs.contain(curDesc , recTypeRange)) {
                                            compare(cur , curC);
                                            // 之所以要 break 的理由：首先键名相等，其次键值类型一致，再次符合当前判断条件，也就是说，执行到这儿，已经确定了 cur和curC 的值了
                                            break;
                                        } else {
                                            if (cur === curC) {
                                                isSame = true;
                                                break;
                                            } else {
                                                isSame = false;
                                            }
                                        }
                                    }
                                } else {
                                    isSame = false;
                                }
                            }
                        }

                        if (isSame === false) {
                            return isSame;
                        }
                    }
                }

                // 数组不要考虑键名，只要考虑键值
                if (aDesc === 'Array') {
                    for (i = 0; i < A.length; ++i)
                    {
                        cur		= A[i];
                        curDesc = SmallJs.getValType(cur);

                        for (n = 0; n < B.length; ++n)
                        {
                            curC	 = B[n];
                            curCDesc = SmallJs.getValType(curC);

                            if (curDesc === curCDesc) {
                                if (SmallJs.isDOMEle(cur) || SmallJs.isDOMEle(curC)) {
                                    if (cur === curC) {
                                        isSame = true;
                                        break;
                                    } else {
                                        isSame = false;
                                    }
                                } else {
                                    if (SmallJs.contain(curDesc , recTypeRange)) {
                                        compare(cur , curC);
                                        // 之所以要 break 的理由：首先键值类型一致，再次符合当前判断条件，也就是说，执行到这儿，已经确定了 cur和curC 的值了
                                        break;
                                    } else {
                                        if (cur === curC) {
                                            isSame = true;
                                            break;
                                        } else {
                                            isSame = false;
                                        }
                                    }
                                }
                            } else {
                                isSame = false;
                            }
                        }
                    }
                }
            };

            compare(objA , objB);

            return isSame;
        } ,

        /*
         * 集合间关系：真子集
         * 如果 A 含于 B，且 B 不含于 A，那么 A 是 B 的真子集（反过来也讲得通）
         * 判断 objA 是否是 objB 的真子集
         * @param  Mixed(Object|Array) objA
         * @param  Mixed(Object|Array) objB
         * @return Boolean
         */
        isProperSubSet: function(objA , objB){
            var AIsBSubSet = this.isSubSet(objA , objB) ,
                BIsASubSet = this.isSubSet(objB , objA);

            if (AIsBSubSet === false) {
                return false;
            }

            if (BIsASubSet) {
                return false;
            }

            return true;
        } ,

        /*
         * 集合间关系：相等
         * A 含于 B ，且 B 含于 A ，则 A = B
         * 判断 objA 是否等于 objB（倒过来描述也行）
         * @param  Mixed(Object|Array) objA
         * @param  Mixed(Object|Array) objB
         * @return Boolean
         */
        isSameSet: function(objA , objB){
            var AIsBSubSet = this.isSubSet(objA , objB);
            var BIsASubSet = this.isSubSet(objB , objA);

            if (AIsBSubSet && BIsASubSet) {
                return true;
            }

            return false;
        } ,

        /*
         * 集合间基本运算：并集
         * 条件：所有参数类型一致！且仅支持：Object Array 的并集运算
         * 特殊：参数 1 如果为 Boolean 的时候，那么表示是否覆盖已有键值的单元值（只在类型为对象的时候有效）
         * 第一种模式
         * @param  Boolean			   isOverOriginalVal 是否覆盖键名相同的值
         * @param  Mixed(Array|Object) args2
         * @param  Mixed(Array|Object) args3
         * @param  Mixed(Array|Object) args4
         ....
         * @return Mixed(Array|Object)

         * 第二种模式
         * @param  Mixed(Array|Object) args1
         * @param  Mixed(Array|Object) args2
         * @param  Mixed(Array|Object) args3
         ....
         * @return Mixed(Array|Object)
         */
        unionSet: function(){
            var args			= arguments;
            var typeRange		= ['Array' , 'Object'];
            var argsDescList	= [];
            var self			= this;
            var rel				= null;
            var argsDesc;
            var i;
            var n;
            var merge;
            var oneArgs;
            var oneArgsDesc;
            var isOverOriginalVal;

            // 参数长度为 0
            if (args.length === 0) {
                return false;
            }

            oneArgs			  = args[0];
            oneArgsDesc		  = SmallJs.getValType(oneArgs);
            isOverOriginalVal = oneArgsDesc !== 'Boolean' ? true : oneArgs;


            // 检查所有参数类型是否正确
            for (i = oneArgsDesc === 'Boolean' ? 1 : 0; i < args.length; ++i)
            {
                argsDesc = SmallJs.getValType(args[i]);

                argsDescList.push(argsDesc);

                if (SmallJs.contain(argsDesc , typeRange) === false) {
                    throw new TypeError('参数 ' + (i + 1) + ' 类型错误');
                }
            }

            // 检查所有参数类型是否一致
            for (i = oneArgsDesc === 'Boolean' ? 1 : 0; i < argsDescList.length; ++i)
            {
                for (n = i + 1; n < argsDescList.length; ++n)
                {
                    if (argsDescList[i] !== argsDescList[n]) {
                        throw new TypeError('所有参数类型不一致');
                    }
                }

                break;
            }

            // 参数长度为 1，且第一个参数为 Boolean
            if (args.length === 1 && oneArgsDesc === 'Boolean') {
                return false;
            }

            // 参数长度为 1，且第一个参数不为 Boolean
            if (args.length === 1 && oneArgsDesc !== 'Boolean') {
                return oneArgs;
            }

            // 参数长度至少 2 个
            /*
             * 拷贝对象 B 到 对象 A中
             * 核心：合并函数
             * 碰撞处理：不要复制
             * @param Object|Array A                 拷贝到的对象
             * @param Object|Array B                 被拷贝的对象
             * @param Boolean      isOverOriginalVal 如果是对象，是否覆盖已有键值的值
             * @return undefined
             */
            merge = function(A , B , isOverOriginalVal){
                var aDesc = SmallJs.getValType(A);
                var bDesc = SmallJs.getValType(B);
                var isOverOriginalVal = SmallJs.getValType(isOverOriginalVal) !== 'Boolean' ? false : isOverOriginalVal;
                var cur;
                var curDesc;
                var i;
                var k;

                if (SmallJs.contain(aDesc , typeRange) === false) {
                    throw new TypeError('参数 1 类型错误');
                }

                if (SmallJs.contain(bDesc , typeRange) === false) {
                    throw new TypeError('参数 2 类型错误');
                }

                if (aDesc !== bDesc) {
                    throw new TypeError('所有参数类型不一致');
                }

                if (aDesc === 'Object') {
                    for (k in B)
                    {
                        cur     = B[k];
                        curDesc = SmallJs.getValType(cur);

                        if (SmallJs.getValType(A[k]) !== 'Undefined' && !isOverOriginalVal) {
                            continue ;
                        }

                        if (SmallJs.contain(curDesc , typeRange)) {
                            A[k] = SmallJs.copyObj(cur);
                        } else {
                            A[k] = cur;
                        }
                    }
                }

                if (aDesc === 'Array') {
                    for (i = 0; i < B.length; ++i)
                    {
                        cur     = B[i];
                        curDesc = SmallJs.getValType(cur);

                        if (SmallJs.contain(curDesc , typeRange)) {
                            A.push(SmallJs.copyObj(cur));
                        } else {
                            A.push(cur);
                        }
                    }
                }
            };

            for (i = oneArgsDesc === 'Boolean' ? 1 : 0; i < args.length; ++i)
            {
                if (rel === null) {
                    argsDesc = SmallJs.getValType(args[i]);
                    rel		 = argsDesc === 'Object' ? {} : [];
                }

                merge(rel , args[i] , isOverOriginalVal);
            }

            return rel;
        } ,

        /*
         * 集合间基本运算：交集
         * @param  Boolean			   isStrict 是否严格比较，当比较的是对象时有效（比较键名和键值）
         * @param  Mixed(Array|Object) args2
         * @param  Mixed(Array|Object) args3
         * @param  Mixed(Array|Object) args4
         ....
         * @return Mixed(Array|Object)

         * 第二种模式
         * @param  Mixed(Array|Object) args1
         * @param  Mixed(Array|Object) args2
         * @param  Mixed(Array|Object) args3
         ....
         * @return Mixed(Array|Object)
         */
        intersectionSet: function(){
            var args		 = arguments;
            var typeRange	 = ['Array' , 'Object'];
            var argsDescList = [];
            var self		 = this;
            var rel			 = null;
            var isStrict     = true;
            var argsDesc;
            var relDesc;
            var getIntersect;
            var i;
            var oneArgs;
            var oneArgsDesc;

            // 参数长度为 0
            if (args.length === 0) {
                return false;
            }

            oneArgs     = args[0];
            oneArgsDesc = SmallJs.getValType(oneArgs);

            // 检查所有参数类型是否正确
            for (i = oneArgsDesc === 'Boolean' ? 1 : 0; i < args.length; ++i)
            {
                argsDesc = SmallJs.getValType(args[i]);
                argsDescList.push(argsDesc);

                if (SmallJs.contain(argsDesc , typeRange) === false) {
                    throw new TypeError('参数 ' + (i + 1) + ' 类型错误');
                }
            }

            // 检查所有参数类型是否一致
            for (i = oneArgsDesc === 'Boolean' ? 1 : 0; i < argsDescList.length; ++i)
            {
                for (n = i + 1; n < argsDescList.length; ++n)
                {
                    if (argsDescList[i] !== argsDescList[n]) {
                        throw new TypeError('所有参数类型不一致');
                    }
                }

                break;
            }

            // 参数长度为 1
            if (args.length === 1 && oneArgsDesc === 'Boolean') {
                return false
            }

            if (args.length === 1 && oneArgsDesc !== 'Boolean') {
                return oneArgs;
            }

            isStrict = oneArgsDesc !== 'Boolean' ? true : oneArgs;

            // 核心：获取两个集合的交集
            getIntersect = function(A , B , isStrict){
                var aDesc = SmallJs.getValType(A);
                var bDesc = SmallJs.getValType(B);
                var rel;
                var k;
                var k1;
                var cur;
                var curC;
                var curDesc;
                var curCDesc;

                if (!SmallJs.contain(aDesc , typeRange)) {
                    throw new TypeError('参数 1 类型错误');
                }

                if (!SmallJs.contain(bDesc , typeRange)) {
                    throw new TypeError('参数 2 类型错误');
                }

                if (aDesc !== bDesc) {
                    throw new TypeError('所有参数类型不一致');
                }

                rel = aDesc === 'Object' ? {} : [];

                if (aDesc === 'Object') {
                    for (k in A)
                    {
                        cur     = A[k];
                        curDesc = SmallJs.getValType(cur);

                        for (k1 in B)
                        {
                            curC     = B[k1];
                            curCDesc = SmallJs.getValType(curC);

                            if (isStrict) {
                                if (k === k1) {
                                    if (curDesc === curC) {
                                        if (SmallJs.isDOMEle(cur)) {
                                            if (cur === curC) {
                                                rel[k] = cur;
                                            }
                                        } else {
                                            if (SmallJs.contain(cur , typeRange)) {
                                                if (this.isSameSet(cur , curC)) {
                                                    rel.push(cur);
                                                }
                                            } else {
                                                if (cur === curC) {
                                                    rel.push(cur);
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (curDesc === curC) {
                                    if (SmallJs.isDOMEle(cur)) {
                                        if (cur === curC) {
                                            rel[k] = cur;
                                        }
                                    } else {
                                        if (SmallJs.contain(cur , typeRange)) {
                                            if (this.isSameSet(cur , curC)) {
                                                rel.push(cur);
                                            }
                                        } else {
                                            if (cur === curC) {
                                                rel.push(cur);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (aDesc === 'Array') {
                    for (i = 0; i < A.length; ++i)
                    {
                        cur     = A[i];
                        curDesc = SmallJs.getValType(cur);

                        for (n = 0; n < B.length; ++n)
                        {
                            curC     = B[n];
                            curCDesc = SmallJs.getValType(curC);

                            if (curDesc === curCDesc) {
                                if (SmallJs.isDOMEle(cur)) {
                                    if (cur === curC) {
                                        rel.push(cur);
                                    }
                                } else {
                                    if (SmallJs.contain(cur , typeRange)) {
                                        if (this.isSameSet(cur , curC)) {
                                            rel.push(cur);
                                        }
                                    } else {
                                        if (cur === curC) {
                                            rel.push(cur);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                return rel;
            };

            // 运算原理
            // 第一次：rel =  参数 1
            // 第二次：rel 和 参数 2 求交集    = rel
            // 第三次：rel 和 参数 3 求交集    = rel
            // 第四次：rel 和 参数 4 求交集    = rel
            // ...
            // 得出最终结果 rel
            for (i = oneArgsDesc === 'Boolean' ? 1 : 0; i < args.length; ++i)
            {
                if (rel === null) {
                    argsDesc = SmallJs.getValType(args[i]);
                    rel		 = args[i];
                    relDesc  = argsDesc;
                } else {
                    rel = getIntersect(rel , args[i] , isStrict);
                }
            }

            return rel;
        } ,

        /*
         * 集合间基本运算：补集
         * 参数 1 是全集
         * 参数 2，3，4...等是他的子集
         * 返回结果：参数 1 相对 其他参数的补集
         * @param  Boolean			   isStrict 是否严格比较，当比较的是对象时有效（比较键名和键值）
         * @param  Mixed(Array|Object) args2
         * @param  Mixed(Array|Object) args3
         * @param  Mixed(Array|Object) args4
         ....
         * @return Mixed(Array|Object)

         * 第二种模式
         * @param  Mixed(Array|Object) args1
         * @param  Mixed(Array|Object) args2
         * @param  Mixed(Array|Object) args3
         ....
         * @return Mixed(Array|Object)
         */
        complementSet: function(){
            var args		 = arguments;
            var typeRange	 = ['Array' , 'Object'];
            var argsDescList = [];
            var tipArr		 = [];
            var self		 = this;
            var rel			 = null;
            var isStrict     = true;
            var argsDesc;
            var i;
            var n;
            var k;
            var k1;
            var cur;
            var curC;
            var curDesc;
            var curCDesc;
            var isRel;
            var sets;
            var partSets;
            var oneArgs;
            var oneArgsDesc;

            // 参数长度为 0
            if (args.length === 0) {
                return false;
            }

            oneArgs     = args[0];
            oneArgsDesc = SmallJs.getValType(oneArgs);

            // 检查所有参数类型是否正确
            for (i = oneArgsDesc === 'Boolean' ? 1 : 0; i < args.length; ++i)
            {
                argsDesc = SmallJs.getValType(args[i]);
                argsDescList.push(argsDesc);

                if (SmallJs.contain(argsDesc , typeRange) === false) {
                    throw new TypeError('参数 ' + (i + 1) + ' 类型错误');
                }
            }

            // 检查所有参数类型是否一致
            for (i = oneArgsDesc === 'Boolean' ? 1 : 0; i < argsDescList.length; ++i)
            {
                for (n = i + 1; n < argsDescList.length; ++n)
                {
                    if (argsDescList[i] !== argsDescList[n]) {
                        throw new TypeError('所有参数类型不一致');
                    }
                }

                break;
            }

            // 参数长度为 1
            if (args.length === 1 && oneArgsDesc === 'Boolean') {
                return false
            }

            if (args.length === 1 && oneArgsDesc !== 'Boolean') {
                return oneArgs;
            }

            isStrict = oneArgsDesc !== 'Boolean' ? true : oneArgs;

            // 全集
            sets  = oneArgsDesc === 'Boolean' ? args[1] : oneArgs;
            // 部分集合
            partSets = SmallJs.toArray(args).slice(oneArgsDesc === 'Boolean' ? 2 : 1);
            partSets = this.unionSet.apply(this , partSets);

            rel = oneArgsDesc === 'Object' ? {} : [];

            if (this.isSameSet(partSets , sets)) {
                return rel;
            }

            if (!this.isSubSet(partSets , sets)) {
                throw new TypeError('参数 1 不是全集');
            }

            if (oneArgsDesc === 'Object') {
                for (k in sets)
                {
                    cur     = sets[k];
                    curDesc = SmallJs.getValType(cur);
                    // 子集中是否包含当前值，默认是包含的
                    isRel   = true;

                    for (k1 in partSets)
                    {
                        curC     = partSets[k1];
                        curCDesc = SmallJs.getValType(curC);

                        if (isStrict) {
                            if (k === k1) {
                                if (curDesc === curCDesc) {
                                    if (SmallJs.isDOMEle(cur) || SmallJs.isDOMEle(curC)) {
                                        if (cur === curC) {
                                            isRel = true;
                                            break;
                                        } else {
                                            isRel = false;
                                        }
                                    } else {
                                        if (SmallJs.contain(curDesc , typeRange)) {
                                            if (this.isSameSet(cur , curC)) {
                                                isRel = true;
                                                break;
                                            } else {
                                                isRel = false;
                                            }
                                        } else {
                                            if (cur === curC) {
                                                isRel = true;
                                                break;
                                            } else {
                                                isRel = false;
                                            }
                                        }
                                    }
                                } else {
                                    isRel = false;
                                }
                            } else {
                                isRel = false;
                            }
                        } else {
                            if (curDesc === curCDesc) {
                                if (SmallJs.isDOMEle(cur) || SmallJs.isDOMEle(curC)) {
                                    if (cur === curC) {
                                        isRel = true;
                                        break;
                                    } else {
                                        isRel = false;
                                    }
                                } else {
                                    if (SmallJs.contain(curDesc , typeRange)) {
                                        if (this.isSameSet(cur , curC)) {
                                            isRel = true;
                                            break;
                                        } else {
                                            isRel = false;
                                        }
                                    } else {
                                        if (cur === curC) {
                                            isRel = true;
                                            break;
                                        } else {
                                            isRel = false;
                                        }
                                    }
                                }
                            } else {
                                isRel = false;
                            }
                        }
                    }

                    // 如果子集中找不到当前值
                    if (isRel === false) {
                        rel[k] = cur;
                    }
                }
            }

            if (oneArgsDesc === 'Array') {
                for (i = 0; i < sets.length; ++i)
                {
                    cur     = sets[i];
                    curDesc = SmallJs.getValType(cur);

                    for (n = 0; n < partSets.length; ++n)
                    {
                        curC     = partSets[n];
                        curCDesc = SmallJs.getValType(curC);

                        if (curDesc === curCDesc) {
                            if (SmallJs.isDOMEle(cur) || SmallJs.isDOMEle(curC)) {
                                if (cur === curC) {
                                    isRel = true;
                                    break;
                                } else {
                                    isRel = false;
                                }
                            } else {
                                if (SmallJs.contain(curDesc , typeRange)) {
                                    if (this.isSameSet(cur , curC)) {
                                        isRel = true;
                                        break;
                                    } else {
                                        isRel = false;
                                    }
                                } else {
                                    if (cur === curC) {
                                        isRel = true;
                                        break;
                                    } else {
                                        isRel = false;
                                    }
                                }
                            }
                        } else {
                            isRel = false;
                        }
                    }

                    if (isRel === false) {
                        rel.push(cur);
                    }
                }
            }

            return rel;

        }
    };

    /*
     * ******************************************************************************************************************************************************
     SmallJs 实例对象继承的原型部分的成分之一，但是又由于拆开描述并不能清晰的表达该部分。所以，采取 构造函数 的方式进行描述，然后归并到 SmallJs 原型对象中
     * ******************************************************************************************************************************************************
     */

    /*
     * Event 事件操作类
     */
    function EventHandler(){
        var thisRange = [window , null , undefined];

        if (SmallJs.contain(this , thisRange) || (!SmallJs.contain(this , thisRange) && this.constructor !== EventHandler)) {
            return new EventHandler();
        }

        this.eventList = [];
    }

    EventHandler.prototype = {
        author: '陈学龙' ,
        version: '1.0' ,
        cTime: '2016/10/25 17:32:00' ,
        constructor: EventHandler ,

        /*
         * 检测某元素上是否已注册某方法
         */
        isBindEvent: function(ele , eventType){
            for (var i = 0; i < this.eventList.length; ++i)
            {
                if (this.eventList[i]['ele'] === ele) {
                    for (var n = 0; n < this.eventList[i]['eventList'].length; ++n)
                    {
                        if (this.eventList[i]['eventList'][n]['eventType'] === eventType) {
                            return this.eventList[i]['eventList'][n]['isLogin'];
                        }
                    }
                }
            }
        } ,

        /*
         * 获取已注册事件的对象列表中当前提供元素所在下标
         */
        getEventObjIdx: function(obj){
            for (var i = 0; i < this.eventList.length; ++i)
            {
                if (this.eventList[i]['ele'] === obj) {
                    return i;
                }
            }

            return false;
        } ,

        /*
         * 获取当前提供元素已注册事件列表
         */
        getEventList: function(obj){
            var idx = this.getEventObjIdx(obj);

            if (idx === false) {
                return false;
            }

            return this.eventList[idx];
        }
    };

    /*
     * ****************************************************************************************************************************************************
     SmallJs 函数的组成部分之一，同属于基础函数库，但直接使用拆开描述并不能清晰的表达该部分，所以采取 构造函数 的方式进行描述，然后归并到 SmallJs 函数上
     * ****************************************************************************************************************************************************
     */

    /*
     * Ajax 操作类
     * ajax 请求都会带有一个 AJAX-REQUEST 请求头
     */
    function Ajax(opt){
        var thisRange = [window , null , undefined];

        if (SmallJs.contain(this , thisRange) || (!SmallJs.contain(this , thisRange) && this.constructor !== Ajax)) {
            return new Ajax(opt);
        }

        if (SmallJs.getValType(opt) === 'Undefined') {
            throw new TypeError('未传入配置参数！');
        }

        this._defaultOpt = {
            headers:   {} ,                          // 发送的请求头部信息 格式： {'Content-Type' : 'text/html; charset=utf-8' , 'Cache-Control' : 'false'}
            method: 'get' ,                          // 请求方法 get | GET | post | POST
            url: '' ,                                // 请求路径
            isAsync: true ,                          // 是否异步
            sendData: null ,                         // 发送的数据
            responseType: '' ,                       // 相应类型
            additionalTimestamp: true , 			 // 是否在 url 末尾追加时间戳
            maxWaitTime: 0 ,                         // 请求：设置超时时间，单位：ms，默认值：0
            withCredentials: true ,					 // 跨域请求是否允许携带 cookie

            // 下载事件
            success: null ,                          // 请求：成功时回调
            error: null ,                            // 请求：失败时回调
            progress: null ,                         // 请求：加载时回调
            load: null ,                             // 请求：加载完成时回调
            timeout: null ,                          // 请求：超时回调
            abort: null ,                            // 请求：中断是回调
            loadstart: null ,						 // 请求：接收到响应的时候触发
            loadend: null , 						 // 请求：响应结束的时候触发（导致结束的原因：error , timeout , load，未知）

            // 上传事件
            uLoad: null ,							 // 上传：上传完成时回调
            uLoadstart: null ,						 // 上传：上传开始时回调
            uTimeout: null ,						 // 上传：上传开始超时回调
            uError: null ,							 // 上传：上传发生错误时回调
            uProgress: null ,						 // 上传：上传中回调
            uLoadend: null ,						 // 上传：上传终止时超时回调（有可能是发生错误而终止、有可能是超时终止...）
            uAbort: null ,							 // 上传：上传中断

            // 相关属性
            isReturnXHR: false ,					 // 是否返回 XHR 对象
            username: '' ,							 // http 验证的用户名
            password: '' ,							 // http 验证的密码
            // isUpload: false ,                        // 上传文件还是下载文件！ 决定了事件时定义在上传对象 还是 在下载对象上！

            // 是否允许携带用于区分普通请求 和 ajax 请求的请求头（标识）
            isAllowAjaxHeader: true
        };

        this._xhr				 = new XMLHttpRequest();
        this._methodRange		 = ['get' , 'post' , 'POST' , 'GET'];
        this._sendDataRange		 = ['String' , 'FormData'];
        this._responseTypeRange	 = ['' , 'text' , 'document' , 'json' , 'blob'];
        this._enctypeRange		 = ['text/plain' , 'application/x-www-form-urlencoded' , 'multipart/form-data'];
        this._headers			 = SmallJs.getValType(opt['headers']) === 'Undefined'				? this._defaultOpt['headers']		: opt['headers'];
        this._method			 = !SmallJs.contain(opt['method'] , this._methodRange)				? this._defaultOpt['method']		: opt['method'];
        this._url				 = !SmallJs.isValidVal(opt['url'])									? this._defaultOpt['url']			: opt['url'];
        this._isAsync			 = SmallJs.getValType(opt['isAsync']) !== 'Boolean'					? this._defaultOpt['isAsync']		: opt['isAsync'];
        this._additionalTimestamp = SmallJs.getValType(opt['additionalTimestamp']) !== 'Boolean'					? this._defaultOpt['additionalTimestamp']		: opt['additionalTimestamp'];
        this._sendData			 = !SmallJs.contain(SmallJs.getValType(opt['sendData']) , this._sendDataRange) ? this._defaultOpt['sendData']		: opt['sendData'];
        this._responseType	 	 = !SmallJs.contain(opt['responseType'] , this._responseTypeRange)  ? this._defaultOpt['responseType']	: opt['responseType'];
        this._maxWaitTime		 = SmallJs.getValType(opt['maxWaitTime']) !== 'Number'				? this._defaultOpt['maxWaitTime']	: opt['maxWaitTime'];
        this._withCredentials		 = SmallJs.getValType(opt['withCredentials']) !== 'Boolean'				? this._defaultOpt['withCredentials']	: opt['withCredentials'];

        // 下载事件
        this._success			 = SmallJs.getValType(opt['success']) !== 'Function'				? this._defaultOpt['success']		: opt['success'];
        this._error				 = SmallJs.getValType(opt['error']) !== 'Function'					? this._defaultOpt['error']			: opt['error'];
        this._progress			 = SmallJs.getValType(opt['progress']) !== 'Function'				? this._defaultOpt['progress']		: opt['progress'];
        this._loadstart			 = SmallJs.getValType(opt['loadstart']) !== 'Function'				? this._defaultOpt['loadstart']		: opt['loadstart'];
        this._load				 = SmallJs.getValType(opt['load']) !== 'Function'					? this._defaultOpt['load']			: opt['load'];
        this._loadend			 = SmallJs.getValType(opt['loadend']) !== 'Function'				? this._defaultOpt['loadend']	    : opt['loadend'];
        this._timeout			 = SmallJs.getValType(opt['timeout']) !== 'Function'				? this._defaultOpt['timeout']		: opt['timeout'];
        this._abort				 = SmallJs.getValType(opt['abort']) !== 'Function'					? this._defaultOpt['abort']			: opt['abort'];

        // 上传事件
        this._uError			 = SmallJs.getValType(opt['uError']) !== 'Function'					? this._defaultOpt['uError']		: opt['uError'];
        this._uProgress			 = SmallJs.getValType(opt['uProgress']) !== 'Function'				? this._defaultOpt['uProgress']		: opt['uProgress'];
        this._uLoadstart		 = SmallJs.getValType(opt['uLoadstart']) !== 'Function'				? this._defaultOpt['uLoadstart']	: opt['uLoadstart'];
        this._uLoad				 = SmallJs.getValType(opt['uLoad']) !== 'Function'					? this._defaultOpt['uLoad']			: opt['uLoad'];
        this._uLoadend			 = SmallJs.getValType(opt['uLoadend']) !== 'Function'				? this._defaultOpt['uLoadend']	    : opt['uLoadend'];
        this._uTimeout			 = SmallJs.getValType(opt['uTimeout']) !== 'Function'				? this._defaultOpt['uTimeout']		: opt['uTimeout'];
        this._uAbort			 = SmallJs.getValType(opt['uAbort']) !== 'Function'					? this._defaultOpt['uAbort']		: opt['uAbort'];

        this._isReturnXHR		 = SmallJs.getValType(opt['isReturnXHR']) !== 'Boolean'				? this._defaultOpt['isReturnXHR']   : opt['isReturnXHR'];

        this._username			 = !SmallJs.isValidVal(opt['username'])								? this._defaultOpt['username']		: opt['username'];
        this._password			 = !SmallJs.isValidVal(opt['password'])								? this._defaultOpt['password']		: opt['password'];

        this._isAllowAjaxHeader = !SmallJs.isValidVal(opt['isAllowAjaxHeader'])								? this._defaultOpt['isAllowAjaxHeader']		: opt['isAllowAjaxHeader'];

        this._run();
    }

    Ajax.prototype = {
        version: '1.0' ,

        cTime: '2016/10/25 17:32:00' ,

        author: '陈学龙' ,

        constructor: Ajax ,

        _getHeader: function(key){
            for (var k in this._headers)
            {
                if (k === key) {
                    return this._headers[k];
                }
            }

            return false;
        } ,

        _setHeader: function(key , val){
            this._headers[key] = val;
        } ,

        _removeHeader: function(key){
            for (var k in this._headers)
            {
                if (k === key) {
                    delete this._headers[k];
                }
            }

            return false;
        } ,

        // 获取 XMLHttpRequest 对象
        get: function(){
            return this._xhr;
        } ,

        _init: function(){
            // 值修正
            this._method = this._method.toLowerCase();

            // 是否追加时间戳，防止请求被缓存
            if (this._additionalTimestamp) {
                var time = new Date().getTime();

                if (this._url.lastIndexOf('?') === -1) {
                    this._url += '?';
                } else {
                    this._url += '&';
                }

                this._url += '_time=' + time;
            }

            // 设置请求头
            if (this._method === 'post' && SmallJs.getValType(this._sendData) !== 'FormData') {
                if (this._getHeader('Content-Type') !== 'application/x-www-form-urlencoded') {
                    this._setHeader('Content-Type' , 'application/x-www-form-urlencoded');
                }
            }

            if (this._method === 'post' && SmallJs.getValType(this._sendData) === 'FormData') {
                if (this._getHeader('Content-Type') !== false) {
                    this._removeHeader('Content-Type');
                }
            }

            // 追加 AJAX 请求标识符头部
            // 这里请求设置有一个要求！不允许使用 _（下划线） ！！只能使用 - （中划线）
            if (this._isAllowAjaxHeader) {
                this._setHeader('AJAX-REQUEST' , true);
            }
        } ,

        _open: function(){
            /**
             * 支持使用了验证的请求
             */
            this._xhr.open(this._method , this._url , this._isAsync , this._username , this._password);


        } ,

        // 设置 AJAX 请求头
        _setRequestHeader: function(){
            for (var key in this._headers)
            {
                this._xhr.setRequestHeader(key , this._headers[key]);
            }
        } ,

        // 设置 AJAX 响应类型
        _setResponseType: function(){
            this._xhr.responseType = this._responseType;
        } ,

        // 设置请求超时时间
        _setTimeout: function(){
            this._xhr.timeout = this._maxWaitTime;
        } ,

        // 设置请求事件
        _setEvent: function(){
            var self = this;

            // 响应
            SmallJs(this._xhr).loginEvent('readystatechange' , function(){
                /**
                 * 针对 readyState 代码含义
                 * 0 未 open，未 send
                 * 1 已 open，未 send
                 * 2 已 send
                 * 3 正在下载响应体
                 * 4 请求完成
                 *
                 * 针对 status 的代码的含义
                 * 如果 status !== 200 ，则表示发生了错误，否则表示传输完成
                 * 可能是 0 （canceld），500 服务器内部错误等.....
                 *
                 */
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        if (SmallJs.getValType(self._success) === 'Function') {
                            if (self._isReturnXHR) {
                                self._success(self._xhr);
                            } else {
                                // 可能是 responseText || responseXML
                                self._success(self._xhr.response);
                            }
                        }
                    } else {
                        // 发生未知错误
                        if (SmallJs.getValType(self._error) === 'Function') {
                            self._error();
                        }
                    }
                }
            } , false , false);

            /*** 下载事件 ***/

            // error
            if (SmallJs.getValType(this._error) === 'Function') {
                SmallJs(this._xhr).loginEvent('error' , self._error , false , false);
            }

            // timeout
            if (SmallJs.getValType(this._timeout) === 'Function') {
                SmallJs(this._xhr).loginEvent('timeout' , this._timeout , false , false);
            }

            // loadstart
            if (SmallJs.getValType(this._loadstart) === 'Function') {
                SmallJs(this._xhr).loginEvent('loadstart' , this._loadstart , false , false);
            }

            // progress
            if (SmallJs.getValType(this._progress) === 'Function') {
                SmallJs(this._xhr).loginEvent('timeout' , this._progress , false , false);
            }

            // load
            if (SmallJs.getValType(this._load) === 'Function') {
                SmallJs(this._xhr).loginEvent('load' , this._load , false , false);
            }

            // loadend
            if (SmallJs.getValType(this._loadend) === 'Function') {
                SmallJs(this._xhr).loginEvent('loadend' , this._loadend , false , false);
            }

            // abort
            if (SmallJs.getValType(this._abort) === 'Function') {
                SmallJs(this._xhr).loginEvent('abort' , this._abort , false , false);
            }

            /*
             * 上传事件:
             * onloadstart
             * onprogress
             * onabort
             * onerror
             * onload
             * ontimeout
             * onloadend
             */
            // error
            if (SmallJs.getValType(this._uError) === 'Function') {
                SmallJs(this._xhr.upload).loginEvent('error' , self._uError , false , false);
            }

            // timeout
            if (SmallJs.getValType(this._uTimeout) === 'Function') {
                SmallJs(this._xhr.upload).loginEvent('timeout' , this._uTimeout , false , false);
            }

            // loadstart
            if (SmallJs.getValType(this._uLoadstart) === 'Function') {
                // console.log('load start');
                SmallJs(this._xhr.upload).loginEvent('loadstart' , this._uLoadstart , false , false);
            }

            // progress
            if (SmallJs.getValType(this._uProgress) === 'Function') {
                // console.log('你正在定义上传进度事件！' , this._uProgress);
                SmallJs(this._xhr.upload).loginEvent('progress' , this._uProgress , false , false);
            }

            // load
            if (SmallJs.getValType(this._uLoad) === 'Function') {
                console.log('load start');
                SmallJs(this._xhr.upload).loginEvent('load' , this._uLoad , false , false);
            }


            // loadend
            if (SmallJs.getValType(this._uLoadend) === 'Function') {
                SmallJs(this._xhr.upload).loginEvent('loadend' , this._uLoadend , false , false);
            }

            // abort
            if (SmallJs.getValType(this._uAbort) === 'Function') {
                SmallJs(this._xhr.upload).loginEvent('abort' , this._uAbort , false , false);
            }
        } ,

        _send: function(){
            if (this._withCredentials) {
                this._xhr.withCredentials = this._withCredentials;
            }

            if (this._method === 'get') {
                // get 方法在 url 中发送数据
                this._xhr.send(null);
            } else {
                // post 方法在 send 方法参数中发送数据
                this._xhr.send(this._sendData);
            }
        } ,

        _run: function(){
            // 初始化参数
            this._init();
            // 打开资源
            this._open();
            // 请求头必须要在 xhr open 之后设置
            this._setRequestHeader();
            // 响应类型必须要在 xhr send 之前设置
            this._setResponseType();
            // 设置请求超时时间
            this._setTimeout();
            // 设置事件
            this._setEvent();
            // 发送数据
            this._send();
        }
    };

    /*
     * 队列操作类
     * 只允许存放 原始值 + 数组 + 对象 + 元素
     * 不允许存放 函数，正则对象...等
     */
    function Queue(){
        var thisRange = [undefined , null];

        if (SmallJs.contain(this , thisRange) || (!SmallJs.contain(this , thisRange) && this.constructor !== Queue)) {
            return new Queue();
        }

        this._arr = [];
    }

    Queue.prototype = {
        version: '1.0' ,

        constructor: Queue ,

        author: '陈学龙' ,

        cTime: '2016/10/27 00:46:00' ,

        length: 0 ,

        get: function(){
            return this._arr;
        } ,

        first: function(){
            return this._arr[0];
        } ,

        last: function(){
            return this._arr[this.length];
        } ,

        jump: function(idx){
            return this._arr[idx];
        } ,

        push: function(){
            for (var i = 0; i < arguments.length; ++i)
            {
                this._arr.push(arguments[i]);
                this.length++;
            }
        } ,

        unshift: function(){
            for (var i = 0; i < arguments.length; ++i)
            {
                this._arr.unshift(arguments[i]);
                this.length++;
            }
        } ,

        shift: function(){
            this.length--;
            return this._arr.shift();
        } ,

        pop: function(){
            this.length--;
            return this._arr.pop();
        } ,

        splice: function(){
            var sIdx	  = parseInt(arguments[0]);
            var removeLen = parseInt(arguments[1]);
            var removeArr = null;

            if (arguments.length === 2) {
                this.length -= removeLen;
                return this._arr.splice(sIdx , removeLen);
            }

            for (var i = 2; i < arguments.length; ++i)
            {
                if (i === 2) {
                    this.length -= removeLen;
                    removeArr = this._arr.splice(sIdx , removeLen , arguments[i]);
                    sIdx = Math.max(0 , sIdx - removeLen + 1);
                } else {
                    removeArr.push(this._arr.splice(sIdx , 0 , arguments[i]));
                    sIdx++;
                    this.length++;
                }
            }

            return removeArr;
        } ,

        clear: function(){
            this._arr   = [];
            this.length = 0;
        } ,

        isEmpty: function(){
            if (this._arr.length === 0) {
                return true;
            }

            return false;
        } ,

        getIdx: function(unit){
            var typeRange = ['Array' , 'Object' , 'element'];

            for (var i = 0; i < this._arr.length; ++i)
            {
                if (!SmallJs.contain(SmallJs.getValType(unit) , typeRange)) {
                    if (this._arr[i] === unit) {
                        return i;
                    } else {
                        if (SmallJs.set.isSameSet(this._arr[i] , unit)) {
                            return i;
                        }
                    }
                }
            }

            throw new Error('未找到单元对应的下标!');
        } ,

        getUnit: function(idx){
            return this._arr[idx];
        } ,
    };

    SmallJs.event	    = new EventHandler();
    SmallJs.ajax		= Ajax;
    SmallJs.queue		= Queue;
    SmallJs.set		    = new Set();
    SmallJs.click		= SmallJs.getBrowser() === 'mobile' ? 'touchstart' : 'click';
    SmallJs.mousedown	= SmallJs.getBrowser() === 'mobile' ? 'touchstart' : 'mousedown';
    SmallJs.mousemove	= SmallJs.getBrowser() === 'mobile' ? 'touchmove'  : 'mousemove';
    SmallJs.mouseup		= SmallJs.getBrowser() === 'mobile' ? 'touchend'   : 'mouseup';

    SmallJs._setApiName = function(){
        if (SmallJs.getValType(window[defaultApiName]) !== 'Undefined') {
            window[defaultApiName] = SmallJs;
        } else {
            window['_' + defaultApiName] = window[defaultApiName];
            window[defaultApiName]  = SmallJs;
        }
    };

    /*
     * ********
     变量定义
     * ********
     */
    var document         = window.document;
    var defaultApiName   = 'G';
    var q				 = new Queue();
    SmallJs.q            = q;

    // 预定义事件类型：支持移动端
    var browser   = SmallJs.getBrowser();
    var click     = browser === 'mobile' ? 'touchstart' : 'click';
    var mouseDown = browser === 'mobile' ? 'touchstart' : 'mousedown';
    var mouseMove = browser === 'mobile' ? 'touchmove'  : 'mousemove';
    var mouseUp   = browser === 'mobile' ? 'touchend'   : 'mouseup';

    /*
     * **********
     初始化框架
     * **********
     */

    // 整合 事件操作类到 SmallJs 原型中
    SmallJs.mergeObj(false , true , true , SmallJs.pro , new EventHandler());

    // 暴露对外操作 API
    SmallJs._setApiName();


})(typeof window !== 'undefined' ? window : this);