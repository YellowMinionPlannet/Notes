# 13 The Document Object Model
The Document Object Model(DOM) is an application programming interface(API) for:
1. HTML
2. XML

It represents as a document which has hierarchical tree form of nodes, allowing developer to Add, Remove, and Modify them.

There are several stages for DOM:
1. DOM level 0: DOM is implemented distinctly by Microsoft and Netscape
2. DOM level 1: October 1998, DOM became a W3C recommendation, and providing unified interfaces for basic document structure and querying.
3. DOM level 2+: All under W3C standards, and features are extended.

## HIERARCHY OF NODES
HTML and XML can be represented as a hierarchy tree. In this tree, there are different node types, which has different property and methods can be used. Different nodes will have relationship among them, allowing this tree is rooted by a single node.

For example, this is HTML structure:
```html
<html>
    <head>
        <title>Sample Page</title>
    </head>
    <body>
        <p>Hello World!</p>
    </body>
</html>
```
![htmlstructure](./HTML_structure.png)

- A document node is the root, it has only child of `documentElement` wihch is the `<html>` element. There can be only one `documentElement`/`<html>` in HTML. 
- In XML, any element could be the document element.
- In HTML, elements (tags) are represented by *element type node*, attributes are represented by *attribute type node*, comments are represented by *comment type node*, document types are represented by *document type node*.
- There are 12 node types.

### The Node Type
DOM has a type of interface called `Node`, each node type could be represented by `Node`'s  numeric constant. And each instance of `Node` has a `nodeType` property.

These are the numeric constants:
- Node.ELEMENT_NODE (1)
- Node.ATTRIBUTE_NODE (2)
- Node.TEXT_NODE (3)
- Node.CDATA_SECTION_NODE (4)
- Node.ENTITY_REFERENCE_NODE (5)
- Node.ENTITY_NODE (6)
- Node.PROCESSING_INSTRUCTION_NODE (7)
- Node.COMMENT_NODE (8)
- Node.DOCUMENT_NODE (9)
- Node.DOCUMENT_TYPE_NODE (10)
- Node.DOCUMENT_FRAGMENT_NODE (11)
- Node.NOTATION_NODE (12)

You can test the type of node by:
```js
if(someNode.nodeType == Node.ELEMENT_NODE){
    alert("Node is an element.");
}
```

#### The `nodeName` and `nodeValue` Properties
It is always recommended to check `nodeType` before using these properties.
```js
if(someNode.nodeType == 1){
    value = someNode.nodeName;
}
```
For different types of nodes, these properties' values are different. For element type nodes, the `nodeName` is always the tag name, and `nodeValue` is always `null`.

#### Node Relationships
So how to describe the relationship among nodes?
1. parent, direct parent node
2. child, direct child node
3. sibling, share same parent node with other siblings

- Each `Node` has `childNodes` property, which contains a `NodeList` type instance.
    - `NodeList` behave like Array instance, but it is not
    - `childNodes` property is not a snapshot of the owner's children, it is synced whenever the children were updated
- How to use `NodeList` type instance:
```js
let firstChild = someNode.childNodes[0];
let secondChild = someNode.childNodes.item(1);
let count = someNode.childNodes.length;
```
- How to convert `NodeList` type into Array
```js
let arrayOfNodes = Array.prototype.slice.call(someNode.childNodes, 0);
```

- Each node has a `parentNode` property that points to its parent in the document tree.
- Each node in the same `childNodes` property share the same `parentNode`
- Using `nextSibling` and `previousSibling` properties in `Node` instance.
```js
if(someNode.nextSibling === null){
    alert("Last node in the parent's childNode list.");
}else if(someNode.previousSibling === null){
    alert("First node in the parent's childNode list.");
}
```
- `childNodes`'s `firstChild` property always points to the `childNodes[0]`, and `lastChild` property always points to `someNode.childNodes[someNode.childNodes.length -1]`
- If `firstChild` and `lastChild` points to the same node, there must be only one node in the list.
- If no children `firstChild` and `lastChild` are both `null`
- Don't forget to use `hasChildNodes()` method to check for the `Node`
- `ownerDocument` property always points to the Document node(Not `documentElement`).

