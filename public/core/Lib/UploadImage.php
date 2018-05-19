<?php
namespace Core\Lib;

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
	 * @param  Array    $images		        待处理图片路径
	 * @param  Boolean  $save_origin		是否保留原名
	 * @param  Mixed
	 */
	public function saveImage(array $image = array() , $save_origin = false){
		$save_origin = is_bool($save_origin) ? $save_origin : false;

		// 获取上传文件中的图片
		$image = self::getImages($image);

		if ($image === false) {
			return false;
		}
	
		return $this->save($image , $save_origin);
	}

	/*
	 * 上传文件类型为图片时：多个
	 * @param  Array    $images					    待处理图片路径
	 * @param  Boolean  $save_origin		是否保留原名
	 * @param  Mixed
	 */
	public function saveImages(array $images = array() , $save_origin = false){
		$save_origin = is_bool($save_origin) ? $save_origin : false;
		
		// 获取上传文件中的图片
		$images = self::getImages($images);

		return $this->saveAll($images , $save_origin);
	}
}