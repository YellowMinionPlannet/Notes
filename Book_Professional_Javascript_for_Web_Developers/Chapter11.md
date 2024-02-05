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
Promise instance methods bridge the gap between synchronous and asynchronous code paths. Thay can:
1. access data returned from async operation
2. handle success and failure outcomes from promises
3. serially evaluate promises
4. add functions that only execute once the promise enters terminal state.

#### Implementing the Thenable Interface
Thenable interface looks like something:
```js
class MyThenable{
    then(){

    }
}
```
This interface will be revisited in later sections

#### `Promise.prototype.then()`
So this method accepts two optional handler, they correspondingly handle fulfilled and rejected state:
1. *onResolved* handler handles `resolve` state
2. *onRejected* handler handles `reject` state
```js
function onResolved(id){
    setTimeout(console.log, 0, id, 'resolved');
}

function onRejected(id){
    setTimeout(console.log, 0, id, 'rejected');
}

let p1 = new Promise((resolve, reject) => setTimeout(resolve, 3000));
let p2 = new Promise((resolve, reject) => setTimeout(reject, 3000));

p1.then(() => onResovled('p1'),
        () => onRejected('p1'));
p2.then(() => onResolved('p2'),
        () => onRejected('p2'));
// p1 resolved
// p2 rejected
```

Any non-function type argument to `then()` will be ignored silently.
```js
function onResolved(id){
    setTimeout(console.log, 0, id, 'resolved');
}

function onRejected(id){
    setTimeout(console.log, 0, id, 'rejected');
}

let p1 = new Promise((resolve, reject) => setTimeout(resolve, 3000));
let p2 = new Promise((resolve, reject) => setTimeout(reject, 3000));

// Non-function handlers are silently ignored, not recommended
p1.then('gobbeitygook');
// Skipping resolved handler
p2.then(null, () => onRejected('p2'));
```

`Promise.then()` will return a ***new*** promise instance.
```js
let p1 = new Promise(() => {});
let p2 = p1.then();
setTimeout(console.log, 0, p1);// Promise pending
setTimeout(console.log, 0, p2);// Promise pending
setTimeout(console.log, 0, p1 === p2); //false
```

- If it's a fulfilled promise:
- *onResolved* returns a new Promise and the return value of the handler is implicitly wrapped in `Promise.resolve()` to generate that new promise.
- If no handler function is provided, then original `resolve()` is returned(a new promise).
- If no `return` statement, the default return value is `undefined` and wrapped in a `Promise.resolve`

```js
let p1 = Promise.resolve("foo");
let p2 = p1.then();//No handler is provided
setTimeout(console.log, 0, p2);// Proimse resovled: foo

let p3 = p1.then(() => undefined); // no return
let p4 = p1.then(() => {}); // no return
let p5 = p1.then(() => Promise.resolve());// no return

setTimeout(console.log, 0, p3);// Promise resolved: undefined
setTimeout(console.log, 0, p4);// Promise resolved: undefined
setTimeout(console.log, 0, p5);// Promise resolved: undefined

let p6 = p1.then(() => "bar");
let p7 = p1.then(() => Promise.resolve("bar"));

setTimeout(console.log, 0, p6);// Promise resolved: bar
setTimeout(console.log, 0, p7);// Promise resolved: bar

let p8 = p1.then(() => new Promise(() => {}));
let p9 = p1.then(() => Promise.reject());

setTimeout(console.log, 0, p8);// Promise pending
setTimeout(console.log, 0, p9);// Promise rejected: undefined
```

- Throwing an exception will return a rejected promise
```js
let p10 = p1.then(() => {throw 'baz';});
setTimeout(console.log, 0, p10); // Promise rejected: baz
```

- If returning a error, not throwing a error, will result in a resolved Promise with result of Error
```js
let p1 = Promise.resolve("baz");
let p11 = p1.then(() => Error("qux"));
setTimeout(console.log, 0, p11);// Promise resolved: Error: qux
```

