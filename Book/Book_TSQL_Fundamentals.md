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
```sql
CREATE VIEW Sales.USACusts
AS
SELECT custid, companyname, contactname, contacttitle, address, city, region, postlcode, country, phone, fax 
FROM Sales.Customers
WHERE country = N'USA';

-- Using views
SELECT custid, companyname
FROM Sales.USACusts;
```

### Pitfalls
Please avoid using * when creating views, because, even using *, views can only includes columns at the creating time. Newly added columns will not be updates to views automatically.

### Views and the *ORDER BY* clause
Views like other table expressions, needs to comply with the 3 requirements. DO NOT try to trick on *ORDER BY* clause in views, the order is not guaranteed if you do so. For example:
```sql
CREATE VIEW Sales.USACusts
AS
SELECT custid, companyname, contactname, contacttitle, address, city, region, postalcode, country, phone, fax
FROM Sales.Customers
WHERE country = N'USA'
ORDER BY region
OFFSET 0 ROWS;

CREATE VIEW Sales.USACusts
AS
SELECT TOP (100) PERCENT
    custid, companyname, contactname, contacttitle, address, city, region, postalcode, country, phone, fax
FROM Sales.Customers
WHERE country = N'USA'
ORDER BY region;

-- BOTH WORK ARROUND's ORDER is not QUARANTEED
```

### View options
#### **The *ENCRYPTION* option**
```sql
--gives you definition of Sales.USACusts
SELECT OBJECT_DEFINITION(OBJECT_ID('Sales.USACusts'));
--gives you definition of Sales.USACusts
EXEC sp_helptext 'Sales.USACusts';


--following statements make the previous statements returns NULL or encrypted
ALTER VIEW Sales.USACusts WITH ENCRYPTION
AS
SELECT
    custid, companyname, contactname, contacttitle, address, city, region, postalcode, country, phone, fax
FROM Sales.Customers
WHERE country = N'USA';
```

#### **The *SCHEMABINDING* option**
```sql
-- This makes sure you cannot alter table (Sales.Customers) and columns specified in this VIEW definition
ALTER VIEW Sales.USACusts WITH SCHEMABINDING
AS
SELECT
    custid, companyname, contactname, contacttitle, address, city, region, postalcode, country, phone, fax
FROM Sales.Customers
WHERE country = N'USA';
```

#### **The *CHECK OPTION* option**
```sql
-- This makes sure you cannot alter table (Sales.Customers) and columns specified in this VIEW definition
ALTER VIEW Sales.USACusts WITH SCHEMABINDING
AS
SELECT
    custid, companyname, contactname, contacttitle, address, city, region, postalcode, country, phone, fax
FROM Sales.Customers
WHERE country = N'USA'
WITH CHECK OPTION;
-- WITH CHECK OPTION makes sure when you do modification it will comply with the filter
```

## Inline table-valued functions
You can treat inline table-valued functions as view with input parameter
```sql
CREATE FUNCTION dbo.GetCustOrders(@cid AS INT) RETURNS TABLE
AS
RETURN
SELECT orderid, custid, empid, orderdate, requireddate, shppeddate, shipperid, freight, shipname, shipaddress, shipcity, shipregion,shippostalcode, shipcountry
FROM Sales.Orders
WHERE custid = @cid;

SELECT orderid, custid
FROM dbo.GetCustOrders(1) AS O;
```

## The *APPLY* operator
*This is a not standard SQL.*

First execute the left table, then do a match on the right table. Cross apply like cross join, which do not preserve empty result rows.

```sql
SElECT C.custid, A.orderid, A.orderdate
FROM Sales.Customers AS C
CROSS APPLY
    (SELECT orderid, empid, orderdate, requireddate
    FROM Sales.Orders AS O
    WHERE O.custid = C.custid
    ORDER BY orderdate DESC, orderid DESC
    OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY) AS A;

SElECT C.custid, A.orderid, A.orderdate
FROM Sales.Customers AS C
OUTER APPLY
    (SELECT orderid, empid, orderdate, requireddate
    FROM Sales.Orders AS O
    WHERE O.custid = C.custid
    ORDER BY orderdate DESC, orderid DESC
    OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY) AS A;
```