#### Manipulating Nodes
Properties mentioned above are all READ-ONLY.

Now we begin to manipulate the relationship.

- `appendChild()` method, will move the node to the end of the `childNodes` list, and returns the newly added nodes. The relationship pointers properties related to this newly added node and other effected nodes are automatically updated.

```js
let returnedNode = someNode.appendChild(newNode);
alert(returnedNode == newNode); // true
alert(someNode.lastChild == newNode); // true

let returnedNode = someNode.appendChild(someNode.firstChild);
alert(returnedNode == someNode.firstChild); // false
alert(retunredNode == someNode.lastChild); // true
```
- `insertBefore()` accepts two arguments, the inserted node and the referenced node.
- if the referenced node is `null`, then it behaves the same as `appendChild()`

```js
returnedNode = someNode.insertBefore(newNode, null);
alert(newNode == someNode.lastNode); // true

returnedNode = someNode.insertBefore(newNode, someNode.firstNode);
alert(returnedNode == newNode); // true
alert(newNode == someNode.firstNode) // true

returnedNode = someNode.insertBefore(newNode, someNode.lastChild);
alert(newNode == someNode.childNodes[someNode.childNodes.length -2]);
```

- `replaceChild()` accepts: inserted node, and removed node. It returns the removed node.
- the removed node is still owned by document, but has no position.
```js
let returnedNode = someNode.replaceChild(newNode, someNode.firstChild);
returnedNode = someNode.replacechild(newNode, someNOde.lastChild);
```
- `removeChild()` method, returns the removed node.
```js
let formerFirstChild = someNode.removeChild(someNode.firstChild);
let formerLastChild = someNode.removeChild(someNode.lastChild);
```

#### Other Methods
- `cloneNode()`
```html
<!DOCTYPE>
<html>
    <body>
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>
        <script>
            let myList = document.getElementsByTagName("ul")[0];
            let deepList = myList.cloneNode(true);
            alert(deepList.childNodes.length); // 7 because there are 2 text nodes among three <li> and 2 text nodes between first <li> and <ul> and last <li> and </ul>. Totally, 4 text nodes and 3 <li> element nodes
            
            let shallowList = myList.cloneNode(false);
            alert(shallowList.childNodes.length); // 0
        </script>
    </body>
</html>
```
- `cloneNode()` does not copy event handlers, but copies attributes. It copies childNodes only if deep copy.

- `normalize()` deal with fragment text node.

### The Document Type

For HTML, `window` has a property named `document`, this object is `HTMLDocument` type which inherited from `Document` type.

This `document` object has following characteristics:
- `nodeType` is 9
- `nodeName` is "#document"
- `nodeValue` is `null`
- `parentNode` is `null`
- `ownerDocument` is `null`
- Its child nodes may be `DocumentType` type(MAX of 1), `Element` Type(MAX of 1), `ProcessingInstruction`, or `Comment`

#### Document Children
- The first child nodes of `document` object is `documentElement` property, which represents `<html>` element.

How to access?
```js
let html = document.documentElement;
alert(html === document.childNodes[0]);
alert(html === document.firstChild);
```

- As a instance of `HTMLDocument` type object, `document` object also can have a `body` property, which represnets `<body>` element.

- Another possible child node of a `Document` type is `DocumentType` type object, `document.doctype`.

- Comments that are outside `<html>` element, `documentElement`, can also be childNodes of `document` object.

#### Document Information
`title`, `domain`, `url`, `referer` properties also available.

- Updating `title` property will update the title bar of the browser, but `title` property will not be synced to the `<title>` element.

- `domain`, `url`, `referer` properties are included in HTTP request, and can be accessible by JavaScript through these properties.

- If a page includes a frame or iframe, and if you set the sub pages' `document.domain` property into same value. Then the sub pages could communicate with each other.

- If you set the `domain` property into "wrox.com", you cannot set the `domain` property into "p2p.wrox.om" later. Because it's tightening the property, and it's not allowed.

