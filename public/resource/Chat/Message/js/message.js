(function(){
    "use strict";

    /**
     * *******************
     * 倒计时
     * *******************
     */
    var context = {};

    context['go'] = G('.go').first();
    context['time'] = G('.time').first();

    var waitTime = parseInt(context['go'].data('waitTime'));
    var location = decodeURIComponent(context['go'].data('location'));

    G.timeCount(waitTime , 1 , function(time){
        context['time'].get().textContent = time;
    } , function(){
        window.location.href = location;
    });

    context['go'].loginEvent('click' , function(){
        window.location.href = location;
    } , true , false);
})();