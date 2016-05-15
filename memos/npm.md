# npm
node.jsを事前にインストールしておくこと  
npmはnode.jsをインストールすると一緒にインストールされる



# npmのコマンド

## npm自身のアップデート
```
npm update -g npm
```

## npmのバージョンの確認
```
npm -v
```

## インストールしているパッケージの一覧
### Global
```
npm ls -g
```
### ローカル
```
npm ls
```

## パッケージをインストール(package.jsonに登録)
### Global
```
npm install -g [パッケージ名]
```
### ローカル
#### 通常
```
npm install [パッケージ名] --save
```
#### 開発やテストでのみ使用する場合
```
npm install [パッケージ名] --save-dev
```

## パッケージをインストール(package.jsonに登録されているもの)
### Global
```
npm install -g
```
### ローカル
```
npm install
```

## パッケージのアンインストール
### Global
```
npm uninstall -g [パッケージ名]
```
### ローカル
```
npm uninstall [パッケージ名]
```

## すべてのパッケージをアップデート
### Global
```
npm update -g
```
### ローカル
```
npm update
```


### 必要なコンポーネントのインストール(グローバルにインストールする)

```text
// jshintのインストール
npm install -g jshint
```
