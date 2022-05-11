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
## Long Type Annotations
```ts
const oldCivic = {
    name: 'civic',
    year: 2000,
    broken: true
};

const printVehicle = (vehicle: {name: string, year: number, broken: boolean}) : void => {
    console.log(`Name: ${vehicle.name}`);
    console.log(`Year: ${vehicle.year}`);
    console.log(`Broken? ${vehicle.broken}`);
}// Long type annotation, and not good for code reuse

printVehicle(oldCivic);
```
## Fixing Long Annotations with Interfaces
```ts
interface Vehicle{
    name: string,
    year: number,
    broken: boolean
}

const oldCivic: Vehicle ={
    name: 'civic',
    year: 2000,
    broken: true
}

const printVehicle = (vehicle: Vehicle): void => {
    console.log(`Name: ${vehicle.name}`);
    console.log(`Year: ${vehicle.year}`);
    console.log(`Broken? ${vehicle.broken}`);
}
```
# Section 8:Building Functionality with Classes
```ts
class Vehicle{
    drive():void{
        console.log('chugga chugga');
    }
    honk(): void{
        console.log('beep');
    }
}

const vehicle = new Vehicle();
vehicle.drive();
vehicle.honk();
```

## Basic Inheritance
```ts
class Vehicle{
    drive():void {
        console.log('chugga chugga');
    }
    honk():void{
        console.log('beep');
    }
}

class Car extends Vehicle{
    drive():void{
        console.log('vroom');
    }
}

const car = new Car();
car.drive();//vroom
car.honk();//beep
```

```ts
class Vehicle{
    protected honk(): void{
        console.log('beep');
    }

    constructor(public color: string){}
}

const vehicle = new Vehicle('orange'):
console.log(vehicle.color);//orange

class Car extends Vehicle{
    constructor(public wheels: number, color: string){
        super(color);
    }
    public startDriving():void{
        this.honk():
    }
}

const car = new Car(4, 'red'):
car.startDriving();
```

# Section 9: Design Patterns with TypeScript
`npm install -g parcel-bundler` to install parcel bundler. This package is to recognize html script tag that is ts file source (browser does not compile ts directly), and compile the ts to js file for browser.

## Project Structure
```html
<html>
    <body>
        <div id="map" style="height:100%;">
        <script src="./src/index.ts"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key="></script>
    </body>
</html>
```
```ts
//User.ts
import faker from 'faker';

export default 'red';

export class User implements Mappable{
    name: string;
    location:{
        lat: number;
        lng: number;
    }

    constructor(){
        this.name = faker.name.firstName();
        this.location = {
            lat: parseFloat(faker.address.latitude()),
            lng: parseFloat(faker.address.longitude())
        };
    }
    markerContent():string{
        return `User name is ${this.name}`;
    }
}
```
```ts
//index.ts
import {User} from "./User"; // if we use export <variableName> form

import color from "./User"; // if we use export default <variableValue> form

import {Company} from "./Company";

// console.log(color);//red


// const user = new User();
// console.log(user);

// const company = new Company();
// console.log(company);

// new google.maps.Map(document.getElementById("map"), {zoom: 1, 
// center: {lat: 0, lng: 0}
// });

import {CustomMap} from "/CustomMap";
const user = new User();
const company = new Company();
const customMap = new CustomMap('map');
customMap.addMarker(user);
customMap.addMarker(company);
```

```ts
// Company.ts

import faker from 'faker';
import {Mappable} from "./Map";

export class Company implements Mappable{
    companyName: string;
    catchPhrase: string;
    location:{
        lat: number;
        lng: number;
    }
    constructor(){
        this.companyName = faker.company.companyName();
        this.catchPhrase = faker.company.catchPhrase();
        this.location = {
            lat: parseFloat(faker.address.latitude()),
            lng: parseFloat(faker.address.longitude())
        };
    }
    markerContent(): string{
        return `Company name is ${this.companyName}, catchphrase is ${this.catchPhrase}`
    }
}
```

```ts
// CustomMap.ts to hide functionality of google map apis

export interface Mappable{
    location:{
        lat: number,
        lng: number
    }

    markerContent() : string;
}

export class CustomMap{
    private googleMap : google.maps.Map;//Hide googlemap apis
    constructor(divId: string){
        this.googleMap = new google.maps.Map(document.getElementById(divId), {
            zoom: 1,
            center: {
                lat: 0,
                lng: 0
            }
        })
    }

    // addUserMarker(user: User): void{
    //     new google.maps.Marker({
    //         map: this.googleMap,
    //         position:{
    //             lat: user.location.lat,
    //             lng: user.location.lng
    //         }
    //     });
    // }

    // addCompanyMarker(company: Company): void{
    //     new google.maps.Marker({
    //         map: this.googleMap,
    //         position:{
    //             lat: company.location.lat,
    //             lng: company.location.lng
    //         }
    //     });
    // }
    addMarker(item : Mappable):void{
        const marker = new google.maps.Marker({
            map: this.googleMap,
            position:{
                lat:item.location.lat,
                lng:item.location.lng
            }
        });

        marker.addListener('click', () => {
            const infoWindow = new google.maps.InfoWindow({
                content: item.markerContent();
            });
            infoWindow.open(this.googleMap, marker);
        })
    }
}
```

