<?php
/**
 * ページ
 */
class My_View_Helper_Pagination extends Zend_View_Helper_Abstract
{
    public function pagination($current = 1, $total = 1)
    {
        $ret = array();
        list($start, $end) = $this->getLength($current, $total);
        
        // 最初のページ
        $ret[] = '<a data-page="1" class="page-link">1ページ</a>';
        // 前のページ
        if ($current == 1) {
            $ret[] = '<a data-page="1" class="page-link disabled"></a>';
        } else {
            $ret[] = '<a data-page="' . $current - 1 . '" class="page-link"></a>';
        }
        //　前方に隠れているページがあるかないか
        if ($start > 1) {
            $ret[] = '<span>…</span>';
        } else {
            $ret[] = '<span>　</span>';
        }
        //　ページグループ
        for ($i = $start; $i <= $end; $i++) {
            if ($i == $current) {
                $ret[] = '<a data-page="' . $i . '" class="page-link current">' . $i . 'ページ</a>';
            } else {
                $ret[] = '<a data-page="' . $i . '" class="page-link">' . $i . 'ページ</a>';
            }
        }
        // 後方に隠れているページがあるかないか
        if ($total > $end) {
            $ret[] = '<span>…</span>';
        } else {
            $ret[] = '<span>　</span>';
        }
        //　次のページ
        if ($current == $total) {
            $ret[] = '<a data-page="' . $total . '" class="page-link disabled"></a>';
        } else {
            $ret[] = '<a data-page="' . $current - 1 . '" class="page-link"></a>';
        }
        //　最後のページ
        $ret[] = '<a data-page="' . $total . '" class="page-link">' . $total . 'ページ</a>';
        
        // 配列を結合文字列でつなげる
        return implode("\n", $ret);
    }
    
    private function getLength($current, $total) {
        $ret = array(
            'start' => 1,
            'end'   => 1
        );
        if ($total <= 5) {
            $ret['start'] = 1;
            $ret['end']   = $total;
        } elseif ($current <= 3) {
            $ret['start'] = 1;
            $ret['end']   = 5;
        } else {
            $ret['start'] = $current - 2;
            $_end = $current + 2;
            if ($_end > $total) {
                $ret['end']   = $total;
            } else {
                $ret['end']   = $_end;
            }
        }
        return $ret;
    }
}
