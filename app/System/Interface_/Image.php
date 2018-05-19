<?php
/**
 * Created by PhpStorm.
 * User: grayVTouch
 * Date: 2018/5/4
 * Time: 9:42
 */

namespace App\System\Interface_;


interface Image
{
    /**
     * 上传图片
     * @param $images 图片列表
     * @return [
     *  // 完整的路径
     *  'url' => '' ,
     *  // 不包含域名的路径
     *  'uri' => '' ,
     * ]
     */
    public static function uploadImages($images);

    // 上传文件
    // 返回值同 上传图片
    public static function uploadFiles($files);
}