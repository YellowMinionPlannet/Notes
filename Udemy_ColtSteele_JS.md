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

## Closures: Factory Functions

```js
function createExponentFunction(exp){
  return function(val){
    return val ** exp;
  }
}

const square = createExponentFunction(2);
const cube = createExponentFunction(3);

square(2); //4
square(10); //100

cube(2); //8
cube(10); //1000

function uniqueIdGenerator(prefix){
  let id = 0;
  return function(){
    id += 1;
    return `${prefix}${id}`;
  }
}

const getBookId = uniqueIdGenerator("book_");
const getUserId = uniqueIdGenerator("user_");

getBookId(); //book_1

getUserId(); //user_1
```

## Closures: Event Listeners


```js
// OLD WAY
let count = 0; 
document.querySelector("button").addEventListener("click", function(){
  count += 1;
  console.log("You clicked me ", count);
});


// With IIFE
document.querySelector("button").addEventLisenter("click", (function(){
  let count = 0;
  return function(){
    count += 1;
    console.log("You clicked me ", count);
  }
})());
```

If there are three button, and each of them work on their own counter.

```js
function createCounterButton(id){
  const btn = document.getElementById(id);
  let count = 0;
  btn.addEventListener("click", function(){
    count += 1;
    btn.innerText = "Clicked " + count;
  });
}
```

## Closures: Loops
For some scenarios, if we want to create several setTimeout funciton and each of them doing its job after the previours one for 1 second sequentially.

```js
for(var i = 1; i < 6; i++){
  setTimeout(function(){
    console.log(i);
  }, 1000);
}
// 6
// 6
// 6
// 6
// 6
// This is because the I is global variable and once the setTimeout all fires out, the i got updated to 6.

// Solution 1
for(let i = 1; i < 6; i++){
  setTimeout(function(){
    console.log(i);
  }, 1000);
}

// Solution 2 
for(var i = 1; i < 6; i++){
  (function(j){
    setTimeout(function(){
      console.log(j);
    }, 1000);
  })(i);
}
```

# Section 10: Debouncing, Throttling, & RequestAnimationFrame
## setTimeout
```js
function showNotification(message, duration){
  const notification = document.createElement("div");
  notification.innerText = message;
  notification.className = "notification";
  document.body.append(notification);

  setTimeout(function(){
    notification.remove();
  }, 3000);
}

showNotification("I was here.", 3000);
```
## setInterval
```js
setInterval(function(){
  console.log("It's been 2 seconds!");
}, 2000);
```

```js
function startCountDown(duration){
  let secondsRemaining = duration;
  const h1 = document.getElementById("timer");
  h1.innerText = secondsRemaining + " seconds remaining";
  secondsRemaining -= 1;
  const timerId = setInterval(function(){
    h1.innerText = secondsRemaining + " seconds remaining";
    secondsRemaining -= 1;

    if(secondsRemaining <= 0){
      clearInterval(timerId);
    }  
  }, 1000);
}
```

## clearTimeout

## Debouncing
```js
function queryAPI (){
  console.log("MAKEING AN API REQUEST");
}

const searchInput = document.querySelector("#search");

let debounceTimeout;
searchInput.addEventListener("input", () =>{
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() =>{
    queryAPI();
  }, 400);
});
```

## Writing a Fancy Debounce Function
```js
const debouncedQueryAPI = debounce(queryAPI, 500);
function debounce(callback, deley){
  let timeoutId;
  return (...args) =>{
    if(timeoutId){
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

searchInput.addEventListener("input", (evt) =>{
  debouncedQueryAPI(evt.target.value);
});

```

## Throttling
- Throttling is a concept of controlling the execution of some function within a defined duration to happen only 1 time.
eg. when visit a web site, we want to make loading pictures happens only when user about to scroll to the bottom of the page. But without throttling, if user scroll a lot, that will causing tens of requests sent to the remote API within a second, which causes the API to be jamed. So we need throttling to limit the requests within a defined duration.

Description:
we scroll down and new divs are appended
```js
function getRandomColor(){
  const palette = [
    "#FFADAD",
    "#FFC3A0",
    "#FF6770",
    "#392F5A",
    "#31A2AC",
    "#61C0BF",
    "#6B4226",
    "#D9BF77",
    "#ACD8AA",
    "#FFE156",
    "#6A0572",
    "#AB83A1"
  ];
  const randomIndex = Math.floor(Math.random() * palette.length);
  return palette[randomIndex];
}

const content = document.getElementById("content");

function loadMoreItems(){
  const scrollDistanceToBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
  
  if(scrollDistanceToBottom < 200){
    console.log("LOADING DATA FROM AN API!!!");
    for(let i = 0; i < 10; i++){
      const item = document.createElement("div");
      item.classList.add("item");
      console.log(content);
      item.textContent = "Item" + (content.children?.length??0 +1);
      item.style.backgroundColor = getRandomColor();
      item.style.setProperty("height", "100px");
      content.appendChild(item);
    }
  }
}

let isThrottled = false;
window.addEventListener("scroll", () =>{
  if(!isThrottled){
    loadMoreItems();
    isThrottled = true;
    setTimeout(() =>{
      isThrottled = false;
    }, 200);
  }
});

loadMoreItems();
```

