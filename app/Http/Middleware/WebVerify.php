<?php

namespace App\Http\Middleware;

use Closure;

use App\System\Chat\UserVerify;
use App\System\Message;

class WebVerify
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // 用户验证
        $response = $this->verify();

        if ($response instanceof \Illuminate\Http\RedirectResponse) {
            // 如果是 RedirectResponse 实例
            // 表示需要进行页面跳转！
            return $response;
        }

        $response = $next($request);

        return $response;
    }

    // 用户登录状态验证
    public function verify(){
        // 用户登录验证
        if (!UserVerify::verify()) {
            $link = url()->action(WEB_ROUTE_PREFIX . 'UserSign@showLand');

            // 尚未登录
            // 跳转到登录界面
            return Message::error(lang("Tip.land_never") , false , $link);
        }
    }
}
