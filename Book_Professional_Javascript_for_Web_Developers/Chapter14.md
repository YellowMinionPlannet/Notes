# 14 DOM Extensions
## STYLES
### Accessing Element Styles
`style` property is used to access styles defined within `style` attribute.

### Working with Style Sheets
`document.styesheets` can access applied style sheets collection of current document.
The object has folowing properties and methods:
- diabled, read/write property
- href
- media
- ownerNode
- parentStyleSheet, when a style sheet is included via `@import`, this is a pointer to the style sheet that imported it
- title
- type, for css, "text/css"

For every `styleSheets` collection object, you can access the defined rules within.
```css
div.box{
    background-color: blue;
    width: 100px;
    height: 200px;
}
```

```js
let sheet = document.styleSheets[0];
let rules = sheet.cssRules || sheet.rules; // get rule list
let rule = rules[0];
rule.style.backgroundColor = "red";
```

#### Creating Rules
```js
sheet.insertRule("body { background-color: silver }", 0); // DOM method
```

#### Deleting Rules
```js
sheet.deleteRule(0);
```

### Element Dimensions
#### Offset Dimensions

![offset_dimension&offset_parent](./offsetDimension&offsetParent.png)

To calculate how much offset the current elelment from the root container(the outermost container);
```js
function getElementLeft(element){
    let actualLeft = element.offsetLeft;
    let current = element.offsetParent;

    while(current !== null){
        actualLeft += current.offsetLeft;
        curretn = current.offsetParent;
    }

    return actualLeft;
}

function getElementTop(element){
    let actualTop = element.offsetTop;
    let current = element.offsetParent;

    while(current !== null){
        actualTop += current.offsetTop;
        curretn = current.offsetParent;
    }

    return actualTop;
}
```

#### Client Dimensions
![client_dimension&offset_parent](./clientDimension&offsetParent.png)

To calculate the total size of the viewport:
```js
let docHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);
let docWidth = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth);
```