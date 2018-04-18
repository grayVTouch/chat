<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/17
 * Time: 10:21
 */

namespace App\Http\Controllers\Api;

class Test extends Controller
{
    public function index(){
        $res = config_('Api.business.room_type');
        $res = config_('Api.business.user_type');

        var_dump($res);
    }
}