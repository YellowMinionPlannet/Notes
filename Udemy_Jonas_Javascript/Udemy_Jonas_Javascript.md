# How JavaScript Works Behind the Scenes
## The JavaScript Engine and Runtime
![Udemy_Jonas_Javascript_1](Udemy_Jonas_Javascript_1.png?raw=true)

## Execution Contexts and Call Stack
Every *Execution Context* contains:
1. Variable Environment
    * *let*, *const* and *var* declarations
    * Functions
    * *arguments* object
2. Scope Chain
3. *this* keyword

Every function has its own Execution Context. However, *Arrow Function* does not have *arguments* and *this* in its execution context. They can visit their parent's execution context's *arguments* and *this* instead.

The order of call stack/execution context is the order of function's call. This order does not affect scope chain, which is determined by where function located.

* *this* keyword behavior is the same under function declaration and function expression
* *scope chain* works the same as function declaration and function expression

```js
const age = 18;

function calAge(){
    const firstName = "Lei Zhong";
    function printAge(){
        console.log(firstName, age);
    }
    printAge();
}
calAge();
```
We can visit firstName and age variable because the scope chain look up procedure.

## Scope Types
* Global Scope
    * anything outside all functions
* Function Scope
    * var
* Block Scope
    * const, let
    * function(strict mode only)

```js
"use strict";
function calcAge(birthYear){
    const age = 2037 - birthYear;
    
    function printAge(){
        const output = "${firstName}, you are ${age}, born in ${birthYear}";
        console.log(output);
        
        if(birthYear >= 1981 && birthYear <=1996){
            function add(a, b){
                return a + b;
            }
         }   
            add(2,3);//ERROR, function add is block scope
        
    }
}
```

## Hoisting and TDZ

||Hoisted?|Initial Value|Scope|
|-|-|-|-|
|function declaration|YES|Actual Function|Block|
|var variables|YES|undefined|Function|
|let and const variables|NO|<uninitialized>TDZ|Block|
|function expressions and arrows|Depends on if using var or let/const||

## *This* Keyword
* this keyword is created when function is called, and it points to the value of owner
* this keyword's value depends on how function is called.

|Ways of function is Called|Value of this|
|-|-|
|Method|Object calls the method|
|Simple function call|undefined(strict mode)|
|Arrow functions|surrounding function|
|Event Listener|DOM element the handler is attached to|

```js

"use strict";
function someFeature() {
    console.log(this);
    function inside() {
        const temp = this;
        console.log(this);
        return temp;
    }
    return inside();
};
const lei = {
    age: 34,
    sex: "male",
    code: someFeature,
};
console.log(lei.code());//34
console.log(someFeature());//ERROR this is undefined
```

# A Closer Look at Functions
## Default Parameters
Before ES6
```js
    const bookings = [];
    function CheckIn (flightNumber, passengerNumber, price){
        passengerNumber = passengerNumber || 1;
        price = price || 199;
        
        const booking = {
            flightNumber,
            passengerNumber,
            price
        };
        
        bookings.push(booking);
    }
```
now in ES6 with *Default Parameters*

```js
    const bookings = [];
    function CheckIn (flightNumber, passengerNumber = 1, price = 199){
        const booking = {
            flightNumber,
            passengerNumber,
            price
        };
        
        bookings.push(booking);
    }
    
    CheckIn("12345678", undefined, 1000);
```

## First-Class Functions vs. Higher-Order Functions
>**Terminology Clarification**
>* First-Class Functions is a feature of javascript, means js treat function as values.
>* Higher-Order Functions are functions that receive another function(callback function) as argument, or return another function.

First-Class Function Samples
1. Store functions in variables or properties:
```js
const add = (a, b) => a * b;
const counter = {
    value: 23,
    inc: function(){
        this.value++;
    }
}   
```
2. Pass functions as arguments to OTHER functions
```js
const great = () => console.log("Hey, Jude");
btnClose.addEventListener("click", great);
```
3. Return functions FROM functions
4. Call methods on functions
```js
counter.inc.bind(someOtherObject);
```

## Functions Accepting Callback Functions
```js
"use strict;"

const upperFirstWord = function (str) {
    const [first, ...other] = str.split(" ");
    return [first.toUpperCase(), ...other].join(" ");
}

const transformStr = function (str, fn) {
    console.log(`Original String: ${str}`);
    console.log(`Transformed String: ${fn(str)}`);
    console.log(`Transformed By: ${fn.name}`);
}

transformStr("lei likes McDonald's", upperFirstWord)
```

## Functions Returning Functions
```js
const greet = function (greeting) {
    return function (name) {
        console.log(`${greeting} ${name}`);
    }
}

greet("Hello World")("By Lei")

const move = action => target => console.log(`${action} ${target}`);
move("Eat")("Food");

```

