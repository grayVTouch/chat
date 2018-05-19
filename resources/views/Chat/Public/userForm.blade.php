@extends(WEB_VIEW_PREFIX . 'base')

@section('metaAddPart')
    <meta name="csrf_token" content="{{ csrf_token() }}" />
@endsection

@section('linkAddPart')
    <link rel="stylesheet" href="{{ $plugin_url }}Loading/css/Loading.css?version={{ app_config('app.version') }}">
    <link rel="stylesheet" href="{{ $cur_view_url }}css/userForm.css?version={{ app_config('app.version') }}">

    @yield('userFormLinkAddPart')
@endsection

@section('scriptAddPart')
    @yield('userFormScriptAddPart')
@endsection

@section('content')
    <!-- 背景 -->
    <div class="background"><img src="{{ $data_url }}background/user.jpg" class="image" /></div>

    <!-- 主体 -->
    <div class="user-form">
        <form class="form">
            @yield('form')
        </form>
    </div>
@endsection

@section('btmScriptAddPart')
    <script src="{{ $plugin_url }}Loading/js/Loading.js"></script>
    <script src="{{ $public_view_url }}js/tool.js"></script>
    <script src="{{ $public_view_url }}js/currency.js"></script>
    <script src="{{ $public_view_url }}js/globalVars.js"></script>
    <script src="{{ $cur_view_url }}js/userForm.js"></script>

    @yield('userFormBtmScriptAddPart')
@endsection