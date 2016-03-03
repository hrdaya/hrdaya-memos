$(function () {
    // DOM生成後250m秒はリロード禁止
    var start = false;
    setTimeout(function() {
        start = true;
    }, 250);

    // F5、Ctrl＋Rが入力された場合は250m秒後に遅延してリロードするタイマーを登録する
    // ただし、250m秒以内にF5、Ctrl＋Rが押された場合は前回登録したタイマーをキャンセルする
    var timer;
    $(document).on('keydown', function(e){
        if ((e.keyCode || e.witch) == 116 ||
           ((e.keyCode || e.witch) == 82 && e.ctrlKey)) {
            // デフォルトのイベントをキャンセル
            e.preventDefault();
            // タイマーのクリア
            clearTimeout(timer);
            // DOM生成後250m秒はタイマーをセットしない
            if (start) {
                // 250m秒後にリロードするタイマーをセットする
                timer = setTimeout(function() {
                    location.reload();
                }, 250);
            }
        }
    });
});
