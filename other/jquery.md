# 1.4から1.5への変更点

- Ajax モジュールの書き直し
- Deferred オブジェクトの導入
- jQuery.sub()の導入
- .clone()の引数追加
- jQuery.hasData( element )の導入
- jQuery.parseXML( data )の導入
- 隣接走査の性能向上
- ビルドシステムの変更

## Ajax モジュールの書き直し

大きな違いとしては、jQuery.ajax()（や jQuery.get(), jQuery.post()など）が XMLHttpRequest オブジェクトの代わりに jQuery XMLHttpRequest (jqXHR) オブジェクトを返すようになったことです。
返信される jqXHR オブジェクトは以下のプロパティ・メソッドを返します。

- readyState
- status
- statusText
- responseXML（※リクエストが xml でレスポンスされたとき）
- responseText（※リクエストが text でレスポンスされたとき）
- setRequestHeader(name, value)
- getAllResponseHeaders()
- getResponseHeader()
- abort()

jqXHRはPromiseインターフェースが実装されていてコールバックの登録などが柔軟に行えます。
complete, error, successの変わりに下記の方法で処理を行うことが推奨されます。

```
var jqXHR = $.ajax({
                // ajaxのセッティング
            }).done(function(data, statusText, jqXHR) {
                // 成功時の処理
            }).fail(function(jqXHR, statusText, errorThrown) {
                // 失敗時の処理
            }).always(function(jqXHR, statusText) {
                // 成功・失敗両方で行う処理
            });
```

# 1.5から1.6への変更点

- .data()でのdata- 属性の取り込み方の変更
- DOM の属性とプロパティの区別（.prop(), .removeProp()の導入と.attr() の変更）
- 真偽値を取る属性の追加・削除
- .attr()と.val()の拡張
- jQuery.map()の対象範囲拡大
- .css()の値の相対指定
- .data()の性能向上
- deferred.always(), deferred.pipe()の導入
- アニメーションの同期
- アニメーションがより滑らかに
- .promise()の導入
- イベントのトリガーの性能向上
- jQuery.holdReady()の導入
- :focusセレクタの導入
- .find(), .closest(), .is()の改良（.nextUntil(), .parentsUntil(), .prevUntil() も）
- .undelegate()の引数形式の追加

## .data()でのdata- 属性の取り込み方の変更

1.6 ではdata- 属性を取り込む時のキーの値を HTML5 の仕様に合わせて、 ダッシュ（-）が入るdata- 属性はキャメルケース化するようになりました。 例えば 1.5.2 では、data-max-value="15"という属性は { max-value: 15 }という data オブジェクトが 作成されましたが、1.6 以降は{ maxValue: 15 }という data オブジェクトが作成されます。

## DOM の属性とプロパティの区別（.prop(), .removeProp()の導入と.attr() の変更）

jQuery 1.6 で DOM の属性への処理とプロパティへの処理を 分離し、それぞれ.attr()と .prop()（新規導入）に割り当てられました。 あわせて.removeProp()も新規導入されました。

1.6 より前では、.attr("checked") は checked プロパティの値を返していたのですが 1.6 で 属性とプロパティの処理を .attr() と .prop() に分離したことで .attr("checked") は属性の値を返すようになりました。

1.6 に移行する場合は boolean 型の属性へのアクセスには .attr() の代わりに .prop() を使って（もしくは直接） プロパティにアクセスするように書き換えなければなりません。

## 真偽値を取る属性の追加・削除

selected や checked などの boolean 型の属性の追加・削除を、 .attr()にtrueかfalseを 渡すことで行えるようになりました。

```
// 以下の構文が使用できます
$("#checkbox").attr("checked", true);
$("#checkbox").attr("checked", false);
```

# 1.6から1.7への変更点

- .on()と.off()の導入
- .delegate()と.live()の パフォーマンス向上
- IE 6,7,8 の HTML5 のサポート強化
- toggle 系アニメーションが直感的に動く
- Asynchronous Module Definition (AMD) のサポート
- jQuery.Deferred の拡張（progress）
- jQuery.isNumeric()の導入
- event.delegateTargetプロパティの導入
- .removeAttr()と.removeData()で 複数削除ができるように
- .is()の挙動の一部変更

