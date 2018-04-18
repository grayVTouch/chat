<?php    
	/*
	 * 阿里云 PHP SDK 短信发送服务（单一短信发送）
	 */
    include_once 'aliyun-php-sdk-core/Config.php';
    use Sms\Request\V20160927 as Sms;            
    $iClientProfile = DefaultProfile::getProfile("cn-hangzhou", "LTAITnomiH51mtBX", "OYKn8jX8HTCLJa89qUeibGodE78R6V");        
    $client = new DefaultAcsClient($iClientProfile);    
    $request = new Sms\SingleSendSmsRequest();
    $request->setSignName("汽配商");/*签名名称*/
    $request->setTemplateCode("SMS_65245030");/*模板code*/
    $request->setRecNum("13375086826");/*目标手机号*/
    $request->setParamString("{\"code\":\"123456\"}");/*模板变量，数字一定要转换为字符串*/

    try {
        $response = $client->getAcsResponse($request);
        print_r($response);
    }
    catch (ClientException  $e) {
        print_r($e->getErrorCode());   
        print_r($e->getErrorMessage());   
    }
    catch (ServerException  $e) {        
        print_r($e->getErrorCode());   
        print_r($e->getErrorMessage());
    }