# Chapter 6 Set operators
Set operators use *distinct predicate*, which produces *TRUE* when compares two *NULL*.

* UNION
* INTERSECT
* EXCEPT

# Chapter 7 Beyond the fundamentals of querying
> SKIPPED

# Chapter 8 Data modification
To demonstrate samples in this chapter, we create dbo.Orders table.

```sql
CREATE TABLE dbo.Orders(
    orderid INT         NOT NULL
        CONSTRAINT PK_Orders PRIMARY KEY,
    orderdate DATE      NOT NULL
        CONSTRAINT DFT_orderdate DEFAULT(SYSDATETIME()),
    empid   INT         NOT NULL,
    custid  VARCHAR(10) NOT NULL
);
```

## The *INSERT VALUES* statement
* To specify orders when doing INSERT, we can use parentheses after table name. If we do not specify order, SQL SERVER insert according to the CREATE TABLE statement.

* To specify values when doing INSERT, we can use VALUES clause. If we do not specify values, 
    * first, database check if default is available when INSERT
    * Second, database check if NULL is allowed on that column
    * Third, database will fail the statement if no value is specified and no default is available and NULL value is not allowed

* T-SQL supports an enhanced standard *VALUES* clause that you can use multiple values seperated by commas. For example:

```sql
INSERT INTO dbo.Orders
    (orderid, orderdate, empid, custid)
VALUES
(10003, '20160213', 4, 'B'),
(10004, '20160214', 1, 'A'),
(10005, '20160213', 1, 'C'),
(10006, '20160215', 3, 'C');
```
* NOTE: the statement above run as a transaction, meaning that if any row fails to enter the table, none of rows in the statement enters the table.

* You can use *VALUES* clause as table-value constructor to get a <u>derived table</u>.For example:
```sql
SELECT * FROM 
(VALUES 
(10003, '20160213', 4, 'B'),
(10004, '20160214', 1, 'A'),
(10005, '20160213', 1, 'C'),
(10006, '20160215', 3, 'C')) AS O(orderid, orderdate, empid, custid);

```

## The *INSERT SELECT* statement
*INSERT SELECT* also run as a transaction.

```sql
INSERT INTO dbo.Orders(orderid, orderdate, empid, custid)
SELECT orderid, orderdate, empid, custid
FROM Sales.Orders
WHERE shipcountry = N'UK';
```
> NOTE: If you include *SYSDATETIME* in the query, it will only trigger once, instead of trigger per row. However, if you use *NEWID* function, it will trigger per row.

## The *INSERT EXEC* statement
```sql
DROP PROC IF EXISTS Sales.GetOrders;
GO

CREATE PROC Sales.GetOrders
    @country AS NVARCHAR(40)
AS
SELECT orderid, orderdate, empid, custid
FROM Sales.Orders
WHERE shipcountry = @country;

INSERT INTO dbo.Orders(orderid, orderdate, empid, cutid)
EXEC Sales.GetOrders @country = N'France';
```

## The *SELECT INTO* statement
* nonstandard SQL. 
```sql
DROP TABLE IF EXISTS dbo.Orders --if dbo.Orders exists this statement will fail

SELECT orderid, orderdate, empid, custid
INTO dbo.Orders
FROM Sales.Orders
```

* The target table's(dbo.Orders's) structure and data are based on the source table(Sales.Orders)
* Source table structure includes
    * column names
    * types
    * nullability
    * identity property
    * values
* Source table structure excludes
    * constraints
    * indexes
    * triggers
    * column properties such as SPARSE and FILESTREAM
    * permissions

* You can use *Set Operator* after *FROM*, for example:
```sql
DROP TABLE IF EXISTS dbo.Locations;

SELECT country, region, city
INTO dbo.Locations
FROM Sales.Customers

EXCEPT

SELECT country, region, city
FROM HR.Employees;
```

