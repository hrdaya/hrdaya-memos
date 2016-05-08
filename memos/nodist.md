
# nodist

node.jsをバージョン指定してインストール、管理をする
- [nodist](https://github.com/marcelklehr/nodist)
- [nodistでNode.jsをバージョン管理](http://qiita.com/satoyan419/items/56e0b5f35912b9374305)

# nodistのコマンド

## nodistのバージョン確認
```
nodist -v
```

## nodist自身の更新
```
nodist selfupdate
```

## nodist依存ファイルのアップデート
```
nodist update
```

## node.jsの最新の安定板をインストール
```
nodist stable
```

## インストール可能なnode.jsのバージョンを確認
```
nodist dist
```

## node.jsの最新バージョンを表示
```
nodist latest
```

## バージョンを指定して追加
```
nodist + v0.11
```

## バージョンの削除
```
nodist - v0.11
```

## 現在有効なバージョン
```
node -v
```

## 有効なバージョンの切り替え
```
nodist v0.11
```

## 現在インストールされているバージョンの列挙
```
nodist ls
```
