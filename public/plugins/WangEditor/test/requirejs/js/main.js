require.config({
    paths: {
        jquery: '../../../dist/Js/lib/jquery-1.10.2.min',
        wangEditor: '../../../dist/Js/wangEditor.min'
    }
});

require(['wangEditor'], function(){
    $(function(){
        var editor = new wangEditor('div1');
        editor.create();
    });
})