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

### Promise Chaining and Composition
Combining multiple promises has 2 major ways:
1. promise chaining, promise will execute one by one
2. promise composition, promise will be combined into a single promise

#### Promise Chaining
Achieving promise chaining by instance methods, such as `then()`, `catch()`, and `finally()`. They will all return a new instance of promise, and can be chained by themselves again.
```js
let p = new Promise((resolve, reject) => {
    console.log("first");
    resolve();
});

p.then(() => console.log("second"))
.then(() => console.log("third"))
.then(() => console.log("fourth"));
// first
// second
// third
// fourth
```
Another promise chaining example which sequence the async operations.
```js
let p1 = new Promise((resolve, reject) => {
    console.log("p1 executor");
    setTimeout(resolve, 1000);
} );
p1.then(() => new Promise((resolve, reject) => {
    console.log("p2 executor");
    setTimeout(resolve, 1000);
}))
.then(() => new Promise((resolve, reject) => {
    console.log("p3 executor");
    setTimeout(resolve, 1000);
}))
.then(() => new Promise((resolve, reject) => {
    console.log("p4 executor");
    setTimeout(resolve, 1000);
}))
// p1 executor
// p2 executor
// p3 executor
// p4 executor
// exectued one by one after 1s
```

So we can generate a factory function
```js
function delayedResolve(str){
    return new Promise((resolve, reject) => {
        console.log(str);
        setTimeout(resolve, 1000);
    })
}

delayedResolve("p1 executor")
.then(() => delayedResolve("p2 executor"))
.then(() => delayedResolve("p3 executor"))
.then(() => delayedResolve("p4 executor"))
```

Let's look at what will happen if we don't have `then()` and Promise
```js
function delayedExecute(str, callback = null){
    setTimeout(() =>{
        console.log(str);
        callback && callback();
    }, 1000)
}

delayedExecute("p1 executor", () => {
    delayedExecute("p2 executor", () => {
        delayedExecute("p3 executor", () =>{
            delayedExecute("p4 executor");
        })
    })
})
```

#### Using `Promise.all()` (promise composiiton)
This will create a promise that will be settled if all promises in the collection(iterable) is settled.
```js
//Following comments are the print result from codepen.io console

let p1 = Promise.all([
    Promise.resolve(),
    Promise.resolve()
]);
console.log(p1); // Promise pending, promiseState: fulfilled, promiseResult: 0: undefined, 1: undefined

let p2 = Promise.all([3, 4]);
console.log(p2); // Promise pending, promiseState: fulfilled, promiseResult: 0: 3, 1: 4

let p3 = Promise.all([]);
console.log(p3); // Promise fufilled, promiseState: fulfilled, promiseResult: Array(0)

let p4 = Promise.all();
// TypeError: cannot read Symbol.iterator of undefined

let p = Promise.all([Promise.resolve(), new Promise(() => setTimeout(resolve, 1000))]);
console.asyncLog(p);

p.then(() => console.asyncLog("all() fulfilled!"));
// all() fulfilled
```

- If one promise rejects, the composed promise rejects;
- If at least one promise pending, the composed promise remains pending:
```js
let p1 = Promise.all([new Promise(() => {})]);
console.log(p1);// Promise pending

let p2 = Promise.all([Promise.resolve(), Promise.reject(), Promise.resolve()]);
console.log(p2);// Promise reject: undefined
```

- If composed promise is resolved, the return value will be an Array.
```js
let p = Promise.all([
    Promise.resolve(3),
    Promise.resolve(),
    Promise.resolve(4)
]);

p.then((values) => console.log(values));// [3, undefined, 4]
```

- If one promise rejects, the first rejection will be the reject reason of composed promise. Later rejections' behavior is not affected, though later ones' reasons would have no effect on the composed one.
```js
let p = Promise.all([
    Promise.reject(3),
    new Promise((reject) => setTimeout(reject, 1000))
])

p.catch((reason) => console.log(reason)); // 3
```

#### Using `Promise.allSettled()`
The composed promise is settled if all contained promises are settled. The result will be different from `Promise.all()`, it will show all the result in an Array, of which element would be either fulfilled or rejected and contain value or reason.
```js
let p1 = Promise.allSettled([
    Promise.resolve(),
    Promise.reject()
]);

console.log(p1); // Promiese pending: promiseState: fulfilled, promiseResult: [{status: fufilled, value: undefined}, {status: rejected, reason: undefined}]

let p2 = Promise.allSettled([3, 4]);
console.log(p2);// Promise pending: promiseState: fulfilled, promiseResult: [{status: fulfilled, value: 3}, {status: fulfilled, value: 4}]

let p3 = Promise.allSettled([]);//Promise fulfilled: promiseState: fulfilled, promiseResult: Array(0)

let p4 = Promise.allSettled()//TypeError: cannot read Symbol.iterator of undefined
```

