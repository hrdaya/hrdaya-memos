# datepicker用覚書

## リンク



## css

```css
.datepicker table tr td.old,
.datepicker table tr td.new {
    color: #999;
    background-color: #f5f5f5;
}
.datepicker table tr td.day:hover,
.datepicker table tr td.day.focused {
    background-color: #c0c0c0;
}
.datepicker table tr td.sunday,
.datepicker table tr td.holiday {
    color: #ff0000;
}
.datepicker table tr td.saturday {
    color: #0000ff;
}
.datepicker table tr td.old.sunday,
.datepicker table tr td.new.sunday,
.datepicker table tr td.disabled.sunday,
.datepicker table tr td.old.holiday,
.datepicker table tr td.new.holiday,
.datepicker table tr td.disabled.holiday
{
    color: pink;
}
.datepicker table tr td.old.saturday,
.datepicker table tr td.new.saturday,
.datepicker table tr td.disabled.saturday
{
    color: skyblue;
}
.datepicker table tr td.saturday.active,
.datepicker table tr td.sunday.active,
.datepicker table tr td.holiday.active {
    color: #fff;
}
```

## scss

```scss
.datepicker table tr td {
    &.old,
    &.new {
        color: #999;
        background-color: #f5f5f5;
    }
    &.sunday,
    &.holiday {
        color: red;
    }
    &.saturday {
        color: blue;
    }
    &.day:hover,
    &.day.focused {
        background-color: #c0c0c0;
    }

    &.old,
    &.new,
    &.disabled {
        &.sunday,
        &.holiday {
            color: pink;
        }
        &.saturday {
            color: skyblue;
        }
    }
    &.saturday,
    &.sunday,
    &.holiday {
        &.active {
            color: #fff;
        }
    }
}
```
