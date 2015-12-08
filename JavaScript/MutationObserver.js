
// MutationObserverで実行する関数
var func = function(MutationRecords, instance) {
    console.log(MutationRecords);
    console.log(instance);
};

// 変更を監視するエレメント
var element = document.getElementById("abc");

// 監視オプション
//
// attributes    対象ノードの属性全般（属性名/属性値は問わない）
// characterData 対象ノードの子となるテキストノード
// childList     対象ノードの子ノード
//
// attributeFilter         配列   attributes    監視する属性名を限定する
// attributeOldValue       真偽値 attributes    記録するDOMデータに変更前の属性データを加える
// characterDataOldValue   真偽値 characterData 記録するDOMデータに変更前のテキストノードを加える
// subtree                 真偽値 childList     対象ノードの子孫ノードも監視する
var options = {
    childList: true,
    subtree: true
};

// MutationObserverのインスタンスを作成
var mo = new MutationObserver(func);

// MutationObserverで監視するエレメントの登録
mo.observe(element, options);

// 監視の中止
mo.disconnect();