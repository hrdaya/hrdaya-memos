/**
 * 改行以外の制御文字を削除
 */
class My_Filter_stripCtl implements Zend_Filter_Interface
{
    public function filter($value)
    {
        return preg_replace('/[\x00-\x09\x0b-\x1f\x7f]/', '', $value);
    }
}
