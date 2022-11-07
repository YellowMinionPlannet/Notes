# 8 Objects, Classes, and Object-Oriented Programming

## Understanding Objects

Creating customed object with Object constructor and Object literals:

### Object constructor example

```js
let person = new Object();
person.name = "lei";
person.age = 36;
person.job = "Software engineering";

person.sayName = function () {
  console.log(this.name);
};
```

### Object literals example

```js
let person = {
  name: "lei",
  age: 36,
  job: "Software engineering",
  sayName() {
    console.log(this.name);
  },
};
```

### Types of Properties

Properties' characteristics are described by internal attributes, which are indicated by surrounding the attribute's name with two pairs of square brackets, such as `[[responseResult]]`.

There are two types of properties:

- data properties
- accessor properties

#### Data Properties

4 attributes to describe data property:

- [[Configurable]] : true/false, by default true, which indicates the property can be removed by `delete`, the property's attributes can be changed, or the property can be changed into accessor property.

- [[Enumerable]] : true/false, by default true, which indicates the property can be iterated by the `for-in` loop.

- [[Writable]] : true/false, by default true, property's value can be changed.

- [[Value]] : by default undefined, where property's value is stored.

You can change a data property's attributes by using `Object.defineProperty()` method. In the third argument, you should input a object with properties' name of `configurable, enumerable, writable, value`.

```js
let person = {};
Object.defineProperty(person, "name", {
  writable: false,
  value: "lei",
});
console.log(person.name); //"lei"
person.name = "Greg";
console.log(person.name); //"lei"

Object.defineProperty(person, "name", {
  configurable: true,
}); // Error: Cannot redefine property: name
// Error is caused by default value of configurable = false at Object.defineProperty firstly called.
```

#### Accessor Properties

4 attirbutes to describe Accesor Property:

- [[Configurable]] : same as data property.
- [[Enumerable]] : same as data property.
- [[Get]]: by default undefined, function to call when the property is read.
- [[Set]]: by default undefined, function to call when the property is written.

Example of manipulating Accesor Property:

```js
let book = {
  year_: 2017,
  edition: 1,
};

Object.defineProperty(book, "year", {
  get() {
    return this.year_;
  },
  set(newValue) {
    if (newValue > 2017) {
      this.year_ = newValue;
      this.edition += newValue - 2017;
    }
  },
});

book.year = 2018;
console.log(book.edition); // 2
// Don't mess up with year and year_, year_ is a data property, where year is a accessor property.
```

### Defining Multiple Properties

## Object Creation

## Inheritance

## Classes
