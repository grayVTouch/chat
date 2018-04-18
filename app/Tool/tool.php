<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/16
 * Time: 16:20
 */

use Core\Lib\File;
use App\System\Chat\UserVerify;

// 自定义文件加载 + 解析函数
function _config($dir , $key , $args = []){
    if (empty($key)) {
        throw new \Exception('未提供待查找的 key');
    }

    $keys   = explode('.' , $key);
    $len    = count($keys);
    $index  = 0;
    $res    = null;
    // 在内存中维护的数据
    static $data = [];

    $do = function($dir , $v , &$config = []) use(&$do , &$res , $key , $keys , $len ,  &$index , $args){
        $index++;

        $file = format_path($dir . $v);

        // var_dump($file);
        // var_dump($v);

        if (File::checkDir($file)) {
            if (!isset($config[$v])) {
                $config[$v] = null;
            }

            $file .= '/';
        } else {
            $tmp_file = $file . '.php';

            if ($len - 2 < $index && File::checkFile($tmp_file) && !isset($config[$v])) {
                $config[$v] = require_once $tmp_file;
            }
        }

        if ($index === $len) {
            if (!isset($config[$v])) {
                throw new \Exception("未找到 {$key} 对应键值");
            }

            if (is_array($config[$v])) {
                return $res = $config[$v];
            }

            return $res = vsprintf($config[$v] , $args);
        } else {
            $do($file , $keys[$index] , $config[$v]);
        }
    };

    $do($dir , $keys[$index] , $data);

    return $res;
}

// 获取语言包配置文件
function lang($key , $args = []){
    $dir        = resource_path();
    $lang       = config('app.locale');
    $lang_dir   = "{$dir}/lang/{$lang}/";

    return _config($lang_dir , $key , $args);
}

// 获取应用配置文件
function config_($key , $args = []){
    $dir        = public_path();
    $config_dir = "{$dir}/config/";

    return _config($config_dir , $key , $args);
}

// 获取登录用户
function user(){
    return UserVerify::$user;
}