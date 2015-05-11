# コミットの差分ファイルをzipファイルとして書き出す

`export_diff_zip.bat` として下記のコードを任意の場所に保存する

```
if "%2" EQU "" (
  set PARAM1=HEAD
  set PARAM2=%1
) else (
  set PARAM1=%1
  set PARAM2=%2
)

setlocal enabledelayedexpansion
set RET_DIR=
for /F "usebackq" %%i in (`git diff --name-only %PARAM1% %PARAM2%`) do (
  set RET_DIR=!RET_DIR! "%%i"
)

git archive --format=zip --prefix=archive/ %PARAM1% %RET_DIR% -o archive.zip
```

 1. メニューから「ツール」→「オプション」→「カスタム操作」タブ→「追加」ボタンをクリック
 2. 「メニュー表示名」… `zipに圧縮して差分を保存`
 3. 「実行するスクリプト」…実行するスクリプトファイルのパスを指定します
 4. 「パラメータ」…　`$SHA`


## 参考
 - [SourceTreeでコミット間の差分ファイルを抽出しよう (カスタム操作を使う方法)](http://ics-web.jp/lab/archives/4475)