# Section 10: More on Design Patterns
## Configuring the TS Compiler
`tsc --init` to create tsconfig.json
```json
{
    "compilerOptions":{
        "target": "es5",
        "module":"commonjs",
        "outDir": "./build", //compiled file .js
        "rootDir": "./src", //source code .ts
    }
}
```
`tsc -w` to watch rootDir and automatically compile .ts into .js

## Concurrent Compilation and Execution
`node build/index.js` to let nodejs build ./build/index.js
`npm init -y`
`npm install nodemon concurrently`
```json
{
    "scripts":{
        "start:build" : "tsc -w",
        "start:run": "nodemon build/index.js",
        "start": "concurrently npm:start:*" //start:* scripts run concurrently
    }
}
```

## Sorter Scaffolding
```ts
class Sorter{
    constructor(public collection: number[]){

    }
    sort():void{
        const { length } = this.collection;

        for(let i = 0; i < length; i++){
            for(let j = 0; j < length - i - 1; j ++){

                if(this.collection instanceof Array){//Type Guard
                    if(this.collection[j] > this.collection[j+1]){
                        const leftHand = this.collection[j];
                        this.collection[j] = this.collection[j+1];
                        this.collection[j+1] = leftHand;
                    }
                }
                if(typeof this.collectionstring === 'string'){//Type Guard
                    
                }
            }
        }
    }
}
```
TypeGuard allows us to tell ts compiler that code followed is restricted to exact type.

* `typeof` is for number string and boolean
* `instanceof` is for any other value that is created with a constructor function

## Extracting Key Logic
```ts
export class NumberCollection extends Sorter{
    constructor(public data: number[]){
        super();
    }

    get length(): number{//Accessor
        return this.data.length;
    }
    compare(leftIndex: number, rightIndex: number): boolean{
        return this.data[leftIndex] > this.data[rightIndex];
    }
    swap(leftIndex: number, rightIndex: numnber): void{
        const temp = this.data[leftIndex];
        this.data[leftIndex] = this.data[rightIndex];
        this.data[rightIndex] = temp;
    }
}
```

```ts
import { NumberCollection} from "./NumberCollection"

interface Sortable{
    data: string | number[] | LinkedList;
    swap(leftIndex: number, rightIndex: number) : void;
    compare(leftIndex: number, rightIndex: number) : boolean;
    length: number;
}

export abstract class Sorter{
    sort():void{
        const { length } = this;

        for(let i = 0; i < length; i++){
            for(let j = 0; j < length - i - 1; j ++){
                if(this.compare(j, j + 1)){
                    this.swap(j, j + 1);
                }
            }
        }
    }
    abstract compare(leftIndex:number, rightIndex:number) : boolean;
    abstract swap(leftIndex:number, rightIndex:number) : void;
    abstract length: number;
}
```

```ts
export class CharacterCollection extends Sorter{
    constructor(public data: string){
        super();
    }

    get length(): number{
        return this.data.length;
    }
    compare(leftIndex: number, rightIndex: numnber): boolean{
        return this.data[leftIndex].toLowerCase() > this.data[rightIndex].toLowerCase();
    }
    swap(leftIndex: number, rightIndex: number): void{
        const characters = this.data.split('');
        const temp = characters[leftIndex];
        characters[leftIndex] = characters[rightIndex];
        characters[rightIndex] = temp;
        this.data = characters.join('');
    }
}
```
## Linked List Implementation
```ts
class Node{
    next: Node | null = null;
    constructor(public data:number){}
}

export class LinkedLIst extends Sorter{
    head: Node | null = null;
    add(data: number) : void{
        const node = new Node(data);
        if(this.head === null){
            this.head = node;
            return;
        }
        let tail = this.head;
        while(tail.next !== null){
            tail = tail.next
        }
        tail.next = node;
    }

    get length(): number{
        if(this.head === null){
            return 0;
        }
        let length = 1;
        let node = this.head;
        while(node.next !== null){
            node = node.next
            length = length + 1;
        }
        return length;
    }

    at(index:number): Node{
        if(this.head === null){
            throw new Error("Index out of bounds");
        }
        let counter = 0;
        let node : Node | null = this.head;
        while(node !== null){
            if(counter === index){
                return node;
            }
            counter = counter + 1;
            node = node.next
        }
        throw new Error("Index out of bounds");
    }

    compare(leftIndex: number, rightIndex: number) : boolean{
        if(this.head === null){
            throw new Error("List is empty");
        }
        return this.at(leftIndex).data > this.at(rightIndex).data;
    }

    swap(leftIndex: number, rightIndex: number): void{// Cheat here!  only swap the data.
        const leftData = this.at(leftIndex).data;
        this.at(leftIndex).data = this.at(rightIndex).data;
        this.at(rightIndex).data = leftData;
    }

    print() : void{
        if(this.head === null){
            return;
        }
        let node : Node | null = this.head;
        while(node !== null){
            console.log(`${node.data} ->`);
            node = node.next;
        }
    }
}
```