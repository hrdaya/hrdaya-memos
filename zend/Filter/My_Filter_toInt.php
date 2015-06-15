/**
 * 数値に変換(空文字や真偽値の時は何もしない)
 */
class My_Filter_toInt implements Zend_Filter_Interface
{
    public function filter($value)
    {
        if ($value === '' or is_bool($value)) {
            return $value;
        }
 
        return (int)$value;
    }
}
