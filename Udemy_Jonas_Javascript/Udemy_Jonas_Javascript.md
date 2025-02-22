# How JavaScript Works Behind the Scenes

## The JavaScript Engine and Runtime

![Udemy_Jonas_Javascript_1](Udemy_Jonas_Javascript_1.png?raw=true)

## Execution Contexts and Call Stack

Every _Execution Context_ contains:

1. Variable Environment
   - _let_, _const_ and _var_ declarations
   - Functions
   - _arguments_ object
2. Scope Chain
3. _this_ keyword

Every function has its own Execution Context. However, _Arrow Function_ does not have _arguments_ and _this_ in its execution context. They can visit their parent's execution context's _arguments_ and _this_ instead.

The order of call stack/execution context is the order of function's call. This order does not affect scope chain, which is determined by where function located.

- _this_ keyword behavior is the same under function declaration and function expression
- _scope chain_ works the same as function declaration and function expression

```js
const age = 18;

function calAge() {
  const firstName = "Lei Zhong";
  function printAge() {
    console.log(firstName, age);
  }
  printAge();
}
calAge(); // Lei Zhong 18
```

We can visit firstName and age variable because the scope chain look up procedure.

## Scope Types

- Global Scope
  - anything outside all functions
- Function Scope
  - var
- Block Scope
  - const, let
  - function(strict mode only)

```js
"use strict";
const firstName = "Lei";
function calcAge(birthYear) {
  const age = 2037 - birthYear;

  function printAge() {
    const output = `${firstName}, you are ${age}, born in ${birthYear}`;
    console.log(output);

    if (birthYear >= 1981 && birthYear <= 1996) {
      function add(a, b) {
        return a + b;
      }
    }
    console.log(add(2, 3)); //ERROR, function add is block scope
  }

  printAge();
}

calcAge(1986);
```

## Hoisting and TDZ(Temporal Dead Zone)

|                                 | Hoisted?                                                   | Initial Value      | Scope    |
| ------------------------------- | ---------------------------------------------------------- | ------------------ | -------- |
| function declaration            | YES                                                        | Actual Function    | Block    |
| var variables                   | YES                                                        | undefined          | Function |
| let and const variables         | NO                                                         | <uninitialized>TDZ | Block    |
| function expressions and arrows | Depends on if using var or let/const behave like variables |                    |

## _This_ Keyword

- this keyword is created when function is called, and it points to the value of owner
- this keyword's value depends on how function is called.

| Ways of function is Called | Value of this                          |
| -------------------------- | -------------------------------------- |
| Method                     | Object calls the method                |
| Simple function call       | undefined(strict mode)                 |
| Arrow functions            | surrounding function                   |
| Event Listener             | DOM element the handler is attached to |

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
}
const lei = {
  age: 34,
  sex: "male",
  code: someFeature,
};
console.log(lei.code());
/*
{age: 34, sex:'mail', code: f}
Window
Window
*/
```

# A Closer Look at Functions

## Default Parameters

Before ES6

```js
const bookings = [];
function CheckIn(flightNumber, passengerNumber, price) {
  passengerNumber = passengerNumber || 1;
  price = price || 199;

  const booking = {
    flightNumber,
    passengerNumber,
    price,
  };

  bookings.push(booking);
}
```

now in ES6 with _Default Parameters_

```js
const bookings = [];
function CheckIn(flightNumber, passengerNumber = 1, price = 199) {
  const booking = {
    flightNumber,
    passengerNumber,
    price,
  };

  bookings.push(booking);
}

CheckIn("12345678", undefined, 1000);
```

## First-Class Functions vs. Higher-Order Functions

> **Terminology Clarification**
>
> - First-Class Functions is a feature of javascript, means js treat function as values.
> - Higher-Order Functions are functions that receive another function(callback function) as argument, or return another function.

First-Class Function Samples

1. Store functions in variables or properties:

```js
const add = (a, b) => a * b;
const counter = {
  value: 23,
  inc: function () {
    this.value++;
  },
};
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
"use strict;";

const upperFirstWord = function (str) {
  const [first, ...other] = str.split(" ");
  return [first.toUpperCase(), ...other].join(" ");
};

const transformStr = function (str, fn) {
  console.log(`Original String: ${str}`);
  console.log(`Transformed String: ${fn(str)}`);
  console.log(`Transformed By: ${fn.name}`);
};

transformStr("lei likes McDonald's", upperFirstWord);
```

## Functions Returning Functions

```js
const greet = function (greeting) {
  return function (name) {
    console.log(`${greeting} ${name}`);
  };
};

