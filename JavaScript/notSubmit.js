$(function(){
    // フォームのサブミットを無効にする（formの送信をJavaScriptで制御する時用）
    $('form').on('submit', function (e) {
        e.preventDefault();
    });
});