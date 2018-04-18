<?php
namespace Lib;

class UploadImage extends UploadFile {
	/*
	 * 获取文件数组中的图片文件
	 */
	public function getImages(array $files = []){
		$type_range = ['image/gif' , 'image/jpeg' , 'image/png'];

		if (!is_array($files['tmp_name'])) {
			if (in_array($files['type'] , $type_range)) {
				return [$files];
			}

			return [];
		}

		$len = count($files['tmp_name']);

		$res = [
			'name'	   => [] , 
			'size'	   => [] , 
			'type'	   => [] , 
			'tmp_name' => [] , 
			'error'	   => []
		];

		for ($i = 0; $i < $len; ++$i)
        {
            if (in_array($files['type'][$i] , $type_range)) {
                $res['name'][$i]     = $files['name'][$i];
                $res['size'][$i]     = $files['size'][$i];
                $res['type'][$i]     = $files['type'][$i];
                $res['tmp_name'][$i] = $files['tmp_name'][$i];
                $res['error'][$i]    = $files['error'][$i];
            }
        }

		return $res;
	}

	/*
	 * 上传文件类型为图片时：单个
	 * @param  Array    $images					    待处理图片路径
	 * @param  Array    $opt						图片处理设置
	 * @param  Boolean  $is_save_original_name		是否保留原名
	 * @param  Boolean  $is_save_original_file		是否保留源文件
	 * @param  Boolean  $is_add_domain				是否在返回的 url 中添加域名
	 * @param  Mixed
	 */
	public function saveImage(array $image = array() , $is_save_original_name = false , $is_add_domain = false , $is_handler = false , $opt = array() , $is_save_original_file = false){
		$is_save_original_name = is_bool($is_save_original_name) ? $is_save_original_name : false;
		$is_save_original_file = is_bool($is_save_original_file) ? $is_save_original_file : false;
		$is_add_domain		   = is_bool($is_add_domain)		 ? $is_add_domain		  : false;

		// 获取上传文件中的图片
		$image = self::getImages($image);

		if ($image === false) {
			return false;
		}
	
		$data  = $this->save($image , $is_save_original_name , $is_add_domain);
		
		if (!$is_handler) {
			return $data;
		}
		
		return Image::imageHandler($data['local_path'] , $opt , $is_save_original_name , $is_save_original_file , $is_add_domain);
	}

	/*
	 * 上传文件类型为图片时：多个
	 * @param  Array    $images					    待处理图片路径
	 * @param  Array    $opt						图片处理设置
		$opt = array(
			'width'     => 300 ,	// 处理后图片宽度
			'height'    => 300 ,	// 处理后图片高度
			'extension' => 'jpg'	// 处理后图片保存格式
		);
	 * @param  Boolean  $is_save_original_name		是否保留原名
	 * @param  Boolean  $is_save_original_file		是否保留源文件
	 * @param  Boolean  $is_add_domain				是否在返回的 url 中添加域名
	 * @param  Mixed
	 */
	public function saveImages(array $images = array() , $is_save_original_name = false , $is_add_domain = false , $is_handler = false , $opt = array() , $is_save_original_file = true){
		$is_save_original_name = is_bool($is_save_original_name) ? $is_save_original_name : false;
		$is_save_original_file = is_bool($is_save_original_file) ? $is_save_original_file : false;
		$is_add_domain		   = is_bool($is_add_domain)		 ? $is_add_domain		  : false;
		$is_handler			   = is_bool($is_handler)			 ? $is_handler			  : false;
		
		// 获取上传文件中的图片
		$images = self::getImages($images);

		$data = $this->saveAll($images , $is_save_original_name , $is_add_domain);

		if (empty($data)) {
			return false;
		}

		if (!$is_handler) {
			return $data;
		}

		$images = array();

		foreach ($data as $v)
			{
				$images[] = $v['local_path'];
			}
		
		return Image::imageHandler($images , $opt , $is_save_original_name , $is_save_original_file , $is_add_domain);
	}
}