greet("Hello World")("By Lei");

const move = (action) => (target) => console.log(`${action} ${target}`);
move("Eat")("Food");
```

## The Call and Apply Methods

```js
"use strict;";
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
  },
};

const book = lufthansa.book;

const eurowings = {
  airline: "Eurowings",
  iataCode: "EW",
  bookings: [],
};

book.call(lufthansa, 239, "Jonas Schmedtmann");
book.call(eurowings, 123, "Jone Smith");
console.log(lufthansa);
console.log(eurowings);

const flightData = [456, "George Sams"];
book.apply(lufthansa, flightData);
book.call(eurowings, ...flightData);

lufthansa.planes = 300;
lufthansa.buyPlanes = function () {
  console.log(`${this.aireline} bought a plane.`);
  this.planes++;
};

document
  .getElementById("button")
  .addEventListener("click", lufthansa.buyPlanes); //ERROR, this is that "button"
document
  .getElementById("button")
  .addEventListener("click", lufthansa.buyPlanes.bind(lufthansa)); // CORRECT, because it returns a new function which this keyword bind to the lufthansa
```

## Immediately Invoked Function Expressions(IIFE)

```js
"use strict";
(function () {
  console.log("This will never run again!");
  console.log(this);
})();

(() => {
  console.log("This will ALSO never run again!");
  console.log(this);
})();
/*
This will never run again!
undefined
This will ALSO never run again!
Window
*/
```

## Closures

- Put it in simple way: closure means the child function(created inside another function) can visit parent function's _variable environment_, even if parent function is returned.
- We can access [[scopes]] property of a function by using `console.dir(fn)` and spy this property in browser's console. This property contains the _variable environment_ of a function.

```js
"use strict;";
function secureBooking() {
  let passengerCount = 0;
  return function () {
    passengerCount++;
    console.log(`${passengerCount} passengers!`);
  };
}

const booker = secureBooking();
booker();
booker();
booker();
/*
1 passengers
2 passengers
3 passengers
*/
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

for (const [i, mov] of movements.entries()) {
  if (mov > 0) {
    console.log(`You deposited ${mov} in Move ${i}`);
  } else {
    console.log(`You withdraw ${Math.abs(mov)} in Move ${i}`);
  }
}
//NOTE: break and continue does not work in here!!!
movements.forEach((mov, index, arr) => {
  if (mov > 0) {
    console.log(`You deposited ${mov} in Move ${index}`);
  } else {
    console.log(`You withdraw ${Math.abs(mov)} in Move ${index}`);
  }
});
```

## forEach with Maps and Sets

```js
//MAP
var currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
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
console.log(movements.filter((value) => value > 0));
```

## The reduce method

```js
const movements = [200, -400, 100, 50, -200];
console.log(
  movements.reduce((acc, value, index, arr) => {
    return acc + value;
  }, 0)
);
```

## The find method

```js
const movements = [200, -400, 100, 50, -200];
console.log(movements.find((value) => value < 0)); //only find the first element matches the condition
```

## The findIndex method

```js
const movements = [200, -200, -400, 100, 50, -200];
console.log(movements.find((value) => value === -200)); //-1
```

## some every

```js
const movements = [200, -200, -400, 100, 50, -200];
console.log(movements.includes(-200)); //only for equality
console.log(movements.some((value) => value > 100)); //for conditions

console.log(movements.every((value) => value > -500));
```

## flat and flatMap

```js
const complexArr = [[[1, 2], 3], [4, 5, 6], 7];
console.log(complexArr.flat(1)); //0 return original array

const movements = [200, -200, -400, 100, 50, -200];
console.log(movements.flatMap((move) => [move, move * 2]));
```

## Sorting Arrays(Mutate)

```js
const movements = [200, -200, -400, 100, 50, -200];
console.log(movements.sort((a, b) => (a > b ? 1 : -1)));
// Greater than 0 (switch order); Less than 0 (keep order)
console.log(movements.sort((a, b) => a - b));
```

## More ways of Creating and Filling Arrays

```js
const arr = new Array(7);
arr.fill(4); //(MUTATE)
console.log(arr);

