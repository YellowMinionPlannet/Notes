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

- [[Enumerable]] : true/false, by default true, which indicates the property can be iterated by the `for-in` loop when accessing the object where these properites are belonging to.

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
If you don't set the attributes, their value would be false.
You can't change any attributes (except for writable) after you set configurable to false.

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

Object.assign() will merge object to destination object from src objects. When property with `src.propertyIsEnumerable() && src.hasOwnProperty()` returns true, and when the property is accessor property, Object.assign will execute accessor property's get function on src and set function on destination. And merge data property from src to destination as well.

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

#### Property Value Shorthand

```js
//Normal Syntax
let name = "Matt";
let person = {
  name: name,
};
```

```js
//Shorthand Syntax
let name = "Matt";
let person = {
  name,
};
```

Another example

```js
//Normal Syntax
function makePerson(a) {
  return {
    name: a,
  };
}
```

```js
//Shorthand Syntax
function makePerson(name) {
  return {
    name,
  };
}
```

#### Computed Property Keys

To dynamically assign object's property keys.

```js
//Constructor example
const nameKey = "name";
const ageKey = "age";
const jobKey = "job";

let person = {};
person[nameKey] = "Matt";
person[ageKey] = 27;
person[jobKey] = "Developer";
```

```js
//Literal example
const nameKey = "name";
const ageKey = "age";
const jobKey = "job";

let person = {
  [nameKey]: "Matt",
  [ageKey]: 27,
  [jobKey]: "Developer",
};
```

You can even use property keys generator function to generate property keys.

```js
const nameKey = "name";
const ageKey = "age";
const jobKey = "job";
let uniqueToken = 0;

function getUniqueKey(key) {
  return `${key}_${uniqueToken++}`;
}

let person = {
  [getUniqueKey(nameKey)]: "Matt",
  [getUniqueKey(ageKey)]: 27,
  [getUniqueKey(jobKey)]: "Developer",
};

console.log(person);
```

#### Concise Method Syntax

```js
//Normal Syntax
let person = {
  sayName: function (name) {
    console.log(`My name is ${name}`);
  },
};
```

```js
//Concise Sytax
let person = {
  sayName(name) {
    console.log(`My name is ${name}`);
  },
};
```

> Review:
>
> - Function expressions: `const square = function(number) {return number * number;}`
> - Function declarations: `function square(number) {return number * number;}`

### Object Destructuring

Two equivalent code snippets:

```js
//Snippet 1
let person = {
  name: "Matt",
  age: 27,
};

let personName = person.name;
let personAge = person.age;
console.log(personName); // Matt
console.log(personAge); // 27
```

```js
//Snippet 2
let person = {
  name: "Matt",
  age: 27,
};

let { name: personName, age: personAge } = person;
console.log(personName); // Matt
console.log(personAge); // 27

let { name, age } = person;
console.log(name);
console.log(age);
```

#### Nested Object Destructuring

```js
let person = {
  name: "Matt",
  age: 27,
  job: {
    title: "Software Engineer",
  },
};

let {
  job: { title },
} = person; // declares a variable title and assign person.job.title.
console.log(title);
```

#### Parameter Context Matching(Destructuring within Parameter List of Function)

```js
let person = {
  name: "Matt",
  age: 27,
};

function printPerson(foo, { name, age }, bar) {
  console.log(arguments);
  console.log(name, age);
}

function printPerson2(foo, { name: personName, age: personAge }, bar) {
  console.log(arguments);
  console.log(personName, personAge);
}
```

### Rest Operator

When destructuring from an object, you can partially destructure an object into some specific variables and "the rest", which represented using `...`

```js
const person = { name: "Matt", age: 27, job: "Engineer" };
const { name, ...restData } = person;
console.log(name); // Matt
console.log(restData); // {age: 27, job: "Engineer"}
```

Rest operator works for nested destructuring, and will create shallow copy of "the rest", and also copy symbols.

### Spread Operator

When do a object literal, you can destructuring a object's properties using `...`

```js
const s = Symbol();
const foo = { a: 1 };
const bar = { [s]: 2 };
const foobar = { ...foo, c: 3, ...bar };

console.log(foobar); // {a: 1, c: 3, Symbol(): 2}
```

Spread Operator Rules:

1. Order will be same as spreaded object's literal syntax
2. When encounter duplicates, later property overwrites previous.

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

