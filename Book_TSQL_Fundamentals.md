# Chapter 1 Background to T-SQL querying and programming

## SQL Server architecture

### The ABCs of Microsoft RDBMS flavors

* Box
    * It is a SQL Server instance
    * Customer is in charge of getting the hardware, installing the software, patching, high availability and disaster recovery, security, and everything else.
* Appliance
    * Preconfigured hardware and software
* Cloud
    * Private Cloud - cloud infrastructure in customer site.
    * Public Cloud
        * IaaS - VM resides in Microsoft's infrastructure with SQL Server(box engine) installed on them. Hardware is maintained by Microsoft, customer is responsible for maintaining and patching the software
        * PaaS - Hardware and software are maintained by Microsoft, NO NEED to worry about high availability, disaster recovery and patching. Customer is responsible for index and querying.

### SQL Server instances

* Box product = instance of SQL Server = SQL Server database engine or service
* Each instance is independent of security and data.
* If you decide to install multiple instances on the same computer. One must be the ***default instance***, the other is ***named instance***
* To connect
    * default instance: client needs to provide computer's name or IP address
    * named instance: client needs to provide computer's name or IP address, followed by a backslash(\\), followed by the instance name
### Databases

* each instance has 2 type of databases:
    * System Databases
    * User Databasese

Table of System Databases
|Database name| Description|
|--|--|
|***master***|metadata information of instance|
|***Resource***|definitions of all system objects, eg. objects under *sys schema*|
|***model***|template for newly created databases|
|***tempdb***|where to store temporary data such as work tables, sort, and hash table dta, row versioning info. NOTE: this database is destroyed and re-created as a copy of the *model* every time you restart the instance|
|***msdb***|where SQL Server Agent stores its data, SQL Server Agent is in charge of automation, which includes entities such as jobs, schedules and alerts. *msdb* also holds information related to Database Mail, Service Broker, backups, and more|

* You can define a property called *collation* at the database level that determine default language support, case sensitivity, and sor order for character data.

> *Collation* is related to localization, it will affect sort result and other critical features. See official doc for more info.
> ```sql
> --To query server collation info:
 >   SELECT CONVERT(nvarchar(128), SERVERPROPERTY('collation'));
 > --TO query all available collations of server
>    SELECT * FROM sys.fn_helpcollations();
>```

* Login
    * *Windows authenticated login* : no username and password required
    * *SQL Server authenticated login*: username and password required
* physical database layout
    * When you create a database, you need to provide properties for data and log files, including
        * file name
        * location
        * initial size
        * maximum size
        * autogrowth increment
    * Each database at lease has one data file and one log file


### Schemas and objects

* schema can be seen as container of objects, such as tables views, stored procedures, and others.
* you can control permissions at the schema level.
* schema is also a namespace, 
    * three-part object name: database name + schemas name + object name
    * four-part object name: instance name + three-part object name

## Creating tables and defining data integrity

### Creating tables
```sql
USE TSQLV4;

DROP TABLE IF EXISTS dbo.Employees;

-- SQL Server previous than SQL Server 2016 
-- IF OBJECT_ID(N'dbo.Employees', N'U') IS NOT NULL DROP TABLE dbo.Employees;

CREATE TABLE dbo.Employees(
    empid       INT         NOT NULL,
    firstname   VARCHAR(30) NOT NULL,
    lastname    VARCHAR(30) NOT NULL,
    hiredate    DATE        NOT NULL,
    mgrid       INT         NULL,
    ssn         VARCHAR(20) NOT NULL,
    salary      MONEY       NOT NULL
);
```

### Defining data integrety
#### **Primary-key constraints**
```sql
ALTER TABLE dbo.Employees
    ADD CONSTRAINT PK_Employees
    PRIMARY KEY(empid);
```
* primary-key constraint enforces the uniqueness of rows and also disallows NULLs in the constraint attirbutes.
* If empid allows NULL, will be rejected
* To inforce the uniqueness of the logical primary-key constraint, SQL Server will create a unique index behind the scenes.

