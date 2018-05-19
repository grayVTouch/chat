<?php

namespace Lib;

class Image {
	private static $_instance = null;

	function __construct(){
		if (self::$_instance instanceof self) {
			throw new \Exception('不允许重复实例化');
		}	
	}

	final protected function __clone(){
		throw new \Exception('不允许克隆');
	}
	
	public static function getInstance(){
		if (!(self::$_instance instanceof self)) {
			self::$_instance = new Image();
		}

		return self::$_instance;
	}

	/*
	 * 图片处理函数（单个 || 多个）
	 * @param  Mixed    $image_file					待处理图片路径
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
	public static function imageHandler($image_file = '' , $opt = array() , $is_save_original_name = true , $is_save_original_file = true , $is_add_domain = false){
		$is_save_original_name = is_bool($is_save_original_name) ? $is_save_original_name : true;
		$is_save_original_file = is_bool($is_save_original_file) ? $is_save_original_file : true;
		$is_add_domain		   = is_bool($is_add_domain)		 ? $is_add_domain		  : true;

		if (empty($opt)){
			$opt = array(
				'width'     => 300 ,	// 处理后图片宽度
				'height'    => 300 ,	// 处理后图片高度
				'extension' => 'jpg'	// 处理后图片保存格式
			);
		}

		// 等比缩小：宽
		$w = intval($opt['w']);
		// 等比缩小：高
		$h = intval($opt['h']);
		// 保存类型
		$extension = strval($opt['extension']);

		// 提高脚本性能
		$original_memory_limit = ini_get('memory_limit');
		$original_run_time     = ini_get('max_execution_time');
		ini_set('memory_limit' , '2048M');
		set_time_limit(0);
		ignore_user_abort(true);

		$images = array();
		$rel    = array();
		$type_range = array('gif' , 'jpg' , 'png');

		if (!is_array($image_file)) {
			$images[] = $image_file;	
		} else {
			$images = $image_file;
		}

		foreach ($image_file as $v) 
			{
				$fname     = get_filename($v);
				$extension = get_extension($v);
				
				// 只处理图片类型的数据
				if (in_array($extension , $type_range)) {
					// 文件存在才进行处理
					if (File::checkFile($v)) {
						$info = get_image_info($v);
						
						switch ($info['extension'])
							{
								case 'gif':
									$img = imagecreatefromgif($v);
									break;
								case 'jpg':
									$img = imagecreatefromjpeg($v);
									break;
								case 'png':
									$img = imagecreatefrompng($v);
									break;
							}

						$cav = imagecreatetruecolor($w , $h);
						
						// 平滑缩小到指定大小
						imagecopyresampled($cav , $img , 0 , 0 , 0 , 0 , $w , $h , $info['width'] , $info['height']);

						if (!$is_save_original_name) {
							 $fname = date('Y-m-d H-i-s' , time()) . md5_file($v) . '.' . $info['extension'];
						}

						$file = $this->_uploadFileDir . '/' . $fname;

						// 源文件处理
						if (!$is_save_original_file) {
							File::dFile($v);
						}

						// 同名文件处理：删除
						File::dFile($file);

						$file = gbk($file);

						switch ($info['extension'])
							{
							case 'gif':
								$img = imagegif($cav , $file);
								break;
							case 'jpg':
								$img = imagejpeg($cav , $file);
								break;
							case 'png':
								$img = imagepng($cav , $file);
								break;
							}

						$rel[] = array(
							'local_path' => utf8($file) , 
							'url'        => generate_url($file , $is_add_domain)
						);
					}
				}
			}

		ini_set('memory_limit' , $original_memory_limit);
		set_time_limit($original_run_time);
		ignore_user_abort(false);
		
		if (is_string($image_file) && !empty($rel)) {
			return $rel[0];
		}

		return $rel;
	}
}