## Building a Fancy Throttle Function
Description:
sample of a simplified throttle framework
```js
function throttle(callback, delay = 500){
  let isThrottled = false;
  let savedArgs = null;

  //This is a helper function
  const executeCallback = () => {
    if(savedArgs === null){
      isThrottled = false;
    }else{
      callback(...savedArgs);
      savedArgs = null;
      setTimeout(executeCallback, delay);
    }
  }

  return (...args) =>{
    if(isThrottled){
      savedArgs = args;
      return;
    }
    callback(...args);
    isThrottled = true;
    setTimeout(executeCallback, delay);
  }
}

const throttledLoad = throttle(loadMoreItems);

window.addEventListener("scroll", () => {
  throttledLoad();
});

loadMoreItems();
```

## requestAnimationFrame Basics

- for creating smooth animations, instead of giving it a fixed interval, which is usually 60frames/second fixed, to perform, the animation will be triggered as the page got repainted.

An example of fixed interval animation vs. requestAnimationFrame:
Description:
we have to div that rotates
```js
const boxInterval = document.getElementById("boxInterval");
const boxAnimationFrame = document.getElementById("boxAnimationFrame");

let intervalAngle = 0;
let animationFrameAngle = 0;

let counterInterval = 0;
let counterAnimationFrame = 0;

function animatedWithInterval(){
  boxInterval.style.transform = "rotate(" + intervalAngle + "deg)";
  intervalAngle +=2;
  if(intervalAngle % 360 == 0){
    counterInterval++;
    boxInterval.innerText = counterInterval;
  }
}


let previousTime;
function animatedWithAnimationFrame(currentTime){
  console.log(currentTime - previousTime);
  previousTime = currentTime;
  boxAnimationFrame.style.transform = "rotate("+animationFrameAngle+"deg)";
  animationFrameAngle += 2;
  if(animationFrameAngle % 360 == 0){
    counterAnimationFrame++;
    boxAnimationFrame.innerText = counterInterval;
  }
  requestAnimationFrame(animatedWithAnimationFrame);
}

setInterval(animatedWithInterval, 16); // 16 milisecond is approximately 60frames/second
requestAnimationFrame(animatedWithAnimationFrame);
```
## reqeustAnimationFrame with Timestamps

## Scroll to top Animation WIth requestAnimationFrame
Description:
we can click on a button to get back to the top of the page.

```js
document.querySelector(".back-to-top").addEventListener("click", smoothScrollToTop);

function smoothScrollToTop(){
  const duration = 1000;
  const start = window.scrollY;
  const end = 0;
  const change = end - start;
  let startTime = null;

  function animateScroll(currentTime){
    if(startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    console.log(timeElapsed);
    const progress = Math.min(timeElapsed/duration, 1);
    console.log(progress);
    window.scrollTo(0, start + change * progress);

    if(timeElapsed < duration){
      requestAnimationFrame(animateScroll);
    }
  }
  requestAnimationFrame(animateScroll);
}
```

# Section 11 Functional Programing
## Introducing Functional Programing
- FP is process of building software by composing pure functions, avoiding shared state, mutable data, and side-effects
- FP is often declarative rather than imperative, and application state flows through pure functions
- FP try to avoid looping, mutation and shared state, variable declarations

- Concepts we gonna cover in this section:
  - higher order functions, first class functions
  - pure functions
  - immutability
  - closure
  - partial application/currying
  - function composition

### Imperative Programing vs. Functional Programing
eg. if we want to achieve sum, from 1 to 5, in both imperative and functional way:
```js
// Imperative Programing
// Imperative programing is more descriptive to how the logic perform, and try to manipulate pieces of state
let sum = 0;
for(let i = 1; i <= 5; i++){
  sum += i;
}

// Functional Programing
// Functional programing is more descriptive to relationship among state (input/output/variables), try to avoid mutate state by using pure function
[1, 2, 3, 4, 5].reduce((acc, val) => acc + val, 0);
```

eg. if we have an array, and we want to find even numbers:
```js
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// Imperative Programing
const evens = [];
for(let num of nums){
  if(num % 2 === 0){
    evens.push(num);
  }
}

// Functional Approach
nums.filter(n => n % 2 === 0);
```

## First Class Functions
- The important building blocks of functional programing
- First class functions means you can treat function as variables, inputs, and outputs(return values) etc.

```js
// store function in a variable
const func = function (person){
  console.log("Hello there, ", person);
}

func("blue");

// store function in an array
const funcs = [
  function(person){
    console.log("Hello there, " person);
  },
  function(person){
    console.log("I hate you ", person);
  }
];

// reference functions with inputs and executes them
function greet(person){
    console.log("Hello there, " person);
}

function hate(person){
    console.log("I hate you ", person);
  }

function callWithBlue(func){
  func("blue")
}

callWithBlue(hate);

callWithBlue((color) => { console.log(color + "is the best color");});
```