```js
//Function declaration is used here, Function expression also works in the same way.
let Person = function (name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function () {
    console.log(this.name);
  };
};

let person1 = new Person("Alice", 29, "Software Engineer");

//Followings are all TRUE
console.log(person1.__proto__ === Person.prototype);
console.log(person1.__proto__.constructor === Person);
console.log(person1.__proto__.constructor.prototype === person1.__proto__);

console.log(Object.getOwnPropertyDescriptors(Person.prototype)); // {constructor: {wriatble: true, enumerable: false, configurable: true, value: function(){...}}}

console.log(person1.__proto__.constructor === Person.prototype.constructor);
console.log(Person.prototype.constructor === Person);

console.log({}.__proto__.constructor === Object);

console.log((() => {}).__proto__.constructor === Function);

console.log(Object.__proto__.constructor === Function);
console.log(Person.__proto__.constructor === Function);
```

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

`instanceof` return true if a Function(Constructor function)'s prototype appears in its prototype chain.
`isPrototypeOf` returns true if the targeted object's prototype chain contains the current object that use this method.

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

### Class Definition Basics

There are two types of syntax for class.

```js
// class declaration
class Person{}

// class expression
const Animal = class{};
```

However, class declarations are not hoisted. (Function declarations are hoisted, which means the syntax will be "moved" to the top of the file).

### Class Composition

A class can include
1. constructor method
2. instance method
3. getters
4. setters
5. static class method

Empty class is accepted, and everything inside a class is in strict mode.

### The Class Constructor

Use `constructor` keyword to define a constructor method in class. If we don't define a constructor method, it is equivalent to define a empty constructor method in a class.

#### Instantiation

The instantiation process is identical to the function constructor, but using `new`` with a class will tell interpretor to use constructor function within the class to initiate a new instance.

Call `constructor` method with new will do:
1. A new object is crerated in memory.
2. The new object's internal __proto__ object will point to the prototype property of constructor.
3. The `this` value of the constructor is assigned to the new object.
4. Code inside constructor is executed
5. The constructor return the new object, or if the constructor defines what to return, then return the defined object.

If we define what to return in constructor, then the new object created in memory of Step 1 will be discarded.

#### Understanding Classes as Special Functions

The class identifier will be identifies as a function after declaration.

```js
class Person{}

console.log(typeof Person);//function
```

`instanceof` test if the instance's prototype chain has the targeted constructor's prototype.

```js
class Person{}

let p = new Person();

console.log(p instanceof Person);// true
```

There's something special about constructor method in class. If you create instance through constructor method but not class. Following will happen:

```js
class Person{}

let p1 = new Person();

console.log(p1.constructor === Person); //true
console.log(p1 instanceof Person); //true
console.log(p1 instanceof Person.constructor);// false

let p2 = new Person.constructor();

console.log(p2.constructor === Person); //false
console.log(p2 instanceof === Person); // false
console.log(p2 instanceof Person.constructor); //true
```

Classes are __first-class__ citizens in JS, which means they can be passed arround as you would any other object or function references.

```js
//first-class citizen
let classList = [
    class{
        constructor(id){
            this.id_ = id;
            console.log("instance ${this.id_}");
        }
    }
]

function createInstance(classDefinition, id){
    return new classDefinition(id);
}

let foo = createInstance(classList[0], 3141);



let p = new class Foo{
    constructor(x){
        console.log(x);
    }
}("bar") //bar

```

### Instance Prototype and Class Member

#### Instance Members
```js
class Person{
    constructor(){
        this.name = "Lei";
    }
}

const p1 = new Person();
console.log(p1); // { name: "Lei" }
```

#### Class Field Declarations

```js
class PersonWithClassFields{
    friendCount = 12;
    constructor(){
        console.log(this.friendCount); // 12
    }
}

let p1 = new PersonWithClassFields();
let p2 = new PersonWithClassFields();
p1.friendCount = 1;
console.log(p2); // { friendCount: 12}
console.log(p1); // { friendCount: 1}
```

#### Prototype Methods and Accessors

So method defined in class body will be on Class's prototype, but member data (primitives/object references) will be on instance.

> Remember, we can use Object.prototype.hasOwnProperty() to verify if the method/property is on instance or is on prototype.

```js
class PersonWithClassFields{
    friendCount = 12;
    local(){
        console.log("Hello Kitty");
    }
    constructor(){
        console.log(this.__proto__.friendCount);
        console.log(this.__proto__.local);
    }
}

let p1 = new PersonWithClassFields();
// undefined
// local(){console.log("Hello Kitty")}
let p2 = new PersonWithClassFields();
p1.friendCount = 1;
console.log(p2);
console.log(p1);
```

```js
class Person{
    constructor(){
      this.name_ = "Lei";
    }
    set name(newName){
        this.name_ = newName;
    }

    get name(){
        return this.name_;
    }
}

const p = new Person();
console.log(p.hasOwnProperty("name"));//false
console.log(p.hasOwnProperty("name_"));//true

