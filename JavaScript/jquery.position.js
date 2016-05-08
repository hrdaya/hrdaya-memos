$(function() {

    var search = location.search;

    if (search) {
        var searches = search.slice(1).split('&');
        var params = {};
        var i, len;
        for (i = 0, len = searches.length; i < len ; i++) {
            var param = searches[i].split('=');
            params[param[0]] = param[1];
        }

    } else {
        // 値を取得するブロック（セクション）
        // keyにブロックのidを設定
        var sections = {
            abc: {
                func: function($elm, key) {
                    var states = sections[key].state;
                    // ここでステータスの種類を取得する
                    //
                    // 取得したステートを返す
                    return states.val1;
                },
                state: {
                    'val1': 0,
                    'val2': 1,
                    'val3': 2,
                    'val4': 3
                }
            },
            def: {
                func: function($elm, key) {
                    var states = sections[key].state;
                    // ここでステータスの種類を取得する
                    //
                    // 取得したステートを返す
                    return states.val1;
                },
                state: {
                    'val1': 0,
                    'val2': 1,
                    'val3': 2,
                    'val4': 3
                }
            }
        };

        // サーバに取得した値を送信
        var sendData = function(params) {
            $.ajax({
              type: 'POST',
              url: '',
              data: params
            }).fail(function(jqXHR, textStatus, errorThrown) {
                $.error(textStatus);
            });
        };

        var elms = [];
        var key;

        // イベントを取得するコンテンツを設定
        for(key in sections){
            elms.push('#' + key + ' a');
            elms.push('#' + key + ' input[type="button"]');
            elms.push('#' + key + ' input[type="submit"]');
            elms.push('#' + key + ' button');
        }

        // クリックしたときのイベントを登録
        $('body').on('click', elms.join(','), function(e){
            // セクションに対するクリック位置の取得用
            var offset = $(this).offset();
            // 全体位置に対するクリック位置の取得用
            var containerOffset = $('#container').offset();
            // サーバに送信するパラメータの設定
            var params = {
                sectionTop:    e.pageY - offset.top,
                sectionLeft:   e.pageX - offset.left,
                containerTop:  e.pageY - containerOffset.top,
                containerLeft: e.pageX - containerOffset.left,
                section: '',
                state: '',
                link: $(this).prop('tagName') === 'A' ? $(this).prop('href') : $(this).parents('form').prop('action')
            };
            // 親にセクションのidが設定されているかの確認
            for (key in sections) {
                if ($(this).parents(key).length !== 0) {
                    // 親コンテナに設定されている場合はパラメータに値をセットしてステート取得用の関数を実行
                    params.section = key;
                    params.state = sections[key].func($(this), key);
                    // サーバにデータ送信
                    sendData(params);
                    break;
                }
            }
        });
    }
});
