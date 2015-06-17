<?php

/**
 * Zend_Mailのラッパークラス
 *
 * 設定なしに日本語メールを送れるようにする
 *
 */
class My_Mail extends Zend_Mail
{

    /**
     * Mail character set
     * @var string
     */
    protected $_charset = 'ISO-2022-JP';

    /**
     * Encoding of Mail headers
     * @var string
     */
    protected $_headerEncoding = Zend_Mime::ENCODING_BASE64;

    /**
     * Zend_MailのsetBodyTextをオーバーライド
     *
     * @param  string $txt
     * @param  string $charset
     * @param  string $encoding
     * @return Zend_Mail Provides fluent interface
     */
    public function setBodyText($txt, $charset = null, $encoding = Zend_Mime::ENCODING_7BIT)
    {
        parent::setBodyText($this->encoding($txt), $charset, $encoding);
        return $this;
    }

    /**
     * Zend_MailのsetBodyHtmlをオーバーライド
     *
     * @param  string    $html
     * @param  string    $charset
     * @param  string    $encoding
     * @return Zend_Mail Provides fluent interface
     */
    public function setBodyHtml($html, $charset = null, $encoding = Zend_Mime::ENCODING_7BIT)
    {
        parent::setBodyHtml($this->encoding($txt), $charset, $encoding);
        return $this;
    }

    /**
     * Zend_MailのsetSubjectをオーバーライド
     *
     * @param   string    $subject
     * @return  Zend_Mail Provides fluent interface
     * @throws  Zend_Mail_Exception
     */
    public function setSubject($subject)
    {
        // parent::setSubject(mb_encode_mimeheader($this->encoding($subject), 'ISO-2022-JP'));
        parent::setSubject($this->_encodeHeader($this->encoding($name)));
        return $this;
    }

    /**
     * Zend_Mailの_formatAddressをオーバーライド
     *
     * @param string $email
     * @param string $name
     * @return string
     */
    protected function _formatAddress($email, $name)
    {
        if (empty($name) or $name === $email) {
            return $email;
        } else {
            $encodedName = $this->_encodeHeader($this->encoding($name));
            $format = '"%s" <%s>';
            return sprintf($format, $encodedName, $email);
        }
    }

    /**
     * メール送信用の文字列エンコード
     *
     * @param string $text エンコードする文字列
     * @return string エンコードした文字列
     */
    protected function encoding($text = '')
    {
        return mb_convert_encoding($text, 'ISO-2022-JP', 'UTF-8');
    }

    /**
     * メール送信用の文字列エンコード
     *
     * @param string $text エンコードする文字列
     * @return string エンコードした文字列
     */
    public function encodingFilename($filename = '')
    {
        return $this->_encodeHeader($this->encoding($filename));
    }
}
