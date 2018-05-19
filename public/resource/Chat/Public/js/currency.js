// 格式化显示时间
function formatTime(time){
    var _time = time.split(' ')[0];
    _time = _time.replace(/\-/g , '/');
    _time = _time.replace(/\/0(\d)\//g , '/$1/');
    _time = _time.slice(2);

    return _time;
}