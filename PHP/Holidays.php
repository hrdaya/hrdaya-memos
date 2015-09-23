<?php
/*
 * 日本の祝日を取得するクラス
 */
class Holidays
{

    /**
     * 振替休日用文字列
     *
     * @var string
     */
    const FURIKAE = '振替休日';

    /**
     * 振替休日が始まった日付
     *
     * @var string
     */
    const DATE_FURIKAE = '1973-04-12';

    /**
     * 国民の休日用文字列
     *
     * @var string
     */
    const KOKUMIN = '国民の休日';

    /**
     * 国民の休日が始まった日付
     *
     * @var string
     */
    const DATE_KOKUMIN = '1985-12-27';

    /**
     * 基本のフォーマット（時間なし）
     *
     * @var string
     */
    const FORMATDATE = 'Y-m-d';

    /**
     * 祝日を保存しておく配列
     *
     * @access protected
     *
     * @var array
     */
    protected static $_Hollidays = array();

    /**
     * 祝日の設定
     * array(始まりの年, 終わりの年, 月, 日, 祝日名)
     * 日の設定: 数字（固定日）
     *         配列 array(何回目, 曜日番号)
     *         文字列（関数名）
     * 曜日番号 0：日曜日, 1：月曜日, 2：火曜日, 3：水曜日, 4：木曜日, 5：金曜日, 6：土曜日
     *
     * @access protected
     *
     * @var array
     */
    protected static $Holidays = array(
        array(1874, 1948, 1, 1, "四方節"),
        array(1949, 9999, 1, 1, "元日"),
        array(1874, 1948, 1, 3, "元始祭"),
        array(1874, 1948, 1, 5, "新年宴会"),
        array(1949, 1999, 1, 15, "成人の日"),
        array(2000, 9999, 1, array(2, 1), "成人の日"),
        array(1874, 1912, 1, 30, "孝明天皇祭"),
        array(1874, 1948, 2, 11, "紀元節"),
        array(1967, 9999, 2, 11, "建国記念の日"),
        array(1989, 1989, 2, 24, "昭和天皇の大喪の礼"),
        array(1879, 1948, 3, 'getSyunbun', "春季皇霊祭"),
        array(1949, 2199, 3, 'getSyunbun', "春分の日"),
        array(1874, 1948, 4, 3, "神武天皇祭"),
        array(1959, 1959, 4, 10, "皇太子・明仁親王の結婚の儀"),
        array(1927, 1948, 4, 29, "天長節"),
        array(1949, 1988, 4, 29, "天皇誕生日"),
        array(1989, 2006, 4, 29, "みどりの日"),
        array(2007, 9999, 4, 29, "昭和の日"),
        array(1949, 9999, 5, 3, "憲法記念日"),
        array(2007, 9999, 5, 4, "みどりの日"),
        array(1949, 9999, 5, 5, "こどもの日"),
        array(1993, 1993, 6, 9, "皇太子・徳仁親王の結婚の儀"),
        array(1996, 2002, 7, 20, "海の日"),
        array(2003, 9999, 7, array(3, 1), "海の日"),
        array(1913, 1926, 7, 30, "明治天皇祭"),
        array(2016, 9999, 8, 11, "山の日"),
        array(1913, 1926, 8, 31, "天長節"),
        array(1966, 2002, 9, 15, "敬老の日"),
        array(2003, 9999, 9, array(3, 1), "敬老の日",),
        array(1874, 1878, 9, 17, "神嘗祭"),
        array(1878, 1947, 9, 'getSyuubun', "秋季皇霊祭"),
        array(1948, 2199, 9, 'getSyuubun', "秋分の日"),
        array(1966, 1999, 10, 10, "体育の日"),
        array(2000, 9999, 10, array(2, 1), "体育の日"),
        array(1873, 1879, 10, 17, "神嘗祭"),
        array(1913, 1926, 10, 31, "天長節祝日"),
        array(1873, 1911, 11, 3, "天長節"),
        array(1927, 1947, 11, 3, "明治節"),
        array(1948, 9999, 11, 3, "文化の日"),
        array(1990, 1990, 11, 12, "即位の礼正殿の儀"),
        array(1873, 1947, 11, 23, "新嘗祭"),
        array(1948, 9999, 11, 23, "勤労感謝の日"),
        array(1915, 1915, 11, 10, "即位の礼"),
        array(1915, 1915, 11, 14, "大嘗祭"),
        array(1915, 1915, 11, 16, "大饗第1日"),
        array(1928, 1928, 11, 10, "即位の礼"),
        array(1928, 1928, 11, 14, "大嘗祭"),
        array(1928, 1928, 11, 16, "大饗第1日"),
        array(1989, 9999, 12, 23, "天皇誕生日"),
        array(1927, 1947, 12, 25, "大正天皇祭")
    );

