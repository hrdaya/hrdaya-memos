# SELECT

[Zend_Db_Select](http://framework.zend.com/manual/1.12/ja/zend.db.select.html)

> SELECT文のクエリを作成、実行するオブジェクト  
ステートメントではなく、こちらの利用を推奨

## 目次

- [Selectオブジェクトの作成](#selectオブジェクトの作成)
- [FROM句](#from句)
- [取得するカラム](#取得するカラム)
- [JOIN句](#join句)
- [WHERE句](#where句)
- [OR WHERE句](or where句)
- [GROUP句](#group句)
- [HAVING句](#having句)
- [ORDER句](#order句)
- [LIMIT句](#limit句)
- [DISTINCT句](#distinct句)
- [FOR UPDATE句](#for update句)
- [UNION句](#union句)
- [クエリーの実行](#クエリーの実行)
- [クエリのリセット](#クエリのリセット)
- [resetで使用する定数](#resetで使用する定数)
- [作成したSQLの確認](#作成したsqlの確認)
- [クォート](#クォート)
- [プレースホルダを使用したクォート](#プレースホルダを使用したクォート)
- [テーブル名等のクォート](#テーブル名等のクォート)
- [自動クォートのキャンセル](#自動クォートのキャンセル)

## Selectオブジェクトの作成

```php
$db = Zend_Db::factory( ...options... );
$select = $db->select();
```

## FROM句

`from(テーブル名, カラム名, スキーマ名)`で指定する  
カラム名を指定しなかった場合は「\*」となる  
スキーマ名はテーブル名と一緒に指定できる

### テーブル名のみを指定（この時点ではカラムは「\*」）

```php
// テーブル名のみ指定
$select = $db->select()
             ->from('table_name');

// スキーマ名と一緒に指定
$select = $db->select()
             ->from('schema_name.table_name');

// スキーマ名と一緒に指定
$select = $db->select()
             ->from('table_name', '*', 'schema_name');
```

### テーブル名のエイリアスを指定（この時点ではカラムは「\*」）

```php
// 連想配列で指定している点に注意
$select = $db->select()
             ->from(array('p' => 'table_name'));
```

### テーブル名とカラム名を指定（文字列）[単一カラム指定]

```php
$select = $db->select()
             ->from('table_name', 'id');
```

### テーブル名とカラム名を指定（配列）[複数カラム指定]

```php
$select = $db->select()
             ->from('table_name', array('id','name'));
```

### テーブル名とカラム名を指定（配列）[複数カラム指定]（カラムにエイリアス指定）

```php
$select = $db->select()
             ->from(array('p' => table_name'), array('p.id','p.name'));
```

### FROM句を複数回指定（INNER JOINで結合される）

```php
$select->from('test1_table', 'aaa');
$select->from('test2_table', 'bbb');

// SELECT `test1_table`.`aaa`, `test2_table`.`bbb` FROM `test1_table` INNER JOIN `test2_table`
```

### その他

```php
// Build this query:
//   SELECT p.`product_id`, LOWER(product_name)
//   FROM `products` AS p
// An expression with parentheses implicitly becomes
// a Zend_Db_Expr.
$select = $db->select();
$select->from(
    array('p' => 'products'),
    array('product_id', 'LOWER(product_name)')
);

// Build this query:
//   SELECT p.`product_id`, (p.cost * 1.08) AS cost_plus_tax
//   FROM `products` AS p
$select = $db->select()
$select->from(
    array('p' => 'products'),
    array('product_id', 'cost_plus_tax' => '(p.cost * 1.08)')
);

// Build this query using Zend_Db_Expr explicitly:
//   SELECT p.`product_id`, p.cost * 1.08 AS cost_plus_tax
//   FROM `products` AS p
$select = $db->select()
$select->from(
    array('p' => 'products'),
    array('product_id', 'cost_plus_tax' => new Zend_Db_Expr('p.cost * 1.08'))
);

// Build this query,
// quoting the special column name "from" in the expression:
//   SELECT p.`from` + 10 AS origin
//   FROM `products` AS p
$select = $db->select()
$select->from(
    array('p' => 'products'),
    array('origin' => '(p.' . $db->quoteIdentifier('from') . ' + 10)')
);
```

## 取得するカラム

```php
// Build this query:
//   SELECT p.`product_id`, p.`product_name`
//   FROM `products` AS p
$select = $db->select()
             ->from(array('p' => 'products'), 'product_id')
             ->columns('product_name');

// Build the same query, specifying correlation names:
//   SELECT p.`product_id`, p.`product_name`
//   FROM `products` AS p
$select = $db->select()
             ->from(array('p' => 'products'), 'p.product_id')
             ->columns('product_name', 'p');
             // Alternatively use columns('p.product_name')
```

## JOIN句

```php
// Build this query:
//   SELECT p.`product_id`, p.`product_name`, l.*
//   FROM `products` AS p JOIN `line_items` AS l
//     ON p.product_id = l.product_id
$select = $db->select()
$select->from(
            array('p' => 'products'),
            array('product_id', 'product_name'))
       ->join(
            array('l' => 'line_items'),
            'p.product_id = l.product_id');

// Build this query:
//   SELECT p.`product_id`, p.`product_name`
//   FROM `products` AS p JOIN `line_items` AS l
//     ON p.product_id = l.product_id
$select = $db->select()
$select->from(
            array('p' => 'products'),
            array('product_id', 'product_name'))
       ->join(
            array('l' => 'line_items'),
            'p.product_id = l.product_id',
            array()); // empty list of columns
```

### JOIN句の種類

`table`テーブル名  
`condition`結合条件  
`columns`取得するカラム

| JOIN名       | メソッド                               |
|--------------|----------------------------------------|
| INNER JOIN   | join(table, condition, [columns])      |
| LEFT JOIN    | joinLeft(table, condition, [columns])  |
| RIGHT JOIN   | joinRight(table, condition, [columns]) |
| FULL JOIN    | joinFull(table, condition, [columns])  |

### USINGを使用したJOIN句の種類

`table`テーブル名  
`join`結合するカラム名  
`columns`取得するカラム

| JOIN名       | メソッド                               |
|--------------|----------------------------------------|
| INNER JOIN   | joinUsing(table, join, [columns])      |
| LEFT JOIN    | joinLeftUsing(table, join, [columns])  |
| RIGHT JOIN   | joinRightUsing(table, join, [columns]) |
| FULL JOIN    | joinFullUsing(table, join, [columns])  |

## WHERE句

```php
// Build this query:
//   SELECT product_id, product_name, price
//   FROM `products`
//   WHERE price > 100.00
$select = $db->select()
$select->from(
            'products',
            array('product_id', 'product_name', 'price'))
       ->where('price > 100.00');

// Build this query:
//   SELECT product_id, product_name, price
//   FROM `products`
//   WHERE (price > 100.00)
$minimumPrice = 100;
$select = $db->select()
$select->from(
            'products',
            array('product_id', 'product_name', 'price'))
       ->where('price > ?', $minimumPrice);

// Build this query:
//   SELECT product_id, product_name, price
//   FROM `products`
//   WHERE (product_id IN (1, 2, 3))
$productIds = array(1, 2, 3);
$select = $db->select()
$select->from(
            'products',
            array('product_id', 'product_name', 'price'))
       ->where('product_id IN (?)', $productIds);

// Build this query:
//   SELECT product_id, product_name, price
//   FROM `products`
//   WHERE (price > 100.00)
//     AND (price < 500.00)
$minimumPrice = 100;
$maximumPrice = 500;
$select = $db->select()
$select->from(
            'products',
            array('product_id', 'product_name', 'price'))
       ->where('price > ?', $minimumPrice)
       ->where('price < ?', $maximumPrice);
```

## OR WHERE句

`where()`と`orWhere()`は括弧でグループ化する機能は無いので括弧で括りたい場合はべた書きする必要あり  
べた書きする場合はクォート処理を忘れず入れること

```php
// Build this query:
//   SELECT product_id, product_name, price
//   FROM `products`
//   WHERE (price < 100.00)
//     OR (price > 500.00)
$minimumPrice = 100;
$maximumPrice = 500;
$select = $db->select()
$select->from(
            'products',
            array('product_id', 'product_name', 'price'))
       ->where('price < ?', $minimumPrice)
       ->orWhere('price > ?', $maximumPrice);

// Build this query:
//   SELECT product_id, product_name, price
//   FROM `products`
//   WHERE (price < 100.00)
//     OR (price > 500.00)
$minimumPrice = 100;
$maximumPrice = 500;
$select = $db->select()
$select->from(
            'products',
            array('product_id', 'product_name', 'price'))
       ->where('price < ?', $minimumPrice)
       ->orWhere('price > ?', $maximumPrice);

// Build this query:
//   SELECT product_id, product_name, price
//   FROM `products`
//   WHERE (price < 100.00 OR price > 500.00)
//     AND (product_name = 'Apple')
$minimumPrice = 100;
$maximumPrice = 500;
$prod = 'Apple';
$select = $db->select()
$select->from(
            'products',
            array('product_id', 'product_name', 'price'))
       ->where("price < $minimumPrice OR price > $maximumPrice")
       ->where('product_name = ?', $prod);

// Build this query:
//   SELECT *
//   FROM `table1`
//   JOIN `table2`
//   ON `table1`.column1 = `table2`.column1
//   WHERE column2 = 'foo'
$select = $db->select()
$select->from('table1')
       ->joinUsing('table2', 'column1')
       ->where('column2 = ?', 'foo');
```

## GROUP句

```php
// Build this query:
//   SELECT p.`product_id`, COUNT(*) AS line_items_per_product
//   FROM `products` AS p JOIN `line_items` AS l
//     ON p.product_id = l.product_id
//   GROUP BY p.product_id
$select = $db->select()
$select->from(
            array('p' => 'products'),
            array('product_id'))
       ->join(array('l' => 'line_items'),
            'p.product_id = l.product_id',
            array('line_items_per_product' => 'COUNT(*)'))
       ->group('p.product_id');
```

## HAVING句

```php
// Build this query:
//   SELECT p.`product_id`, COUNT(*) AS line_items_per_product
//   FROM `products` AS p JOIN `line_items` AS l
//     ON p.product_id = l.product_id
//   GROUP BY p.product_id
//   HAVING line_items_per_product > 10
$select = $db->select()
$select->from(
            array('p' => 'products'),
            array('product_id'))
       ->join(array('l' => 'line_items'),
            'p.product_id = l.product_id',
            array('line_items_per_product' => 'COUNT(*)'))
       ->group('p.product_id')
       ->having('line_items_per_product > 10');
```

## ORDER句

```php
$select = $db->select()
             ->from('table_name');
             ->order(
                'id DESC',
                'name ASC',
                'date' // ASC, DESCを省略した場合はASC
                );
```

## LIMIT句

`limit(取得する件数, オフセット(開始位置))`オフセット(開始位置)は 0 から  
`limitPage(ページ番号, 取得する件数)`ページ番号は 1 から

```php
// Build this query:
//   SELECT p.`product_id`, p.`product_name`
//   FROM `products` AS p
//   LIMIT 10, 20
// Equivalent to:
//   SELECT p.`product_id`, p.`product_name`
//   FROM `products` AS p
//   LIMIT 20 OFFSET 10
$select = $db->select()
$select->from(
            array('p' => 'products'),
            array('product_id', 'product_name'))
       ->limit(20, 10);
```

```php
// Build this query:
//   SELECT p.`product_id`, p.`product_name`
//   FROM `products` AS p
//   LIMIT 10, 20

$select = $db->select()
$select->from(
            array('p' => 'products'),
            array('product_id', 'product_name'))
       ->limitPage(2, 10);
```

## DISTINCT句

```php
// Build this query:
//   SELECT DISTINCT p."product_name"
//   FROM "products" AS p
$select = $db->select()
$select->distinct()
       ->from(array('p' => 'products'), 'product_name');
```

## FOR UPDATE句

```php
// Build this query:
//   SELECT FOR UPDATE p.*
//   FROM "products" AS p
$select = $db->select()
$select->forUpdate()
       ->from(array('p' => 'products'));
```

## UNION句

```php
$sql1 = $db->select();
$sql2 = "SELECT ...";
$select = $db->select()
    ->union(array($sql1, $sql2))
    ->order("id");
```

## クエリーの実行

```php
$select = $db->select()
             ->from('table_name');
$result = $db->fetchAll($select);
```

```php
$select = $db->select()
             ->from('products');
$stmt = $db->query($select);
$result = $stmt->fetchAll();
```

```php
$select = $db->select()
             ->from('products');
$stmt = $select->query();
$result = $stmt->fetchAll();
```

### fetchの種類

`setFetchMode()`で`Zend_Db::FETCH_ASSOC`か`Zend_Db::FETCH_OBJ`を指定して取得したデータへのアクセスの仕方を指定しておく  
デフォルトは`Zend_Db::FETCH_ASSOC`  

`$db->setFetchMode(Zend_Db::FETCH_ASSOC);`連想配列でのアクセス  
`$db->setFetchMode(Zend_Db::FETCH_OBJ);`オブジェクト（アロー演算子）でのアクセス

| fetch句      | 取得内容                                 |
|--------------|------------------------------------------|
| fetchAll()   | 取得した行を配列として取得               |
| fetchRow()   | 取得した最初の行のみ取得                 |
| fetchOne()   | 取得した最初の行の最初のカラムを取得     |
| fetchCol()   | 取得した行の最初のカラムを配列として取得 |

## クエリのリセット

reset()の引数に定数を指定するとクエリの指定した部分のみを消去します。  
引数を指定しない場合はすべての部分を消去します。

```php
// ORDER句を消去する
$select->reset(Zend_Db_Select::ORDER);

// クエリ全体を消去します
$select->reset();
```

## resetで使用する定数

| 定数                         | 文字列値    |
|------------------------------|-------------|
| Zend_Db_Select::FROM         | from        |
| Zend_Db_Select::COLUMNS      | columns     |
| Zend_Db_Select::WHERE        | where       |
| Zend_Db_Select::GROUP        | group       |
| Zend_Db_Select::HAVING       | having      |
| Zend_Db_Select::ORDER        | order       |
| Zend_Db_Select::LIMIT_COUNT  | limitcount  |
| Zend_Db_Select::LIMIT_OFFSET | limitoffset |
| Zend_Db_Select::DISTINCT     | distinct    |
| Zend_Db_Select::FOR_UPDATE   | forupdate   |

## 作成したSQLの確認

```php
$select = $db->select();

$select->from('table_name');

$sql = $select->__toString();

echo $sql;
// SELECT * FROM table_name
```

## クォート

```php
$name = $db->quote("O'Reilly");
echo $name;
// 'O\'Reilly'

$int = $db->quote('1234', 'INTEGER');
echo $int;
// 1234
```

## プレースホルダを使用したクォート

```php
$sql = $db->quoteInto("SELECT * FROM bugs WHERE reported_by = ?", "O'Reilly");
echo $sql;
// SELECT * FROM bugs WHERE reported_by = 'O\'Reilly'

$sql = $db->quoteInto("SELECT * FROM bugs WHERE bug_id = ?", '1234', 'INTEGER');
echo $sql;
// SELECT * FROM bugs WHERE reported_by = 1234
```

## テーブル名等のクォート

```php
$name = $db->quoteIdentifier('table_name');
echo $name;
// `table_name`
```

## 自動クォートのキャンセル

自動でクォートされる場所でMySQLの関数を利用したい場合などにはZend_Db_Exprを通さないといけません。  
Zend_Db_Exprを使用した場合は「quote()」「quoteInto()」を使用してもクォート処理が一切行われないので、使用の際には注意する必要があります。

```php
$select = $db->select();
$select->from('diary',
    array(
        'date_month' => new Zend_Db_Expr("DATE_FORMAT(open_date, '%Y-%m-01 00:00:00')"),
        'cnt' => "COUNT(*)"
    )
);
```

```php
// 意図せずクォートが取り消される例

$str = "SYSDATE";
echo $db->quote(new Zend_Db_Expr($str));
// SYSDATE

$into = "mdate = ?";
echo $db->quoteInto($into, new Zend_Db_Expr($str));
// mdate = SYSDATE
```