## 削除された機能

- event.layerXとevent.layerY
- jQuery.isNaN()
- jQuery.event.proxy()

## .on()と.off()の導入

.on()と.off()は イベント登録・削除メソッドです。これらで既存の .bind()(.unbind()), .delegate()(.undelegate()), .live()(.die())の役割を 果たすことができます。
1.7以降は.bind()(.unbind()), .delegate()(.undelegate()), .live()(.die())の使用は非推奨です。後のバージョンで削除されますので、.on()と.off()を使用するようにしてください。

# 1.7から1.8への変更点

- Sizzle の書き直し
- アニメーションの見直し
- CSS のプレフィックスを自動化
- $(html, props)のpropsでの指定範囲が拡大

## 削除された機能

- $(element).data("events")
- Deferred.isResolved()と Deferred.isRejected()
- $(element).closest(Array)が配列を返すこと
- $.curCSS()
- $.attrFn

# 1.8から1.9への変更点

ここで大きく変更されます。変更点も広範囲におよびますので参考リンクを添付します。

- [jQuery 1.9.0 での変更箇所の自分なりのまとめ](http://myjquery.blog.fc2.com/blog-entry-13.html)
- [jQuery 1.9 に更新する際に注意すべき変更点の自分なりのまとめ](http://myjquery.blog.fc2.com/blog-entry-14.html)

## 削除された機能

- .toggle(function, function) の用法
- jQuery.browser()
- .live()と.die()
- jQuery.sub()
- document 以外の要素での AJAX イベント ( .ajaxStart, .ajaxStop, .ajaxSend, .ajaxComplete, .ajaxError, .ajaxSuccess )
- .data()での setData , getData イベント
- 擬似イベント"hover"
- .selectorプロパティ(削除同然)
- 文書化されてないメソッドの引数(jQuery.attr()など)
- .data("events")でのイベントデータの取得
- Event オブジェクトのプロパティ attrChange, attrName, relateNode, srcElement
- jQuery.deletedIds
- jQuery.uuid
- jQuery.attrFn(警告あり)
- jQuery.clean()(警告あり)
- jQuery.event.handle()(警告あり)
- jQuery.offset.bodyOffset()

## 変更された機能

- jQuery オブジェクトが保持する DOM ツリーに 接続されてないノードの順序
- .andSelf()が.addBack()と 置き換えに
- ドキュメント内に無いノードで .after(), .before(), .replaceWith() した場合の挙動
- .appendTo(), .insertBefore(), .insertAfter(), .replaceAll()
- .trigger() された "click" イベント中の チェックボックスやラジオボタンの状態
- .trigger() された "focus" イベントでの "blur" イベントとの発生順序
- jQuery()に渡す HTML 文字列と セレクタ文字列の解釈方法
- ピリオドが含まれるキーを.data()に 渡した時の処理
- HTML コンテンツ内でのスクリプトのロードと実行
- .attr()と.prop()
- $("input").attr("type", newValue)
- jQuery.ajaxの JSON データの取得成功判定方法
- jQuery.proxy()のコンテキスト

# 1.9から1.10への変更点

機能的に変わるというよりも、2系との振る舞いの同期に重きを置かれたバージョンアップです

- $( htmlString )に渡す HTML 文字列の制限の緩和
- モジュール性の強化
- jQuery.fn.size()が deprecated に
- jQuery.support.boxModelの削除

# 1.10から1.11への変更点

- API に変更点無し
- npm への登録、ついでに Bower にも

## npm への登録、ついでに Bower にも

npm に登録されたことにより、CommonJS 環境で使用することができます。
ただし、document オブジェクトが在る場合は jQuery 本体が返りますが、 グローバルに expose されないので、必要なら例えば window.jQuery = window.$ = require("jquery") と手動で expose します。
document オブジェクトが無い場合は jQuery 本体の ファクトリ関数が返り、document オブジェクトを持つ オブジェクトを渡して jQuery 本体を作成します。 この場合は渡したオブジェクトの jQuery プロパティと $ プロパティに jQuery 本体が設定されます。