#### **Unique constraints**
```sql
ALTER TABLE dbo.Employees
    ADD CONSTRAINT UNQ_Employee_ssn
    UNIQUE(ssn);
```
* A unique constraint enforces the uniqueness of rows
* Unlike primary keys, you can define multiple unique constraints in the same table
* Unique constraints DOES NOT require column to be NOT NULL
* Behind the scene, will create unique index
* SQL Server DOES NOT allow duplicate NULLS


You can create unique index instead of unique constraint and add filter on it.
```sql
CREATE UNIQUE INDEX idx_ssn_notnull ON dbo.Employees(ssn) WHERE ssn IS NOT NULL;
```

#### **Foreign-key constraints**
* Enforces referential integrity
* Referencing Table: where you create foreign key constraint and it uses other table's unique value(pk or unique constraint) as own column value
```sql
CREATE TABLE dbo.Orders(
    orderid INT         NOT NULL,
    empid   INT         NOT NULL,
    custid  VARCHAR(10) NOT NULL,
    orderts DATETIME2   NOT NULL,
    qty     INT         NOT NULL,
    CONSTRAINT PK_Orders
        PRIMARY KEY(orderid)
);

ALTER TABLE dbo.Orders
    ADD CONSTRAINT FK_Orders_Employees
    FOREIGN KEY(empid)
    REFERENCES dbo.Employees(empid);

ALTER TABLE dbo.Employees
    ADD CONSTRAINT FK_Employees_Employees
    FOREIGN KEY(mgrid)
    REFERENCES dbo.Employees(empid);
```

#### **Check constraints**
```sql
ALTER TABLE dbo.Employees
    ADD CONSTRAINT CHK_Employees_salary
    CHECK(salary > 0.00);
```
NOTE: SQL Server will result this predicate as three values: TRUE, FALSE, UNKNOWN, and will pass on TRUE and UNKNOWN.

For Example: Salary = -1000.00 will be rejected and salary = 5000 or salary = NULL will be accepted.

#### **Default constraints**
```sql
ALTER TABLE dbo.Orders
    ADD CONSTRAINT DFT_Orders_orderts
    DEFAULT(SYSDATETMIE()) FOR orderts;
```

# Chapter 2 Single-table queries

## Elements of the SELECT statement
The Logic Order of query processing is the order by which standard SQL defines how a query should be processed and the final result achieved. Database engine can process query differently by rearranging processing phases.

1. FROM
2. WHERE
3. GROUP BY
4. HAVING
5. SELECT
    1. Expressions
    2. DISTINCT
6. ORDER BY
    1. TOP/OFFSET-FETCH

### The *FROM* clause
#### **Delimiting identifier names**
You need to delimit identifier when an identifier is irregular, which means it
* is embedded spaces
* is embedded special characters
* starts with a digit
* is a reserved keyword

You can delimit by double quotes or square brackets(in T-SQL)
```sql
SELECT * FROM "Order Details"
SELECT * FROM [Order Details]
```
### The *WHERE* clause
T-SQL uses tree-valued predicate logic where logic expressions can evaluate to *TRUE*, *FALSE*, or *UNKNOWN*

### The *GROUP BY* clause
Elements that do not participate in the *GROUP BY* clause are allowed only as inputs to an aggregate funciton such as *COUNT*, *SUM*, *AVG*, *MIN*, or *MAX*.
for example:
```sql
-- freight is not in GROUP BY, so it can only be included in SUM()
SELECT empid, YEAR(orderdate) AS orderyear, SUM(freight) as totalfreight, COUNT(*) AS numorders 
FROM Sales.Orders
WHERE custid = 71
GROUP BY empid, YEAR(orderdate);
```
NOTE: All aggregate funcitons ignores *NULL*, with one exception - *COUNT(\*)*. *DISTINCT* can be used in other funciton as well.

for example
```sql
SELECT qty FROM [NUM]
--returns 30, 10, NULL, 10, 10
SELECT COUNT(*) from [NUM]
--returns 5
SELECT COUNT(qty) from [NUM]
--returns 4
SELECT SUM(qty) FROM [NUM]
--returns 60
SELECT SUM(DISTINCT qty) FROM [NUM]
--returns 40
```

### The *HAVING* clause

