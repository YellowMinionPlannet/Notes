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

The function is an object in javascript. When we create object with Constructor Function like previously stated, every object will have a new function object.

```js
console.log(person1.sayName === person2.sayName); // false
```

And this is why we introduce Prototype Pattern

### The Prototype Pattern

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
}

Person.prototype.sayName = function () {
  console.log(this.name);
};

let person1 = new Person("Lei", 36, "Software Engineer");
let person2 = new Person("Greg", 27, "Doctor");
person1.sayName();
person2.sayName();
console.log(person1.sayName === person2.sayName); // true
```

#### How Prototypes Work

![prototype.jpg](prototype.jpg?raw=true)

There are two prototype related methods.

```js
console.log(Person.prototype.isPrototypeOf(person1)); //true

console.log(Object.getPrototypeOf(person1) === Person.prototype); // true
```

```js
let biped = {
  numLegs: 2,
};

let person = {
  name: "Matt",
};

console.dir(biped);
console.dir(person);

Object.setPrototypeOf(person, biped); // Will substitute person._proto_ to biped. so that person.numLegs will be accessible.
console.log(person.numLegs); // 2
console.dir(person);
```

#### Understanding the Prototype Hierarchy

Instance Property with the same name will mask Property on Prototype. We can use `delete` keyword to delete instance property, and `getOwnPropertyDescriptor` to display Instance Property. `getOwnPropertyDescriptor` also can work with prototype object to retrieve Prototype Property.

```js
function Person() {}

Person.prototype.name = "Nicholas";
Person.prototype.sayName = function () {
  console.log(this.name);
};

let person1 = new Person();
let person2 = new Person();
person1.name = "Lei";
console.log(person1.name); //Lei
console.log(person2.name); // Nicholas

console.log(person1.hasOwnProperty("name")); // true
console.log(person2.hasOwnProperty("name")); // false

console.log(Object.getOwnPropertyDescriptor(person1, "name"));

delete person1.name;

console.log(person1.name); // Nicholas
console.log(person1.hasOwnProperty("name")); // false

console.log(Object.getOwnPropertyDescriptor(person1, "name")); // undefined
console.log(Object.getOwnPropertyDescriptor(person1.__proto__, "name"));

delete person1.name;

console.log(person1.name); // Nicholas
console.log(person1.hasOwnProperty("name")); // false
```

#### Prototypes and the "in" Operator

There are two ways of using `in` operator.

##### `in` on self

```js
function Person() {}

Person.prototype.name = "Nicholas";
Person.prototype.sayName = function () {
  console.log(this.name);
};

let person1 = new Person();
let person2 = new Person();

person1.name = "Lei";

console.log("name" in person1); // true
console.log("name" in person2); // true

delete person1.__proto__.name;
console.log("name" in person1); // true
console.log("name" in person2); // false
```

For this way, if property key is accessible(both on instance / prototype), the result will return true.

##### `in` with `for-in`

`for-in` will retrieve all accessible properties(both instance or prototype) that is enumerable.
`Object.keys()` will retrieve all enumerable instance properties.
`Object.getOwnPropertyNames` will retrieve instance properties whether enumerable or not.

#### Property Enumeration Order

`for-in` loop and `Object.keys()` Does not have an order.
`Object.getOwnPropertyNames()` has an order:

1. first comes with number keys
2. then comes with string and _symbol_ keys with insertion order

```js
let o = {
  1: 1,
  first: "first",
  second: "second",
  0: 0,
};
o[3] = 3;
o.third = "third";

console.log(Object.getOwnPropertyNames()); // ["0", "1", "3", "first", "second", "third" ]
```

### Object Iteration

An interesting example of constructor's prototype

```js
function Person() {}

let friend = new Person(); // refer to the begining of this topic(Prototype pattern), when new is used, it create a new object, and assign this friend's __proto__ to Person's prototype.

//here, we asign a new object to Person's prototype.
Person.prototype = {
  constructor: Person,
  name: "Nicholas",
  age: 29,
  job: "Software Engineer",
  sayName() {
    console.log(this.name);
  },
};

friend.sayName(); // error, because friend still point to the old Person's prototype.
```

## Inheritance

There are two types of inheritance,

1. interface inheritance - where only the method signatures are inherited
2. implementation inheritance - where actual methods are inherited

ECMAScript can achieve implementation inheritance through prototype chaining.

### Prototype Chaining

Main Idea: We assign instance's constructor's prototype to a new type.

```js
function SuperType() {
  this.property = true;
}

SuperType.prototype.getSuperTypeValue = function () {
  return this.property;
};

function SubType() {
  this.subProperty = false;
}

SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function () {
  return this.subProperty;
};

