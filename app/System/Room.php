<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/17
 * Time: 9:58
 */

namespace App\System;

use Illuminate\Support\Facades\Redis;
use App\System\User;

class Room extends Controller
{
    // 生成聊天室 id
    // 生成聊天室 id 的规则发生了变化
    // 无论是否是关联订单，在该订单被接收之前，都是采取类似私聊模式
    // 如果订单被接收之后，采取群聊模式
    public static function genRoomId($room_type , $user_type , $user_id , $order_id = null){
        if ($room_type === 'advoise') {
            if ($user_type !== 'user') {
                // 非前台用户不允许发起咨询！！
                return [
                    'status' => false ,
                    'msg' => '咨询仅允许普通用户发起聊天'
                ];
            }

            // 咨询, room_id = user_type + user_id
            $room_id = "{$user_type}:{$user_id}";
        } else if ($room_type === 'order') {
            // 前台订单用户交流
            $order = \DB::table('order_info')->where('order_id' , $order_id)->first();

            // 检查当前发起会话的用户是否是发单人自身！如果是自身的话不允许发起会话
            if ($user_type === 'user' && $user_id == $order->send_userid) {
                return [
                    'status'    => false ,
                    'msg'       => '不允许与自己发布的订单创建会话'
                ];
            }

            $room_id = "{$user_type}:{$user_id}_user:{$order->send_userid}";
        } else {
            return [
                'status' => false ,
                'msg' => '不支持的聊天室类型'
            ];
        }

        $room_id = md5($room_id);

        return [
            'status'    => true ,
            'msg'       => $room_id
        ];
    }

    // 创建关联订单聊天室
    public static function genRoomIdForRelatedOrder($user_type , $user_id , $order_id){
        $order = \DB::table('order_info')->where('order_id' , $order_id)->first();

        if ($user_type !== 'user') {
            return [
                'status' => false ,
                'msg' => '只允许普通用户发起争议处理'
            ];
        }

        if (empty($order->accept_userid)) {
            return [
                'status' => false ,
                'msg' => '仅存在接单人的订单所在的聊天室允许发起争议'
            ];
        }

        if (($user_id != $order->send_userid && $user_id != $order->accept_userid)) {
            return [
                'status' => false ,
                'msg' => '仅允许发单人或接单人发起争议'
            ];
        }

        if (empty($order->tag)) {
            return [
                'status' => false ,
                'msg' => '非关联订单不允许创建关联聊天室！'
            ];
        }

        $room_id = "{$user_type}:{$user_id}_user:{$order->send_userid}_tag:{$order->tag}";
        $room_id = md5($room_id);

        return [
            'status' => true ,
            'msg' => $room_id
        ];
    }

    // 更新 redis 缓存：用户消息提醒状态
    public static function setRoomTipStatusForRedis($status , $room_id , $user_type , $user_id){
        $kv = md5("{$room_id}_{$user_type}_{$user_id}");

        // 用户针对该房间的设置信息
        $k_for_user_room_info = "room_user_info_{$kv}";

        if (!Redis::exists($k_for_user_room_info)) {
            // 如果数据没有被缓存起来，跳过
            return ;
        }

        // 获取用户信息
        $v_for_user_room_info           = Redis::get($k_for_user_room_info);
        $v_for_user_room_info           = json_decode($v_for_user_room_info , true);
        $v_for_user_room_info['tip']    = $status;
        $v_for_user_room_info           = json_encode($v_for_user_room_info);

        // 更新缓存
        Redis::set($k_for_user_room_info , $v_for_user_room_info);
    }

    // 更新 redis 缓存：用户某个聊天室的未读消息数量
    public static function setMessageCountForRedis($room_id , $user_type , $user_id){
        // 更新 redis 缓存
        $kv = "{$room_id}_{$user_type}_{$user_id}";
        $k_for_user_room_log_count = "room_log_count_{$kv}";

        if (Redis::exists($k_for_user_room_log_count)) {
            Redis::set($k_for_user_room_log_count , 0);
        }
    }

    // 获取房间
    public static function getRoom($room_id){
        return \DB::table('room')->where('id' , $room_id)->first();
    }

    // 根据不同的聊天类型 + 用户类型自动生成对应的聊天室名称
    public static function genRoomName($room_type , $room_id , $user_type , $user_id){
        $room   = self::getRoom($room_id);

        // 获取聊天室发起者
        if ($room_type === 'advoise') {
            // 平台咨询
            if ($user_type === 'admin') {
                $user = User::getUser($room->user_type_for_from , $room->user_id_for_from);
                // 聊天室名称 = 咨询 + 用户名
                $name = '平台咨询-' . $user->username ?? '尚未设置用户名';
            } else if ($user_type === 'user') {
                $name = app_config('app.service');
            } else {
                $name = $room_id;
            }
        } else if ($room_type === 'order') {
            $from   = User::getUser($room->user_type_for_from , $room->user_id_for_from);
            $to     = User::getUser($room->user_type_for_to , $room->user_id_for_to);

            // 检查是否是关联订单聊天室
            if ($room->is_related) {
                return "关联订单-" . $room->name;
            } else {
                if ($from->user_type == $user_type && $from->user_id == $user_id) {
                    // 咨询者
                    $name = $to->username ?? '尚未设置用户名';
                } else if ($to->user_type == $user_type && $to->user_id == $user_id) {
                    // 接受者
                    if ($from->user_type == 'admin') {
                        $name = '顽喵平台-' . $from->username ?? '尚未设置用户名';
                    } else {
                        $name = $from->username ?? '尚未设置用户名';
                    }
                } else {
                    // 介入者
                    $name = "订单咨询-" . $room->name;
                }
            }
        } else {
            $name = $room_id;
        }

        return $name;
    }

    // 锁定聊天室正在咨询的订单
    public static function lockOrder($room_id , $order_id){
        $k_for_order_consultation = "order_consultation_{$room_id}";

        // 锁定
        Redis::set($k_for_order_consultation , $order_id);
    }

    // 聊天室记录处理：多条
    public static function multipleHandleForHistory($data){
        foreach ($data as &$v)
        {
            $v = self::singleHandleForHistory($v);
        }

        return $data;
    }

    // 聊天室记录处理：单条
    public static function singleHandleForHistory($stdClass){
        // 新增用户名
        $user = User::getUser($stdClass->user_type , $stdClass->user_id);

        // 用户名
        $stdClass->username = $user->username ?? '尚未设置用户名';
        // 用户头像
        $stdClass->thumb = $user->thumb ?? api_config('res.thumb');

        return $stdClass;
    }
}