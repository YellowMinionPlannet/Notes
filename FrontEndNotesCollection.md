# about Box Model
## `box-sizing` property
it has two values:
- `content-box`
- `border-box`

## `height` property
- If we have `box-sizing: content-box`, which is default, we have height of content "real" height. That is the height of content only(without paddings and borders).
- If we have `box-sizing: border-box`, we have height of box-model excluding margin. That is content "real" height + paddings + borders.

# about differnt `height` properties
## Layout Viewport vs. Visual Viewport
- Layout Viewport: the browser's area that draws the web page.
- Visual Viewport: the visible part of browser's layout viewport.
eg. using mobile device, we can pinch to zoom in and zoom out. When we zomm in or zoom out, the layout viewport does not change, but the visual viewport changes accordingly.

## `height` properties
- `innerHeight`, which is a property of `window` object. It is the "layout viewport" of the browser. So if scroll bar is available, the scroll bar is included.

- `outerHeight`, which is a property of `window` object. It is the "layout viewport" plus the sidebar, menus, window chrome, and window resizing borders/handles.

- `scrollY`, which is a property of `window` object. It is the distance from the beginning of the web page, no matter it's out of current viewport or inside, to the top of the visible viewport. So we don't scroll, `scrollY` is 0.

- `pageYOffset`, which is a property of `window` object. It is the alias of `scrollY` and works perfectly on IE browsers and other browsers. Same as `document.documentElement.scrollTop` of the IE8.

- `scrollHeight`, which is a property of `element` obejct. It is the visible and unvisible total height of a element. `documentElement.scrollHeight` is usually larger than the `window.innerHeight` because you can scroll down. This value includes content "real" height and paddings. But it excludes borders, margins and scrollbars. It also includes pseudo-elements size.

- `clientHeight`, which is a property of `element` object. It is the content "real" height and the paddings. It excludes scroll bars.

# about `console.log` vs. `console.dir`
with `console.log`, you can print a list of objects or a list of strings.
- list of objects will appear as the order of they are inputed
- `console.log` will log the reference of the object
Example:
```js
var object = {};
console.log(object);// when we open the console, the prop valued 1234 will be included within that object, but propDelay will not appear even it's 10 seconds passed. But propDelay will appear when you revisit the object.
object.prop = "1234";

setTimeout(() => {
  object.propDelay = "10 seconds";
  console.log("10 seconds passed"); // print out after 10 seconds
}, 10000);

// Way of retrieving object at the console.log moment
console.log(JSON.parse(JSON.stringify(object)));
```

with `console.dir`, you can print out properties of an object, it also accept a option object as second arguments.
|Table of option object|colors|depth|showHidden|
|-|-|-|-|
|**Defaults**|true|2|false|
|**Descriptions**|Style the properties according to their type|Number of levels to print|wheather to print non-enumerable and symbol properties|