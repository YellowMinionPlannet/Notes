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
NOTE: All aggregate funcitons ignores *NULL*, with one exception - *COUNT(*)*. *DISTINCT* can be used in other funciton as well.

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

## CASE expressions

## NULLs

## All-at-once operations

## Working with character data

## Working with date and time data

## Querying metadata
