# Chapter 18 JavaScript APIs

## TYPED ARRAYS (From Chapter 6, Prerequisites)

The capability to manipulate memory is scaled when 3D graphics API is introduced.

### Using ArrayBuffers
> The `SharedArrayBuffer` is a variant of the `ArrayBuffer` that can be passed between execution contexts without performing a copy.
`ArrayBuffer` is a constructor that can be used to acclocate specific number of bytes in memory.
```js
const buff = new ArrayBuffer(16);// Allocates 16 bytes of memory
alert(buff.byteLength);// 16
```
`ArrayBuffer` can never be resized once it is created. But you can copy all or part of the created `ArrayBuffer` into a new `ArrayBuffder`
```js
const buf1 = New ArrayBuffer(16);
const buf2 = buf1.slice(4, 12);
alert(buf2.byteLength); // 8
```

`ArrayBuffer` is similar to C++ `malloc`, but there are several differences:
- `malloc` return `null` pointer when failing to allocate memory
- `ArrayBuffer` max capability cannot exceed `Number.MAX_SAFE_INTEGER` (2^53) bytes, where `malloc`'s boundary is addressable system memory.
- `malloc` does not initiallize, where `ArrayBuffer` initialize bits to 0s
- Heap memory is garbage collected by `ArrayBuffer`, where `malloc` needs to call `free()` to free up claimed heap memory.

`ArrayBuffer`'s reference cannot be used to write or read, it must be used with `view`

### DataViews
`DataView` is capable of manipulating buffer data at a high degree, it is suitable for file I/O an network I/O, however it's not iterable and offers reduced performance comparing to other types.

It need to work on a created `ArrayBuffer` and it could manipulate part or full instance of `ArrayBuffer` through a reference to the created `ArrayBuffer` where the view begins.

```js
const buf = new ArrayBuffer(16);

const fullDataView = new DataView(buf);

console.log(fullDataView.byteOffset); // 0
console.log(fullDataView.byteLength); // 16
console.log(fullDataView.buffer === buf); // true

// Use constructer to claim offset and length
// offset = 0, means begin at the start of ArrayBuffer
// length = 8, means the first 8 bytes 
const firstHalfDataView = new DataView(buf, 0, 8);
console.log(firstHalfDataView.byteOffset); // 0
console.log(firstHalfDataView.byteLength); //8
console.log(firstHalfDataView.buffer === buf); //true

// offset = 8, means begin at the 9th byte
// length, means to the end of ArrayBuffer
const secondHalfDavaView = new DataView(buf, 8);
console.log(secondHalfDataView.byteOffset); // 8
console.log(secondHalfDataView.byteLength); // 8
console.log(secondHalfDataView.buffer === buf); // true
```

To manipulate `ArrayBuffer` / memory, you need to give three inputs:
- Offset works as address
- ElementType work as type of data that you want to convert into binary
- The endianness, the order to store in the memory. big-endian, by default, means put thousands position at begining, 10 position at the end. 

#### ElementType
`DataView` does not make assumption to the data type within `ArrayBuffer`, it is required to configure ElementType when using DataView to read and write, and conversion is automatic.

|ELEMENTTYPE|BYTES|DESCRIPTION|C EQUIVALENTS|RANGE OF VALUE|
|-|-|-|-|-|
|Int8|1|8-bit signed integer|signed char;int8_t|-2<sup>7</sup> ~ 2<sup>7</sup> - 1|
|Uint8|1|8-bit unsigned integer|unsigned char;uint8_t|0 ~ 2<sup>8</sup> - 1|
|Int16|2|16-bit signed integer|short;int16_6|-2<sup>15</sup> ~ 2<sup>15</sup> - 1|
|Uint16|2|16-bit unsigned integer|unsigned short;uint16_t|0 ~ 2<sup>16</sup> - 1|
|Int32|4|32-bit signed integer|int;int32_t|-2<sup>31</sup> ~ 2<sup></sup> - 1|
|Float32|4|32-bit IEEE-754 floating point|float|-3.4E+38 to +3.4E+38|
|Float64|8|64-bit IEEE-754 floating point|double|-1.7E+308 to +1.7E+308|
|BigInt64|8|64-bit signed integer|signed long long;int64_t|-2<sup>63</sup> ~ 2<sup>63</sup> - 1|
|BigUint64|8|64-bit unsigned integer|unsigned long long;uint64_t|0 ~ 2<sup>64</sup> - 1|