*HAVING* clause can filter the single value result of *GROUP BY*, also, it can aggregate the group.
```sql
SELECT empid, YEAR(orderdate) AS orderyear
FROM Sales.Orders
WHERE custid = 71
GROUP BY empid, YEAR(orderdate)
HAVING COUNT(*) > 1;
```
### The *SELECT* clause
#### **Asign alias**
T-SQL supports 3 ways of assigning alias
```sql
SELECT orderyear1 = YEAR(orderdate), YEAR(orderdate) AS orderyear2, YEAR(orderdate) orderyear3 FROM Sales.Orders
```
#### **Using alias**
You cannot use alias in the clause process before *SELECT* clause. You cannot use alias in *SELECT* clause either.
```sql
--following statements will fail
SELECT empid, YEAR(orderdate) AS orderyear, COUNT(*) AS numorders
FROM Sales.Orders
WHERE custid = 71
GROUP BY empid, YEAR(orderdate)
HAVING numorders > 1

SELECT orderid, YEAR(orderdate) AS orderyear, orderyear + 1 AS nextyear
FROM Sales.Orders
```
### The *ORDER BY* clause
After *ORDER BY*, the result is turned into a ***cursor*** rather than a table. Some operation only works on ***cursor***.

*ORDER BY* only works with attibutes specified in *DISTINCT*, so following statement is failed
```sql
SELECT DISTINCT country
FROM HR.Employees
ORDER BY empid;
```

### The *TOP* and *OFFSET-FETCH* filters
When *TOP* applies with *DISTINCT*, it is evaluated after duplicate rows have been removed.

*TOP* is not standard, but *OFFSET-FETCH* is.
```sql
SELECT orderid, orderdate, custid, empid
FROM Sales.Orders
ORDER BY orderdate, orderid
OFFSET 50 ROWS FETCH NEXT 25 ROWS ONLY;
```

#### **Window function**
```sql
SELECT orderid, custid, val, ROW_NUMBER() OVER(PARTITION BY custid ORDER BY val) AS rownum
FROM Sales.OrderValues
ORDER BY custid, val;
```
|orderid|custid|val|rownum|
|--|--|--|--|
|10702|1|330.00|1|
|10952|1|471.00|2|
|10643|1|814.00|3|
|10835|1|845.00|4|
|10692|1|878.00|5|
|11011|1|933.00|6|
|10308|2|88.00|1|

## Predicates and operators

* To operate two operands with same data type, the result would be the same data type. For example:
```sql
SELECT col1/col2 FROM [NUM]
--returns 2, if col1 = 5, col2 = 2 and both are integer type
```
You can specify result to be different data type using *CAST*
```sql
SELECT CAST(col1 AS NUMERIC(12,2))/CAST(col2 AS NUMERIC(12,2)) FROM [NUM]
--returns 2.5
```
* To operate two operands with different data types, the one with the lower precedence is promoted to the one that is higher.
for example:
```sql
SELECT col1/col2 FROM [NUM]
--returns 2.5 as col1 is INT and col2 is NUMERIC, since NUMERIC has higher precedence than INT.
```

## CASE expressions

There are 2 major types of *CASE* clauses, *simple* and *searched*. If *CASE* does not have *ELSE* clause, it defaults to `ELSE NULL`

*simple*
```sql
SELECT productid, productname, categoryid,
CASE categoryid
    WHEN 1 THEN 'Beverages'
    WHEN 2 THEN 'Condiments'
    WHEN 3 THEN 'Confections'
    WHEN 4 THEN 'Dairy Products'
    WHEN 5 THEN 'Grains/Cereals'
    WHEN 6 THEN 'Meat/Poultry'
    WHEN 7 THEN 'Produce'
    WHEN 8 THEN 'Seafood'
    ELSE 'Unknow Category'
END AS categoryname
FROM Production.Products
```
*searched*
```sql
SELECT orderid, custid, val,
CASE
    WHEN val < 1000.00                      THEN 'Less than 1000'
    WHEN val BETWEEN 1000.00 AND 3000.00    THEN 'Between 1000 and 3000'
    WHEN val > 3000.00                      THEN 'More than 3000'
ELSE 'Unknown'
END AS valuecategory
FROM Sales.OrderValues
```
## NULLs

