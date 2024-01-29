# Chapter 10 Functions

Each function is an instance of the `Function` type. And that instance is also a object.

```js
function sum(num1, num2){
    return num1 + num2;
}
```
What happens here:
- This is a *function-declaration* syntax
- variable sum is defined and initialized to be a function.

1. Function-declaration syntax:

    ```js
    function sum(num1, num2) {
    return num1 + num2;
    }
    ```

2. Function expression syntax:

    ```js
    let sum = function (num1, num2) {
    return num1 + num2;
    };
    ```

3. Another way to create function:

    ```js
    let sum = new Function("num1", "num2", "return num1 + num2");
    ```
    This is not recommended due to the performance, but it's a good way to comprehend that function is an object and function name is just a pointer.

## Arrow Functions

Anywhere a *function-expression* is valid to be used, an arrow function is also valid.

```js
let arrowSum = (a, b) =>{
    return a + b;
}

let functionExpressionSum = function(a, b){
    return a + b;
}

console.log(arrowSum(5, 8));
console.log(functionExpressionSum(5, 8));
```

Valid syntax:

```js
let double = (x) => {
  return 2 * x;
};
let triple = x => {
  return 3 * x;
};
let getRandom = () => {return Math.random();};

let sum = (a, b) => {return a + b;};

let inline = (x) => 3 * x;

let value = {};
let setName = (x) => x.name = "Matt";
setName(value);
console.log(value.name); //Matt

//Invalid syntax
//let multiply = a, b => {return a * b;};
```

- Curly braces is not required in arrow function. 
- Using curly braces is called the *block body* syntax and behaves in the same way as a normal function expression. 
- If curly braces is omitted, it's called *concise body* syntax. And this syntax only allows single line of code. 
- Arrow function does not allow the use of `arguments` `super` or `new.target`, cannot be used as constructor, and does not have a `prototype`.

## Function Names

- Function name is a pointer that points to the function object. So function can have multiple names.
```js
function sum(num1, num2){
    return num1 + num2;
}

console.log(sum(10, 10)); //20

let anotherSum = sum;
console.log(anotherSum(10, 10)); //20

sum = null;
console.log(anotherSum(10, 10)); //20
```

- ECMAScript 6 expose a read-only `name` property that describes the function. This is just identifier or stringified variable name that reference the function. If a function is unnamed, `name` property will be "anonymous"

- If a function is unnamed, then `name` returns a empty string
- If a function is created using the function constructor, it will be identified as "anonymous"

```js
function foo() {}
let bar = function () {};
let baz = () => {};

console.log(foo.name); // foo
console.log(bar.name); // bar
console.log(baz.name); // baz
console.log(new Function().name); // anonymous
```

- There would be prefix of `name` property, if the function initiated with bind or is a getter or setter.

```js
funciton foo(){}

console.log(foo.bind(null).name);// bound foo

let dog = {
  years: 1,
  get age(){
    return this.years;
  }
  set age(newAge){
    this.years = newAge;
  }
}

let propertyDescriptor = Object.getOwnPropertyDescriptor(dog, "age");
console.log(propertyDescriptor.get.name); //get age
console.log(propertyDescriptor.set.name); //set age
```

## Understanding Arguments

- Arguments concept is loosely defined in ECMAScript function. If you define a function with 2 arguments, you can pass in one or three or none number of arguments and interpreter won't complain.

- The arguments itself will be represented as array in function, if you use `function` keyword to define function, which means it's not a arrow function, you can access a `arguments` object to retrieve such array.

- The `arguments` object acts like an array, but it's not an instance of Array type.
    
    ```js
    function sayHi(name, message){
        console.log("Hello" + name + ", " + message);
    }
    //Could be re-written into
    function sayHi(){
        console.log("Hello" + arguments[0] + ", " + arguments[1]);
    }
    ```
- *Named arguments*, like the name and message arguments within syntax`function sayHi(name, message){}`, is not required. And *named arguments* does not create a function signature.

- `arguments` object also has `length` property.
    ```js
    function howManyArgs(){
        console.log(arguments.length);
    }

    howManyArgs("string", 45); //2
    howManyArgs(); //0
    howManyArgs(12); //1
    ```
    ```js
    function doAdd(){
        if(arguments.length === 1){
            return arguments[0] + 10;
        }
        else if(arguments.length === 2){
            return arguments[0] + arguments[1]
        }
    }

    console.log(doAdd(10)); // 20
    console.log(doAdd(30, 20)); // 50
    ```
