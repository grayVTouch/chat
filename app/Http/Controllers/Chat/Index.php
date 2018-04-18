<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/17
 * Time: 17:16
 */

namespace App\Http\Controllers\Chat;


class Index extends Controller
{
    public function index(){
        return view(CONTROLLER_VIEW_PREFIX . 'index');
    }
}