const arr1 = Array.from({ length: 8 }, (value, i) => i);
console.log(arr1);
```

## Summary: Which Array Method to Use?

| To mutate original array | A new array | An array index | An array element | Know if array includes | A new string | To transform to value | To just loop array |
| ------------------------ | ----------- | -------------- | ---------------- | ---------------------- | ------------ | --------------------- | ------------------ |
| push                     | map         | indexOf        | find             | includes               | join         | reduce                | forEach            |
| unshift                  | filter      | findIndex      | N/A              | some                   | N/A          | N/A                   | N/A                |
| pop                      | slice       | N/A            | N/A              | every                  | N/A          | N/A                   | N/A                |
| shift                    | concat      | N/A            | N/A              | N/A                    | N/A          | N/A                   | N/A                |
| splice                   | flat        | N/A            | N/A              | N/A                    | N/A          | N/A                   | N/A                |
| reverse                  | flatMap     | N/A            | N/A              | N/A                    | N/A          | N/A                   | N/A                |
| sort                     | N/A         | N/A            | N/A              | N/A                    | N/A          | N/A                   | N/A                |
| fill                     | N/A         | N/A            | N/A              | N/A                    | N/A          | N/A                   | N/A                |

## Array Methods Practice

```js
const accounts = [
  {
    Id: 1,
    movements: [200, -400, 300, 50, 100, -500],
  },
  {
    id: 2,
    movements: [100, 400, -299, 299],
  },
  {
    id: 3,
    movements: [3000, 2000, -1000, 1999],
  },
];

const bankDepositSum = accounts
  .flatMap((acc) => acc.movements)
  .flilter((move) => move > 0)
  .reduce((sum, cur) => sum + cur, 0);

const numDepositGreater1000 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

