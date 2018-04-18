<?php

namespace App\Http\Middleware;

use Closure;

// 这个中间件是用来初始化 api 所需的相关参数用的
class Chat
{
    // 路由实例
    public $route = null;

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // 获取 Illuminite\Routing\Route 实例
        $this->getRoute();
        
        // 获取模块、动作
        $this->parseRoute();

        // 设置网络相关
        $this->defineNetwork();

        // 定义系统常量
        $this->defineConstant();

        // 定义视图共享变量
        $this->defineViewData();

        return $next($request);
    }

    // 获取路由实例
    public function getRoute(){
        $this->route = app()->make('Illuminate\Routing\Route');
    }

    // 解析路由
    public function parseRoute(){
        // 该对象的具体功能，请查看 laravel api 手册
        $prefix = $this->route->getPrefix();
        $uri    = $this->route->uri();
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
        define('CONTROLLER_LANG_PREFIX' , WEB_LANG_PREFIX . CONTROLLER . '.');

        // 定义控制器视图前缀
        define('CONTROLLER_VIEW_PREFIX' , WEB_VIEW_PREFIX . CONTROLLER . '.');
    }

    // 定义视图共享常量
    public function defineViewData(){
        $share = [];

        // 网络相关
        $share['url']       = URL;
        $share['domain']    = DOMAIN;

        // 视图路径
        $share['view_url']          = $share['url'] . 'resource/' . WEB_MODULE . '/';
        $share['public_view_url']   = $share['view_url'] . 'Public/';
        $share['cur_view_url']      = $share['view_url'] . CONTROLLER . '/';

        // 插件路径
        $share['plugin_url']        = $share['url'] . 'plugins/';

        // 数据路径
        $share['data_url']          = $share['url'] . 'data/';

        foreach ($share as $k => $v)
        {
            // 共享视图
            view()->share($k , $v);
        }
    }
}