- If it's a rejected promise:
- Behavior is the same as fulfilled promise, however the result of rejected promise is implicitly wrapped in a `Promise.resolve` within the *onRejected* handler.
```js
let p1 = Promise.reject("foo");
let p2 = p1.then();//No handler is provided
setTimeout(console.log, 0, p2);// Proimse rejected: foo

let p3 = p1.then(null, () => undefined); // no return
let p4 = p1.then(null, () => {}); // no return
let p5 = p1.then(null, () => Promise.resolve());// no return

setTimeout(console.log, 0, p3);// Promise resolved: undefined
setTimeout(console.log, 0, p4);// Promise resolved: undefined
setTimeout(console.log, 0, p5);// Promise resolved: undefined

let p6 = p1.then(null, () => "bar");
let p7 = p1.then(null, () => Promise.resolve("bar"));

setTimeout(console.log, 0, p6);// Promise resolved: bar
setTimeout(console.log, 0, p7);// Promise resolved: bar

let p8 = p1.then(null, () => new Promise(() => {}));
let p9 = p1.then(null, () => Promise.reject());

setTimeout(console.log, 0, p8);// Promise pending
setTimeout(console.log, 0, p9);// Promise rejected: undefined
```

- Throwing an exception will return a rejected promise
```js
let p10 = p1.then(null, () => {throw 'baz';});
setTimeout(console.log, 0, p10); // Promise rejected: baz
```

- If returning a error, not throwing a error, will result in a resolved Promise with result of Error
```js
let p1 = Promise.reject("baz");
let p11 = p1.then(null, () => Error("qux"));
setTimeout(console.log, 0, p11);// Promise resolved: Error: qux
```

#### `Promise.prototype.catch()`
This is just a syntax sugar of `Promise.prototype.then(null, onRejected)`
```js
let p1 = new Promise(() => {});
let p2 = p1.catch();
setTimeout(console.log, 0, p1); // Promise pending
setTimeout(console.log, 0, p2); // Promise pending
setTimeout(console.log, 0, p1 === p2);// false
```

#### `Promise.prototype.finally()`
If you have same logic for *onResolved* handler and *onRejected* handler, you can use `Promise.prototype.finally()` to avoid code duplication. Because it will accept one handler to execute as long as the promise is reaching fulfilled or rejected state.
```js
let p1 = new Promise(() => {});
let p2 = p1.finally();
setTimeout(console.log, 0, p1); // Promise pending
setTimeout(console.log, 0, p2); // Promise pending
setTimeout(console.log, 0, p1 === p2);// false
```

`Promise.prototype.finally()` acts differently than `Promise.prototype.catch()` and `Promise.prototype.then()`, 
1. in most cases, for resolved case, **it will behave as a passthrough for the parent promise.**
2. if throw error or return rejected promise within `Promise.prototype.finally()`, then pending or rejected is returned.
```js
let p1 = Promise.resolve("foo");

let p2 = p1.finally(); // no handler provided
setTimeout(console.log, 0, p2);// Promise resolved: foo

let p3 = p1.finally(() => undefined); // no return value
setTimeout(console.log, 0, p3);// Promise resolved: foo

let p4 = p1.finally(() => {}); // no return value
setTimeout(console.log, 0, p4);// Promise resolved: foo

let p5 = p1.finally(() = Promise.resolve());// no return value
setTimeout(console.log, 0, p5);// Promise resolved: foo

let p6 = p1.finally(() => "bar"); 
setTimeout(console.log, 0, p6);// Promise resolved: foo

let p7 = p1.finally(() => Promise.resolve("bar"));
setTimeout(console.log, 0, p7);// Proimse resolved: foo

let p8 = p1.finally(() => Error("qux"));
setTimeout(console.log, 0, p8);// Promise resolved: foo

let p9 = p1.finally(() => new Promise(() => {}));
let p10 = p1.finally(() => Promise.reject());

setTimeout(console.log, 0, p9); // Promise pending
setTimeout(console.log, 0, p10);// Promise rejected: undefined

let p11 = p1.finally(() => {throw "baz";});
setTimeout(console.log, 0, p11);// Promise rejected: baz
```