#### Locating Elements
To locate a specific element, DOM provides two methods in the `document` object to perform such task.
They are `document.getElementById()` and `document.getElementsByTagName()`.

- `document.getElementById()` accepts one argument, and will return the element which id is exactly match up with the argument. Otherwise, this method will return `null`.
- If there are multiple matchup cases, this method will return the first one.
```js
<div id="myDIv">Some Text</div>

let div = document.getElementById("myDiv");
let div = document.getElementById("mydiv"); //null
```

- `document.getElementsByTagName()` will return all elements that match up the tag name. The result is returned as `NodeList` type instance. In HTML, this result returns as `HTMLCollection` type object, which is similar to `NodeList`, it is a live collection.

```js
let images = document.getElementsByTagName("img");
alert(images.length); // 
alert(images[0].src); // output of first image's src attribute
alert(iamges.item(0).src)// output of first image's src attribute

//Suppose we have one of the images element defined by following comment
//<img src="myimage.gif" name="myImage">

let myImage = images.namedItemn("myImage");
let myImage = images["myImage"];

// This namedItem probably is specific to <img> element
```

> `document.getElmentsByTagName()` is case-insensitive for HTML and case-sensitive for XML and XHTML, although it is defined only case-senstive in specification.

- `document.getElementsByName()` is the third method for locating element. It is a special one for `HTMLDocument` type only.

```html
<fieldset>
    <legend>Which color do you prefer?</legend>
    <ul>
        <li>
            <input type="radio" value="red" name="color" id="colorRed">
            <label for="colorRed">Red</label>
        </li>
        <li>
            <input type="radio" value="green" name="color" id="colorGreen">
            <label for="colorGreen">Green</label>
        </li>
        <li>
            <input type="radio" value="blue" name="color" id="colorBlue">
            <label for="colorBlue">Blue</label>
        </li>
    </ul>
</fieldset>
```
- Different `id` attributes can let `<label>` element target corresponding `<input>` elements.

```js
// this line of code retrieve all elements which name attributes equals to color
let radios = document.getElementsByName("color");
```

#### Special Collections
`document` has special collections that can easily access special element collection in the page.
- `document.anchors`: contains all `<a>` elements with a `name` attribute
- `document.forms`: same as `document.getElementsByTagName("form")`
- `document.images`: smae as `document.getElementsByTagName("img")`
- `document.links`: contains all `<a>` elements with a `href` attibute

#### Document Writing
There are 4 methods available for Document Writing:
1. `write`
2. `writeln`
3. `open`
4. `close`

Look at similar examples about `write` method
```html
<html>
    <head>
        <title>document.write() Example</title>
    </head>
    <body>
        <p>This is some content that you won't get to see because it will be overwritten.</p>
        <script type="text/javascript">
            window.onload = function(){
                document.write("Hellow World!");
            }
        </script>
    </body>
</html>
```
```html
<html>
    <head>
        <title>document.write() Example</title>
    </head>
    <body>
        <script type="text/javascript">
            document.write("<script type=\"text/javascript\" src=\"file.js\">" + "<\/script>");
        </script>
    </body>
</html>
```

The first one will overwrite the entire page to "Hello World!", because the `write` method is triggered when page is loaded.

The second one will only write script tag to the page, because `write` is triggered when page is loading.

> Be careful for the closing `</script>` tag syntax

`open` and `close` are not required when using `write` when the page is loading. They are used when you want to open / close the output stream of the page.

### The Element Type

The `Element` type represents an XML or HTML element, providing access to info such as its tag name, children, and attributes. It has following characteristics:
- `nodeType` is 1
- `nodeName` is the element's tag name.
- `nodeValue` is `null`
- `parentNode` may be a `Document` / `Element`
- `childNodes` may be `Element`, `Text`, `Comment`, `ProcessingInstruction`, `CDATASection`, or `EntityReference`.

- An element's tag name is accessible through `tagName`/ `nodeName` properties.
```js
let div = document.getElementById("myDiv");
alert(div.tagName); // Div
alert(div.tagName == div.nodeName); // true
```
For XML the tagname value's case size is same as source code. The HTML will always follow Uppercase. So if you are not sure, which type of page gonna be, you'd better use common case for comparison.

