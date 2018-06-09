

<?php $__env->startSection('linkAddPart'); ?>
    <link rel="stylesheet" href="<?php echo e($cur_view_url); ?>css/message.css" />
<?php $__env->stopSection(); ?>

<?php $__env->startSection('title' , '提示页面'); ?>

<?php $__env->startSection('content'); ?>
    <!-- 背景 -->
    <div class="bg"><img src="<?php echo e($data_url); ?>background/message.jpg" class="image" /></div>

    <!-- 错误提示 -->
    <div class="error">
        <!-- 提示信息 -->
        <div class="msg">
            <span class="field"><?php if($status === 'success'): ?>成功<?php else: ?>失败<?php endif; ?>信息：</span>
            <span class="value"><?php echo e($msg); ?></span>
        </div>

        <!-- 倒计时 -->
        <div class="time-count">页面自动<span class="go weight" data-waitTime="<?php echo e(app_config('app.wait_time')); ?>" data-location="<?php echo e($location); ?>">直接跳转</span>等待时间<span class="time weight"><?php echo e(app_config('app.wait_time')); ?></span>秒</div>
    </div>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('btmScriptAddPart'); ?>
    <script src="<?php echo e($cur_view_url); ?>js/message.js"></script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make(WEB_CONFIG_PREFIX . 'message', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>