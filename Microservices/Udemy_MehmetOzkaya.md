# Section 1: Introduction

## Microservices vs. Monolithic

| Characteristics     | Description                                                       | Microservices | Monolithic |
| ------------------- | ----------------------------------------------------------------- | ------------- | ---------- |
| Scalability         | Easy to add new feature                                           | Yes           | No         |
| Agility             | Is feature updating more independent, (Not closely tied together) | Yes           | No         |
| Technology Agnostic | Allowed to use diverse technology stack                           | Yes           | No         |
| Easy to develop     |                                                                   | No            | Yes        |
| Easy to debug       |                                                                   | No            | Yes        |
| Data ACID           |                                                                   | No            | Yes        |


## MongoDB with Docker

### Pull the mongo latest image

`docker pull mongo`

### Create MongoDB Container using Docker

`docker run -d -p 27017:27017 --name shopping-mongo mongo`

### Check if container is runing

`docker ps`

### Check MongoDB logs

`docker logs -f shopping-mongo`

### Using MongoDB container by Interactive Terminal

`docker exec -it shopping-mongo bash`

### Run MongoDB Commands
Inside the Interactive Terminal

#### Start mongo CLI
`mongosh`

#### Show Databases

`show dbs`

#### Create new database
`use CatalogDb`

#### Create new collection

`db.createCollection('Products')`

#### Insert product document

```
db.Products.insertMany([
{
    "Name": "Asus Laptop",
    "Category": "Computers",
    "Summary": "Summary",
    "Description": "Description",
    "ImageFile":"ImageFile",
    "Price":54.93
},
{
    "Name": "HP Laptop",
    "Category": "Computers",
    "Summary": "Summary",
    "Description": "Description",
    "ImageFile": "ImageFile",
    "Price": 88.93
}
])
```

#### Query all the items in collection

`db.Products.find({}).pretty()`

#### Remove all the collection items

`db.Products.remove({})`

#### Show all collections

`show collections`

# About Architecture

## Simple Data-Driven

Application Layer => Domain Model Layer => Infrastructure Layer

|Name|Description|
|-|-|
|Application Layer|Entry pint, Exposes endpoints and enforces validation of data|
|Domain Model Layer|Contains business rules and logic.|
|Infrastructure Layer|Persistence of business state|

## Repository Pattern

API => Business Object => Repository => Database

### Repository layer

* An Abstraction layer between business layer and database context.
* Easy to add unit test and Mocking data.

