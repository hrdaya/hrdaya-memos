/*!
 * jQuery.imeEnter v0.2.0 (http://hrdaya.github.io/jQuery.imeEnter/)
 *
 * Copyright 2015 yu-ki higa (https://github.com/hrdaya)
 * Licensed under MIT (https://github.com/hrdaya/jQuery.imeEnter/blob/master/LICENSE)
 */

(function ($) {
    'use strict';
    // プラグイン名
    var pluginName = 'imeEnter';

    // プラグイン本体
    var Plugin = function ($elm) {
        this.$elm = $elm;
        this.compositionFlag = false;
        this.cutPaste = false;
        this.on();
    };

    // プラグインのプロトタイプ
    Plugin.prototype = {
        // プラグインのイベント捕捉有効化
        on: function () {
            var _this = this;

            // 一旦イベントのoff
            _this.off();

            // 捕捉するキーイベント
            var keyEvents = [
                'cut.' + pluginName,
                'paste.' + pluginName,
                'keyup.' + pluginName,
                'compositionstart.' + pluginName,
                'compositionend.' + pluginName
            ];

            // イベント
            _this.$elm.on(keyEvents.join(' '), function (e) {
                // jQueryオブジェクトに変換
                var $elm = $(this);

                // イベントのタイプごとに処理
                switch (e.type) {
                    case 'cut':
                    case 'paste':
                        _this.cutPaste = true;
                        setTimeout(function () {
                            // enter.imeEnterイベントの発行
                            _this._trigger($elm);
                        }, 0);
                        break;
                    case 'keyup':
                        // 複合キーの時は何もしない
                        // enterキーの時は何もしない(無駄なイベントを発行しない)
                        if (e.altKey || e.metaKey || e.ctrlKey || e.keyCode === 13) {
                            return;
                        }
                        // IME入力中でない、カット・ペーストの後でない
                        if (!_this.compositionFlag && !_this.cutPaste) {
                            // enter.imeEnterイベントの発行
                            _this._trigger($elm);
                        }
                        // カット・ペーストの時の
                        _this.cutPaste = false;
                        break;
                    case 'compositionstart':
                        // 入力中フラグのセット
                        _this.compositionFlag = true;
                        break;
                    case 'compositionend':
                        // 入力中フラグのリセット
                        _this.compositionFlag = false;
                        // IME入力終了後のイベントをフックする為にkeyupイベントの発行
                        $elm.trigger('keyup');
                        break;
                }
            });
        },
        // プラグインのイベント捕捉無効化
        off: function () {
            this.$elm.off('.' + pluginName);
        },
        // プラグインの破棄
        destroy: function () {
            this.off();
            this.$elm.removeData(pluginName);
        },
        // イベントの発行
        _trigger: function ($elm) {
            // enter.imeEnterイベントの発行
            $elm.trigger($.Event('enter.' + pluginName));
        }
    };

    // プラグインの実行
    $.fn[pluginName] = function (method) {
        this.each(function (i, elm) {
            var $elm = $(elm);
            // テキスト入力エリア以外には適用しない
            var tag = $elm.prop('tagName').toLowerCase();
            switch (tag) {
                case 'input':
                    var type = $elm.prop('type').toLowerCase();
                    switch (type) {
                        case 'password':
                        case 'radio':
                        case 'checkbox':
                        case 'file':
                        case 'hidden':
                        case 'submit':
                        case 'image':
                        case 'reset':
                        case 'button':
                        case 'range':
                            return true;
                    }
                case 'textarea':
                    break;
                default:
                    return true;
            }
            // 初期化されたデータがあるか確認
            var data = $elm.data(pluginName);
            // オブジェクトが作成されていない場合は新規作成
            if (!data) {
                $elm.data(pluginName, new Plugin($elm));
                data = $elm.data(pluginName);
            }
            // プロトタイプの関数に引数が存在する場合は関数の実行
            switch (method) {
                case 'on':
                case 'off':
                case 'destroy':
                    data[method]();
                    break;
            }
        });
    };
}(jQuery));