- Here is example of how to iterate result of `Promise.allSettled()`
```js
Promise.allSettled([fetchDataFromAPI1(), fetchDataFromAPI2(), fetchDataFromAPI3()])
.then((results) =>{
    results.map((result, i) => {
        if(result.status === "fulfilled"){
            console.log(`API ${i} data:`, result.value);
        }else{
            console.log(`API ${i} error:`, result.reason);
        }
    })
});
```

#### Using `Promise.race()`
This composed promise will be settled if any contained promise is settled.
```js
let p1 = Promise.race([Promise.resolve(), Promise.resolve()]);
console.log(p1);// Promise pending: promiseState: fulfilled promiseResult: undefined

let p2 = Promise.race([3, 4]);
console.log(p2);// Promise pending: promiseState: fulfilled promiseResult: 3

let p3 = Promise.race([]);
console.log(p3);// Promise pending: promiseState: pending

let p4 = Promise.race();
//TypeError: cannot read Symbol.iterator of undefined

let p5 = Promise.race([
    Promise.resolve(3),
    new Promise((resolve, reject) => setTimeout(reject, 1000))
]);
console.log(p5);// Promise fulfilled: 3

let p6 = Promise.race([Promise.reject(4),
    new Promise((resolve, reject)=>{setTimeout(resolve,1000);})
]);
console.log(p6);// Promise rejected: 4

let p7 = Promise.race([Promise.resolve(5), Promise.resolve(6), Promise.resolve(7)]);
console.log(p7)// Promise fulfilled: 5
```

```js
let p = Promise.race([Promise.resolve(1), Promise.reject(0)]);
console.log(p); // Promise fulfilled: 1
```

#### Using `Promise.any()`
1. The composed promise is settled if any of contained promises are settled.
2. Once first promise is settled, the rest promises are short-circuited.(killed)
```js
let p1 = Promise.any([Promise.resolve(), Promise.reject()]);
console.log(p1);// Promise pending: promiseState: fulfilled, promiseResult: undefined

let p2 = Promise.any([3, 4]);
console.log(p2);// Promise pending: promiseState: fulfilled, promiseResult: 3

let p3 = Promise.any([])
console.log(p3);// Promise rejected: AggregateError: All promises were rejected

let p4 = Promise.any();
// TypeError: cannot read Symbol.iterator of undefined
```

```js
let p = Promise.any([
    new Promise((resolve, reject) => setTimeout(resolve, 1000, "first")),
    new Promise((resolve, reject) => setTimeout(resolve, 2000, "second"))
]);
console.log(p);

p.then((value) => console.log(value));
// first
```
If all contained promises reject, the composed promise will also reject. AggregateError instance contains all rejection reasons.
How to catch all errors?
```js
Promise.any([
    fetchDataFromAPI1(),
    fetchDataFromAPI2(),
    fetchDataFromAPI3()
]).then((data)=>{
    console.log("Fastest data:", data)
}).catch((error)=>{
    if(error instanceof AggregateError){
        console.log("All promises rejected. Errors:", error.errors);
    }else{
        console.log("Unknown error:", error)
    }
})
```

#### Serial Promise Composition
For promises chaining, we are doing is serializing executions. This is analogous to *function composition*.
Example of *function composition*
```js
function addTwo(x) { return x + 2;}
function addThree(x) {return x + 3;}
function addFive(x) {return x + 5;}

function addTen(x){
    return addFive(addTwo(addThree(x)));
}
console.log(addTen(7)) // 17
```

We can re-write *function composition* with promise composition.
```js
function addTwo(x) { return x + 2;}
function addThree(x) {return x + 3;}
function addFive(x) {return x + 5;}

function addTen(x){
    return Promise.resolve(x)
    .then(addTwo)
    .then(addThree)
    .then(addFive);
}

addTen(8).then(console.log); // 18
```

This can be fashioned into a more succinct form using `Array.prototype.reduce()`
```js
function addTwo(x) { return x + 2;}
function addThree(x) {return x + 3;}
function addFive(x) {return x + 5;}

function addTen(x){
    return [addTwo, addThree, addFive].reduce((promise, fn)=> promise.then(fn), Promise.resolve(x));
}

addTen(8).then(console.log); // 18
```

More,
```js
function addTwo(x) { return x + 2;}
function addThree(x) {return x + 3;}
function addFive(x) {return x + 5;}

function compose(...fns){
    return (x) => fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(x))
}

let addTen = compose(addTwo, addThree, addFive);

addTen(8).then(console.log);
```

