<?php
/*
 * CSRF対策(セッションIDを利用した固定トークン方式)
 */
class Csrf
{

    /**
     * トークンの生成に使用するソルト
     * @var string
     */
    const SALT = 'TOKEN_SALT';

    /**
     * ハッシュのアルゴリズム
     * @var string
     */
    const ALGO = 'sha256';

    /**
     * トークン名
     * @var string
     */
    const TOKEN_NAME = 'token';

    /**
     * トークンを生成して返す
     * @return string
     */
    public static generate()
    {
        // セッションのステータスを確認する
        $sessionStatus = session_status();
        if ($sessionStatus === PHP_SESSION_NONE) {
            // セッションがスタートしていない場合はスタートする
            session_start();
        } elseif ($sessionStatus === PHP_SESSION_DISABLED) {
            // セッションが無効の場合は例外をスローする
            throw new LogicException('セッションが無効です');
        }

        // ハッシュした値を返す
        return hash_hmac(static::ALGO, session_id(), static::SALT);
    }

    /**
     * INPUTを生成して返す
     * @return string
     */
    public static function generateInput()
    {
        return '<input type="hidden"'
                   . ' class="' . static::TOKEN_NAME . '"'
                   . ' name="' . static::TOKEN_NAME . '"'
                   . ' value="' . static::generate() . '"'
                   . ' />';
    }

    /**
     * トークンに使用する名前を取得する
     * @return string
     */
    public static getName()
    {
        return static::TOKEN_NAME;
    }

    /**
     * トークンが正しいかどうかを確認する
     * @return bool
     */
    public static isValid()
    {
        return static::generate() === filter_input(INPUT_POST, static::TOKEN_NAME);
    }
}