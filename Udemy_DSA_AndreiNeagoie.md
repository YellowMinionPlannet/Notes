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