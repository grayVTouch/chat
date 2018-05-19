<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/5/7
 * Time: 15:53
 */

namespace App\Http\Controllers\Api;

use App\System\Message;
use App\System\Chat\UserVerify;
use Core\System\Encryption;

class UserSign extends Controller
{
    // 登录
    public function userLand(){
        $data = [];

        $data['user_type']  = isset($_POST['user_type'])    ? $_POST['user_type'] : '';
        $data['user_id']    = isset($_POST['user_id'])      ? $_POST['user_id'] : '';
        $data['status']     = isset($_POST['status'])       ? $_POST['status'] : '';

        $data['user_type']  = Encryption::decrypt($data['user_type']);
        $data['user_id']    = Encryption::decrypt($data['user_id']);

        if (!$data['user_type'] || !$data['user_id']) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '004') , true);
        }

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
}