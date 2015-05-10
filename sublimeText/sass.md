# config.rbのベース


```
# サイトのパス
http_path = "/"

# CSS ファイルが書き出される場所
css_dir = "css"

# SCSS ファイルの場所
sass_dir = "_scss"

# 画像ディレクトリ
images_dir = "/"

# JavaScript ファイルの場所
javascripts_dir = "js"

# SASS の書き出し方設定
output_style = :expanded   # {} で改行する形
#output_style = :nested     # Sass ファイルのネストがそのまま引き継がれる形
#output_style = :compact    # セレクタと属性を 1 行にまとめて出力
#output_style = :compressed # 圧縮して出力

# CSS に SCSS での行番号を出力するかどうか
line_comments = false
```

## 参考
 - [超訳 Configuration Reference](http://tenderfeel.xsrv.jp/css/compass-css/1235/)