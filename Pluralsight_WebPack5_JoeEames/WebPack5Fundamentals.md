# 2 Creating Builds with Webpack

## Introduction

### What the Web can do

```html
<h1>Welcome to my site</h1>
<!-- ...other code -->
<script src="mainpage.js" />
<script src="cartpage.js" />
<script src="common.js" />
```

When we develop a webpage as sample above. We need to put javascript code into script tags. However, `common.js` file might be referenced in `mainpage.js` and `cartpage.js` files and web browser loads scripts by the order of script tags, so we need to move `common.js` file up.

### Jobs of Bundlers

1. Bundle code: Improve performance and simplify deployments.(Get rid of white spaces, put/group code together, so there's smaller set of js file to download)
2. Transform code: Modern js not compatable to all browsers. (For example, type script is not recognized for browsers)
3. Incorporate Assets: Allow CSS, Images, Fonts, etc. to be included in your build.

## Creating a Simple Build

A simple sample:

```html
<!-- index.html v1.0-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Webpack Test</title>
  </head>
  <body>
    <h1>Carved Rock Fitness</h1>
    <script src="./src/index.js"></script>
  </body>
</html>
```

```js
//./src/index.js v1.0
const cart = [];
function log(message) {
  console.log(message);
}

funciton addToCart(item){
    cart.push(item);
    log("added: " + item);
}

function removeFromCart(index){
    cart.splice(index, 1);
    log("removed: ", index);
}

addToCart("Waterproof Boots");
```

- By convention, Webpack will look at the files inside `./src` folder.

1. At the project level, first do `npm init`
2. At the project level, do `npm i webpack webpack-cli -D`
3. `npx webpack`
4. We get `./dist` folder, and it contains `main.js`
5. Inside `main.js`, we can see compressed code of our original source code.

## Using the Webpack CLI

`npx webpack help`

`npx webpack version`

`npx webpack configtest` to test if your configuration is valid.

`npx webpack init` to start a new project with configuration file.

`npx webpack serve` to launch webpack development server

`npx webpack --watch` watch any updates of source file and rebuild.

In `package.json`,

```json
// package.json v1.0
{
  "name": "carvedrockfitness",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",

  "scripts": {
    "webpack": "webpack --watch"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^5.72.0",
    "webpack-cli": "^4.9.2",
    "webpack-dev-server": "^4.8.1"
  }
}
```

## Configuring Webpack

1. Create `webpack.config.js` in project folder.

```js
//webpack.config.js v1.0
const path = require("path"); //CommonJS modules

module.exports = {
  entry: "./src/index.js", //where to find source code
  output: {
    //where to output
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

2. run `npm run webpack`

## Adding Source Maps

```js
//webpack.config.js v2.0
const path = require("path"); //CommonJS modules

module.exports = {
  entry: "./src/index.js", //where to find source code
  output: {
    //where to output
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map", //create source map with inline-source-map mode
};
```

## Using the Webpack Dev Server

Jobs of Webpack Dev Server

1. Runs Webpack in watch mode
2. Provides HTTP Server
3. In-Memory(Everything built is in memory, and is not located anywhere in disk)

`npm i webpack-dev-server -D`

```js
//webpack.config.js v3.0
const path = require("path"); //CommonJS modules

module.exports = {
  entry: "./src/index.js", //where to find source code
  output: {
    //where to output
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map", //create source map with inline-source-map mode
  mode: "development", //To set dev-server in development mode
  devServer: {
    static: "./dist",
  },
};
```

`npx webpack serve` to start dev-server.

## Building Multiple Files

Now suppose we have `home.js util.js index.js` included for build.

```js
//./src/util.js
module.exports = {
  log: (message) => {
    console.log(message);
  },
};
```

```js
//./src/index.js v2.0

const util = require("./util");

const cart = [];
function log(message) {
  console.log(message);
}

funciton addToCart(item){
    cart.push(item);
    log("added: " + item);
}

function removeFromCart(index){
    cart.splice(index, 1);
    log("removed: ", index);
}

addToCart("Waterproof Boots");

```

```js
//./src/home.js
const util = require("./util");

function notificationRegister(email) {
  util.log("registering " + email);
}

notificationRegister("joe@joe.com");
```

```js
//webpack.config.js v4.0
const path = require("path"); //CommonJS modules

module.exports = {
  entry: ["./src/index.js", "./src/home.js"]//NOTE: util.js is not included here
  output: {
    //where to output
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map", //create source map with inline-source-map mode
  mode: "development", //To set dev-server in development mode
  devServer: {
    static: "./dist",
  },
};
```

Now we have `util.js home.js index.js` all built in `main.js`. Please note, we need to copy `index.html` into `dist` folder, and it is updated to

```html
<!-- index.html v2.0-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Webpack Test</title>
  </head>
  <body>
    <h1>Carved Rock Fitness</h1>
    <!-- UPDATES! -->
    <script src="./main.js"></script>
  </body>
</html>
```

# Creating Production-ready Builds

## Production vs. Dev Builds

### Why even use Production mode?

1. source map
2. configuration optimizations

```json
// package.json v2.0
{
  "name": "carvedrockfitness",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",

  "scripts": {
    "start": "webpack serve",
    "buildWIN": "set NODE_ENV=production&&webpack", // NOTE: put production value into node environment
    "buildMAC": "NODE_ENV='production' webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^5.72.0",
    "webpack-cli": "^4.9.2",
    "webpack-dev-server": "^4.8.1"
  }
}
```

```js
//webpack.config.js v5.0
const path = require("path"); //CommonJS modules

let production = process.env.NODE_ENV === "production"; // NOTE: get NODE_ENV value

let config = {
  entry: ["./src/index.js", "./src/home.js"]
  output: {
    //where to output
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map",
  mode: "development",
  devServer: {
    static: "./dist",
  },
};

if(production){
    config.mode = "production";
    config.devtool = "inline-source-map";
}

module.exports = config;

```

## Using Loaders

Now we need Babel to involve to achieve Polyfilling feature.
`npm i -D babel-loader @babel/core @babel/preset-env`

`npm install --save-dev @babel/core @babel/cli @babel/preset-env` according to the latest babel doc.

Now we need to update our `webpack.config.js`

```js
//webpack.config.js v6.0
const path = require("path"); //CommonJS modules

let production = process.env.NODE_ENV === "production"; // NOTE: get NODE_ENV value

let config = {
  entry: ["./src/index.js", "./src/home.js"]
  output: {
    //where to output
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  module:{
    rules:[
        {
            test: /\.js$/,
            exclude: /node_modules/, //RegEx syntax
            use: {
                loader: "babel-loader",
                options:{
                    presets: ["@babel/preset-env"],
                }
            }
        }
    ],
  },
  devtool: "inline-source-map",
  mode: "development",
  devServer: {
    static: "./dist",
  },
};

if(production){
    config.mode = "production";
    config.devtool = "inline-source-map";
}

module.exports = config;

```

## Adding TypeScript

1. Now we need to updates our source files into `.ts` files.

```ts
//./src/util.ts
export default function (message) {
  console.log(message);
}
```

```ts
//./src/index.ts

import util from "./util";

const cart = [];
function log(message) {
  console.log(message);
}

funciton addToCart(item){
    cart.push(item);
    log("added: " + item);
}

function removeFromCart(index){
    cart.splice(index, 1);
    log("removed: " + index);
}

addToCart("Waterproof Boots");

```

```ts
//./src/home.ts
import util from "./util";

function notificationRegister(email) {
  util.log("registering " + email);
}

notificationRegister("joe@joe.com");
```

```js
//webpack.config.js v7.0
const path = require("path"); //CommonJS modules

let production = process.env.NODE_ENV === "production";

let config = {
  entry: ["./src/index", "./src/home"] // NOTE: updates to no extension file name.
  output: {
    //where to output
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve:{ // NOTE: tell webpack to resolve when there's no .js file
    extensions: [".ts", ".js"]
  },
  module:{
    rules:[
        {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: "ts-loader",
        }
    ],
  },
  devtool: "inline-source-map",
  mode: "development",
  devServer: {
    static: "./dist",
  },
};

if(production){
    config.mode = "production";
    config.devtool = "inline-source-map";
}

module.exports = config;
```

2. We need to install new packages for TS.

`npm i -D typescript ts-loader`

## Creating Multiple Bundles

```js
//webpack.config.js v8.0
const path = require("path"); //CommonJS modules

let production = process.env.NODE_ENV === "production";

let config = {
  entry: {
    index: "./src/index", // NOTE: Now entry has multiple files and updated to a object type.
    home: "./src/home",
  }, // NOTE:
  output: {
    //where to output
    filename: "[name].js", // NOTE: [name] means the name of the entry object.
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },
  devtool: "inline-source-map",
  mode: "development",
  devServer: {
    static: "./dist",
  },
};

if (production) {
  config.mode = "production";
  config.devtool = "inline-source-map";
}

module.exports = config;
```
