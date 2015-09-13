/* 今日はいい天気です */
$(function () {
    'use strict';

    var selection;
    var $inputArea;

    //文字が選択されているか判断
    var checkSelectionText = function () {
        return document.getSelection().toString().length > 0;
    };

    // 本文の選択範囲を取得
    var getSelection = function (elm) {
        var str = $(elm).text();
        var range = str.slice(elm.selectionStart, elm.selectionEnd);
        var beforeNode = str.slice(0, elm.selectionStart);
        var afterNode = str.slice(elm.selectionEnd);
        return {
            elm: elm,
            before: beforeNode,
            after: afterNode,
            range: range,
            start: elm.selectionStart,
            end: elm.selectionEnd
        };
    };

    // 本文の書き換え
    var setSelection = function (selection, str) {
        $(selection.elm).val(selection.before + str + selection.after).change().focus();
        var caret = selection.before.length + str.length;
        selection.elm.selectionStart = caret;
        selection.elm.selectionEnd = caret;
    };

    $(document).on('click', '.small', function () {
        if (checkSelectionText()) {
            $inputArea = $(this).parents('.text-input-wrap').first().find('.text-input').first();
            $inputArea.focus();
            document.execCommand('fontSize', false, '1');
            $('#view').val($inputArea.html());
        }
    });

    $(document).on('click', '.red', function () {
        if (checkSelectionText()) {
            $inputArea = $(this).parents('.text-input-wrap').first().find('.text-input').first();
            $inputArea.focus();
            document.execCommand("foreColor", false, 'rgb(255,0,0)');
            $('#view').val($inputArea.html());
        }
    });

    $(document).on('click', '.bold', function () {
        if (checkSelectionText()) {
            $inputArea = $(this).parents('.text-input-wrap').first().find('.text-input').first();
            $inputArea.focus();
            document.execCommand('bold');
            $('#view').val($inputArea.html());
        }
    });

    $(document).on('click', '.link', function () {
        if (checkSelectionText()) {
            $inputArea = $(this).parents('.text-input-wrap').first().find('.text-input').get(0);
            var ranges = [];

            var getSelection = function () {
                if (window.getSelection) {
                    return window.getSelection();
                } else if (document.getSelection) {
                    return document.getSelection();
                } else if (document.selection) {
                    return document.selection;
                }
            };
        }
        var selection = getSelection();
        var range = selection.getRangeAt(0);
        console.log(range.endContainer);
        var font = document.createElement("font");
        font.style.color = "#ff0000";
        range.surroundContents(font);



        var selection = document.selection.createRange();
        selection.setEndPoint("EndToStart", selection);
        selection.select();


        $('#link-panel').show();
        $('#link').focus();
        $inputArea.focus();
    });
    $('#link-submit,#link-cancel').on('click', function () {
        $('#link-panel').hide();
    });

    $(document).on('click', '.reset', function () {
        if (checkSelectionText()) {
            $inputArea = $(this).parents('.text-input-wrap').first().find('.text-input').first();
            $inputArea.focus();
            document.execCommand('removeformat');
            document.execCommand('unlink');
            $('#view').val($inputArea.html());
        }
    });

    $('.text-input').each(function () {
        var $this = $(this);
        $this.data('composition', false);

        // 編集を有効にする
        $this.prop('contenteditable', true);
        $this.on('keyup cut past', function () {
            setTimeout(function () {
                if (!$this.data('composition')) {
                    $('#view').val($this.html());
                }
            }, 0);
        }).on('compositionstart', function () {
            $this.data('composition', true);
        }).on('compositionend', function () {
            $this.data('composition', false);
        });
        // ボタンを挿入するためのラップ
        var $wrap = $('<div></div>').addClass('text-input-wrap');
        // ボタン群
        var $ul = $('<ul></ul>').append(
                $('<li></li>').append($('<button></button>').attr('type', 'button').addClass('small').text('小文字'))
                ).append(
                $('<li></li>').append($('<button></button>').attr('type', 'button').addClass('red').text('赤字'))
                ).append(
                $('<li></li>').append($('<button></button>').attr('type', 'button').addClass('bold').text('太字'))
                ).append(
                $('<li></li>').append($('<button></button>').attr('type', 'button').addClass('link').text('リンク'))
                ).append(
                $('<li></li>').append($('<button></button>').attr('type', 'button').addClass('mail').text('メール'))
                ).append(
                $('<li></li>').append($('<button></button>').attr('type', 'button').addClass('reset').text('リセット'))
                );

        // エレメントの後ろにラップを挿入
        $this.after($wrap);
        // ラップにボタンを挿入
        $wrap.append($ul);
        // 入力エリアをラップに挿入
        $wrap.append($this);
    });

    // CSSでスタイルを設定するようにする
//    document.execCommand('styleWithCSS', false, false);
});