```js
const buf = new ArrayBuffer(2);
const view = new DataView(buf);

console.log(view.getInt8(0)); // 0
console.log(view.getInt8(1)); // 0
console.log(view.getInt16(0)); // 0

view.setUint8(0, 255);
view.setUint8(1, 0xff);

view.getInt16(0)// -1, now all bits are ones, and for signed value is -1.
```

#### Big-Endian and Little-Endian
Endianness refers to the convention of byte ordering maintained by a computing system.

For `DataView`, there are only two conventions supported: big-endian and little-endian.

Big-endian is "network byte order", means that the most significant byte is held in the first byte. For example, the biggest position, where biggest position for 100 is 1.

Little-endian is the reversion of Big-edian, the most significant byte is held in the last byte.

Every runtime has its own endianness, which is called native endianness.

Javascript runtime has its own native endianness, but `DataView` does not obey. So `DataView`'s default is big-endian but accept an optional boolean argument where true value will turn endianness to little-endianness.

```js
const buf = new ArrayBuffer(2);
const view = new DataView(buf);

view.setUint8(0, 0x80); // sets left most bit to 1
view.setUint8(1, 0x01); // sets right most bit to 1


// Read with Big-endian
//////////
// 1000 0000 0000 0001
/////////

//Read with Little-endian
/////////
// 0000 0001 1000 0000
/////////

// Read with Big-endian
alert(view.getUint16(0)); // 32769
// Read with Little-endian

alert(view.getUint16(0, true)); // 384

const buf = new ArrayBuffer(4);
const view = new DataView(buf);

view.setUint32(0, 0x10111011, true);


console.log(view.getUint32(0));// Result would be 286265616, which is 
////////
// 0001 0001 0001 0000 0001 0001 0001 0000
// 0x11101110
////////
```

### Typed Arrays
It is another form of `ArrayBuffer`, and differs from `DataView` that it enforces a single `ElementType` and obeys the native endianness. It has broader API supports and better performance. It is suitable for WebGL and operating system, and is optimized for arithmetic, bitwise and other common operations.

It is possible to read from an existing buffer, initialized with their own buffer and filled with iterable. 

They can be created by `ElementType.from()` or `ElementType.of()`

```js
// created from 12 bytes, arraybuffer
const buf = new ArrayBuffer(12);
const ints = new Int32Array(buf);
console.log(ints.length); // 3 because every Int32 needs 4 bytes, so 12 bytes give us 3 Int32s.

// created from their own
const ints2 = new Int32Array(6);
console.log(ints2.length); // 6
console.log(ints2.buffer.byteLength); // 24

// created from array
const ints3 = new Int32Array([2, 4, 6, 8]);
console.log(ints3.length); // 4
console.log(ints3.byteLength); // 16
console.log(ints3[2]); // 6

// created from copies
const ints4 = new Int16Array(ints3);
// automatic conversion
console.log(ints4.length); // 4
console.log(ints4.byteLength); // 8
console.log(ints4.[2]); // 6

//created from arguments
const floats = Float32Array.of(3.14, 2.718, 1.618);
console.log(floats.length);// 3
console.log(floats.buffer.byteLength); // 12
console.log(floats[2]); // 1.6180000305175175781
```

#### BYTES_PER_ELEMENT property
```js
console.log(Int16Array.BYTES_PER_ELEMENT); //2
console.log(Int32Array.BYTES_PER_ELEMENT); //4

const ints = new Int32Array(1);
console.log(ints.BYTES_PER_ELEMENT);// 4

const ints = new Int32Array(4);
console.log(ints[0]); // 0, ALL INITIALIZED TO 0s
```

#### Typed Array Behavior
```js
const ints = new Int16Array([1,2,3]);
const doubleints = ints.map(x=>2*x);
console.log(doubleints instanceof Int16Array); // true

const ints = new Int16Array([1,2,3]);
for(const int of ints){
  console.log(int);
}

console.log(Math.Max(...ints));
```

##### Merging, Copying, and Changing TypedArrays

NONE of following methods works:
- ~~concat()~~
- ~~pop()~~
- ~~push()~~
- ~~shift()~~
- ~~splice()~~
- ~~unshift()~~

`set()` and `subarray()` could help to copy values.

