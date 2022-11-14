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
