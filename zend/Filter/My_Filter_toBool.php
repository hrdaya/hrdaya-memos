/**
 * 真偽値に変換
 */
class My_Filter_toBool implements Zend_Filter_Interface
{
    public function filter($value)
    {
        return (bool)$value;
    }
}
