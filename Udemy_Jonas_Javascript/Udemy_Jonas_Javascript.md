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
function someFeature () {
    return this.age;
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

