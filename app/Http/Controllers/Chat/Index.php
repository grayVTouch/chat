<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/17
 * Time: 17:16
 */

namespace App\Http\Controllers\Chat;


class Index extends Controller
{
    public function index(){
        $data = [];

        // 要创建的聊天室类型
        $data['type']  = isset($_GET['type'])      ? $_GET['type'] : '';
        // 如果是订单咨询，请提供 订单id
        $data['id']   = isset($_GET['id'])  ? $_GET['id'] : '';

        $view_data = [];
        $view_data['user'] = user();
        $view_data = array_merge($view_data , $data);

        return view(CONTROLLER_VIEW_PREFIX . 'index' , $view_data);
    }

    // 查看测试页面（用于填充模板）
    public function test(){
        $data = [];

        // 要创建的聊天室类型
        $data['room_type']  = isset($_GET['room_type'])      ? $_GET['room_type'] : '';
        // 如果是订单咨询，请提供 order_id
        $data['order_id']   = isset($_GET['order_id'])  ? $_GET['order_id'] : '';

        $view_data = [];
        $view_data['user'] = user();
        $view_data = array_merge($view_data , $data);

        return view(CONTROLLER_VIEW_PREFIX . 'test' , $view_data);
    }
}