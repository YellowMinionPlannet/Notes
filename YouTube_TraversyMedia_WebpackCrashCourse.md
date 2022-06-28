# What is Webpack?
* Module Bundler
* Custom Files or NPM Installed
* Generates Static Assets
* Extend with Plugins & Loaders

# Properties of a Module
* Discrete chunk of functionality
* Abstraction
* Encapsulation
* Usually a single task or responsibility

# How is Webpack Different
* Code Splitting (Load code on demand)
* Loader (CSS, SASS, JSX, etc) - Originally only load JS
* Clever Parsing (require('./people.js'))
* Plugins

# Example Loaders
* CSS & Style
* Sass & Less
* JSX
* Babel (ES6 to ES5)
* Coffee
* TypeScript
* json

# Webpack Installation
`npm install -g webpack`

`webpack source.js bundle.js --watch` (Watching our files)

```js
//source.js
let hello = require('./hello.js');
alert(hello)
```
```js
//hello.js
function getHello(){
    return "Hello There";
}
module.exports = getHello();
```
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Web Pack App</title>
    </head>
    <body>
        <script src="bundle.js"></script>
    </body>
</html>
```
Now we get result of popup window and shows "Hello There"

## Include CSS File

`npm install css-loader style-loader --save-dev`
```js
//source.js
require('!style-loader!css-loader! ./style.css')
let hello = require('./hello.js');
alert(hello)
```
```js
//hello.js
function getHello(){
    return "Hello There";
}
module.exports = getHello();
```
```css
/* style.css */
body{
    background: red;
}
```
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Web Pack App</title>
    </head>
    <body>
        <script src="bundle.js"></script>
    </body>
</html>
```
Now we have body with background of red color

## webpack.config.js
```js
//webpack.config.js
module.exports = {
    entry: './source.js',
    output: {
        path: __dirname, //current path
        file: 'bundle.js',
    },
    module: {
        loaders:[
            {
                {test: /\.css$/, loader: "style-loader!css-loader"}
            }
        ]
    }
}
```

```js
//source.js
require('./style.css')
let hello = require('./hello.js');
alert(hello)
```
```js
//hello.js
function getHello(){
    return "Hello There";
}
module.exports = getHello();
```
```css
/* style.css */
body{
    background: red;
}
```
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Web Pack App</title>
    </head>
    <body>
        <script src="bundle.js"></script>
    </body>
</html>
```
Now we use just `webpack` for command to bundle everything.

