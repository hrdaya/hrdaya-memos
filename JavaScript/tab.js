/*
 * コンテンツの設定
 * タブをラップするエレメントにtabsクラスを付与
 * タブメニューをラップするエレメントにtab-menuクラスを付与
 * aタグにactiveクラスを付与するとそのタブが有効(ネストしたタブの場合は子タブが優先)
 * aタグにdisabledクラスを付与すると無効なタブとして処理される
 * タブで切り替えるエレメントにtab-contentクラスを付与(tabsの子要素にすること)
 * エレメント表示時にはshowクラスが付与される
 * <div class="tabs">
 *   <nav class="tab-menu">
 *     <ul>
 *       <li><a href="#tab1" class="active">tab1</a></li>
 *       <li><a href="#tab2">tab2</a></li>
 *       <li><a href="#tab3">tab3</a></li>
 *     </ul>
 *   </nav>
 *   <article id="tab1" class="tab-content">
 *     <p>タブ内のコンテンツ</p>
 *   </article>
 *   <article id="tab2" class="tab-content">
 *     <p>タブ内のコンテンツ</p>
 *   </article>
 *   <article id="tab3" class="tab-content">
 *     <p>タブ内のコンテンツ</p>
 *   </article>
 * </div>
 *
 * cssの最低限の設定
/* 現在有効なタブメニューのaタグの設定 *
.tab-menu a.active {

}
/* 無効に設定されているタブメニューのaタグの設定 *
.tab-menu a.disabled,
.tab-menu a:disabled {
  cursor: default;
}
/* フェードイン用アニメーションの設定 *
@keyframes show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
/* コンテンツは通常非表示 *
.tab-content {
  display: none;
}
/* showクラスが付与された時に表示 *
.tab-content.show {
  display: block;
  /* フェードインのアニメーションの設定 *
  animation: show .3s ease;
}
 *
 * リンクの指定方法
 * http://url/index.html#tab?scroll
 * ハッシュに?scrollを付けるとその位置までスクロールする
 *
 * 表示の優先順位(下記条件を満たしてもそのタブもしくは親タブにdisabledクラスが指定されている場合は4が最優先)
 * 1. コンテンツ内にハッシュタグで指定されたエレメントが存在する親のタブ（遡って親タブも表示）
 * 2. ハッシュタグで指定されたタブ（遡って親タブも表示）
 * 3. メニューにactiveタグが指定されたタブ
 * 4. disabledクラスが設定されていない先頭のタブ
 */

$(function (undefined) {
    // クラス名一覧
    var names = {
        tabs: 'tabs',
        menu: 'tab-menu',
        content: 'tab-content',
        active: 'active',
        show: 'show',
        disabled: 'disabled'
    };

    /**
     * タブメニューのaタグをクリックした時の処理
     * @return {void}
     */
    $('.' + names.menu).on('click', 'a', function (e) {
        // デフォルトのイベントをキャンセル
        e.preventDefault();
        // 無効に設定されている場合は何もしない
        if ($(this).hasClass(names.disabled)) {
            return;
        }
        // 進む戻るを有効にする為ハッシュ値を書き換える
        location.hash = $(this).attr('href').substring(1);
        // クエリ情報を空にする
        location.search = '';
        // ハッシュが変わったことを通知する
        $(window).trigger('hashchange');
    });

    /**
     * ロケーションのハッシュが変わった時の処理
     * @return {void}
     */
    $(window).on('hashchange', function() {
        showHash();
    });

    /**
     * タブコンテンツを表示する処理
     * メニューのaタグにactive、tab-contentにshowクラスを付与する
     * @param {Object} $elm メニューの表示するaタグ(jQuery Object)
     * @return {void}
     */
    var showContent = function ($elm) {
        var $tab = $elm.parents('.' + names.tabs).first();
        var $menu = $tab.find('.' + names.menu).first();
        var href = $elm.attr('href').substring(1);

        // リンク先が設定されていない場合は何もしない
        // リンク先がない場合は何もしない
        // 無効にされたタブの時は何もしない
        if (!href || !$tab.find('[id="' + href + '"]') || $elm.hasClass(names.disabled)) {
            return;
        }

        // 現在の表示用クラスを削除
        $menu.find('.' + names.active).removeClass(names.active);
        $tab.children('.' + names.show).not('[id="' + href + '"].' + names.content).removeClass(names.show);

        // 表示クラスの付与
        $elm.addClass(names.active);
        $tab.find('[id="' + href + '"].' + names.content).addClass(names.show);
    };

    /**
     * ロケーションのハッシュで指定されたコンテンツの表示
     * @return {void}
     */
    var showHash = function () {
        var locationHash = location.hash;
        // ハッシュが無い場合は何もしない
        if (!locationHash) {
            return;
        }
        // ハッシュの値を取得する
        locationHash = locationHash.substring(1).split('?');
        var hash = locationHash[0] || '';
        // クエリ情報を取得する
        var search = location.search.substring(1).split('&');
        if (search[0] === '') {
            // クエリ情報がハッシュの後ろにある場合
            search = locationHash.length > 1 ? locationHash[1].split('&') : [];
        }
        // スクロールしてコンテンツをトップに表示するパラメータの確認
        var scroll = ($.inArray('scroll', search) >= 0 || $.inArray('scroll=true', search) >= 0);

        // ハッシュが空文字の場合は何もしない
        if (hash === '') {
            return;
        }

        // ハッシュをidとして持つエレメントが存在するか確認する
        var $hashErement = $('body').find('[id="' + hash + '"]');

        // エレメントが存在しない場合は何もしない
        if (!$hashErement) {
            return;
        }

        // ハッシュをidとして持つエレメントがタブコンテンツかタブの中のエレメントかを確認する
        var $tabContent;
        if ($hashErement.hasClass(names.content)) {
            // タブコンテンツのクラスを持っている場合
            $tabContent = $hashErement;
        } else {
            // タブコンテンツのクラスを持っていない場合は祖先のタブ
            $tabContent = $hashErement.parents('.' + names.content).first();
        }

        // タブコンテンツが無効の場合やタブコンテンツが存在しない場合は何もしない
        if ($tabContent.hasClass(names.disabled) || !$tabContent) {
            return;
        }

        // 遡ってタブコンテンツを表示していく
        var $a;
        while ($tabContent.length > 0) {
            $a = $tabContent.parents('.' + names.tabs).first()
                            .find('.' + names.menu).first()
                            .find('[href="#' + $tabContent.prop('id') + '"]').first();
            // メニューにリンクが存在している場合は表示する
            if ($a.length > 0) {
                showContent($a);
            }
            $tabContent = $tabContent.parents('.' + names.content).first();
        }

        // スクロール処理
        if (scroll) {
            $('body,html').animate({scrollTop: $hashErement.offset().top}, 'fast', 'swing');
        }
    };

    /**
     * 初期に表示するタブの設定
     * 表示優先順位3,4の設定を行う
     * @return {void}
     */
    $('.' + names.menu).each(function () {
        // メニュー内でactiveクラスを付与されたものを探す
        var $active = $(this).find('.' + names.active);
        if ($active.length > 0) {
            showContent($active.first());
        } else {
            // activeクラスがない場合はdisabledクラスで無い先頭を表示にする
            $(this).find('a').each(function () {
                if (!$(this).hasClass(names.disabled)) {
                    showContent($(this));
                    return false;
                }
            });
        }
    });

    /**
     * 初期に表示するタブの設定
     * 表示順位1,2の設定を行う
     */
    showHash();
});
