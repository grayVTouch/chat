<?php

namespace App\Http\Middleware;

use Closure;

// 这个中间件是用来初始化 api 所需的相关参数用的
class Api
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
        // 获取模块、动作
        $this->parseRoute();

        // 设置网络相关
        $this->defineNetwork();

        // 定义系统常量
        $this->defineConstant();

        return $next($request);
    }

    // 解析路由
    public function parseRoute(){
        // 该对象的具体功能，请查看 laravel api 手册
        $route  = app()->make('Illuminate\Routing\Route');
        $prefix = $route->getPrefix();
        $uri    = $route->uri();
        $uri    = empty($prefix) ? $uri : preg_replace("/{$prefix}\/?/" , '' , $uri);
        $uri    = explode('/' , $uri);
        $uri    = filter_arr($uri);

        $controller = isset($uri[0]) ? $uri[0] : 'Index';
        $action     = isset($uri[1]) ? $uri[1] : 'index';

        // 定义控制器
        define('CONTROLLER' , $controller);

        // 定义动作
        define('ACTION'     , $action);
    }

    // 定义网络
    public function defineNetwork(){
        define('URL' , config_(WEB_CONFIG_PREFIX . 'app.url'));

        $domain = preg_replace('/(http|https)\:\/\//' , '' , URL);
        $domain = rtrim($domain , '/');

        define('DOMAIN' , $domain);
    }

    // 定义系统常量
    public function defineConstant(){
        // 定义控制器语言包前缀
        define('CONTROLLER_LANG_PREFIX' , API_LANG_PREFIX . CONTROLLER . '.');
    }
}
