# Chapter 10 Functions

Function-declaration syntax:

```js
function sum(num1, num2) {
  return num1 + num2;
}
```

Function expression syntax:

```js
let sum = function (num1, num2) {
  return num1 + num2;
};
```

Another way to create function:

```js
let sum = new Function("num1", "num2", "return num1 + num2");
```

## Arrow Functions

Valid syntax:

```js
let double = (x) => {
  return 2 * x;
};
let triple = (x) => {
  return 3 * x;
};
let quadruple = (x) => 4 * x;
```

_arrow function does not allow use of argument super or new.target, cannot be used as constructor, and does not have a prototype_

## Function Names

Function name is a pointer point to the function object.

ECMAScript 6 expose a read-only _name_ property that describes the function. If a function is unnamed _name_ property will be "anonymous"

```js
function sum(num1, num2) {
  return num1 + num2;
}

let anotherSum = sum;
sum = null;
console.log(anotherSum(10, 10)); // 20

function foo() {}
let bar = function () {};
let baz = () => {};

console.log(foo.name); // foo
console.log(bar.name); // bar
console.log(baz.name); // baz
console.log(new Function().name); // anonymous
```

There would be prefix of _name_ property, if the function initiated with bind or is a getter or setter.

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

Inside funtion you can use _arguments_ property to manipulate arguments that passed in the function. _arguments_ keeps in sync with the named arguments, however, this _arguments_ are different from the named arguments(actual arguments that passed in). Change in named arguments will not affect values in _arguments_ property.

```js
function doAdd(num1, num2) {
  arguments[1] = 10;
  console.log(num1 + arguments[1]);
}

doAdd(); //NaN
doAdd(1); // 11
doAdd(10, 2); // 20
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

Because the arguments is just array, so there's no signatures differentiation.
The upper case is no different that the later:

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

Good sample about _argument_ property and default parameter

```js
function makeKing(name = "Henry") {
  name = "Louis";
  console.log(`King ${arguments[0]}`);
}

makeKing(); // King undefined
makeKing("Humuhumunukunukuapuaa"); // King Humuhumunukunukuapuaa
makeKing("Henry"); // King Henry
```

Good sample about arrow function and default parameter

```js
let numeral = ["I", "II", "III", "IV", "V"];
let order = 0;

function getNumeral() {
  return numeral[order++];
}

const makeKing = (name = "Henry", numeral = getNumeral()) => {
  console.log(`King ${name} ${numeral}`);
};

makeKing(); // King Henry I
makeKing("Humuhumunukunukuapuaa"); // King Humuhumunukunukuapuaa II
makeKing(undefined, undefined); // King Henry III
makeKing(); // King Henry IV
makeKing(); // King Henry V
makeKing(); // King Henry undefined
```

### Default Prameter Scope and Temporal Dead Zone

The later parameter can reference the earlier and cannot reference the laterer and body of function

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
