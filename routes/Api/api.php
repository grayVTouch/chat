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
Route::post('ChatRoom/genChatRoomID' , API_ROUTE_PREFIX . 'ChatRoom@genChatRoomID');
// 创建聊天室 id
Route::post('ChatRoom/createChatRoom' , API_ROUTE_PREFIX . 'ChatRoom@createChatRoom');
// 添加聊天室成员
Route::post('ChatRoom/joinChatRoom' , API_ROUTE_PREFIX . 'ChatRoom@joinChatRoom');
// 获取指定用户聊天室
Route::post('ChatRoom/getChatRoom' , API_ROUTE_PREFIX . 'ChatRoom@getChatRoom');
// 聊天记录
Route::post('ChatRoom/history' , API_ROUTE_PREFIX . 'ChatRoom@history');
// 添加订单争议
Route::post('ChatRoom/addOrderDispute' , API_ROUTE_PREFIX . 'ChatRoom@addOrderDispute');
// 设置订单争议状态
Route::post('ChatRoom/setOrderDisputeStatus' , API_ROUTE_PREFIX . 'ChatRoom@setOrderDisputeStatus');
// 设置未读消息数量（实际就是设置某用户所在的某聊天室的消息全部为已读消息）
Route::post('ChatRoom/setMessageCount' , API_ROUTE_PREFIX . 'ChatRoom@setMessageCount');