```js
const container = new Int16Array(8);

container.set(Int8Array.of(1, 2, 3, 4));

container.set([5,6,7,8], 4);

container.set([5,6,7,8], 7);// OVERFLOW
```

```js
const source = new Int16Array.of(2, 4, 6, 8);

const fullCopy = source.subarray();// [2, 4, 6, 8]

const halfCopy = source.subarray(2);// [6, 8]

const partialCopy = source.subarray(1, 3); //[4, 6]


```

- Snippet to concatenate typed arrays
```js
function typedArrayConcat(typedArrayConstructor, ...typedArrays){
  const numElements = typedArrays.reduce((x,y) => (x.length || x) + y.length);
  const resultArray = new typedArrayConstructor(numElements);

  let currentOffset = 0;
  typedArrays.map(x => {
    resultArray.set(x, currentOffset);
    currentOffset += x.length;
  });

  return resultArray;
}

//usage
const concatArray = typedArrayConcat(Int32Array, Int8Array.of(1,2,3),
              Int16Array.of(4,5,6),
              Float32Array.of(7,8,9));
```

#### Underflow and Overflow
```js
const ints = Int8Array(2);
ints[1] = 128; // 0x80, 0000 0000 1000 0000
console.log(ints); // [0, -128], because 1000 0000 represents the smallest number in negative, which is -128 since the range of Int8Array is -128 to 127

ints[1] = 255;// 0xFF 0000 0000 1111 1111
console.log(ints) // [0, -1], because 1111 1111 represents the largest number in nagative, which is -1 since the range of Int8Array is -128 to 127
```

## BLOB AND FILE APIs
To avoid using `<input type="file">` to be the only way to interact with files on system, Blob and File API are created.

### The File Type
This type is related to the `<input type="file">`, and it represents the file or one of the file for that input.

Several read-only properties for File Type:
- `name`
- `size`
- `type`, MIME type of the file
- `lastModifiedDate`

Sample of usage:
```js
let filesList = document.getElementById("files-list");
filesList.addEventListener("change", (event) => { 
  let files = event.target.files, i = 0, len = files.length;
  while( i < len){
    const f = files[i];
    console.log(`${f.name} ${f.type} ${f.size}`);
    i++;
  }
});
```

### The FileReader Type
This is used for asynchronous file-reading mechanism. So instead of reading from remote server, this type is used to perform i/o from local.

Several available methods:
- `readAsText(file, encoding)`,
- `readAsDataURL(file)`, store data URI representing the files 
- `readAsBinaryString(file)`
- `readAsArrayBuffer`

So, several events available:
- progress, when there's more data
  - triggered every 50 milliseconds
  - information available: `lengthComputable`, `loaded` and `total`
  - `result` of FileReader could be readable even the file is not fully loaded

- error, when there's error
  - `error` property of FileReader is filled
  - `code` within `error` object has following available values:
    - 1, not found
    - 2, security error
    - 3, read was aborted
    - 4, file is not readable
    - 5, encoding error

- load, when file is fully loaded
```js
let fileList = document.getElementById("files-list");
filesList.addEventListener("change", (event) => {
  let info = "", 
      output = document.getElementById("output"),
      progress = document.getElelmentById("progress"),
      files = event.target.files,
      type = "default",
      reader = new FileReader();

  if(/image/.test(files[0].type)){
    reader.readAsDataURL(files[0]);
    type = "image";
  }else{
    reader.readAsText(files[0]);
    type = "text";
  }

  reader.onerror = function() {
    output.innerHTML = "Could not read file, error is " + reader.error.code;
  }

  reader.onprogress = function (event){
    if(event.lengthComputable){
      progress.innerHTML = `${event.loaded}/${event.total}`;
    }
  }

  reader.onload = function(){
    html = "";
    swith(type){
      case "image":
        html = `<img src="${reader.result}">`;
        break;
      case "text":
        html = reader.result;
        break;
    }

    output.innerHTML = html;
  }
});
```

`abort()` can be used to cancel reading, `abort` event is fired. So after either `load`, `error`, or `abort` event is fired, `loadend` event is fired.

### The FileReaderSync Type
Synchronous version of `FileReader` type, which can only be used within web worker.

Following sample suppose one of the worker sent a file object via `postMessage()`
```js
self.onmessage = (messageEvent) =>{
  const syncReader = new FileReaderSync();
  
  const result = syncReader.readAsDataUrl(messageEvent.data);

  self.postMessage(result);
}
```