    /*
     * 年ごとの祝日一覧の取得(キーに日付、値に祝日名)
     *
     * @access public
     *
     * @param Integer $year 取得する年
     *
     * @return array 取得した祝日の連想配列
     */
    public static function get($year = 0)
    {
        // 年を取得する関数（$yearが0以下の場合は現在の年）
        $getYear = function() use (&$year) {
            $year = (int)$year;
            if ($year > 0) {
                $year = (string)$year;
            } else {
                $date = new \DateTime();
                $year = $date->format('Y');
            }
        };
        // 年を取得する関数の実行
        $getYear();
        // キャッシュに存在する場合はその値、キャッシュに無い場合は新しく作成
        return isset(self::$_Hollidays[$year]) ?
                self::$_Hollidays[$year] : self::create($year);
    }

    /*
     * 年ごとの祝日一覧の取得（祝日の日付の配列）
     *
     * @access public
     *
     * @param Integer $year 取得する年
     *
     * @return Array 取得した祝日の配列
     */
    public static function getKeys($year = 0)
    {
        // キーのみを配列にして返す
        return array_keys(self::get($year));
    }

    /*
     * その年の祝日一覧を作成
     *
     * @access protected
     *
     * @param String $year 取得する年
     *
     * @return Array 祝日一覧の配列
     */
    protected static function create($year)
    {
        // 作成するキャッシュ用配列の初期化
        self::$_Hollidays[$year] = array();
        // 祝日設定の配列を元に祝日のキャッシュを作成する
        for ($i = 0, $len = count(self::$Holidays); $i < $len; $i++) {
            if (self::$Holidays[$i][0] <= $year and $year <= self::$Holidays[$i][1]) {
                // 祝日のDateTimeを取得
                $date = self::getHoliday(
                    $year, self::$Holidays[$i][2], self::$Holidays[$i][3]
                );
                // キャッシュ用配列にセット
                self::$_Hollidays[$year][$date->format(self::FORMATDATE)] = self::$Holidays[$i][4];
            }
        }
        // 振替休日・国民の休日をセット
        self::setOtherHolidays($year);
        // 祝日一覧の配列を返す
        return self::$_Hollidays[$year];
    }

    /*
     * 祝日を計算して日付オブジェクトを返す
     *
     * @access protected
     *
     * @param String $year 年
     * @param Integer $month 月
     * @param Integer $day 日
     *
     * @return DateTime 計算した日付
     */
    protected static function getHoliday($year, $month, $day)
    {
        // その月の1日に日付をセット
        $date = new \DateTime($year . '-' . $month . '-01');
        if (is_int($day)) {
            // 日付が固定の時の処理
            $date->setDate((int)$year, (int)$month, (int)$day);
        } elseif (is_array($day)) {
            // 日付が配列の時の処理（第3月曜等の日付の取得）
            $date = self::getDayCountsInMonth($date, $day[0], $day[1]);
        } elseif (is_string($day)) {
            // 日付が文字列の時の処理（日付を取得する関数を実行）
            $date->setDate((int)$year, (int)$month, self::$day((int)$year));
        }
        // フォーマットした日付を返す
        return $date;
    }

