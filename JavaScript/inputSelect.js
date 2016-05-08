$(function () {
    // テキストエリアの全選択
    var inputSelectAll = function (e) {
        if (e) {
            (function (e) {
                setTimeout(function () {
                    var target = e.target;
                    target.focus();
                    if (target.selectionStart) {
                        target.selectionStart = 0;
                        target.selectionEnd = target.value.length;
                    } else if (document.selection) {
                        var range = target.createTextRange();
                        range.collapse();
                        range.moveStart('character', 0);
                        range.moveEnd('character', target.value.length);
                        range.select();
                    }
                }, 0);
            }(e));
        }
    };
    $(document).on('focus', 'input, textarea', function (e) {
        inputSelectAll(e);
    });
});