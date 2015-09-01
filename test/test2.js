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
        this.boolCmp = false;
        this.oldVal = '';
        this.on();
    };

    // プラグインのプロトタイプ
    Plugin.prototype = {
        // プラグインのイベント捕捉有効化
        on: function () {
            var self = this;

            // イベントの重複登録を避けるため一旦off
            self.off();

            // 捕捉するキーイベント
            var keyEvents = [
                'focus.' + pluginName,
                'blur.' + pluginName,
                'input.' + pluginName,
                'compositionstart.' + pluginName,
                'compositionend.' + pluginName
            ];

            // イベントの登録
            self.$elm.on(keyEvents.join(' '), function (e) {
                // イベントのタイプごとに処理
                switch (e.type) {
                    case 'focus':
                        document.addEventListener('selectionchange', function () {
                            if (self.oldVal !== self.$elm.val()) {
                                self.$elm.trigger('input');
                            }
                            self.oldVal = self.$elm.val();
                        }, false);
                        break;
                    case 'blur':
                        document.removeEventListener('selectionchange', false, false);
                        break;
                    case 'input':
                        // IME入力中でない時にイベントの発行
                        if (!self.boolCmp) {
                            self.raiseEvent();
                        }
                        break;
                    case 'compositionstart':
                        // 入力中フラグのセット
                        self.boolCmp = true;
                        break;
                    case 'compositionend':
                        // 入力中フラグのリセット
                        self.boolCmp = false;
                        self.raiseEvent();
                        break;
                }
            });
        },
        // プラグインのイベント捕捉無効化
        off: function () {
            this.$elm.trigger('blur');
            this.$elm.off('.' + pluginName);
        },
        // プラグインの破棄
        destroy: function () {
            this.off();
            this.$elm.removeData(pluginName);
        },
        // イベントの発行
        raiseEvent: function () {
            this.$elm.trigger($.Event('enter.' + pluginName));
        }
    };

    // プラグインの実行
    $.fn[pluginName] = function (method) {
        this.each(function () {
            // 文字列入力エリア以外には適用しない
            switch ($(this).prop('tagName').toLowerCase()) {
                case 'input':
                    switch ($(this).prop('type').toLowerCase()) {
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
            // 登録されたデータ属性の取得
            var data = $.data(this, pluginName) || $.data(this, pluginName, new Plugin($(this)));
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
