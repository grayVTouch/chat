<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/18
 * Time: 10:20
 *
 * 视图相关的辅助函数
 */

// 获取用户自定义应用配置文件
function app_config($key , $args = []){
    $key = WEB_CONFIG_PREFIX . $key;

    return config_($key , $args);
}