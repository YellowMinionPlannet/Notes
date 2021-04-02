# Section 8: How JavaScript Works Behind the Scenes
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