- `arguments` property can work with *named arguments*
    ```js
    function doAdd(num1, num2){
        if(arguments.length === 1){
            return num1 + 10;
        }
        else if(arguments.length === 2){
            return arguments[0] + num2;
        }
    }

    console.log(doAdd(10)); // 20
    console.log(doAdd(30, 20)); // 50
    ```

    ```js
    function doAdd(num1, num2) {
    arguments[1] = 10;
    console.log(num1 + arguments[1]);
    }

    doAdd(); //NaN
    doAdd(1); // 11
    doAdd(10, 2); // 20
    ```

- `arguments` object always sync with the values of the corresponding named parameters.
    ```js
    function doAdd(num1, num2){
        arguments[1] = 10;
        console.log(arguments[0] + num2);
    }
    ```
- The last point does not mean `arguments[1]` and `num2` both have same memory space. It just means that they are in sync.

- And the effect of syncing only goes in one-way(only sync when you update `arguments` object)

- `use strict` will change the behavior of syncing `arguments` to *named arguments*
    ```js
    function toAdd(num1, num2){
        arguments[1] = 10;
        console.log(num2);
        console.log(arguments[0] + num2);
    }

    toAdd(20, 50);
    // 10
    // 30
    ```
    ```js
    function toAdd(num1, num2){
        arguments[1] = 10;
        console.log(num2);
        console.log(arguments[0] + num2);
    }

    toAdd(20);
    // undefined
    // NaN
    ```
    ```js
    "use strict"
    function toAdd(num1, num2){
        arguments[1] = 10;
        console.log(num2);
        console.log(arguments[0] + num2);
    }

    toAdd(20);
    // undefined
    // NaN
    ```
    ```js
    "use strict"
    function toAdd(num1, num2){
        arguments[1] = 10;
        console.log(num2);
        console.log(arguments[0] + num2);
    }

    toAdd(20, 50);
    // 50
    // 70
    ```


### Arguments in Arrow Functions

_arguments_ property is not allowed in arrow function, and be careful of the scope.

```js
function foo() {
  let bar = () => {
    console.log(arguments[0]);
  }; // arguemnts is the funciton foo's arguments
  bar();
}

foo(5); // 5
```

## No Overloading

Because there's no signatures differentiation, it is impossible to do overloading in ECMAScript. If there were two functions with the same identifier, the latter would win.
```js
function addSomeNumber(num){
    return num + 100;
}

function addSomeNumber(num){
    return num + 200;
}

addSomeNumber(100); //300
```
And to comprehend this, the following two snippet is identical.

```js
function addSomeNumber(num) {
  return num + 100;
}

function addSomeNumber(num) {
  return num + 200;
}
```

```js
let addSomeNumber = function (num) {
  return num + 100;
};
addSomeNumber = function (num) {
  return num + 200;
};
```

## Default Parameter Values

Good samples about `arguments` property and default parameter

```js
function makeKing(name = "Henry"){
    return `King ${name} VIII`;
}

console.log(makeKing("Louis"));//King Louis VIII
console.log(makeKing());//King Henry VIII
```
```js
function makeKing(name = "Henry", numerals = "VIII"){
    return `King ${name} ${numerals}`;
}

console.log(makeKing());//King Henry VIII
console.log(makeKing("Louis"));//King Louis VIII
console.log(makeKing(undefined, "VI"));//King Henry VI
```

- `arguments` property preserves the values as arguments were passed when the function is invoked.
    ```js
    function makeKing(name = "Henry"){
        name = "Lei";
        return `King ${arguments[0]}`;
    }

    console.log(makeKing()); //King Henry
    console.log(makeKing("Louis"));//King Louis
    ```
- Several Interesting snippet
    ```js
    function makeKing(name){
        arguments[0] = "Lei";
        return `King ${name}`;
    }

    console.log(makeKing());
    console.log(makeKing("Louis"));
    //King undefined
    //King Lei
    ```

    ```js
    function makeKing(name = "Henry"){
        arguments[0] = "Lei";
        return `King ${name}`;
    }

    console.log(makeKing());
    console.log(makeKing("Louis"));
    //King Henry
    //King Louis
    ```

    ```js
    "use strict"
    function makeKing(name = "Henry"){
        arguments[0] = "Lei";
        return `King ${name}`;
    }

    console.log(makeKing());
    console.log(makeKing("Louis"));
    //King Henry
    //King Louis
    ```

    ```js
    "use strict"
    function makeKing(name){
        arguments[0] = "Lei";
        return `King ${name}`;
    }

    console.log(makeKing());
    console.log(makeKing("Louis"));
    //King undefined
    //King Louis
    ```
- Default parameter could be calculated before invoking the function.

    ```js
    let romanNumerals = ["I", "II", "III", "IV", "V", "VI"];
    let ordinality = 0;

    function getNumerals() {
        return romanNumerals[ordinality++];
    }

    function makeKing(name="Henry", numerals=getNumerals()){
        return `King ${name} ${numerals}`;
    }

    makeKing(); // King Henry I
    makeKing("Louis", "XVI"); // King Louis XVI
    makeKing(); // King Henry II
    makeKing(); // King Henry III
    ```