#### HTML Elements
All HTML Elments are directly or subtyping of `HTMLElement` type. They share these properties:
- id
- title
- lang
- dir, ltr or rtl
- className, equivalent to class attribute

We can use these property to retrieve info or manipulate attribute value of corresponding tag.

#### Getting Attributes
We can use several methods to manipulate attributes in element.
- `getAttribute()`
- `setAttribute()`
- `removeAttribute()`

Argument passed in `getAttribute()` must be the actual attribute name, and if that attribute does not exist, `getAttribute()` will return `null`.

```js
let div = document.getElementById("myDiv");
alert(div.getAttribute("id"));
alert(div.getAttribute("class"));
alert(div.getAttribute("title"));
alert(div.getAttribute("lang"));
alert(div.getAttribute("dir"));
```

- Attribute names are case-insensitive, which means "ID" and "id" are the same.
- Custom attribute, for example my_custom_attribute, will not map to the properties of element. It can only be accessed by `getAttribute()` method.
- style attribute will return an object
- event attribute, for example onclick, will return a JavaScript function or `null` if no call back is assigned.

#### Setting Attributes
`setAttribute()` will set the value to that specific attribute, and if the target attribute already has value, will replace it.

```js
div.setAttributes("id", "someOtherId");
div.setAttributes("class", "ft");
div.setAttributes("title", "some other text");
div.setAttributes("lang", "fr");
div.setAttributes("dir", "rtl");
```

- Although update the attribute related property will also update the corresponding attribute value, adding custom property cannot sync values to the custom attribute.

`removeAttribute()` will remove the sprcific attribute and the value completely.
```js
div.removeAttribute("class");
```

#### The `attributes` Property
The `Element` tpye is the only DOM node that uses `attribute` property, which returns a `NamedNodeMap` object. The attributes in `Element` node will be represented as `Attr` node, and these node are all stored in the `NamedNodeMap` object, which is a "live" object like `NodeList` object.

There are several methods on this `NamedNodeMap`:
- `getNamedItem(name)`, returns the node whose `nodeName` property is equal to name
- `removeNamedItem(name)`, returns the node whose `nodeName` property is equal to the name
- `setNamedItem(node)`, Adds the node to the list
- `item(pos)` - returns pos index item.

```js
//access by attribute's name
let id = element.attributes.getNamedItem("id").nodeValue;
//access by bracket notation
let id = eelemnt.attributes["id"].nodeValue;
//set attribute value by nodeValue
element.attributes["id"].nodeVlaue = "someOtherId";
// remove and return
let oldAttr = element.attributes.removeNamedItem("id");
// add a new attribute
element.attributes.setNamedItem(newAttr);

function outputAttributes(element){
    let pairs = [];
    for(let i = 0, len = element.attributes.length; i < len; ++i){
        const attribute = element.attributes[i];
        pairs.push(`${attribute.nodeName}=${attribute.nodeValue}`);
    }
    return pairs.join(" ");
}
```

#### Creating Elements
To create a new element, where fro HTML argument is case-insensitive and for XML the argument is case-sensitive.
```js
let div = document.createElement("div");

div.id = "myNewDiv";
div.className = "box";

//insert the newly created element into document tree
document.body.appendChild(div);
```

#### Element Children
Consider this example which has previous demonstrated:
```html
<!-- UL No.1 -->
<ul id="myList">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
<!-- UL No.2 -->
<ul id="myList"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>
```

For No.1 element.childNodes.length will return 7, and No.2 element.childNodes.length will return 3.

If we use No.1, we can have following code to process only `Element` type node
```js
for(let i = 0, len = element.childNodes.length; i < len; ++i){
    if(element.childNodes[i].nodeType == 1){
        //processing
    }
}
```

However, childNodes only returns direct descendants, if you want to retrieve all the <li> tags of multiple layers within that element 
```js
let ul = document.getElementById("myList");
let items = ul.getElementsByTagName("li");
```

### The Text Type