#### Promises and the Microtask Queue
So, there are *message queue* and *microtask queue* in JavaScript engine. *microtask queue* has higher priority than *message queue*.
```js
console.log("1");
setTimeout(console.log, 0, "4");// add to message queue
Promise.resolve("3").then(console.log);// add to the microtask queue
console.log("2")
// 1
// 2
// 3
// 4
```

### Avoiding Unhandled Rejections
There are several occasions for unhandled rejections that can lead to unhandled errors. You can observe these by adding `unhandledrejection` event listener handler, and you can fix these by adding *onRejected* handler.
```js
Promise.reject("foo");
// Uncaught (in promise) foo

//Observing
window.addEventListener("unhandledrejection", () => console.log("UNHANDLED"));
Promsie.reject("foo");
//UNHANDLED
//Uncaught (in promise) foo

//Fixing
window.addEventListener("unhandledrejection", () => console.log("UNHANDLED"));
Promise.reject("foo").catch(() =>{});
Promise.reject("foo").then(null, () => {});
// NO console output
```

`Promise.allSettled` will not throw any uncaught error if there's a rejection.

To detect rejection that is already handled, 
```js
window.addEventListener("rejectionhandled", () => console.log("HANDLED LATE"));
const p = Promise.reject();
setTimeout(() => p.catch(() => {}), 1000);
// HANDLED LATE
```

### Promise Extensions
- There are several extended feature which not included in the standard ECMAScript, like cancel promise and promise progress.