### Blobs and Partial Reads
File type provided a `slice()` method that accepts the start byte index and number of bytes to read, can split the file into Blob type which is super type of File.

Blob type can be created by string, ArrayBuffer, ArrayBufferViews, or, other Blobs.

```js
new Blob(["foo"]);

new Blob(["{'a':'b'}"], {type: "application/json"});

new Blob(["<p>Foo</p>", "<p>Bar</p>"],{type: "text/html"});
```

```js
let filesList = document.getElementById("files-list");
filesList.addEventListener("change", (event) => {
  let info = "",
  output = document.getElementById("output"),
  progress = document.getElementById("progress"),
  files = event.target.files,
  reader = new FileReader(),
  blob = files[0].slice(0, 32);

  if(blob){
    reader.readAsText(blob);

    reader.onerror = function(){
      output.innerHTML = "could not read, error code" + reader.error.code;
    }

    reader.onload = function(){
      output.innerHTML = reader.result;
    }
  }else{

  }
});
```

### Object URLs and Blobs
Object URL represents a binary data in memo.
`window.URL.createObjectURL()` is the mothod to create one. Remember to call `URL.revokeObjectURL` with your claimed object URL to free up memo.

### Drag-and-Drop File Reading
```js
let droptarget = document.getElementById("droptarget");
function handleEvent(event) {
  let info = "",
  output = document.getElementById("output"),
  files, i, len;
  event.preventDefault();
  if(event.type == "drop"){
    files = event.dataTransfer.files;
    i = 0;
    len = files.length;
    
    while(i < len){
      info += `${files[i].name}`;
      i++;
    }

    output.innerHTML = info;
  }
}

droptarget.addEventListener("dragenter", handleEvent);
droptarget.addEventListener("dragover", handleEvent);
droptarget.addEventListener("drop", handleEvent);
```

## URL APIs
This API makes manipulation of URL more easily.

### The URL Object
`URL()` accepts 2 arguments:
- url, the URL in string format 
- base, A base URL object, which makes the url argument relative url.

```js
const baseURL = new URL("https://example.com/base/path/");
const relativeURL = new URL("relative/path", baseURL);
```

There are several properties exposed by URL object:
- href, the whole URL, you can use this property to create a new URL
- protocol, includes `:` colon
- username, username if presents
- password, password if presents
- host, combination of host and port
- hostname, domain name or IP address, eg. example.com
- port, port number if presents
- pathname, path of URL 
- serach, query string, including the leading `?`
- hash, fragment identifier, including the leading `#`
- searchParams, a read-only object, `URLSearchParams` typed

```js
const url = new URL("https://example.com:8080/path/page?q1=val1&q2=val2#fragment");

console.log(url.href); // https://example.com:8080/path/page?q1=val1&q2=val2#fragment

console.log(url.protocol); // https:
console.log(url.host); // example.com:8080
console.log(url.hostname); // example.com
console.log(url.port); // 8080
console.log(url.pathname); // /path/page
console.log(url.search); // ?q1=val1&q2=val2
console.log(url.hash);// #fragment

url.host = "newdomain.com:8081";
url.pathname = "/new/path/page"

console.log(url.href); // https://newdomain.com:8081/new/path/page?q1=val1&q2=val2#fragment
```

### URLSearchParams Object
URLSearchParams has following method:
- append(name, value), append a new query parameter with name and value
- delete(name), removes all query parameters with specified name
- get(name), return the first value of name, or null if none
- getAll(name), returns array of all values with name, or empty array
- has(name), return boolean
- set(name, value), Sets or updates a name's value
- sort(), sort by name
```js
let qs = "?q=javascript&num=10";

let searchParams = new URLSeachParams(qs);

console.log(searchParams.toString()); // q=javascript&num=10

searchParams.has("num"); // true
searchParams.get("num");// 10
searchParams.set("page", "3");

console.log(searchParams.toString()) // q=javascript&num=10&page=3

let qs = "?q=javascript&num=10";
let searchParams = new URLSearchParams(qs);
for(let param of searchParams){
  console.log(param);
}

// ["q", "javascript"]
// ["num", "10"]
```

## STREAMS API
Why Streams?

We know that data transfered in TCP/IP layer is a squential chuncks. Then how web application can consume a squential chuncks form of data?

The answer is Streams.