const sums = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, curr) => {
      curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
```

# Javascript in the Browser DOM and Events Fundamentals

## What's the DOM and DOM Manipulation

- DOM is short for 'Document Object Model'
- It is tree structured model of HTML content
- It is the link point between Javascript code and Html file
- It is created when HTML file is loaded
- _Document_ is the entry point of the DOM, it is at top of the tree structure
- _HTML Element_ is the root element of DOM
- DOM is not part of Javascript. It is API in Browser which are libraries writen in Javascript

# Advanced DOM and Events

## How the DOM Really Works

- Every node in Tree structure is of Type _Node_
- _EventTarget_ type is abstract and includes _addEventListener()_ and _removeEventListener()_ methods. That's why all the types inherit this get access to these two methods.

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
d1.append(message); //only move message to the last place

d1.append(message.cloneNode(true)); //insert message twice
d1.before(message);
d1.after(message);
```

### Deleting

```js
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();
    message.parentElement.removeChild(message);
  });
```

## Styles, Attributes and Classes

### Styles

```js
// By using style property, we can only read and write inline style
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

//use getComputedStyle to get real css style
console.log(getComputedStyle(message).color);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";
document.documentElement.style.setProperty("--color-primary", "orangered");
```

### Attributes

```js
const logo = document.querySelector(".nav");
console.log(logo.alt);
console.log(logo.className);
console.log(logo.src); //return absolute url of src
console.log(logo.getAttribute("src")); //return real value of attribute src
console.log(logo.getAttribute("designer")); //non-standard attribute

console.log(logo.setAttribute("company", "Bankist"));

/*Data Attribute*/
console.log(logo.dataset.versionNumber); //data-version-number
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

btn.addEventListener("click", function () {
  console.log(section.getBoundingClientRect()); //properties relavent to VIEWPORT

  console.log(window.pageXOffset, window.pageYOffset); //window properties relavent to HTML PAGE

  console.log(
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); //properties relavent to VIEWPORT

  const s1coords = section.getBoundingClientRect();
  window.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  );

  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: "smooth",
  });
  //Only mordern browsers
  section1.scrollIntoView({ behavior: "smooth" });
});
```

![Udemy_Jonas_Javascript_3](Udemy_Jonas_Javascript_3.png?raw=true)

## Types of Events and Event Handlers

```js
const h1 = document.querySelector("h1");
h1.addEventListener("mouseenter", function (e) {
  alert("Hello World!");
}); //allow multiple listener

h1.onmouseenter = function (e) {
  alert("Hello Lei!");
}; //override when call multiple times

const fn = function () {
  alert("Hellooooo!");
};

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
const random = function (min, max) {
  return Math.random() * (max - min + 1) + min;
};

const randomColor = function () {
  return `rgb(${random(0, 255)}, ${random(0, 255)},${random(0, 255)}`;
};
```

- `e.target` of callback function is always the same, which would be the eventtarget who actually received the event.
- `e.currentTarget` of callback function is always the same as this.
- `e.stopPropagation` at the end of callback function will prevent propagation happens.
- The third arguments of `addEventListener` set to true, then the callback happens in the capturing phase.

## Event Delegation: Implementing Page Navigation

Event Delegation: When we need to add callback function to hundreds of elements' eventlisteners, we simply find elements' common parent element, and use propagation concept to trigger that callback.

```js
const parent = document.querySelector(".parent");
parent.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("child")) {
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
h1.childNodes; //Element, text, comment Live
h1.children; //Element only Live
h1.firstElementChild;
h1.lastElementChild;
```

### Upwards

```js
h1.parentNode;
h1.parentElement;

//find ancestor
h1.closest(".parent");
```

### Sideways

```js
h1.previousElementSibling;
h1.nextElementSibling;
h1.previousSibling;
h1.nextSibling;
h1.parentElement.children;
```

## Passing Arguments to Event Handlers

```js
const fn = function (e, opacity) {
  if (opacity === 0.5) {
    //true
  }
};
const fn1 = function (e) {
  if (this === 0.5) {
    //true
  }
};
//method1
nav.addEventListener("mouseover", function (e) {
  fn(e, 0.5);
});
//method2
nav.addEventListener("mouseover", fn1.bind(0.5));
```

## Lifecycle DOM Events

```js
document.addEventListener("DOMContentLoaded", function (e) {
  console.log("JS and HTML Tree is built!");
  //if we do not place script tag at the end of body, we need to wrap all of our code here.
});

document.addEventListener("load", function (e) {
  e.preventDefault();
  e.returnValue = ""; //show popup before leaving, DON'T Abuse this
});
```

DOMContentLoaded: JS and HTML Tree is built
load: all resources are downloaded
unload: before user leave

## Efficient Script Loading: defer and async

![Udemy_Jonas_Javascript_4.jpg](Udemy_Jonas_Javascript_4.jpg?raw=true)

Scripts In the head

- using async does not guarantee DOMContentLoaded fires after scrips are all executed
- ussing async does not guarantee the order of scripts
- defer make sure all scripts are executed and executed in order

# Object-Oriented Programming (OOP) with Javascript

## OOP in Javascript

### Classical OOP: Classes

- Behavior is copied from class to all instances
- Objects are instantiated from a class, which functions like a blueprint

### OOP in JS: Prototypes

- Objects are linked to a prototype object
- The prototype contains methods that are accessible to all objects linked to that prototype (Prototypal inheritance)

### Ways of creating objects

1. Constructor functions
   - Technique to create objects from a function
   - This is how built-in objects like Arrays, Maps, or Sets are actually implemented
2. ES6 Classes
   - Modern alternative to constructor function syntax
   - "Syntactic sugar", ES6 classes work exactly like constructor functions
   - ES6 classes do NOT behave like "Classical OOP"
3. Object.create()
   - Easiest and most straightforward way of linking an object to a prototype object

## Constructor Functions and the New Operator

- Arrow function does NOT work as constructor function because this keyword does NOT work
- Both function declaration and function expression works

```js
const Person = function (firstName, birthYear) {
  console.log(this); // Person {}
  this.firstName = firstName;
  this.birthYear = birthYear;

  /*Never do this*/
  //Because we will create new function copy each time when new object is created
  this.calAge = function () {
    console.log(2037 - this.birthYear);
  };
};

const jonas = new Person("Jonas", 1991);
console.log(jonas);
```

### new keyword procedure

1. new object {} is created
2. function is called, this keyword = {}
3. {} linked to prototype
4. function automatically return {}

## Prototypes

```js
Person.prototype.calAge = function () {
  console.log(2037 - this.birthYear); //here we have this point to the object which calls calAge()
};
const jonas = new Person("Jonas", 1986);
jonas.calAge(); //51

console.log(jonas.__proto__); //jonas' prototype object
console.log(jonas.__proto__ === Person.prototype); //true; instance's __proto__ always points to Constructor Function's prototype property

console.log(Person.prototype.isPrototypeOf(jonas)); //true
/*isPrototypeOf is called by this name is misleading, should be called as isPrototypeOfLinkedObject or something*/
console.log(Person.prototype.isPrototypeOf(Person)); //false
Person.prototype.species = "Homo Sepiant";

console.log(jonas.species);
console.log(jonas.hasOwnProperty("firstName")); //true
console.log(jonas.hasOwnProperty("species")); //false; since species is the prototype property
```

- calAge's function only creates once.
- calAge is not a method attached to jonas
- jonas get access to calAge
- calAge is attached to jonas.**proto**

```js
console.log(jonas);
//which will give us an object like below
/*
Person{firstName:"Jonas", birthYear:1986}
*/
//we can also see that jonas has a property which is called "__proto__" and constructor is Person function
//In this "_proto__", there's another property called "__proto__" and constructor is Object function
```

- Every object has a **proto** property
- **proto**'s constructor is the construction function of **proto**'s owner
- since **proto** itself is a object, **proto**'s **proto** is the Object function

![Udemy_Jonas_Javascript_5.png](Udemy_Jonas_Javascript_5.png?raw=true)

### Terminology: Prototypal Inheritance/ Delegation

When access instance property or method, if the target is not found, will look for property or method in instance's prototype which points to Constructor Function's prototype property.
If still not found, it will look up untill find the Object Constructor Function's prototype property which is null.

### Multiple Inheritance

```js
const SubType = function (name) {
  this.name = name;
};

const SuperType = function () {
  this.privateThing = "can't access from inherited instance";
};
SuperType.prototype.speed = 100;
SubType.prototype = new SuperType();

const sub = new SubType("Lei");
const sup = new SuperType(100);

console.log(sub.privateThing); //undefined
console.log(sub.speed); //100
console.log(sup);
console.log(sub);
```

## ES6 Classes

```js
//Class Expression
const PersonCL = class {};

//Class Declaration
class PersonCL {
  constructor(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  }

  calAge() {
    //In prototype
    console.log(2037 - this.birthYear);
  }
}

const lei = new PersonCL("Lei", 1986);
console.log(lei);
lei.calAge();

console.log(lei.__proto__ === PersonCL.prototype); //true
```

1. Class are not hoisted
2. Class can be first-class citizen (just special function)
3. Within class we can only use strict mode

## Setters and Getters

```js
const account = {
    owner: "Jonas",
    movements:[200, 300, 530, 120],
    get latest(){
        return this.movements.splice(-1).pop();
    }
    set latest(move){
        this.movements.push(move);
    }
}

console.log(account.latest);
account.latest = 50;
consoel.log(account.movements);

class PersonCL {
    constructor(firstName, birthYear){
        this.firstName = firstName;
        this.birthYear = birthYear;
    }

    calAge(){//In prototype
        console.log(2037 - this.birthYear);
    }

    get age(){
        return 2037 - this.birthYear;
    }
    set fullName(name){
        this.firstName = name;
    }
}
```

NOTE: Setter Function Name can NOT collapse with Property Name

```js
class PersonCL {
  constructor(firstName, birthYear) {
    this.fullName = firstName;
    this.birthYear = birthYear;
  }

  calAge() {
    //In prototype
    console.log(2037 - this.birthYear);
  }

  get age() {
    return 2037 - this.birthYear;
  }
  set fullName(name) {
    this.fullName = name;
  }
}
const p = new PersonCL("Lei", 1986);
p.fullName = "Qiu"; //ERROR
```

## Static Method

```js
class PersonCL {
  constructor(firstName, birthYear) {
    this.fullName = firstName;
    this.birthYear = birthYear;
  }

  calAge() {
    //In prototype
    console.log(2037 - this.birthYear);
  }

  get age() {
    return 2037 - this.birthYear;
  }
  set fullName(name) {
    this.fullName = name;
  }
  static hey() {
    console.log("Hey, Static Method!");
  }
}
PersonCL.Ho = function () {
  console.log("Ho, Static Method!");
};
PersonCL.Ho();
PersonCL.hey();
const p = new PersonCL("Lei", 1986);
p.hey(); //hey is not a function
```

## Object.create()

```js
const playerProto = {
  calAge() {
    //prototype
    console.log(2037 - this.birthYear);
  },
};
const p1 = Object.create(playerProto);
p1.birthYear = 1986;
p1.calAge(); //51
```

## Inheritance between classes: Constructor Functions

```js
const Person = function (fullName, birthYear) {
  this.fullName = fullName;
  this.birthYear = birthYear;
};

const Student = function (fullName, birthYear, course) {
  Person.call(this, fullName, birthYear);
  this.course = course;
};

Person.prototype.calAge = function () {
  console.log(2037 - this.birthYear);
};
Student.prototype = Object.create(Person.prototype); //Object.create only receive prototype object
Student.prototype.constructor = Student;

const s = new Student("Lei Zhong", 1986, "Computing Science");

s.calAge();
console.log(s);
```

## Inheritance between classes: ES6 Functions

```js
class PersonCL {
  constructor(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  }

  calAge() {
    //In prototype
    console.log(2037 - this.birthYear);
  }

  get age() {
    return 2037 - this.birthYear;
  }
  set fullName(name) {
    this.firstName = name;
  }
  static hey() {
    console.log("Hey, Static Method!");
  }
}

class StudentCL extends PersonCL {
  constructor(firstName, birthYear, course) {
    super(firstName, birthYear);
    this.course = course;
  }
  calAge() {
    //Override parent method; We can even override Parent Static Method
    console.log("Heart Breaks!");
  }
}

const s = new StudentCL("Lei", 1986, "CS");
s.calAge();
console.log(s.age);

StudentCL.hey(); //Static method is inherited
```

## Inheritance between classes: Object.create()

```js
const SuperType = function () {};
SuperType.prototype.speed = 100;

const newSup = Object.create(SuperType.prototype);
newSup.init = function () {
  //instance method
  console.log("Am I instance or prototype");
};

console.log(newSup);
```

# Section 16: Asynchronous JavaScript: Promises, Async/Await, and AJAX

## Our First AJAX Call: XMLHttpRequest

```js
const request = new XMLHttpRequest();
request.open("GET", "https://restcountries.com/v2/name/portugal");
request.send(); //Asynchronous call

request.addEventListener("load", function () {
  console.log(this.responseText); //request
  const [data] = JSON.parse(this.responseText);
});
```

## Welcome to Callback Hell

This is the reason we need Promise.

```js
setTimeout(() => {
  console.log("1 second passed");
  setTimeout(() => {
    console.log("2 seconds passed");
    setTimeout(() => {
      console.log("3 secondes passed");
    }, 1000);
  }, 1000);
}, 1000);
```

## Promises and the Fetch API

Promise is an object that is used as a placeholder for the future result of a asynchronous operation.

### Promise Lifecycle

PENDING ===> SETTLED

Promise is only settled once, and either is fulfilled or rejected. Before we Consume Promises we need to build promises and then consume it. With Fetch API, promises are built already.

## Consuming Promises

```js
fetch("https://restcountries.com/rest/v2/name/portugal")
  .then(function (response) {
    // this function only receive fulfilled promise
    return response.json(); // this json method is also async and returns a promise
  })
  .then(function (data) {
    console.log(data);
  });
```

## Chaining Promises

Common mistake sample

```js
fetch("https://restcountries.com/rest/v2/name/portugal")
  .then(function (response) {
    // this function only receive fulfilled promise
    return response.json(); // this json method is also async and returns a promise
  })
  .then(function (data) {
    console.log(data);
    const neighbour = data[0].borders[0];

    if (!neighbour) return;

    fetch(`https://restcountries.com/rest/v2/alpha/${neighbour}`)
      .then((response) => response.json())
      .then((data) => console.log(data)); //CALLBACK HELL
  });
