# Section 9: The Tricky Parts: Scope & Closures

## Recaping Var & Scope
var keyword and function scope chain:

```js
var color = "red"; // this will set color porperty at window object. eg. window.color

function blah() { // this function has access to color
  console.log(color); 

  var animal = "Flamboyant Cuttlefish";
}

if(true){ // this block has access to color
  console.log(color);
  var food = "Chicken Parmesan"; // this also set food property at window object. eg. window.food
}

console.log(food); // here we can access to food outside the condition block
console.log(animal); //undefined, var keyword is only constrained within function scope chain.

for(var i = 0; i < 10; i++){
  console.log(i);
}
console.log(i); // 10, i can be accessed here, which is declared as window.i
```

## Recaping Let, Const, & Scope