3. as long as the handler is passing a resolved promise, `Promise.prototype,finally()` will still act like a passthrough.
```js
let p1 = Promise.resolve("foo");

let p2 = p1.finally(() => new Promise((resolve, reject) => setTimeout(() => resolve("bar"), 100)));

setTimeout(console.log, 0, p2);// Promise pending
setTimeout(() => setTimetout(console.log, 0, p2), 200); // Promise resolved: foo
```

#### Non-Reentrant Promise Methods
*non-reentrant* means the execution for handler of a settled promise, either *onResolved* handler or *onRejected* handler, will happen after the synchronous code follows the attaching logic.
```js
let p = Promise.resolve();

p.then(() => console.log("onFufilled handler"));

console.log("then() returns");
// then() returns
// onFufilled handler
```

Another example also demonstrates that *non reentrant* is guaranteed.
```js
let synchronousResolve;

let p = new Promise((resolve) => {
    synchronousResolve = function(){
        console.log("1: invoking resolve()");
        resolve();
        console.log("2: resolve() returns");
    };
});

p.then(() => console.log("4: then() handler executes"));

synchronousResolve();
console.log("3: synchronousResolve() returns");

// 1: invoking resolve()
// 2: resolve() returns
// 3: synchronousResolve() returns
// 4: then() handler executes
```

#### Sibling Handler Order of Execution
If multiple handlers are attached to a promise, when that promise settles, the handlers will be executed as the order of attaching.
```js
let p1 = Promise.resolve();
let p2 = Promise.reject();

p1.then(() => console.asyncLog(1));
p2.then(() => console.asyncLog(2));
// 1
// 2
p2.then(null, () => console.asyncLog(3));
p2.then(null, () => console.asyncLog(4));
// 3
// 4
p2.catch(() => console.asyncLog(5));
p2.catch(() => console.asyncLog(6));
// 5
// 6
p1.finally(() => console.asyncLog(7));
p1.finally(() => console.asyncLog(8));
// 7
// 8
```

#### Fulfilled Value and Rejected Reason Passing
Passing the returned values from Promise can be achieved through the first argument of `resolve`/ `reject` function, and the returned value will be the sole parameter of `onFufilled` handler and `onRejected` handler.
```js
let p1 = new Promise((resolve, reject) => resolve("foo"));
p1.then((value) => console.log(value)); // foo

let p2 = new Promise((resolve, reject) => reject("bar"));
p2.catch((reason) => console.log(reason));// bar

let p1 = Promise.resolve("foo");
p1.then((value) => console.log(value));

let p2 = Promise.reject("bar");
p2.catch((reason) => console.log(reason));
```

### Rejecting Promises and Rejection Error Handling
Rejecting a promise and throwing errors in promise executor or handler will cause promise to reject. The logic should force a discontinuation of subsequent operations.
```js
let p1 = new Promise((resolve, reject) => reject(Error("foo")));
let p2 = new Promise((resolve, reject) => {throw Error("foo")});
let p3 = Promise.resolve().then(() => {throw Erorr("foo")});
let p4 = Promise.reject(Error("foo"));

console.asyncLog(p1);// Promise rejected Error: foo
console.asyncLog(p2);// Promise rejected Error: foo
console.asyncLog(p3);// Promise rejected Error: foo
console.asyncLog(p4);// Promise rejected Error: foo  

// ORDER:
// p1, p2, p4, p3 
// This is because resolve() and then() method needs to create addintional promise
```

Let's see the difference of Error handling in synchronous and asynchronous operations.
```js
throw Error("foo");
console.log("bar"); // This will never executed

Promise.reject(Error("foo"));
console.log("bar"); // bar
```

```js
// Correct
Promise.reject(Error("error")).catch((e) => {});
// Incorrect
try{
    Promise.reject(Error("foo"));
}catch(e){

}

let p = new Promise((resolve, reject) => {
    try{
        throw Error("foo");
    }catch(e){

    }
    resolve("bar");
});

console.log(p);// Promise fulfilled: bar
```