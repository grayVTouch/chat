<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/5/4
 * Time: 9:40
 *
 * 图片上传
 */
namespace App\Http\Controllers\Api;

// 本地图片上传
use App\System\LocalFile;
// 云存储图片上传，待添加
use App\System\Message;
use Core\System\Encryption;

class File extends Controller
{
    // 采用的图片接口
    public $class = LocalFile::class;

    // 测试
    public function test(){
        var_dump(lang("file.008"));
    }

    // 图片上传
    public function uploadImages(){
        $data = [];

        $data['room_id'] = isset($_POST['room_id']) ? $_POST['room_id'] : '';
        $data['user_type'] = isset($_POST['user_type']) ? $_POST['user_type'] : '';
        $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';
        $data['images'] = isset($_FILES['images']) ? $_FILES['images'] : '';

        // 检查是否存在上传图片
        if ($this->class::getImageInstance()->emptyFile($data['images'])) {
            return Message::error(lang('file.002') , true);
        }

        // 保存文件
        $images = $this->class::uploadImages($data['images'] , false);

        if ($images === false) {
            return Message::error(lang('file.008') , true);
        }

        // 图片 url
        $image_url  = config_('file.image_url');
        // 网站目录
        $public_dir = public_path() . '/';

        // 保存到数据库
        try {
            \DB::transaction(function() use(&$images , $data , $image_url , $public_dir){
                foreach ($images['success'] as &$v)
                {
                    $uri = generate_url($v['path'] , $public_dir , $image_url , false);

                    \DB::table('chat_file')->insert([
                        'room_id'   => $data['room_id'] ,
                        'user_type' => $data['user_type'] ,
                        'user_id'   => $data['user_id'] ,
                        'name'      => $v['name'] ,
                        'mime'      => $v['mime'] ,
                        'size'      => $v['size'] ,
                        'url'       => $uri ,
                        'path'      => $v['path']
                    ]);

                    // 销毁本地路径
                    unset($v['path']);

                    // 网络路径
                    $url = $image_url . $uri;

                    // 增加网络路径
                    $v['url'] = $url;
                }
            });
        } catch(\Exception $excep) {
            return Message::error(lang('file.008') , true);
            // return Message::error($excep->getMessage() , true);
        }

        return Message::success($images , true);
    }

    // 文件上传
    public function uploadFiles(){
        $data = [];

        $data['room_id'] = isset($_POST['room_id']) ? $_POST['room_id'] : '';
        $data['user_type'] = isset($_POST['user_type']) ? $_POST['user_type'] : '';
        $data['user_id'] = isset($_POST['user_id']) ? $_POST['user_id'] : '';
        $data['files']  = isset($_FILES['files']) ? $_FILES['files'] : '';

        // 检查是否存在上传图片
        if ($this->class::getFileInstance()->emptyFile($data['files'])) {
            return Message::error(lang('file.002') , true);
        }

        // 保存文件
        $files = $this->class::uploadFiles($data['files'] , false);

        if ($files === false) {
            return Message::error(lang('file.008') , true);
        }

        // 图片 url
        $file_url  = config_('file.file_url');
        // 网站目录
        $public_dir = public_path();

        // 保存到数据库
        try {
            \DB::transaction(function() use(&$files , $data , $file_url , $public_dir){
                foreach ($files['success'] as &$v)
                {
                    $uri = generate_url($v['path'] , $public_dir , $file_url);

                    \DB::table('chat_file')->insert([
                        'room_id'   => $data['room_id'] ,
                        'user_type' => $data['user_type'] ,
                        'user_id'   => $data['user_id'] ,
                        'name'  => $v['name'] ,
                        'mime'      => $v['mime'] ,
                        'size'      => $v['size'] ,
                        'url'       => $uri ,
                        'path'      => $v['path']
                    ]);

                    unset($v['path']);

                    $v['url'] = $file_url . $uri;
                }
            });
        } catch(\Exception $excep) {
            return Message::error(lang('file.008') , true);
        }

        return Message::success($files , true);
    }

}