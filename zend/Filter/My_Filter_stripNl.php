/**
 * 改行コードの削除
 */
class My_Filter_StripNl implements Zend_Filter_Interface
{
    public function filter($value)
    {
        return str_replace("\n", '', $value);
    }
}
