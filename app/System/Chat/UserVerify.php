<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/17
 * Time: 22:14
 */

namespace App\System\Chat;

use Core\System\Encryption;

class UserVerify extends Controller
{
    public static $user = null;

    public static $k_user = 'user';
    public static $k_admin = 'admin';
    public static $k_user_type = 'user_type';
    public static $k_user_id = 'user_id';

    // 验证用户是否登录
    public static function verify(){
        $k_for_user_type  = Encryption::encrypt(self::$k_user_type);
        $k_for_user_id    = Encryption::encrypt(self::$k_user_id);

        if (!isset($_COOKIE[$k_for_user_type]) || !isset($_COOKIE[$k_for_user_id])) {
            return false;
        }

        $user_type  = Encryption::decrypt($_COOKIE[$k_for_user_type]);
        $user_id    = Encryption::decrypt($_COOKIE[$k_for_user_id]);

        // 如果已设置，检查用户是否存在
        if ($user_type === 'admin') {
            $count = \DB::table('admin_users')->where('id' , $user_id)->count();
        } else {
            $count = \DB::table('users')->where('id' , $user_id)->count();
        }

        if ($count === 0) {
            static::destroyUser();
            // 用户不存在
            return false;
        }

        return true;
    }

    // 销毁用户信息
    public static function destroyUser(){
        $k_for_user_type    = Encryption::encrypt(self::$k_user_type);
        $k_for_user_id      = Encryption::encrypt(self::$k_user_id);
        $time = time() - 1;

        setcookie('_user' , '' , $time , '/' , DOMAIN);
        setcookie('_admin' , '' , $time , '/' , DOMAIN);
        setcookie('_type' , '' , $time , '/' , DOMAIN);
        setcookie('_id' , '' , $time , '/' , DOMAIN);
        setcookie('_user_type' , '' , $time , '/' , DOMAIN);
        setcookie('_user_id' , '' , $time , '/' , DOMAIN);
        setcookie($k_for_user_type , '' , $time , '/' , DOMAIN);
        setcookie($k_for_user_id , '' , $time , '/' , DOMAIN);
    }

    // 保存用户信息
    public static function saveUser($user_type , $user_id , $is_remember_pwd){
        $k_for_user_type    = Encryption::encrypt(self::$k_user_type);
        $k_for_user_id      = Encryption::encrypt(self::$k_user_id);

        $time = time();
        $time += $is_remember_pwd === 'y' ? app_config('app.long_time') : app_config('app.short_time');

        $v_for_user_type    = Encryption::encrypt($user_type);
        $v_for_user_id      = Encryption::encrypt($user_id);

        $_user = Encryption::encrypt(self::$k_user);
        $_admin = Encryption::encrypt(self::$k_admin);

        setcookie('_user' , $_user , $time , '/' , DOMAIN);
        setcookie('_admin' , $_admin , $time , '/' , DOMAIN);
        setcookie('_type' , $k_for_user_type , $time , '/' , DOMAIN);
        setcookie('_id' , $k_for_user_id , $time , '/' , DOMAIN);
        setcookie('_user_type' , $user_type , $time , '/' , DOMAIN);
        setcookie('_user_id' , $user_id , $time , '/' , DOMAIN);
        // 加密的数据仅用于前端链接 websocket 认证用
        setcookie($k_for_user_type , $v_for_user_type , $time , '/' , DOMAIN);
        setcookie($k_for_user_id , $v_for_user_id , $time , '/' , DOMAIN);

        setcookie('is_remember_pwd' , $is_remember_pwd , $time , '/' , DOMAIN);
    }

    // 获取登录用户信息
    public static function user(){
        if (!is_null(static::$user)) {
             return static::$user;
        }

        $k_for_user_type    = Encryption::encrypt(self::$k_user_type);
        $k_for_user_id      = Encryption::encrypt(self::$k_user_id);

        $user_type  = Encryption::decrypt($_COOKIE[$k_for_user_type]);
        $user_id    = Encryption::decrypt($_COOKIE[$k_for_user_id]);

        if ($user_type === 'admin') {
            $user = \DB::table('admin_users')->select('*' , 'name as username' , 'avatar as thumb')->where('id' , $user_id)->first();
        } else {
            $user = \DB::table('users')->select('*' , 'user_name as username')->where('id', $user_id)->first();
        }

        $user->user_type = $user_type;
        $user->user_id = $user_id;

        // 仅获取登录用户：nickname + thumb + user_type + user_id
        return static::$user = $user;
    }
}