Streams aim to solve this problem by 2 ways:
1. A block of data may not be available all at once. When response is sent, data is sent in squential of packets, and stream processing can allow an application to use network-delivered data as it becomes available rather than waiting for the full payload to finish loading.
2. A block of data can be processed in small portions. Video processing, image decoding, data decompression, and JSON Parsing all does not require the whole thing to be in memory at once.

### Introduction to Streams
So stream concept is borrowed from liquid flowing through pipes. It address issue of handling network requests and reading/writing to disk.

There are 3 types of streams:
- Readable streams, means you can use it to read data, and how data got into stream is underlying source.
- Writable stremas, means you can write data into streams, and how data got out of stream is underlying sink.
- Transform streams, one writable and one readable stream, and in between is the transformer, which is used to inspect and modify data in stream.

#### Chunks, Internal Queues, and Backpressure
- The fundamental unit of stream is *chunk*. *chunk* can be any type of data, but usually it's typed array.
- *chunk* does not keep a fixed type among them, and does not arrive at a fixed interval
- Ideally, *chunk* should be fixed size and arrive at fixed interval, approximately.
- In real world, a well-designed stream should prepare for edge cases

So since there could be different speed of entering and exiting stream. There are 3 conditions need to be considered:
1. The exit of stream can process faster than the data is provided at entrance. So there would be just waste of memo and computation source
2. The stream is balanced when exit and enters. Ideal condition.
3. Entrance of the stream can provide data faster than the exit can process. This is the worst, means there will be a backlog of data somewhere.

For these 3 situations, stream should maintain an *internal queue* of chunks that entered but not yet exited. In the first and second condition, the *internal queue* would be fairly small. 

For the 3rd condition, *internal queue* would grow fast, and indefinitely. So it uses *backpressure* to signal the stream entrance to stop sending data until the length of the *internal queue* below a predefined threshold. This threshold is the *high water mark*, means the max of memo footprint for the queue and is defined in *queueing strategy*.

### Readable Streams
#### Using the ReadableStreamDefaultController
```js
async function* ints(){
  for(let i = 0; i < 5; ++i){
    yield await new Promise((resolve) => setTimeout(resolve, 1000, i));
  }
}

// generate 0, 1, 2, 3, 4 every 1000ms approximately

const readableStream = new ReadableStream({
  async start(controller){
    for await(let chunk of ints()){
      controller.enqueue(chunk);
    }
    controller.close();
  }
});

const readableStreamDefaultReader = readableStream.getReader();
(async function(){
  while(true){
    const {done, value} = await readableStreamDefaultReader.read();

    if(done){
      break;
    }else{
      console.log(value);
    }
  }
})()
```

### Using the WritableStreamDefaultWriter
```js
async function* ints(){
  for(let i = 0; i < 5; ++i){
    yield await new Promise((resolve) => setTimeout(resolve, 1000, i));
  }
}

const writableStream = new WritableStram({
  write(value){
    console.log(value);
  }
});

const writableStreamDefaultWriter = writableStream.getWriter();

(async function(){
  for await (let chunk of int()){
    await writableStreamDefaultWriter.ready;
    writableStreamDefaultWriter.write(chunk);
  }
  writableStreamDefaultWriter.close();
})()
```

### Piping Streams
```js

```
> In general, as an enduser, when you read squential packet you use readable stream, and read method. When you write to a stream, and use write method.

## ENCODING API
Encoding works for converting string into typed arrays.

Text Encoder, TextEncoderStream, TextDecoder, and TextDecoderStream.

### Encoding Text
There are 2 ways of doing such conversion, bulk encoding and stream encoding. When going from string to typed arrays, the encoder will always use UTF-8.

#### Bulk Encoding
The bulk designation means that the JavaScript engine will synchronously encode hte entire string.

```js
const textEncoder = new TextEncoder();
const decodedText = 'foo';
const encodedText = textEncoder.encode(decodedText);

console.log(encodedText); // Uint8Array(3) [102, 111, 111]
```
The textEncoder also expose a method called, `encodeInto`, the difference is it can accept an existing Uint8Array, whereas the other method must use a new one.

<sup>Text encoding will always utilized the UTF-8 format and must write into a Uint8Array.</sup>

