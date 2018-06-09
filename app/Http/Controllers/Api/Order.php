<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/4/30
 * Time: 12:35
 */

namespace App\Http\Controllers\Api;

use App\System\Message;
use App\System\Order as SOrder;

class Order extends Controller
{
    // 获取订单信息
    public function getOrder(){
        $data = [];

        $data['order_id'] = isset($_POST['order_id']) ? $_POST['order_id'] : '';

        if ($data['order_id'] === '') {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '007') , true);
        }

        $order = \DB::table('order_info')->where('order_id' , $data['order_id'])->first();

        if (empty($order)) {
            return Message::error(lang(CONTROLLER_LANG_PREFIX . '008') , true);
        }

        $order = SOrder::singleOrderHandle($order);

        return Message::success($order , true);
    }
}