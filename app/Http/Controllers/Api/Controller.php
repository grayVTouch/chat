<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/16
 * Time: 10:27
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller as BaseController;


class Controller extends BaseController
{
    function __construct(){
        parent::__construct();

        // 注册自定义加载
        $this->middleware('autoload');
        // api 系统初始化
        $this->middleware('_api');
    }
}