## The *BULK INSERT* statement

> please see "Prerequisites for Minimal Logging in Bulk Import" online books

## The identity property and the sequence object
### Identity
* standard column property

* If you do not specify the seed and increment, identity will give you 1 for both

```sql
DROP TABLE IF EXISTS dbo.T1;

CREATE TABLE dbo.T1(
    keycol  INT         NOT NULL IDENTITY(1,1)
        CONSTRAINT PK_T1 PRIMARY KEY,
    datacol VARCHAR(10) NOT NULL
        CONSTRAINT CHK_T1_datacol CHECK(datacol LIKE '[ABCDEFGHIJKLMNOPQRSTUVWXYZ]%')
);

-- if you do not proivde keycol when doing INSERT, database will create one for you

INSERT INTO dbo.T1 (datacol) VALUES('AAAAA'), ('CCCCC'), ('BBBBB');

SELECT * FROM dbo.T1;
```
#### **@@identity** and **SCOPE_IDENTITY**

* *@@identity* returns a identity last INSERTED by the session regardless the scopes
* *SCOPE_IDENTITY* returns a identity last INSERTED by the current scope.

```sql
DECLARE @new_key AS INT;
INSERT INTO dbo.T1(datacol) VALUES('AAAAA');
SET @new_key = SCOPE_IDENTITY();
SELECT @new_key AS new_key

-- result is 4
```

#### **IDENT_CURRENT**
* it returns current identity value of a table regardless of session.

```sql
SELECT SCOPE_IDENTITY() AS [SCOPE_IDENTITY],
@@identity AS [@@identity],
IDENT_CURRENT(N'dbo.T1') AS [IDENT_CURRENT];

-- NULL   NULL   4

--if you fail one insert, identity will be skipped

INSERT INTO dbo.T1 (datacol) VALUES ('EEEEE'), ('DDDDD'), ('11111') -- this will fail due to the check constraint

SELECT SCOPE_IDENTITY() AS [SCOPE_IDENTITY],
@@identity AS [@@identity],
IDENT_CURRENT(N'dbo.T1') AS [IDENT_CURRENT];
-- NULL    NULL   7   because we skipped 3 rows due to the last INSERT
SET IDENTITY_INSERT dbo.T1 ON
INSERT INTO dbo.T1(keycol, datacol) VALUES(5, 'FFFFF')
SET IDENTITY_INSERT dbo.T1 OFF

SELECT SCOPE_IDENTITY() AS [SCOPE_IDENTITY],
@@identity AS [@@identity],
IDENT_CURRENT(N'dbo.T1') AS [IDENT_CURRENT];
-- 5      5   7  
-- 7 because IDENT_CURRENT not changed until we insert identity that is higher than the CURRENT one
```

### Sequence
> search for more info about squence vs. identity

## Deleting data
## The *OUTPUT* clause
```SQL
UPDATE TOP(1) dbo.T1
SET datacol = 'AAZZZ'
	OUTPUT 
	inserted.keycol,
	deleted.datacol AS olddatacol,
	inserted.datacol AS newdatacol
WHERE datacol = 'AZZZZ';
-- TOP(1) make sure only update 1 row
-- OUTPUT allow you to view changed rows

UPDATE O
SET O.shipcountry = C.country,
O.shipregion = c.region,
O.shipcity = c.city
OUTPUT
inserted.orderid,
deleted.shipcountry AS oldshipcountry,
deleted.shipregion AS oldshipregion,
deleted.shipcity AS oldshipcity
FROM dbo.Orders AS O
INNER JOIN dbo.Customers AS C
ON O.custid = C.custid
WHERE C.country = N'UK'


-- Ultimate nested DML
INSERT INTO dbo.ProductsAudits(productid, colname, oldval, newval)
SELECT productid, N'unitprice', oldval, newval
FROM(
    UPDATE dbo.Products
    SET unitprice *= 1.15
    OUTPUT
        inserted.productid,
        deleted.unitprice AS oldval,
        inserted.unitprice AS newval
    WHERE supplierid = 1
) AS D
WHERE oldval < 20.0 AND newval >= 20.0;
```