## The Call and Apply Methods
```js
"use strict;"
const lufthansa = {
    airline: "Lufthansa",
    iataCode: "LH",
    bookings: [],
    book(flightNum, name) {
        console.log(
            `${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`
        );
        this.bookings.push({
            flight: `${this.iataCode}${flightNum}`,
            name,
        });
    }
};

const book = lufthansa.book;



const eurowings = {
    airline: "Eurowings",
    iataCode: "EW",
    bookings: [],
}

book.call(lufthansa, 239, "Jonas Schmedtmann");
book.call(eurowings, 123, "Jone Smith");
console.log(lufthansa);
console.log(eurowings);

const flightData = [456, "George Sams"];
book.apply(lufthansa, flightData);
book.call(eurowings,...flightData)

lufthansa.planes = 300;
lufthansa.buyPlanes = function(){
    console.log(`${this.aireline} bought a plane.`);
    this.planes++;
}

document.getElementById("button").addEventListener("click", lufthansa.buyPlanes);//ERROR, this is that "button"
document.getElementById("button").addEventListener("click", lufthansa.buyPlanes.bind(lufthansa));// CORRECT, because it returns a new function which this keyword bind to the lufthansa
```

## Immediately Invoked Function Expressions(IIFE)
```js
"use strict;"
(function () {
    console.log("This will never run again!");
})();

(() => console.log("This will ALSO never run again!"))();
```

## Closures

* Put it in simple way: closure means the child function(created inside another function) can visit parent function's *variable environment*, even if parent function is returned.
* We can access [[scopes]] property of a function by using ```console.dir(fn)``` and spy this property in browser's console. This property contains the *variable environment* of a function.

```js
"use strict;"
function secureBooking() {
    let passengerCount = 0;
    return function () {
        passengerCount++;
        console.log(`${passengerCount} passengers!`);
    }
}

const booker = secureBooking();
booker();
booker();
booker();
```


# Working With Arrays
## Simple Array Methods
```js
let arr = ["a", "b", "c", "d", "e"];

//SLICE
console.log(arr.slice(2)); // [c, d, e]
console.log(arr.slice(2, 4)); // [c, d] start from 2 to (not include) 4
console.log(arr.slice(-1));//[e] last 1
console.log(arr.slice(1, -2));//[b, c] start from 1 except last two
console.log(arr.slice());//shallow copy
console.log([...arr]));//shallow copy

//SPLICE(MUTATE)
//console.log(arr.splice(2));//[c, d, e]
//console.log(arr);//[a, b]
//console.log(arr.splice(-1));//[e]
//console.log(arr);//[a,b,c,d]

//REVERSE(MUTATE)
console.log(arr.reverse());

//CONCAT
let arr2 = ["h","i","j","k","l","m"];
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//JOIN
console.log(letters.join("-"));
```

## Looping Arrays: forEach
```js
const movements = [200, 450, -400, 3000, -650, -120, 70, 1300];

for(const [i, mov] of movements.entries()){
    if(mov > 0 ){
        console.log(`You deposited ${mov} in Move ${i}`);
    }else{
        console.log(`You withdraw ${Math.abs(mov)} in Move ${i}`);
    }
}
//NOTE: break and continue does not work in here!!!
movements.forEach((mov, index, arr)=> {
    if(mov > 0 ){
        console.log(`You deposited ${mov} in Move ${index}`);
    }else{
        console.log(`You withdraw ${Math.abs(mov)} in Move ${index}`);
    }
})
```
## forEach with Maps and Sets
```js
//MAP
var currencies = new Map([
    ["USD", "United States dollar"],
    ["EUR", "Euro"],
    ["GBP", "Pound sterling"]
]);

currencies.forEach((value, key, map) => {
    console.log(value, key);
});

//Set
const currenciesUnique = new Set(["USD", "GBP", "USD", "EUR"]);
currenciesUnique.forEach((value, key, map) => {
    console.log(value);
});
```

## The map method
```js
const movements = [200, -400, 100, 50, -200];
console.log(movements.map((value, index, arr) => value * 1.1));
```

## The filter method
```js
const movements = [200, -400, 100, 50, -200];
console.log(movements.filter(value => value>0));
```
## The reduce method
```js
const movements = [200, -400, 100, 50, -200];
console.log(movements.reduce((acc, value, index, arr) => { return acc + value; },0));
```

## The find method
```js
const movements = [200, -400, 100, 50, -200];
console.log(movements.find(value => value < 0));//only find the first element matches the condition
```

## The findIndex method
```js
const movements = [200, -200, -400, 100, 50, -200];
console.log(movements.find(value => value === -200));//-1
```

## some every
```js
const movements = [200, -200, -400, 100, 50, -200];
console.log(movements.includes(-200));//only for equality
console.log(movements.some(value => value > 100)); //for conditions

console.log(movements.every(value => value > -500));
```

## flat and flatMap
```js
const complexArr = [[[1, 2], 3], [4, 5, 6], 7];
console.log(complexArr.flat(1));//0 return original array

const movements = [200, -200, -400, 100, 50, -200];
console.log(movements.flatMap(move => [move, move * 2]));
```

## Sorting Arrays(Mutate)
```js
const movements = [200, -200, -400, 100, 50, -200];
console.log(movements.sort((a, b) => a > b ? 1 : -1));
// Greater than 0 (switch order); Less than 0 (keep order)
console.log(movements.sort((a, b) => a - b)); 
```

## More ways of Creating and Filling Arrays
```js
const arr = new Array(7);
arr.fill(4);//(MUTATE)
console.log(arr);

const arr1 = Array.from({ length: 8 }, (value, i) => i);
console.log(arr1);
```

## Summary: Which Array Method to Use?
|To mutate original array|A new array|An array index|An array element|Know if array includes|A new string|To transform to value|To just loop array|
|-|-|-|-|-|-|-|-|
|push|map|indexOf|find|includes|join|reduce|forEach|
|unshift|filter|findIndex||some||||
|pop|slice|||every||||
|shift|concat|||||||
|splice|flat|||||||
|reverse|flatMap|||||||
|sort||||||||
|fill||||||||

## Array Methods Practice
```js
const accounts = [
    {
        Id: 1,
        movements: [200, -400, 300, 50, 100, -500]
    },
    {
        id: 2,
        movements: [100, 400, -299, 299]
    },
    {
        id: 3,
        movements: [3000, 2000, -1000, 1999]
    },
]

const bankDepositSum = accounts
                            .flatMap(acc => acc.movements)
                            .flilter(move => move > 0)
                            .reduce((sum, cur) => sum + cur, 0);

const numDepositGreater1000 = accounts
                                    .flatMap(acc => acc.movements)
                                    .reduce((count, cur) => (
                                        cur >= 1000 ? ++count: count
                                    ), 0);

const sums = accounts
        .flatMap((acc) => acc.movements)
        .reduce(
            (sums, curr) => { curr > 0 ? sums.deposits += curr : sums.withdrawals += curr; return sums },
            { deposits: 0, withdrawals: 0 }
        )
```

# Javascript in the Browser DOM and Events Fundamentals

## What's the DOM and DOM Manipulation
* DOM is short for 'Document Object Model'
* It is tree structured model of HTML content 
* It is the link point between Javascript code and Html file
* It is created when HTML file is loaded
* *Document* is the entry point of the DOM, it is at top of the tree structure
* *HTML Element* is the root element of DOM
* DOM is not part of Javascript. It is API in Browser which are libraries writen in Javascript

# Advanced DOM and Events
## How the DOM Really Works
* Every node in Tree structure is of Type *Node*
* *EventTarget* type is abstract and includes *addEventListener()* and *removeEventListener()* methods. That's why all the types inherit this get access to these two methods.

![Udemy_Jonas_Javascript_2](Udemy_Jonas_Javascript_2.png?raw=true)


## Selecting, Creating, and Deleting Elements

### Selecting
```js
//Realtime means if you delete a element from dom, it will reflect the changes

//NodeList Non-Realtime 
const allSections = document.querySelectorAll(".section");
//HTMLCollection Realtime
const allButtons = document.getElementsByTagName("button");
//HTMLCollection Realtime
const buttons = document.getElementsByClassName("btn");

```
### Creating & Insertings
```js
/*
    NOTE:   1. please watch out for unscaped user input when using this function.
            2. please use insertAdjacentText()/textContent for text insert
    Position: beforebegin; afterbegin; beforeend; afterend;
*/
var d1 = document.getElementById("one");
d1.insertAdjacentHTML("afterend", "<div id='two'>two</div>");

const message = document.createElement("div");
message.classList.add("cookie-message");
message.textContent = "Hello World";
d1.prepend(message);
d1.append(message);//only move message to the last place

d1.append(message.cloneNode(true));//insert message twice
d1.before(message);
d1.after(message);
```

### Deleting
```js
    document.querySelector(".btn--close-cookie")
            .addEventListener("click", function(){
                message.remove();
                message.parentElement.removeChild(message)
            });
```

## Styles, Attributes and Classes

### Styles
```js
    // By using style property, we can only read and write inline style
    message.style.backgroundColor = '#37383d';
    message.style.width = "120%";

    //use getComputedStyle to get real css style
    console.log(getComputedStyle(message).color);
    message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
    document.documentElement.style.setProperty("--color-primary", "orangered");

```

### Attributes
```js
const logo = document.querySelector(".nav");
console.log(logo.alt);
console.log(logo.className);
console.log(logo.src);//return absolute url of src
console.log(logo.getAttribute("src"));//return real value of attribute src
console.log(logo.getAttribute("designer"));//non-standard attribute

console.log(logo.setAttribute("company", "Bankist"));

/*Data Attribute*/
console.log(logo.dataset.versionNumber);//data-version-number


```

### Classes
```js
logo.classList.add();
logo.classList.remove();
logo.classList.toggle();
logo.classList.contains();
```

## Implementing Smooth Scrolling
```js
const btn = document.querySelector(".btn");
const section = document.querySelector("#section1");

btn.addEventListener("click", function(){
    console.log(section.getBoundingClientRect());//properties relavent to VIEWPORT

    console.log(window.pageXOffset, window.pageYOffset);//window properties relavent to HTML PAGE

    console.log(document.documentElement.clientHeight, document.documentElement.clientWidth);//properties relavent to VIEWPORT

    const s1coords = section.getBoundingClientRect();
    window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

    window.scrollTo({
        left: s1coords.left + window.pageXOffset,
        top: s1coords.top + window.pageYOffset,
        behavior: "smooth"
    });
    //Only mordern browsers
    section1.scrollIntoView({behavior:"smooth"});
});
```
![Udemy_Jonas_Javascript_3](Udemy_Jonas_Javascript_3.png?raw=true)

## Types of Events and Event Handlers
```js
const h1 = document.querySelector("h1");
h1.addEventListener("mouseenter", function(e){
    alert("Hello World!");
});//allow multiple listener

h1.onmouseenter = function(e){
    alert("Hello Lei!");
}//override when call multiple times

const fn = function(){
    alert("Hellooooo!");
}

h1.addEventListener("mouseenter", fn);
h1.removeEventListener("mouseenter", fn);
```

## Event Propagation: Bubbling and Capturing

Capturing:
    Document => EventTarget
Bubbling:
    EventTarget => Document
Propagation = Capturing + Bubbling

## Event Propagation in Practice
```js
/*Random Number between MAX and MIN*/
const random = function(min, max){
    return Math.random() * (max - min + 1) + min;
}

const randomColor = function () {
    return `rgb(${random(0,255)}, ${random(0,255)},${random(0,255)}`;
}
```

* ```e.target``` of callback function is always the same, which would be the eventtarget who actually received the event.
* ```e.currentTarget``` of callback function is always the same as this.
* ```e.stopPropagation``` at the end of callback function will prevent propagation happens.
* The third arguments of ```addEventListener``` set to true, then the callback happens in the capturing phase.

## Event Delegation: Implementing Page Navigation
Event Delegation: When we need to add callback function to hundreds of elements' eventlisteners, we simply find elements' common parent element, and use propagation concept to trigger that callback.

```js
const parent = document.querySelector(".parent");
parent.addEventListener("click", function(e){
    e.preventDefault();
    if(e.target.classList.contains("child")){
        //do something
    }
});
```

## DOM Traversing
Traversing: Select element based on other element

### Downwards
```js
//find descendants
const h1 = document.querySelector("h1");
console.log(h1.querySelectorAll(".highlight"));

//find child only
h1.childNodes;//Element, text, comment Live
h1.children;//Element only Live
h1.firstElementChild;
h1.lastElementChild
```
### Upwards
```js
h1.parentNode
h1.parentElement

//find ancestor
h1.closest(".parent")
```

### Sideways
```js
h1.previousElementSibling
h1.nextElementSibling
h1.previousSibling
h1.nextSibling
h1.parentElement.children
```

## Passing Arguments to Event Handlers
```js
const fn = function(e, opacity){
    if(opacity === 0.5){
        //true
    }
}
const fn1 = function(e){
    if(this === 0.5){
        //true
    }
}

nav.addEventListener("mouseover", function(e){
    fn(e, 0.5);
});

nav.addEventListener("mouseover", fn1.bind(0.5));
```

## Lifecycle DOM Events
```js
document.addEventListener("DOMContentLoaded", function(e){
    console.log("JS and HTML Tree is built!");
    //if we do not place script tag at the end of body, we need to wrap all of our code here.
});

document.addEventListener("load", function(e){
    e.preventDefault();
    e.returnValue = "";//show popup before leaving, DON'T Abuse this
});
```
DOMContentLoaded: JS and HTML Tree is built
load: all resources are downloaded
unload: before user leave 

## Efficient Script Loading: defer and async

![Udemy_Jonas_Javascript_4.jpg](Udemy_Jonas_Javascript_4.jpg?raw=true)

Scripts In the head
* using async does not guarantee DOMContentLoaded fires after scrips are all executed
* ussing async does not guarantee the order of scripts
* defer make sure all scripts are executed and executed in order