# 最初に環境変数を通しておく
 - システム環境変数に `NODIST_PREFIX` を作成し、 パスを `C:\ProgramingLanguage\nodist` にして保存する
 - システム環境変数の `Path` に `%NODIST_PREFIX%\bin;` を付け足す

# nodistのコマンド

## nodistのバージョン確認
`nodist -v`

## 最終バージョンのインストール
`nodist update`

## バージョンの追加
`nodist + v0.11`

## バージョンの削除
`nodist - v0.11`

## 現在有効なバージョン
`node -v`

## 有効なバージョンの切り替え
`nodist v0.11`

## 現在インストールされているバージョンの列挙
`nodist`