/**
 * authro 陈学龙 2017-09-12 15:18:00
 * 多标签页
 */

/**
 * 多标签页
 * 功能点介绍：
 * 1. 宽度缩放，规则：
 *      1.1 标签数量 * 单标签最大长度小于容器宽度，设置为单标签最大宽度
 *      1.2 单标签数量 * 单标签最大长度大于容器宽度，单标签长度 = 容器宽度 / 标签数量
 * 2. 标签拖拽规则
 *      2.1 鼠标在标签内释放的：
 *          2.1.1 单纯的移动标签，判定规则
 *              如果标签页进入另一个标签页内部长度超过 2/5，切换位置
 *      2.2 鼠标在标签外释放的
 *          2.2.1 关闭当前拖拽的标签
 *          2.2.2 获取他的链接，打开新的页面
 */
var MultipleTabs = (function(){
    'use strict';

    function MultipleTabs(dom , opt){
        var thisRange = [undefined , null , window];

        if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== MultipleTabs) {
            return new MultipleTabs(dom , opt);
        }

        if (!G.isDOMEle(dom)) {
            throw new TypeError('参数 1 类型错误');
        }

        // 默认设置
        this._defaultOpt = {
            // 新建标签后回调
            created: null ,
            // 标签页删除后回调函数
            deleted: null ,
            // 标签点击后回调
            click: null ,
            // 默认描述
            ico: '' ,
            defaultTitle: '新标签页'
        };

        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

        // 元素容器
        this._con = G(dom);

        this._ico     = G.getValType(opt['ico'])     !== 'String'   ? this._defaultOpt['ico']       : opt['ico'];
        this._created = G.getValType(opt['created']) !== 'Function' ? this._defaultOpt['created']   : opt['created'];
        this._deleted = G.getValType(opt['deleted']) !== 'Function' ? this._defaultOpt['deleted']   : opt['deleted'];
        this._click   = G.getValType(opt['click'])   !== 'Function' ? this._defaultOpt['click']     : opt['click'];

        this._run();
    }

    MultipleTabs.prototype = {
        authro: '陈学龙' ,
        version: '1.0' ,
        c_time: '2017-09-12 15:18:00' ,
        constructor: MultipleTabs ,

        _initStaticArgs: function(){
            // 元素相关
            this._multipleTabs = G('.multiple-tabs' , this._con.get()).first();
            this._tabsList     = G('.tabs-list'     , this._multipleTabs.get()).first();
            this._itemList     = G('.item-list'     , this._tabsList.get()).first();

            // 参数相关
            this._singleTabMaxW = 250;
            this._singleTabMinW = 0;

            // 设置进入当前标签进入其他标签的长度占标签长度的比率
            this._judgeRatio = 0.4;

            // 当前显示的标签页类名
            this._focus = 'focus';
        } ,

        _initDynamicArgs: function(){
            // 容器的最大宽度
            this._multipleTabsW = this._multipleTabs.getEleW('content-box');
            this._tabsListW     = this._multipleTabsW;
            this._itemSet   = G('.item' , this._itemList.get());
            this._closeSet  = G('.close' , this._itemList.get());

            // 标签数量
            this._tabsNum   = this._itemSet.length;

            // 当前标签数量 * singleTabMaxW 合计占据的长度
            this._tabsMaxW     = this._tabsNum * this._singleTabMaxW;

            // 计算出单标签的长度
            this._singleTabW = Math.floor(this._tabsMaxW > this._tabsListW ? Math.max(this._singleTabMinW , this._tabsListW / this._tabsNum) : this._singleTabMaxW);

            // 切换是否停止的标志
            this._isStop = true;
        } ,

        _initStaticHTML: function(){

        } ,

        _initDynamicHTML: function(){

        } ,

        _initStatic: function(){

        } ,

        _initDynamic: function(){
            // 设置 explain 的样式
            this._resetExplainStyle();
        } ,

        /**
         * 判断片段内是否有标签
         */
        _hasTab: function(){
            var index   = this.getIndex();
            var itemSet =  G('.item' , this._itemList.get());
            var tabsTW  = itemSet.length * this._singleTabW;

            if (tabsTW <= (index - 1) * this._tabsListW) {
                return false;
            }

            return true;
        } ,

        // 当前项是否是选中项
        _isFocusItem: function(item){
            item = G(item);

            if (item.hasClass('focus')) {
                return true;
            }

            return false;
        } ,

        // 删除指定标签
        deleteTab: function(item){
            item     = G(item);
            var self = this;
            var curW = item.getEleW('border-box');
            var endW = 0;
            var curOpacity = parseFloat(item.getStyleVal('opacity'));
            var endOpacity = 0;

            item.animate({
                carTime: 120 ,
                json: [
                    {
                        attr: 'width' ,
                        sVal: curW ,
                        eVal: endW
                    } ,
                    {
                        attr: 'opacity' ,
                        sVal: curOpacity ,
                        eVal: endOpacity
                    }
                ] ,
                fn: function(){
                    // 切换标签
                    if (self._isFocusItem(item.get())) {
                        var nextTab = item.get().nextElementSibling;

                        if (G.getValType(nextTab) === 'Null') {
                            var prevTab = item.get().previousElementSibling;

                            if (G.getValType(prevTab) !== 'Null') {
                                self.focus(prevTab);
                            }
                        } else {
                            self.focus(nextTab);
                        }
                    }

                    var identifier = self.getID(item.get());

                    item.get().parentNode.removeChild(item.get());

                    self._initDynamicArgs();
                    self._initDynamic();

                    if (G.getValType(self._deleted) === 'Function') {
                        self._deleted.call(self , item.get() , identifier);
                    }
                }
            });
        } ,

        _closeEvent: function(event){
            event.stopPropagation();

            // close 元素
            var tar     = G(event.currentTarget);
            var item    = tar.parentFind({
                tagName: 'div' ,
                className: 'item'
            } , this._itemList.get() , false , true).not({
                className: 'item-list'
            }).first();

            this.deleteTab(item.get());
        } ,

        _doubleClickItemEvent: function(event){
            event.stopPropagation();

            // close 元素
            var tar = G(event.currentTarget);

            this.deleteTab(tar.get());
        } ,

        // 高亮显示给定项
        highlightTab: function(item){
            item    = G(item);

            var i   = 0;
            var cur = null;

            for (; i < this._itemSet.length; ++i)
            {
                cur = G(this._itemSet.get()[i]);

                if (cur.get() === item.get()) {
                    cur.addClass('focus');
                } else {
                    cur.removeClass('focus');
                }
            }
        } ,

        /**
         * 获取标签标识符
         */
        getID: function(item){
            item = G(item);

            return item.data('_identifier');
        } ,

        /**
         * 生成标签唯一ID
         */
        genID: function(){
            return G.randomArr(100 , 'mixed').join('');
        } ,

        /*
         * 创建标签
         * opt = {
         *      text: '描述文本' ,
         *      ico: '描述图片' ,
         *      identifier: '标识符'
         * }
         */
        create: function(opt){
            var self       = this;
            var defaultOpt = {
                text: this._defaultOpt['defaultTitle'] ,
                ico: this._ico ,
                attr: {}
            };

            if (G.getValType(opt) === 'Undefined') {
                opt = defaultOpt;
            }

            opt['text']   = G.getValType(opt['text']) !== 'String' ? defaultOpt['text'] : opt['text'];
            opt['ico']    = G.getValType(opt['ico']) !== 'String' ? defaultOpt['ico'] : opt['ico'];
            opt['attr']   = !G.isObj(opt['attr']) ? defaultOpt['attr'] : opt['attr'];

            var initStyle = {
                width: 0 ,
                opacity: 0
            };

            var identifier = this.genID();
            var div = document.createElement('div');
                div = G(div);

                div.addClass('item');

                div.setAttr('_identifier' , identifier);

            // 设置数据集属性
            for (var key in opt['attr'])
            {
                div.setAttr(key , opt['attr'][key]);
            }

            var html = [];

                html.push();
                html.push('         <div class="ico"><img src="' + opt['ico'] + '" class="pic ' + (opt['ico'] === '' ? 'hide' : '') + '" /></div>');
                html.push('         <div class="explain">' + opt['text'] + '</div>');
                html.push('         <div class="close">');
                html.push('             <div class="positive"></div>');
                html.push('             <div class="negative"></div>');
                html.push('         </div>');

            div.get().innerHTML = html.join('');

            this._itemList.get().appendChild(div.get());

            // 参数重新初始化
            this._initDynamicArgs();
            this._initDynamic();

            div.css({
                width: initStyle['width'] + 'px' ,
                opacity: initStyle['opacity']
            });

            // 切换显示到最新片段（标签拖拽的情况下，不允许切换 index）
            // this.switch(this._pos.length);

            // 高亮显示当前项
            this.highlightTab(div.get());

            var curW = initStyle['width'];
            var endW = this._singleTabW;
            var curOpacity = initStyle['opacity'];
            var endOpacity = 1;

            div.animate({
                carTime: 120 ,
                json: [
                    {
                        attr: 'width' ,
                        sVal: curW ,
                        eVal: endW
                    } ,
                    {
                        attr: 'opacity' ,
                        sVal: curOpacity ,
                        eVal: endOpacity
                    }
                ] ,
                fn: function(){
                    self.defineItemEvent(div.get());

                    if (G.getValType(self._created) === 'Function') {
                        self._created.call(self , div.get() , identifier);
                    }
                }
            });
        } ,

        /**
         * 标签点击事件
         */

        // 重新调整所有现存的 item 内 explain 的相关值
        _resetExplainStyle: function(){
            var i       = 0;
            var cur     = null;
            var ico     = null;
            var explain = null;
            var close   = null;
            var icoW    = 0;
            var explainW = 0;
            var explainML = 0;
            var explainMR = 0;
            var closeW = 0;

            for (; i < this._itemSet.length; ++i)
            {
                cur     = G(this._itemSet.get()[i]);
                ico     = G('.ico'      , cur.get()).first();
                explain = G('.explain'  , cur.get()).first();
                close   = G('.close'    , cur.get()).first();

                icoW    = ico.getEleW('content-box');
                closeW  = close.getEleW('content-box');
                explainML = icoW + 10;
                explainMR = closeW + 15;
                explainMR = close.hasClass('hide') ? 15 : explainMR ;
                explainW = this._singleTabW - explainML - explainMR;

                cur.css({
                    width: this._singleTabW + 'px'
                });

                explain.css({
                    width: explainW + 'px'
                });
            }
        } ,

        /**
         * 项点击事件
         */
        focus: function(item){
            item = G(item);

            this.highlightTab(item.get());

            var identifier = this.getID(item.get());

            if (G.getValType(this._click) === 'Function') {
                this._click.call(this , item.get() , identifier);
            }
        } ,

        /**
         * 项点击事件（切换当前标签）
         */
        _itemClickEvent: function(event){
            var tar = G(event.currentTarget);

            this.focus(tar.get());
        } ,

        // 获取 tab 可移动范围
        getTabMoveRange: function(tab){
            tab = G(tab);

            var clientW = document.documentElement.clientWidth;
            var extraL  = this._multipleTabs.getDocOffsetVal('left');
            var extraR  = clientW - extraL - this._multipleTabsW;

            var w       = tab.getEleW('border-box');
            var l       = tab.getDocOffsetVal('left');
            var minL    = -(l - extraL);
            var maxL    = clientW - extraL - w - extraR;

            return {
                minL: minL ,
                maxL: maxL
            }
        } ,

        // 鼠标点击后触发事件（拖动标签时）
        _itemMousedownEvent: function(event){
            var item = G(event.currentTarget);

            this._canDrag = true;

            this._tabSX = event.clientX;
            this._tabSY = event.clientY;
            this._tabSL = item.getCoordVal('left');
            this._tabST = item.getCoordVal('top');
            this._range   = this.getTabMoveRange(item.get());
            this._moveDOM = item;

            // 选中
            this.focus(item.get());

            // 设置最高层级
            item.css({
                zIndex: '100000000'
            });
        } ,

        // 鼠标移动后触发事件（拖动标签时）
        _itemMousemoveEvent: function(event){
            if (this._canDrag) {
                var item    = this._moveDOM;

                // 拖动标签
                this._tabEX = event.clientX;
                this._tabEY = event.clientY;

                var ox = this._tabEX - this._tabSX;
                var oy = this._tabEY - this._tabSY;

                var el = this._tabSL + ox;
                var et = this._tabST + oy;

                el = Math.max(this._range['minL'] , Math.min(this._range['maxL'] , el));

                /**
                 * 只进行左右移动，不允许上下移动
                 */
                item.css({
                    left: el + 'px' ,
                    // top: et + 'px'
                });

                // 监听
                this.prevListen(item.get());
                this.nextListen(item.get());
            }
        } ,

        // 位置还原
        originPosition: function(tab){
            tab = G(tab);

            var curLeft = tab.getCoordVal('left');
            var curTop  = tab.getCoordVal('top');
            var endLeft = 0;
            var endTop  = 0;

            tab.animate({
                carTime: 120 ,
                json: [
                    {
                        attr: 'left' ,
                        sVal: curLeft ,
                        eVal: endLeft
                    } ,
                    {
                        attr: 'top' ,
                        sVal: curTop ,
                        eVal: endTop
                    } ,
                ]
            });
        } ,

        // 位置判定
        judgePosition: function(tab , index){
            tab = G(tab);
            index = Math.max(0 , index - 1);

            var curLeft = tab.getCoordVal('left');
            // var tabW = tab.getEleW('border-box');
            var prev = -(index * this._singleTabW + this._singleTabW / 3);
            var next = -prev;

            if (curLeft <= prev) {
                return 'prev';
            }

            if (curLeft >= next) {
                return 'next';
            }

            return 'origin';
        } ,

        /**
         * 给定集合，设定 left = 0，top = 0
         */
        originRelativeVal: function(set){
            var i   = 0;
            var cur = 0;

            for (; i < set.length; ++i)
            {
                cur = G(set[i]);

                cur.css({
                    left: '0px' ,
                    top: '0px'
                });
            }
        } ,

        // 切换到上一个
        prevPosition: function(tab){
            tab = G(tab);

            var prevSiblings = tab.siblingTopFind({
                tagName: 'div' ,
                className: 'item'
            } , false , true);

            if (prevSiblings.length === 0) {
                this.originPosition(tab.get());

                return ;
            }

            var curLeft = tab.getCoordVal('left');
            var count   = Math.ceil(Math.abs(curLeft / this._singleTabW));
            var range   = -((count - 1) * this._singleTabW + this._singleTabW * 1 / 3);
            var index   = curLeft < range ? count - 1 : count - 2;

            if (index < 0) {
                this.originPosition(tab.get());

                return ;
            }

            var prev = G(prevSiblings.get()[index]);
            // var prev = G(prevSiblings.get()[0]);

            // 移动 DOM 元素
            G.insertBefore(tab.get() , prev.get());

            tab.css({
                left: '0px' ,
                top: '0px'
            });

            prev.css({
                left: '0px' ,
                top: '0px'
            });

            this.originRelativeVal(prevSiblings.get());
        } ,

        // 切换到下一个
        nextPosition: function(tab){
            tab = G(tab);

            var nextSiblings = tab.siblingBtmFind({
                tagName: 'div' ,
                className: 'item'
            } , false , true);

            if (nextSiblings.length === 0) {
                this.originPosition(tab.get());

                return ;
            }

            var curLeft = tab.getCoordVal('left');
            var count   = Math.ceil(Math.abs(curLeft / this._singleTabW));
            var range   = (count - 1) * this._singleTabW + this._singleTabW * 1 / 3;
            var index   = curLeft > range ? count - 1 : count - 2;

            if (index < 0) {
                this.originPosition(tab.get());

                return ;
            }

            var next = G(nextSiblings.get()[index]);

            // 交换 DOM 元素
            G.insertAfter(tab.get() , next.get());

            tab.css({
                left: '0px' ,
                top: '0px'
            });

            next.css({
                left: '0px' ,
                top: '0px'
            });

            this.originRelativeVal(nextSiblings.get());
        } ,

        /**
         * 前置元素移动监听
         */
        prevListen: function(tab) {
            tab = G(tab);

            var prevSiblings = tab.siblingTopFind({
                tagName: 'div',
                className: 'item'
            }, false, true);

            if (prevSiblings.length === 0) {
                return ;
            }

            var i       = 0;
            var prev    = null;
            var endVal  = null;

            for (; i < prevSiblings.length; ++i)
            {
                prev = G(prevSiblings.get()[i]);

                var type = this.judgePosition(tab.get() , i + 1);

                var endVal = 0;

                if (type === 'prev') {
                    endVal = this._singleTabW;
                }

                prev.css({
                    left: endVal + 'px'
                });
            }
        } ,

        /**
         * 下一个元素移动
         */
        nextListen: function(tab){
            tab = G(tab);

            var nextSiblings = tab.siblingBtmFind({
                tagName: 'div',
                className: 'item'
            }, false, true);

            if (nextSiblings.length === 0) {
                return ;
            }

            var i       = 0;
            var next    = null;
            var endVal  = null;

            for (; i < nextSiblings.length; ++i)
            {
                next = G(nextSiblings.get()[i]);

                var type = this.judgePosition(tab.get() , i + 1);

                var endVal = 0;

                if (type === 'next') {
                    endVal = -this._singleTabW;
                }

                next.css({
                    left: endVal + 'px'
                });
            }
        } ,

        /**
         * 确定位置
         */
        determinePosition: function(){
            // 最终确定位置
            var type = this.judgePosition(this._moveDOM.get() , 1);

            if (type === 'next') {
                this.nextPosition(this._moveDOM.get());
            }

            if (type === 'prev') {
                this.prevPosition(this._moveDOM.get());
            }

            if (type === 'origin') {
                this.originPosition(this._moveDOM.get());
            }

            this._moveDOM.css({
                zIndex: 'auto'
            });
        } ,

        // 鼠标松开后触发事件（拖动标签时）
        _itemMouseupEvent: function(event){
            this._canDrag = false;

            try {
                this.determinePosition();
            } catch(err) {
                // console.log('元素并未移动!' , err);
            }
        } ,

        // 定义 item 相关事件
        defineItemEvent: function(item){
            item = G(item);

            /**
             * 关闭标签事件
             */
            var close = G('.close' , item.get()).first();

            item.loginEvent('dblclick' , this._doubleClickItemEvent.bind(this) , true , false);
            item.loginEvent('click' , this._itemClickEvent.bind(this) , true , false);
            close.loginEvent('click' , this._closeEvent.bind(this) , true , false);

            // 标签移动事件
            item.loginEvent('mousedown' , this._itemMousedownEvent.bind(this) , true , false);
        } ,

        defineDeleteEvent: function(close){
            close  = G(close);

            var item = close.parentFind({
                tagName: 'div' ,
                className: 'item'
            } , this._multipleTabs.get() , false , true).not({
                className: 'item-list'
            }).first();

            close.loginEvent('click' , this._closeEvent.bind(this) , true , false);
        } ,

        setTabTitle: function(item , title){
            item = G(item);

            var explain = G('.explain' , item.get()).first();

            // 设置标签
            explain.get().textContent = title === '' ? this._defaultOpt['defaultTitle'] : title;
        } ,

        // 重新调整
        resize: function(){
            this._initDynamicArgs();
            this._initDynamic();
        } ,

        _defineEvent: function(){
            var i   = 0;
            var cur = null;
            var win = G(window);

            for (i = 0; i < this._closeSet.length; ++i)
            {
                cur = G(this._closeSet.get()[i]);

                this.defineDeleteEvent(cur.get());
            }

            this._itemSet.loginEvent('dblclick' , this._doubleClickItemEvent.bind(this) , true , false);
            this._itemSet.loginEvent('click' , this._itemClickEvent.bind(this) , true , false);

            win.loginEvent('mousemove'  , this._itemMousemoveEvent.bind(this) , true , false);
            win.loginEvent('mouseup'    , this._itemMouseupEvent.bind(this) , true , false);
            win.loginEvent('resize'     , this.resize.bind(this) , true , false);
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

    return MultipleTabs;
})();