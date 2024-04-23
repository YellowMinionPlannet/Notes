# 12 The Browser Object Model

For years, there is lack of specification for BOM. However, HTML 5 covers the major aspects of the BOM.

## THE WINDOW OBJECT

The window object represents an instance of the browser. This object has following purposes:

1. JavaScript interface to the browser
2. The ECMAScript Global object

So in the following context of notes, global object could be `window` object if it's web page environment, or the global object could be something else.

> Many browser APIs and associated constructors use a window object property as an access point. These contents are covered in Chapter 18

### The Global Scope

```js
var age = 29;
var sayAge = () => alert(this.age);

alert(window.age); //29
sayAge(); //29
window.sayAge(); //29
```

This is not happening when using `let` or `const`.
```js
let age = 29;
const sayAge = () => alert(this.age);

alert(window.age); // undefined
sayAge(); // undefined
window.sayAge(); // TypeError: window.sayAge is not a function
```

- An interesting example
```js
var newValue = oldValue; // thorws an error

var newValue = window.oldValue; // newValue set to undefined
```

### The `globalThis` property

Depending where JavaScript is executing, the global object takes on different forms:
- Web page script, `window`, `self`, `frames`
- Web worker script, `self`, *worker concept is introduced in Chapter 24*
- Node.js, `global`
- In the top level of a script, `this` usually refers to the global object.

The purpose of using `globalThis`:
1. `globalThis` standardizes access to the global `this` object, eg. for web page, `globalThis === window`, for worker script, `globalThis === self`.
2. `globalThis` is a configurable and writable indirect reference the global object, allowing for scripts to modify and control the properties and behavior of `globalThis`

In non-browser engines, `globalThis` directly reference the global object, but it references global object through proxy instance **in browser engines**.

### Window Relationships

`top` object always points to the very top window, `parent` points to the immediate parent window. When `top === parent`, it means you are at the topmost window.

`self` is also a property on *Window* interface, `window` is also a property on *Window* interface. These two properties can be used intercahngeably.

> Look at these concept within [mdn web docs](developer.mozilla.org).


### Window position and Pixel Ratio

`window.moveTo()` and `window.moveBy()` can only be effective to the window that is opened by `window.open()`.

Try this,
```html
<!DOCTYPE html>
<html>
<body>

<h1>The Window Object</h1>
<h2>The moveTo() Method</h2>

<p>Open "myWindow" and move it to the position 500 x 100:</p>

<button onclick="openWin()">Open "myWindow"</button>
<button onclick="moveWin()">Move "myWindow"</button>

<script>
let myWindow;

function openWin() {
  myWindow=window.open("", "", "width=400, height=200");
}

function moveWin() {
  myWindow.moveTo(500, 100);
}
</script>

</body>
</html>
```
#### Pixel Ratios

CSS pixel is uniform measurement accross differnt devices.
For example, 12px font on a low-resolution tablet should appear the same size as 12px font on a hight resolution monitor.

Well, this sentence does not mean anything.
The actual physical size of the text of, for example, 100px, is depending on the Resolution in the current system setting, and the physical length of the current screen diagonal.

For example, we create this 100px red-colored text in the webpage and displayed in the browser.

Suppose the highest resolution of the device's screen is 2240*1400, 100%, and the diagonal is 14 inches. The text's physical length would be 6.7 cm.

And if we change the setting into 1920*1200, 100%, and diagonal is 14 inches unchanged. The text's physical length would be 7.7cm.

The relation could be calculated as follow:

Sqr(2240<sup>2</sup> + 1400<sup>2</sup>) / 14 = 188 px/inch
Sqr(1920<sup>2</sup> + 1200<sup>2</sup>) / 14 = 161 px/inch

100 px / (188 px/inch) = 0.53 inch
100 px / (161 px/inch) = 0.62 inch

0.53/0.62 = 6.7/7.7

The fomula of Sqr(HighestResolutionWidth<sup>2</sup> + HighestResolutionHeight<sup>2</sup>) / Physical Diagonal of Screen is the definition of ppi, which is pixels per inch. This value is critical when comparing monitor's clearity.

### Window Size

- `window.outerWidth` and `window.outerHeight` is the available size of a browser display area(including the toolbar and borders). This will be narrowed when you use dev tool and set to Responsive mode. The `window.outerWidth` and `window.outerHeight` would be like 400 * 712, because you changed to Portrait. When you cancel the responsive mode, and maximize the browser, this values are actually the `screen.width` and `screen.height`.

- `window.innerWidth` and `window.innerHeight` is the content area of the browser, this would be the same with `document.documentElement.clientWidth` and `document.documentElement.clientHeight`. However, if you are using smart phone, when you zoom-in and zoom-out, these values would be the visible area size of the page, where `document.documentElement` values would be always equal to the page view port size.

- `window.visualViewport.height` can be accessed if the browser support visualviewport api. It's a concept to smart device only. When you browsing page through smart device, and zoom-in and zoom-out, the layout viewport, which is the real viewport will be the same as the window.However the visible part of page, which is only part of the layout viewport is called visual viewport, will be changed. So `window.visualViewport.height` is different from `window.innerHeight` if you try to press `shift` + `leftbuton` + `drag`(simulating zooming in dev mode of browser).

