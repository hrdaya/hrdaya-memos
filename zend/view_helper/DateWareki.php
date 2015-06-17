<?php
/**
 * 日付を和暦にして返す
 */
class My_View_Helper_DateWareki extends Zend_View_Helper_Abstract
{
    public function dateWareki($date)
    {
        // 日付オブジェクトに変換
        try {
            $_date = new DateTime($date);
        } catch(Exception $e) {
            // エラーの場合はそのままの文字を返す
            return $date;
        }
        
        // 計算用の値を取得する
        $y = (int)$_date->format('Y');
        $ymd = (int)$_date->format('Ymd');
        
        // 和暦に変換する
        $g = '';
        $wy = 0;
        if ($ymd >= 19890108) {
            $g = "平成";
            $wy = $y - 1988;
        } elseif ($ymd >= 19261225) {
            $g = "昭和";
            $wy = $y - 1925;
        } elseif ($ymd >= 19120730) {
            $g = "大正";
            $wy = $y - 1911;
        } else {
            $g = "明治";
            $wy = $y - 1868;
        }

        if ($wy === 1) {
            // 元年の時の処理
            $wy = '元';
        } else {
            // 通常の処理
            $wy = sprintf("%02d", $wy);
        }
        
        // 年と月日を結合して返す
        return $g . $wy . $_date->format('年m月d日');
    }
}