# Chapter 9 Temporal tables
> Skipped

# Chapter 10 Transactions and concurrency
There are several principal need to be clarified before we digging in.
1. Lock and isolation level is concept applied when there is concurrency, if there's no concurrency or all statment happens in the same transaction, there's no need to worry about these concepts.
2. You only need to adjust isolation level whereever read operations happened.

## Lock and blocking
### Locks
    * Exclusive Lock: When this lock applies, no other lock can exist, by default, this lock is applied when there's modification on data.
    * Shared Lock: Only happens while reading. To change the behavior of shared lock, you need to adjust isolation level.

### Troubleshooting blocking
Example of exclusive lock:
```sql
-- CON1
-- Begin transaction and do not commit, which will issue exclusive lock on the row
BEGIN TRAN;
UPDATE Production.Products SET unitprice += 1.00 WHERE productid = 2

-- CON2
-- By box product default, this read is under READ COMMITTED isolation level
SELECT productid, unitprice FROM Production.Products WHERE productid = 2
```

#### **Tools can be used to identify blocking**
1. identify status of lock
```sql
SELECT
    request_session_id AS sid,
    resoucrce_type AS restype,
    resource_database_id AS dbid,
    DB_NAME(resource_database_id) AS dbname,
    resource_description AS res,
    resource_associated_entity_id AS resid,
    request_mode AS mode,
    request_status AS status
FROM sys.dm_tran_locks;
```
|sid|restype|dbid|dbname|res|resid|mode|status|
|--|--|--|--|--|--|--|--|
|53|DATABASE|8|TSQLV4||0|S|GRANT|
|52|DATABASE|8|TSQLV4||0|S|GRANT|
|51|DATABASE|8|TSQLV4||0|S|GRANT|
|54|DATABASE|8|TSQLV4||0|S|GRANT|
|53|PAGE|8|TSQLV4|1:127|72057594038845440|IS|GRANT|
|52|PAGE|8|TSQLV4|1:127|72057594038845440|IX|GRANT|
|53|OBJECT|8|TSQLV4||133575514|IS|GRANT|
|52|OBJECT|8|TSQLV4||133575514|IX|GRANT|
|52|KEY|8|TSQLV4|(020068e8b274)|72057594038845440|X|GRANT|
|53|KEY|8|TSQLV4|(020068e8b274)|72057594038845440|S|GRANT|

The status tells you the lock status.

```sql
SELECT @@SPID
-- session id, which will be the same as number in parentheses on tab title
```

```sql
SELECT OBJECT_NAME(133575514)
-- return object name which will be Production.Products in this example
```
2. identify sql handled by session id
```sql
SELECT 
    session_id AS sid,
    connect_time,
    last_read,
    last_write,
    most_recent_sql_handle
FROM sys.dm_exec_connections
WHERE session_id IN (52, 53)
```
|sid|connect_time|last_read|last_write|most_recent_sql_handle|
|--|--|--|--|--|
|52|2016-06-25 15:20:03.360|2016-06-25 15:20:15.750|2016-06-25 15:20:15.817|0x01000800DE2DB71FB0936F05000000000000000000000000|
|53|2016-06-25 15:20:07.300|2016-06-25 15:20:20.950|2016-06-25 15:20:07.327|0x0200000063FC7D052E09844778CDD615CFE7A2D1FB411802|

most_recent_sql_handle tells you what sql is handling by the session id right now. Because we are facing a blocking condition in this example, the sql here is the one causing the blocking.

3. convert sql from binary to string
```sql
SELECT session_id, text 
FROM sys.dm_exec_connections
    CROSS APPLY sys.dm_exec_sql_text(most_recent_sql_handle) AS ST
WHERE session_id IN(52, 53)

-- OR

SELECT * FROM sys.dm_exec_sql_text(CONVERT(VARBINARY(64), '0x020000008493651246BA591D25502095CCD7669F841FDFCB0000000000000000000000000000000000000000', 1)) AS ST
```

