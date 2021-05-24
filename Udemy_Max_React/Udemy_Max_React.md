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
# Section 4: React State & Working with Events
## How Component Functions are Executed
Component function is actually a normal function as it is normally nested in an ```<App/>``` component. When page is visited, ```React.Render``` is first called and it would call every component functions nested in it. Without **state** in it and after the first calling, the components updating would be done. No matter how hard you change the **props** it would not update the components. But **state** is used to tell React to re-evaluate components' changes and get ready to update components again.
