# Chapter 4 Variables, Scope, and Memory

In JavaScript, variable is loosely typed, a vairable is just name for a particular value at a particular time. A variable's value and data type can change during the lifetime of a script.

## Primitive and Reference Values

1. Primitive - Undefined, Null, Boolean, Number, String, Symbol
2. Reference - objects stored in memory.

Primitive variables are said to be accessed by value, which means you are manipulating the actual value stored in memory.

Reference variables are said to be accessed by reference, because you are not directly manipulate the object stored in memory, but are working on a reference to that object.

### Dynamic Properties
Only reference values can have properties deined dynamically for later use.

```js
let name = "Nicholas";
name.age = 27;
console.log(name.age):// undefined
```

Using `new` keyword is to create an object.

```js
let name1 = "Nicholas";
let name2 = new String("Matt");
name1.age = 27;
name2.age = 26;
console.log(name1.age); // undefined
console.log(name2.age); // 26

console.log(typeof name1); // string
console.log(typeof name2); // Object
```

### Copying Values

Primitive variable is copied by value, where reference variable is copied by reference.

```js
let obj1 = new Object();
let obj2 = obj1;
obj1.name = "Nicholas";
console.log(obj2.name); // "Nicholas"
```

### Argument Passing

Function's arguments are passed by value. Primitives are copied by value, references are copied by reference value(location of memory).

```js
function setName(obj){
    obj.name = "Nicholas"
    obj = new Object();
    obj.name = "Greg";
}

let person = new Object();
setName(person);
console.log(person.name); // "Nicholas"
```

### Determining Type

`typeof` operator can best determine if variable is string, number, boolean or undefined. It returns object if variable is null / object.

```js
let s = "Nicholas";
let b = true;
let i = 22;
let u;
let n = null;
let o = new Object();

console.log(typeof s); // string
console.log(typeof b); // boolean
console.log(typeof i); // Number
console.log(typeof u); // undefined
console.log(typeof n); // object
console.log(typeof o); // object
```

## Execution Context and Scope