4. Find other useful information by session id
```sql
SELECT
    session_id AS sid,
    login_time,
    host_name,
    program_name,
    login_name,
    nt_user_name,
    last_request_start_time,
    last_request_end_time
FROM sys.dm_exec_sessions
WHERE session_id IN(52,53)
```
|sid|login_time|host_name|program_name|login_name|nt_user_name|last_request_start_time|last_request_end_time|
|--|--|--|--|--|--|--|--|
|52|2022-01-05 17:25:34.067|DESKTOP-N0DKTGS|Microsoft SQL Server Management Studio - Query|DESKTOP-N0DKTGS\Lei Zhong|Lei Zhong|2022-01-05 17:49:45.733|2022-01-05 17:49:45.730|
|53|2022-01-05 17:25:34.067|DESKTOP-N0DKTGS|Microsoft SQL Server Management Studio - Query|DESKTOP-N0DKTGS\Lei Zhong|Lei Zhong|2022-01-05 17:49:45.733|2022-01-05 17:49:45.730|

5. identify blocking sql by session id
```sql
SELECT
    session_id AS sid,
    blocking_session_id,
    command,
    sql_handle,
    database_id,
    wait_type,
    wait_time,
    wait_resource
FROM sys.dm_exec_requests
WHERE blocking_session_id > 0;
```
|sid|blocking_session_id|command|sql_handle|database_id|wait_type|wait_time|wait_resource|
|--|--|--|--|--|--|--|--|
|53|52|SELECT|0x0200000063FC7D052E09844778CDD615CFE7A2D1FB411802|8|LCK_M_S|1383760|KEY: 8:72057594038845440(020068e8b274)|

6. Set timeout and kill
```sql
SET LOCK_TIMEOUT 5000;
-- Set lock timeout as 5 second for current session, lock only lock for 5 seconds, after that, will print timeout message
SELECT productid, unitprice
FROM Production.Products
WHERE productid = 2;
```

```sql
SET LOCK_TIMEOUT -1;
-- set lock timeout to none;
```

```sql
KILL 52;
-- kill session 52;
```

## Isolation levels
### READ UNCOMMITED
```sql
--CON 1
--Open a transaction and not closing it, and apply exclusive lock productid=2 row
BEGIN TRAN
    UPDATE Production.Products
    SET unitprice += 1.00
    WHERE productid = 2;

    SELECT productid, unitprice
    FROM Production.Products
    WHERE productid = 2;

--CON 2
--Set isolation level to READ UNCOMMITED, because default is READ COMMITED
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT productid, unitprice
FROM Production.Products
WHERE productid = 2;
-- original unitprice is 19, here, result is unitprice = 20, which is an uncommited result, because CON1 is not commited yet
```
READ UNCOMMITED causes *dirty read*.

### READ COMMITTED
```sql
--CON 1
--Open a transaction and not closing it, and apply exclusive lock productid=2 row
BEGIN TRAN
    UPDATE Production.Products
    SET unitprice += 1.00
    WHERE productid = 2;

    SELECT productid, unitprice
    FROM Production.Products
    WHERE productid = 2;

--CON 2
--Set isolation level to READ UNCOMMITED, because default is READ COMMITED
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT productid, unitprice
FROM Production.Products
WHERE productid = 2;
-- original unitprice is 19, here, reading is blocked by the exclusive lock, because READ COMMITTED uses shared lock, however, it DOES NOT keep this shared lock until the end of the transaction
```

```sql
--CON 1
--close transaction

COMMIT TRAN;

--CON 2
--result shows up until CON 1 is commited, unitprice is 20 which is commited result
```

