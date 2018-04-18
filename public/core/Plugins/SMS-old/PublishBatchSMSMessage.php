<?php
/**
 * Created by PhpStorm.
 * User: Loocase
 * Date: 2017/5/2
 * Time: 16:03
 */
    //error_reporting(E_ALL & ~E_WARNING);
    require_once'mns-autoloader.php';
    use AliyunMNS\Client;
    use AliyunMNS\Topic;
    use AliyunMNS\Constants;
    use AliyunMNS\Model\MailAttributes;
    use AliyunMNS\Model\SmsAttributes;
    use AliyunMNS\Model\BatchSmsAttributes;
    use AliyunMNS\Model\MessageAttributes;
    use AliyunMNS\Exception\MnsException;
    use AliyunMNS\Requests\PublishMessageRequest;
    class PublishBatchSMSMessage
    {
        public function __construct()
        {

            $ini_array = parse_ini_file(__DIR__ . "/aliyun-mns.ini");
            $this->endPoint = $ini_array['endpoint']; // eg. http://1234567890123456.mns.cn-shenzhen.aliyuncs.com
            $this->accessId = $ini_array['accessid'];
            $this->accessKey = $ini_array['accesskey'];
            $this->freesignname="汽配商";
            $this->client = new Client($this->endPoint, $this->accessId, $this->accessKey);
            //print_r($this);exit;
        }

        public function run($templateCode,$param)
        {
            /**
             * Step 1. 初始化Client
             */

            #echo "<pre>";
            #print_r($this);exit;
            /**
             * Step 2. 获取主题引用
             */
            $topicName = "sms.topic-cn-hangzhou";
            $topic = $this->client->getTopicRef($topicName);
            /**
             * Step 3. 生成SMS消息属性
             */
            // 3.1 设置发送短信的签名（SMSSignName）和模板（SMSTemplateCode）

            $batchSmsAttributes = new BatchSmsAttributes($this->freesignname, $templateCode);
            //print_r($batchSmsAttributes);exit;
            //$batchSmsAttributes = new BatchSmsAttributes("汽配商", "SMS_63360025");
            $batchSmsAttributes->addReceiver($param['phone'],$param['attributes']);

            // 3.2 （如果在短信模板中定义了参数）指定短信模板中对应参数的值

            //$batchSmsAttributes->addReceiver("18688406812", array('customer' => "先生"));
            //$batchSmsAttributes->addReceiver("13189081625", array('customer' => "小姐"));
            $messageAttributes = new MessageAttributes(array($batchSmsAttributes));
            //echo "<pre>";
            //print_r($messageAttributes);
            /**
             * Step 4. 设置SMS消息体（必须）
             *
             * 注：目前暂时不支持消息内容为空，需要指定消息内容，不为空即可。
             */
            $messageBody = "smsmessage";
            /**
             * Step 5. 发布SMS消息
             */
            $request = new PublishMessageRequest($messageBody, $messageAttributes);

            try
            {
                $res = $topic->publishMessage($request);

                //echo "<pre>";
                //print_r($res);
                //echo $res->isSucceed();
                //echo "\n";
                //echo $res->getMessageId();
                //echo "\n";
				return true;
            }
            catch (MnsException $e)
            {
                //echo $e;
                //echo "\n";
                //echo 0;
				
				var_dump($e->getMessage());

				return false;
            }
        }
    }

    //$instance = new PublishBatchSMSMessageDemo();
    //$instance->run();

?>