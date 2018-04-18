<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/16
 * Time: 17:51
 */

namespace App\System;


class Message extends Controller
{
    // json 返回
    public static function json($data = []){
        $data = json_encode($data);

        return response($data)->header('content-type' , 'application/json');
    }

    // web 返回
    public static function redirect($data){
        return redirect()->action(WEB_ROUTE_PREFIX . 'Message@show' , $data);
    }

    // 成功
    public static function success($msg , $ajax = false , $location = ''){
        $data = static::format('success' , $msg , $location);

        if ($ajax) {
            return static::json($data);
        }

        return static::redirect($data);
    }

    // 失败
    public static function error($msg , $ajax = false , $location = ''){
        $data = static::format('error' , $msg , $location);

        if ($ajax) {
            return static::json($data);
        }

        return static::redirect($data);
    }

    // 格式化消息
    public static function format($status , $msg , $location = ''){
        return [
            'status'    => $status ,
            'msg'       => $msg ,
            'location'  => $location
        ];
    }
}