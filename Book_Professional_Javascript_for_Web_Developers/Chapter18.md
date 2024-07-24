# Chapter 18 JavaScript APIs

## TYPED ARRAYS (From Chapter 6, Prerequisites)

The capability to manipulate memory is scaled when 3D graphics API is introduced.

### Using ArrayBuffers
> The `TypedArrayBuffer` is a variant of the `ArrayBuffer` that can be passed between execution contexts without performing a copy.
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