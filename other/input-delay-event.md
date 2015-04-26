# 入力検証用にajaxで通信する際に余計な通信を行わないように遅れて実行する

```js
var inputTimer;

var checkVal = function(time) {
    // 前回の処理を破棄
    clearTimeout(inputTimer);
    // タイマー実行
    inputTimer = setTimeout(function(){
        // ここに処理
    }, time);
}

$('エレメント').on('keydown change cut paste', function(e){
    // イベントを実行しないKeyupキーコード
    var exceptKeys = [
        3, // Cancel
        6, // Help
        9, // TAB
        15, // Command
        16, // Shift
        17, // Ctrl
        18, // Alt
        19, // Pause
        20, // Caps Lock
        21, // KANA
        22, // Mac"英数" キー
        23, // JUNJA
        24, // FINAL
        25, // KANJI
        27, // Esc
        28, // 「前候補・変換」
        29, // 「無変換」
        30, // ACCEPT
        31, // MODECHANGE
        33, // Page Up
        34, // Page Down
        35, // End
        36, // Home
        37, 38, 39, 40, // 矢印
        41, // SELECT
        42, // PRINT
        43, // EXECUTE
        44, // Print Screen
        45, // Ins
        91, // 左Windowsキー
        92, // 右Windowsキー
        93, // 右クリックキー
        95, // SLEEP
        112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, // ファンクションキー
        124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, // ファンクションキー
        144, // Num Lock
        145, // Scroll Lock
        224, // Command
        225, // AltGr
        240, 241, // Caps Lock
        242, // 「カタカナ・ひらがな」
        243, 244  // 「半角・全角」
    ];

    // キーコード
    var keyCode = e.keyCode;

    // 文字入力以外のキー入力は除外
    // alt, ctrl, option, commandキーの同時押しの場合は除外
    if ($.inArray(keyCode, exceptKeys) && !e.altKey && !e.metaKey && !e.ctrlKey) {
        var time = 0;
        if (e.type === 'keydown') {
            time = 500;
        }
        checkVal(time);
    }
});
```
