/*
 * author 陈学龙 2017-09-18 14:55:00
 * 仅支持本地图片上传
 * 进度条显示 + 上传速度 + 单张串行上传 + 可终止上传中的图片
 * 少量图片并行上传（<= 5）
 * 多张图片串行上传（> 5）
 *
 * 由于文件可以是追加的方式添加，所以可能会碰到不同目录下的重名文件
 * 但是由于文件内容不一致，所以，不能单纯的根据文件名重名来过滤文件
 *
 * 并行添加：
 * 1. 添加图片项
 * 2. 定义图片项事件
 * 	2.1 定义删除事件
 * 3. 可选设置上传选项
 * 3. 上传事件
 *
 * 串行添加：
 * 1. 添加图片项
 * 2. 定义图片项事件
 * 	2.1 删除事件
 * 	2.2 取消事件（在上传开始后显示，结束后移除）
 * 3. 可选设置上传选项（同并行）
 * 4. 上传事件
 *
 * 模式切换的两种途径（单项）：
 * 并行添加=》并行 => 串行
 * 串行删除=》串行 => 并行
 */
var UploadImages = (function(){
	'use strict';
	
	function UploadImages(con , opt){
		var thisRange = [undefined , null , window];

		if (G.contain(this , thisRange) || !G.contain(this , thisRange) && this.constructor !== UploadImages) {
			return new UploadImages(con , opt);
		}

		// 图片初始化，直接在图片列表中，填充 img 标签即可
		this._defaultOpt = {
			url: '' ,								// 请求链接
			callback: null ,						// 上传完成后的回调函数
			field: 'images' ,						// 待上传图片的表单字段名称：默认是 upload_images
			pluginUrl: '' ,
			mode: 'append' ,						// 默认模式是追加 append | override
			multiple: true ,						// 单选 | 多选，默认多选
			success: null ,							// 收到后台响应后调用的回调函数（多张图片，则每次都会调用）
			uLoadStart: null ,						// 上传开始时调用的回调函数
			uProgress: null ,						// 上传进行时调用的回调函数
			uLoadEnd: null , 						// 上传结束时调用的回调函数
			split: 1 ,								// 自动切换上传方式的图片数量，例如这边默认：5，表示 <=5 则采用并行上传（每张图片发起一个请求），>5 则采取串行，一张张上传.
		};

        // 设置项
        if (G.getValType(opt) === 'Undefined') {
            opt = this._defaultOpt;
        }

		// 支持的模式
		// override 覆盖
		// append 追加
		this.modeRange = ['override' , 'append'];

		// 相关元素
		this._con				= G('.upload-images'		, con).first();
		this._initShowPicList   = G('.init-show-pic-list'	, this._con.get()).first();
		this._previewPics		= G('.preview-pics'			, this._con.get()).first();
		this._uploadPicList		= G('.upload-pic-list'		, this._con.get()).first();
		this.uploadInput	= G('.upload-pics-input'	, this._con.get()).first();
		this._selectedCount		= G('.selected-count'		, this._con.get()).first();
		this.clearSelected		= G('.clear-selected'		, this._con.get()).first();
		this.uploadPicBtn		= G('.upload-pic-btn' 		, this._con.get()).first();

        this._uploadTitle		= G('.upload-title'			, this._uploadPicList.get()).first();
        this._picList			= G('.pic-list'				, this._uploadPicList.get()).first();
        this._listBody			= G('.list-body'			, this._picList.get()).first();
		this.clearSelectedPic   = G('.pic' 					, this.clearSelected.get()).first();

		// 设置项
        this._url 				= G.getValType(opt['url']) === 'String' ? opt['url'] : this._defaultOpt['url'];
        this._pluginUrl 			= G.getValType(opt['pluginUrl']) === 'String' ? opt['pluginUrl'] : this._defaultOpt['pluginUrl'];
        this._field 	= G.getValType(opt['field']) === 'String' ? opt['field'] : this._defaultOpt['field'];
        this._multiple 				= G.getValType(opt['multiple']) === 'Boolean' ? opt['multiple'] : this._defaultOpt['multiple'];
        this._initPicList 			= G.getValType(opt['initPicList']) === 'Array' ? opt['initPicList'] : this._defaultOpt['initPicList'];
        this._callback 				= opt['callback'];
        this._success 				= opt['success'];
        this._uLoadStart 			= opt['uLoadStart'];
        this._uLoadEnd 				= opt['uLoadEnd'];
        this._mode 				= G.contain(opt['mode'] , this.modeRange) ? opt['mode'] : this._defaultOpt['mode'];
        this._split 				= G.getValType(opt['split']) === 'Number' ? opt['split'] : this._defaultOpt['split'];

		this.run();
	};

	UploadImages.prototype = {
		constructor: UploadImages ,

		_initStaticHTML: function(){} ,

		_initStaticArgs: function(){
            // 完整添加的图片列表
            this._picFileList				= [];
            // 完整上传成功的图片列表
            this._succUploadPicFileList		= [];
            // 完整上传失败的图片列表
            this._failedUploadPicFileList 	= [];
            // 完整取消上传的图片列表
            this._cancelUploadPicFileList 	= [];
            // 单次上传成功的图片数量
            this._tempSuccUploadPicFileList = [];
            // 单次上传失败的图片数量
			this._tempFailedUploadPicFileList = [];
			// 单次上传取消上传的图片数量
			this._tempCancelUploadPicFileList = [];
            // 单次上传待上传的图片列表
            this._uploadedList			  	= [];

            // 支持的图片类型
            this._imageType			= ['image/jpeg' , 'image/png' , 'image/gif'];

			// 图片源
			this._uploadPicBtnPicSrc 	= this._pluginUrl + 'images/upload_images.png';
			this._clearSelectedPicSrc 	= this._pluginUrl + 'images/clear_selected.png';
		} ,

		_initStatic: function(){
            // 初始化设置 input 的图片按钮
            this.uploadPicBtn.get().src = this._uploadPicBtnPicSrc;

            // 清除按钮
            this.clearSelectedPic.get().src = this._clearSelectedPicSrc;
		} ,

		_initDynamicHTML: function(){

		} ,

		_initDynamicArgs: function(){
			// 根据每次上传的图片数量确定上传的方式：parallel（并行）、serial（串行）
            this._type = this._uploadedList.length > this._split ? 'serial' : 'parallel';
		} ,

		_initDynamic: function(){

		} ,


		// 通过文件ID找到图片列表中对应的项 index
		findSelectedPicItemIndexByIdentifier: function(identifier){
			var i = 0;

			for (; i < this._picFileList.length; ++i)
			{
				if (this._picFileList[i]['identifier'] === identifier) {
					return i;
				}
			}

			return false;
		} ,

        // 通过文件找到图片列表中对应的项 index
        findSelectedPicItemIndexByFile: function(file){
            var i = 0;

            for (; i < this._picFileList.length; ++i)
            {
                if (this._picFileList[i]['file'] === file) {
                    return i;
                }
            }

            return false;
        } ,

		// 从完整的图片集合中删除指定索引的单元
		deleteFromPicFileList: function(index){
			return this._picFileList.splice(index , 1);
		} ,

		// 实际从数组中删除
		deleteFromList: function(list , unit){
            var i 	= 0;
            var cur = null;

            for (; i < list.length; ++i)
            {
                cur = list[i];

                if (cur === unit) {
                    list.splice(i , 1);
                    return true;
                }
            }

            return false;
		} ,

		// 从待上传图片列表中删除指定的图片（可能不存在也不奇怪）
		// 假设从已上传列表中删除一张图片项，那么就会不存在，很正常.
        deleteUnitByIdentifier: function(identifier){
            var index = this.findSelectedPicItemIndexByIdentifier(identifier);
            var file  = this._picFileList[index]['file'];

			this.deleteFromList(this._succUploadPicFileList 	, file);
			this.deleteFromList(this._failedUploadPicFileList 	, file);
			this.deleteFromList(this._cancelUploadPicFileList 	, file);

            this.deleteFromList(this._uploadedList , file);
			this.deleteFromList(this._tempSuccUploadPicFileList 	, file);
			this.deleteFromList(this._tempFailedUploadPicFileList 	, file);
			this.deleteFromList(this._tempCancelUploadPicFileList 	, file);

            this.deleteFromPicFileList(index);
		} ,

		deleteUnitByFile: function(file){
            var index = this.findSelectedPicItemIndexByFile(file);

            this.deleteFromList(this._succUploadPicFileList 	, file);
            this.deleteFromList(this._failedUploadPicFileList 	, file);
            this.deleteFromList(this._cancelUploadPicFileList 	, file);

            this.deleteFromList(this._uploadedList , file);
            this.deleteFromList(this._tempSuccUploadPicFileList 	, file);
            this.deleteFromList(this._tempFailedUploadPicFileList 	, file);
            this.deleteFromList(this._tempCancelUploadPicFileList 	, file);

            this.deleteFromPicFileList(index);
		} ,

		// 生成唯一标识
		genID: function(){
			return G.randomArr(100 , 'mixed').join('');
		} ,

		// 并行上传：删除上传的 item
		_parallelDeletePicItemEvent: function(event){
			var tar  		= G(event.currentTarget);
			var identifier 	= tar.data('identifier');

			// 删除改文件（相关的所有数据）
			this.deleteUnitByIdentifier(identifier);

            this._selectedCount.get().textContent = this._uploadedList.length;

            if (this._uploadedList.length !== 0) {
                this._selectedCount.removeClass('hide');
            } else {
                this._selectedCount.addClass('hide');
            }

            // 重新初始化参数
            this._initDynamicHTML();
            this._initDynamicArgs();
            this._initDynamic();

            // 删除自身
            tar.get().parentNode.removeChild(tar.get());
		} ,

		// 串行上传：删除上传的 item
		_serialDeletePicItemEvent: function(event){
			var self		= this;
            var tar  		= G(event.currentTarget);
            var canDelete   = tar.data('canDelete');
            var identifier 	= tar.data('identifier');

            // 不允许删除
            if (canDelete === 'n') {
            	return ;
			}

            // 删除自身
            var picItem = tar.parentFind({
				tagName: 'div' ,
				className: 'line total-progress'
			} , this._listBody.get() , false , true).first();

            var identifier = picItem.data('identifier');

            // 删除文件
			this.deleteUnitByIdentifier(identifier);

            this._selectedCount.get().textContent = this._uploadedList.length;

            if (this._uploadedList.length !== 0) {
                this._selectedCount.removeClass('hide');
            } else {
            	this.hideSerial();
                this._selectedCount.addClass('hide');
            }

            // 重新初始化参数
            self._initDynamicHTML();
            self._initDynamicArgs();
            self._initDynamic();

            // 显著的从视野下被删除
            picItem.addClass('focus-line');

            var sW = picItem.getEleW('border-box');
            var eW = 0;

            picItem.animate({
				carTime: 200 ,
				json: [
					{
						attr: 'width' ,
						sVal: sW ,
						eVal: eW
					}
				] ,
				fn: function(){
                    picItem.get().parentNode.removeChild(picItem.get());

                    // 切换上传模式
                    if (self._uploadedList.length <= self._split) {
                    	self.addPicForFile(self._succUploadPicFileList);
                    	self.addPicForFile(self._failedUploadPicFileList);
                    	self.addPicForFile(self._cancelUploadPicFileList);
                        self.addPicForFile(self._uploadedList);
                    }
				}
			});
		} ,

		// 并行添加的图片项事件
		_parallelDefinePicItemEvent: function(picItem){
            var picItem		= G(picItem);
            var close		= G('.close'	, picItem.get()).first();
            var closePic	= G('.pic'		, close.get()).first();

            // 删除事件
            picItem.loginEvent('click' , this._parallelDeletePicItemEvent.bind(this) , false , false);

            // 关闭按钮鼠标悬浮事件
            close.loginEvent('mouseover' , function(){
                closePic.get().src = closePic.data('focus');
            } , false , false);

            // 关闭按钮鼠标悬浮事件
            close.loginEvent('mouseout' , function(){
                closePic.get().src = closePic.data('unfocus');
            } , false , false);
		} ,


		// 串行添加的图片项事件
        _serialDefinePicItemEvent: function(picItem){
			picItem = G(picItem);

			var _delete = G('.delete' , picItem.get()).first();

            _delete.loginEvent('click' , this._serialDeletePicItemEvent.bind(this) , true , false);
		} ,

		// 图片项 事件
		_definePicItemEvent: function(picItem){
			if (this._type === 'parallel') {
				this._parallelDefinePicItemEvent(picItem);
			} else {
				this._serialDefinePicItemEvent(picItem);
			}
		} ,

		// 过滤图片集合中重复的图片
		// 过滤规则：文件名 + 文件类型 + 文件大小（解决不同目录重名文件的情况下为误过滤掉）
		filter: function(files){
			var i 		= 0;
			var n       = 0;
			var cur     = null;
			var cCur    = null;
			var self    = this;
			var exists  = false;
            var srcList = [];

			for (; i < files.length; ++i)
			{
				cur 	= files[i];
                exists 	= false;

                // 重名文件过滤
				for (n = 0; n < this._picFileList.length; ++n)
				{
					cCur = this._picFileList[n];

					if (
						(cur['name'] === cCur['name']) &&
						(cur['size'] === cCur['size']) &&
						(cur['type'] === cCur['type'])
					) {
						exists = true;
						break;
					}
				}

				// 文件类型过滤
				if (!G.contain(cur['type'] , this._imageType)) {
					continue ;
				}

				if (!exists) {
					srcList.push(cur);
				}
			}

			return srcList;
		} ,

		// 隐藏初始化展示图片列表
		hideInitShowPicList: function(){
			this._initShowPicList.addClass('hide');
		} ,

		// 隐藏并行上传
		hideParallel: function(){
			this._previewPics.addClass('hide');
		} ,

		// 显示并行上传
		showParallel: function(){
            this._previewPics.removeClass('hide');
		} ,

		// 隐藏串行上传
		hideSerial: function(){
			this._uploadPicList.addClass('hide');
		} ,

		// 显示列表行上传
		showSerial: function(){
			this._uploadPicList.removeClass('hide');
		} ,

		// 并行方式添加图片文件
		parallelAddPicForFile: function(files , index){
            var self = this;

            // 没有文件直接返回
            if (files.length === 0) {
            	return ;
			}

            if (G.getValType(index) === 'Undefined') {
                index = files.length - 1;

                // 隐藏 + 清空 serial 相关内容
                this.hideSerial();
                this.serialClearSelected();
                this.showParallel();
            }

            var file 		= files[index];
            var identifier 	= null;

            // 判断是否重复（这会发生在上传方式改变的情况下！必须）
            if (!this.isRepeatPic(file)) {
                identifier = this.genID();

                this._picFileList.push({
                    identifier: identifier ,
                    file: file
                });
            } else {
                identifier = this.findFromPicFileList(file)['identifier'];
            }

            var div = G(document.createElement('div'));

				div.addClass('pic-item');
				div.data('identifier' , identifier);

            // 获取图片的本地预览 blob url
            G.getBlobUrl(file , function(blobUrl){
            	var isUploaded = self.isUploaded(file);

                var assign = file;
                	assign['src'] = blobUrl;

                div.get().innerHTML = self.templateOne(assign);

                // 添加节点
                self._previewPics.get().appendChild(div.get());

                var msg = G('.msg' , div.get()).first();

                if (isUploaded !== false) {
                    self.setUploadStatus(msg.get() , isUploaded);
                }

                // 定义图片项事件
                self._definePicItemEvent(div.get());

                index--;

                if (index >= 0) {
                    // 如果 files 队列没有被消费干净，继续调用，知道他消费完为止
                    self.parallelAddPicForFile(files , index);
                } else {
                    // 添加完成之后
                    self.afterAddSetRelativeArgs();
                }
            });
		} ,

		// 上传结果描述
		uploadStatusExplain: function(status){
            return status === 'success' ? '成功' : (status === 'failed' ? '失败' : '取消');
		} ,

		// 串行方式添加图片文件
        serialAddPicForFile: function(files , index){
            // 无文件返回
            if (files.length === 0) {
            	return ;
			}

            var self = this;

            if (G.getValType(index) === 'Undefined') {
                index = files.length - 1;

                // 隐藏 + 清空 paral 相关内容
                this.hideParallel();
                this.parallelClearSelected();
                this.showSerial();
            }

            var file 		= files[index];
            var identifier 	= null;

            // 判断是否重复（这会发生在上传方式改变的情况下！必须）
            if (!this.isRepeatPic(file)) {
                identifier = this.genID();

                this._picFileList.push({
                    identifier: identifier ,
                    file: file
                });
            } else {
            	identifier = this.findFromPicFileList(file)['identifier'];
			}

            var div = G(document.createElement('div'));
				div.addClass('line total-progress pic-item');
				div.data('identifier' , identifier);

            // 获取图片的本地预览 blob url
            G.getBlobUrl(file , function(blobUrl){
				var assign 			= file;
				var isUploaded		= self.isUploaded(file);

				// console.log(isUploaded);

                if (isUploaded) {
					assign['speed'] 			= '已上传';
					assign['status'] 			= isUploaded;
					assign['statusExplain'] 	= self.uploadStatusExplain(isUploaded);
                } else {
                    assign['speed'] 			= '未上传';
                    // 等待上传
                    assign['status'] 			= 'wait';
                    assign['statusExplain'] 	= '未上传';
				}

				assign['sizeExplain'] 	= G.getStorage(assign['size'] , 'b');
				assign['src'] 			= blobUrl;

				div.get().innerHTML = self.templateTwo(assign);

				self._listBody.get().appendChild(div.get());

				var msg = G('.msg' , div.get()).first();

				if (isUploaded !== false) {
                    self.setUploadStatus(msg.get() , isUploaded);
				}

				// 定义事件
				self._serialDefinePicItemEvent(div.get());

				index--;

				if (index >= 0) {
					self.serialAddPicForFile(files , index);
				} else {
                    // 添加完成之后
                    self.afterAddSetRelativeArgs();
                }
			});
		} ,

		// 模板1类型：文件方式添加图片项
		addPicForFile: function(files){
			if (this._type === 'parallel') {
				this.parallelAddPicForFile(files);
			} else {
				this.serialAddPicForFile(files);
			}
		} ,

		// 获取图片类型
		getType: function(suffix){
			switch (suffix)
			{
				case 'jpg':
					return 'image/jpeg';
				case 'png':
					return 'image/png';
				case 'gif':
					return 'image/gif';
				default:
					return false;
			}
		} ,

		// 获取文件名
		getFilename: function(path){
			var filename = G.getFilename(path);
			var suffix   = G.getFileSuffix(path);

			return filename + '.' + suffix;
		} ,

		// 判断图片是否已经存在
		exists: function(name){
			var i = 0;
			var cur = null;

			for (; i < this._picFileList.length; ++i)
			{
				cur = this._picFileList[i];

				if (cur['name'] === name) {
					return true;
				}
			}

			return false;
		} ,

		// 判断是否是重复的图片文件（这可能会发生在上传方式改变的情况下）
		isRepeatPic: function(file){
			var i 	= 0;
			var cur = null;

			for (; i < this._picFileList.length; ++i)
			{
				cur = this._picFileList[i];

				if (cur['file'] === file) {
					return true;
				}
			}

			return false;
		} ,

		// 通过文件对象从 picFileList 中找到完整的 单元
		findFromPicFileList: function(file){
            var i 	= 0;
            var cur = null;

            for (; i < this._picFileList.length; ++i)
            {
                cur = this._picFileList[i];

                if (cur['file'] === file) {
                    return cur;
                }
            }

            throw new Error('未找到文件对象对应的单元');
		} ,

		// 直接图片源的方式添加（不允许这种方式添加图片！）
		addPicForSrc: function(srcList){
			var i 		= 0;
			var cur 	= null;
			var div 	= null;
			var html 	= null;
			var file    = null;
			var type	= null;
			var filename = null;

            if (this._mode === 'override') {
                this._picFileList 					= [];
                this._previewPics.get().innerHTML = '';
            }

			for (; i < srcList.length; ++i)
			{
                cur = srcList[i];

                filename	= this.getFilename(cur);

                // 不会重复添加重名的文件
                if (this.exists(filename)) {
                	continue ;
				}

                div = document.createElement('div');
                div.className = 'pic-item';
                div.setAttribute('data-fileName' , filename);

                type = this.getType(cur);

                file = {
                	name: filename ,
					type: type
				};

                // 添加进图片列表
                this._picFileList.push(file);

                // 填充 DOM 节点内容

                div.innerHTML = html;

                // 添加节点
                this._previewPics.get().appendChild(div);

                // 定义图片项事件
                this._definePicItemEvent(div);
			}

            // 添加完成之后
            this.afterAddSetRelativeArgs();
		} ,

		// 设置相关显示参数
		afterAddSetRelativeArgs: function(){
            this._selectedCount.get().textContent = this._uploadedList.length;

            if (this._uploadedList.length !== 0) {
            	this.clearSelected.addClass('clear-selected-hover');
                this._selectedCount.removeClass('hide');
            } else {
                this.clearSelected.removeClass('clear-selected-hover');
                this._selectedCount.addClass('hide');
            }
		} ,

		// 添加待上传图片项
		pushUploadedList: function(files){
			var i = 0;

            for (; i < files.length; ++i)
            {
                this._uploadedList.push(files[i]);
            }
		} ,

		// 初始化操作类型对应的环境
        initOprEnv: function(){
            if (this._mode === 'override') {
                // 完整记录
                this._picFileList 					= [];
                this._succUploadPicFileList			= [];
                this._cancelUploadPicFileList		= [];
                this._failedUploadPicFileList		= [];

                // 临时记录
				this._uploadedList					= [];
                this._tempFailedUploadPicFileList	= [];
                this._tempCancelUploadPicFileList	= [];
                this._tempFailedUploadPicFileList	= [];

                // 内容展示
                this._previewPics.get().innerHTML 	= '';
                this._uploadPicList.get().innerHTML 	= '';
            }
		} ,

		// 图片上传表单变化事件
		uploadInputChangeEvent: function(event){
			var tar		= G(event.currentTarget);
			var files	= tar.get().files;

            // 过滤掉不支持的文件
            files = this.filter(files);

			if (files.length === 0) {
				if (this._picFileList.length === 0) {
					// 无图片上传，隐藏所有
                    this.hideParallel();
                    this.hideSerial();
				} else if (this._picFileList.length > this._split) {
					// 串行上传，隐藏并行
					this.hideParallel();
				} else {
					// 并行上传，隐藏串行
					this.hideSerial();
				}

				return ;
			}

			// 根据操作类型（追加|覆盖），进行相应的初始化操作
			this.initOprEnv();

			// 隐藏初始化展示图片
			this.hideInitShowPicList();

			// 添加到待上传图片列表
			this.pushUploadedList(files);

			// 暂时记住上一次添加模式
			var type = this._type;

			// 重新初始化参数
            this._initDynamicHTML();
            this._initDynamicArgs();
            this._initDynamic();

			// 添加图片项（如果上传方式发生了变化，则使用 uploadedList 继续添加）
			if (type === this._type) {
                this.addPicForFile(files);
			} else {
				// 添加之前处理过的图片：成功的
				this.addPicForFile(this._succUploadPicFileList);
                // 添加之前处理过的图片：失败的
				this.addPicForFile(this._failedUploadPicFileList);
				// 添加之前处理过的图片：取消的
                this.addPicForFile(this._cancelUploadPicFileList);
                // 添加待处理的图片
				this.addPicForFile(this._uploadedList);
			}
		} ,

		// 检查是否有图片
		empty: function(){
			if (this._picFileList.length === 0) {
				return true;
			}

			return false;
		} ,

		// 通过 identifier 找到对应的元素
		findPicItem: function(context , identifier){
			var picItemList = G('.pic-item' , context);
			var i			= 0;
			var cur			= null;

			for (; i < picItemList.length; ++i)
			{
				cur = G(picItemList.get()[i]);

				if (cur.data('identifier') === identifier) {
					return cur.get();
				}
			}

			throw new Error('找不到标识符对应的DOM元素');
		} ,

		// 设置项
		setOpt: function(opt){
			if (G.getValType(opt) !== 'Object') {
				throw new Error('参数 1 类型错误');
			}

			// this.opt = opt;
			var key = null;

			for (key in opt)
			{
				this['_' + key] = opt[key];
			}
		} ,

		// 判断上传是否已经结束
		checkUploadOver: function(){
			var count = this._tempSuccUploadPicFileList.length + this._tempFailedUploadPicFileList.length + this._tempCancelUploadPicFileList.length;

			if (count === this._uploadedList.length) {
				return true;
			}

			return false;
		} ,

		// 调用回调函数
		callback: function(msg){
            if (this.checkUploadOver()) {
                this.resetUploadedList();

            	if (G.getValType(this._callback) === 'Function') {
                    this._callback();
				} else {
                    console.log(msg);
				}
            }
		} ,

		// 重置待上传列表（准备下一次上传）
		resetUploadedList: function(){
			this._uploadedList 				= [];
			this._tempSuccUploadPicFileList 	= [];
			this._tempFailedUploadPicFileList 	= [];

			this._selectedCount.addClass('hide');
		} ,

		// 设置上传状态
        setUploadStatus: function(msg , type){
			msg 			= G(msg);

            var typeRange 	= ['success' , 'failed' , 'cancel'];
            var msgIn 		= G('.msg-in' , msg.get()).first();

			if (!G.contain(type , typeRange)) {
				throw new Error('参数 2 错误');
			}

			var explain = this.uploadStatusExplain(type);

            msgIn.get().textContent = explain;

            msg.removeClass('hide');

            var curOpacity = parseFloat(msg.getStyleVal('opacity'));
            var endOpacity = 1;

            msg.animate({
				carTime: 300 ,
				json: [
					{
						attr: 'opacity' ,
						sVal: curOpacity ,
						eVal: endOpacity
					}
				]
			});

		} ,

		// 是否上传过
		isUploaded: function(file){
        	var i 	= 0;
        	var cur = null;

        	// 上传成功的记录中查找
        	for (i = 0; i < this._succUploadPicFileList.length; ++i)
			{
				cur = this._succUploadPicFileList[i];

				if (cur === file) {
					return 'success';
				}
			}

			// 上传失败的记录中查找
            for (i = 0; i < this._failedUploadPicFileList.length; ++i)
            {
                cur = this._tempFailedUploadPicFileList[i];

                if (cur === file) {
                    return 'failed';
                }
            }

            // 取消上传的记录中查找
            for (i = 0; i < this._tempCancelUploadPicFileList.length; ++i)
            {
                cur = this._tempCancelUploadPicFileList[i];

                if (cur === file) {
                    return 'cancel';
                }
            }

            return false;

		} ,

		// 记录上传日志
		log: function(file , status){
			var statusRange = ['success' , 'failed' , 'cancel'];

			if (!G.contain(status , statusRange)) {
				throw new Error('参数 2 错误');
			}

			if (status === 'failed') {
				// 完整记录上传失败的图片
                this._failedUploadPicFileList.push(file);
                // 记录单次上传失败的图片（用于确定是否全部上传完毕，不论成功 或 失败）
                this._tempFailedUploadPicFileList.push(file);
			} else if (status === 'cancel') {
                // 完整记录取消上传的图片
                this._cancelUploadPicFileList.push(file);
                // 记录单次取消上传的图片（用于确定是否全部上传完毕，不论成功 或 失败）
				this._tempCancelUploadPicFileList.push(file);
            } else {
                // 完整记录上传成功的图片
                this._succUploadPicFileList.push(file);
                // 记录单次取消上传的图片（用于确定是否全部上传完毕，不论成功 或 失败）
                this._tempSuccUploadPicFileList.push(file);
			}
		} ,

		// 并行上传图片
		parallelUploadPics: function(){
            var self	= this;

            if (this._uploadedList.length === 0) {
				console.log('无待上传图片');
                return ;
            }

            var i = this._uploadedList.length - 1;

            var uploadEvent = function(){
                var picFile		= self._uploadedList[i];
                var identifier  = self.findFromPicFileList(picFile)['identifier'];
                var picItem		= null;
                var msg			= null;
                var msgIn		= null;
                var progress	= null;
                var pTotal		= null;
                var pCur		= null;
                var index		= i;

                var formData = G.getFormData(self._field	, picFile);

                picItem		= self.findPicItem(self._previewPics.get() , identifier);
                progress	= G('.progress' , picItem).first();
                pTotal		= G('.p-total'	, progress.get()).first();
                pCur		= G('.p-cur'	, pTotal.get()).first();
                msg			= G('.msg' 		, picItem).first();

                var failedHandle = function(){
					// 记录上传日志
                    self.log(picFile , 'failed');

                    // 把图片标识下上传状态
                    self.setUploadStatus(msg.get() , 'failed');

                    // 全部上传成功时调用的回调函数
                    self.callback('图片序号 ' + index + '下载发生错误!');
				};

                var succHandle = function(json){
                    // 记录上传日志
                    self.log(picFile , 'success');

                    // 把图片标识下上传状态
                    self.setUploadStatus(msg.get() , 'success');

                    // 调用
                    if (G.getValType(self._success) === 'Function') {
                        self._success(json);
                    }

                    // 全部上传成功时调用的回调函数
                    self.callback('图片序号 ' + self._uploadedList.length + '上传成功!');
				};

                G.ajax({
                    url: self._url ,
                    method: 'post' ,
                    sendData: formData ,
                    success: succHandle ,
                    // 上传开始
                    uLoadstart: function(){
                        progress.removeClass('hide');

                        if (G.getValType(self._uLoadStart) === 'Function') {
                            self._uLoadStart();
                        }
                    } ,
                    // 上传进行中
                    uProgress: function(event){
                        if (event.lengthComputable) {
                            var total	= event.total;
                            var loaded	= event.loaded;
                            var ratio	= loaded / total;
                            ratio   = Math.min(1 , Math.max(ratio , 0));
                            ratio   *= 100;

                            // 设置比例
                            pCur.css({
                                width: ratio + '%'
                            });
                        } else {
                            // console.log('当前上传文件大小未知');
                        }

                        if (G.getValType(self._uProgress) === 'Function') {
                            self._uProgress();
                        }
                    } ,
                    // 上传结束
                    uLoadend: function(){
                        if (G.getValType(self._uLoadEnd) === 'Function') {
                            self._uLoadEnd();
                        }
                    } ,
                    // 一旦发生错误立即终止传输
                    erorr: failedHandle ,
                    uError: failedHandle ,
					timeout: failedHandle
                });

                i--;

                if (i >= 0) {
                    uploadEvent();
                }
            };

            uploadEvent();
		} ,

		// 串行上传图片
		serialUploadPics: function(){
            var self	= this;

            if (this._uploadedList.length === 0) {
                console.log('无待上传图片');
                return ;
            }

            var i 	  = this._uploadedList.length - 1;
            var curUploadIndex = 1;

            // 错误处理
            var errHandle = function(){
                i--;

                if (i >= 0) {
                    uploadEvent();
                }
            };

            // 设置上传记录
			var setUploadStatus = function(status , type){
				status.textContent = self.uploadStatusExplain(type);
			};

			// 禁止删除


            this._uploadTitle.get().innerHTML = this.titleTemplate('ing');

            var curUpload 	= G('.cur' 	 , this._uploadTitle.get()).first();
            var totalUpload = G('.total' , this._uploadTitle.get()).first();

            totalUpload.get().textContent = this._uploadedList.length;

            var uploadSTime = 0;
            var uploadETime = 0;

            var uploadEvent = function() {
                var picFile = self._uploadedList[i];
                var identifier = self.findFromPicFileList(picFile)['identifier'];
                var picItem = null;
                var msg = null;
                var pCur = null;
                var speed = null;
                var status = null;
                var cancelBtn = null;
                var deleteBtn = null;
                var index = i;

                // 错误处理
				var failedHandle = function(){
                    // 记录上传日志
                    self.log(picFile , 'failed');

                    // 标识当前记录上传状态
                    setUploadStatus(status.get() , 'failed');

                    // 把图片标识下上传状态
                    self.setUploadStatus(msg.get() , 'failed');

                    // 全部上传成功时调用的回调函数
                    self.callback('图片序号 ' + index + '上传失败!');

                    errHandle();
				};

				// succHandle
				var succHandle = function(json){
                    // 记录上传日志
                    self.log(picFile , 'success');

                    // 标识当前记录上传状态
                    setUploadStatus(status.get() , 'success');

                    // 把图片标识下上传状态
                    self.setUploadStatus(msg.get() , 'success');

                    // 调用
                    if (G.getValType(self._success) === 'Function') {
                        self._success(json);
                    }

                    // 全部上传成功时调用的回调函数
                    self.callback('图片序号 ' + self._uploadedList.length + '上传成功!');

                    errHandle();
				};

                var formData = G.getFormData(self._field, picFile);

                picItem = G(self.findPicItem(self._listBody.get(), identifier));
                msg     = G('.msg' , picItem.get()).first();
                pCur	= G('.cur-progress' , picItem.get()).first();
                speed   = G('.div-speed' , picItem.get()).first();
                status  = G('.div-status' , picItem.get()).first();
                cancelBtn = G('.cancel' , picItem.get()).first();
                deleteBtn = G('.delete' , picItem.get()).first();


                curUpload.get().textContent = curUploadIndex++;
                status.get().textContent = '上传中...';

                cancelBtn.removeClass('hide');
                deleteBtn.addClass('hide');

                cancelBtn.loginEvent('click' , function(){
                	xhr.get().abort();
				} , true , false);

                var xhr = G.ajax({
                    url: self._url ,
                    method: 'post' ,
                    sendData: formData ,
                    success: succHandle ,
                    // 上传开始
                    uLoadstart: function(){
                    	// 标记开始时间
                    	uploadSTime = new Date().getTime();

                        picItem.addClass('focus-line');

                        if (G.getValType(self._uLoadStart) === 'Function') {
                            self._uLoadStart();
                        }
                    } ,
                    // 上传进行中
                    uProgress: function(event){
                    	var uploadETime = new Date().getTime();

                        if (event.lengthComputable) {
                            var total	= event.total;
                            var loaded	= event.loaded;
                            var ratio	= loaded / total;
                            ratio   = Math.min(1 , Math.max(ratio , 0));
                            ratio   *= 100;

                            // 设置上传进度比例
                            pCur.css({
                                width: ratio + '%'
                            });

                            // 单位换算：ms => s
                            var duration = (uploadETime - uploadSTime) / 1000;

                            // 设置上传速度
							var uploadSpeed 		= event.loaded / duration;
							var uploadSpeedExplain 	= G.getStorage(uploadSpeed , 'b') + '/s';

							speed.get().textContent = uploadSpeedExplain;
                        } else {
                            // console.log('当前上传文件大小未知');
                        }

                        if (G.getValType(self._uProgress) === 'Function') {
                            self._uProgress();
                        }
                    } ,
                    // 上传结束
                    uLoadend: function(){
                    	picItem.removeClass('focus-line');

                        if (G.getValType(self._uLoadEnd) === 'Function') {
                            self._uLoadEnd();
                        }
                    } ,
                    // 一旦发生错误立即终止传输
                    erorr: failedHandle ,
                    uError: failedHandle ,
                    timeout: failedHandle ,
					abort: failedHandle
                });
            };

            uploadEvent();

		} ,

		// 图片上传（根据类型智能选择上传方式）
		upload: function(){
			if (this._type === 'parallel') {
				this.parallelUploadPics();
			} else {
				this.serialUploadPics();
			}
		} ,

		// 清空并行上传添加的内容
		parallelClearSelected: function(){
			this.hideParallel();

            this._previewPics.get().innerHTML = '';
            this._selectedCount.addClass('hide');
            this.clearSelected.removeClass('clear-selected-hover');
		} ,

		// 清空串行上传添加的内容
		serialClearSelected: function(){
            this.hideSerial();

			this._uploadTitle.get().innerHTML = '待上传列表';
            this._listBody.get().innerHTML = '';
            this._selectedCount.addClass('hide');
            this.clearSelected.removeClass('clear-selected-hover');
		} ,


        clearSelectedEvent:function(){
			// 完整记录
            this._picFileList 	= [];
            this._succUploadPicFileList = [];
            this._failedUploadPicFileList = [];
            this._cancelUploadPicFileList = [];

            // 临时记录
            this._uploadedList 	= [];
            this._tempCancelUploadPicFileList = [];
            this._tempFailedUploadPicFileList = [];
            this._tempSuccUploadPicFileList = [];

			if (this._type === 'parallel') {
				this.parallelClearSelected();
			} else {
				this.serialClearSelected();
			}
		} ,

		// 定义图片相关事件
		_defineEvent: function(){
			this.uploadInput.loginEvent('change' , this.uploadInputChangeEvent.bind(this) , false , false);
			this.clearSelected.loginEvent('click' , this.clearSelectedEvent.bind(this) , false , false);
		} ,

		// 初始化展示图片（不允许删除）
		showInitPics: function(){
			this.addPicForSrc(this._initPicList);
			this._picFileList = [];
			this.afterAddSetRelativeArgs();
		} ,

		// 第一种模板风格
		templateOne: function(assign){
            var html = '';
				html += "			<div class='img'><img src='" + assign['src'] + "' class='pic' /></div>	";
				html += "			<div class='close'><img src='" + this._pluginUrl + "images/delete_unfocus.png' data-focus='" + this._pluginUrl + "images/delete_focus.png' data-unfocus='" + this._pluginUrl + "images/delete_unfocus.png' class='pic' /></div>	";
				html += "			<div class='progress hide'>	";
				html += "				<div class='p-total'>	";
				html += "					<div class='p-cur'></div>	";
				html += "				</div>	";
				html += "			</div>	";
				html += ' 			<div class="msg hide">	';
				html += '				<div class="msg-in">...</div> ';
				html += '			</div> ';


			return html;
		} ,

		// 第二种模板风格
		templateTwo: function(assign){
			var html = '';
				html += '	<div class="line-in">	';
				html += '	    <!-- 上传进度 -->	';
				html += '	    <div class="cur-progress"></div>	';
				html += '	    <!-- 状态 -->	';
				html += '	    <div class="msg hide">	';
				html += '	    	<div class="msg-in">...</div>	';
				html += '	    </div>	';
				html += '		<div class="item div-preview multiple-rows">	';
				html += '	    	<div class="row">' + assign['name'] + '</div>	';
				html += '			<div class="row"><img src="' + assign['src'] + '" class="pic" /></div>	';
				html += '	    </div>	';
				html += '	    <div class="item div-type">' + assign['type'] +'</div>	';
				html += '	    <div class="item div-size">' + assign['sizeExplain'] + '</div>	';
				html += '		<div class="item div-speed">' + assign['speed'] + '</div>	';
				html += '		<div class="item div-status">' + assign['statusExplain'] + '</div>	';
				html += '	    <div class="item div-opr multiple-rows">	';
				html += '	    	<div class="row"><button type="button" class="btn-1 cancel hide">取消</button></div>	';
				html += '	    	<div class="row"><button type="button" class="btn-1 delete">删除</button></div>	';
				html += '	    </div>	';
				html += '	</div>';

			return html;
		} ,

		// 获取标题模板
		titleTemplate: function(type){
            var html = '';

			if (type === 'ing') {
                html += '	正在上传（<span class="cur">...</span>/<span class="total">...</span>）	';
			} else {
				html += '待上传列表';
			}

			return html;
		} ,

		run: function(){
			this._initStaticHTML();
			this._initStaticArgs();
			this._initStatic();
			this._initDynamicHTML();
			this._initDynamicArgs();
			this._initDynamic();

			this._defineEvent();
		}
	};
	
	return UploadImages;
})();