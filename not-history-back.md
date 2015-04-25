# バックスペースを入力したときにページが戻らないようにする

```js
$(document).on('keydown', 'input, texterea', function (e) {
    return e.keyCode === 8 && (e.target.readOnly || e.target.disabled) ? false: true;
});
```