* *NOT UNKNOWN* is *UNKNOWN*
* SQL provides you with *IS NULL* and *IS NOT NULL* which you should use instead of `= NULL` and `<> NULL`.

for example:
```sql
SELECT * FROM Sales.Customers;
--returns 91 lines

SELECT * FROM Sales.Customers WHERE regions = N'WA';
--returns 3 lines

SELECT * FROM Sales.Customers WHERE regions <> N'WA';
--returns 28 lines

-- BUT 60 lines are missing, because NULL value
SELECT * FROM Sales.Customers WHERE regions <> N'WA' OR regions IS NULL;
--returns 88 lines

--HOWEVER
SELECT * FROM Sales.Customers WHERE regions = NULL;
--returns 0 line, because compare NULL to NULL is UNKOWN
```

* NULL values would be considered in to *GROUP BY* and *ORDER BY* clause. *UNIQUE* constraint can only allow one row to be NULL

## All-at-once operations
* *WHERE* clause is processed at once, so there's no order among predicates. Following statement will fail because col1 would be 0.
```sql
SELECT col1, col2
FROM dbo.T1
WHERE col1 <> 0 AND col2/col1 > 2;
--SQL would not execute from left to right, and does not support short circuits.
```
* To makes sure predicates are processed in order, we can use *CASE* expression.
for example:
```sql
SELECT col1, col2 FROM dbo.T1
WHERE
    CASE 
        WHEN col1 = 0 THEN 'no'
        WHEN col2/col1 > 2 THEN 'yes'
        ELSE 'no'
    END = 'yes';
```

## Working with character data
* CHAR vs. NCHAR
    * Regular characters use 1 byte of storage for each character, whereas Unicode data requires 2 bytes percharacter and in cases in which a surrogate pair is needed, 4 bytes are required.
    * N'This is a Unicode character string literal'
* CHAR vs. VARCHAR
    * Without VAR, server preserves space for n characters string. This is more suitable for write-focused systems.
    * With VAR, the maximum character supported is n, actual number of character determines the amount of storage. It might cause movement outside the current page when updates.

### Collation
For example: *Latin1_General_CI_AS*
* Latin1_General: Code page 1252 si used.
* Dictionary sorting: (A and a < B and b)
    BIN: (A < B < a < b)
* CI: Data is case insensitive (a = A)
* AS: Data is accent sensitive (a in different language is differently treated)

For example:
```sql
SELECT empid, firstname, lastname
FROM HR.Employees
WHERE lastname = N'davis';
--return 1 line which is 1 | Sara | Davis

SELECT empid, firstname, lastname
FROM HR.Employees
WHERE lastname COLLATE Latin1_Genral_CS_AS = N'davis';
--return 0 line cause we are using case sensitive collation
```

* To express literal abc'de, we can do `'abc''de'`

### Operators and functions

#### **String concatenation**

* concatenation with a NULL should yield a NULL.
```sql
SELECT custid, country, region, city, country + N',' + region + N',' + city AS location
FROM Sales.Cutomers;
--location could return NULL since region is nullable
```

* We could use *COALESCE* to eliminate NULL condition
```sql
SELECT custid, country, region, city, coutry + COALESCE(N',' + region, N'') + N',' + city AS location
FROM Sales.Customers
--returns <N','region> if region is not null and <''> for region is null
```

* T-SQL supports *CONCAT* which will substitutes NULL with empty strings
```sql
SELECT custid, country, region, city, CONCAT(country , N',' + region, N',' + city) AS location
FROM Sales.Customers
```

#### **SUBSTRING**
```sql
SELECT SUBSTRING('abcde', 1, 3);
--return 'abc'
SELECT SUBSTRING('abcde', 1, 100);
--return 'abcde' without spaces at the end
```

#### **The LEFT and RIGHT functions**
```sql
SELECT RIGHT('abcde', 3)
--return 'cde'
```

## Working with date and time data

## Querying metadata


# Chapter 4 Subqueries
Subqueries can return:
* single value (covered in this chapter)
* multiple values (covered in this chapter)
* whole table result (covered in Chapter 5)

