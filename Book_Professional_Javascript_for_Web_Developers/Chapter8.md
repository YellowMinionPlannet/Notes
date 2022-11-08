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

When you want to define multiple properties, you can use `Object.defineProperties` instead.

```js
let book = {};
Object.defineProperties(book, {
  year_: {
    value: 2017,
  },
  edition: {
    value: 1,
  },
  year: {
    get() {
      return this.year_;
    },
    set(newValue) {
      if (newValue > 2017) {
        this.year_ = newValue;
        this.edition += newValue - 2017;
      }
    },
  },
});
// the book has year_ configurable and writable and enumerable set to false. this can be proofed by

let descriptors = Object.getOwnPropertyDescriptors(book);

console.log(descriptors);
```

### Reading Property Attributes

We can use `Object.getOwnPropertyDescriptor()` or `Object.getOwnPropertyDescriptors()` to retrieve property descriptor for a given property.

### Merging Objects

Object.assign() will merge object to destination object from src objects. When property with `src.propertyIsEnumerable(), src.hasOwnProperty()` returns true, Object.assign will execute accessor property's get function on src and set function on destination. And merge data property from src to destination as well.

```js
dest = {
  set a(val) {
    console.log(`Invoked dest setter with param ${val}`);
  },
};

src = {
  get a() {
    console.log("Invoked src getter");
    return "foo";
  },
};
console.log(src.propertyIsEnumerable("a")); //true
console.log(src.hasOwnProperty("a")); //true

console.log(Object.getOwnPropertyDescriptors(dest)); //{a : {...}}
console.log(Object.getOwnPropertyDescriptors(src)); //{a: {...}}

Object.assign(dest, src);

console.log(Object.getOwnPropertyDescriptors(dest)); // does not change
console.log(Object.getOwnPropertyDescriptors(src)); // does not change
```

### Object Identity and Equality

use `===` or `Object.is()` to evaluate,
example:

```js
//待补
```

### Enhanced Object Syntax

待补

### Object Destructuring

待补

## Object Creation

We can create object through Object constructor and object literal. But when creating multiple objects with the same interface requires lots of code duplication. Before ES6 classes, constructor functions and prototypal inheritance are used for such cases. It is good to know about these techniques before jump in to classes directly, because classes is just syntactical abstraction for ES5.

### The Factory Pattern

```js
function createPeron(name, age, job) {
  let o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function () {
    console.log(this.name);
  };
  return o;
}

let person1 = createPerson("Lei", 36, "Software Engineer");
```

We can see that factory pattern can solve the code duplication issue, but it will not tell us: what type of returned object is.

### The Function Constructor Pattern

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function () {
    console.log(this.name);
  };
}

let person1 = new Person("Lei", 36, "Software Engineer");
person1.sayName(); //Lei
```

The constructor function pattern will also create a object with different syntax:

- Use of `this` keyword
- There is no `return` in the constructor
- Use of `new` keyword

When use `new` operator, the following will happen:

1. A new object is created in memory
2. The new object's internal [[Prototype]] is assigned to the constructor's `prototype` property
3. `this` value of the constructor is assigned to the new Object
4. Code inside constructor is executed
5. If the constructor returns a non-null value, that value is returned. Otherwise, the new object that was just created is returned.

6. _object is filled with `constructor` property that is pointing back to Person(constructor function)_

#### Constructors as Functions

constructor function is just function, any function called with `new` operator acts as a constructor, and any function called without `new` is just normal function.

```js
let person = new Person("Lei", 36, "Software Engineer");
person.sayName(); // Lei

Person("Greg", 27, "Doctor"); // Adds to window, because this key word is always pointing to Global object(window in browser) by default
window.sayName(); // Greg

let o = new Object();
Person.call(o, "Kristen", 25, "Nurse");
o.sayName(); // Kristen
```

#### Problems with Constructors

## Inheritance

## Classes
