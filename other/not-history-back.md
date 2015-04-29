# バックスペースを入力したときにページが戻らないようにする

```js
$(document).on('keydown', function (e) {
    if (e.keyCode === 8) {
        var obj = e.target;
        var tagName = obj.tagName.toLowerCase();
        var tagNames = ['input', 'texterea'];
        var type = obj.type.toLowerCase();
        var types = ['radio', 'checkbox', 'submit', 'image', 'reset', 'button'];
        if (!$.inArray(tagName, tagNames)) {
            // input, textarea以外は処理をキャンセル
            return false;
        } else if (obj.readOnly || obj.disabled || $.inArray(type, types)) {
            // readonly属性, disabled属性が設定されている場合と
            // 文字入力タイプ以外のinputの処理をキャンセル
            return false;
        }
    }
});
```