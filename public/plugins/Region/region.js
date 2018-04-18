/*
 * 地区相关系列功能
 */
function definePositionEvent(province , city , area){
	var provinceEle				= G(province);
	var cityEle					= G(city);
	var areaEle					= G(area);
	var ajaxObj					= null;
	var defaultProinceOption	= '<option value="">请选择省份...</option>';
	var defaultCityOption		= '<option value="">请选择城市...</option>';
	var defaultAreaOption		= '<option value="">请选择区域...</option>';
	var reqUrl					= url + urlSuffix + '/' + module + '/' + controller + '/getRegionListData?is_ajax=y';
	
	var getRegionText = function(id , type){
		if (id === 'n') {
			return '';
		}

		var typeRange = ['province' , 'city' , 'area'];
		var optionListEle = null;
		var i			  = 0;
		var curItem		  = null;
		
		if (!G.contain(type , typeRange)) {
			throw new Error('不支持的地区类型!');
		}
	
		if (type === 'province') {
			optionListEle = G('option' , provinceEle.get());
		}

		if (type === 'city') {
			optionListEle = G('option' , cityEle.get());
		}

		if (type === 'area') {
			optionListEle = G('option' , areaEle.get());
		}
		
		for (; i < optionListEle.length; ++i)
			{
				curItem = G(optionListEle.get()[i]);

				if (curItem.get().value === id) {
					return curItem.get().textContent;	
				}
			}
		
		throw new Error('找不到指定 id 的值');
	};
	
	// 省份事件
	var provinceChangeEvent = function(){
		if (ajaxObj !== null) {
			ajaxObj.get().abort();
		}

		var regionId = provinceEle.get().value;
		
		cityEle.get().innerHTML = defaultCityOption;
		areaEle.get().innerHTML = defaultAreaOption;

		ajaxObj = G.ajax({
			url: reqUrl + '&type=city&region_id=' + regionId ,
			method: 'get' , 
			isAsync: true ,
			urlMode: 'composite_2' ,
			success: function(json){
				var data = G.jsonDecode(json);
				var html = defaultCityOption;
				var i    = 0;
				var selectedCity = cityEle.get().getAttribute('data-city');
				
				if (data['status'] === 'failed') {
					console.log(data['msg']);
					return ;
				}

				data = data['msg'];
				
				// 填充城市
				for (; i < data.length; ++i)
					{
						console.log(data[i]['region_name'] , selectedCity);
						html += '<option value="' + data[i]['region_id'] + '"' + (selectedCity === data[i]['region_name'] ? 'selected="selected"' : '') + '>' + data[i]['region_name'] + '</option>';
					}
				
				cityEle.get().innerHTML = html;

				if (selectedCity !== '') {
					cityChangeEvent();
				}
			} ,
			error: G.ajaxError
		});
	};

	// 城市事件
	var cityChangeEvent = function(){
		if (ajaxObj !== null) {
			ajaxObj.get().abort();
		}

		var regionId = cityEle.get().value;
		
		areaEle.get().innerHTML = defaultAreaOption;

		ajaxObj = G.ajax({
			url: reqUrl + '&type=area&region_id=' + regionId ,
			method: 'get' , 
			isAsync: true , 
			urlMode: 'composite_2' ,
			success: function(json){
				var data = G.jsonDecode(json);
				var html = defaultAreaOption;
				var i    = 0;
				var selectedArea = areaEle.get().getAttribute('data-area');
			
				if (data['status'] === 'failed') {
					console.log(data['msg']);
					return ;
				}

				data = data['msg'];
				
				// 填充区域
				for (; i < data.length; ++i)
					{
						html += '<option value="' + data[i]['region_id'] + '"' + (selectedArea === data[i]['region_name'] ? 'selected="selected"' : '') + '>' + data[i]['region_name'] + '</option>';
					}
				
				areaEle.get().innerHTML = html;
			} ,
			error: G.ajaxError
		});
	};

	var defineRegionEvent = function(){
		provinceEle.loginEvent('change'		, provinceChangeEvent , false , true);
		cityEle.loginEvent('change'			, cityChangeEvent	  , false , true);
	};

	// 定义地区相关事件
	defineRegionEvent();

	// 初次填充省份
	G.ajax({
		url: reqUrl + '&type=province' , 
		method: 'get' , 
		isAsync: true ,
		urlMode: 'composite_2' ,
		success: function(json){
			var data   = G.jsonDecode(json);
			var option = null;
			var i	   = 0;
			var html   = defaultProinceOption;
			var selectedProvince = provinceEle.get().getAttribute('data-province');
			
			if (data['status'] === 'failed') {
				console.log(data['msg']);
				return ;
			}
			
			data = data['msg'];

			for (; i < data.length; ++i)
				{
					html += '<option value="' + data[i]['region_id'] + '"' + (selectedProvince === data[i]['region_name'] ? 'selected="selected"' : '') + '>' + data[i]['region_name'] + '</option>'
				}
			
			provinceEle.get().innerHTML = html;
			cityEle.get().innerHTML		= defaultCityOption;
			areaEle.get().innerHTML	    = defaultAreaOption;

			if (selectedProvince !== '') {
				provinceChangeEvent();
			}
		} , 
		error: G.ajaxError
	});
}