## Writing Pure Funcitons
- fundamental to functional programing
- pure functions is determinestic, which means for the same input it always gives the same output. And they cannot depend on any mutable state, which might be outside of the pure functions.
- Referential transparency
- Side-effect free: they do not mutate any external data, modify any state. eg. writing to the console or a log file, modifying a mutable object, reassigning a variable, updating something in different scope, etc.

```js
let value = 2;
function squareAndUpdateValue(num){
  value = num * num; // mutating value, so this is not pure function
  return value;
}

// pure function
function square(num){
  return num * num;
}

// Example II

const colors = ["red", "orange"];
function addToArray(arr, value){
  return arr.push(value);
}

addToArray(colors, "yellow");// Not pure

// pure function
function pureAddToArray(arr, value){
  return [...arr, value];// arr not changed, return a new array, so this is pure.
}
```
## Returning Functions
- Higher Order Functions: a function that receives another function as an argument, returns a function or does both.

```js
//receives a function
function doTwice(func){
  func();
  func();
}

//returns a function
function multiplyBy(factor){
  return function(number){
    return number * factor;
  }
}

const triple = multiplyBy(3);
const double = multiplyBy(2);
```

## Immutability
- Usually, if we have common typed variable, `const` will prevent mutation. However, if we have an Object, we need to be careful of maintaining immutability:
```js
const num = 1;
num = 2; // ERROR
const nums = [1, 2, 3];
nums.push(4); // OK
```

### Object.freeze
```js
const person = {name: "Teddy", age: 2};
Object.freeze(person);
person.color = "pink";// Wouldn't do anything
person.age = 3;// Wouldn't do anything
console.log(person); // {name: "Teddy", age: 2}
```

### Immutability in pure function
- One of definition about pure function is, pure function never mutate external data, or mutate any state.
```js
const nums = [1, 2, 3, 4];
funciton push(arr, val){
  return [...arr, val];// Instead of mutate arr, we created a new array here
}

function removeLastItem(arr){
  return arr.slice(0, -1);
}
```

## Recursion
- It comply with functional programing becuase it does not mutate and create declarative code.

## Partial Application With Bind
From this function, we talk about FP techniques.
- Partial Application: the process of executing a function wiht some or all of its arguments. The partially applied function then gets returned for later use.
- Typical example would be using `bind`
```js
function greet(greeting, name){
  console.log(`${greeting}, ${name}!!!`);
}

const aussieGreet = greet.bind(null, "good day");
aussieGreet("lei"); //good day, lei
```

## Writing a Partial Function
```js
funciton multiply(a, b){
  return a * b;
}
function partial(func, ...fixedArgs){
  return function (...remainingArgs){
    return func(...fixedArgs, ...remainingArgs);
  }
}

const double = partial(multiply, 2);
```

```js
function fetchData(url, apiKey, params){
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = `${url}?${queryString}`;

  console.log(`Sending requests to ${fullUrl}`);
  console.log(`With API key of ${apiKey}`);
}

const fetchMyAPI = partial(fetchData, myAPIUrl, myAPIKey);
```

## Composition Function
- Composition: Funciton composition is mechanism of combining multiple functions to build a more complicated one. The result of each function is passed to the next one. eg. f(g(x))

```js
const add = (a, b) => a + b;
const square = (a) => a * a;

const addAndSquare = (a, b) => square(add(a, b));

function lowerCase(str){
  return str.toLowerCase()
}

function splitWords(str){
  return str.split(" ");
}

function joinWithDash(array){
  return array.join("-")
}

joinWithDash(splitWords(lowerCase("hello world")));
```

## A simple compose function
```js
function compose(fn1, fn2){
  return function (value){
    return fn2(fn1(value));
  }
}
```

## Writing a fancier compose function
```js
function compose(...functions){
  return function(data){
    return functions.reduceRight((val, func) => func(val), data);
  }
}
```

## Currying Basics
- A curried funciton can be called with any number of arguments - if you call it with fewer args than it takes, it returns a "smaller" partial, which you can then call with remaining arguments. eg. 
```js
// if we have function that can be called as
f(a, b , c);
// this is the curried format of previous one
f(a)(b)(c);
```

```js
function add(a, b, c){
  return a + b + c;
}

// curried version
function addCurry(a){
  return function(b){
    return function(c){
      return a + b + c;
    }
  }
}
```

## More advanced currying
```js
// Our goal:
//If we have function:
function add3(a, b, c){
  return a + b + c;
}

const curry(add3); // Get back a curried version of add3

add3(1, 2, 3); // 6
add3(1);// return a function that will take b and c
add3(1, 2)// return a function that will take c
add3(1)(2)(3)// 6
```

```js
function add3(x, y, z){
  return x + y + z;
}

function curry(fn){
  return function curried(...args){
    if(args.length >= fn.length){
      return fn.apply(this, args);
    }else{
      return function (...args2){
        return curried.apply(this, args.concat(args2));
      }
    }
  }
}
```
