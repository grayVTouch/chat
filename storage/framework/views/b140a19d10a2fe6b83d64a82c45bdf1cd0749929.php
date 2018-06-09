

<?php $__env->startSection('metaAddPart'); ?>
    <meta name="csrf_token" content="<?php echo e(csrf_token()); ?>" />
<?php $__env->stopSection(); ?>

<?php $__env->startSection('linkAddPart'); ?>
    <link rel="stylesheet" href="<?php echo e($plugin_url); ?>Loading/css/Loading.css?version=<?php echo e(app_config('app.version')); ?>">
    <link rel="stylesheet" href="<?php echo e($cur_view_url); ?>css/userForm.css?version=<?php echo e(app_config('app.version')); ?>">

    <?php echo $__env->yieldContent('userFormLinkAddPart'); ?>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('scriptAddPart'); ?>
    <?php echo $__env->yieldContent('userFormScriptAddPart'); ?>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <!-- 背景 -->
    <div class="background"><img src="<?php echo e($data_url); ?>background/user.jpg" class="image" /></div>

    <!-- 主体 -->
    <div class="user-form">
        <form class="form">
            <?php echo $__env->yieldContent('form'); ?>
        </form>
    </div>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('btmScriptAddPart'); ?>
    <script src="<?php echo e($plugin_url); ?>Loading/js/Loading.js"></script>
    <script src="<?php echo e($public_view_url); ?>js/currency.js"></script>
    <script src="<?php echo e($public_view_url); ?>js/globalVars.js"></script>
    <script src="<?php echo e($cur_view_url); ?>js/userForm.js"></script>

    <?php echo $__env->yieldContent('userFormBtmScriptAddPart'); ?>
<?php $__env->stopSection(); ?>
<?php echo $__env->make(WEB_VIEW_PREFIX . 'base', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>