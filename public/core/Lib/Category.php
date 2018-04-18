<?php

namespace Core\Lib;

/*
 * 获取结构化数据
 */

class Category {
	/*
	 * 获取数据分类数
	 * @param int       $id 
	 * @param array     $data
	 * @param mixed     $opt
	 */
	protected static function _checkArgs($id = 1 , array $data = [] , $opt = null , $save_self = false){
		if (empty(preg_match('/^\d+$/' , $id))) {
			throw new \Exception('参数 1 类型错误');
		}

		if (empty($data)) {
			return false;
		}

		// 检查 id 值是否合法
		if ($save_self) {
			foreach ($data as $v)
            {
                if ($v[$opt['id']] == $id) {
                    return true;
                }
            }

			throw new \Exception('条件：保存自身。在列表集中未找到对应 ' . $opt['id'] . ' 值！请检查当前 '. $opt['id'] .'值 ：' . $id);
		}

		return true;
	}

	/*
	 * 纠正不合理显示的数据
	 */

	protected static function _improveDataView(array $data , $opt = null){
		/*
		 * 纠正表示不合理显示的数据
		 * 例如：pid
		 * pid 在插入数据库时，若是没有提供这个字段，则这个字段默认为 null，并非空字符串 ''
		 * 所以，需要纠正，让其不容易被混淆
		 */
		foreach ($data as $k => $v)
        {
            if (!isset($v[$opt['pid']])) {
                $data[$k][$opt['pid']] = 'null';
            }
        }
		
		return $data;
	}

	/*
	 * 设置通用名称
	 */
	private static function _setFieldName($opt = null){
		if (!isset($opt) || empty($opt)){
			$opt = [
				'id' => 'id',
				'pid' => 'pid'
			];
		}

		return $opt;
	}
	
	/*
	 * 获取当前 id 所在记录的 pid
	 */
	protected static function _getParentId($id = '' , array $data = [] , $opt = null){
		foreach ($data as $v)
        {
            if ($v[$opt['id']] == $id) {
                return $v[$opt['pid']];
            }
        }

		return false;
	}
    
	protected static function _hasChild($id = 1 , array $data = [] , $opt = null){
		foreach ($data as $v)
        {
            if ($v[$opt['pid']] == $id) {
                return true;
            }
        }
		
		return false;
	}

    /*
     * 获取当前传入 id 所在记录
     * @param Integer    $id				 待查找 id	            必须
     * @param Array      $data				 待查找数据集合         必须
     * @param Array      $opt			     设置查找的字段名称		如果字段名称与默认不符，则必须
     * @return Array
     */
    public static function get($id = 1 , array $data = [] , $opt = null){
        $opt  = self::_setFieldName($opt);

        self::_checkArgs($id , $data , $opt , true);

        foreach ($data as $v)
        {
            if ($v[$opt['id']] == $id){
                $v['has_child'] = self::_hasChild($v[$opt['id']] , $data , $opt);
                $v['child']     = [];

                return $v;
            }
        }

        return false;
    }

	/*
	 * 获取所有父级数据
	 * @param Integer    $id				 待查找 id	            必须
	 * @param Array      $data				 待查找数据集合         必须
	 * @param Array      $opt			     设置查找的字段名称		如果字段名称与默认不符，则必须
	 * @param Boolean    $save_structure  是否保留数据结构	    可选
	 * @param Boolean    $save_self		 是否保留自身			可选
	 * @retur Array
	 */
	public static function getParentTree($id = 1 , array $data = [] , $opt = null , $save_structure = false , $save_self = false){
		$opt            = self::_setFieldName($opt);
		$save_structure = is_bool($save_structure)      ? $save_structure : false;
		$save_self	    = is_bool($save_self)		    ? $save_self	  : false;

		$self = self::get($id , $data , $opt);

		// 结构树
		$structure_tree = [];
		// 普通树
        $tree           = [];
		$find           = $id;

		// 保留自身
		if ($save_self) {
		    $structure_tree = $self;
            $tree[]         = $self;
        }

		while ($find)
        {
            $cur = self::get($find , $data , $opt);

            if (!$cur[$opt['pid']]) {
                break;
            }

            $parent = self::get($cur[$opt['pid']] , $data , $opt);

            if ($save_structure) {
                // 保留数据结构
                $parent['child']    = $structure_tree;
                $structure_tree     = $parent;
            } else {
                // 不保留数据结构
                $tree[] = $parent;
            }

            $find = $cur[$opt['pid']];
        }

		return $save_structure ? $structure_tree : $tree;
	}

