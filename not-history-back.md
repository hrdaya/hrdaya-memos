# バックスペースを入力したときにページが戻らないようにする

```js
$(document).on('keydown', 'input, texterea', function (event) {
    if (event.keyCode === 8) {
        // 入力できる場合は制御しない
        var obj = event.target;
        if (!obj.readOnly && !obj.disabled) {
            return true;
        }
        return false;
    }
});
```
