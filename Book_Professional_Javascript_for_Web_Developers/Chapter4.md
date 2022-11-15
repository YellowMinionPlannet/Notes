# Chapter 4 Variables, Scope, and Memory

## Primitive and Reference Values

1. Primitive - Undefined, Null, Boolean, Number, String, Symbol
2. Reference

### Dynamic Properties

Initiation of a primitive type can be achieved using only the primitive literal form. If you create primitive type using new keyword, you are creating a Object.

```js
let name = "Nicholas";
name.age = 27;
console.log(name.age):// undefined

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

value variable is copied by value, where reference variable is copied by reference.

```js
let obj1 = new Object();
let obj2 = obj1;
obj1.name = "Nicholas";
console.log(obj2.name); // "Nicholas"
```

### Argument Passing

Function's arguments are passed by value. Primitives are copied by value, references are copied by reference value.

### Determining Type

_typeof_ operator can best determine if variable is string, number, boolean or undefined. It returns object if variable is null / object.

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

Each context has an associated object variable and it is not acessible by code.

Refer to Jonas Javascript Notes of **Execution Contexts and Call Stacks** for this part.
