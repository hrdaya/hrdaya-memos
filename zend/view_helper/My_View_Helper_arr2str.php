<?php
/**
 * 配列を文字列で結合して返す
 */
class My_View_Helper_arr2str extends Zend_View_Helper_Abstract
{
    public function arr2str(array $arr, $escape = true, $joinStr = '<br>')
    {
        // 連想配列の場合は値のみを使用する
        $_arr = array_values($arr);
        // 「$escape」が真の場合は各値をエスケープする
        if ($escape) {
            for ($i = 0, $len = count($_arr); $i < $len; $i++) {
                // シングルクオートとダブルクオートを共に変換
                // エンコード文字セット「UTF-8」
                // html エンティティを再変換しない
                $_arr[$i] = htmlspecialchars($_arr[$i], ENT_QUOTES, 'UTF-8', false);
            }
        }
        // 配列を結合文字列でつなげる
        return implode($joiStr, $_arr);
    }
}
