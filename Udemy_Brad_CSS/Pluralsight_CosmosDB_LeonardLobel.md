# 7: Querying with SQL
## Use Notebook
### select * from c
Results will be shaped into tables instead of json format.
Will retrieve documents with all different schemas, which will include all top level properties as columns in the table.
If some documents does not have that top level property, will show NaN value for that column. 
Complex object value for top level property will show as json format.

*If you want to show all documents in json format instead of tables. You need to use python in notebook.*

### Use python in notebook
```python
import json

database = cosmos_client.get_database_client('Families')
container = database.get_container_client('Families')
items = container.query_items(query = 'SELECT * FROM c', enable_cross_partition_query = True)
result = list(items)

print (json.dumps(result, indent = 4))
```

## Scalar Expression
```sql
SELECT "Hello"
```
```json
[
    {
        "$1":"Hello" 
    }
]
```
<hr/>

```sql
SELECT "Hello" AS word
```
```json
[
    {
        "word": "Hello"
    }
]
```
<hr/>

```sql
SELECT VALUE "Hello"
```
```json
[
    "Hello"
]
```
<hr/>

```sql
SELECT ["Hello", "World"] AS words
```
```json
[
    {
        "words":[
            "Hello",
            "World"
        ]
    }
]
```
<hr/>

```sql
SELECT {"word1": "Hello", "word2": "World"} AS words
```
```json
[
    {
        "words":{
            "word1":"Hello",
            "word2":"World"
        }
    }
]
```
## Query Operators and Build-in Functions
```sql
SELECT
    8  * ((2 + 16) - 2) / 2 AS math1,
    8  * ((2 + 16) - 2) / 2.1 AS math2,
```
```json
[
    {
        "math1": 64,
        "math2": 60.95238095238095
    }
]
```
<hr/>

```sql
SELECT
    ROUND(3.4) AS round3_4, ROUND(3.5) AS round3_5,
    CEILING(3.4) AS ceiling3_4, CEILING(3.5) AS ceiling3_5,
    FLOOR(3.4) AS floor3_4, FLOOR(3.5) AS floor3_5,
    ABS(-5) AS absMinus5, ABS(5) AS abs5,
    SIN(28) AS sin28,
    COS(28) AS cos28,
    TAN(28) AS tan28,
    LOG(16) AS log16,
    PI() AS pi
```
```json
[
    {
        "round3_4": 3,
        "round3_5": 4,
        "ceiling3_4": 4,
        "ceiling3_5": 4,
        "floor3_4": 3,
        "floor3_5": 3,
        "absMiinus5": 5,
        "abs5": 5,
        "sin28": 0.27,
        "cos28": -0.96,
        "tan28": -0.28,
        "log16": 2.77,
        "pi": 3.14
    }
]
```
<hr/>

```sql
SELECT
    ("hot" = "cold" AND "up" = "down" OR 1 = 1) AS logical1,
    ("hot" = "cold" AND ("up" = "down" OR 1 = 1)) AS logical2
```
```json
[
    {
        "logical1": true,
        "logical2": false
    }
]
```
<hr/>

```sql
SELECT
    (2 > 3 ? "higher" : "lower or equal") AS ternary
```
```json
[
    {
        "ternary": "lower or equal"
    }
]
```
<hr/>

```sql
SELECT
    (undefined ?? undefined ?? "third") AS coalesce1,
    (undefined ?? "second" ?? "third") AS coalesce2,
    ("first" ?? undefined ?? "third") AS coalesce3
```
```json
[
    {
        "coalesce1": "third",
        "coalesce2": "second",
        "coalesce3": "first"
    }
]
```
<hr/>

```sql
SELECT
    IS_ARRAY(6) AS isArray1, IS_ARRAY([6]) AS isArray2,
    IS_BOOL(6) AS isBool1, IS_BOOL(false) AS isBool2,
    IS_NULL(6) AS isNull1, IS_NULL(null) AS isNull2,
    IS_OBJECT("hello") AS isObj1, IS_OBJECT({"word": "hello"}) AS isObj2
```
```json
[
    {
        "isArray1": false,
        "isArray2": true,
        "isBool1": false,
        "isBool2": true,
        "isNull1": false,
        "isNull2": true,
        "isObj1": false,
        "isObj2": true
    }
]
```
<hr/>

