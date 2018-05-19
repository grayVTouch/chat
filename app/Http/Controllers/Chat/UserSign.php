<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/17
 * Time: 23:29
 */

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\System\Chat\UserVerify;
use App\System\Message;

class UserSign extends Controller
{
    function __construct(){
        parent::__construct();

        $this->middleware('autoload');
        $this->middleware('chat');
    }

    // 显示登录界面
    public function showLand(){
        $view_data = [
            'is_remember_pwd' => isset($_COOKIE['is_remember_pwd']) ? $_COOKIE['is_remember_pwd'] : 'n'
        ];

        return view(CONTROLLER_VIEW_PREFIX . 'showLand' , $view_data);
    }

    // 验证用户登录
    public function userLand(){
        $data = [];

        $data['user_type']  = isset($_POST['user_type']) ? $_POST['user_type'] : '';
        $data['user_id']    = isset($_POST['user_id']) ? $_POST['user_id'] : '';
        $data['status']     = isset($_POST['status']) ? $_POST['status'] : '';

        $user_type = app_config('business.user_type');

        if (!in_array($data['user_type'] , $user_type)) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '001') , true);
        }

        if ($data['user_id'] === '') {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '002') , true);
        }

        if ($data['user_type'] === 'admin') {
            $count = \DB::table('admin_users')->where('id' , $data['user_id'])->count();
        } else {
            $count = \DB::table('users')->where('id' , $data['user_id'])->count();
        }

        if ($count === 0) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '003') , true);
        }

        // 用户登录成功
        UserVerify::saveUser($data['user_type'] , $data['user_id'] , $data['status']);

        return Message::success(lang('Tip.land_success') , true);
    }

    // 验证用户登录
    public function _userLand(){
        $data = [];

        $data['user_type']  = isset($_GET['user_type']) ? $_GET['user_type'] : '';
        $data['user_id']    = isset($_GET['user_id']) ? $_GET['user_id'] : '';
        $data['status']     = isset($_GET['status']) ? $_GET['status'] : '';

        $user_type = app_config('business.user_type');

        if (!in_array($data['user_type'] , $user_type)) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '001') , true);
        }

        if ($data['user_id'] === '') {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '002') , true);
        }

        if ($data['user_type'] === 'admin') {
            $count = \DB::table('admin_users')->where('id' , $data['user_id'])->count();
        } else {
            $count = \DB::table('users')->where('id' , $data['user_id'])->count();
        }

        if ($count === 0) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '003') , true);
        }

        // 用户登录成功
        UserVerify::saveUser($data['user_type'] , $data['user_id'] , $data['status']);

        return redirect()->action(WEB_ROUTE_PREFIX . 'Index@index');
    }

    // 退出登录
    public function loginOut(){
        UserVerify::destroyUser();

        return Message::success(lang('Tip.login_out') , true);
    }
}