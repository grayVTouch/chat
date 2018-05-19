/**
 * *****************************
 * author 陈学龙 2018-05-15
 * js 会话输入框各种类型功能
 * *****************************
 */

// 采用下划线命名仅是为了避免名称冲突
var _input = {
    // 缓存的数据
    text: {} ,

    // 添加到编辑器
    addFace: function(id , text , src){
        var _text = this.text[id];
            _text = G.isUndefined(_text) ? '' : _text;

        var faceFormat = '![face][' + text + '](' + src + ')';

        _text += faceFormat;

        // 保存更新后的内容
        this.saveText(id , _text);

        var html = _editor.html(_text);

        _context['w_input'].html(html);

        // 设置光标位置：定位到文本最后
        G.setCursorPoint(_context['w_input'].get() , 'last');
    } ,

    // 保存用户草稿
    saveText: function(id , value){
        var text = _editor.text(value);

        // 保存用户输入
        this.text[id] = text;
    } ,
};