    /**
     * 現在の月のn回目のw曜日に設定（例：第3月曜日）
     *
     * @access protected
     *
     * @param DateTime $date 取得する月の1日のDateTimeオブジェクト
     * @param Integer $count 何回目。第1回目なら1。第3回目なら3
     * @param Integer $day 0：日曜日
     *                     1：月曜日
     *                     2：火曜日
     *                     3：水曜日
     *                     4：木曜日
     *                     5：金曜日
     *                     6：土曜日
     *
     * @return DateTime 計算した日付
     */
    protected static function getDayCountsInMonth(\DateTime $date, $count, $day)
    {
        if (0 <= $day && $day <= 6) {
            // $dateは1日になっていることが前提
            // 1日の曜日と取得したい曜日から差分を取得
            $modifyDate = $day - (int)$date->format('w');
            // 日付の差分を計算する
            // 0より小さい場合は前週から始まっている
            // 0以上の場合は今週から始まっているので1を引く
            $modifyDate += $modifyDate < 0 ? $count * 7 : ($count - 1) * 7;
            // 差分を日付にセット
            $date->modify($modifyDate . ' day');
        }
        return $date;
    }

    /*
     * 春分の日の日付取得
     *
     * @access protected
     *
     * @param Integer $year 取得する年
     *
     * @return Integer 春分の日の日付
     */
    protected static function getSyunbun($year)
    {
        $surplus = $year % 4;
        if (1800 <= $year && $year <= 1827) {
            return 21;
        } elseif (1828 <= $year && $year <= 1859) {
            return $surplus < 1 ? 20 : 21;
        } elseif (1860 <= $year && $year <= 1891) {
            return $surplus < 2 ? 20 : 21;
        } elseif (1892 <= $year && $year <= 1899) {
            return $surplus < 3 ? 20 : 21;
        } elseif (1900 <= $year && $year <= 1923) {
            return $surplus < 3 ? 21 : 22;
        } elseif (1924 <= $year && $year <= 1959) {
            return 21;
        } elseif (1960 <= $year && $year <= 1991) {
            return $surplus < 1 ? 20 : 21;
        } elseif (1992 <= $year && $year <= 2023) {
            return $surplus < 2 ? 20 : 21;
        } elseif (2024 <= $year && $year <= 2055) {
            return $surplus < 3 ? 20 : 21;
        } elseif (2056 <= $year && $year <= 2091) {
            return 20;
        } elseif (2092 <= $year && $year <= 2099) {
            return $surplus < 1 ? 19 : 20;
        } elseif (2100 <= $year && $year <= 2123) {
            return $surplus < 1 ? 20 : 21;
        } elseif (2124 <= $year && $year <= 2155) {
            return $surplus < 2 ? 20 : 21;
        } elseif (2156 <= $year && $year <= 2187) {
            return $surplus < 3 ? 20 : 21;
        } elseif (2188 <= $year && $year <= 2199) {
            return 20;
        } else {
            return 20;
        }
    }

    /*
     * 秋分の日の日付取得
     *
     * @access protected
     *
     * @param Integer $year 取得する年
     *
     * @return Integer 秋分の日の日付
     */
    protected static function getSyuubun($year)
    {
        $surplus = $year % 4;
        if (1800 <= $year && $year <= 1823) {
            return $surplus < 2 ? 23 : 24;
        } elseif (1824 <= $year && $year <= 1851) {
            return $surplus < 3 ? 23 : 24;
        } elseif (1852 <= $year && $year <= 1887) {
            return 23;
        } elseif (1888 <= $year && $year <= 1899) {
            return $surplus < 1 ? 22 : 23;
        } elseif (1900 <= $year && $year <= 1919) {
            return $surplus < 1 ? 23 : 24;
        } elseif (1920 <= $year && $year <= 1947) {
            return $surplus < 2 ? 23 : 24;
        } elseif (1948 <= $year && $year <= 1979) {
            return $surplus < 3 ? 23 : 24;
        } elseif (1980 <= $year && $year <= 2011) {
            return 23;
        } elseif (2012 <= $year && $year <= 2043) {
            return $surplus < 1 ? 22 : 23;
        } elseif (2044 <= $year && $year <= 2075) {
            return $surplus < 2 ? 22 : 23;
        } elseif (2076 <= $year && $year <= 2099) {
            return $surplus < 3 ? 22 : 23;
        } elseif (2100 <= $year && $year <= 2103) {
            return $surplus < 3 ? 23 : 24;
        } elseif (2104 <= $year && $year <= 2139) {
            return 23;
        } elseif (2140 <= $year && $year <= 2167) {
            return $surplus < 1 ? 22 : 23;
        } elseif (2168 <= $year && $year <= 2199) {
            return $surplus < 2 ? 22 : 23;
        } else {
            return 23;
        }
    }

