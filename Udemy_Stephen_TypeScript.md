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
