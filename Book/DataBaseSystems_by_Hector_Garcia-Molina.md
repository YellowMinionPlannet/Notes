- What is database system

Database System has following main features:
1. it can create database by schema
2. query / manipulate data by query/ data manipulation language
3. large amount o fdata is able to be access/modified efficiently
4. durability, and the ability to recover data
5. multiple concurrent users access achieved by isolation and consistency achieved by atomicity.

- history of database system
At first, database is just like file system, banking, aireline company, and financial/accounting company's system.
Then, the CODASYL query langugae.
1970's Tedd Codd published a paper about relational database system.

- Query Process:
1. Query compiler, parse syntax and optimize them, create sequence of actions, which is called query plan.
2. Query plan is tree structured
3. the plan is passed to execution engine, where it connects to lots of other parts of database. Will send request to resource manager
4. Resource manager, visits data files and index files
5. Then goes to buffer manager, buffer get the data from hardrive, and data is transfered with page or distblock units.

- Process of Transaction:
1. concurrency control manager / scheduler to handle isolation and atomicity
2. logging and recovery manger to handle durability

# Part I Relational Database Modeling
## Chapter 2 The Relational Model of Data
### 2.1 Overview of Data Models
- What is Data Model, 3 main parts of data model is:
    1. Structure of the data
    2. Operations of the data
    3. Constraints of the data
### 2.2 Basics of the Relational Model
- Relation, table (a 2 dimensional table)
- Attributes, columns
- Schemas, the relation that describe the data, for example we can notate a schema like:

**Movies(title, year, length, genre)**

where title, year, length and genre are the attributes, and Movies is the relation(table)

- Tuples, rows of table
- domains, the data type of the attribute
now we can notate a relation with domains:

**Movies(title:string, year:integer, length:integer, genre:string)**


- Relation Instances, a set of tuples of the relation.
- Key of Relation,the identiy of rows
where we can notate a relation with key:

**Movies(<u>title</u>, <u>year</u>, length, genre)**

### 2.3 Defining a Relation Schema in SQL
   