console.log(Object.getOwnPropertyDescriptor(Person.prototype, "name")); //[...accessor description...]]
console.log(Object.getOwnPropertyDescriptor(p, "name"));//undefined
```
#### Private Class Members

Use `#` prefix to declare private property.        
```js
class Person{
    #name = "Alice";
    age = 30;
    
    getName(){
        return this.#name;
    }
}

const person = new Person();
console.log(person.age); //30
console.log(person.getName()); //Alice
console.log(person.#name); // SyntaxErorr
console.log(person['age']); //30
console.log(person['#name']); // undefined
```

Special behavior of private property at compile-time.

- Private members are only accessible within the class.
- Private members are not inherited by subclasses.
- Private members cannot be accessed or overridden by methods/properties with the same name in derived classes.
- Constructors cannot be private
- Private member can only be declared in body.

#### Static Class Methods and Accessors
- It is used by syntax `ClassName.StaticMethodName`.
- It is only created once per class, which is same as prototype member.
- In side static member, `this` refers to the class itself.
- Usually it is intended to be used not centered on a specific instance.

```js
class Person{
    //defined on the class
    static species = "sapiens";

    constructor(){
        // Defined on each individual instance
        this.locate = () +> console.log("instance", this);
    }

    //Defined on prototype
    locate(){
        console.log("prototype", this);
    }
    static locate(){
        console.log("class", this);
    }
}

let p = new Person();
console.log(Person.species);//sapiens

p.locate(); // instance
Person.prototype.locate() // prototype
person.local() // class
```

Static class methods can be useful as instance factories:

```js
class Person{
    constructor(age){
        this.age_ = age;
    }

    sayAge(){
        console.log(this.age_);
    }
    static create(){
        return new Person(Math.floor(Math.random() * 100));
    }
}

console.log(Person.create());
```

#### Static Initialization Blocks

To initialize static members, we can write *static initialization blocks*.

```js
class Person{
    static name = "Alice";
    static age;
    static{
        this.age = 30; // this refers to the class as mentioned before
    }
}
```

- Any number of blocks can be used in one class, and execution order follows the order of appearance.
- The blocks must be evaluated synchronously.
- The block scope is normal lexical scope.
- `this` refers to the constructor object of the class.

> lexical scope concept is related to function calling stack chain, it's about which variable should be used within a nested function if there's variable with the same name in outer context. 

#### Iterator and Generator Methods

> need to skip this part, will be back after studying Chapter 7.

### Class Inheritance

#### Inheritance Basics

- ECMAScript uses single inheritance, which means one class can only extends one parent class.

- You can inherit anything as long as it has constructor property and constructor has a prototype.

```js
function Person(){

}

class Engineer extends Person{}

let e = new Engineer();
console.log(e instanceof Engineer);//true
console.log(e instanceof Person);//true

```

The `extends` keyword will have effect on both prototype and static(class) members.

```js
class Vehicle{
    identifyPrototype(id){
        console.log(id, this);
    }
    static identifyClass(id){
        console.log(id, this);
    }
}

class Bus extends Vehicle{
}

let y = new Vehicle();
let b = new Bus();

b.identifyPrototype('bus') // bus, Bus{}
y.identifyPrototype('vehicle')// vehicle, vehicle{}

Bus.identifyClass('bus')// bus, class Bus{}
Vehicle.identifyClass('vehicle')// vehicle, class Vehicle{}
```

#### Constructors, HomeObjects, and super()

The derived class methods (constructor method and static method) can reference their parent class prototype through `super` keyword.

```js
class Person{
   static teach(){
    console.log("teaching now...");
  }
}

class Teacher extends Person{
  constructor(){
    super();
    super.teach();
  }
  static testSuper(){
    console.log(super['constructor']); // Function
    console.log(super['teach']) // undefined
  }
}

const teacher = new Teacher(); // teaching now...
```

```js
class Person{
   static teach(){
    console.log("teaching now...");
  }
}

class Teacher extends Person{
  constructor(){
    super();
  }
  static testSuper(){
    console.log(super['constructor']); // Function
    super['teach'](); //teaching now...
  }
}

const teacher = new Teacher();

Teacher.testSuper();
```

Several Notes about `super` keyword:
- `super` keyword cannot be referenced by itself, which means you can do `super()` or `super['propertyName']` or `super.propertyName`.
- `super()` will invoke the parent class constructor and assign resulting instance to `this`
    ```js
    class Bus extends Vehicle{
        constructor(){
            super();
            console.log(this instanceof Vehicle);
        }
    }

    new Bus(); // true
    ```
