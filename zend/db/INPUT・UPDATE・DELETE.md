# INSERT・UPDATE・DELETE

[Zend_Db_Adapter](http://framework.zend.com/manual/1.12/ja/zend.db.adapter.html#zend.db.adapter.write)

>  INSERT・UPDATE・DELETE文のクエリを実行する  
ステートメントではなく、こちらの利用を推奨

## 目次

- [INSERT](#INSERT)
- [UPDATE](#UPDATE)
- [DELETE](#DELETE)
- [WHERE句について](#WHERE句について)
- [quoteメソッド、quoteIntoメソッドについて](#quoteメソッド、quoteIntoメソッドについて)
- [INSERT・UPDATEのパラメータでクォートしたくない値](#INSERT・UPDATEのパラメータでクォートしたくない値)
- [トランザクション](#トランザクション)

## INSERT

```php
$db = Zend_Db::factory( ...options... );

// テーブル名
$table = 'bugs';

// 挿入するデータ（値は自動でクォートされる）
$params = array(
    'created_on'      => '2007-03-22',
    'bug_description' => 'Something wrong',
    'bug_status'      => 'NEW'
);

// インサートの実行
$ret = $db->insert($table, $params);

// 挿入された行数
echo $ret, PHP_EOL;

// 自動採番(Auto Increment)のID値の取得
$id = $db->lastInsertId();
echo $id, PHP_EOL;
```


## UPDATE

```php
$db = Zend_Db::factory( ...options... );

// テーブル名
$table = 'bugs';

// 更新するデータ（値は自動でクォートされる）
$params = array (
    'updated_on' => '2007-03-23',
    'bug_status' => 'FIXED'
);

// WHERE句
$where = array(
    'reported_by = ?' => 'goofy',
    'bug_status = ?'  => 'OPEN'
);

// 更新された行数
echo $ret, PHP_EOL;
```

## DELETE

```php
$db = Zend_Db::factory( ...options... );

// テーブル名
$table = 'bugs';

// WHERE句
$where = array(
    'reported_by = ?' => 'goofy',
    'bug_status = ?'  => 'OPEN'
);

// 行を削除して、削除された行数を返す
$ret = $db->delete($table, $where);

// 削除された行数
echo $ret, PHP_EOL;
```

## WHERE句について

UPDATE・DELETEのWHERE句は文字列と配列、連想配列を使用することが出来ます

```php

// WHERE句[連想配列]（プレースホルダでクォートされる）
$where = array(
    'reported_by = ?' => 'goofy',
    'bug_status = ?'  => 'OPEN'
);

// WHERE句[通常配列]（クォートは自分で行う）
$where = array(
    "reported_by = 'goofy'",
    "bug_status  = 'OPEN'"
);

// WHERE句[文字列]（クォートは自分で行う）
$where = 'bug_id = 2';

// WHERE句[文字列2]（クォートは自分で行う）
$where = $db->quoteInto('bug_id = ?' , 2);
```

## quoteメソッド、quoteIntoメソッドについて

SQL文中の値をダブルクォーテーションやシングルクォーテーションで囲む処理をクォート処理またはクォーテーション処理といいます。
quoteメソッド、quoteIntoメソッドでは文字列中にシングルクオートがあった場合には、「\」でエスケープされます。
あくまでクオート処理のため、SQLの特殊文字をエスケープするための処理ではありませんので「%」等は「%%」とはならずに「%」のままです。

```php
$name = $db->quote("O'Reilly");
echo $name;
// 'O\'Reilly'

$int = $db->quote('1234', 'INTEGER');
echo $int;
// 1234
```

```php
$sql = $db->quoteInto("SELECT * FROM bugs WHERE reported_by = ?", "O'Reilly");
echo $sql;
// SELECT * FROM bugs WHERE reported_by = 'O\'Reilly'

$sql = $db->quoteInto("SELECT * FROM bugs WHERE bug_id = ?", '1234', 'INTEGER');
echo $sql;
// SELECT * FROM bugs WHERE reported_by = 1234
```

## INSERT・UPDATEのパラメータでクォートしたくない値

MySQLの関数を利用したい場合などにはZend_Db_Exprを通さないといけません。  
Zend_Db_Exprを使用した場合はクォート処理が一切行われないので、使用の際には注意する必要があります。

```php
$params = array(
    'value' => 'あいうえお',
    'date'  => new Zend_Db_Expr('NOW()')
);
```

## トランザクション

```php
// トランザクションの開始
$db->beginTransaction();
try {
    // クエリの実行
    $db->insert(...);
    $db->update(...);
    $db->delete(...);

    // コミット
    $db->commit();
} catch (Exception $e) {
    // ロールバック
    $db->rollBack();

    echo $e->getMessage();
}
```