```

Correct sample

```js
fetch("https://restcountries.com/rest/v2/name/portugal")
  .then(function (response) {
    // this function only receive fulfilled promise
    return response.json(); // this json method is also async and returns a promise
  })
  .then(function (data) {
    console.log(data);
    const neighbour = data[0].borders[0];

    if (!neighbour) return;

    return fetch(`https://restcountries.com/rest/v2/alpha/${neighbour}`);
  })
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## Handling Rejected Promises

By manual

```js
fetch("https://restcountries.com/rest/v2/name/portugal")
  .then(
    function (response) {
      // this function only receive fulfilled promise
      return response.json(); // this json method is also async and returns a promise
    },
    (err) => alert(err)
  )
  .then(function (data) {
    console.log(data);
    const neighbour = data[0].borders[0];

    if (!neighbour) return;

    return fetch(`https://restcountries.com/rest/v2/alpha/${neighbour}`);
  })
  .then(
    (response) => response.json(),
    (err) => alert(err)
  )
  .then((data) => console.log(data));
```

By catch

```js
const renderError = function (err) {};

fetch("https://restcountries.com/rest/v2/name/portugal")
  .then(function (response) {
    // this function only receive fulfilled promise
    return response.json(); // this json method is also async and returns a promise
  })
  .then(function (data) {
    console.log(data);
    const neighbour = data[0].borders[0];

    if (!neighbour) return;

    return fetch(`https://restcountries.com/rest/v2/alpha/${neighbour}`);
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => {
    console.error(err);
    renderError(err);
  }) //will catch all the error in the promises chain
  .finally(() => {
    //then is only called when it's fulfilled, catch is only called when it's rejected, finally is called both way
  });
```

## Throwing Errors Manually

However, catch DOES NOT catch errors for fulfilled promise, like 404. We have to throw this kind of error manually.

```js
const renderError = function (err) {};

fetch("https://restcountries.com/rest/v2/name/portugal")
  .then(function (response) {
    // this function only receive fulfilled promise
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json(); // this json method is also async and returns a promise
  })
  .then(function (data) {
    console.log(data);
    const neighbour = data[0].borders[0];

    if (!neighbour) return;

    return fetch(`https://restcountries.com/rest/v2/alpha/${neighbour}`);
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => {
    console.error(err);
    renderError(err);
  }) //will catch all the error in the promises chain
  .finally(() => {
    //then is only called when it's fulfilled, catch is only called when it's rejected, finally is called both way
  });
```

We need a helper function to avoid writing catch, throwing errors manually, parsing json over and over.

```js
const getJSON = function (url, errorMsg = "something is wrong") {
  fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return resopnse.json();
  });
};

