<h1>Kusto Query Language: Beginning Operators</h1>

# Searching for Data
## Search

`search` keyword is to search in blur mode, it is case insensitive by default.

And by default KQL is case Insensitive.


```sql
Perf
| search "Memory"
-- will search for memory and Memory, across columns

Perf
| serach kind=case_sensitive "memory"
-- will blur search case sensitively

search "Memory"
-- will blur search in the whole cluster, DO NOT DO THIS

search in (Perf, Event, Alert) "Memory"
-- will blur search in Perf Event and Alert tables

Perf
| search CounterName == "Available MBytes"
-- Acurate search on Column CounterName equals "Available MBytes"

Perf
| search CounterName:"MBytes"
-- Blur search on Column CounterName for something like "MBytes"

Perf
| search "*Bytes*"
-- Blur search across column for something like Bytes

Perf
| search * startswith "Bytes"

Perf
| search * endswith "Bytes"
-- Search across column for start and end with

Perf
| search CounterName startswith "Bytes"
-- search column countername that startswith "Bytes"

Perf
| search "Free*Bytes" and ("C:" or "D:")

Perf
| search InstanceName matches regex "[A-Z]:"
-- search column InstanceName by Regular Expression
```

## Where

It's similar to keyword search, search always followed by text. `where` keyword is looking for conditions.

```sql
Perf
| where TimeGenerated >= ago(1h)

Perf
| where TimeGenerated >= ago(1h)
    and (CounterName == "Bytes Received/sec"
        or CounterName == "% Processor Time")

Perf
| where TimeGenerated >= ago(1h)
| where TimeGenerated >= ago(1h)
    and (CounterName == "Bytes Received/sec"
        or CounterName == "% Processor Time")
-- here, the first where, will generate another smaller dataset than the whole Perf table, so that can run faster

Perf
| where * has "Bytes"
-- Search across columns where bytes is contained.

Perf
| where * startswith "Bytes"

Perf
| where * endswith "Bytes"

Perf
| where InstanceNamematches regex "[A-Z]:"
```

# Summarizing Data
## Take, Limit

Randomly retrieve specified number of rows from dataset
```sql
Perf
| take 10
-- randomly retrieve 10 rows from table Perf
```

## Count

```sql
Perf
| CounterName = "Bytes Received/sec"
| count
-- output is single cell with the count matchup with the condition
```

## Summarize
Group summarize data using `by` keyword to specify which column should be grouped.

```sql
Perf
| summarize count() by ObjectName, CounterName
-- output is ObjectName CounterName and count_ columns, where data is grouped by ObjectName and CounterName and calculated the total row count


Perf
| summarize PerfCount=count()
    by ObjectName,
    CounterName
-- rename the count_ column to PerfCount, so the output would be ObjectName, CounterName, and PerfCount.

Perf
| where CounterName=="% Free Space"
| summarize NumberOfEntries=count(),
            AverageFreeSpace=avg(CounterValue),
            MinFreeSpace=min(CounterValue),
            MaxFreeSpace=max(CounterValue),
            SumFreeSpace=sum(CounterValue)
            by CounterName
-- more operators that could be used with summarize

Perf
| where TimeGenerated>=ago(7d)
| summarize NumberOfEntries=count()
        by bin(TimeGenerated, 1d)
-- bin is used to break into bucket, here we break TimeGenerated into 1 day of period

Perf
| where TimeGenerated>=ago(7d)
| summarize NumberOfEntries=count()
        by bin(TimeGenerated, 1d)
| sort by TimeGenerated
-- sort by is for ordering descending
-- asc keyword for ordering ascending

Perf
| where CounterName=="% Free Space"
| summarize Number_Of_Rows_At_This_Percent_Level = count()
        by bin(CounterValue, 10)
| sort by CounterValue
-- bin to seperate countervalue for each 10 values
```

This is an good example of aggregation function:
```sql
StormEvents
| summarize 
        TotalStormsInState = count(),
        StormsWithCropDamage = countif(DamageCrops > 0)
        by State
| extend PercentWithCropDamage = 
        round((todouble(StormsWithCropDamage) / TotalStromsInState * 100), 2)
| sort by StormsWithCropDamage
-- after summarize, there should be 3 columns TotalStormsInState, StromsWithCropDamage, State
-- 1. where TotalStromsInState is the count of total rows which grouped by state, 
-- 2. StormsWithCropDamage is count of DamageCrops column when DamageCrops is greater of 0
-- after extend, there is additional column, PercentWithCropDamage, which is a percentage number.
-- then the rows are ordered by StormsWithCropDamage, by default is desending
```

