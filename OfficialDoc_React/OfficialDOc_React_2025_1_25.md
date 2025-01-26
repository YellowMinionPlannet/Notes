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

