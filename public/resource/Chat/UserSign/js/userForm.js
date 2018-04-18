(function(){
    "use strict";

    /**
     * *********************
     * 输入框
     * *********************
     */
    var componentInputs = G('.component-input');

    (function(){
        var i = 0;
        var cur = null;

        for (; i < componentInputs.length; ++i)
        {
            cur = G(componentInputs.get()[i]);

            ComponentInput(cur.get());
        }
    })();
})();