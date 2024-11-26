# Big O Concept
- Asymptotic Analysis: A method used to describe the behavior of algorithm as the input size grows without considering the actual running time.

## What is good code

For example, if we want to find specific item within an array, we may have different implementation of doing it, but how are we gonna measure the performance of each implementation?

Example of finding Nemo
```js
const nemo = ["nemo"];

function findNemo(array){
    for(const i = 0; i < array.length; i++){
        if(array[i] === "nemo"){
            console.log("Found Nemo!");
        }
    }
}

findNemo(nemo);
```

## Big O and Scalability

Using `performance` API to messure time collapsed within current context.
```js
const nemo = ["nemo"];


function findNemo(array){
    let t0 = performance.now();
    for(const i = 0; i < array.length; i++){
        if(array[i] === "nemo"){
            console.log("Found Nemo!");
        }
    }
    let t1 = performance.now();
    console.log('Call to find Nemo took ' + t1-t0 + 'miliseconds');
}

findNemo(nemo);
```

## 3 Pillars of Programming
1. Readable
2. Scalable:
    - Speed
    - Memory

Pillars:
1. Readable 
2. Speed
3. Memory

Right Data Structure + Right Algorithm = Good Code

<u>**Static Array and Big O**</u>
|Operations|Big O|
|-|-|
|lookup|O(1)|
|push|O(1)|
|insert|O(n)|
|delete|O(n)|

<u>**Dynamic Array and Big O**</u>
|Operations|Big O|
|-|-|
|lookup|O(1)|
|append|O(1)|
|insert|O(n)|
|delete|O(n)|

