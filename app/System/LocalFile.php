<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/5/4
 * Time: 10:15
 */

namespace App\System;

use App\System\Interface_\Image;
use Core\Lib\UploadFile;
use Core\Lib\UploadImage;

class LocalFile extends Controller implements Image
{
    public static $_fileInstance = null;
    public static $_imageInstance = null;

    // 获取上传图片实例
    public static function getImageInstance(){
        if (is_null(self::$_imageInstance)) {
            self::$_imageInstance = new UploadImage(config_('file.chat_image_dir'));
        }
        
        return self::$_imageInstance;
    }

    // 获取文件上传实例
    public static function getFileInstance(){
        if (is_null(self::$_fileInstance)) {
            self::$_fileInstance = new UploadFile(config_('file.chat_file_dir'));
        }
        
        return self::$_fileInstance;
    }

    // 上传图片
    public static function uploadImages($images , $save_origin = true){
        $instance = self::getImageInstance();

        return $instance->saveImages($images , $save_origin);
    }

    // 上传文件
    public static function uploadFiles($files , $save_origin = true){
        $instance = self::getFileInstance();

        return $instance->saveAll($files , $save_origin);
    }
}