#### Promise Canceling
[github opensource library](https://github.com/tc39/proposal-cancelable-promises)

```html
<button id="start">Start</button>
<button id="cancel">Cancel</button>

<script>
    class CancelToken{
        constructor(cancelFN){
            this.promise = new Promise((resolve, reject)=>{
                cancelFN(() => {
                    console.log("delay cancelled");
                    resolve();
                })
            })
        }
    }

    const startButton = document.querySelector("#start");
    const cancelButton = document.querySelector("cancel");

    function cancellableDelayedResolve(delay){
        console.log("set delay");
        return new Promise((resolve, reject)=>{
            const id = setTimeout(() =>{
                console.log("delayed resolve");
                resolve();
            }, delay);

            const cancelToken = new CancelToken((cancelCallback) =>
                cancelButton.addEventListener("click", cancelCallback);
            );
            cancelToken.promise.then(() => clearTimeout(id));
        })
    }

    startButton.addEventListener("click", () => cancellableDelayedResolve(1000));
</script>
```

#### Promise Progress Notifications

### Async Funtions
#### The `async` keyword

`async` can be prepended to:
1. function declarations
2. function expressions
3. arrow functions
4. methods

```js
async function foo(){}
let bar = async funtion () {};
let baz = async () => {};
class Qux{
    async qux(){}
}
```

When prepending `async` to a function, that function still run as normal synchronous function.
```js
async function foo (){
    console.log(1);
}

foo();
console.log(2);
//1
//2
```
- `async` function with `return` will automatically converted into a promise object with `Promise.resolve()`. 
```js
async function foo(){
    console.log(1);
    return 3;
}

foo().then(console.log);

console.log(2);
// 1
// 2
// 3
```

`async` function anticipates but not requires a **thenable** object. 
```js
// return a primitive
async function foo(){
    return "foo";
}
foo().then(console.log);
// foo

// return a non-thenable object
async function bar(){
    return ["bar"];
}
bar().then(console.log);
// ["bar"]

// return a thenable non-promise object
async function baz(){
    const thenable = {
        then(callback){
            callback("baz");
        }
    }
}
// baz

// return a promise
async function qux(){
    return Promise.resolve("qux");
}
qux().then(console.log);
// qux
```

If `async` funtion throw a error, it will return a rejection.
```js
async function foo(){
    console.log(1);
    throw 3;
}

foo().catch(console.log);
console.log(2);
//1
//2
//3
```
A promise rejection will not be caught by `async` function
```js
async function foo(){
    console.log(1);
    Promise.reject(3);
}

foo().catch(console.log);
console.log(2);
//1
//2
//uncaught (in promise): 3
```

#### The `await` keyword
Using `await` to rewrite:
```js
//Original
let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));

p.then((x) => console.log(x));

//Re-Write
async function foo(){
    let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));
    console.log(await p);
}
foo();
```

- `await` keyword is just like `yield` keyword, it release the JavaScript runtime's thread of execution. "unwrap" the value of that object, the object follows the `await`. And asynchronously resume execution of the async function.

- `await` keyword anticipates but not requires a thenable object.
- If synchronous operation throws an error, then `await` return a rejected promise.
- Promise.reject() will be captured by `await`

```js
// Asynchronously print "foo"
async function foo(){
    console.log(await Promise.resolve("foo"));
}
foo();
// foo

// Asynchronously print "bar"
async function bar(){
    return await Promise.resolve("bar");
}
bar().then(console.log);
// bar

//Asynchronously print "baz" after 1000ms
async function baz(){
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    console.log("baz");
}
baz();
// baz after 1000ms
```

```js
async function baz(){
    const thenable = {
        then(callback){callback("baz");}
    };
    console.log(await thenable);
}
baz();
//baz
```

```js
async function foo(){
    console.log(1);
    await (() => {throw 3;})();
}
foo().catch(console.log);
console.log(2);
//1
//2
//3

async function foo(){
    console.log(1);
    await Promise.reject(3);
    console.log(4); // never print
}
foo().catch(console.log);
console.log(2);
//1
//2
//3
```

#### Restrictions on `await`
`await` must be used inside `async` function.

`await` can also make `for-of` loop behave asynchronously
```js
for await (let varibale of iterable){
    //code to be executed
}
```
This could be used in any object that has a `Symbol.asyncIterator` method.

```js
async function getRandomNumber(i){
    return new Promise(resolve => {
        console.log(i);
        setTimeout(resolve, 1000, Math.random());
    })
}

async function printRandomNumbers(){
    for await (const x of Array.from(Array(5).keys()).map(getRandomnumber)){
        console.log(x);
    }
    console.log("loop has exited");
}

printRandomNumbers();
//0
//1
//2
//3
//4

//random numbers ...
//loop has exited
```
```js
async function* asyncIterable(array){
    for(const item of array){
        await new Promise(resolve => setTimeout(resolve, 1000));
        yield item;
    }
}
const myArray = [1, 2, 3];
for await (const item of asyncIterable(myArray)){
    console.log(item);
}
```

#### Strategies for Async Functions

##### Implementing `Sleep()`
```js
async function sellp(delay){
    return new Promise(resolve => setTimeout(resolve, delay));
}

async function foo(){
    const t0 = Date.now();
    await sleep(1500);
    console.log(Date.now() - t0);
}

foo();
//1502
```

##### Maximizing Parallelization
- To execute **IN ORDER**
```js
async function randomDelay(id){
    const delay = Math.random() * 1000;
    return new Promise((resolve) => setTimeout(() => {
        console.log(`${id} finished`);
        resolve();
    }, delay));
}

async function foo(){
    const t0 = Date.now();
    await randomDelay(0);
    await randomDelay(1);
    await randomDelay(2);
    await randomDelay(3);
    await randomDelay(4);
    console.log(`${Date.now() - t0}ms elapsed`);
}
foo();
```

```js
async function randomDelay(id){
    const delay = Math.random() * 1000;
    return new Promise((resolve) => setTimeout(() => {
        console.log(`${id} finished`);
        resolve();
    }, delay));
}

async function foo(){
    const t0 = Date.now();
    for(let i = 0; i < 5; ++i){
        await randomDelay(i);
    }
    console.log(`${Date.now() - t0}ms elapsed`);
}
foo();
```
- To execute **Parallely**
```js
async function randomDelay(id){
    const delay = Math.random() * 1000;
    return new Promise((resolve) => setTimeout(() => {
        console.log(`${id} finished`);
        resolve();
    }, delay));
}

async function foo(){
    const t0 = Date.now();
    const p0 = randomDelay(0);
    const p1 = randomDelay(1);
    const p1 = randomDelay(2);
    const p1 = randomDelay(3);
    const p1 = randomDelay(4);

    await p0;
    await p1;
    await p2;
    await p3;
    await p4;
    
    console.log(`${Date.now() - t0}ms elapsed`);
}
foo();
```
```js
async function randomDelay(id){
    const delay = Math.random() * 1000;
    return new Promise((resolve) => setTimeout(() => {
        console.log(`${id} finished`);
        resolve();
    }, delay));
}

async function foo(){
    const t0 = Date.now();

    const promises = Array(5).fill(null).map((_, i) => randomDelay(i));

    for(const p of promises){
        console.log(`awaited ${await p}`);
    }

    console.log(`${Date.now() - t0}ms elapsed`);
}
foo();
```

##### Serial Promise Execution
```js
function addTwo(x) {return x + 2;}
function addThree(x) {return x + 3;}
function addFive(x) {return x + 5;}

async function addTen(x){
    for(const fn of [addTwo, addThree, addFive]){
        x = await fn(x)
    }
    return x;
}

addTen(9).then(console.log); // 19
```
```js
async function addTwo(x) {return x + 2;}
async function addThree(x) {return x + 3;}
async function addFive(x) {return x + 5;}

async function addTen(x){
    for(const fn of [addTwo, addThree, addFive]){
        x = await fn(x)
    }
    return x;
}

addTen(9).then(console.log); // 19
```

##### Stack Traces and Memory Management
##### Rejection-Safe Parallelization