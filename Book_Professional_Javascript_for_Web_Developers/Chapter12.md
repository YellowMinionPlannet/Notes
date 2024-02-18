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


