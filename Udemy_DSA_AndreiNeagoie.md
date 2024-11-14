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

# Section 8: Data Structures: Hash Tables
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