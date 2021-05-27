# Section 2: JavaScript Refresher
## Reference and Primitive Types Refresher
When you want to do a real copy of reference type, you can use spread operater.
```js
const person = {
    name: "Max"
};

const secondPerson = {
    ...person
}

const thirdPerson = person

person.name = "Manu"

console.log(secondPerson);//Max
console.log(thirdPerson);//Manu
console.log(person);//Manu
```

# Section 3: React Basics & Working With Components
## The Concept of "Composition" ("children props")
```props.children``` is a reserved word in React. It will pass the content of targeted Customized Component tag. We can use this technique to build a "Card" wrapper.
```jsx
function Card(props){
    return (
        const classname = "card " + props.className;
        <div className={classname}>{props.children}</div>
    );
}

function ExpenseItem(props){
    return (
        <Card className="expense-item">
            <ExpenseDate date={props.date} />
            <div className="expense-item__description">
                <h2>{props.title}</h2>
                <div className="expense-item__price">${props.amount}</div>
            </div>
        </Card>
    );
}
```
# Section 4: React State & Working with Events
## How Component Functions are Executed
Component function is actually a normal function as it is normally nested in an ```<App/>``` component. When page is visited, ```React.Render``` is first called and it would call every component functions nested in it. Without **state** in it and after the first calling, the components updating would be done. No matter how hard you change the **props** it would not update the components. But **state** is used to tell React to re-evaluate components' changes and get ready to update components again.

## Working with "state"
```useState``` is a special **hook** in React, it will change the component function's variables(including props) into state and inform React to update that props.

```jsx
const ExpenseItem = (props) =>{
    const [title, setTitle] = useState(props.title);
    //always return two elements,
    //1st is the current state value
    //2nd is the function to change the state value 
    
    let title = props.title;
    const clickHandler = () =>{
        setTitle("Updated");
        console.log(title);//Here we print out the original value of state value, because the change is scheduled but not executed right away.
    };

    return (
        <Card className="expense-item">
            <ExpenseDate date={props.date} />
            <div classsName="expense-item__description">
                <h2>{title}</h2>
                <div className="expense-item__price">${props.amount}</div>
                <button onClick={clickHandler}>Change Title</button>
            </div>
        </Card>
    );
}
```