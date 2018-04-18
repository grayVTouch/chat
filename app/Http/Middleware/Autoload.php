<?php

namespace App\Http\Middleware;

use Closure;

class Autoload
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
        // 自定义自动加载
        $this->register();

        return $next($request);
    }

    // 自动加载
    public function register(){
        $base_dir = base_path() . '/';

        $register = [
            'class' => [
                // 个人类库
                "Core\Lib\\" => "{$base_dir}public/core/Lib/"
            ] ,
            'file' => [
                // 系统工具函数
                "{$base_dir}app/Tool/tool.php" ,
                "{$base_dir}app/Tool/view.php" ,

                // 个人函数库
                "{$base_dir}public/core/Function/array.php" ,
                "{$base_dir}public/core/Function/base.php" ,
                "{$base_dir}public/core/Function/file.php" ,
                "{$base_dir}public/core/Function/string.php" ,
                "{$base_dir}public/core/Function/time.php" ,
                "{$base_dir}public/core/Function/url.php" ,
            ]
        ];

        // 加载类
        $this->loadClass($register['class']);
        // 加载文件
        $this->loadFile($register['file']);
    }

    // 注册自动加载函数
    public function loadClass($class){
        foreach ($class as $k => $v)
        {
            call_user_func(function($k , $v){
                // 注册自动加载函数
                spl_autoload_register(function($classname) use($k , $v){
                    $class = $v . str_replace($k , '' , $classname);
                    $class = str_replace('\\' , '/' , $class);
                    $class .= '.php';

                    if (!file_exists($class)) {
                        return ;
                    }

                    require_once $class;
                });
            } , $k , $v);
        }
    }

    // 加载文件
    public function loadFile($file){
        foreach ($file as $v)
        {
            if (!file_exists($v)) {
                continue ;
            }

            require_once $v;
        }
    }
}
