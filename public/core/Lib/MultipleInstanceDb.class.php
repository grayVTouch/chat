<?php
namespace Lib;

/*
 * 事务 + 预处理语句方式执行 SQL 语句，亦可使用原生 SQL 语句（不建议这样使用，存在 SQL 注入风险！）
 */
class MultipleInstanceDb { 
	// 数据库连接实例
	private $_connect		= null;
	// 结果集格式化类型
	private $_relType		= \PDO::FETCH_ASSOC;
    
	function __construct($db_type = 'mysql' , $host = 'local_host' , $db_name = '' , $username = '' , $password = '' , $is_persistent = true , $charset  =  'utf8'){
		$db_type	 	 = isset($db_type)		   ? $db_type       : 'mysql';
		$host			 = isset($host)		       ? $host		    : '127.0.0.1';
		$db_name		 = $db_name;
		$is_persistent   = is_bool($is_persistent) ? $is_persistent : true;
		$charset		 = isset($charset)		   ? $charset	    : 'utf8';
		
		// 数据库连接实例
		$this->_connect = new \PDO($db_type . ":host=" . $host . ";dbname=" . $db_name , $username , $password , [
			\PDO::ATTR_PERSISTENT => $is_persistent , 

			// PDO 驱动比较特殊：即使在数据库配置文件中，已经设置了 utf8 字符集。
			// 其实际表现也会是 gbk 字符集
			// 因而需要在运行时指定 utf8 字符集
			\PDO::MYSQL_ATTR_INIT_COMMAND => 'set names ' . $charset
		]);
	}

	/*
	 * 获取链接对象（PDO对象）
	 */
	public function getConnection(){
		return $this->_connect;
	}

	/*
	 * 获取最后插入数据库的一条数据
	 */
	public function lastInsertId(){
		return $this->_connect->lastInsertId();
	}

	// 以事务 + 预处理语句方式运行 SQL 语句
	private function _execByTransaction(Array $sql = array()){
		if (empty($sql)) {
			return true;
		}
		
		// 设置错误时抛出异常 
		if ($this->_connect->getAttribute(\PDO::ATTR_ERRMODE) !== \PDO::ERRMODE_EXCEPTION) {
			$this->_connect->setAttribute(\PDO::ATTR_ERRMODE , \PDO::ERRMODE_EXCEPTION);
		}

		// 开始事务
		$this->_connect->beginTransaction();

		try {
			// 执行sql语句
			foreach ($sql as $v)
				{
					$keys = array_keys($v);
					$stmt = $this->_connect->prepare($v[$keys[0]]);
					$stmt->execute($v[$keys[1]]);
				}

			// 提交事务
			$this->_connect->commit();
		} catch (\Exception $excp) {
			// 失败时回滚
			$this->_connect->rollBack();
			// 重新抛出错误信息
			throw new \Exception($excp->getMessage());
		}
	}

	// 格式化 PDO 返回的查询结果集
	public function formatQRel(\PDOStatement $PDOStatement){
		return $PDOStatement->fetchAll($this->_relType);
	}

	/*
	 * 预处理语句方式执行 sql 语句
	 * 第一种情况：$sql 是字符串
	 * 第二种情况：$sql 是数组，则须符合下面这种：
		$sql = array(
			// 原生语句
			'select * from person' => array() ,	
			// SQL 预处理语句第一种方式
			'select * from person where name = :nameValue and sex = :sexValue' => array(
				'nameValue' => 'chenxuelong' , 
				'sexValue'  => 'male'
			) , 
			// SQL 预处理语句第二种方式
			'select * from person where name = ? and sex = ?' => array('chenxuelong' , 'male')
		);

	 * @param  Array|String  $sql
	 * @param  Array         $params
	 * @param  Boolean       $transaction_mode
	 * @return QueryResult|Null
	 */
	public function query($sql = '' , Array $params = array() , $transaction_mode = false){
		$type_range		  = array('string' , 'array');
		$sql_type		  = gettype($sql);
		$transaction_mode = is_bool($transaction_mode) ? $transaction_mode : false;

		if (array_search($sql_type , $type_range , true) === false) {
			throw new \Exception('参数 1 类型错误');
		}

		// 字符串时
		if (!$transaction_mode && is_string($sql)) {
			$stmt = $this->_connect->prepare($sql);

			if (!$stmt->execute($params)) {
				$err_msg = $stmt->errorInfo();
				throw new \Exception("执行SQL语句失败：" . $sql . "\r\nSQLState 码：" . $err_msg[0] . "\r\n驱动错误代码：" . $err_msg[1] . "\r\n错误字符串：" . $err_msg[2]);
			}

			return $stmt;
		}

		// 包含正确格式的数据
		$rel = array();

		// 包装成合适的格式
		if (is_array($sql)) {
			$rel = $sql;
		} else {
			$rel[] = $sql;
		}
		
		// 数组时
		self::_execByTransaction($rel);
	} 

	/*
	 * 原生执行获取单行数据，若有多条数据，则只返回其中的第一条数据
	 * 若是获取的记录只有一个字段，则直接返回单元值
	 * 若是获取的记录不止一个字段，则返回整条记录

	 * @param  String $sql      待执行的 SQL 语句
	 * @param  Array  $params   如果是预处理 SQL 语句，则需提供参数
	 * @return Mixed
	 */ 
	public function get($sql = '' , array $params = array()){
		if (!is_string($sql)) {
			throw new \Exception('参数 1 类型错误');
		}

		$result = self::query($sql , $params);
		$result = self::formatQRel($result);
		
		// 无数据时
		if (empty($result)) {
			return false;
		}

		if (count($result) !== 1) {
			throw new \Exception('SQL 语句不合法（只允许返回一行记录 或 一个值）：' . $sql);
		}

		foreach ($result as $v)
			{
				$count = count($v);

				if ($count === 1) {
					$v = array_values($v);

					return $v[0];
				}
				
				return $v;
			}
	}

	/*
	 *原生执行获取所有记录
	 * @param  String $sql      待执行的 SQL 语句
	 * @param  Array  $params   如果是预处理 SQL 语句，则需提供参数
	 * @return Array 
	*/
	public function getAll($sql = '' , array $params = array()){
		if (!is_string($sql)) {
			throw new \Exception('参数 1 类型错误');
		}

		$result = self::query($sql , $params);
		$result = self::formatQRel($result);

		return $result;
	}

	// 防止数据库连接被复制
	final protected function __clone(){
		throw new \Exception('不允许克隆');
	}
}