### REPEATABLE READ
#### **Situation #1**
```sql
--CON 1
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- begin transaction without commit by REPEATABLE READ, which will apply a shared lock wait until transaction closed
BEGIN TRAN;
    SELECT productid, unitprice
    FROM Production.Products
    WHERE productid = 2;
-- result is unitprice = 19 which is unchanged

--CON 2
UPDATE Production.Products
SET unitprice += 1.00
WHERE productid = 2;
-- apply a exclusive lock, because of the shared lock existance, this statement is blocked.
```
```sql
--CON 1
SELECT productid, unitprice
FROM Production.Products
WHERE productid = 2;

COMMIT TRAN;
-- result is unitprice = 19 still unchanged even there's update concurrently

--CON 2
--update proceeds after CON1 is commited
```

#### **Situation #2**
```sql
--CON 1
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

BEGIN TRAN;
SELECT productid, unitprice
FROM Production.Products

UPDATE Production.Products
SET unitprice += 1.00
WHERE productid = 2

--CON 2
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

BEGIN TRAN;
SELECT productid, unitprice
FROM Production.Products

UPDATE Production.Products
SET unitprice += 1.00
WHERE productid = 2
-- we do not get a deadlock situation here
-- After CON1 is commited, it's ok instead of deadlock.
```

### SERIALIZABLE
Phantom Read:
    
* Although we have shared lock persists until the end of the transactions, which ensures two reads in the same transaction will result the same. However, in the middle of these two reads, there might be chance of another transaction insert new row to the table which is not blocked by the shared lock and exclusive lock conflicts, because shared lock only applies for certain rows that is read by the SELECT filter. The result of the second read might be different from the first one. We call this situation *phantom read*.
    
* If you want to make new rows affected by the shared lock, you need SERIALIZABLE.

```sql
--CON 1
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRAN;
    SELECT productid, productname, categoryid, unitprice
    FROM Production.Products
    WHERE categoryid = 1;
--CON 2
INSERT INTO Production.Products(productname, supplierid, categoryid, unitprice, discontinued)
VALUES('Product ABCDE', 1, 1, 20.00, 0);
```
```sql
--CON 1
SELECT productid,, productname, categoryid, unitprice
FROM Production.Products
WHERE categoryid = 1;

COMMIT TRAN:
--this will release shared lock from CON1 which blocks CON2 previously, and result of this statement will be the same as first read.
```

## Isolation levels based on row versioning

> see the original book for more info

* SNAPSHOT and READ COMMITTED SNAPSHOT both DO NOT apply shared lock when read.
* SNAPSHOT will always read from the snapshot before current transaction
* READ COMITTED SNAPSHOT will read from commited snapshot at current.

## Deadlocks
sample of deadlock:
```sql
--CON 1
BEGIN TRAN;
UPDATE Production.Products
SET unitprice += 1.00
WHERE productid = 2;

--CON 2
BEGIN TRAN;
UPDATE Sales.OrderDetails
SET unitprice += 1.00
WHERE productid = 2;
```

```sql
--CON 1
SELECT orderid, productid, unitprice
FROM Sales.OrderDetails
WHERE productid = 2;
COMMIT TRAN;

--CON2
SELECT productid, unitprice
FROM Production.Products
WHERE productid = 2;
COMMIT TRAN;
```

* Once deadlock occurs, SQL Server will show up and kill one of them after few seconds. She kills due to the lowest DEADLOCK_PRIORITY of the session, which is in range -10 through 10. If the DEADLOCK_PRIORITY is the same, she will choose amount of work in the least to kill. If same amount of work occurs, she will toss a coin.
* If SQL Server DOES NOT shows up, deadlock exists forever...

# Chapter 11 Programmable objects

## Variables
```sql
DECLARE @i AS INT;
SET @i = 10;

DECLARE @i AS INT = 10;
```

```sql
DECLARE @empname AS NVARCHAR(61);
SET @empname = (SELECT firstname + N' ' + lastname FROM HR.Employees WHERE empid = 3);

SELECT @empname AS empname;
```

```sql
DECLARE @firstname AS NVARCHAR(20), @lastname AS NVARCHAR(40);

SELECT @firstname = (SELECT firstname FROM HR.Employees WHERE empid = 3);

SELECT @lastname = (SELECT lastname FROM HR.Employees WHERE empid = 3);

SELECT @firstname AS firstname, @lastname AS lastname
```