const renderError = function (err) {};

getJSON("https://restcountries.com/rest/v2/name/portugal")
  .then(function (data) {
    console.log(data);
    const neighbour = data[0].borders[0];

    if (!neighbour) throw new Error("No neighbours");

    return getJSON(`https://restcountries.com/rest/v2/alpha/${neighbour}`);
  })
  .then((data) => console.log(data))
  .catch((err) => {
    console.error(err);
    renderError(err);
  }) //will catch all the error in the promises chain
  .finally(() => {
    //then is only called when it's fulfilled, catch is only called when it's rejected, finally is called both way
  });
```

## The Event Loop in Practice

Event loop plays the orchestration in the JS runtime. JS engine first execute sync codes. During this time, callbacks with async operations are fired to the webapis. When the async operation is done, callbacks are queued to callback que or microtask que(normal callback to the callback que, promises' callback to the microtask que). When JS engine finished the sync code execution, Event Loop decide which callback executes first. Microtask queues have priority over callback queues. When callback executes, other callbacks must wait till the end of execution.(Combine all of these is why setTimeout to 5000 CANNOT guarantee the callback executes at exact 5000 after)

```js
console.log("Test start");
setTimeout(() => console.log("0 sec timer"), 0);
Promise.resolve("Resolved promise 1").then((res) => console.log(res));
Promise.resolve("Resolved promise 2").then((res) => {
  for (let i = 0; i < 1000000000; i++) {}
  console.log(res);
});
console.log("Test end");
//Test start
//Test end
//Resolved promise 1
//Resolved promise 2
//0 sec timer
```

This sample proved that microtask queue(callback from promise) has priority over callback queue(callback from setTimeout).

## Building a Simple Promise

```js
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log("Lottery draw is happening...");
  //we simulate a async call here
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve("You WIN!");
    } else {
      reject(new Error("You LOST!"));
    }
  }, 2000);
});

