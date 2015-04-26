# フォームのサブミットを無効にする（formの送信をJavaScriptで制御する時用）

```js
$('form').on('submit', function (e) {
    e.preventDefault();
});
```
