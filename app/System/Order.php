<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/26
 * Time: 17:25
 */

namespace App\System;

use Core\System\Encryption;

class Order extends Controller
{
    // 检查是否存在未解决的争议订单
    public static function existsUnresolveDisputeOrder($order_id){
        return \DB::table('order_dispute')->where([
            ['order_id' , '=' , $order_id] ,
            ['status' , '=' , 0]
        ])->count();
    }

    // 单条：订单处理
    public static function singleOrderHandle($stdClass){
        // 是否存在未解决的争议
        $stdClass->exists_unresolve_dispute_order = self::existsUnresolveDisputeOrder($stdClass->order_id);

        $stdClass->user_type_for_send = 'user';
        $stdClass->user_type_for_accept = 'user';
        $stdClass->user_id_for_send = $stdClass->send_userid;
        $stdClass->user_id_for_accept = $stdClass->accept_userid;

        return $stdClass;
    }
}