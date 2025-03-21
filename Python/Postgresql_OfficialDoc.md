About Schema

it's a logical group of objects in database. So, within same schema same object type cannot share a same name. But same name can exist in different schema.

The full name of a table is
```sql
database.schemaname.tablename
```

If you don't specify the schema name, the object will fall in `public` schema.

To create schema
```sql
CREATE SCHEMA schema_name AUTHORIZATION user_name

-- usually schema_name can be omitted

CREATE SCHEMA AUTHORIZATION user_name
```

# FILTER usage

|depname|empno|salary|
|-|-|-|
|sales|1|5000|
|personnel|2|3900|
|sales|3|4800|
|personnel|4|4800|
|develop|5|3500|
|develop|7|4200|
|develop|8|6000|
|develop|9|4500|
|develop|10|5200|

```sql
SELECT depname, empno, s_s FROM 
(SELECT depname, empno, SUM(salary) FILTER(WHERE salary > 4000) AS s_s FROM documentation_test_salary
GROUP BY depname, empno)
WHERE s_s IS NOT NULL
```

# WINDOW usage

```sql
SELECT depname, empno, pos FROM
(SELECT depname, empno, (rank() OVER w) AS pos FROM documentation_test_salary
WINDOW w AS (PARTITION BY depname ORDER BY salary DESC, empno))
WHERE pos < 3
```

