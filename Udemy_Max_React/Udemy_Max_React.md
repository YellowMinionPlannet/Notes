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
