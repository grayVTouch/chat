<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/5/9
 * Time: 15:57
 *
 * 数据加密、解密
 */

namespace Core\System;


class Encryption
{
    // 随机生成的 20 位长度值
    public static $prefix = 'lyeA2tcp7004U2bu3wZ0';

    // 随机生成的 20 为长度值
    public static $suffix = 'l9e7552QPooOIqR2175i';

    // 检查格式是否正确
    public static function check($str = ''){
        try {
            $len = strlen($str);

            if (odd_even($len) !== 'even') {
                return false;
            }

            $origin = hex2bin($str);
            $origin = base64_decode($origin);
            $prefix = self::$prefix;
            $suffix = self::$suffix;
            $reg_for_prefix = "/{$prefix}/";
            $reg_for_suffix = "/{$suffix}/";

            return preg_match($reg_for_prefix , $origin) && preg_match($reg_for_suffix , $origin);
        } catch (\Exception $excep) {
            return false;
        }
    }

    // 加密
    public static function encrypt($v){
        $base64 = base64_encode($v);
        $base64 = self::$prefix . $base64 . self::$suffix;
        $base64 = base64_encode($base64);
        $hex = bin2hex($base64);

        return $hex;
    }

    // 解密
    public static function decrypt($v){
        if (!self::check($v)) {
            return false;
        }

        $v = hex2bin($v);
        $v = base64_decode($v);
        $v = str_replace(self::$prefix , '' , $v);
        $v = str_replace(self::$suffix , '' , $v);

        return base64_decode($v);
    }
}