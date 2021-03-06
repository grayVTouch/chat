<?php
/**
 * Created by PhpStorm.
 * User: grayvtouch
 * Date: 18-4-8
 * Time: 上午9:42
 */

namespace App\Http\Controllers\Api;

use App\System\Room as SRoom;
use App\System\Message;
use App\System\Order;
use Core\System\Encryption;


class Room extends Controller
{
    // 生成聊天室 id 的 api
    public function genRoomId(){
        $data = [];

        // 必填参数 room_type: advoise order
        $data['room_type']  = isset($_POST['room_type'])    ? $_POST['room_type']   : '';
        $data['user_type']  = isset($_POST['user_type'])    ? Encryption::decrypt($_POST['user_type'])   : '';
        $data['user_id']    = isset($_POST['user_id'])      ? Encryption::decrypt($_POST['user_id'])     : '';

        // 可选参数（如果 room_type = order，则是必填）
        $data['order_id']   = isset($_POST['order_id'])  ? $_POST['order_id'] : '';

        $room_types = config_(API_CONFIG_PREFIX . 'business.room_type');
        $user_types = config_(API_CONFIG_PREFIX . 'business.user_type');

        if (!in_array($data['room_type'] , $room_types)) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '003') , true);
        }

        if (!in_array($data['user_type'] , $user_types)) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '004') , true);
        }

        if ($data['user_id'] === '') {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '005') , true);
        }

        if ($data['user_type'] === 'admin') {
            $count = \DB::table('admin_users')->where('id' , $data['user_id'])->count();
        } else {
            $count = \DB::table('users')->where('id' , $data['user_id'])->count();
        }

        if ($count === 0) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '006') , true);
        }

        if ($data['room_type'] === 'order') {
            if ($data['order_id'] === '') {
                return Message::error(lang(CONTROLLER_LANG_PREFIX . '007') , true);
            } else {
                $count = \DB::table('order_info')->where('order_id' , $data['order_id'])->count();

                if ($count === 0) {
                    return Message::error(lang(CONTROLLER_LANG_PREFIX . '008') , true);
                }
            }
        }

        $room = SRoom::genRoomId($data['room_type'] , $data['user_type'] , $data['user_id'] , $data['order_id']);

        if (!$room['status']) {
            return Message::error($room['msg'] , true);
        }

        $room_id = $room['msg'];

        return Message::success([
            'id' => $room_id ,
            'type' => $data['room_type']
        ]);
    }

    // 订单咨询-获取用户信息
    public function getOtherSideForAdvoise(){
        $data = [];

        $data['room_id']    = isset($_POST['room_id']) ? $_POST['room_id'] : '';
        $data['user_type']  = isset($_POST['user_type'])    ? Encryption::decrypt($_POST['user_type'])   : '';
        $data['user_id']    = isset($_POST['user_id'])      ? Encryption::decrypt($_POST['user_id'])     : '';

        if ($data['user_type'] == 'admin') {
            // $related_user = \DB::table('users')->where('room_id' , $data['room_id'])->join();
        } else {
            $info = [
                'username'  => app_config(API_MODULE . '.app.service') ,
                'thumb'     => app_config(API_MODULE . '.app.thumb')
            ];
        }
    }

    // 创建聊天室,返回聊天室id
    public function createRoom(){
        $data = [];

        // 必填参数 room_type: advoise order
        $data['room_type']  = isset($_POST['room_type'])    ? $_POST['room_type']   : '';
        $data['user_type']  = isset($_POST['user_type'])    ? $_POST['user_type']   : '';
        $data['user_id']    = isset($_POST['user_id'])      ? $_POST['user_id']     : '';

        // 可选参数（如果 room_type = order，则是必填）
        $data['order_id']   = isset($_POST['order_id'])  ? $_POST['order_id'] : null;

        $room_types = config_(API_CONFIG_PREFIX . 'business.room_type');
        $user_types = config_(API_CONFIG_PREFIX . 'business.user_type');

        if (!in_array($data['room_type'] , $room_types)) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '003') , true);
        }

        if (!in_array($data['user_type'] , $user_types)) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '004') , true);
        }

        if ($data['user_id'] === '') {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '005') , true);
        }

        if ($data['user_type'] === 'admin') {
            $count = \DB::table('admin_users')->where('id' , $data['user_id'])->count();
        } else {
            $count = \DB::table('users')->where('id' , $data['user_id'])->count();
        }

        if ($count === 0) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '006') , true);
        }

        if ($data['room_type'] === 'order') {
            if (empty(['order_id'])) {
                return Message::error(lang(CONTROLLER_LANG_PREFIX . '007') , true);
            }

            $count = \DB::table('order_info')->where('order_id' , $data['order_id'])->count();

            if ($count === 0) {
                return Message::error(lang(CONTROLLER_LANG_PREFIX . '008') , true);
            }
        }

        $data['order_id'] = empty($data['order_id']) ? null : $data['order_id'];

        // 聊天室 id
        $room = SRoom::genRoomId($data['room_type'] , $data['user_type'] , $data['user_id'] , $data['order_id']);

        if (!$room['status']) {
            return Message::error($room['msg'] , true);
        }

        $room_id = $room['msg'];

        // 锁定聊天室正在咨询的订单
        if ($data['room_type'] === 'order') {
            SRoom::lockOrder($room_id , $data['order_id']);
        }

        // 检查是否已经创建过聊天室
        $count = \DB::table('room')->where('id' , $room_id)->count();
        $_room = [
            'id'    => $room_id ,
            'name'  => $room_id ,
            'type'  => $data['room_type'] ,
            'user_type_for_from' => $data['user_type'] ,
            'user_id_for_from'   => $data['user_id']
        ];

        if ($data['room_type'] == 'order') {
            $order = \DB::table('order_info')->where('order_id' , $data['order_id'])->first();

            $_room = array_merge($_room , [
                'user_type_for_to'  => 'user' ,
                'user_id_for_to'  => $order->send_userid ,
                'is_related' => 0
            ]);
        } else {
            $_room = array_merge($_room , [
                'user_type_for_to'  => null ,
                'user_id_for_to'  => null ,
                'is_related' => 0
            ]);
        }

        if ($count === 0) {
            \DB::transaction(function() use(&$room_id , &$data , $_room){
                // 创建聊天室
                \DB::table('room')->insert($_room);

                // 创建未读记录
                \DB::table('room_log_count')->insert([
                    'room_id' => $room_id ,
                    'user_type' => $data['user_type'] ,
                    'user_id' => $data['user_id']
                ]);
            });
        }

        // 生成的面向对象的房间名称（而非实际的房间 id，可能是！）
        $name = SRoom::genRoomName($data['room_type'] , $room_id , $data['user_type'] , $data['user_id']);
        $_room['_name'] = $name;

        return Message::success($_room , true);
    }

    // 创建关联聊天室
    public static function createRoomForRelatedOrder($user_id , $order_id){
        $data = [];

        $data['user_type']  = isset($_POST['user_type'])    ? Encryption::decrypt($_POST['user_type'])   : '';
        $data['user_id']    = isset($_POST['user_id'])      ? Encryption::decrypt($_POST['user_id'])     : '';
        $data['order_id']   = isset($_POST['order_id'])  ? $_POST['order_id'] : '';

        if ($data['user_type'] !== 'user') {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '004') , true);
        }

        if ($data['user_id'] === '') {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '005') , true);
        }

        $count = \DB::table('users')->where('id' , $data['user_id'])->count();

        if ($count === 0) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '006') , true);
        }

        if ($data['order_id'] === '') {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '007') , true);
        }

        $count = \DB::table('order_info')->where('order_id' , $data['order_id'])->count();

        if ($count === 0) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '008') , true);
        }

        $room_id = SRoom::genRoomIdForRelatedOrder($data['user_type'] , $data['user_id'] , $data['order_id']);

        // 检查是否已经创建过聊天室
        $count = \DB::table('room')->where('id' , $room_id)->count();

        if ($count === 0) {
            \DB::transaction(function() use(&$room_id , &$data){
                $order = \DB::table('order_info')->where('order_id' , $data['order_id'])->first();

                // 创建聊天室
                \DB::table('room')->insert([
                    'id'    => $room_id ,
                    'name'  => $room_id ,
                    'type'  => $data['room_type'] ,
                    'user_type_for_from' => $data['user_type'] ,
                    'user_id_for_from'   => $data['user_id'] ,
                    'user_type_for_to'  => 'user' ,
                    'user_id_for_to'    => $order->send_userid ,
                    'is_related' => 0
                ]);

                // 创建未读记录
                \DB::table('room_log_count')->insert([
                    'room_id'   => $room_id ,
                    'user_type' => $data['user_type'] ,
                    'user_id'   => $data['user_id']
                ]);
            });
        }

        // 生成的面向对象的房间名称（而非实际的房间 id，可能是！）
        $name = SRoom::genRoomName($data['room_type'] , $room_id , $data['user_type'] , $data['user_id']);

        return Message::success([
            'id'    => $room_id ,
            'type'  => 'order' ,
            'name'  => $room_id ,
            '_name' => $name ,
            'user_type' => $data['user_type'] ,
            'user_id' => $data['user_id'] ,
        ] , true);
    }

    // 添加用户到聊天室
    // 返回添加到聊天室的用户数量
    public function joinRoom(){
        $data = [];

        $data['room_id']    = isset($_POST['room_id']) ? $_POST['room_id'] : '';
        $data['users']      = isset($_POST['users'])   ? json_decode($_POST['users'] , true) : [];

        $length = 0;

        \DB::transaction(function() use(&$data , &$length){
            foreach ($data['users'] as $v)
            {
                $count = \DB::table('room_user')->where([
                    ['room_id' , '=' , $data['room_id']] ,
                    ['user_type' , '=' , $v['user_type']] ,
                    ['user_id' , '=' , $v['user_id']] ,
                ])->count();

                // 不存在该成员,添加
                if ($count === 0) {
                    \DB::table('room_user')->insert([
                        'room_id'  => $data['room_id'] ,
                        'user_type'     => $v['user_type'] ,
                        'user_id'       => $v['user_id']
                    ]);

                    $length++;
                }
            }
        });

        return Message::success($length , true);
    }

    // 获取指定用户聊天室
    public function getRooms(){
        $data = [];

        $data['user_type']  = isset($_POST['user_type'])   ? $_POST['user_type']  : '';
        $data['user_id']    = isset($_POST['user_id'])   ? $_POST['user_id']  : '';

        $data['user_type']  = Encryption::decrypt($data['user_type']);
        $data['user_id']    = Encryption::decrypt($data['user_id']);

        $rooms = \DB::table('room_user as ru')
            ->join('room as r' , 'ru.room_id' , '=' , 'r.id')
            ->where([
                ['ru.user_type' , '=' , $data['user_type']] ,
                ['ru.user_id' , '=' , $data['user_id']]
            ])
            ->select('r.*' , 'ru.tip')
            ->get();

        // 针对房间名做修改
        foreach ($rooms as &$v)
        {
            $v->_name = SRoom::genRoomName($v->type , $v->id , $data['user_type'] , $data['user_id']);
        }

        return Message::success($rooms , true);
    }

    // 聊天记录
    public function history(){
        // 每页显示 20 条记录
        $limit = config_(API_CONFIG_PREFIX . 'page.limit');
        $data = [];

        $data['page']       = isset($_POST['page'])         ? intval($_POST['page'])    : 1;
        $data['room_id']    = isset($_POST['room_id'])      ? $_POST['room_id']   : '';
        // 最早一条记录的 identifier
        $data['identifier'] = isset($_POST['identifier'])   ? $_POST['identifier']              : '';

        // 获取聊天记录列表的最早一条记录，获取其 storage + id
        // 如果 storage = redis，这边也会出现一个问题！！！！
        // 我应该为每个记录生成一个统一的唯一ID！
        // 从数据库查询该 id，如果不存在，表明该记录实际实是在 redis 中
        // 直接分页开始
        // 如果找到了！那么表示该数据实在 mysql 中，获取 id
        // 找到小于该 id 的记录进行分页！
        $where = [
            ['room_id' , '=' , $data['room_id']]
        ];
        $count  = \DB::table('chat')->where('identifier' , $data['identifier'])->count();
        $offset = ($data['page'] - 1) * $limit;

        if ($count > 0) {
            // 该数据在 mysql 中
            $id = \DB::table('chat')->where('identifier' , $data['identifier'])->value('id');
            $where[] = ['id' , '<' , $id];
        }

        // 总记录数
        $total = \DB::table('chat')->where($where)->count();
        $max_page = ceil($total / $limit);
        $max_page = $max_page < 1 ? 1 : $max_page;
        $data['page'] = $data['page'] > $max_page ? $max_page : $data['page'];

        // 历史记录
        // 按 id 升序排序
        $history = \DB::table('chat')
            ->where($where)
            ->offset($offset)
            ->orderBy('id' , 'desc')
            ->limit($limit)
            ->get();

        $history = Sroom::multipleHandleForHistory($history);
        $json = [
            'page'      => $data['page'] ,
            'max_page'  => $max_page ,
            'count'     => $total ,
            'limit'     => $limit ,
            'history'   => $history
        ];

        return Message::success($json , true);
    }

    // 发起订单争议
    public function addOrderDispute(){
        $data = [];
        $data['order_id']   = isset($_POST['order_id']) ? $_POST['order_id'] : '';
        // 发起订单争议的绝对是普通用户
        $data['user_id']    = isset($_POST['user_id']) ? $_POST['user_id'] : '';
        $data['title']      = isset($_POST['title']) ? $_POST['title'] : '';
        $data['description'] = isset($_POST['description']) ? $_POST['description'] : '';

        if ($data['user_id'] === '') {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '005') , true);
        }

        $count = \DB::table('users')->where('id' , $data['user_id'])->count();

        if ($count === 0) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '006') , true);
        }

        if ($data['order_id'] === '') {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '007') , true);
        }

        $count = \DB::table('order_info')->where('order_id' , $data['order_id'])->count();

        if ($count === 0) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '008') , true);
        }

        $data['room_id'] = SRoom::genRoomId('order' , 'user' , $data['user_id'] , $data['order_id']);

        // var_dump($data['room_id']);

        // 检查某个订单是否存在尚未解决的争议
        $count = \DB::table('order_dispute')->where([
            ['order_id' , '=' , $data['order_id']] ,
            ['status' , '=' , 0]
        ])->count();

        if ($count > 0) {
            // 存在尚未解决的争议时，不允许继续添加
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '009') , true);
        }

        \DB::table('order_dispute')->insert([
            'room_id'   => $data['room_id'] ,
            'order_id' => $data['order_id'] ,
            'user_id' => $data['user_id'] ,
            'title' => $data['title'] ,
            'description' => $data['description']
        ]);

        return Message::success(lang('Tip.insert_success') , true);
    }

    // 设置订单争议状态
    public function setOrderDisputeStatus(){
        $data = [];

        $data['order_dispute_id']   = isset($_POST['order_dispute_id']) ? $_POST['order_dispute_id'] : '';
        $data['user_id']    = isset($_POST['user_id']) ? $_POST['user_id'] : '';
        $data['status']     = isset($_POST['status']) ? $_POST['status'] : '';

        // 更新 mysql
        \DB::transaction(function() use(&$data){
            $update = [
                'status' => $data['status']
            ];

            $order_dispute = \DB::table('order_dispute')->where('id' , $data['order_dispute_id'])->first();

            if ($data['status'] == 1) {
                $update['service_id'] = $data['user_id'];

                $tip = 2;
            } else {
                $tip = 1;
            }

            // 争议被解决了，更新聊天室的客服的消息提醒状态：设置不提醒
            \DB::table('room_user')->where([
                ['room_id' , '=' , $order_dispute->room_id] ,
                ['user_type' , '=' , 'admin']
            ])->update([
                'tip' => $tip
            ]);

            \DB::table('order_dispute')->where('id' , $data['order_dispute_id'])->update($update);

            $data['room_id'] = $order_dispute->room_id;
        });

        $users = \DB::table('room_user')->where([
            ['room_id' , '=' , $data['room_id']] ,
            ['user_type' , '=' , 'admin']
        ])->get();

        // 更新 redis 缓存的客服针对该聊天室的数据
        foreach ($users as $v)
        {
            SRoom::setRoomTipStatusForRedis($data['status'] , $v['room_id'] , $v['user_type'] , $v['user_id']);
        }

        return Message::success(lang('Tip.update_success') , true);
    }

    // 设置聊天室消息未读消息数量
    public function setMessageCount(){
        $data = [];
        $data['room_id']    = isset($_POST['room_id'])      ? $_POST['room_id'] : '';
        $data['user_type']  = isset($_POST['user_type'])    ? $_POST['user_type'] : '';
        $data['user_id']    = isset($_POST['user_id'])      ? $_POST['user_id'] : '';

        // 更新 mysql
        \DB::table('room_log_count')->where([
            ['room_id' , '=' , $data['room_id']] ,
            ['user_type' , '=' , $data['user_type']] ,
            ['user_id' , '=' , $data['user_id']] ,
        ])->update([
            'count' => 0
        ]);

        // 更新 redis 缓存
        SRoom::setMessageCountForRedis($data['room_id'] , $data['user_type'] , $data['user_id']);

        // 更新数据成功
        return Message::success(lang("Tip.update_success") , true);
    }

    // 获取用户对应聊天室消息提醒状态
    public function getTip(){
        $data = [];

        $data['room_id'] = isset($_POST['room_id']) ? $_POST['room_id'] : '';
        $data['user_type'] = isset($_POST['user_type']) ? $_POST['user_type'] : '';
        $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';

        $tip = \DB::table('room_user')->where([
            ['room_id' , '=' , $data['room_id']] ,
            ['user_type' , '=' , $data['user_type']] ,
            ['user_id' , '=' , $data['user_id']]
        ])->value('tip');

        return Message::success($tip , true);
    }

}