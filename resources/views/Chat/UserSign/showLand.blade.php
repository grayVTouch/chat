@extends(WEB_VIEW_PREFIX . 'Public/userForm')

@section('title' , '用户登录')

@section('userFormLinkAddPart')
    <link rel="stylesheet" href="{{ $cur_view_url }}css/showLand.css?version={{ app_config('app.version') }}">
@endsection

@section('form')
    <div class="form-header">用户登录</div>
    <div class="form-body">
        <!-- 输入表单 -->
        <div class="inputs">
            <div class="component-input">
                <div class="field">请输入用户类型</div>
                <div class="value"><input type="text" autofocus="autofocus" class="form-text user-type" /></div>
                <div class="explain">可选：admin-后台用户 user-前台用户</div>
            </div>

            <div class="component-input">
                <div class="field">请输入用户ID</div>
                <div class="value"><input type="text" class="form-text user-id" /></div>
                <div class="explain">格式：请输入纯数字</div>
            </div>
        </div>

        <!-- 功能选择 -->
        <div class="functions">
            <div class="left">
                <div class="component-select" data-status="{{ $is_remember_pwd or 'n' }}">
                    <div class="pic-con"><img src="{{ $data_url }}ico/pending_status.png" data-selected="{{ $data_url }}ico/selected_status.png" data-pending="{{ $data_url }}ico/pending_status.png" class="pic" /></div>
                    <div class="text-con">记住状态</div>
                </div>
            </div>
            <div class="right"></div>
        </div>

        <!-- 按钮 -->
        <div class="buttons">
            <button type="submit" class="btn-2 submit-btn">登录</button>
        </div>

    </div>
@endsection

@section('userFormBtmScriptAddPart')
    <script src="{{ $cur_view_url }}js/showLand.js?version={{ app_config('app.version') }}"></script>
@endsection