let instance = new SubType();
console.log(instance.getSuperValue()); // true
```

![Prototype_Chaining.jpg](prototypechaining.jpg)

So, when we call `instance.getSuperValue()`

1. we first find if instance properties of SubType include it? NO.
2. we then try to find the [[Prototype]] of SubType instance include it? Where [[Prototype]] of SubType instance is pointing to the prototype property of SubType constructor. That is an instance of SuperType + `getSubValue` function. And NO.
3. we then try to find the [[Prototype]] of SubType's prototype property, which is [[Prototype]] of SuperType instance which point to the SuperType function's prototype property. And here we find that function name. Yeah!!!

#### Default Prototypes

Remember any function's default prototype is an intance of Object.
Here is a self example about prototype chaining to the end of the world.

```js
function SuperType() {}

function SubType() {}

// Object.prototype.getSuperValue = function (){
//   console.log("YOU WIN!!!");
// }

SubType.prototype = new SuperType();

let instance = new SubType();

// instance.getSuperValue();
console.dir(instance);
console.log(Object.getOwnPropertyNames(instance)); // SubType instance's instance property
console.log(Object.getOwnPropertyNames(instance.__proto__)); // SubType instance's [[Prototype]] =>  SubType.prototype => instance of SuperType
console.log(Object.getOwnPropertyNames(instance.__proto__.__proto__)); //SuperType instance's [[Prototype]] => SuperType.prototype => instance of Object
console.log(Object.getOwnPropertyNames(instance.__proto__.__proto__.__proto__)); // Object instance's [[Prototype]] => Object.prototype
console.log(
  Object.getOwnPropertyNames(instance.__proto__.__proto__.__proto__.__proto__)
); // Object.prototype's __proto__ => null
```

- Remember that prototype chaining end at Object.prototype and browser gives us mistereous results after that...
- Remember that instance of function and instance created by function are different things.
  1. Instance of function's [[Prototype]] point to Function.prototype,
  2. Function.prototype's [[Prototype]] is also a Object.prototype. Since Function is also inherited from Object.

#### Prototype and Instance Relationships

`instanceof` return true if a Function(Constructor function) appears in its prototype chain.
`isPrototypeOf` returns true if the prototype appears in the chain.

```js
console.log(instance instanceof Object); //true
console.log(instance instanceof SuperType); //true
console.log(instance instanceof SubType); //true

console.log(Object.prototype.isPrototypeOf(instance)); //true
console.log(SuperType.prototype.isPrototypeOf(instance)); //true
console.log(SubType.prototype.isPrototypeOf(instance)); //true
```

#### Problems with Prototype Chaining

Consider a sample here

```js
function SuperType() {
  this.colors = ["red", "blue", "green"];
}
function SubType() {}
SubType.prototype = new SuperType();
let instance1 = new SubType();
instance1.colors.push("black");

let instance2 = new SubType();
console.log(instance2.colors); // red blue green black
```

1. Although colors is a instance property in SuperType, but as SubType inherits SuperType as prototype, it shares colors among all instances of SubType.
2. There's no way of calling SuperType constructor with arguments when initialize SubType.

So, Prototype chaining is not used in these cases. New Technique is ahead!!!

### Constructor Stealing

```js
function SuperType() {
  this.colors = ["red", "blue", "green"];
}
function SubType() {
  SuperType.call(this); //important!
}

let instance1 = new SubType();
instance1.colors.push("black");

let instance2 = new SubType();
console.log(instance2.colors); // red blue green
```

Problem solved!

#### Problem with Constructor Stealing

1. Function will not be shared, since it's only instance property
2. Property on Prototype of SuperType never get a chance to be inherited

### Combination Inheritance

```js
function SuperType(name) {
  this.name = name;
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}

SubType.prototype = new SuperType();
SubType.prototype.sayAge = function () {
  console.log(this.age);
};

let instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
instance1.sayName(); //Nicholas
instance1.sayAge(); //29

let instance2 = new SubType("Greg", 27);
console.log(instance2.colors); //red blue green
instance2.sayName(); //Greg
instance2.sayAge(); //27
```

### Prototypal Inheritance

This method is same as `Object.create()` method.

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

let person = {
  name: "Greg",
  age: 27,
  friends: ["Lei", "Qin"],
};

let newPerson = object(person);
newPerson.friends.push("Rob");
newPerson.name = "Qiu";

let anotherPerson = Object.create(person);
console.log(anotherPerson.name); //Greg, not Qiu because name is not a reference value
console.log(anotherPerson.friends); // Lei Qin Rob
```

#### Parasitic Inheritance

待做

#### Parasitic Combination Inheritance

待做

## Classes

伪代码：

```
instance.__proto__ === constructor.prototype
constructor.prototype.__proto === super.prototype
```
