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