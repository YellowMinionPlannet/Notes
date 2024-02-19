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
