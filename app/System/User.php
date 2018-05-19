<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/5/1
 * Time: 11:05
 */

namespace App\System;


class User extends Controller
{
    public static function getUser($user_type , $user_id){
        if ($user_type === 'admin') {
            $user = \DB::table('admin_users')->where('id' , $user_id)->select('*' , 'name as username' , 'avatar as thumb')->first();
        } else {
            $user = \DB::table('users')->where('id' , $user_id)->select('*' , 'user_name as username')->first();
        }

        $user->user_type = $user_type;
        $user->user_id = $user_id;

        return $user;
    }
}