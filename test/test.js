$(function () {
    // セレクト
    var slc = '';
    $(".table-wrap tbody").selectable({
        filter: 'th,td',
        stop: function () {
            slc = '';
        },
        selecting: function (e, i) {
            if (!slc) {
                switch (true) {
                    case $(i.selecting).hasClass('col1'):
                        slc = 'col1';
                        break;
                    case $(i.selecting).hasClass('col2'):
                        slc = 'col2';
                        break;
                    case $(i.selecting).hasClass('col3'):
                        slc = 'col3';
                        break;
                }
            }
            if (!$(i.selecting).hasClass(slc)) {
                $(i.selecting).removeClass('ui-selecting');
            }
        },
        selected: function (e, i) {
            if (!$(i.selected).hasClass(slc)) {
                $(i.selected).removeClass('ui-selected');
            }
        }
    });

    // ホバー
    $('.table-wrap tbody tr,.table-wrap tbody th,.table-wrap tbody td').on('mouseenter', function () {
        $(this).addClass('hover');
    }).on('mouseleave', function () {
        $(this).removeClass('hover');
    });

    /* コンテキストメニュー --------------------------------------------------- */
    // 非表示
    $(document).on('click', '#context-menu', function () {
        $(this).fadeOut('fast', function () {
            $($('#context-menu').data('elm')).find('.context-hover').removeClass('context-hover');
        });
    }).on('click', '#context-menu .disabled', function () {
        return false;
    });
    // 表示
    $('.table-wrap tbody').on('contextmenu', function (e) {
        // 仮のホバークラスを付与
        $(this).find('.hover').addClass('context-hover');
        // コンテキストにホバー行をセット
        $('#context-menu').data('elm', this);
        // セルの結合設定
        if ($(this).find('.ui-selected.context-hover').length !== 0) {
            $('#join-cell').removeClass('disabled');
        } else {
            $('#join-cell').addClass('disabled');
        }
        // セルの分割設定
        $('#separate-cell').addClass('disabled');
        $(this).find('[rowspan].context-hover').each(function () {
            var rspan = parseInt($(this).attr('rowspan'), 10);
            if (rspan > 1) {
                $('#separate-cell').removeClass('disabled');
                return false;
            }
        });
        // セルの列分割設定
        if ($(this).find('th.context-hover').first().length === 0 ||
                $(this).find('th.context-hover').first().next('td').hasClass('col1_2')) {
            $('#separate-col').addClass('disabled');
        } else {
            $('#separate-col').removeClass('disabled');
        }
        // 行の削除設定
        if ($(this).children('tr').length > 1) {
            $('#del-row').removeClass('disabled');
        } else {
            $('#del-row').addClass('disabled');
        }
        // コンテキストメニューを表示
        $('#context-menu').fadeIn('fast');
        // コンテキストメニューのポジションを設定
        var positionY = e.pageY;
        if ($('#context-menu').height() < (positionY + $('#context-menu').children('ul').height() + 2)) {
            positionY -= $('#context-menu').children('ul').height();
        }
        $('#context-menu').children('ul').css({top: positionY, left: e.pageX});
        // 標準のコンテキストメニューのキャンセル
        return false;
    });
    // コンテキストのセルの結合イベント
    $('#join-cell').on('click', function () {
    });
    // コンテキストのセルの分割イベント
    $('#separate-cell').on('click', function () {
    });
    // コンテキストのセルの列分割イベント
    $('#separate-col').on('click', function () {
    });
    // コンテキストの行の追加イベント
    $('#add-cell').on('click', function () {
    });
    // コンテキストの行の削除イベント
    $('#del-cell').on('click', function () {
    });

    /* 並べ替え --------------------------------------------------- */
});