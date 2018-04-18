<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/16
 * Time: 13:39
 */

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller as BaseController;
use App\System\Chat\UserVerify;
use App\System\Message;

class Controller extends BaseController
{
    public function __construct(){
        parent::__construct();

        // 这边做一些当前平台共享的事情
        $this->middleware('autoload');
        $this->middleware('chat');
        $this->middleware('web_verify');
    }
}