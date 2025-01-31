# GET STARTED
## Quick Start
### Creating and nesting components
For React apps, pages are built by components, they could be small as a button or could be entire page. Each component has its own logic and appearance.

An example of a compoenent:

```jsx
function MyButton(){
    return (
        <button>I'm a button</button>
    );
}
```

When you build a small component, you can composites many of them into a nested component(larger one).

```jsx
export default function MyApp(){
    return (
        <div>
            <h1>Welcome to my app</h1>
            <MyButton />
        </div>
    );
}
```

NOTE: React component always starts with Capital letters.

JSX allows you to embed HTML syntax in to Javascript. And you can embed logic expression within JSX using curly braces. For example, you can do this:
```jsx
return (
  <h1>
    {user.name}
  </h1>
);
```
And you can also do this:
```jsx
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

You can do even more complex things like:

```jsx
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

### Conditional rendering
To add logic to achieve conditional rendering, you can do something like:

```jsx
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);

// or with a more compact way
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>

// and more extreme way

<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

### Rendering lists

You can apply `for` loop and `Array.map()` function to render iterate list.

For example:
```jsx
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];

const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

When redering lists, `key` property is required, you can use id in database to fill this property, this allow react to work when you do insert delete and update to your list items.

### Responding to events
When you assign event handler, you can assign function name to the corresponding property, but do not add `()` to it. 
```jsx
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

### Updating the screen
If you want a memory among refreshed pages and different components, you need to use `useState`. That memo is isolated to the current component. For example:

if we have `MyButton` like:
```jsx
import { useState } from 'react';
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```
Then we have `MyApp` like:
```jsx
export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}
```

Then each `MyButton` component has a its own state, each click will cause corresponding button to display its own `count` state.

### Using Hooks

Functions starting with `use` are called *Hooks*, they are buit-in functions, and very restrictive functions. You can build your own hooks on the top of other hooks. And it is required that you put hooks on the top of your components. If you want to use hooks in a condition or a loop, you need to extract a new component and put it there.


#### `useState` vs. `useReducer`
||`useState`|`useReducer`|
|-|-|-|
|Code size|coder will have less boilerplate code| with `useReducer`, coder can have state modified by different type of events|
|Readability|code is more centralized and easy to read, but when logic got complex, it's hard to scan| code is "categorized" corresponding to the type|
|Debugging|difficult to debug|scan each action, if no clue, then must be reducer|
|Testing||require pure function, and isolated, so easy to test|

### Sharing data between componets

`useState` usually located at the beginning of a component(template) and it's isolated among component's instances.

If you want to control multiple components using a same state. You need to scale up the state into their shared parent component. Please see example below:
```jsx
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

## Installation
# LEARN REACT
## Describing the UI
## Adding Interactivity
`useState` and `useReducer` all act like a memory or snapshot of the current rendering page. When the state changes, by calling setState or dispatch, it triggers the page to re-render.

Local variable is different from the state. When you use something like `setState([Primitive Value])` it changes the state, but this does not affect the local variable at current rendering round, but the local variable related will be updated when re-rendering is done. This change happens immediately through triggered event, and will cause the re-rendering if there's no further state manipulation.

If you want to persist the updates in a sequence of changing state, you need to use *updater* function.

Please see following example:
```jsx
import { useState } from 'react';
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log("first time, "count);
    setCount(count + 1);
    console.log("second time, "count);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}

```

In the previous example, both `console.log` will output [0, 0]at the initial rendering, and [1, 1], [2, 2], in the following re-rendering.

Now let's see if this happens in a sequence.

```jsx
import { useState } from 'react';
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log("first time, "count);
    setCount(count + 1);
    setCount(count + 1);
    console.log("second time, "count);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

In previous example, the output should be the same, [0,0], [1,1],[2,2].

Now if we want to persist value an do it in a sequence:
```jsx
import { useState } from 'react';
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log("first time, "count);
    setCount(count => count + 1);// updater function
    console.log("second time, "count);
    setCount(count => count + 1);
    
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

The output would be [0, 0], [2, 2], [4, 4], because each time we call `setCount` the count will be persisted to the next calling. It's like a queue.

Let's see a more tricky example:
```jsx
import { useState } from 'react';
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log("first time, "count);
    setCount(count => count + 1);// updater function
    console.log("second time, "count);
    setTimeout(()=> {
        setCount(count + 1);
    }, 5000)
    setCount(count => count + 1);
    
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```
This example output will be [0, 0] [1, 1] and [2, 2].

That's because the async operation will final trigger a rendering with **count = 0 and count + 1**, 

But observe the text on the button, it first appear as 2, because 2 updater function was executed in a sequence. And 5 senconds later, the text on button will become 1. 

## Managing State