```js
const textEncoder = new TextEncoder();
const fooArr = new Uint8Array(3);
const barArr = new Uint8Array(2);

const fooResult = textEncoder.encodeInto("foo", fooArr);
const barResult = textEncoder.encodeInto("bar", barArr);

console.log(fooArr); // Uint8Array(3) [102, 111, 111]
console.log(fooResult);// {read:3, written: 3}

console.log(barArr);// Uint8Array(2) [98, 97]
console.log(barResult);// {read:2, written: 2}
```

## ATOMICS AND `SharedArrayBuffer`
A `SharedArrayBuffer` is able to accessed by multiple contexts. The Atomics API allows multiple contexts to safely reade and write to a single `SharedArrayBuffer`. 

- The API forces the buffer operations to occur only one at a time.
- The API preludes some optimizations that operating system/computer hardware would normall perform automatically (such as instruction reordering).
- The API make concurrent memory access impossible, which can slow down execution when improperly applied.

### SharedArrayBuffer
`SharedArrayBuffer` has identical feature comparing to `ArrayBuffer`, but `SharedArrayBuffer` can be used simultaneously,  as a reference, in multiple excution contexts.

Sharing memory among multiple execution contexts means that **concurrent** thread operations become a possibility, where traditionaly, JavaScript operations offer no protection from race condition.

> Check **concurrent** vs. **parelleled** thread operations
> **concurrent** usually means one single CPU switch among multiple thread very quickly, especially when specific thread is being idle or only waiting/checking the I/O operation to finish.
> **parallel** means multiple CPU run multiple thread at the same time.

- Demo of race condition

```js
const workerScript = `
self.onmessage = ({data}) =>{
  const view = new Uint32Array(data);

  //Perform 1000000 add operations
  for(let i = 0; i < 1E6; ++i){
    //Here is thread unsafe operation where race condition will occur
    // My thought is there may be multiple contexts read the view[0] at the same time and then add
    // That will cause the addition to 1 does not not increment
    view[0] += 1;
  }
  self.postMessage(null);
}
`

const workerScriptBlobUrl = URL.createObjectURL(new Blob([workerScript]));

// Create worker pool of size 4
const workers = [];
for(let i = 0; i < 4; ++i){
  workers.push(new Worker(workerScriptBlobUrl));
}

let responseCount = 0;
for(const worker of workers){
  worker.onmessage = () =>{
    if(++responseCount == wokers.length){
      console.log(`Final buffer value: ${view[0]}`);
    }
  }
}

const sharedArrayBuffer = new SharedArrayBuffer(4);
const view = new Uint32Array(sharedArrayBuffer);
view[0] = 1;

for(const worker of workers){
  worker.postMessage(sharedArrayBuffer);
}

// Expected result is 4000001. Actual might be 2145106 or something like that
```

### Atomics Basics
Basically, the previous race condition includes three operation, load of value, arithmetic operation, and write the value.

- Atomics will make sure these three operation is executed in a sequence and does not get interrupted by another thread.

```js
let sharedArrayBuffer = new SharedArrayBuffer(1);

let typedArray = new Uint8Array(sharedArrayBuffer);

console.log(typedArray); // Uint8Array[0] initialized with 0

const index = 0;
const increment = 5;

Atomics.add(typedArray, index, increment);
Atomics.sub(typedArray, index, increment);
```

#### Atomic Reads and Writes
Atomic reads and writes are another story, because these are seperated 2 times call to the typedarray instead of calling once, there must be a machenism to make sure the operation between these two calls is not interrupted or reordered.

The Atomics API addresses this problem in 2 primary ways:
- All Atomics instructions are never reordered with respect to one another
- Using Atomic read and wirte guarantees that all instructions before Atomic read/write will finish before the Atomic read/write occurs, and all instructions after will not begin until Atomic read/write completes.
- Instructions might be reordered but never violates Atomic read/write boundary

```js
const sharedArrayBuffer = new SharedArrayBuffer(4);
const view = new Uint32Array(sharedArrayBuffer);

view[0] = 1;

console.log(Atomics.load(view,0)); //1
Atomics.store(view, 0, 2);

console.log(view[0]);// 2
```

#### Atomics Futex Operations and Locks
This is designed for Linux futex(a portmanteau of fast user-space mutex).
```js
// Within read thread
// Halt when encoutering the initial value 0, at 0 index, for 10000ms
Atomics.wait(view, 0, 0, 1E5)

// Within write thread
// notify exact 1 work thread to continue.
Atomics.add(view, 0 , 1)
Atomics.notify(view, 0, 1)
```