The calculated default parameter is only invoked when function itself is invoked without argument is not provided.

### Default Prameter Scope and Temporal Dead Zone

- The following snippets are identical
    ```js
    function makeKing(name="Henry", numerals="VIII"){
        return `King ${name} ${numerals}`;
    }

    console.log(makeKing());//King Henry VIII
    ```
    ```js
    function makeKing(){
        let name = "Henry";
        let numerals = "VIII";

        return `King ${name} ${numerals}`;
    }
    ```
- The later parameter can reference the earlier parameter, and cannot reference the laterer, and cannot reference the variable in body of the function.
    ```js
    function makeKing (name = "Henry", numeral = name){

    }
    //ERROR
    function makeKing1 (name = numeral , numeral = "V"){

    }
    //ERROR
    function makeKing2( name = "Henry", numeral = v){
        let v = "VII":
    }
    ```

## Spread Argument and Rest Parameter

Spread Argument Sample

```js
let values = [1, 2, 3, 4];
function getSum() {
  let sum = 0;
  for (var i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }
  return sum;
}

console.log(getSum(...values)); // 10
console.log(getSum.apply(null, values)); // 10
console.log(getSum(-1, ...values)); // 9
console.log(getSum(...values, 5)); // 15
console.log(getSum(-1, ...values, 5)); // 14
console.log(getSum(...values, ...[5, 6, 7])); // 28
```

Rest Parameter Sample

Rest Parameter is different from arguments

```js
function getSum(...values) {
  console.log(values); // [1,2,3]
  console.log(arguments); // [1,2,3]
}

getSum(1, 2, 3);
```

## Function Declarations versus Function Expressions

Hoisting behavior is different

```js
console.log(f); // content of f()
console.log(express); // ERROR
const express = function () {
  return 20;
};
function f() {
  return 30;
}
```

## Function as Values

Sample of function returns a function

```js
function createComparisonFunction(propertyName) {
  return function (object1, object2) {
    let value1 = object1[propertyName];
    let value2 = object2[propertyName];

    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
}

let data = [
  { name: "Zeck", age: 28 },
  { name: "Lei", age: 36 },
];

data.sort(createComparisonFunction("name"));
console.log(data[0].name); // Lei
data.sort(createComparisonFunction("age"));
console.log(data[0].name); // Zeck
```

## Function Internals

### arguments

when declares function through _function_ keyword, we can use _arguments_ property. There's a property called _callee_ on arguments ponits back to the function itself. So when we implement a recursive function, we can decouple it with _callee_.

```js
function factorial(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * arguments.callee(num - 1);
  }
}

let trueFactorial = factorial;
factorial = function () {
  return 0;
};

console.log(trueFactorial(5)); // 120
console.log(factorial(5)); // 0
```

### this

Good sample of this scope

```js
window.color = "red";
let o = {
  color: "blue",
};

function sayColor() {
  console.log(this.color);
}

sayColor(); // red

o.say = sayColor;
o.say(); // blue

o.sayArrow = () => {
  console.log(this.color);
};
o.sayArrow(); // red
```

Good sample of this to differentiat situation between function and arrow function

```js
function MyKing() {
  this.RoyalName = "Henry";
  setTimeout(function () {
    console.log(this.RoyalName);
  }, 1000);
}

function MyQueen() {
  this.RoyalName = "Mary";
  setTimeout(() => {
    console.log(this.RoyalName);
  }, 1000);
}

new MyKing(); // undefined
new MyQueen(); // Mary
```

### caller

Following sample throw error when running under `"use strict";` (strict mode).

```js
function outer() {
  inner();
}

function inner() {
  console.log(arguments.callee.caller);
}

outer();

console.log(inner);
```

### new.target

If function are executed with _new_ keyword new.target will be the intance of function itself.

```js
function King() {
  console.dir(new.target);
}
new King(); // f King
```

## Function Properties and Methods

1. length - num of named arguments
2. prototype - place for shared methods

### apply vs. call

_apply_ will allow you to pass a arguments object / array of arguments, where _call_ will only allow spread values.

```js
function sum(num1, num2) {
  return num1 + num2;
}
console.log(sum.length); // 2

function applySum(num1, num2) {
  return sum.apply(this, arguments);
}

function callSum(num1, num2) {
  return sum.call(this, num1, num2);
}
```

### bind

bind this to a object and return a new function instance.

```js
let o = {
  color: "blue",
};

function sayColor() {
  console.log(this.color);
}

let objectSayColor = sayColor.bind(o);
objectSayColor(); // blue
```

## Function Expressions

## Recursion

## Tail Call Optimization

## Closures
