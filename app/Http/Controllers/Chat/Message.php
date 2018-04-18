<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/17
 * Time: 23:31
 */

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;

class Message extends Controller
{
    function __construct(){
        $this->middleware('autoload');
        $this->middleware('chat');
    }

    // 展示提示页面
    public function show(){
        $data = [];

        $data['status']     = isset($_GET['status'])    ? $_GET['status'] : '';
        $data['msg']        = isset($_GET['msg'])       ? $_GET['msg'] : '';
        $data['location']   = isset($_GET['location'])  ? urldecode($_GET['location']) : '';

        // 输出视图
        return view(CONTROLLER_VIEW_PREFIX . 'message' , $data);
    }
}