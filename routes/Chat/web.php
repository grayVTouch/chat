<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// 定义常量
require_once __DIR__ . '/constant.php';

Route::get('/', WEB_ROUTE_PREFIX . 'Index@index');

// 用户登录
Route::get('UserSign/showLand', WEB_ROUTE_PREFIX . 'UserSign@showLand');
Route::post('UserSign/userLand', WEB_ROUTE_PREFIX . 'UserSign@userLand');

Route::get('Message/show', WEB_ROUTE_PREFIX . 'Message@show');