## CLIPBOARD API
Before, if you want to achieve Clipboard operation, you need to use `document.execCommand()`.

Clipboard API aims to replace this method.

There are 3 interfaces involved in this API:
- Clipboard - The main interface of the Clipboard API, provides read and write access to the clipboard
- ClipboardEvent - Events for Clipboad operation
- ClipboardItem - Represent data that can be copied to the system clipboad. It enable text, images, or files to be stored in to single clipboard item.

<sup>all methods are asynchronous, and able to be accessed from `navigator.clipboard`</sup>

### Permissions
To check permission:
```js
navigator.permissions.query({name: "clipboard-read"}).then(result =>{
  if(result.state == "granted"){
    console.log("clipboard access granted");
  }
})
```

If you try to access clipboard when the page(tab) is not active, will throw error `DOMException: Document is not focused`

There is also a `allowWithoutGesture` flag to set clipboard permission, which means clipboard can be accessed by program(codee). This is a dangerous one, use by caution.

### Text Read and Write
```js
navigator.clipboard.readText().then((clipText) => console.log(clipText));

navigator.clipboard.writeText("This text will be write to the clipboard").then(() => {console.log("clipboarded")});
```

### Clipboard Events
```js
document.addEventListener("copy", async() => {
  console.log("Copied Text:", await navigator.clipboard.readText());
});
```

### Working wiht Non-Text Data
Clipboard API achieve Non-Text data through `ClipboardItem`, it consists 2 properties: `type` and `data`.

<sup>Please refer to MDN documentaion of `HTMLCanvasElement.toBlob()` [click here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)</sup>

```js
const blob = await new Promise((resolve) => document.createElement("canvas").toBlob(resolve, "image/png"));

const clipboardItem = new ClipboardItem({"image/png": blob});

navigator.clipboard.write([clipboardItem]);
```

To read:

```js
for(let clipboardItem of await navigator.clipboard.read()){
  for(let type of clipboardItem.types){
    if(type === "image/png"){
      let blob = await clipboardItem.getType(type);

      //rest of code for blob object
    }
  }
}
```

To use `ClipboardItemData` type:

```js
const clipboardItems = [new ClipboardItem([new ClipboardItemData(textData, "text/plain")])];

await navigator.clipboard.write(clipboardItems);
```

## CROSS-CONTEXT MESSAGING

Cross-document messaging, called XDM, is the ability to pass info between different execution contexts. Contexts include web workers, pages, iframes etc.

> For worker messaging, need to refer Chapter 24 `MessageChannel` and `BroadcastChannel`

- To send message
```js
let iframeWindow = document.getElementById("myframe").contentWindow;
iframeWindow.postMessage("A secret", "http://www.wiley.com");
```
- To receive message
message received through `onmessage` event handler, and there are 3 important pieces of info:
- data, strin gdata passed by `postMessage()`
- origin, the origin filled when passing the message
- source, A proxy of who sent message

```js
window.addEventListener("message", (event) => {
  if(event.origin == "http://www.wiley.com"){
    processMessage(event.data);
    event.source.postMessage("Received", "http://p2p.wiley.com");
  }
})
```

## FULLSCREEN API
- To enter fullscreen mode
```js
myDiv.requestFullscreen().catch(err => {
  console.error("Unable to enter fullscreen mode")
})
```
- To exit fullscreen mode
```js
document.exitFullscreen().catch(() => {
  console.error("Unable to exit fullscreen mode")
})
```
- To check wheather fullscreen is capable
`fullscreenEnabled` on `document` object

- To check which element is in fullscreen
```js
if(document.fullscreenElement){

}
```
- To listen for fullscreen event
```js
document.addEventListener("fullscreenchange", () =>{
  if(document.fullscreenElement){

  }
})
```

## GEOLOCATION API
```js
let p;
navigator.geolocation.getCurrentPosition((position) => {
  p = position
}, (e) => {
  console.log(e.code);
  console.log(e.message)
});
// p.coords.altitude
```

## DEVICE APIS

`window.navigator`, to visit browser info, operationg system info, hardware.

### Browser and Operating System Identification

## WEB COMPONENTS


## MEDIA ELEMENTS
## NOTIFICATIONS API
## PAGE VISIBILITY API
## TIMING APIs
## THE WEB CRYPTOGRAPHY API