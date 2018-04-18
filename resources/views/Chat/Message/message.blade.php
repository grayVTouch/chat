@extends(WEB_CONFIG_PREFIX . 'message')

@section('linkAddPart')
    <link rel="stylesheet" href="{{ $cur_view_url }}css/message.css" />
@endsection

@section('title' , '提示页面')

@section('content')
    <!-- 背景 -->
    <div class="bg"><img src="{{ $data_url }}background/message.jpg" class="image" /></div>

    <!-- 错误提示 -->
    <div class="error">
        <!-- 提示信息 -->
        <div class="msg">
            <span class="field">@if($status === 'success')成功@else失败@endif信息：</span>
            <span class="value">{{ $msg }}</span>
        </div>

        <!-- 倒计时 -->
        <div class="time-count">页面自动<span class="go weight" data-waitTime="{{ app_config('app.wait_time') }}" data-location="{{ $location }}">直接跳转</span>等待时间<span class="time weight">{{ app_config('app.wait_time') }}</span>秒</div>
    </div>
@endsection

@section('btmScriptAddPart')
    <script src="{{ $cur_view_url }}js/message.js"></script>
@endsection