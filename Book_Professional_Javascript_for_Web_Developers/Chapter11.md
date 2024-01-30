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

const sucessCallback = (x) => console.log(`sucess: ${x}`);
const failureCallback = (x) => console.log(`failure: ${x}`);

double(3, successCallback, failureCallback);
double('b', successCallback, failureCallback);
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

double(3, successCallback, failureCallback);
```

## Promises
### The Promises/A+ Specification
### Promise Basics
```js
let p = new Promise(() => {}); // () => {} is a must
setTimeout(console.log, 0, p); // Promise <pending>
```
This is just a asynchronous operation that schedule a callback, which is `console.log`, with 0 millisecond delay, and the parameter of `console.log` is the newly created Promise object.

### The Promise State Machine

