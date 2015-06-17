<?php
/**
 * HTMLタグの属性値に値をセットする時に使用
 */
class My_View_Helper_EscapeAttr extends Zend_View_Helper_Abstract
{
    public function escapeAttr($val)
    {
        return preg_replace_callback('/[^-\.0-9a-zA-Z]+/u', function($matches){
            $u16 = mb_convert_encoding($matches[0], 'UTF-16');
            return preg_replace('/[0-9a-f]{4}/', '\u$0', bin2hex($u16));  
        }, $val);
    }
}
