# JavaScript の実行

メニューの `Tools` -> `Build System` -> `New Build`で下記の設定を保存する  
保存先は`C:\Users\ここにユーザ名\AppData\Roaming\Sublime Text 3\Packages\User`  
ファイル名は `node.sublime-build` とする

```json
{
    "cmd": ["node","$file"]
}
```

## ショートカット
`Ctrl+B`
