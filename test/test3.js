/*
 * bootstrapのmodal拡張
 */
;
"use strict";
(function ($, undefined) {
    // プラグイン名
    var pluginName = "modalEx";
    // モーダルのエレメント
    var Plugin = function () {
        this.name;
        this.modal;
        this.options;
        this.buttons = [];
        this.animetions = ["zoom"];
        this.transition = false;
    };
    Plugin.prototype = {
        pluginName: pluginName,
        btnIndex: "btnIndex",
        elmClass: {
            loading: pluginName + "-loading",
            error: pluginName + "-error",
            alert: pluginName + "-alert",
            confirm: pluginName + "-confirm",
            dialog: pluginName + "-dialog",
            btn: pluginName + "-btn",
            btnSelect: pluginName + "-btn-select",
            btnsLeft: pluginName + "-btns-left",
            btnsRight: pluginName + "-btns-right",
            dragHandle: pluginName + "-drag-handle"
        },
        template: {
            wrap: '<div class="modal" tabindex="-1" role="dialog">'
                    + '<div class="modal-dialog">'
                    + '<div class="modal-content">'
                    + '<div class="modal-body">'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>',
            head: '<div class="modal-header"></div>',
            foot: '<div class="modal-footer"></div>',
            btn: '<button type="button" class="btn"></button>',
            btnHeadClose: '<button type="button" class="close" data-dismiss="modal">&times;</button>'
        },
        defaults: {
            button: {
                label: "閉じる",
                loadingText: "",
                id: "",
                class: "",
                btnClass: "default",
                position: "right",
                select: false,
                click: function (self, button) {
                }
            },
            loading: {
                id: "",
                animationClass: "",
                modalClass: "",
                dialogClass: "modal-sm",
                content: '<p class="lead">サーバー通信中...</p>'
                        + '<div class="loading-spinner">'
                        + '<div class="progress progress-striped active">'
                        + '<div class="progress-bar" style="width: 100%;">'
                        + '</div>'
                        + '</div>'
                        + '</div>',
                shown: function (self) {
                }
            },
            error: {
                id: "",
                animationClass: "",
                modalClass: "",
                dialogClass: "modal-700",
                backdrop: true,
                keyboard: true,
                drag: false,
                title: "",
                titleTag: "h4",
                titleClass: "",
                message: "",
                messageClass: "message",
                messageEscape: true,
                content: '<div class="content">'
                        + '<img alt="" src="/img/error_ojigi.gif" />'
                        + '<div class="message">'
                        + '</div>'
                        + '<div>'
                        + '※対応ブラウザ<br>'
                        + 'InternetExproler9 以上<br>'
                        + 'Chrome（最新版）<br>'
                        + 'Firefox（最新版）<br>'
                        + 'Safari（最新版）<br>'
                        + '<br>'
                        + '※JavaScript、cookie必須'
                        + '</div>'
                        + '</div>',
                shown: function (self) {
                }
            },
            alert: {
                id: "",
                animationClass: "",
                modalClass: "",
                dialogClass: "modal-sm",
                backdrop: true,
                keyboard: true,
                drag: false,
                title: "",
                titleTag: "h4",
                titleClass: "",
                message: "",
                messageClass: "message",
                messageEscape: true,
                content: '<div class="message"></div>',
                shown: function (self) {
                }
            },
            confirm: {
                id: "",
                animationClass: "",
                modalClass: "",
                dialogClass: "",
                backdrop: true,
                keyboard: true,
                drag: false,
                title: "",
                titleTag: "h4",
                titleClass: "",
                message: "",
                messageClass: "message",
                messageEscape: true,
                content: '<div class="message"></div>',
                shown: function (self) {
                }
            },
            dialog: {
                id: "",
                animationClass: "",
                modalClass: "",
                dialogClass: "",
                backdrop: true,
                keyboard: true,
                drag: false,
                title: "",
                titleTag: "h4",
                titleClass: "",
                content: '<div class="content"></div>',
                shown: function (self) {
                }
            }
        },
        _addEvent: function () {
            var self = this;
            if (self.modal !== undefined) {
                // モーダル表示後
                self.modal.on("shown.bs.modal", function (e) {
                    // backdropのインラインcssの削除
                    self.modal.find(".modal-backdrop").css("height", "");
                    // 独自アニメーションが有効かどうかの確認
                    for (var i in self.animetions) {
                        if (self.modal.hasClass(self.animetions[i]) && $.support.transition) {
                            self.transition = true;
                            break;
                        }
                    }
                    // 表示後の関数を実行（引数は「自身」）
                    self.options.shown(self);
                    // デフォルトのボタンを選択
                    var $btn = self.modal.find("." + self.elmClass.btnSelect);
                    if ($btn.length > 0) {
                        $btn[0].focus();
                    } else {
                        // デフォルトが選択されていない場合は
                        // [modal-body][modal-footer]の中からフォームの要素の先頭を選択
                        var $input = self.modal.find(".modal-body").find("input,select,textarea,button");
                        if ($input.length > 0) {
                            $input[0].focus();
                        } else {
                            self.modal.find(".modal-footer").find("button").first().focus();
                        }
                    }
                });

                // モーダルを閉じたとき
                self.modal.on("hidden.bs.modal", function (e) {
                    // エラーモーダルの時はページの再読み込み
                    if ($(this).hasClass(self.elmClass.error)) {
                        location.replace(location.href);
                    }
                    // モーダルの削除
                    if (e.target === this) {
                        // ドラッグイベントの削除
                        $(document).off("." + self.name);
                        // モーダルの削除
                        self.modal.remove();
                        $.removeData(document.body, self.name);
                    }
                    // 他にモーダルが開いている時はボディにクラスを付与
                    var modals = $("." + self.pluginName);
                    if (modals.length > 0) {
                        if (!$("body").hasClass("modal-open")) {
                            $("body").addClass("modal-open");
                        }
                    }
                });
                // ボタンをクリックした時
                self.modal.on("click", "." + self.elmClass.btn, function () {
                    // ボタンの無効化
                    self.disableButton();
                    // ローディングテキストが設定されている場合はローディングテキストの表示
                    if ($(this).data("loadingText")) {
                        $(this).button("loading");
                    }
                    // ボタンのインデックスを取得
                    var index = $(this).data(self.btnIndex);
                    // ボタンのクリック関数を実行（引数は「自身、ボタン」）
                    // 返り値がfalse以外の時はモーダルを閉じる
                    if (self.buttons[index].click(self, this) !== false) {
                        self.close();
                    }
                });
                // ドラッグが有効な時
                if (self.options.drag) {
                    var $dragElm = $(self.modal).find(".modal-header").first();
                    var $moveElm = $(self.modal).find(".modal-content").first();
                    var moveFlag;
                    var offsetTop;
                    var offsetLeft;
                    // ドラッグクラスの付与
                    $dragElm.addClass(self.elmClass.dragHandle);
                    // マウスダウンした時に座標を取得
                    $dragElm.on("mousedown", function (event) {
                        moveFlag = true;
                        event = (event) || window.event;
                        offsetTop = event.clientY - $moveElm.offset().top;
                        offsetLeft = event.clientX - $moveElm.offset().left;
                    });
                    // マウスアップした時に移動フラグを無効にする
                    $(document).on("mouseup." + self.name, function () {
                        moveFlag = false;
                    });
                    // マウスが動いた時に移動する
                    $(document).on("mousemove." + self.name, function (event) {
                        event = (event) || window.event;
                        if (moveFlag) {
                            $moveElm.offset({
                                top: event.clientY - offsetTop,
                                left: event.clientX - offsetLeft
                            });
                        }
                    });
                }
            }
        },
        // ボタンの有効化
        enableButton: function () {
            var $btns = $(this.modal).find(".modal-footer").first().find("button");
            $btns.prop("disabled", false);
            $btns.button("reset");
        },
        // ボタンの無効化
        disableButton: function () {
            var $btns = $(this.modal).find(".modal-footer").first().find("button");
            $btns.prop("disabled", true);
        },
        // モーダルの非表示
        close: function () {
            var $modal = $(this.modal);
            $modal.removeClass("in");
            if (this.transition) {
                $modal.one('bsTransitionEnd', function () {
                    $modal.modal("hide");
                }).emulateTransitionEnd(300);
            } else {
                $modal.modal("hide");
            }
        },
        // モーダルの表示
        _show: function (name) {
            // モーダルの一意の名前
            this.name = name;
            // イベントの追加
            this._addEvent();
            // モーダルの表示
            $(this.modal).modal();
        },
        // ローディングモーダルの非表示
        hideLoading: function () {
            $("." + this.elmClass.loading).modal("hide");
        },
        // すべてのモーダルを非表示
        hideAll: function () {
            $("." + pluginName).modal("hide");
        },
        // ローディングモーダルの表示
        loading: function (name, options) {
            // ボタンは無し
            this.buttons = [];
            // モーダルを作成して表示
            this._setOptions(this.defaults.loading, options)
                    ._createModal(this.elmClass.loading)
                    ._show(name);
        },
        // エラー表示
        error: function (name, options, buttons) {
            // モーダルを作成して表示
            this._setOptions(this.defaults.error, options)
                    ._setBttons(buttons, true)
                    ._createModal(this.elmClass.error)
                    ._show(name);
        },
        // アラート表示
        alert: function (name, options, buttons) {
            // モーダルを作成して表示
            this._setOptions(this.defaults.alert, options)
                    ._setBttons(buttons, true)
                    ._createModal(this.elmClass.alert)
                    ._show(name);
        },
        // 確認ダイアログ
        confirm: function (name, options, buttons) {
            // モーダルを作成して表示
            this._setOptions(this.defaults.confirm, options)
                    ._setBttons(buttons)
                    ._createModal(this.elmClass.confirm)
                    ._show(name);
        },
        // ダイアログ
        dialog: function (name, options, buttons) {
            // モーダルを作成して表示
            this._setOptions(this.defaults.dialog, options)
                    ._setBttons(buttons)
                    ._createModal(this.elmClass.dialog)
                    ._show(name);
        },
        // オプションの設定
        _setOptions: function (defaults, options) {
            //　オプションが文字列の時はメッセージへ挿入
            if ($.type(options) === "string") {
                options = {
                    message: options
                };
            }
            //　オプションのマージ
            this.options = $.extend(true, {}, defaults, options);
            // 不要なオプションの削除
            for (var key in this.options) {
                if (defaults[key] === undefined) {
                    delete this.options[key];
                }
            }
            return this;
        },
        // ボタンの設定
        _setBttons: function (buttons, single) {
            if (single) {
                // ボタンが一つのみ
                var button;
                if ($.type(buttons) === "array") {
                    // 引数が配列の場合は先頭の一つのみを抽出
                    button = $.extend(true, {}, this.defaults.button, buttons[0]);
                } else if ($.type(buttons) === "object") {
                    // 引数がオブジェクトの場合（単一のボタン）
                    button = $.extend(true, {}, this.defaults.button, buttons);
                } else if ($.type(buttons) === "string") {
                    // 引数が文字列の場合
                    buttons = {
                        label: buttons
                    };
                    button = $.extend(true, {}, this.defaults.button, buttons);
                } else {
                    // 引数がおかしいのでデフォルトを使用
                    button = $.extend(true, {}, this.defaults.button);
                }
                // ボタンのパラメータに配列として挿入
                this.buttons.push(button);
            } else {
                // 複数ボタン
                if (!buttons) {
                    // ボタンが設定されていない場合はデフォルトのボタンを挿入
                    this.buttons.push($.extend(true, {}, this.defaults.button));
                } else {
                    // ボタン配列にボタンを挿入
                    for (var i = 0, len = buttons.length; i < len; i++) {
                        this.buttons.push($.extend(true, {}, this.defaults.button, buttons[i]));
                    }
                }
            }
            return this;
        },
        // モーダルのエレメントの作成
        _createModal: function (defaultClass) {
            // オプション
            var opt = this.options;
            // テンプレート
            var temp = this.template;
            // 基準のモーダルの作成
            this.modal = $(temp.wrap).addClass(this.name).addClass(this.pluginName);
            // モーダル本体
            var $modal = $(this.modal);
            //　モーダル内のダイアログエレメント
            var $dialog = $modal.find(".modal-dialog").first();
            // モーダル内のコンテンツエレメント
            var $content = $dialog.find(".modal-content").first();
            $content.append($(temp.body));
            // モーダル内のボディ
            var $body = $content.find(".modal-body").first();
            // コンテンツの挿入
            // エスケープは行わないので注意
            $body.append(opt.content);
            // デフォルトクラスの挿入
            $modal.addClass(defaultClass);
            // モーダルIDの挿入
            if ($.type(opt.id) === "string" && opt.id) {
                $modal.attr("id", this._escapeString(opt.id));
            }
            // モーダルクラスの挿入
            if ($.type(opt.modalClass) === "string" && opt.modalClass) {
                $modal.addClass(this._escapeString(opt.modalClass));
            }
            // アニメーションクラスの挿入
            if ($.type(opt.animationClass) === "string" && opt.animationClass) {
                $modal.addClass(this._escapeString(opt.animationClass));
            }
            // ダイアログクラスの挿入（横幅の設定）
            if ($.type(opt.dialogClass) === "string" && opt.dialogClass) {
                $dialog.addClass(this._escapeString(opt.dialogClass));
            }
            // 背景をクリックした時に閉じるかどうかの設定（デフォルト「true」）
            if (!opt.backdrop) {
                $modal.attr("data-backdrop", "static");
            }
            // エスケープキーで閉じることが出来るかの設定（デフォルト「true」）
            if (!opt.keyboard) {
                $modal.attr("data-keyboard", false);
            }
            // タイトルの挿入
            if ($.type(opt.title) === "string" && opt.title) {
                var $head = $(temp.head);
                var tag = this._escapeForTag(opt.titleTag);
                if (tag === "") {
                    tag = "h4";
                }
                // 背景をクリックして画面を閉じることのできるときは閉じるボタンの挿入
                if (opt.backdrop) {
                    $head.append($(temp.btnHeadClose));
                }
                // タイトルエレメントの作成
                var $title = $(document.createElement(tag)).addClass("modal-title").html(this._escapeHTML(opt.title));
                // タイトルクラスの作成
                if ($.type(opt.titleClass) === "string" && opt.titleClass) {
                    $title.addClass(this._escapeString(opt.titleClass));
                }
                // ヘッダエレメントに挿入
                $head.append($title);
                // モーダルに挿入
                $content.prepend($head);
            }
            // メッセージの挿入
            if (opt.message) {
                var $message = $body.find("." + opt.messageClass).first();
                if ($message.length > 0) {
                    if ($.type(opt.message) === "string") {
                        // 文字列の時
                        if (opt.messageEscape) {
                            // 文字列をエスケープする
                            $message.append(this._escapeHTML(opt.message));
                        } else {
                            // HTML使用可の時
                            $message.append(this._escapeScript(opt.message));
                        }
                    } else if (opt.message instanceof $) {
                        //　Jqueryオブジェクトの時
                        if (opt.messageEscape) {
                            $message.append(this._escapeHTML(opt.message.toString()));
                        }
                    }
                }
            }
            // ボタンの挿入
            this._addButtons();
            return this;
        },
        // フッターにボタンの挿入
        _addButtons: function () {
            var $footer;
            if (this.buttons.length > 0) {
                $footer = $(this.template.foot)
                        .append($("<div></div>").addClass(this.elmClass.btnsLeft))
                        .append($("<div></div>").addClass(this.elmClass.btnsRight));
                for (var i = 0, len = this.buttons.length; i < len; i++) {
                    var $btn = $(this.template.btn);
                    // ボタンのインデックスを挿入
                    $btn.data(this.btnIndex, i);
                    // ボタンのデフォルトクラスを挿入
                    $btn.addClass(this.elmClass.btn);
                    // ボタンの文字列を挿入
                    $btn.append(this._escapeScript(this.buttons[i].label));
                    // デフォルトでセレクトするかどうか
                    if (this.buttons[i].select) {
                        $btn.addClass(this.elmClass.btnSelect);
                    }
                    // ボタンのIDを挿入
                    if ($.type(this.buttons[i].id) === "string" && this.buttons[i].id !== "") {
                        $btn.attr("id", this._escapeString(this.buttons[i].id));
                    }
                    // ボタンのローディングラベルを挿入
                    if ($.type(this.buttons[i].loadingText) === "string" && this.buttons[i].loadingText !== "") {
                        $btn.attr("data-loading-text", this._escapeString(this.buttons[i].loadingText));
                    }
                    // ボタンのクラスを挿入
                    if ($.type(this.buttons[i].class) === "string" && this.buttons[i].class !== "") {
                        $btn.addClass(this._escapeString(buttons[i].class));
                    }
                    // ボタンの色クラスを挿入
                    if ($.type(this.buttons[i].btnClass) === "string" && this.buttons[i].btnClass !== "") {
                        $btn.addClass("btn-" + this._escapeString(this.buttons[i].btnClass));
                    } else {
                        $btn.addClass("btn-default");
                    }
                    // フッターに挿入
                    if (this.buttons[i].position === "left") {
                        $footer.children("." + this.elmClass.btnsLeft).first().append($btn);
                    } else {
                        $footer.children("." + this.elmClass.btnsRight).first().append($btn);
                    }
                }
            }
            if ($footer) {
                $(this.modal).find(".modal-content").first().append($footer);
            }
            return this;
        },
        /**
         * 文字列のエスケープ
         *
         * 制御文字の削除
         * 通常のHTMLエスケープ
         * リンクやScriptに使用される文字をエスケープ
         *
         * @param {string} str エスケープする文字列
         *
         * @return {string} エスケープした文字列
         */
        _escapeString: function (str) {
            return str
                    .replace(/[\x00-\x1f\x7f-\x9f]/g, "")
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;")
                    .replace(/\//g, "&#47;")
                    .replace(/\\/g, "&#92;")
                    .replace(/\(/g, "&#040;")
                    .replace(/\)/g, "&#041;")
                    .replace(/\{/g, "&#123;")
                    .replace(/\}/g, "&#125;")
                    .replace(/\[/g, "&#91;")
                    .replace(/\]/g, "&#93;")
                    .replace(/@/g, "&#064;")
                    .replace(/%/g, "&#037;")
                    .replace(/\./g, "&#046;")
                    ;
        },
        /**
         * HTML用文字列のエスケープ
         *
         * 改行以外の制御文字の削除
         * 改行を"<br>"に変換
         * 通常のHTMLエスケープ
         * リンクやScriptに使用される文字をエスケープ
         *
         * @param {string} str エスケープする文字列
         *
         * @return {string} エスケープした文字列
         */
        _escapeHTML: function (str) {
            return str
                    .replace(/[\x00-\x09\x0b-\x1f\x7f-\x9f]/g, "")
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;")
                    .replace(/\//g, "&#47;")
                    .replace(/\\/g, "&#92;")
                    .replace(/\(/g, "&#040;")
                    .replace(/\)/g, "&#041;")
                    .replace(/\{/g, "&#123;")
                    .replace(/\}/g, "&#125;")
                    .replace(/\[/g, "&#91;")
                    .replace(/\]/g, "&#93;")
                    .replace(/@/g, "&#064;")
                    .replace(/%/g, "&#037;")
                    .replace(/\./g, "&#046;")
                    .replace(/\n/g, "<br>")
                    ;
        },
        /**
         * JavaScript用文字列のエスケープ
         *
         * 制御文字の削除
         * 2回続くスラッシュのエスケープ
         * バックスラッシュのエスケープ
         * 「()」のエスケープ
         * 「[]」のエスケープ
         * 「{}」のエスケープ
         *
         * //を取り除くことによる外部リンクの不可
         * 関数の実行、配列、オブジェクトの作成不可
         *
         * @param {string} str エスケープする文字列
         *
         * @return {string} エスケープした文字列
         */
        _escapeScript: function (str) {
            return str
                    .replace(/[\x00-\x09\x0b-\x1f\x7f-\x9f]/g, "")
                    .replace(/\/\//g, "&#47;&#47;")
                    .replace(/%2F%2F/g, "&#47;&#47;")
                    .replace(/\\/g, "&#92;")
                    .replace(/\(/g, "&#040;")
                    .replace(/\)/g, "&#041;")
                    .replace(/\[/g, "&#91;")
                    .replace(/\]/g, "&#93;")
                    .replace(/\{/g, "&#123;")
                    .replace(/\}/g, "&#125;")
                    .replace(/\n/g, "<br>")
                    ;
        },
        /**
         * タグ用文字列のエスケープ
         *
         * 英数字以外の削除
         * 大文字を小文字にする
         *
         * @param {string} str エスケープする文字列
         *
         * @return {string} エスケープした文字列
         */
        _escapeForTag: function (str) {
            return str
                    .replace(/[^A-Za-z0-9]/g, "")
                    .replace(/[A-Z]/g, function (match) {
                        return match.toLowerCase();
                    })
                    ;
        }
    };

    // プラグインの実行
    $[pluginName] = function (method) {
        // 引数を取得
        // プロトタイプの関数に引数が存在する場合は関数の実行
        switch (method) {
            case "hideLoading": // ローディングの非表示
            case "hideAll":     // すべてのモーダルの非表示
                Plugin.prototype[method]();
                break;
            case "loading": // ローディングの表示
                var $loading = $("." + Plugin.prototype.elmClass.loading);
                // すでに表示されている場合は何もしない
                if ($loading.length !== 0) {
                    return;
                }
            case "error":   // エラー表示用（閉じるときに再読み込み）（alertの拡張）
            case "alert":   // アラート表示（ボタンは一つのみ）
            case "confirm": // 確認ダイアログ（メッセージのオプションあり、ボタン複数）
            case "dialog":  // ダイアログ（メッセージのオプションなし、ボタン複数）
                // 一意のモーダル名を取得
                var name = pluginName + +new Date();
                // メソッドを除いた引数の取得
                var args = Array.prototype.slice.call(arguments, 1);
                // 引数の先頭に一意のモーダル名をセット
                args.unshift(name);
                // 新規のオブジェクトを作成し、「body」のデータに挿入
                var data = $.data(document.body, name, new Plugin());
                // メソッドの実行
                data[method].apply(data, args);
                break;
        }
    };
}(jQuery));
