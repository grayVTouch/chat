<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/16
 * Time: 16:20
 */

use Core\Lib\File;

// 自定义文件加载 + 解析函数
function _config($dir , $key , $args = []){
    if (empty($key)) {
        throw new \Exception('未提供待查找的 key');
    }

    $keys   = explode('.' , $key);
    $len    = count($keys);
    $index  = 0;
    $res    = null;
    static $data = [];

    $do = function($_dir , $v , &$config = []) use(&$do , $dir , &$res , $key , $keys , $len ,  &$index , $args){
        $index++;

        $file = format_path($_dir . $v);

        // var_dump($file);
        // var_dump($v);

        if (File::checkDir($file)) {
            if (!isset($config[$dir][$v])) {
                $config[$dir][$v] = null;
            }

            $file .= '/';
        } else {
            $tmp_file = $file . '.php';

            if ($index == 1) {
                if ($index + 1 == $len && File::checkFile($tmp_file) && !isset($config[$dir][$v])) {
                    $config[$dir][$v] = require_once $tmp_file;
                }
            } else {
                if ($index + 1 == $len && File::checkFile($tmp_file) && !isset($config[$v])) {
                    $config[$v] = require_once $tmp_file;
                }
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
            if ($index == 1) {
                $do($file , $keys[$index] , $config[$dir][$v]);
            } else {
                $do($file , $keys[$index] , $config[$v]);
            }
        }
    };

    $do($dir , $keys[$index] , $data);

    return $res;
}