```sql
SELECT
    "Hello" || " " || "World" AS stringConcat
```
```json
[
    {
        "stringConcat": "Hello World"
    }
]
```
<hr/>

```sql
SELECT
    CONCAT("A", "b", "c", "d") AS strConcat,
    CONTAINS("Abcdef", "cde") AS strContains,
    STARTSWITH("Abcdef", "Ab") AS strStartsWith,
    ENDSWITH("Abcdef", "cdef") AS strEndsWith,
    INDEX_OF("Abcdef", "de") AS strIndexOf1,
    INDEX_OF("Abcdef", "df") AS strIndexOf2,
    LEFT("Abcdef", 3) AS strLeft,
    RIGHT("Abcdef", 3) AS strRight,
    SUBSTRING("Abcdef", 2, 3) AS strSubstring,
    LENGTH("Abcdef") AS strLength,
    LOWER("Abcdef") AS strLower,
    UPPER("Abcdef") AS strUpper
```
```json
[
    {
        "strConcat": "Abcd",
        "strContains": true,
        "strStartsWith": true,
        "strEndsWith": true,
        "strIndexOf1": 3,
        "strIndexOf2": -1,
        "strLeft": "Abc",
        "strRight": "def",
        "strSubstring": "cde",
        "strLength": 6,
        "strLower": "abcdef",
        "strUpper": "ABCDEF"
    }
]
```
<hr/>

```sql
SELECT
    StringToArray('[]') AS a1,
    StringToArray("[1,2,3]") AS a2,
    StringToArray('["str", 2, 3]') AS a3,
    StringToArray('[["5", "6", "7"], ["8"], ["9"]]') AS a4
    StringToArray('[1,2,3,[4,5,6],[7,8]]') AS a5
```
```json
[
    {
        "a1": [],
        "a2": [1, 2, 3],
        "a3": ["str", 2, 3],
        "a4": [["5", "6", "7"], ["8"], ["9"]],
        "a5": [1,2,3,[4,5,6],[7,8]]
    }
]
```
<hr/>

```sql
SELECT
    StringToBoolean("true") AS b1,
    StringToBoolean("     false") AS b2,
    StringToBoolean("false    ") AS b3,
    StringToBoolean("False    ") AS b4
```
```json
[
    {
        "b1": true,
        "b2": false,
        "b3": false
    }
]
```
StringToBoolean must be all lower case letters, or cosmosdb won't recognize it.
<hr/>

```sql
SELECT
    StringToNull("null") AS n1,
    StringToNull("    null ") AS n2,
    IS_NULL(StringToNull("null    ")) as n3
```
```json
[
    {
        "n1": null,
        "n2": null,
        "n3": true
    }
]
```
<hr/>

```sql
SELECT
    StringToNumber("1.0000") AS num1,
    StringToNumber("3.14") AS num2,
    StringToNumber("    60     ") AS num3,
    StringToNumber("-1.79") AS num4
```
```json
[
    {
        "num1": 1,
        "num2": 3.14,
        "num3": 60,
        "num4": -1.79
    }
]
```
<hr/>

```sql
SELECT
    ToString(1.0000) AS str1,
    ToString("Hello World") AS str2,
    ToString(NaN) AS str3,
    ToString(Infinity) AS str4,
    ToString(IS_STRING(ToString(undefined))) AS str5,
    ToString(0.1234) AS str6,
    ToString(false) AS str7,
    ToString(undefined) AS str8
```
```json
[
    {
        "str1": "1",
        "str2": "Hello World",
        "str3": "NaN",
        "str4": "Infinity",
        "str5": "false",
        "str6": "0.1234",
        "str7": "false"
    }
]
```
<hr/>