### Windows Viewport Position

This offset values could be accessed with `window.pageXOffset / window.scrollX` and `window.pageYOffset / window.scrollY`

### Navigating and Opening Windows
This content is about `window.open()` method and `window.close()` method and `window.opener`, `window.closed`property.

- `window.open` accept 4 arguments
- `window.opener` refers the object which opens the current window
```js
let wileyWin = window.open("http://www.wiley.com", "wileyWindow", "height=400, width=400, top=10, left=10, resizable=yes");

wileyWin.close();
console.log(wileyWin.opener === window); // true
console.log(wileyWin.closed);// true
```

- How to check if pop-up window feature is blocked?
```js
let blocked = false;

try{
    let wileyWin = window.open("http://www.wiley.com", "_blank");

    if(wileyWin == null){
        blocked = true;
    }
}catch(ex){
    blocked = true
}

if(blocked){
    alert("The popup was blocked!");
}
```

### Intervals and Timeouts

This content is about `window.setTimeout` and `window.setInterval` methods.

> From the previous chapter, when we discuss promise, we know that there are *message queue* and *microtask queue* and setTimeout is scheduled to *message queue* which has lower priority than *microtask queue*.(Promise is scheduled to the later)

- `window.setInterval` will schedule the callback function after x ms, where x is defined by 2nd argument. And no matter how long the callback gonna take, the window will repeat this scheduling right after x ms. Remember that the scheduled callback is started only when the message queue is empty.

### System Dialogs

`window.alert()`, `window.confirm()`, and `window.prompt()` will open a modal, which will stop execution thread of the current window, the execution will be continued as long as these modals are dismissed. 

These modals cannot be controlled by CSS code.

`window.find()` and `window.print()` will start a async modal, you cannot have control when these modals are fired.

## THE LOCATION OBJECT

Both `window.location` or `document.location` points to the same `location` object.

For example, if we have `http://foouser:barpassword@www.wiley.com:80/WileyCDA/?q=javascript#contents` for the current browser. We can use following property name to get values.
|PROPERTY NAME|RETURN VALUE|DESCRIPTION|
|-|-|-|
|location.hash|"#contents"|Will return pound sign (`#`) followed by zero or more characters. Or will return empty string if there isn't a hash fragment|
|location.host|"www.wiley.com:80"|The name of the server and port number if present|
|location.hostname|"www.wiley.com"|The name of the server without the port number|
|location.href|"http://foouser:barpassword@www.wiley.com:80/WileyCDA/?q=javascript#contents"|The full URL of the currently loaded page. Same as `location.toString()`|
|location.pathname|"/WileyCDA/"|The directory and/or filename of the URL|
|location.port|"80"|The port of the request if specified in the URL. **If a URL does not contain a port, then this property returns an empty string.**|
|location.protocal|"http:"||
|location.search|"?/q=javascript"|The query string of the URL.**It returns a string beginning with a question mark.** Or return empty string if none.|
|location.username|"foouser"|The username specified before the domain name|
|location.password|"barpassword"|The password specified before the domain name|
|location.origin|"http://ww.wiley.com"|The origin of the URL. Read ONLY|

#### Manipulating the Location
The location can be changed in number of ways:
1. `location.assign("http://www.wiley.com");`
    - browser will start to load the content from the new URL
    - browser enters the history stack
    
2. if we set `location.href`
3. Or we set `window.location` to a URL, `assign()` method will be called with that value

By changing `search`, `hostname`, `pathname`, `port` properties on `location` with a new value will cause reloads with the new URL and new entry in the browser's history stack .

By changing `hash`:
- no reloads
- add new entry in browser's history

If you want to replace the current history entry with a new URL, use `location.replace()`.
```html
<!DOCTYPE html>
<html>
    <head>
        <title>You won't be able to get back here</title>
    </head>
    <script>
        setTimeout(() => location.replace("http://www.wiley.com"), 1000);
    </script>
</html>
```
After 1 sec, you are going to load `www.wiley.com`, but "Back" button will be disabled, since the last history entry is replaced by "http://www.wiley.com".

If you want to reload:
1. `location.reload()`, from cache if available
2. `location.reload(true)`, force to reload from server

## THE NAVIGATOR OBJECT

This is a standard for all JavaScript-Enabled web browser.

> TODO: investigate on the table in text book

### Registering Handler

> TODO: investigate on concept of "Web-based protocol handlers"

## THE SCREEN OBJECT

## THE HISTORY OBJECT
We cannot know exact URL user visited through this object, but we can go forward and backward using methods on this object.

```js
//go back one page
history.go(-1);
//go forward one page
history.go(1);
//go forward two pages
history.go(2);

//go to nearest wiley.com page
history.go("wiley.com");
// go to nearest nczonline.net page
history.go("nczonline.net");

//go back one page
history.back();
//go forward one page
history.forward();

if(history.length == 0){
    // this is the first page in the user's window.
}
```
### History State Management
