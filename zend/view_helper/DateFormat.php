<?php
/**
 * 日付をフォーマットして返す
 */
class My_View_Helper_DateFormat extends Zend_View_Helper_Abstract
{
    public function dateFormat($date, $format = 'Y/m/d')
    {
        // 日付オブジェクトに変換
        try {
            $_date = new DateTime($date);
            return $_date->format($format);
        } catch(Exception $e) {
            // エラーの場合はそのままの文字を返す
            return $date;
        }
    }
}