- If you decline to define a constructor function in derived class, `super()` will be implicitly invoked and all arguments passed to the derived class constructor will be passed to parent constructor(super).
    ```js
    class Vehicle{
        constructor(licensePlate){
            this.licensePlate = licensePlate;
        }
    }

    class Bus extends Vehicle{}

    console.log(new Bus('1337H4X')); // Bus {licensePlate: '1337H4X'}
    ```
- You cannot reference `this` keyword in constructor before invoking `super()`.
    ```js
    class Vehicle{}
    class Bus extends Vehicle{
        constructor(){
            console.log(this); // ERROR
        }
    }
    ```
- If derived class explicitly define a constructor, you must either invoke `super()` or return an object from the constructor.
    ```js
    class Vehicle{}
    class Car extends Vehicle{}
    class Bus extends Vehicle{
        constructor(){
            super();
        }
    }
    class Van extends Vehicle{
        construtor(){
            return {};
        }
    }
    ```

#### Abstract Base Classes

`new` keyword can be used as `new.target` to check what is the conjuction used with `new` keyword. This is very useful when you want to create a *abstract base class* which is not explicitly supported by ECMAScript.

```js
//This is a Abstract Base Class
class Vehicle{
    constructor(){
        console.log(new.target);
        if(new.target === Vehicle){
            throw new Error("Vehicle cannot be directly instantiated");
        }
    }
}

class Bus extends Vehicle{}

new Bus();
new Vehicle();// Error
```

`this` keyword can also be used in parent class constructor to check if the derived class's prototype contains particular member. That's because prototype exists before constructor is invoked.

```js
//Abstract Base Class
class Vehicle{
    constructor(){
        if(new.target === Vehicle){
            throw new Error("Vehicle cannot be directly instantiated");
        }

        if(!this.foo){
            throw new Error("Inheriting class must define foo");
        }
        console.log("success!");
    }
}

class Bus extends Vehicle{
    foo(){}
}

class Van extends Vehicle{}

new Bus(); // success
new Van(); // Error: Inheriting class must define foo
```

#### Inheriting from Built-In Types

```js
class SuperArray extends Array{
    shuffle(){
        for(let i = this.length - 1; i > 0; i-- ){
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }
}

let a = new SuperArray(1, 2, 3, 4, 5);

console.log(a instanceof Array); // true
console.log(a instanceof SuperArray); // true

console.log(a); // [1,2,3,4,5]
a.shuffle();
console.log(a); // [3, 1, 4, 5, 2]
```

Some built-in types have methods defined in which a new object instance is returned. By default, the type of this object instance will match the type of the original instance.

```js
class SuperArray extends Array{}

let a1 = new SuperArray(1, 2,3,4, 5);
let a2 = a1.filter(x => !!(x%2));

console.log(a1); // [1,2,3,4,5]
console.log(a2); // [1,3,5]
console.log(a1 instanceof SuperArray);//true
console.log(a2 instanceof SuperArray);//true
```

Unless you override `Symbol.species` accessor.

```js
class SuperArray extends Array{
    static get [Symbol.species](){
        return Array;
    }
}

let a1 = new SuperArray(1,2,3,4,5);
let a2 = a1.filter(x => !!(x%2));

console.log(a1);
consoel.log(a2);
console.log(a1 instanceof SuperArray);
console.log(a2 instanceof SuperArray);//false
```

#### Class Mixins

One common scenario is to bundle behavior from several different classes into a single class.

```js
class Vehicle{}

let FooMixin = (SuperClass) => class extends SuperClass{
    foo(){
        console.log("foo");
    }
}
let BarMixin = (SuperClass) => class extends SuperClass{
    bar(){
        console.log("bar");
    }
}
let BazMixin = (SuperClass) => class extends SuperClass{
    baz(){
        console.log("baz");
    }
}

class Bus extends FooMixin(BarMixin(BazMixin(Vehicle))) {};

let b = new Bus();
b.foo();
b.bar();
b.baz();
```

This could be flattened.

```js
class Vehicle{}

let FooMixin = (SuperClass) => class extends SuperClass{
    foo(){
        console.log("foo");
    }
}
let BarMixin = (SuperClass) => class extends SuperClass{
    bar(){
        console.log("bar");
    }
}
let BazMixin = (SuperClass) => class extends SuperClass{
    baz(){
        console.log("baz");
    }
}

function mix(BaseClass, ...Mixins){
    return Mixins.reduce((accumulator, current)=> current(accumulator), BaseClass);
}

class Bus extends mix(Vehicle, FooMixin, BarMixin, BazMixin){}

let b = new Bus();
b.foo();
b.bar();
b.baz();
```