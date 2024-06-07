# Section 9: The Tricky Parts: Scope & Closures

## Recaping Var & Scope
var keyword and function scope chain:

```js
var color = "red"; // this will set color porperty at window object. eg. window.color

function blah() { // this function has access to color
  console.log(color); 

  var animal = "Flamboyant Cuttlefish";
}

if(true){ // this block has access to color
  console.log(color);
  var food = "Chicken Parmesan"; // this also set food property at window object. eg. window.food
}

console.log(food); // here we can access to food outside the condition block
console.log(animal); //undefined, var keyword is only constrained within function scope chain.

for(var i = 0; i < 10; i++){
  console.log(i);
}
console.log(i); // 10, i can be accessed here, which is declared as window.i
```

## Recaping Let, Const, & Scope
* keyword `const` and `let` will not add variables to global object.
* keyword `const` and `let` is block scoped

```js
if(true){
  const animal = "Hummingbird Moth";
  console.log(animal); // Hummingbird Moth
}
console.log(animal); // undefined

for(let i = 0; i < 10; i++){

}
console.log(i);// undefined
```

## The Scope Chain
```js
let age = 10;
function outer(){
  console.log(age);// 10
}

function outer2(){
  let age = "ageless";
  if(true){
    let age = 99;
    console.log(age);// 99
  }

  function inner(){
    let age = "Eternal";
    console.log(age);// Eternal
  }
  inner();
}

outer();
outer2();
```

## Static Scope
* Dynamic Scope - variable are dependent on where you call it.
* JS is static scope language

```js
let animal = "Barn Owl";
function printAnimal(){
  console.log(animal);
}

function alsoPrintAnimal(){
  let animal = "Burrowing Owl";
  printAnimal();// IMPORTANT: here it prints out Barn Owl, but dynamic scope will print out Burrowing Owl
}
```

## Hoisting

### Rule 1
keyword `var` will pull the declared variable to the top of the current scope.
```js
console.log(food);
var food = "pizza";
```
Upper script equals to the below
```js
var food = undefined;
console.log(food);
food = "pizza";
```

### Rule 2
keyword `let` is hoisted but in a temporal dead zone, and no way to access the variable until the original line.

## IIFE
* IIFE - Immediate Invoked Function Expression
```js
(function () {
  console.log("Hello from IIFE");
})();

```
The Reason of Existence:
1. Hiding the implementation
```js
(function(){
  let secret = 10;
  console.log("Hello from IIFE");
  console.log(secret);
})();
```
2. Preventing global polluttion
```js
(function(){
  let origin = "Brazil";
})();
console.log(origin); // this origin is still global object's origin
```

## Closure: the Basic
1. there is a function inside another function
2. the innner function has access to outer function
3. *if we return the inner function, that function still has access the outer function scope*

```js
function outerFunction(){
  let outerVariable = "I am from outer";
  function innerFunction(){
    console.log("In Inner Function");
    console.log(outerVariable);
  }
  return innerFunction;
}

const myClosure = outerFunction();
myClosure();
```

## Closures: Another Example
Instead of returning function, let's return object:
```js
const counter = (function createCounter(){
  let count = 0;
  return {
    increment: function(){
      return ++count;
    },
    decrement: function(){
      return --count;
    },
    getCount:function(){
      return count;
    }
  }
})();
```

> We can also do a Factory function to create different object that created by IIFE:

```js
const baseFactory = function(factory){
  return (factory)();
}

const counterFactory = function(){
  let counter = 0;
  return {
    increment: function(){
      return ++counter;
    },
    decrement: function(){
      return --counter;
    },
    getCounter: function(){
      return counter;
    }
  } 
}

const counter = baseFactory(counterFactory);
counter.increment();
```