# Section 6: Data Structures: Arrays
[Javascript Array Big O Reference](https://dev.to/lukocastillo/time-complexity-big-0-for-javascript-array-methods-and-examples-mlg)

## Static vs. Dynamic Arrays
Javascript is a high level language means you don't need to worry about allocating memory. But you should look out for operation on Arrays like `push` or `append`. When the static array reaches the upper size limit it will copy the original one into a new doubled size array, and lead to those operations into `O(n)` situation.

## Optional: Classes in Javascript

## Implementing An Array
```js
class MyArray {

    constructor() {
        this.length = 0;
        this.data = {};
    }

    get(index) {
        return this.data[index];
    }

    push(item) {
        this.data[this.length] = item;
        this.length++;

        return this.length;
    }

    pop() {
        const lastItem = this.data[this.length - 1];

        delete this.data[this.length - 1];
        this.length--;

        return lastItem;
    }

    delete(index) {
        const item = this.data[index];

        this.shiftItems(index);

        return item;
    }

    shiftItems(index) {
        for (let i = index; i < this.length - 1; i++) {
            this.data[i] = this.data[i + 1];
        }

        delete this.data[this.length - 1];
        this.length--;
    }
}

const newArray = new MyArray();

newArray.push("hi");
newArray.push("you");
newArray.push("!");

newArray.pop();

newArray.delete(1);

console.log(newArray);
```

## Strings and Arrays
Treat Strings as an Array of character type

## Excercise: Reverse  A Strings
```js
function reverse(str){
    if(str && str.length >= 2 && typeof str === "string"){
        const reversedString = [str.length];
        for(const i = 0;  i < str.length; i++){
            reversedString[str.length - i - 1] = str[i];
        }
        return reversedString.join('');
    }
    return "not good";
}
```

## Excercise: Merge Sorted Arrays
```js
function mergeSortedArray(a1, a2){
    const i = 0, j = 0;
    const result = [a1.length + a2.length];
    for(const r = 0; r < result.length; r++){
        if(i >= a1.length || j >= a2.length){
            throw new Error("Out of range!");
        }
        if(a1[i] < a2[j]){
            result[r] = a1[i];
            i++;
        }else{
            result[r] = a2[j];
            j++;
        }
    }
}
```

# Section 7: Data Structures: Hash Tables
## Hash Tables Introduction
For Javascript, object is a hash table.

Different from Array, when you store things into Hash Tables like following:
```js
basket.grapes = 10000;
```
First, you use "grapes" as key, that key goes into a ***hash function***, and the output of that function becomes the index(address) of that stored key value pair.

But what is this ***hash function***?

## Hash Function
There are several special thing for hash function:

1. When you input the same thing, the output will always be the same.

2. When you use different inputs, the corresponding output will always be different.

3. You can't use the output to "guess" what is the input. There's no fixed pattern of generating output.

For example, when you input "hello", the MD5 Hash Function will always give you `5d414...`, but if you input "Hello", the function gives you `8b1a995...`.

> This is Concept of Idempotent

And the hash tables use this concept, when you give a key, it always gives exact the same index, and goes to that index and find stored values.

Remember that the hash function used by Hash Tables is optimized, because it will cost very short time to convert input into that stable index.

> Extended research, MD5 and SHA256 hash functions.

## Hash Collisions

<u>Hash Tables and Big O</u>

|Operation|Big O|
|-|-|
|insert|O(1)|
|lookup|O(1)|
|delete|O(1)|
|search|O(1)|

But this is the optimized condition.

Depends on how large the data size, how large the available hash table size, and hash function. There might be Hash Collisions. These Big O could be `O(n/k)` where k is the hash table size.

Better hash function create output more evenly distributed, meaning more random to avoid hash collisions.

### Concept of Hash Collisions
Different input key could have same output. 

This is happenning when hash function is bad, data size is extreme large and available hash table size is very small.

Then there must be a solution to deal with this collision.

One of the solution is to create linked list when there is a collided index. We put that key value pairs into the collided index as the additional item in the linked list.

So when we want to retrieve or store, there is extra cost, because we need to iterate that linked list.

> Additional research: Wiki page about hash table and hash collision resolution

## Hash Tables implementation
```js
class HashTable {
  constructor(size){
    this.data = new Array(size);
    // this.data = [];
  }

  _hash(key) {
    let hash = 0;
    for (let i =0; i < key.length; i++){
        hash = (hash + key.charCodeAt(i) * i) % this.data.length
    }
    return hash;
  }

  set(key, value) {
    let address = this._hash(key);
    if (!this.data[address]) {
      this.data[address] = [];
    }
    this.data[address].push([key, value]);
    return this.data;
  }

  get(key){
    const address = this._hash(key);
    const currentBucket = this.data[address]
    if (currentBucket) {
      for(let i = 0; i < currentBucket.length; i++){
        if(currentBucket[i][0] === key) {
          return currentBucket[i][1]
        }
      }
    }
    return undefined;
  }

  keys(){
    const storedKeys = [];
    for(let i = 0; i < this.data.length; i++){
        if(this.data[i] !== undefined){
            if(this.data[i].length > 1){
                for(let j = 0; j < this.data[i].length; j++){
                    storedKeys.push(this.data[i][j][0])
                }
            }else{
                storedKeys.push(this.data[i][0][0]);
            }
        }
    }
    return storedKeys;
  }
}

```

# Section 8: Data Structures: Linked Lists
<u>Linked List and Big O</u>
|Operation|Big O|
|-|-|
|Prepend|O(1)|
|Append|O(1)|
|Lookup|O(n)|
|Insert|O(n)|
|Delete|O(n)|

## Our First Linked List
```js
class LinkedListNode{
    constructor(value){
        this.value = value;
        this.next = null;
    }
}

class LinkedList{
    constructor (value){
        this.head = new LinkedListNode(value);
        this.tail = this.head;
        this.length = 1;
    }

    append(value) {
        const newNode = new LinkedListNode(value);
        this.tail.next = newNode;
        this.tail = newNode;
        this.length++;
        return this;
    }

    prepend(value){
        const newNode = {
            value: value,
            next: null
        }

        newNode.next = this.head;
        this.head = newNode;
        this.length++;
        return this;
    }

    printList(){
        const array = [];
        let currentNode = this.head;
        while(currentNode !== null){
            array.push(currentNode.value);
            currentNode = currentNode.next;
        }
        return array;
    }

    insert(index, value){
        if(index >== this.length){
            return this.append(value);
        }
        const newNode = {
            value: value,
            next: null
        }
        const leader = this.traverseToIndex(index - 1);
        const holdingPointer = leader.next;
        leader.next = newNode;
        newNode = holdingPointer;
        this.length++;
        return this;   
    }

    traverseToIndex(index){
        let counter = 0;
        let currentNode = this.head;
        while(counter !== index){
            currentNode = currentNode.next
            counter++;
        }
        return currentNode;
    }

    remove(index){
        const leader = this.traverseToIndex(index - 1);
        const unwantedNode = leader.next;
        leader.next = unwantedNode.next;
        this.length--;
        return this;
    }
}
```

## Doubly Linked List

A linked list with every node point to **next** and **previous** node. It can traverse from the tail to the head where normal linked list is not able to do so.

## Solution: Doubly Linked List

```js
class DoublyLinkedList{
    constructor(value){
        this.head = {
            value: value,
            next: null,
            previous: null
        }
        this.tail = this.head;
        this.length = 1;
    }

    append(value){
        const newNode = {
            value: value,
            next: null,
            previous: null,
        }
        newNode.previous = this.tail;
        this.tail.next = newNode;
        this.tail = newNode;
        this.length++;
        return this;
    }

    prepend(value){
        const newNode ={
            value: value,
            next: null,
            previous: null
        }
        newNode.next = this.head;
        this.head.previous = newNode;
        this.head = newNOde;
        this.length++;
        return this;
    }

    insert(index, value){
        if(index >== this.length){
            return this.append(value);
        }
        const newNode = {
            value: value,
            next: null,
            previous: null
        }
        const leader = this.traverseToIndex(index-1);
        const follower = leader.next;
        leader.next = newNode;
        follower.previous = newNode;
        newNode.next = follower;
        newNode.previous = leader;
        this.length++;
        return this;
    }

     traverseToIndex(index){
        let counter = 0;
        let currentNode = this.head;
        while(counter !== index){
            currentNode = currentNode.next
            counter++;
        }
        return currentNode;
    }

    remove(index){
        const unwantedNode = this.traverseToIndex(index-1);
        unwantedNode.previous.next = unwantedNode.next;
        unwantedNode.next.previous = unwantedNode.previous;
        unwantedNode.previous = null;
        unwantedNode.next = null;
        return this;
    }
}
```

## Single vs Double?

<u>Doubly Linked List and Big O</u>
|Operation|Big O|
|-|-|
|append|O(1)|
|prepend|O(1)|
|lookup|O(n)|
|insert|O(n)|
|remove|O(n)|

But remember double linked list is able to operate at O(n/2) at optimized algorithm.

## Reverse

```js
class DoublyLinkedList{
    constructor(value){
        this.head = {
            value: value,
            next: null,
            previous: null
        }
        this.tail = this.head;
        this.length = 1;
    }

    append(value){
        const newNode = {
            value: value,
            next: null,
            previous: null,
        }
        newNode.previous = this.tail;
        this.tail.next = newNode;
        this.tail = newNode;
        this.length++;
        return this;
    }

    prepend(value){
        const newNode ={
            value: value,
            next: null,
            previous: null
        }
        newNode.next = this.head;
        this.head.previous = newNode;
        this.head = newNOde;
        this.length++;
        return this;
    }

    insert(index, value){
        if(index >== this.length){
            return this.append(value);
        }
        const newNode = {
            value: value,
            next: null,
            previous: null
        }
        const leader = this.traverseToIndex(index-1);
        const follower = leader.next;
        leader.next = newNode;
        follower.previous = newNode;
        newNode.next = follower;
        newNode.previous = leader;
        this.length++;
        return this;
    }

     traverseToIndex(index){
        let counter = 0;
        let currentNode = this.head;
        while(counter !== index){
            currentNode = currentNode.next
            counter++;
        }
        return currentNode;
    }

    remove(index){
        const unwantedNode = this.traverseToIndex(index-1);
        unwantedNode.previous.next = unwantedNode.next;
        unwantedNode.next.previous = unwantedNode.previous;
        unwantedNode.previous = null;
        unwantedNode.next = null;
        return this;
    }

    reverse(index){
        if(this.length === 1){
            return this.head;
        }

        let first = this.head;
        this.tail = this.head;
        let second = first.next;
        while(second){
            const temp = second.next;
            second.next = first;
            first = second;
            second = temp;
        }

        this.head.next = null;
        this.head = first;
        return this;
    }
}
```

# Data Structures: Stacks + Queues
## Stacks + Queues Introduction

### Stacks
Stacks go LIFO, which means always the last pushed item got poped out first.
<u>Stacks and Big O</u>
|Operation|Big O|Description|
|-|-|-|
|Lookup|O(n)|a very heavy operation|
|Push|O(1)|push the item from the bottom|
|Pop|O(1)|pop out the last pushed item|
|Peak|O(1)|Peak means to view the top item, which is the last pushed item (will be poped out first)|

### Queues
Queues go FIFO, which means always the first pushed item got poped out fist.
<u>Queues and Big O</u>
|Operation|Big O|Description|
|-|-|-|
|Lookup|O(n)||
|Enqueue|O(1)||
|Dequeue|O(1)||
|Peek|O(1)|View the first item gonna come out, which should be the first item pushed|

## Solution: Stacks vs. Queues

For stacks, we can both use Arrays and Linked List as basic data structure. But Array has continuous memory allocation which makes it very fast. Linked List needs more memo because of the pointer. However, array needs to double up when it meets it size limit, where linked list is more like use as needed plan.

For queue, we are not able to use Arrays to build queues, because FIFO needs to unshift when we do Dequeue operation, where unshift is a O(n) heavy algorithm.

## Optional  (***very important***)
> How Does javascript Work? OR What is a Program?
> - Need to allocate memo
> - Need to parse and execute
>
> How to explain JS is a single threaded language that is non-blocking.
> - If JS is running in browser, different browser will have different JS engine, Chrome is V8 Engine. Engine is where our lines of JS code got parsed and translated to executable instructions for Browsers. This engine has 2 parts, Memory Heap and Call Stack.
> - Memo Heap vs. Call Stack
>   - Memo Heap is used to allocate memory, (where it locates at RT).
>   - Call Stack is where to parse and execute lines of code, which contained by threads.
> - Single Threaded means there is only one thread and one call stack.
> - Non-blocking means JS operation/function could behave asynchronously
>
> What is a Memory Leak?
> - Memo leak is happenning in the Memory Heap, for example `const a = 1;` will allocate a piece of memory in the heap, but the amount of content stored within Memo Heap is limited, when you use beyond that limit, it's a memory leak. Or, you never remove unused reference, or declare too many global variables.
>
> What is a Stack Overflow?
> - When we do `console.log(1)`, the `console.log` function got pushed in to the call stack as the first item, because JS is single threaded program, the first function must got executed and then it got poped out and the following function got executed.
> - But when we have nested functions
> ```js
>   const one = () =>{
>       const two = () => {
>           console.log(1);
>       }
>       two();
>   }
>   one();
> ```
> - So when execute `one()` we push `one` in the Call Stack, and `two` got pushed, then `two` got executed and poped out, then `one` got poped out.
> - We can create a Stack Overflow condition when we do recursion:
> ```js
>   function foo(){
>       foo();
>   }
>   foo();
> ```
>
> What is JS RT then?
> - To achieve Asynchronous Operations, we need not just JS Engine, which contains heap and stack, we need a JS RT Environment, it conatains JS engine, Web APIs where DOM, Ajax, and `timeout` etc.  locates, it also contains Callback Queue and Event Loop.

## Exercise: Stack Implementation (Linked List)
```js
class Node{
    constructor(value){
        this.value = value;
        this.next = null;
    }
}

class Stack{
    constructor(){
        this.top = null;
        this.bottom = null;
        this.length = 0;
    }

    peek(){
        return this.top;
    }

    push(value){
        const newNode = new Node(value);
        if(this.isEmpty()){
            this.top = newNode;
            this.bottom = newNode;
        }else{
            const holdingPointer = this.top;
            this.top = newNode;
            this.top.next = holdingPointer;
        }
        this.length++;
        return this;
    }

    pop(){
        if(!this.top){
            return null;
        }
        this.top = this.top.next;
        if(this.length === 1){
            this.bottom = null;
        }
        this.length--;
        return this;
    }

    isEmpty(){
        return this.length === 0;
    }
}
```

## Exercise: Stack Implementation(Array)
```js
class Stack{
    constructor(){
        this.array = [];
    }

    peek(){
        return this.array[this.array.length - 1];
    }

    push(value){
        this.array.push(value);
        return this.array;
    }

    pop(){
        this.array.pop();
        return this.array;
    }

    isEmpty(){
        return this.array.length === 0;
    }
}
```

## Solution: Queue Implementation
```js
class Node{
    constructor(value){
        this.value = value;
        this.next = null;
    }
}

class Queue{
    constructor(){
        this.first = null;
        this.last = null;
        this.length = 0;
    }

    peek(){
        return this.first;
    }

    enqueue(value){
        const newNode = new Node(value);
        if(this.length === 0){
            this.first = newNode;
            this.last = newNode;
        }else{
            this.last.next = newNodel;
            this.last = newNode;
        }
        this.length++;
        return this;
    }

    dequeue(){
        if(!this.first){
            return null;
        }
        if(this.first === this.last){
            this.last = null;
        }
        this.first = this.first.next;
        this.length--;
        return this;
    }
}

```