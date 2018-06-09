<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/17
 * Time: 10:44
 *
 * 定义路由
 */

// 定义常量
require_once __DIR__ . '/constant.php';

// 测试 api
Route::get('Test/index' , API_ROUTE_PREFIX . 'Test@index');
// 生成聊天室 id
Route::post('Room/genRoomID' , API_ROUTE_PREFIX . 'Room@genRoomID');
// 获取订单发单人 id
Route::post('Order/getOrder' , API_ROUTE_PREFIX . 'Order@getOrder');
// 创建聊天室 id
Route::post('Room/createRoom' , API_ROUTE_PREFIX . 'Room@createRoom');
// 创建争议聊天室
Route::post('Room/createRoomForDisputeOrder' , API_ROUTE_PREFIX . 'Room@createRoomForDisputeOrder');
// 添加聊天室成员
Route::post('Room/joinRoom' , API_ROUTE_PREFIX . 'Room@joinRoom');
// 获取指定用户聊天室
Route::post('Room/getRooms' , API_ROUTE_PREFIX . 'Room@getRooms');
// 聊天记录
Route::post('Room/history' , API_ROUTE_PREFIX . 'Room@history');
// 添加订单争议
Route::post('Room/addOrderDispute' , API_ROUTE_PREFIX . 'Room@addOrderDispute');
// 设置订单争议状态
Route::post('Room/setOrderDisputeStatus' , API_ROUTE_PREFIX . 'Room@setOrderDisputeStatus');
// 设置未读消息数量（实际就是设置某用户所在的某聊天室的消息全部为已读消息）
Route::post('Room/setMessageCount' , API_ROUTE_PREFIX . 'Room@setMessageCount');
// 获取指定用户某房间的消息提醒状态
Route::post('Room/getTip' , API_ROUTE_PREFIX . 'Room@getTip');
// 上传图片
Route::post('File/uploadImages' , API_ROUTE_PREFIX . 'File@uploadImages');
// 上传文件
Route::post('File/uploadFiles' , API_ROUTE_PREFIX . 'File@uploadFiles');
// 文件上传测试
Route::get('File/test' , API_ROUTE_PREFIX . 'File@test');

// 用户登录
Route::post('UserSign/userLand' , API_ROUTE_PREFIX . 'UserSign@userLand');
