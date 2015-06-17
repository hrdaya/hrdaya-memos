<?php
/**
 * selectタグのoptionを作成して返す
 */
class My_View_Helper_Options extends Zend_View_Helper_Abstract
{
    public function options(array $arr, $selected)
    {
        $ret = array();
        // 値を変換する
        foreach ($arr as $key => $val) {
            if ($key == $selected) {
                $ret[] = '<option value="' . htmlspecialchars($key, ENT_QUOTES, 'UTF-8', false) . '" selected>' . htmlspecialchars($val, ENT_QUOTES, 'UTF-8', false) . '</option>';
            } else {
                $ret[] = '<option value="' . htmlspecialchars($key, ENT_QUOTES, 'UTF-8', false) . '">' . htmlspecialchars($val, ENT_QUOTES, 'UTF-8', false) . '</option>';
            }
        }
        // 結合して返す
        return implode("\n", $ret);
    }
}