```sql
--NONSTANDARD
DECLARE @firstanme AS NVARCHAR(20), @lastname AS NVARCHAR(40);

SELECT @firstname = firstname, @lastname = lastname FROM HR.Employees WHERE empid = 3;
-- NOTE: If SELECT returns multiple row, it will set last row of value to the variable.
-- NOTE: SET is safer, if SELECT returns multiple rows, statement will fail
```

## Batches
A batch is one or more T-SQL statements sent by a client applcation to SQL Server for execution as a single unit.

### Batches and Transactions
A transaction can be submitted in parts as multiple batches, a batch can have multiple transactions.

SSMS uses GO statment to signal the end of a batch.

### A batch as a unit of parsing
```sql
PRINT 'First batch';
USE TSQLV4;
GO

PRINT 'Second batch';
SELECT custid FROM Sales.Customers;
SELECT orderid FOM Sales.ORders;
GO

PRINT 'Third batch';
SELECT empid FROM HR.Employees;

/*OUTPUT
First batch
Msg 102, Level 15, State 1, Line 91
Incorrect syntax near 'Sales'.
Third batch
empid
-----------
2
7
1
5
6
8
3
9
4
*/

```
NOTE: Because the second batch has syntax error 'FOM',  the whole batch is not submitted to the SQL Server. But first and third still got executed.

### Batches and variables
A variable is local to the batch where it is defined.
```sql
DECLARE @i AS INT;
SET @i = 10;
PRINT @I;
GO

PRINT @i -- Fail
/*OUTPUT
10
Msg 137, Level 15, State 2, Line 106
Must declare the scalar variable "@i".
*/
```

### Statements that cannot be combined in the same batch
The following statements cannot be combined with other statements in the same batch:
* *CREATE DEFAULT*
* *CREATE FUNCTION*
* *CREATE PROCEDURE*
* *CREATE RULE*
* *CREATE SCHEMA*
* *CREATE TRIGGER*
* *CREATE VIEW*

For example:
```sql
DROP VIEW IF EXISTS Sales.MyView;

CREATE VIEW Sales.MyView
AS
SELECT YEAR(orderdate) AS orderyear, COUNT(*) AS numorders
FROM Sales.Orders
GROUP BY YEAR(orderdate);
GO

/*OUTPUT
Msg 111, Level 15, State 1, Line 13
'CREATE VIEW' must be the first statement in a query batch.
*/
```

### A batch as a unit of resolution
A batch is a unit of resolution (also known as *binding*).
This means that checking the existence of objects and columns happens at the batch level. If you try to change schema and do manipulate at same batch, sql server might not aware of the updated schema.

For example
```sql
DROP TABLE IF EXISTS dbo.T1;
CREATE TABLE dbo.T1(col1 INT);

ALTER TABLE dbo.T1 ADD col2 INT;
SELECT col1, col2 FROM dbo.T1;

/*OUTPUT
Msg 207, Level 16, State 1, Line 130
Invalid column name 'col2'.
*/
```
Therefore, try separate data-definition language(DDL) and data-manipulation language(DML) into different batches.For example:
```sql
DROP TABLE IF EXISTS dbo.T1;
CREATE TABLE dbo.T1(col1 INT);

ALTER TABLE dbo.T1 ADD col2 INT;
GO
SELECT col1, col2 FROM dbo.T1;
```

### The GO n operation
```sql
DROP TABLE IF EXISTS dbo.T1;
CREATE TABLE dbo.T1(col1 INT IDENTITY);
GO
SET NOCOUNT ON;
INSERT INTO dbo.T1 DEFAULT VALUES;
GO 100
SELECT * FROM dbo.T1;
```
## Cursors
> find more info in book
## Temporary tables
There are 3 kinds of temporary tables:
* Local temporary table
* Global temporary table
* Temporary table variable

### Local temporary tables
You create local temporary table with table name prefix with a single pound sign. It is visible only to the Session where declares it. And SQL Server will clean it right after the session is finished. If Proc 1 calls Proc 2 which calls Proc 3 which calls Proc 4, and you create local table in Proc 2, local table will be visible in Proc 2, 3, and 4, but not in Proc 1.