Subqueries can be classified as 
* self-contained, which HAS NO dependency on tables from out query
* correlated, which HAS dependency on tables from out query

## Self-contained subqueries
### Self-contained scalar subquery examples
They appear any where a single-valued expression can appear in out query(sucha as *WHERE* and *SELECT*).
```sql
SELECT orderid, orderdate, empid, custid
FROM Sales.Orders
WHERE orderid = (SELECT MAX(O.orderid) FROM Sales.Orders AS O);
```

If subquery returns multiple values and the operator expects single value, the statment will fail. For example:
```sql
SELECT orderid 
FROM Sales.Orders
WHERE empid = 
(SELECT E.empid
FROM HR.Employees AS E
WHERE E.lastname LIKE N'D%');
--the subquery returns multiple values and = expects single value which causes statement fails
```

If subquey returns empty result, it will be converted to a *NULL*. Comparison with NULL result in *UNKNOWN*, and *WHERE* clause only returns *TRUE*, so the whole statement will be empty at the end. For example:
```sql
SELECT orderid
FROM Sales.Orders
WHERE empid = 
(SELECT E.empid
FROM HR.Employees AS E
WHERE E.lastname LIKE N'A%');
--the subquery returns empty value which will be converted to NULL causes the whole statement is empty result
```

### Self-contained multivalued subquery examples
#### **IN predicate**
```sql
SELECT orderid
FROM Sales.Orders
WHERE empid IN
(SELECT E.empid
FROM HR.Employees AS E
WHERE E.lastname LIKE N'D%')

SELECT n
FROM dbo.Nums
WHERE n BETWEEN (SELECT MAX(orderid) FROM dbo.Orders AS O)
        AND (SELECT MIN(orderdi) FROM dbo.Orders AS O)
AND n NOT IN (SELECT O.orderid FROM dbo.Orders AS O)
```

## Correlated subqueries
```sql
SELECT custid, orderid, orderdate, empid
FROM Sales.Orders AS O1
WHERE orderid = 
(SELECT MAX(O2.orderid)
FROM Sales.Orders AS O2
WHERE O2.custid = O1.custid);
```

### The *EXISTS* predicate
TSQL supports *EXISTS* that accept a subquery as input and returns TRUE if the subquey returns any rows and FALSE otherwise.

```sql
SELECT custid, companyname
FROM Sales.Customers AS C
WHERE country = N'Spain'
AND NOT EXISTS
(SELECT * FROM Sales.Orders AS O
WHERE O.custid = C.custid)
--return spain customers who hasn't place any order
```

*EXISTS* uses two-valued logic instead of three-valued logic.
*IN* uses three-valued logic, so you need to watch out for *NULL* values which will cause unknown and be filtered out by *IN* predicate.

# Chapter 5 Table Expression
TSQL supports 4 types of table expressions:
* derived tables(table subqueries)
* common table expressions(CTEs)
* views
* inline table-valued functions(inline TVFs)

3 requirements for table expressions:
1. No order is guaranteed, so you can't use *ORDER BY* unless you use *TOP* or *OFFSET-FETCH*
2. All columns must have names
3. All column names must be unique

## Derived tables
it is defined in *FROM* clause and is gone after outer query is finished.
```sql
SELECT * 
FROM (SELECT custid, companyname 
        FROM Sales.Customers
        WHERE coutry = N'USA') AS USACusts;
```

