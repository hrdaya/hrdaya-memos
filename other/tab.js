/**
 * タブメニュー
 * version 1.0.0
 * update 2015-09-29
 * auther YUKI HIGA
 *
 * コンテンツの設定
 * タブをラップするエレメントにtabsクラスを付与
 * タブメニューをラップするエレメントにtab-menusクラスを付与(tabsの子要素にすること)
 * aタグにactiveクラスを付与するとそのタブが有効(ネストしたタブの場合は子タブが優先)
 * aタグにdisabledクラスを付与すると無効なタブとして処理される
 * タブで切り替えるエレメントにtab-contentクラスを付与(tabsの子要素にすること)
 * エレメント表示時にはshowクラスが付与される
 * <div class="tabs">
 *   <nav class="tab-menus">
 *     <ul>
 *       <li><a href="#tab1" class="active">tab1</a></li>
 *       <li><a href="#tab2">tab2</a></li>
 *       <li><a href="#tab3" class="disabled">tab3</a></li>
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
 * // 表示されているタブメニューの設定
 * .tab-menus a.active {}
 * // 無効に設定されているタブメニューの設定
 * .tab-menus a.disabled {
 *   cursor: default;
 * }
 * // コンテンツは通常非表示
 * .tab-content {
 *   display: none;
 * }
 * // showクラスが付与された時に表示
 * .tab-content.show {
 *   display: block;
 * }
 *
 * リンクの指定方法
 * http://url/index.html#tab?scroll
 * ?scrollをハッシュタグの後ろに入れることでハッシュタグで指定した位置までスクロールして表示する
 *
 * 表示の優先順位
 * 1. コンテンツ内にハッシュタグで指定されたエレメントが存在する親のタブ（遡って親タブも表示）
 * 2. ハッシュタグで指定されたタブ（遡って親タブも表示）
 * 3. メニューにactiveタグが指定されたタブ
 * 4. disabledクラスが設定されていない先頭のタブ
 */

$(function (undefined) {
    // クラス名一覧
    var names = {
        tabs: 'tabs',
        menu: 'tab-menus',
        content: 'tab-content',
        active: 'active',
        show: 'show',
        disabled: 'disabled'
    };

    // タブをクリックした時の処理
    $('.' + names.menu).on('click', 'a', function () {
        if ($(this).hasClass(names.disabled)) {
            return false;
        }
        // 進む戻るを有効にする為ハッシュ値を書き換えてイベントを発火する
        location.hash = $(this).attr('href').substring(1);
        $(window).trigger('hashchange');
        return false;
    });

    // ハッシュ値が変わった時の処理
    $(window).on('hashchange', function () {
        showHash();
    });

    // タブコンテンツを表示する処理
    var showContent = function ($elm) {
        var $menus = $elm.parents('.' + names.menu).first();
        var $tab = $elm.parents('.' + names.tabs).first();
        var href = $elm.attr('href').substring(1);

        // リンク先が設定されていない場合は何もしない
        // リンク先がない場合は何もしない
        // 無効にされたタブの時は何もしない
        if (href === '' ||
                $tab.find('[id="' + href + '"]').length === 0 ||
                $elm.hasClass(names.disabled)) {
            return;
        }

        // 現在の表示用クラスを削除
        $menus.find('.' + names.active).removeClass(names.active);
        $tab.children('.' + names.show).removeClass(names.show);

        // 表示処理
        $elm.addClass(names.active);
        $tab.find('[id="' + href + '"].' + names.content).addClass(names.show);
    };

    // エレメントの位置までスクロールする処理
    var scrollContent = function ($elm) {
        var position = $elm.offset().top;
        $('body,html').animate({scrollTop: position}, 'fast', 'swing');
    };

    // ハッシュで指定されたコンテンツの表示
    var showHash = function () {
        var locationHash = location.hash;
        // ハッシュが無い場合は何もしない
        if (locationHash === '') {
            return;
        }
        var hash = locationHash.substring(1).split('?');
        var scroll = hash[1] || '';
        hash = hash[0] || '';
        // ハッシュが空文字の場合は何もしない
        if (hash === '') {
            return;
        }
        // クエリ情報がscrollの場合はtrue
        scroll = (scroll === 'scroll');

        var $tabContent;
        var $scrollContent;
        var hasDisabled = false;

        // ハッシュで指定したエレメント
        $tabContent = $('.' + names.content).find('[id="' + hash + '"]');
        if ($tabContent.length !== 0) {
            // 表示位置までスクロールするコンテンツをセット
            $scrollContent = $tabContent.first();
        }
        // ハッシュを指定したエレメントが存在するか確認する
        var $hashErement = $('body').find('[id="' + hash + '"]');
        if ($hashErement.length !== 0) {
            // 表示位置までスクロールするコンテンツをセット
            $scrollContent = $hashErement.first();
            // 所属するタブコンテンツを取得する
            if ($hashErement.hasClass(names.content)) {
                // タブコンテンツクラスを持っている場合
                $tabContent = $hashErement.first();
            } else {
                // タブコンテンツクラスを持っていない場合
                // 所属するタブコンテンツを取得する
                $tabContent = $hashErement.parents('.' + names.content);
                if ($tabContent.length === 0) {
                    $tabContent = undefined;
                } else {
                    $tabContent = $tabContent.first();
                }
            }
        }
        // タブコンテンツが設定されている場合は遡って親タブを表示していく
        if ($tabContent) {
            var $tabElm = $tabContent.parents('.' + names.tabs);
            var $menu;
            var $a;
            // 祖先要素を表示していく
            while ($tabElm.length > 0) {
                $menu = $tabElm.first().children('.' + names.menu).first();
                $a = $menu.find('[href="#' + hash + '"]');
                if ($a.length === 0) {
                    break;
                } else if ($a.first().hasClass(names.disabled)) {
                    hasDisabled = true;
                    break;
                } else {
                    showContent($a.first());
                }
                hash = $tabElm.parent('.' + names.content).first().attr('id');
                if (!hash) {
                    break;
                }
                $tabElm = $tabElm.parents('.' + names.tabs);
            }
        }

        // スクロール処理
        if (!hasDisabled && scroll && $scrollContent) {
            scrollContent($scrollContent);
        }
    };

    // 初期に表示するタブの設定
    // 表示優先順位3,4の設定を行う
    $('.' + names.menu).each(function () {
        // メニュー内でactiveクラスを付与されたものを探す
        var $active = $(this).find('.' + names.active);
        if ($active.length !== 0) {
            // activeクラスが付与された先頭のエレメントに擬似的にクリックイベントを発火し、
            // 配下のコンテンツを表示する
            showContent($active.first());
        } else {
            // activeクラスがない場合はdisabledクラスで無い先頭を表示にする
            $(this).find('a').each(function (i, elm) {
                if (!$(elm).hasClass(names.disabled)) {
                    $(elm).addClass(names.active);
                    showContent($(elm));
                    return false;
                }
            });
        }
    });

    // 表示順位1,2の設定を行う
    showHash();
});