Sample of Local temporary table:
```sql
DROP TABLE IF EXISTS #MyOrderTotalsByYear;
GO

CREATE TABLE #MyOrderTotalsByYear(
    orderyear   INT         NOT NULL PRIMARY KEY,
    qty         INT         NOT NULL
);

INSERT INTO #MyOrderTotalsByYear(orderyear, qty)
    SELECT YEAR(O.orderyear) AS orderyear, SUM(OD.qty) AS qty
    FROM Sales.Orders AS O
    INNER JOIN Sales.OrderDetails AS OD
    ON O.orderid = OD.orderid
    GROUP BY YEAR(orderdate);

SELECT Cur.orderyear, Cur.qty AS curyearqty, Prv.qty AS prvyearqty
FROM #MyOrderTotalsByYear AS Cur
LEFT OUTER JOIN #MyOrderTotalsByYear AS Prv
ON Cur.Orderyear = Prv.Orderyear + 1;

DROP TABLE IF EXISTS #MyOrderTotalsByYear;
```

### Global temporary tables
Global temporary table could be created by prefix table name with double pound keys. It will be destroyed if session where declares it is disconnected. And other session can access this table. 

> Global temporary table is not available in Azure SQL Database

### Table variables
Table variables only exists in batch scope.

```sql
DECLARE @MyOrderTotalsByYear TABLE
(
    orderyear INT           NOT NULL PRIMARY KEY,
    qty       INT           NOT NULL
);

INSERT INTO @MyorderTotalsByYear (orderyear, qty)
    SELECT YEAR(O.orderdate) AS orderyear,
    SUM(OD.qty) AS qty
    FROM Sales.Orders AS O
    INNER JOIN Sales.OrderDetails AS OD
    ON OD.orderid = O.orderid
    GROUP BY YEAR(orderdate);

SELECT Cur.orderyear, Cur.qty AS curyearqty, Prv.qty AS prvyearqty
FROM @MyOrderTotalsByYear AS Cur
LEFT OUTER JOIN @MyOrderTotalsByYear AS Prv
ON Cur.orderyear = Prv.orderyear + 1;
```

### Table types
You can declare a table type and reuse this table type in future.
```sql
DROP TYPE IF EXISTS dbo.OrderTotalsByYear;

CREATE TYPE dbo.OrderTotalsByYear AS TABLE(
    orderyear INT NOT NULL PRIMARY KEY,
    qty INT NOT NULL
);

DECLARE @MyOrderTotalsByYear AS dbo.OrderTotalsByYear;

INSERT INTO @MyorderTotalsByYear (orderyear, qty)
    SELECT YEAR(O.orderdate) AS orderyear,
    SUM(OD.qty) AS qty
    FROM Sales.Orders AS O
    INNER JOIN Sales.OrderDetails AS OD
    ON OD.orderid = O.orderid
    GROUP BY YEAR(orderdate);
```

## Dynamic SQL
You can execute a string in a batch.
You use dynamic SQL in 3 purposes:
* Automating admin tasks
* Improving performance
* Constructing elements of code based on querying the actual data

### The EXEC command
Execute a string both in regular and Unicode.

Sample:
```sql
DECLARE @sql AS VARCHAR(100); 
SET @sql = 'PRINT ''This message was printed by a dynamic SQL batch.'';'; 
EXEC(@sql);
```

### The sp_executesql stored procedure
This is much safer than EXEC, but only accept Unicode string.

It requires two parameters to function, @stmt is the query you wanna execute and @params is the parameter you wanna specify.

```sql
DECLARE @sql AS NVARCHAR(100);
SET @sql = N'SELECT orderid, custid, empid, orderdate FROM Sales.Orders WHERE orderid = @orderid;'; 
EXEC sp_executesql
    @stmt = @sql,
    @params = N'@orderid AS INT',
    @orderid = 10248;
```

## Routines
## Error handling
