<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/17
 * Time: 17:50
 */

return [
    // 应用版本
    'version' => '1.0.0' ,
    // 网站域名
    'url' => 'http://192.168.150.135/' ,
    // 单位：秒
    'short_time' => 30 * 60 ,
    // 单位：秒
    'long_time' => 30 * 24 * 3600 ,
    // 页面跳转等待时间
    'wait_time' => 2 ,
    // 系统名称
    'system' => '顽喵' ,
    // 平台客服名称
    'service' => '顽喵客服' ,
    // 默认登录失败跳转连接
    'redirect_for_default' => '/UserSign/showLand' ,
    // pc 端登录系统跳转连接
    'redirect_for_pc' => '/UserSign/showLand' ,
    // admin 端登录系统失败跳转连接
    'redirect_for_admin' => '/UserSign/showLand'
];