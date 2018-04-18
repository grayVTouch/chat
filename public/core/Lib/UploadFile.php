<?php
namespace Core\Lib;

class UploadFile {
	protected $_uploadFileDir = '';

	function __construct($upload_file_dir = ''){
		if (!File::checkDir($upload_file_dir)) {
			File::cDir($upload_file_dir);
		}

		$upload_file_dir = format_path($upload_file_dir);

		$this->_uploadFileDir = $upload_file_dir;
	}

	/*
	 * 格式化 $_FILES 数组
	 * @param  Array $files
	 * @return Array array($file0 , $files1 , $files2 ....);
	 
	 * 传入的参数：
	   $args = array(
	      'name'     => array(
							'test.php' , 
							'test.index'
					    ) ,
		  'size'     => array(...) ,
		  'tmp_name' => array(...) , 
		  'type'     => array(...) , 
		  'error'    => array(...)

	   );
	 * 返回的结果：
	   $result = array(
		  'name'	 => 'test.gif' ,
		  'size'	 => 1024  ,
		  'type'	 => 'image/gif'  , 
		  'tmp_name' => 'test.tmp' ,
		  'error'	 => 0
	   );
	 */
	public static function format(array $files = array()){
		if (empty($files)) {
			return false;
		}

		$result = array();

		if (!is_array($files['tmp_name'])) {
			$result[] = $files;
		} else {
			$len = count($files['tmp_name']);
			
			// 无上传文件！
			if ($len === 1 && empty($files['tmp_name'][0])) {
				return false;
			}

			for ($i = 0; $i < $len; ++$i)
				{
					$file			  = array();
					$file['name']	  = $files['name'][$i];
					$file['size']	  = $files['size'][$i];
					$file['type']     = $files['type'][$i];
					$file['tmp_name'] = $files['tmp_name'][$i];
					$file['error']    = $files['error'][$i];
					$result[]		  = $file;
				}
		}

		return $result;
	}

	private static function _checkError($err_level = 0){
		switch ($err_level)
			{
				case 0:
					return true;
				case 1:
					throw new \Exception('单个上传文件超过最大限制，单个上传文件最大允许：' . ini_get('upload_max_filesize'));
				case 2:
					throw new \Exception('上传文件总大小超过PHP post_max_size 限制，上传文件总大小最大允许： ' . ini_get('post_max_size'));
				case 3:
					throw new \Exception('部分文件上传');
				case 4:
					throw new \Exception('上传文件丢失');
				case 5:
					throw new \Exception('临时文件夹丢失');
				case 6:
					throw new \Exception('写入到临时文件夹错误');
				default:
					throw new \Exception('Unkown Upload File Error，Error Level：' . $err_level);
			}
	}

	/*
	 * 检查无上传文件
	 */
	public static function emptyFile(array $file = []){
		if (empty($file)) {
			return true;
		}

		if (empty($file['tmp_name'])) {
			return true;
		}

		return false;
	}

	/*
	 * 保存单个上传文件
	 * @param  Array    待上传的文件集合
	 * @param  Boolean  是否保存源文件名称
	 * @param  Boolean  是否在返回的 url 中添加网站域名
	 */
	public function save(array $file = array() , $is_save_original_name = false , $is_add_domain = false){        
		if (empty($file)) {
			return false;
		}

		$is_save_original_name = is_bool($is_save_original_name) ? $is_save_original_name : false;
		$is_add_domain         = is_bool($is_add_domain)		 ? $is_add_domain		  : false;

		// print_r($file);

		self::_checkError($file['error']);

		$fname     = get_filename($file['name']);
		$extension = get_extension($file['name']);

		if (!$is_save_original_name) {
			$fname = 'upload-' . date('Y-m-d H-i-s' , time()) . md5_file($file['tmp_name']) . '.' . $extension;
		}

		// 根据日期创建文件夹，对文件进行分类
		$date		  = date('Y-m-d' , time());
		$cur_date_dir = $this->_uploadFileDir . '/' . $date;
		
		if (!File::checkDir($cur_date_dir)) {
			File::cDir($cur_date_dir);
		}
		
		$file_path = $cur_date_dir . '/' . $fname;
		$file_path = gbk($file_path);

		if (!move_uploaded_file($file['tmp_name'] , $file_path)) {
			return false;
		}

		return array(
			'local_path' => utf8($file_path) , 
			'url'        => generate_url($file_path , ROOT_DIR , URL ,  $is_add_domain)
		);
	}

	public function saveAll(array $file_list = array() , $is_save_original_name = false , $is_add_domain = false){
		$files = self::format($file_list);
		
		// 如果没有上传文件时
		if ($files === false) {
			return false;
		}

		$is_save_original_name = is_bool($is_save_original_name) ? $is_save_original_name : false;
		$is_add_domain         = is_bool($is_add_domain)		 ? $is_add_domain		  : false;

		$rel = array();

		$failed = array();

		foreach ($files as $v)
			{
				self::_checkError($v['error']);

				$fname     = get_filename($v['name']);
				$extension = get_extension($v['name']);

				if (!$is_save_original_name) {
					$fname = 'upload-' . date('Y-m-d H-i-s' , time()) . md5_file($v['tmp_name']) . '.' . $extension;
				}

				// 根据日期创建文件夹，对文件进行分类
				$date		  = date('Y-m-d' , time());
				$cur_date_dir = $this->_uploadFileDir . '/' . $date;
				
				if (!File::checkDir($cur_date_dir)) {
					File::cDir($cur_date_dir);
				}
				
				$file_path = $cur_date_dir . '/' . $fname;
				
				// 已存在同名文件：删掉
				File::dFile($file_path);
				
				$file_path = gbk($file_path);

				if (!move_uploaded_file($v['tmp_name'] , $file_path)) {
					$v['path'] = $file_path;
					$failed[]  = $v;
				}
				
				$file_path = utf8($file_path);

				$rel[] = array(
					'local_path' =>  $file_path , 
					'url'        => generate_url($file_path , ROOT_DIR , URL ,  $is_add_domain)
				);
			}

		if (!empty($failed)) {
			throw new \Exception(json_encode($failed));
		}

		return $rel;
	}
}