    /*
     * 振替休日、国民の休日をキャッシュにセット
     *
     * @access protected
     *
     * @param String $year 取得する年
     *
     * @return void
     */
    protected static function setOtherHolidays($year)
    {
        $date = new \DateTime();
        // キーで日付順に並べ替え
        ksort(self::$_Hollidays[$year]);
        // キーの順番に振替休日と国民の休日を確認していく
        foreach (array_keys(self::$_Hollidays[$year]) as $holiday) {
            // 日付を分割
            $parse = explode('-', $holiday);
            // 日付をセット
            $date->setDate((int)$parse[0], (int)$parse[1], (int)$parse[2]);
            // 振替休日の関数実行
            self::setFurikae($date, $year);
            // 国民の休日の関数実行
            self::setKokumin($date, $year);
        }
        // キーで日付順に並べ替え
        ksort(self::$_Hollidays[$year]);
    }

    /*
     * 振替休日をキャッシュにセット
     * 祝日が1973年4月12日以降で、日曜日に当たる場合は翌日に振替休日を設定
     *
     * @access protected
     *
     * @param DateTime $date 計算に使用する日付
     * @param String $year 取得する年
     *
     * @return void
     */
    protected static function setFurikae(\DateTime $date, $year)
    {
        // 日曜日で1973年4月12日以降
        if ($date->format('w') === '0' and $date->format(self::FORMATDATE) >= self::DATE_FURIKAE) {
            // 日曜日以外で祝日がキャッシュに存在しなくなるまで日付を進める
            while (isset(self::$_Hollidays[$year][$date->format(self::FORMATDATE)])
            or $date->format('w') === '0') {
                $date->modify('+1 day');
            }
            // キャッシュに値をセット
            self::$_Hollidays[$year][$date->format(self::FORMATDATE)] = self::FURIKAE;
        }
    }

    /*
     * 国民の休日をキャッシュにセット
     * 1985年12月27日以降で祝日と祝日に挟まれた平日の場合は
     * 挟まれた平日を国民の休日にする
     *
     * @access protected
     *
     * @param DateTime $date 計算に使用する日付
     * @param String $year 取得する年
     *
     * @return void
     */
    protected static function setKokumin(\DateTime $date, $year)
    {
        // 日付を二日前にセット（祝日と祝日に挟まれた平日なので2日前に祝日があるか確認するため）
        $date->modify('-2 day');
        // キャッシュに祝日が存在して、1985年12月27日以降
        if (isset(self::$_Hollidays[$year][$date->format(self::FORMATDATE)])
                and $date->format(self::FORMATDATE) >= self::DATE_KOKUMIN) {
            // 間の日に日付をセット
            $date->modify('+1 day');
            $day = (int)$date->format('w');
            $format = $date->format(self::FORMATDATE);
            // 挟まれた平日が休日なので該当日が火曜日以降でキャッシュに祝日が存在しない場合
            // 該当日が月曜日の場合は振替休日となっている
            if ($day > 1 && !isset(self::$_Hollidays[$year][$format])) {
                // キャッシュに値をセット
                self::$_Hollidays[$year][$format] = self::KOKUMIN;
            }
        }
    }
}
