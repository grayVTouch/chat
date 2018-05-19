<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/18
 * Time: 10:20
 *
 * 视图相关的辅助函数
 */

use App\System\Chat\UserVerify;

// 获取应用配置文件
function config_($key , $args = []){
    $dir        = public_path();
    $config_dir = "{$dir}/config/";

    return _config($config_dir , $key , $args);
}

// 获取用户自定义应用配置文件
function app_config($key , $args = []){
    $key = WEB_CONFIG_PREFIX . $key;

    return config_($key , $args);
}

// 获取用户自定义应用配置文件
function api_config($key , $args = []){
    $key = API_CONFIG_PREFIX . $key;

    return config_($key , $args);
}

// 获取语言包配置文件
function lang($key , $args = []){
    $dir        = resource_path();
    $lang       = config('app.locale');
    $lang_dir   = "{$dir}/lang/{$lang}/";

    return _config($lang_dir , $key , $args);
}

// 获取登录用户
function user(){
    return UserVerify::user();
}