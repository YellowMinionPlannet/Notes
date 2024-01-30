# 11 Promises and Async Functions

## Introduction to Asynchronous Programming
### Synchronous vs. Asynchronous JavaScript
- *Synchronous behavior*, to execute sequential.
- *Asynchronous behavior*, where an entity external to the current process is able to trigger code execution.

We use asynchronous behavior because it's not feasible to force the only thread/process to wait a long time for an time consuming operation to complete.

```js
let x = 3;
setTimeout(() => x = x + 4, 1000);
```
The second chunk of instructions(which is x = x + 4) are triggered by a system timer, which will generate a interrupt to enqueue execution. When this interrupt will be triggered is not known, although it is guaranteed to be after the current thread of synchonous execution completes.

And also when the `x` is ready to use? Which means `x` is updated, there must be some mechanism to signal rest of program that x is updated.

### Legacy Asynchronous Programming Patterns
We can use callback function to perform asynchronous operation. It is hard to serialize asynchronous operations.
```js
function double(value){
    setTimeout(() => setTimeout(console.log, 0, value * 2), 1000)
}

double(3);
```

`setTimeout` allows for the callback is scheduled to the message queue and execute after specified time. Then this callback is dequeued and executed with unknown manner. Remember, `double()` exits immediately after setTimeout scheduling operation is successful.(I think scheduling happens right away)

#### Returning Asynchronous Values
```js
function double(value, callback){
    setTimeout(() => callback(value * 2), 1000);
}

double(3, (x) => console.log(`I was given: ${x}`));
```

Note: closure is involved here.

#### Handling Failure
```js
function double(value, success, failure){
    setTimeout(() => {
        try{
            if(typeof value !== 'number'){
                throw 'Must provide number as first argument';
            }
            sucess(2 * value);
        }catch(e){
            failure(e);
        }
    }, 1000);
}

const sucessCallback = (x) => console.log(`success: ${x}`);
const failureCallback = (x) => console.log(`failure: ${x}`);

double(3, successCallback, failureCallback); // success: 
double('b', successCallback, failureCallback); // failure: 
```

#### Nesting Asynchronous Callbacks
```js
function double(value, success, failure){
    setTimeout(() => {
        try{
            if(typeof value !== 'number'){
                throw 'Must provide number as first argument';
            }
            sucess(2 * value);
        }catch(e){
            failure(e);
        }
    }, 1000);
}

const successCallback = (x) => {
    double(x, (y) => console.log(`success: ${y}`));
}
const failureCallback = (e) => console.log(`failure: ${e}`);

double(3, successCallback, failureCallback);// 12
```

## Promises
### The Promises/A+ Specification
### Promise Basics
```js
let p = new Promise(() => {}); // () => {} is a must
setTimeout(console.log, 0, p); // Promise <pending>
```
This is just a asynchronous operation that schedule a callback, which is `console.log`, with 0 millisecond delay, and the parameter of `console.log` is the newly created Promise object.

#### The Promise State Machine

- Every `Promise` has two state: *pending* and *settled*.
- For *settled*, there are two result, *fulfilled* which means success, and *rejected* which means failure.
- Once `Promise` is transitioned to *settled*, the state can never be changed.(irreversible)
- The state can not be mutated by external JavaScript.
- There are 2 primary reason for `Promise`:
    1. to abstractly represents ablock of asynchronous execution
    2. The state of `Promise` describe the status of async execution.

#### Resolved Values, Rejection Reasons, and Utility of Promises
#### Controlling Promise State with the Executor
Executor is the parameter when you create a new `Promise` object. It has two primary duties:
1. initialize the async behavior
2. control the eventual state transition

For controlling the transition state, executor is able to have two function parameters, typically named `resolve` and `reject`. By invoking `resolve` leads to *fulfilled* state, and by invoking `reject` leads to *rejected* state.
```js
let p1 = new Promise((resolve, reject) => resolve());
setTimeout(console.log, 0, p1);// Promise resolved

let p2 = new Promise((resolve, reject) => reject());
setTimeout(console.log, 0, p2);// Promise rejected
//Also have uncaught error here
```

The executor function is executed right away, to prove this, please see snippet below:
```js
new Promise(() => setTimeout(console.log, 0, "executor"));
setTimeout(console.log, 0, "Promise Initialized");
//executor
//Promise Initialized
```
Once the `Promise` is transitioned, the state cannot be mutate.
```js
let p = new Promise((resolve, reject) => {
    resolve();
    reject();
});

setTimeout(console.log, 0, p);// Promise resolved
```

You can avoid promise get stuck in a pending state by adding max timed exit behavior.
```js
let p = new Promise((resolve, reject) => {
    setTimeout(reject, 10000);
    //other executor thing
});

setTimeout(console.log, 0, p);// Promise pending
setTimeout(console.log, 11000, p);// Promise reject
```

#### Promise Casting with `Promise.resolve()`
You don't have to make transition by executor function only. You can also use `Promise.resolve()`.
```js
let p1 = new Promise((resolve, reject) => resolve());
let p2 = Promise.resolve();

setTimeout(console.log, 0, Promise.resolve());
// Promise resolved
setTimeout(console.log, 0, Promise.resolve(3));
// Promise resolved 3
setTimeout(console.log, 0, Promise.resolve(4, 5, 6));
// Promise resolved 4
```

So if `Promise.resolve()`'s argument is already a `Promise`, then the result of `Promise.resolve` will be the same `Promise` that keeps the original state.
```js
let p = new Promise(() => {});

setTimeout(console.log, 0, p); // Promise pending
setTimeout(console.log, 0, Promise.resolve(p)); // Promise pending
setTimeout(console.log, 0, p === Promise.resolve(p)); //true
```

`Promise.resolve()`, you can pass anything, but beware of unintended result.
```js
let p = Promise.resolve(new Error('foo'));

setTimeout(console.log, 0, p);
// Promise resolved Error foo
```

#### Promise Rejection with `Promise.reject()`
This has different behavior compared to `Promise.resolve()`. If it is a rejected promise and throw an async error, which will not be catched by `try/catch` block and can only be handled with rejection handler.

```js
let p = Promise.reject();
setTimeout(console.log, 0, p); // Promise rejected 3

p.then(null, (e) => setTimeout(console.log, 0, e)); // 3
// rejection handler defined here
```

#### Synchronous/Asynchronous Execution Duality

```js
try{
    throw new Error('foo');
}catch(e){
    console.log(e); // Error: foo
}

try{
    Promise.reject(new Error('bar'));
}catch(e){
    console.log(e);
}
//Uncaught Error
```

### Promise Instance Methods
