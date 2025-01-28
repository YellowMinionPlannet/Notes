# Appendix for React

## Javascript `export` and `import` keyword explained

[Source Material](https://javascript.info/import-export)

### Export before declarations

In a most direct way, we can export before declaration, this is an example:

```js
// export an array
export let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// export a constant
export const MODULES_BECAME_STANDARD_YEAR = 2015;

// export a class
export class User {
  constructor(name) {
    this.name = name;
  }
}

export function sayHi(user) {
  alert(`Hello, ${user}!`);
} // no ; at the end
```

### Export apart from declarations

Also, we can export after things get declared. See this example:

```js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

function sayBye(user) {
  alert(`Bye, ${user}!`);
}

export { sayHi, sayBye }; // a list of exported variables
// we can also put export before functions
```

### Import \*

Usually we put a list of what to import in curly braces, See this example:

```js
import { sayHi, sayBye } from "./say.js";

sayHi("John"); // Hello, John!
sayBye("John"); // Bye, John!
```

Also, if we want to import everything, we can do this:

```js
import * as say from "./say.js";

say.sayHi("John");
say.sayBye("John");
```

Although, webpack will help us reduce the redundant imports, but still, it's clean to write as the first way to demo which specific part we are using.

### Import "as"

We can use different name when we import,

```js
import { sayHi as hi, sayBye as bye } from "./say.js";

hi("John"); // Hello, John!
bye("John"); // Bye, John!
```

### Export "as"

Similar to export,

```js
export { sayHi as hi, sayBye as bye };
```

### Export default

Remember this corresponding relation, default export don't need curly braces when importing!
|export syntax|import syntax|
|-|-|
|export default class User{}|import User from|
|export class User {}|import {User} from|

When a module export a default and also other named ones, import syntax will be special, here is the example:

```js
// 📁 user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}

export function sayHi(user) {
  alert(`Hello, ${user}!`);
}

// 📁 main_version1.js
import { default as User, sayHi } from "./user.js";

new User("John");

// 📁 main_version2.js
import * as user from "./user.js";

let User = user.default; // the default export
new User("John");
```

When a module export a default and also other named ones, import everything by `*` gives you additional property `default` wo visit default export, see this example:

```js
// 📁 main.js
import * as user from './user.js';

let User = user.default; // the default export
new User('John');
```

So if it is default export, you can use any name when importing, see this example:
```js
// 📁 user.js
export class User {
  constructor(name) {
    this.name = name;
  }
}

export function sayHi(user) {
  alert(`Hello, ${user}!`);
}

import {User} from './user.js';
// import {MyUser} won't work, the name must be {User}


// 📁 user_version2.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}
import User from './user.js'; // works
import MyUser from './user.js'; // works too
// could be import Anything... and it'll still work
```

### Re-export
We can use `export ... from ...` to immediat3ely export(re-export) them.
```js
export {sayHi} from './say.js'; // re-export sayHi

export {default as User} from './user.js'; // re-export default
```

So these `export ... from ...` is actually the shorter version of `import... export...`, see this example of re-export using `import... export...`:
```js

// 📁 auth/index.js

// import login/logout and immediately export them
import {login, logout} from './helpers.js';
export {login, logout};

// import default as User and export it
import User from './user.js';
export {User};
```

So we have problem when writing default export, 
if we have something like:
```js
// 📁 user.js
export default class User {
  // ...
}
```
To re-export, we need:
```js
export {default as User} from './user.js'; // re-export default
```
But following won't work:
```js
// This won't work
export User from './user.js'
```

If we need to import both named and default exports, we need:
```js
export * from './user.js'; // to re-export named exports
export {default} from './user.js'; // to re-export the default export
```

## Javascript dynamic import explained

We can achieve dynamic import by `import()`
```js
let modulePath = prompt("Which module to load?");

import(modulePath)
  .then(obj => <module object>)
  .catch(err => <loading error, e.g. if no such module>)


// 📁 say.js
export function hi() {
  alert(`Hello`);
}

export function bye() {
  alert(`Bye`);
}

// 📁 index.js
let {hi, bye} = await import('./say.js');

hi();
bye();

// 📁 index_version2.js
let obj = await import('./say.js');
let say = obj.default;

say();
```
In HTML:
```html
<!doctype html>
<script>
  async function load() {
    let say = await import('./say.js');
    say.hi(); // Hello!
    say.bye(); // Bye!
    say.default(); // Module loaded (export default)!
  }
</script>
<button onclick="load()">Click me</button>
```
## Javascript strict mode explained
Use `"use strict"` or `'use strict'` to say below is for new features. Or by default, new feature won't work. Remember class and module are automatically new featured.
