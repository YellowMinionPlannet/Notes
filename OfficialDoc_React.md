# Main Concepts
## Introducing JSX
### Why JSX
JSX allows user to write UI and logic in the same Javascript file.
### Embedding Expressions in JSX
For example, you can write javascript variable and wrap it in curly braces in UI expression like example below.
```jsx
import ReactDOM from "react-dom";

const name = "Josh Perez";
const element = <h1>Hello, {name}</h1>

ReactDOM.render(element, document.getElementById("root"));
```
You can also write javascript expression into curly braces.
```jsx
function formatName(user){
    return user.firstName + " " + user.lastName;
}

const user = {
    firstName: "Harper",
    lastName: "Perez"
}

const element = (
    <h1>
        Hello, {formatName(user)}
    </h1>
);

ReactDOM.render(
    element,
    document.getElmeentById("root");
);
```

You can treat JSX as an expression.
```jsx
function getGreeting(user){
    if(user){
        return <h1>Hello, {formatName(user)}</h1>
    }
    return <h1>Hello, stranger</h1>
}
```

**JSX prevents injection attacks**
Everything is converted to a string and do escapes before being rendered.
This can prevent XSS(cross-site-scripting)

### JSX Represents Objects
Example of following is identical
```jsx
const element = (
    <h1 className="greeting">
        Hello, world!
    </h1>
);

const element = React.createElement(
    "h1",
    {className: "greeting"},
    "Hello, world"
);

//The object structure of React.createElement is
const element= {
    type: "h1",
    props:{
        className: "greeting",
        children: "Hello, world!"
    }
}
```

## Rendering Elements
### Rendering an Element into the DOM
Use ReactDom.render() to render a jsx element to the target DOM element which specified in the second parameter.

```jsx
const element = <h1>Hello, world</h1>
ReactDOM.render(element, document.getElementById("root"));
```

### Updating the Rendered Element
React elements are immutable. Once created it's like the UI at certain point in time. So if you wants to update React element, the only way is to call ReactDOM.render() again.

```jsx
function tick(){
    const element = (
        <div>
            <h1>Hello, world</h1>
            <h2>It is {new Date().toLocaleTimeToString()}</h2>
        </div>
    );

    ReactDOM.render(element, document.getElementById("root"));
}

setInterval(tick, 1000);
```
### React Only Updates What's Necessary
If you open the browser and inspect on the DOM element corresponding to the JSX before, although we called ReactDOM.render() for several times, you will see only changed part(dates part) is updated. However, the rest of the DOM is remained same.

## Components and Props
### Function and Class Components
The simplest way is to write function component
```jsx
function Welcome(props){
    return <h1>Hello, {props.name}</h1>
}
```
We can also use ES6 class to define a component, we can use props as ```this.props``` directly.
```jsx
class Welcome extends Reat.Component{
    render(){
        return <h1>Hello, {this.props.name}</h1>;
    }
}
```
### Rendering a Component
When JSX sees a user defined component, it passes props by declaring attributes in the user defined component element. And pass a object as props to the component.
```jsx
function Welcome(props){
    return <h1>Hello, {props.name}</h1>
}
const element = <Welcome name="Sara"/>;
ReactDOM.render(element, document.getElementById("root"));
```
What happens in example above?
1. Call ReactDOM.render()
2. call Component Welcome with object {name: "Sara"} as the props
3. Welcome return a h1 element as result
4. ReactDOM compares the previous one and current one, and updates the DOM efficiently.

### Props are Read-Only
Props are Read-Only, so do not try to change props directly.
```jsx
function withdraw(account, amount){
    account.total -= amount;
}
```
# State and Lifecycle
Following code demonstrate a sample with a time ticker who works with the page. ComponentDidMount trigger every time Compoenent is updated to DOM.
```jsx
class Clock extends React.Component{
    constructor(){
        super();
        this.state = {
            date: new Date().
        }
    }


    componentDidMount(){
        this.timerId = setInterval(() => this.tick(), 1000);
    }
    componentWillMount(){
        clearInterval(this.timerId);
    }
    render(){
        return(
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}</h2>
            </div>
        );
    }

    ReactDOM.render(<Clock/>, document.getDocumentById);
}

```

### Using State Correctly
#### Do Not Modify State Directly
You cannot do this:
```jsx
this.state.comment = "Hello";
```
Instead, we can use this:
```jsx
this.setState({Comment: "Hello"});
```

#### State Updates May Be Asynchronous
We can't do this:
```jsx
this.setState({
    counter: this.state.counter + this.props.increment
});
```
We should do this:
```jsx
this.setState((state, props)=>({
    counter: state.counter + props.increment
}));
```
Here, we receive state as previous state and props as the props at the time this update is applied.


#### State Updates are Merged
```jsx
constructor(props){
    super(props);
    this.state = {
        posts: [],
        comments: []
    }
}

componentDidMount(){
    fetchPosts().then(response => {
        this.setState({
            posts: response.posts
        });
    });
    fetchComments().then(response => {
        this.setState({
            comments: response.comments
        });
    });
}
```
These two setState() method will updates the State completely, although they are called seperately.

# The Data Flows Down
State only can be fully controlled by the component itself, it cannot be shared. However it can be passed to child component as props.
```jsx
<FormattedDate dae={this.state.date} />
function FormattedDate(props){
    return <h2>It is {props.date.toLocaleTimeString()}</h2>
}
```
Each component's state is isolated.
```jsx
funciton App(){
    return(
        <div>
            <Clock />
            <Clock />
            <Clock />
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById("root");
);
```
