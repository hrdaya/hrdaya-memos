```php
// 言語ファイルのロード
$translator = new Zend_Translate(
        'array', // Arrayアダプタを使って言語定義を取得
        realpath(APP_PATH . '/lang/ja/Zend_Validate.php'), // 言語リソースのパス
        'ja', // 日本語ロケール
        array('scan' => Zend_Translate::LOCALE_FILENAME)// ファイル指定
);
// デフォルトのトランスレータを設定
Zend_Validate::setDefaultTranslator($translator);

        // デフォルトのトランスレータを変更する
        Zend_Validate_Abstract::setDefaultTranslator($translator);
        
        HTTP_ACCEPT_LANGUAGE を要確認
```
