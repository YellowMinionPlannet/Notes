# Why React
* Virtual DOM
* Web Component
> Further reading about Virtual DOM??

# JSX
* You can write HTML tag in a javascript file. 
* By convention, you quote the JSX tags into parenthese. 
* For class attribute, you should write className instead.
* We need to import React to "read" JSX
* While we put text in JSX, it will read as content of HTML, but if we want to put variable in it, we need curly braces.
* at compile time, JSX is compiled as *React.createElement()* method
```JSX
import React from "react"
import Component1 from "./Component1"
import Component1 from "./Component2"
const componentsArray = [<Component1/>, <Component2/>];
<div>this.props.username</div>
<div>{componentsArray}</div>
```
# ReactDOM
How we use ReactDOM.
```JSX
import React from "react"
import ReactDOM from "react-dom"

ReactDOM.render(<div></div>, document.getElementById("root"));
```
* The first parameter is for JSX, what we want to put in the HTML content 
* The second parameter is for where we want to put the content.

# Functional Component
```JSX
import React from "react"
import ReactDOM from "react-dom"

function Component1(props){
    const title = "React Rocks!";
    return (
        <div>{title}</div>
    );
}

export default Component1

import Component1 from "./Compoent1"
function App (){
    return (
        <Component1/>
    );
}
```
# Styling
* We need to import css file for styling the element
* by using className attributes in JSX element, we can specify styling for those classs
* We can also use inline style in JSX by passing a styling object. Remember to use *Camel Case* for <u>dashed properties</u>.

# Class Based Component
```jsx
class Component1 extends React.Component{
    render(){
        return (
            <div>this.props.username</div>
        );
    }
}
```

# Props
* props can be used for passing variables from one component to another.
* However, props can not be changed by the component which received the props.
* For Read Only, and pages of display purpose
* We can pass down props as arguments using attributes in Component tag
* We can receive props in *Functional Component* by declaring props parameter at the function parenthese
* We can directly using props by ```this.props``` in *Class Based Component* 
* We need to pass down key property if we want to render a list of component by using ```{compoentsArray}```

```jsx
import React from "react"
import ReactDOM from "react-dom"

import Component1 from "./Component1"

function App (){
    return (
        <Component1 username="Lei Zhong" key={1} />
    );
}
export default App

function Component1(props){
    return (
        <h1>{props.username}</h1>
    );
}
```


# State
* State lives only in *Class Based Components*
* State must initialized as null / object in constructor
* use this.state to initialize and read from any part of the class

```jsx
import React from "react"
import ReactDOM from "react-dom"

class App extends React.Component {
    constructor(){
        super();
        this.state = {
            data: [1,2,3,4,4,5]
        }
    }
    
    render(){
        const components = this.state.data.map((d)=> (<Component number={d}/>););
        return (
        <div>{components}</div>
        );
    }
}
export default App
```

```jsx
import React from "react"
import ReactDOM from "react-dom"

class App extends React.Component{
    constructor(){
        super();
        this.state = {
            count: 1
        }
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(){
        this.setState((prevState) => {
            return {
                count: prevState.count + 1;
            }
        });
    }

    render(){
        return (<div>
            <h1>{this.state.count}</h1>
            <input type="button" onclick={this.handleChange}>
        </div>);
    }
}

export default App
```
# Form

```jsx
import React from "react"
class Form extends React.Component{
    constructor() {
        super();
        this.state = {
            firstName: "",
            lastName: "",
            age: 0,
            sex: "",
            isAdult: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let { name, value } = event.target;
        value = event.target.type == "checkbox" ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <form>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" onChange={this.handleChange} />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" onChange={this.handleChange} />
                </div>
                <div className="form-group">
                    <lable>Age</lable>
                    <input type="number" name="age" onChange={this.handleChange} />
                </div>
                <div className="form-group">
                    <label>Sex</label>
                    <input type="radio" name="sex" value="male" onChange={ this.handleChange}/>
                    <input type="radio" name="sex" value="female" onChange={ this.handleChange}/>
                </div>
                <div className="form-group">
                    <label>Adult</label>
                    <input type="checkbox" name="isAdult" onChange={ this.handleChange}/>
                </div>
                <div>{this.state.firstName} {this.state.lastName} is {this.state.age} years old who is {this.state.sex} and is { this.state.isAdult? "Adult": "Teenager"}</div>
                <button>Submit</button>
            </form>);
    }
}
export default Form
```