lotteryPromise.then((res) => console.log(res)).catch((err) => console.log(err));

// promisifying setTimeout so that we avoid callback hell
const wait = function (miliseconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, miliseconds);
  });
};

wait(2000)
  .then(() => {
    return wait(1000);
  })
  .then(() => {
    console.log("finished");
  });

// promisifying XMLHttpRequest
const myFetch = function (url) {
  return new Promise(function (resolve, reject) {
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
      debugger;
      resolve(req.responseText);
    });
    req.addEventListener("error", () => {
      debugger;
      reject(req);
    });
    req.open("GET", url);
    req.send();
  });
};

myFetch("https://restcountries.com/v2/name/china")
  .then((res) => {
    console.log(JSON.parse(res));
  })
  .catch((error) => {
    console.error(error);
  });
```

# Section 17: Modern Javascript Development: Modules, Tooling, and Functional

## An Overview of Modules in Javascript

- Module is a reusable piece of code that encapsulates implementation details.

- Module is usually a standalone file.

for example:

```js
import { rand } from "./math.js";
const diceP1 = rand(1, 6, 2);
const diceP2 = rand(1, 6, 2);
const scores = { diceP1, diceP2 };
export { scores };
```

- In ES6, Modules are stored in files, exactly one module per file.

### ES6 Modules Files vs. Script Files

|                     | ES6 Module                                                 | Script        |
| ------------------- | ---------------------------------------------------------- | ------------- |
| Top-level variables | Scoped to module(only visible if you export it)            | Global        |
| Default mode        | Strict mode                                                | "Sloppy" mode |
| Top-level this      | undefined                                                  | window        |
| Imports and exports | YES, imports are hoisted(means they are always at the top) | NO            |
| HTML linking        | `<script type="module" />`                                 | `<script />`  |
| File downloading    | Asynchronous                                               | Synchronous   |

### How ES6 Modules are imported

```js
//index.js
import { rand } from "./math.js";
import { showDice } from "./dom.js";
const dice = rand(1, 6, 2);
showDice(dice);