	// 获取子级数据：保留数据结构
    public static function getChildTreeForStructure($id , array $data = [] , array $opt = [] , $save_self = true){
        self::_checkArgs($id , $data , $opt , $save_self);

        $get = function($find , &$res) use(&$get , $id , $data , $opt , $save_self){
            // 直系子级数据
            $childs = self::getNextChildTree($find , $data , $opt);

            foreach ($childs as $v)
            {
                if ($v['has_child']) {
                    $get($v[$opt['id']] , $v['child']);
                }

                $res[] = $v;
            }
        };

        $res = [];

        if ($save_self) {
            $cur = self::get($id , $data , $opt);
            $res = $cur;


            if ($cur['has_child']) {
                $get($id , $res['child']);
            }
        } else {
            $get($id , $res);
        }

        return $res;
    }

    // 获取子级数据：不保留数据结构
    public static function getChildTreeForNotStructure($id , array $data = [] , array $opt = [] , $save_self = false){
        self::_checkArgs($id , $data , $opt , $save_self);

        $get = function($find) use(&$get , $id , $data , $opt , $save_self , &$res){
            // 直系子级数据
            $childs = self::getNextChildTree($find , $data , $opt);

            foreach ($childs as $v)
            {
                if ($v['has_child']) {
                    $get($v[$opt['id']] , $v['child']);
                }

                $res[] = $v;
            }
        };

        $res = [];

        if ($save_self) {
            $cur = self::get($id , $data , $opt);
            $res[] = $cur;
        }

        $get($id);

        return $res;
    }

	/*
	 * 获取所有子级数据
	 * @param Integer    $id				 待查找 id	            必须
	 * @param Array      $data				 待查找数据集合         必须
	 * @param Array      $opt			     设置查找的字段名称		如果字段名称与默认不符，则必须
	 * @param Boolean    $save_structure     是否保留数据结构	    可选
	 * @param Boolean    $save_self		     是否保留自身			可选
	 * @return Array
	 */
	public static function getChildTree($id = 1 , array $data = [] , $opt = null , $save_structure = false , $save_self = false){
		$opt            = self::_setFieldName($opt);
		$save_structure = is_bool($save_structure)  ? $save_structure : false;
		$save_self	    = is_bool($save_self)		? $save_self	  : false;

		return $save_structure ? self::getChildTreeForStructure($id , $data , $opt , $save_self) : self::getChildTreeForNotStructure($id , $data , $opt , $save_self);
	}

	// 获取上一级父级数据
	public static function getParent($id = 1 , array $data = [] , $opt = null){
		$opt  = self::_setFieldName($opt);

		self::_checkArgs($id , $data , $opt);

		$pid = self::_getParentId($id , $data , $opt);

		if ($pid) {
		    return self::get($pid , $data , $opt);
        }

		return false;
	}

	// 获取下一级子级数据
	public static function getNextChildTree($id = 1 , array $data = [] , $opt = null){
		$opt  = self::_setFieldName($opt);

		self::_checkArgs($id , $data , $opt);

		$res = [];

		foreach ($data as $v) 
        {
            if ($v[$opt['pid']] == $id) {
                $v['has_child']     = self::_hasChild($v[$opt['id']] , $data , $opt);
                $v['child']         = [];

                $res[] = $v;
            }
        }

		return $res;
	}
}