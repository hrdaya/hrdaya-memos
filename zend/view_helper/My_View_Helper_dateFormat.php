<?php
/**
 * 日付をフォーマットして返す
 */
class My_View_Helper_dateFormat extends Zend_View_Helper_Abstract
{
    public function dateFormat($date, $short = false)
    {
        // 日付オブジェクトに変換
        try {
            $_date = new DateTime($date);
        } catch(Exception $e) {
            // エラーの場合はそのままの文字を返す
            return $date;
        }
        if ($short) {
            // 短い形式(15/01/01)
            return substr($_date->format('Y'), -2) . $_date->format('/m/d');
        } else {
            // 長い形式(2015/01/01)
            return $_date->format('Y/m/d');
        }
    }
}
