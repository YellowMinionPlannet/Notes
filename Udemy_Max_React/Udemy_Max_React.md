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

## Updating State that Depends on Previous State

In the "set" Method which returned by ```useState``` method, if we want to update the state which depends on previous state, we need to use a special function to do this.

```jsx
const ExpenseForm = (props) => {
  const [userInput, setUserInput] = useState({
    enteredTitle: '',
    enteredAmount: '',
    enteredDate: '',
  });

  const titleChangeHandler = (event) => {
    //Here we use prevState to receive previous State
    setUserInput((prevState) => {
      //Here we override enteredTitle
      return { ...prevState, enteredTitle: event.target.value };
    });
  };

  const amountChangeHandler = (event) => {
    setUserInput((prevState) => {
      return { ...prevState, enteredAmount: event.target.value };
    });
  };

  const dateChangeHandler = (event) => {
    setUserInput((prevState) => {
      return { ...prevState, enteredDate: event.target.value };
    });
  };

  return (
    <form>
      <div className='new-expense__controls'>
        <div className='new-expense__control'>
          <label>Title</label>
          <input
            type='text'
            value={userInput.enteredTitle}
            onChange={titleChangeHandler}
          />
        </div>
        <div className='new-expense__control'>
          <label>Amount</label>
          <input
            type='number'
            min='0.01'
            step='0.01'
            value={userInput.enteredAmount}
            onChange={amountChangeHandler}
          />
        </div>
        <div className='new-expense__control'>
          <label>Date</label>
          <input
            type='date'
            min='2019-01-01'
            max='2022-12-31'
            value={userInput.enteredDate}
            onChange={dateChangeHandler}
          />
        </div>
      </div>
    </form>
  );
};
```
## Handling Form Submission
## Adding Two-Way Binding
When we handle form submission, we can use ```onSubmit``` event on form element.
Doing Two-Way Binding we need to set element's value to state and onChange event to state's "set" method
```jsx
const ExpenseForm = (props) => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  const [enteredDate, setEnteredDate] = useState('');

  const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
  };

  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);
  };

  const dateChangeHandler = (event) => {
    setEnteredDate(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const expenseData = {
      title: enteredTitle,
      amount: enteredAmount,
      date: new Date(enteredDate),
    };

    props.onSaveExpenseData(expenseData);
    setEnteredTitle('');
    setEnteredAmount('');
    setEnteredDate('');
  };

  return (
    <form onSubmit={submitHandler}>
      <div className='new-expense__controls'>
        <div className='new-expense__control'>
          <label>Title</label>
          <input
            type='text'
            value={enteredTitle}
            onChange={titleChangeHandler}
          />
        </div>
        <div className='new-expense__control'>
          <label>Amount</label>
          <input
            type='number'
            min='0.01'
            step='0.01'
            value={enteredAmount}
            onChange={amountChangeHandler}
          />
        </div>
        <div className='new-expense__control'>
          <label>Date</label>
          <input
            type='date'
            min='2019-01-01'
            max='2022-12-31'
            value={enteredDate}
            onChange={dateChangeHandler}
          />
        </div>
      </div>
      <div className='new-expense__actions'>
        <button type='submit'>Add Expense</button>
      </div>
    </form>
  );
};
```

# Section 5: Rendering Lists & Conditional Content
## Using Stateful List
To have a dynamic list, we can use map method to transform our data into array of customized components.
```jsx
const Expenses = (props) => {
  const [filteredYear, setFilteredYear] = useState('2020');

  const filterChangeHandler = (selectedYear) => {
    setFilteredYear(selectedYear);
  };

  const filteredExpenses = props.items.filter((expense) => {
    return expense.date.getFullYear().toString() === filteredYear;
  });

  let expensesContent = <p>No expenses found.</p>;

  if (filteredExpenses.length > 0) {
    //Here we use map method to extract out useful data info
    expensesContent = filteredExpenses.map((expense) => (
      <ExpenseItem
        key={expense.id}
        title={expense.title}
        amount={expense.amount}
        date={expense.date}
      />
    ));
  }

  return (
    <div>
      <Card className='expenses'>
        <ExpensesFilter
          selected={filteredYear}
          onChangeFilter={filterChangeHandler}
        />
        {expensesContent}
      </Card>
    </div>
  );
};
```