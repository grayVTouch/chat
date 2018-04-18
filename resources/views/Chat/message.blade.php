<!DOCTYPE html>

@section('html')
<html>
@section('head')
<head>
    <meta http-equiv='content-type' content='text/html;charset=utf8' />
    <meta http-equiv='X-UA-Compatible' content='IE=Edge,Chrome=1' />
    <meta name='form-detection' content='telephone=no' />
    <meta name='renderer' content='webkit' />
    <meta name='Cache-Cotnrol' content='no-cache' />
    <meta name='pragma' content='no-cache' />

    @yield('metaAddPart')

    <link rel='shortcut icon' href='{{ $data_url }}ico/logo.png' />
    <link rel='stylesheet' href='{{ $plugin_url }}CSS/base.css?version={{ app_config('app.version') }}' />
    <link rel='stylesheet' href='{{ $plugin_url }}CSS/Component/module.css?version={{ app_config('app.version') }}' />

    @yield('linkAddPart')
    <script src='{{ $plugin_url  }}JQuery/jquery-3.1.1.min.js?version={{ app_config('app.version') }}'></script>
    <script src='{{ $plugin_url  }}Layer-v3.0.3/layer.js?version={{ app_config('app.version') }}'></script>
    <script src='{{ $plugin_url  }}SmallJs/SmallJs.js?version={{ app_config('app.version') }}'></script>
    <!--
    <script src='{{ $plugin_url  }}Vue-2/vue.min.js?version={{ app_config('app.version') }}'></script>
    -->

    @yield('scriptAddPart')

    <title>@yield('title')</title>
</head>
@show

@section('body')
<body data-url="{{ $url }}" data-domain="{{ $domain  }}" data-module="{{ WEB_MODULE  }}" data-controller="{{ CONTROLLER  }}" data-action="{{ ACTION  }}">

@section('container')
<section class='container'>
    @section('content')
    <div class='content'>@yield('con_in')</div>
    @show
</section>
@show

<script src="{{ $plugin_url }}CSS/Component/js/module.js?version={{ app_config('app.version') }}"></script>
@section('btmScriptAddPart')
@show
</body>
</html>
@show
