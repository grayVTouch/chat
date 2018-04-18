<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/16
 * Time: 13:38
 */

namespace App\Http\Controllers\Chat;

use Illuminate\Support\Facades\Redis;

class Test extends Controller {
    public function index(){
       var_dump(lang('Chat.Test.001'));
    }
}