```sql
SELECT
    GETCURRENTDATETIME() AS currentDateTime,
    GETCURRENTTIMESTAMP() AS currentUtcTimestamp
```
```json
[
    {
        "currentDateTime": "2022-06-09T01:49:32.7758736Z",
        "currentUtcTimestamp": 1654739372776
    }
]
```
<hr/>

```sql
SELECT
    ARRAY_CONCAT(["a", "b"], ["1","2"], ["#"]) AS arrConcat,
    ARRAY_CONTAINS(["1A", "1B", "1C"], "1B") AS arrContains,
    ARRAY_LENGTH(["1", "2", "3"]) AS arrLength,
    ARRAY_SLICE(["1","2","3","4"], 1, 2) AS arrSlice
```
```json
[
    {
        "arrConcat":["a",
            "b",
            "1",
            "2",
            "#"],
        "arrContains": true,
        "arrLength": 3,
        "arrSlice":[
            "2",
            "3"
        ]
    }
]
```

## Query a Container
To Set query for a default database
```sql
%%database Families
```
To Set query to a default contanier
```sql
%%container Families
```
```sql
SELECT c.address.state, c.address.city FROM c
```
<hr/>

```sql
SELECT c.address FROM c
```
```json
[
    {
        "address":{
            "addressLine": "123 Main Street",
            "city": "Chicago",
            "state": "IL",
            "zipCode": "60601"
        },
        "address":{
            "addressLine": "456 Harbor Boulevard",
            "city": "Chicago",
            "state": "IL",
            "zipCode": "60603"
        }
    }
]
```
```sql
SELECT * FROM c.address
```
```json
[
    {
        "addressLine": "123 Main Street",
            "city": "Chicago",
            "state": "IL",
            "zipCode": "60601"
    },
    {
         "addressLine": "456 Harbor Boulevard",
            "city": "Chicago",
            "state": "IL",
            "zipCode": "60603"
    }
]
```
<hr/>

Use In to break array into documents
```sql
SELECT * FROM c.kids
```
```json
[
    [
        "Adam",
        "Jacqueline",
        "Joshua"
    ],
    [
        "Quinn"
    ]
]
```
```sql
SELECT c.kids FROM c
```
```json
[
    {
        "kids": [
            "Adam",
            "Jacqueline",
            "Joshua"
        ]
    },
    {
        "kids": [
            "Quinn"
        ]
    }
]
```
```sql
SELECT * FROM ch IN c.kids
```
```json
[
    "Adam",
    "Jacqueline",
    "Joshua",
    "Quinn"
]
```
<hr/>

Use tenary to refine results
```sql
SELECT
    ch.givenName ?? ch.firstName AS childName,
    ch.grade,
    ARRAY_LENGTH(ch.pets) ?? 0 as numberOfPets,
    ch.pets ?? [] AS pets
FROM
    ch IN c.children
```
## Intra-document Joins
Join do not perform join with different docuemnts. But it performs intra-document join where aparent object and child array are joined. That makes parent properties in scope when flatten the child arrays.

To Calculate Flattened children
```sql
SELECT VALUE COUNT(1) FROM c IN c.children
```

To Join
```sql
SELECT
    f.id,
    f.location.city,
    f.location.state,
    ch.givenName ?? ch.firstName AS childName,
    ARRAY_LENGTH(ch.pets) ?? 0 AS numberOfPets,
    ch.pets ?? [] AS pets
FROM
    c AS f
    JOIN ch IN f.children
```
domain is whole container and will do inner join of each document with each child in children.

How to query nested array? (arrays in an array which is a property of a document)
```sql
SELECT
    VALUE p
FROM c
JOIN ch IN c.children
JOIN p IN ch.pets
```
## Projections
```sql
SELECT c.id AS name, {
    "location": c.location.city || " - " || c.location.state
} AS generalInfo
FROM c
```

## Range Queries
```sql
SELECT * FROM c.address.location
WHERE c.address.location.stateProvinceName IN ("Florida", "Illinois")
```
The above statement will cause error, it should be changed to:
```sql
SELECT * FROM c.address.location AS l
WHERE l.stateProvinceName IN ("Florida", "Illinois")
```