# Azure Data Explorer
## Query Language
### Syntax conventions

|Convention|Description|Notes|
|-|-|-|
|**Block**|String literal to be entered exactly as shown|When you see **bold syntax**, the content is required and immutable|
|*Italic*|Parameters to be provided a value upon use of the funciton or command|The content is a parameter|
|[]|Denotes that the enclosed item is optional||
|()|Denotes that at least one of the enclosed items is required||
|\||Used within square or round brackets to denote that you may specify one of the items separated by the pipe character. In this form, the pipe is equivalent to the logical OR operator. When in a block (\|), the pipe is part of the KQL query syntax.|When used within [] it's an OR operator, if it's within (), it means required pipe \||
|[, ...]|Indicates that the preceding ***parameter*** can be repeated multiple times, separated by commas.||
|;|Query statement terminator.||

Example 1:

T | sort by *column* [asc | desc][nulls first | nulls last][, ...]

StormEvents | sort by State asc, StartTime desc

Example 2:

evaluate http_request (*Uri*[, *RequestHeaders*[, *Options*]])

- here, you need to provide options as parameter only if you provide requestheaders.

### Entities
#### Entity types
|Entity type|Notes|
|-|-|
|Clusters||
|Databases||
|Tables||
|Columns||
|Stored functions||
|Views||
|External tables||

#### Fact tables vs. Dimension tables

Fact tables store business facts and data is immutable, we use cursor to ensure only export new data from last ingestion time.

Dimension tables store information that is referenced by fact tables, most of time should be "looked up" when querying fact table.

### Data types

#### Datatime

By default all datetime function using UTC time.

timespan value table based on `2023-06-19T08:22:54.6623324Z`
|name|timespanValue|time snapshot|
|-|-|-|
|year|365.00:00:00|2022-06-19T08:22:54.6623324Z|
|day|1.00:00:00|2023-06-18T08:22:54.6623324Z|
|hour|01:00:00|2032-06-19T07:22:54.6623324Z|
|minut|00:01:00|2022-06-19T08:21:54.6623324Z|

ISO 8601 format for datetime

|Format	|Example|
|-|-|
|%Y-%m-%dT%H:%M:%s%z	|2014-05-25T08:20:03.123456Z|
|%Y-%m-%dT%H:%M:%s	|2014-05-25T08:20:03.123456|
|%Y-%m-%dT%H:%M	|2014-05-25T08:20|
|%Y-%m-%d %H:%M:%s%z	|2014-11-08 15:55:55.123456Z|
|%Y-%m-%d %H:%M:%s	|2014-11-08 15:55:55|
|%Y-%m-%d %H:%M	|2014-11-08 15:55|
|%Y-%m-%d	|2014-11-08|

#### Dynamic

##### Literals

|Syntax|Description|Example|
|-|-|-|
|dynamic([value[, ...]])|Array|dynamic([1, 2, "hello"])|
|dynamic({key=value[, ...]})|Property bag or nested property bag|dynamic({"a": 1, "b":{"a": 1}})|
|dynamic(null)|null value||

##### Accessors
|Expression	|Accessor expression type	|Meaning	|Comments|
|-|-|-|-|
|dict[col]	|Entity name (column)	|Subscripts a dictionary using the values of the column col as the key	|Column must be of type string|
|arr[index]	|Entity index (column)	|Subscripts an array using the values of the column index as the index	|Column must be of type integer or boolean|
|arr[-index]	|Entity index (column)	|Retrieves the 'index'-th value from the end of the array	|Column must be of type integer or boolean|
|arr[(-1)]	|Entity index	|Retrieves the last value in the array|	
|arr[toint(indexAsString)]	|Function call	|Casts the values of column indexAsString to int and use them to subscript an array|	
|dict[['where']]	|Keyword used as entity name (column)	|Subscripts a dictionary using the values of column where as the key	|Entity names that are identical to some query language keywords must be quoted|
|dict.['where'] or dict['where']	|Constant	|Subscripts a dictionary using where string as the key|

##### Building dynamic objects
```sql
-- Creating dynamic objects
    bag_pack("Level", "Information", "ProcessID", 1234, "Data", back_pack("url", "www.bing.com"))
    -- {"Level": "Information", "ProcessID": 1234, "Data":{"url": "www.bing.com"}}

    range x from 1 to 3 step 1
    | extend y = x*2
    | extend z = y*2
    | project pack_array(x, y, z)
    -- [1, 2, 4]
    -- [2, 4, 8]
    -- [3, 6, 12]

    datatable(a:int, b:string) [1, "One", 2, "Two", 3, "Three"]
    | summarize a = make_list(a), b = make_list(b)
    | project zip(a, b)
    --[[1, "One"], [2, "Two"], [3, "Three"]]

-- Aggregate functions
    datatable(value: dynamic) [
        dynamic({"x":1, "y":3.5}),
        dynamic({"x":"somevalue", "z":[1, 2, 3]}),
        dynamic({"y":{"w":"zzz"}, "t":["aa", "bb"], "z":["foo"]})
    ]
    | summarize buildschema(value)
    -- {"x":["long","string"],"y":["double",{"w":"string"}],"z":{"indexer":["long","string"]},"t":{"indexer":"string"}}

    let T = datatable(prop:string, value:string)
    [
        "prop01", "val_a",
        "prop02", "val_b",
        "prop03", "val_c",
    ];
    T
    | extend p = bag_pack(prop, value)
    | summarize dict=make_bag(p)
    -- { "prop01": "val_a", "prop02": "val_b", "prop03": "val_c" }
    
    let shapes = datatable (name: string, sideCount: int)
    [
        "triangle", 3,
        "square", 4,
        "rectangle", 4,
        "pentagon", 5,
        "hexagon", 6,
        "heptagon", 7,
        "octagon", 8,
        "nonagon", 9,
        "decagon", 10
    ];
    shapes
    | summarize mylist = make_list(name)
    -- ["triangle","square","rectangle","pentagon","hexagon","heptagon","octagon","nonagon","decagon"]

    StormEvents 
    | summarize states=make_set(State) by DamageCrops
    -- DamageCrops states
    -- 0            ["North Carolina", "Wisconsin", ...]
    -- 30000        ["Texas", "Nebraska", ...]
    -- 4000000      ["California", "Kentucky", ....]
```
#### Null Value
1. print bool(null), datetime(null), dynamic(null), guid(null), int(null), long(null), real(null), double(null), timespan(null) gives you ` ` in every cell
2. string datatype does not supports null value, so use isempty() function instead
3. use isnull() and isnotnull() for null value identification
4. `==` applying on null value and non-null value return false, applying on null values on both sides return bool(null)
5. `!=` applying on null value and non-null value return true, applying on null values on both sides return bool(null)

### Functions
#### User-defined functions

- Arguments

|Syntax	Input |arguments list description|
|-|-|
|()	|No arguments|
|(s:string)	|Single scalar argument called s taking a value of type string|
|(a:long, b:bool=true)	|Two scalar arguments, the second of which has a default value|
|(T1:(*), T2:(r:real), b:bool)	|Three arguments (two tabular arguments and one scalar argument)|

Example:
```sql
let MyFilter = (T:(x:long), v:long) {
  T | where x >= v
};
MyFilter((range x from 1 to 10 step 1), 9)
```

### Query statements

#### Alias Statement
```sql
alias database samplesAlias = cluster("https://help.kusto.windows.net").database("Samples");
database("sampleAlias").StormEvents | count
```

