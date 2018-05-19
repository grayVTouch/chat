<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/16
 * Time: 13:38
 */

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redis;
use Core\Lib\Encryption;

class Test extends Controller {
    function __construct() {
        $this->middleware('autoload');
        $this->middleware('chat');
    }

    public function index(){
        $user_type = Encryption::encrypt('user_type' , env('APP_KEY'));
        $user_id = Encryption::encrypt('user_id' , env('APP_KEY'));

        var_dump($user_type);
        var_dump($user_id);
       setcookie($user_type , 'fdsfjflkdfds' , time() + 3600 , '/' , '192.168.150.135');
    }
}