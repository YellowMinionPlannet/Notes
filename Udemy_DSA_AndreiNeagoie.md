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