### Assigning column aliases
You can use derived tables to solve aliases problem.For example:
```sql
SELECT YEAR(orderdate) AS orderyear, COUNT(DISTINCT custid) AS numcusts
FROM Sales.Orders
GROUP BY orderyear;
--this statement will fail 'cuase orderyear is not accessible in GROUP BY since SELECT is the clause that is executed at last

--We can fix this by derived table since derived table is in FROM clause which is executed at the beginning
SELECT orderyear, COUNT(DISTINCT custid) AS numcusts
FROM
(SELECT YEAR(orderdate) AS orderyear, custid
FROM Sales.Orders) AS D
GROUP BY orderyear;

--ALSO we can asign alias external to the table expression
SELECT orderyear, COUNT(DISTINCT custid) AS numcusts
FROM
(SELECT YEAR(orderdate), custid
FROM Sales.Orders) AS D(orderyear, custid)
GROUP BY orderyear;
```
### Using arguments
### NESTING
```sql
SELECT orderyear, numcusts
FROM (SELECT orderyear, COUNT(DISTINCT custid) AS numcusts
        FROM (SELECT YEAR(orderdate) AS orderyear, custid
                FROM Sales.Orders) AS D1
        GROUP BY orderyear) AS D2
WHERE numcusts > 70;

-- NO difference than
SELECT YEAR(orderdate) AS orderyear, COUNT(DISTINCT custid) AS numcusts
FROM Sales.Orders
GROUP BY YEAR(orderdate)
HAVING COUNT(DISTINCT custid) > 70;
```
### Multiple references
```sql
SELECT Cur.orderyear, Cur.numcusts AS curnumcusts, Prv.numcusts AS prvnumcusts, Cur.numcusts - Prv.numcusts AS growth
FROM (SELECT YEAR(orderdate) AS orderyear, COUNT(DISTINCT custid) AS numcusts
        FROM Sales.Orders
        GROUP BY YEAR(orderdate)) AS Cur
LEFT OUTER JOIN
    (SELECT YEAR(orderdate) AS orderyear, COUNT(DISTINCT custid) AS numcusts
        FROM Sales.Orders
        GROUP BY YEAR(orderdate)) AS Prv
ON Cur.orderyear = Prv.orderyear + 1
```

## Common table expressions
```sql
WITH USACusts AS
(
    SELECT custid, companyname
    FROM Sales.Customers
    WHERE country = N'USA'
)
SELECT * from USACusts;
```

### Assigning column aliases in CTEs
alias can be used after claimed in CTEs

```sql
WITH C AS(
    SELECT YEAR(orderdate) AS orderyear, custid
    FROM Sales.Orders
)
SELECT orderyear, COUNT(DISTINCT custid) AS numcusts
FROM C
GROUP BY orderyear;

--or we can claim aliase externally
WITH C (orderyear, custid) AS(
    SELECT YEAR(orderdate), custid
    FROM Sales.Orders
)
SELECT orderyear, COUNT(DISTINCT custid) AS numcusts
FROM C
GROUP BY orderyear;
```

### Defining multiple CTEs
```sql
WITH C1 AS(
    SELECT YEAR(orderyear) AS orderyear, custid
    FROM Sales.Orders
),
C2 AS(
    SELECT orderyear, COUNT(DISTINCT custid) AS numcusts
    FROM C1
    GROUP BY orderyear
)
SELECT orderyear, numcusts
FROM C2
WHERE numcusts > 70;
```

### Multiple reference in CTEs
```sql
WITH YearlyCount AS
(
    SELECT YEAR(orderdate) AS orderyear, COUNT(DISTINCT custid) AS numcusts
    FROM Sales.Orders
    GROUP BY YEAR(orderdate)
)
SELECT Cur.orderyear, Cur.numcusts AS curnumcusts, Prv.numcusts AS prvnumcusts, Cur.numcusts - Prv.numcusts AS growth
FROM YearlyCount AS Cur
LEFT OUTER JOIN YearlyCount AS Prv
ON Cur.orderyear = Prv.orderyear + 1;
```

### Recursive CTEs

```sql
WITH EmpsCTE AS(
    --Anchor
    SELECT empid, mgrid, firstname, lastname
    FROM HR.Employees
    WHERE empid = 2

    UNION ALL
    --Recursive
    SELECT C.empid, C.mgrid, C.firstname, C.lastname
    FROM EmpsCTE AS P
    INNER JOIN HR.Employees AS C
    ON C.mgrid = p.empid
)
SELECT empid, mgrid, firstname, lastname
FROM EmpsCTE;
```

Process of Recursive CTEs
1. Process Anchor and make anchor result = EmpsCTE
2. Process Recursive and make result = EmpsCTE
3. Process Recursive and make result = EmpsCTE until Recursive return empty set
4. Union all result together

## Views
