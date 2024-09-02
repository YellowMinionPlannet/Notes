# 4 Variables, Scope, and Memory

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
*Execution context*, also called *context*, defines what data a variable/ function has access to. 

> It has an associated *variable object*, *scope chain*, upon which all of its defined variables and functions exist. This object is not accessible by code but is used behind the scenes to handle data.

The *global execution context* is the outermost one. Its form depends on the host environment. In web browsers, it is the *window* object. All variables and functions defined with `var` keyword are created as properties and methods on the `window` object. `let` and `const` at top level are not defined in the global context.

If all the code are executed, its context is destroyed.

To the next level, each function call has its own execution context. When function is called, the function's context is pushed onto the *context stack*. After function finished executing, the stack is popped, return control to the previous context.

When code is executed in acontext, a *scope chain* variable objects is created. This object provides ordered access to all the variables and functions that current context has access to. At the front, it is always the variable object of the current context.

If the context is a function, then *activation object* is used as the variable object. It starts with a single defined variable called `arguments`. The next variable object in chain is from the function's containing context, until reaching the global context.

```js
var color = "blue";

function changeColor(){
    let anotherColor = "red";

    function swapColors(){
        let tempColor = anotherColor;
        anotherColor = color;
        color = tempColor;
    }

    swapColors();
}

changeColor();
console.log(color);// red
```

### Scope Chain Augmentation
There are some keywords will add more "layer" to the scope chain, `with` and `catch`.

`with` will add a specific variable object to the front of scope chain.
`catch` will add a new variable object, which contains a declaration for the thrown error object, to the front of scope chain.

```js
function buildUrl(){
    let qs = "?debug=true";

    with(location){
        let url = href + qs;
    }

    return url;
}
```

- `buildUrl` has its own activation object which contains one variable `qs`, its next level is global context.
- `with` statement adds `location`'s variable object to the front of `buildUrl`.
- `url` is declared within `with` statement but is part of the `buildUrl` function's context, which can be returned as result.

### Variable Declaration
We have `var` `let` and `const`, this part introduces these complexities.

#### Function Scope Declaration Using `var`
When a variable is declared with `var`, it is added to the most immediate context available. In function, it is added to the function, in `with` statement, it is added to the function context.

If a variable is undeclared, it gets added to the global context.
```js
function add(num1, num2){
    var sum = num1 + num2;
    return sum;
}

let result = add(10, 20);
console.log(sum);//ERROR
```

If we change a little bit:
```js
function add(num1, num2){
    sum = num1 + num2;
    return sum;
}

let result = add(10, 20);
console.log(sum);//30
```

`var` also hoist the variable to the top of most front context. These snippets will prove this.
```js
console.log(name); //undefined
var name = "Jake";

function(){
    console.log(name); //undefined, this is the local name inside current function, but not the name in global.
    var name = "Jake";
}
```

#### Block Scope Declaration Using `let`
If declared with `let`, the variable will be on the nearest set of enclosing curly braces `{}`. For example, these curly braces could be:
- `if` block
- `while` block

```js
if(true){
    let a;
}
console.log(a);//ERROR

while(true){
    let b;
}
console.log(b);//ERROR

function foo(){
    let c;
}
console.log(c);//ERROR

{
    let d;
}
console.log(d);//ERROR
```

Difference between `var` and `let`:
```js
var a;
var a;//No ERROR

{
    let b;
    let b;
}//Syntax ERROR

for(var i = 0; i < 10; ++i){}
console.log(i);//10

for(let j = 0; j < 10; ++j){}
console.log(j);//ERROR not defined
```

#### Constant Declaration Using `const`
```js
const a;

const b = 3;
console.log(b);// 3
b = 4; // ERROR
```

```js
const o1 = {};
o1 = {}; //ERROR

const o2 = {};
o2.name = "Jake"; // CORRECT Syntax
```

So if you want to make an object immutable, you can use `Object.freeze()`
```js
const o3 = Object.freeze({});
o3.name = "Jake"
console.log(o3.name);//undefined
```

#### Identifier Lookup
```js
var color = "blue";

function getColor(){
    return color;
}

console.log(getColor()); //blue

function getColor2(){
    let color = "red";
    return color;
}

console.log(getColor2()); //red

function getColor3(){
    let color = "red";
    {
        let color = "green";
        return color;
    }
}

console.log(getColor3()); //green
```

## Garbage Collection

*Mark-and-Sweep* and *Reference Counting* are traditionally been used in browsers.

### Mark-and-Sweep
- First, mark all variables.
- Second, mark-off those are in context and referenced by in-context variables. 
- Finally, the rest are targets to delete.

### Reference Counting
- Every value(memory) keeps track of the references.
- When reference goes to 0, it is good to delete.

Problem with this is *circular reference*.
```js
function problem(){
    let objectA = new Object();
    let objectB = new Object();
    
    objectA.someOtherObject = objectB;
    objectB.anotherObject = objectA;
}
```

### Performance
### Managing Memory

Remember to *dereference* variable as long as they are out of context by setting its value to `null`. This does not make sure the garbage collection happens, but will make sure when next time GC happens, the dereferenced variable will be reclaimed.

```js
function createPerson(name){
    let localPerson = new Object();
    localPerson.name = name;
    return localPerson;
}

let globalPerson = createPerson('Nicholas');

globalPerson = null;//dereference
```

#### Performance Boosts with `const` and `let` Declarations
#### Hidden Classes and the `delete` Operation

#### Memory Leaks
Two snippet that have Memory Leak
```js
let name = 'Jake';
setInterval(() => {console.log(name)}, 100);
```

```js
let outer = function(){
    let name = 'Jake';
    return function(){
        return name;
    }
}
```