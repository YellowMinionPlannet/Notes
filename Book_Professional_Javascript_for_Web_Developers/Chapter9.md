# 9 Proxies and Reflect

To intercept and shim(interfere) additional behavior into fundamental operations.

## Proxy Fundamentals

Coder can manipulate a object directly, or manipulate a object through proxy.

### Creating a Passthrough Proxy

By default, all operations performed on a proxy object will be transparently propagated through to the target object.

Proxy is created using the Proxy constructor, it requires you to provide:
1. target object
2. handler object

For a simple passthrough proxy, using a simple object literal for the handler object will allow all operations to reach the target object.

```js
const target = {
    id: 'target'
}

const handler = {}

const proxy = new Proxy(target, handler);

console.log(target.id);//target
console.log(proxy.id);//target

target.id = 'foo';
console.log(target.id);//foo
console.log(proxy.id);//foo

proxy.id = 'bar';
console.log(target.id);//bar
console.log(proxy.id);//bar

console.log(target.hasOwnProperty('id'));//true
console.log(proxy.hasOwnProperty('id'));//true

console.log(proxy === target);//false
```

### Defining Traps

The concept of *trap* is borrowed from operating system:

*a trap is a synchronous interrupt in program flow that deverts processor execution to execute a subroutine before returning to the original program flow.*

Example to define a *get()* trap
```js
const target = {
    foo: 'bar'
}

const handler = {
    get(){
        return 'handler override';
    }
}

const proxy = new Proxy(target, handler);
// When a get() operation is called on proxy object, the defined trap function will be invoked. Operations of form proxy[property], proxy.property, Object.create(proxy)[property] will all invoke the trap function. Only proxy object will use trap function, the same form of operations will not invoke trap function if they are used with the target object.

console.log(target.foo);//bar
console.log(proxy.foo);//handler override

console.log(target['foo']);//bar
console.log(proxy['foo']);//handler override

console.log(Object.create(target)['foo']); //bar
console.log(Object.create(proxy)['foo']);//handler override
```

### Trap Parameters and the Reflect API
Traps can access to parameters.

```js
const target = {
    foo: 'bar'
}

const handler = {
    get(trapTarget, property, receiver){
        console.log(trapTarget === target);
        console.log(property);
        console.log(receiver === proxy);
    }
}

const proxy = new Proxy(target, handler);

proxy.foo;
//true
//foo
//true
```

Therefore, the following snippet is also working
```js
const target = {
    foo: 'bar'
}

const handler = {
    get(trapTarget, property, receiver){
        return trapTarget[property];
    }
}

const proxy = new Proxy(target, handler);

console.log(proxy.foo);//bar
console.log(target.foo);//bar
```

Actually, we DO NOT need to implement the contents of trapped mehtod. Usage of Reflect API is much more convinient. Every method that can be trapped has a corresponding Reflect API method which has exactly the same name and function signiture, and perform the exact behavior.

```js
const target = {
    foo: 'bar'
}

const handler = {
    get(){
        return Reflect.get
    }
}

const proxy = new Proxy(target, handler);

console.log(proxy.foo);//bar
console.log(target.foo);//bar
```

And if we want a complete passthrough proxy that traps every available method. We can do:

```js
const target = {
    foo: 'bar'
}

const proxy = new Proxy(target, Reflect);
console.log(target.foo);//bar
console.log(proxy.foo);//bar
```

### Trap Invariants

Trap restriction: Each trapped method is aware of the target object context and trap function signature, and the behavior of the trap handler function must obey the 'trap invariants', which is specified in ECMAScript specification.

For example, a non-configuratble and non-writable data property will throw error if attempting to return a value from the trap.
```js
const target = {};
Object.defineProperty(target, 'foo', {
    configurable: false,
    writable: false,
    value: 'bar'
})

const proxy = {
    get(){
        return 'qux';
    }
}

const proxy = new Proxy(target, handler);

console.log(proxy.foo);//TypeError
```

So trap function behavior can not play against the original configuration of the target object property.

### Revocable Proxies

To disconnect proxy and target, we can use `revoke` function which is exposed by `Proxy.revocable(target, handler)`. Will throw TypeError if we use proxy after calling `revoke()`.

```js
const target ={
    foo: 'bar'
}

const handler ={
    get(){
        return 'intercepted';
    }
}

const {proxy, revoke} = Proxy.revocable(target, handler);

console.log(proxy.foo);//intercepted
console.log(target.foo);//bar

revoke();

console.log(proxy.foo);//TypeError
```

### Utility of the Reflect API
#### Reflect API vs. Object API

Reflect API is kinda proxy for Object API.

#### Status Flags
Many Reflect API returns boolean flag where the Object API will throw Error.

```js
const o = {};

try{
    Object.defineProperty(o, "foo", "bar");
    console.log("success");
} catch(e){
    console.log("failure");
}

if(Reflect.defineProperty(o, 'foo', {value: 'bar'})){
    console.log('success');
}else{
    console.log('failure');
}
```

List of Reflect methods that provides status flag:

- `Reflect.defineProperty`
- `Reflect.preventExtensions`
- `Reflect.setPrototypeOf`
- `Reflect.set`
- `Reflect.deleteProperty`

#### Supplanting Operators with First-Class Functions

- `Reflect.get`
- `Reflect.set`
- `Reflect.has`
- `Reflect.deleteProperty`
- `Reflect.construct`

```js
const obj = { x: 1, y: 2 };
Reflect.deleteProperty(obj, "x"); // true
console.log(obj); // { y: 2 }

const arr = [1, 2, 3, 4, 5];
Reflect.deleteProperty(arr, "3"); // true
console.log(arr); // [1, 2, 3, undefined, 5]

// Returns true if no such property exists
Reflect.deleteProperty({}, "foo"); // true

// Returns false if a property is unconfigurable
Reflect.deleteProperty(Object.freeze({ foo: 1 }), "foo"); // false
```

#### Safe Function `apply`
The function which used within `Function.prototype.apply` might have defined its own `apply` function, to avoid this situation.

`Function.prototype.apply.call(myFunc, thisVal, argumentList)`

The above one can be substitute to:

`Reflect.apply(myFunc, thisVal, argumentList)`

### Proxying a Proxy

It is totally legal to create a proxy of a proxy, like creating proxy for Reflect API.

```js
const target = {
    foo: 'bar'
}

const firstPorxy = new Proxy(target, {
    get(){
        console.log("first proxy");
        return Reflect.get(...arguments)
    }
});

const secondProxy = new Proxy(firstProxy, {
    get(){
        console.log("second proxy");
        return Reflect.get(...arguments);
    }
})

console.log(secondProxy, foo);
// second proxy
// first proxy
// bar
```

### Proxy Considerations and Shortcomings
#### `this` Inside a Proxy
```js
const target = {
    thisValEqualsProxy(){
        return this === proxy;
    }
}

const proxy = new Proxy(target, {});

console.log(target.thisValEqualsProxy()); //false
console.log(proxy.thisValEqualsProxy());//true
```

> Contents skipped

## Proxy Traps and Reflect Methods

This chapter is just handbook for most Reflect Methods, a good reference to check when encounter problems.

## Proxy Pattern

Detail usage examples of proxy.
