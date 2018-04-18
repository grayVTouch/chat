<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/17
 * Time: 9:58
 */

namespace App\System\Api;

use Illuminate\Support\Facades\Redis;

class ChatRoom extends Controller
{
    // 生成聊天室 id
    // 生成聊天室 id 的规则发生了变化
    // 无论是否是关联订单，在该订单被接收之前，都是采取类似私聊模式
    // 如果订单被接收之后，采取群聊模式
    public static function genChatRoomID($room_type , $user_type , $user_id , $order_id = null){
        if ($room_type === 'advoise') {
            // 平台咨询, room_id = user_type + user_id
            $room_id = "user:{$user_id}";
        } else if ($room_type === 'order') {
            // 前台订单用户交流
            $order = \DB::table('order_info')->where('order_id' , $order_id)->first();

            // 接单之后
            if (is_null($order->tag)) {
                // user_type + user_id + order_id
                $room_id = "user:{$user_id}_order_id:{$order_id}";
            } else {
                if (is_null($order->accept_userid)) {
                    // 接单之前
                    $room_id = "order_id:{$order_id}_user:{$user_id}";
                } else {
                    if ($user_type !== 'user' || ($user_id != $order->accept_userid && $user_id != $order->send_userid)) {
                        // 检查是否是接单人 或 发单人
                        // 如果不是接单人的话，那么仍然是类似私聊模式
                        $room_id = "oder_id:{$order_id}_user:{$user_id}}";
                    } else {
                        // 如果是接单人
                        $room_id = "user:{$order->send_userid}_tag:{$order->tag}";
                    }
                }
            }
        } else {
            // 其他类型,待定!
            return false;
        }

        $room_id = md5($room_id);

        return $room_id;
    }

    // 更新 redis 缓存：用户消息提醒状态
    public static function setChatRoomTipStatusForRedis($status , $room_id , $user_type , $user_id){
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
}