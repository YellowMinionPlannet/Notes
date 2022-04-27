# Section 3:Type Annotations in Actions
## Annotations with Variables
```ts
let apples: number = 5;
let speed: string = 'fast';
let hasName: boolean = true;
let nothingMuch: null = null;
let nothing: undefined = undefined;
let now: Date = new Date();
```

## Object Literal Annotations
```ts
let colors: string[] = ['red', 'green', 'blue'];

class Car{

}
let car: Car = new Car();

// Object literal
let point: { x: number, y: number } = {
    x: 10, 
    y: 20
};

const logNumber: (i: number) => void = (i: number) => {
    console.log(i)
}
```

## Fixing the 'Any' Type
```ts
const json = '{"x": 10, "y": 20}';
const coordinates: {x: number, y: number} = JSON.parse(json);//JSON.parse will return any type if we do not add annotation
console.log(coordinates);
```

# Section 4:Annotations With FUnctions and Objects
## More on Annotations Around Functions
```ts
const add = (a:number, b: number) : number => {
    return a + b;
};
```

## Annotations for Anonymous Functions
```ts
function divide(a: number, b: number): number {
    return a / b;
}

const multiply = function (a: number, b: number): number{
    return a * b;
}

const subtract = (a: number, b: number) => {
    return a - b;
}
```

## Void and Never
```ts
const logger = (message: string): void => {
    console.log(message);
};

const throwError = (message: string): never =>{
    throw new Error(message);
}
```

## Destructing with Annotations
```ts
const forecast = {
    date: new Date(),
    weather: 'sunny'
}

const logWeather = (forcast: {date: Date, weather: string}): void => {
    console.log(forecast.date);
    console.log(forecast.weather);
}
// ES2015
const logWeahter = ({date, weather} : {date: Date, wather: string}): void =>{
    console.log(date);
    console.log(weather);
}
```

## Annotations Around Objects
This is saple for ES2015
```ts
const profile = {
    name: 'alex',
    age: 20,
    coords:{
        lat: 0,
        lng: 15
    }, 
    setAge(age: number): void{
        this.age = age;
    }
}

const {age, name}:{age:number, name:string} = profile;//Destructuring
const {coords:{lat, lng}}:{coords:{lat: number, lng: number}} = profile;//Destructuring
```

# Section 5: Mastering Typed Arrays
## Arrays in Typescript
```ts
const carMakers: stirng[] = ['ford', 'toyota', 'chevy'];//Type inference if we do not add annotations

const carMakersInit: string[] = [];

const dates = [new Date(), new Date()];

const carsByMaker: string[][] = [
    ['f150'],
    ['corolla'],
    ['camaro']
];
```

## Why Typed Arrays?
```ts
//1. Help with inference when extracting values
const car = carMakers[0]; // type inference make car a string

//2. Prevent incompatable values
carMakers.push(100);//error

//3. Help with map
carMakers.map((car: string): string => {
    return car.toUpperCase();
});
```

## Multiple Types in Arrays
```ts
// Flexible types
const importantDates: (string | Date)[] = [new Date(), '2030-10-10'];
```

# Section 6: Tuples in Typescript
## Tuples in Action
```ts
const drink ={
    color: 'brown',
    carbonated: true,
    sugar: 40
}

const pepsi = ['brown', true, 40];//type inference will be (string|boolean|number)[]
//However we do not want the type order to change like (boolean | string | number)[]

const pepsiTuple: [string, boolean, number] = ['brown', true, 40]
pepsiTuple[0] = true;//there will be error

//We can do further by type alias
type Drink = [string, boolean, number];
const newDrink: Drink = ['brown', true, 40];
```

# Section 7: The All-Important Interface
## Interfaces

