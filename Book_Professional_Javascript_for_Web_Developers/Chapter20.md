# 20 JSON
## PARSING AND SERIALIZATION
### The JSON Object
JSON object is exposed under global, and it contains feature of JSON.
### Serialization Options
`JSON.stringify`'s second argument could be array or filter function.
```js
let book = {
    title: "Professional Javascript",
    authors: [
        "Matt Frisbie"
    ],
    edtion: 5,
    year: 2023
};
let jsonText = JSON.stringify(book, ["title", "edition"]);
```
```js
let book = {
    title: "Professional Javascript",
    authors:[
        "Matt Frisbie"
    ],
    edition: 5,
    year: 2023
};
let jsonText = JSON.stringify(book, (key, value)=>{
    switch(key){
        case "authors":
            return value.join(",");
        case "year":
            return 5000;
        case "edition":
            return undefined;
        default:
            return value;
    }
});
```

`JSON.stringify` function's third argument is option, you can set indentation number.
```js
let book ={
    title: "Professional Javascript",
    authors:[
        "Matt Frisbie"
    ],
    edition: 5,
    year: 2023
};
let jsonText = JSON.stringify(book, null, 4);

let jsonTextWithDashes = JSON.stringify(book, null, "--");
// "{
//     --"title": "Professional Javascript",
//     --"authors": ["Matt Frisbie"],
//     --"edition": 5,
//     --"year": 2023
// }"
```
### Parsing Options
You can write a `toJSON()` function in any object to execute when you call `JSON.parse()`. The procedure will be as follows:
1. Call the `toJSON()` function if it's available or use default serialization otherwise.
2. If the second argument is provided, apply the filter, and the value passed in this step is from step 1.
3. Each value from step 2 is serialized appropriately.
4. If the third argument is provided, format it as defined.

```js
let book ={
    title: "Professional Javascript",
    authors:[
        "Matt Frisbie"
    ],
    edition: 5,
    year: 2023,
    releaseDate: new Date(2023, 6, 1);
}
let jsonText = JSON.stringify(book); // this step will stringify Date property into string
let bookCopy = JSON.parse(jsonText, () => key == "releaseDate" ? new Date(value): value);
```