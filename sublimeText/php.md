# PHP の実行

メニューの `Tools` -> `Build System` -> `New Build`で下記の設定を保存する  
保存先は`C:\Users\ここにユーザ名\AppData\Roaming\Sublime Text 3\Packages\User`  
ファイル名は `php.sublime-build` とする

```json
{
    "cmd": ["php", "-f", "$file"],
    "selector": "source.php",
    "encoding": "UTF-8"
}
```

## ショートカット
`Ctrl+B`
