<!DOCTYPE html>

<?php $__env->startSection('html'); ?>
    <html>
    <?php $__env->startSection('head'); ?>
        <head>
            <meta http-equiv='content-type' content='text/html;charset=utf8' />
            <meta http-equiv='X-UA-Compatible' content='IE=Edge,Chrome=1' />
            <meta name='form-detection' content='telephone=no' />
            <meta name='renderer' content='webkit' />
            <meta name='Cache-Cotnrol' content='no-cache' />
            <meta name='pragma' content='no-cache' />

            <?php echo $__env->yieldContent('metaAddPart'); ?>

            <link rel='shortcut icon' href='<?php echo e($data_url); ?>ico/logo.png' />
            <link rel='stylesheet' href='<?php echo e($plugin_url); ?>CSS/base.css?version=<?php echo e(app_config('app.version')); ?>' />
            <link rel='stylesheet' href='<?php echo e($plugin_url); ?>CSS/Component/module.css?version=<?php echo e(app_config('app.version')); ?>' />

            <?php echo $__env->yieldContent('linkAddPart'); ?>
            <script src='<?php echo e($plugin_url); ?>JQuery/jquery-3.1.1.min.js?version=<?php echo e(app_config('app.version')); ?>'></script>
            <script src='<?php echo e($plugin_url); ?>Layer-v3.0.3/layer.js?version=<?php echo e(app_config('app.version')); ?>'></script>
            <script src='<?php echo e($plugin_url); ?>SmallJs/SmallJs.js?version=<?php echo e(app_config('app.version')); ?>'></script>
        <!--
    <script src='<?php echo e($plugin_url); ?>Vue-2/vue.min.js?version=<?php echo e(app_config('app.version')); ?>'></script>
    -->

            <?php echo $__env->yieldContent('scriptAddPart'); ?>

            <title><?php echo $__env->yieldContent('title'); ?></title>
        </head>
    <?php echo $__env->yieldSection(); ?>

    <?php $__env->startSection('body'); ?>
        <body data-url="<?php echo e($url); ?>" data-domain="<?php echo e($domain); ?>" data-module="<?php echo e(WEB_MODULE); ?>" data-controller="<?php echo e(CONTROLLER); ?>" data-action="<?php echo e(ACTION); ?>">

        <?php $__env->startSection('container'); ?>
            <section class='container'>
                <?php $__env->startSection('content'); ?>
                    <div class='content'><?php echo $__env->yieldContent('con_in'); ?></div>
                <?php echo $__env->yieldSection(); ?>
            </section>
        <?php echo $__env->yieldSection(); ?>

        <script src="<?php echo e($plugin_url); ?>CSS/Component/js/module.js?version=<?php echo e(app_config('app.version')); ?>"></script>
        <?php $__env->startSection('btmScriptAddPart'); ?>
        <?php echo $__env->yieldSection(); ?>
        </body>
    </html>
<?php echo $__env->yieldSection(); ?>
