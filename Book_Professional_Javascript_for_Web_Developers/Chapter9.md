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
