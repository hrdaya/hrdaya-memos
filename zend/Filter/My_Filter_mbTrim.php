/**
 * 全角文字を含めたトリム
 */
class My_Filter_mbTrim implements Zend_Filter_Interface
{
    public function filter($value)
    {
        return preg_replace('/^[\s　]+|[\s　]+$/u', '', $value);
    }
}
