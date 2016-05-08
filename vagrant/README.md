
# リンク
- [VirtualBox](https://www.virtualbox.org/)
- [Vagrant](https://www.vagrantup.com/)

# 初期でインストールしておくプラグイン
指定したプラグインをVagrantfileに記述しておくことで自動でインストールしてくれるプラグイン  
このプラグインのみインストールしておいて、残りのプラグインはVagrantfileで指定すると管理が楽
```
vagrant plugin install vagrant-multiplug
```


# Vagrantのコマンド

## 基本操作

### 起動
VirtualBoxに追加していた仮想マシン追加・起動する  
初回起動時(VirtualBoxへの仮想マシン追加時)には`provision`も実行される  
2回目以降は`always`が指定された`provision`以外は実行されない
```
vagrant up
```

起動時に`provision`を実行する
```
vagrant up --provision
```

### 再起動
仮想マシンを再起動する
```
vagrant reload
```

再起動時に`provision`を実行する
```
vagrant reload --provision
```

### 停止
VirtualBoxの電源オフ状態にする
```
vagrant halt
```

### 破棄
VirtualBoxに追加していた仮想マシンを削除する
```
vagrant destroy
```

### 状態確認
仮想マシンの状態を確認する
```
vagrant status
```


## box関係

### オリジナルのboxの作成
```
vagrant package --base [ベースとなるBox名] --output [出力するBoxファイル名(package.box)]
```

### boxの追加
- [chef 社公式サポートbox](https://atlas.hashicorp.com/bento/)

```
vagrant box add [Box名] [ファイル名]
```

### boxの削除
```
vagrant box remove [Box名]
```

```
vagrant box remove [Box名] --box-version [バージョン名]
```

### boxの更新
mtadata.jsonを書き換えて新しいboxを作成した場合はユーザに通知されるが自動でアップデートはされない  
boxをアップデートする場合は下記のスクリプトを実行する
```
vagrant box update
```

### boxの一覧
```
vagrant box list
```

## プラグイン関係

### プラグインの追加
```
vagrant plugin install [プラグイン名]
```

### プラグインの削除
```
vagrant plugin uninstall [プラグイン名]
```

### プラグインの更新
```
vagrant plugin update
```

### プラグインの一覧
```
vagrant plugin list
```

# mtadata.jsonについて
- `Vagrantfile`の`config.vm.box_url`にこのファイルを指定することでバージョン管理を行う
- `Vagrantfile`の`config.vm.box`に`name`で指定したBox名を指定する
- 新しいバージョンを追加すると`Vagrant up`した時に更新が通知される(`config.vm.box_check_update = true`の時)  
  更新自体はユーザが手動で`vagrant box update`を実行する必要がある
- ファイル名は`mtadata.json`である必要はない(例：centos.json)
- `providers`配下の`name`は使用する仮想ソフトの名前(VirtualBox → virtualbox)
- `providers`配下の`url`に適用するboxへのリンク・URLを指定する(相対パスも可)
- `checksum`を入れることもできるが閉じられたネットワークではなくても大丈夫かと思われる

## metadata.jsonのサンプル
```
{
    "description": "boxの説明文",
    "name": "Box名 (vender/boxname)",
    "versions": [
        {
            "version": "6.0.0",
            "providers": [
                {
                    "name": "virtualbox",
                    "url": "path/to/boxname_6.0.0.box"
                }
            ]
        },
        {
            "version": "6.0.1",
            "providers": [
                {
                    "name": "virtualbox",
                    "url": "path/to/boxname_6.0.1.box"
                }
            ]
        }
    ]
}
```

## バージョン番号の付け方
バージョン番号の付け方は`1.0.0`のような付け方でも良いが、どのようなboxかが分かるように以下の方法が良いかも

- *メジャーバージョン: *OSのメジャーバージョン
- *マイナーバージョン: *DBサーバやPHP等をメジャー/マイナーアップデートした時に更新(アップデートが累積バージョンのアップデートの時には更新不要)
- *累積バージョン: *設定等を変更した時に更新

# Vagrantプラグインの参考
- [vagrant-global-status(ホスト端末内のすべての仮想端末の情報をまとめて一覧表示してくれるプラグイン)](https://github.com/fgrehm/vagrant-global-status)
- [vagrant-omnibus(仮想端末のChefのインストール状況を確認して、必要があれば自動的にインストールしてくれるプラグイン)](https://github.com/schisamo/vagrant-omnibus)
- [vagrant-vbguest(仮想端末のVirtualbox-guest-addtionのインストール状況を確認して、必要があれば自動的にインストールしてくれるプラグイン)](https://github.com/dotless-de/vagrant-vbguest)
- [dotenv(環境ごとでVagrantfileの設定値を変更するプラグイン)](http://blog.glidenote.com/blog/2014/02/26/vagrant-dotenv/)
