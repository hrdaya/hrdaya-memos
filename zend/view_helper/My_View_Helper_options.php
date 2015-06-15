<?php
/**
 * selectタグのoptionを作成して返す
 */
class My_View_Helper_options extends Zend_View_Helper_Abstract
{
    public function options(array $arr, $selected)
    {
        $ret = array();
        // 属性値をエスケープする関数
        function escape_string($s) {
            return preg_replace_callback('/[^-\.0-9a-zA-Z]+/u', function($matches){
                $u16 = mb_convert_encoding($matches[0], 'UTF-16');
                return preg_replace('/[0-9a-f]{4}/', '\u$0', bin2hex($u16));  
            }, $s);
        }
        // 値を変換する
        foreach ($arr as $key => $val) {
            if ($key == $selected) {
                $ret[] = '<option value="' . escape_string($key) . '" selected>' . htmlspecialchars($val, ENT_QUOTES, 'UTF-8', false) . '</option>';
            } else {
                $ret[] = '<option value="' . escape_string($key) . '">' . htmlspecialchars($val, ENT_QUOTES, 'UTF-8', false) . '</option>';
            }
        }
        // 結合して返す
        return implode("\n", $ret);
    }
}