//1. Parsing index.js
//  a. Modules are imported synchronously, (although modules files are downloaded asynchronously)
//  b. Modules are downloaded asynchronously.
//  c. Modules files are parsed
//  d. Linking imports to the exports from parsed module files. (the imported values are just pointer to the exported value in the module file)
//  e. execution of referenced module files
//2. Execution of index.js
```

## Exporting and Importing in ES6 Modules

Examples:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script type="module" defer src="script.js"></script>
  </head>
</html>
```

```js
//script.js
console.log("Importing module");
//---------------------------------------------------------------
// named export
// import { addToCart, totalPrice as price, qt, other } from "./shoppingCart.js";

// addToCart("bread", 5);
// console.log(price, qt, other);

//----------------------------------------------------------------
// import * as ShoppingCart from "./shoppingCart.js";

// ShoppingCart.addToCart("bread", 5);

//-----------------------------------------------------------------
// mixed default export and named export
import add, {
  addToCart,
  totalPrice as price,
  qt,
  other,
  cart,
} from "./shoppingCart.js";

add("pizza", 2);
console.log(cart); //Here, cart is filled with product, this proves that imported value is a pointer to the exported value.
```

```js
//shoppingCart.js
console.log("Exporting module");

const shippingCost = 10;
export const cart = [];

//named exports
export const addToCart = function (product, quantity) {
  cart.push({ product, quantity });
  console.log(`${quantity} of ${product} pushed to cart.`);
};

const totalPrice = 237;
const totalQuantity = 23;
const other = true;

export { totalPrice, totalQuantity as qt, other };

//default exports

export default function (product, quantity) {
  cart.push({ product, quantity });
  console.log(`${quantity} of ${product} pushed to cart.`);
}
```

## Top-Level await (ES2022)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script type="module" defer src="script.js"></script>
  </head>
</html>
```

```js
//script.js version 1.0

console.log("start fetching...");
const res = await fetch("https://jsonplaceholder.typicode.com/posts");
const data = await res.json();
console.log(data);
console.log("finished");

// Top-level await key words is blocking "finished" line if the network is slow.
```

```js
//script.js version 2.0

const getLastPost = async function () {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await res.json();
  console.log(data);

  return { title: data.at(-1).title, text: data.at(-1).body };
};

const lastPost = getLastPost();
lastPost.then(last => console.log(last););

const lastPost2 = await getLastPost();
console.log(lastPost2);
```

- Conclusion: if a imported module has toplevel-await, it will block the imported module as well as the importing module.

## Module Pattern

```js
const shoppingCart2 = (function () {
  const cart = [];
  const shippingCost = 10;
  const totalPrice = 237;
  const totalQuantity = 23;

  const addToCart = function (product, quantity) {
    cart.push({ product, quantity });
    console.log(`${quantity} of ${product} pushed to cart.`);
  };
  const orderStock = function (product, quantity) {
    console.log(`${quantity} ${product} ordered from supplier`);
  };

  return {
    addTOCart,
    cart,
    totalPrice,
    totalQuantity,
  };
})();

shoppingCart2.addToCart("apple", 4);
```

- Conclusion: Module Pattern works very well, but you need to be careful about the order of the script tags.

## CommonJS Modules

- CommonJS is important because it is used in NodeJS for a long time. and npm also used this. So CommonJS is built in feature in NodeJS environment.

```js
//This code only work in NodeJS, where export is an object in NODEJS
export.addToCart = function(product, quantity){
  cart.push({ product, quantity });
  console.log(`${quantity} of ${product} pushed to cart.`);
}

const {addToCart} = require("./shoppingCart.js");//commonJS specification
```

## Bundling With Parcel and NPM Scripts

- We need module bundler like Parcel/Webpack to bundle modules.

`npx parcel index.html`
`parcel build index.html` to build compressed version

## Configuring Babel and Polyfilling

- Babel can make old browsers compatible with our modern javascript code.

- Polyfilling,
