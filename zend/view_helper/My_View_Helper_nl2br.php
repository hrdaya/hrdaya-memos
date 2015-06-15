<?php
/**
 * 改行コードを<br>に変換するヘルパー
 */
class My_View_Helper_nl2br extends Zend_View_Helper_Abstract
{
    public function nl2br($val, $escape = true)
    {
        // 「$escape」が真の場合は各値をエスケープする
        if ($escape) {
            // シングルクオートとダブルクオートを共に変換
            // エンコード文字セット「UTF-8」
            // html エンティティを再変換しない
            $val = htmlspecialchars($val, ENT_QUOTES, 'UTF-8', false);
        }
        // 改行コードを「<br>」に変換
        return nl2br($val, false);
    }
}
