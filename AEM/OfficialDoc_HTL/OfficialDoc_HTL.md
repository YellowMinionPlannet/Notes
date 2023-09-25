[HTL](https://experienceleague.adobe.com/docs/experience-manager-htl/content/getting-started.html?lang=en)

# Getting Started with HTL

## Fundamental Concepts of HTL

HTL gets compiled into Java Servlets, the expressions and data attributes are evaluated entirely server-side.

### Blocks and Expressions

```html
<h1 data-sly-test="${properties.jcr:title}">${properties.jcr:title}</h1>
```

`<h1 data-sly-test=""></h1>` is called block statements, `${properties.jcr:title}` is called expression language.

### SLY Element

When there might not be an existing element at the exact location where block statements has to be inserted, we use sly element.

```html
<sly data-sly-test="${properties.jcr:title && properties.jcr:description}">
  <h1>${properties.jcr:title}</h1>
  <p>${properties.jcr:description}</p>
</sly>
```

So, only if there are both jcr:title and jcr:description properties, the h1 and p tags are displayed.

### HTL Comments

```
<!--/* An HTL Comment */-->
```

### Special Contexts

# data-sly-template

# HTL Specification

## ENBF

| Usage            | Notation |
| ---------------- | -------- |
| definition       | =        |
| concatenation    | ,        |
| terminaton       | ;        |
| alternation      | \|       |
| optional         | [ ]      |
| repetition       | { }      |
| grouping         | ( )      |
| terminal string  | ' ' " "  |
| comment          | (\* \*)  |
| special sequence | ? ?      |
| exception        | -        |

### Example of EBNF

Definition of Integer

```EBNF
integer = "0" | ["-"], natural number;
natual number = digit excluding zero, {digit};
digit = "0" | digit excluding zero;
digit excluding zero = "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9";
```

```EBNF
integer = "0" | ["-"], "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9", {"0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"}
```

# Syntax of HTL

```EBNF
expression = '${', [exprNode], [, '@', optionList] , '}';
optionList = option {',', option};
option = id [, '=', optionValues];
optionValues = exprNode | '[', valueList, ']';
valueList = exprNode {',' exprNode} ;
exprNode = orBinaryOp , '?' , orBinaryOp , ws , ':' , ws , orBinaryOp
         | orBinaryOp ;
orBinaryOp = andBinaryOp {, '||', andBinaryOp};

andBinaryOp = inBinaryOp {, '&&', inBinaryOp};

inBinaryOp = comparisonOp [, 'in', comparisonOp];

comparisonOp = factor [, comparisonOperator, factor];

comparisonOperator = '<'
     | '<='
     | '=='
     | '>='
     | '>'
     | '!=' ;

factor = term
       | '!' , term ;

term = propertyAccess
     | '(' , exprNode  , ')'
     | '[', valueList, ']' ;

/* Note the 'comma rule' means zero or more whitespace characters. Used to indicate optional whitespace around terminals above */
, = {ws} ;

ws = ' '
   | '\t'
   | '\r'
   | '\n'
   | '\u000B'
   | '\u00A0';

/* Note that unlike terminals above, the field access character '.' cannot have optional whitespace around it */
propertyAccess = atom {'.' id}
               | atom {'[' , exprNode , ']'};

atom = string
     | id
     | int
     | float
     | bool ;

bool = 'true'
     | 'false' ;

id = ('a'..'z'|'A'..'Z'|'_') {'a'..'z'|'A'..'Z'|'0'..'9'|'_'|':'} ;

int = ['-']('1'..'9'){'0'..'9'}
    | '0' ;

float = ['-']('1'..'9'){'0'..'9'} '.' {'0'..'9'} [exponent]
      | ['-']'0.' ('0'..'9') {'0'..'9'} [exponent]
      | ['-']('1'..'9'){'0'..'9'} exponent ;

/* An HTL comment can contain any character sequence other than '*/-->' */
comment = '<!--/*' {-('*/-->')} '*/-->' ;

/* A string can be delimited by either double or single quotes. Within these delimiters it may contain either escape sequences or any characters other than backslash and whichever quote was used for delimiting. */
string = '"' {escSeq | -('\\' | '"')} '"'
       | '\'' {escSeq | -('\\'|'\'')} '\'' ;

exponent = ('e'|'E') ['+'|'-'] ('0'..'9'){'0'..'9'} ;

escSeq = '\\' ('b'|'t'|'n'|'f'|'r'|'\"'|'\''|'\\')
       | unicodeEsc;

unicodeEsc = '\\' 'u' hexDigit hexDigit hexDigit hexDigit ;

hexDigit = ('0'..'9'|'a'..'f'|'A'..'F') ;
```

We can simplify this into

```EBNF
exprNode = ((((comparisonOp [, 'in', comparisonOp]) {, '&&', (comparisonOp [, 'in', comparisonOp])}) {, '||', ((comparisonOp [, 'in', comparisonOp]) {, '&&', (comparisonOp [, 'in', comparisonOp])})}) , '?' , (((comparisonOp [, 'in', comparisonOp]) {, '&&', (comparisonOp [, 'in', comparisonOp])}) {, '||', ((comparisonOp [, 'in', comparisonOp]) {, '&&', (comparisonOp [, 'in', comparisonOp])})}) , ws , ':' , ws , (((comparisonOp [, 'in', comparisonOp]) {, '&&', (comparisonOp [, 'in', comparisonOp])}) {, '||', ((comparisonOp [, 'in', comparisonOp]) {, '&&', (comparisonOp [, 'in', comparisonOp])})}))
             | (((comparisonOp [, 'in', comparisonOp]) {, '&&', (comparisonOp [, 'in', comparisonOp])}) {, '||', ((comparisonOp [, 'in', comparisonOp]) {, '&&', (comparisonOp [, 'in', comparisonOp])})}) ;
```

```EBNF
comparisonOp = factor [, comparisonOperator, factor];
factor = term | '!' , term ;
term = propertyAccess | '(' , exprNode  , ')' | '[', valueList, ']' ;
```

# Block Statement

## Example of Block Statement

```EBNF
block statement = '<', tag name, ws, 'data-sly-', block name, ['.', identifier], ['=', expression], {ws, 'data-sly-', block name, ['.', identifier], ['=', expression]}, '/>';

tag name = html tag name;
ws = ' '
   | '\t'
   | '\r'
   | '\n'
   | '\u000B'
   | '\u00A0';
block name = 'template'|'set'|'test'|'use'|'call'|'text'|'element'|'include'|'resource'|'unwrap'|'list'|'repeat'|'attribute';
identifier = ('a'..'z'|'A'..'Z'|'_') {'a'..'z'|'A'..'Z'|'0'..'9'|'_'|':'};
expression = expression;
```

## Available Block Statement

### `data-sly-use`

- Exposes logic to the template.
- **Element:** always shown.
- **Attribute value:** required; evaluates to `String`; the object to instantiate.
- **Attribute identifier:** optional; customised identifier name to access the instantiated logic; if an identifier is not provided, the instantiated logic will be available under the `useBean` identifier name.
- **Scope:** The identifier set by the `data-sly-use` block element is global to the script and can be used anywhere after its declaration.

- Example:

```html
${customPage.foo}
<!--/* this fails */-->
<div data-sly-use.customPage="CustomPage">Hello World</div>
${customPage.foo}
<!--/* but this works */-->
```

### `data-sly-template`

Declares an HTML block, naming it with an identifier and defining the parameters it can get.

- **Element**: never shown.
- **Content of element**: shown upon calling the template with data-sly-call.
- **Attribute value**: optional; an expression with only options, defining the parameters it can get.
- **Attribute identifier**: required; the template identifier to declare.
- **Scope**: The identifier set by the data-sly-template block element is global and available no matter if it's accessed before or after the template's definition. An identically named identifier created with the help of another block element can override the value of the identifier set by data-sly-template.

### `data-sly-call`

Calls a declared HTML block, passing parameters to it.

- **Element**: always shown.
- **Content of element**: replaced with the content of the called data-sly-template element.
- **Attribute value**: required; an expression defining the template identifier and the parameters to pass.
- **Attribute identifier**: none.

#### Example of Templates

If template is at the same page of data-sly-call

```
<template data-sly-template.one>blah</template>
<div data-sly-call="${one}"></div>

```

If different page.

```
<div data-sly-use.lib="templateLib.html" data-sly-call="${lib.one}"></div>
<div data-sly-call="${lib.two @ title=properties.jcr:title, resource=resource.parent}"></div>
```

```
//templateLib.html
<template data-sly-template.two="${@ title, resource}">
    <div> Title = ${title} </div>
    <div> Resource = ${resource.name} </div>
</template>

<template data-sly-template.one>
	<h1>This is Template II !!!!</h1>
</template>

<template data-sly-template.haha>
<h1>Within Template !!!! ${properties.haha}</h1>
</template>
```

### `data-sly-text`

Sets the content for the current element.

- **Element**: always shown.
- **Content of element**: replaced with evaluated result.
- **Attribute value**: required; evaluates to String; the element content.
- **Attribute identifier**: none.

- Example

```html
<p data-sly-text="${properties.jcr:title}">This text would never be shown.</p>
<p data-sly-text="${'<strong>Bold and Proud</strong>' @ context='html'}"></p>
<!--/* outputs: */-->
<p><strong>Bold and Proud</strong></p>
```

### `data-sly-attribute`

Sets an attribute or a group of attributes on the current element.

- **Element**: always shown.
- **Content of element**: always shown.
- **Attribute value**: optional; String for setting attribute content, or Boolean for setting boolean attributes, or Object for setting multiple attributes; removes the attribute if the value is omitted.
- **Attribute identifier**: optional; the attribute name; must be omitted only if attribute value is an Object.

- Example

```html
<tag class="className" data-sly-attribute.class="${myVar}"></tag>
<!--/* This will overwrite the content of the class attribute */-->
<tag data-sly-attribute.data-values="${myValues}"></tag>
<!--/* This will create a data-values attribute */-->

<input data-sly-attribute="${foobar}" type="text" />
<!--/* outputs for instance: */-->
<input id="foo" class="bar" type="text" />
<!--
    assuming that foobar = {'id' : 'foo', 'class' : 'bar'}
-->
```

### `data-sly-element`

Replaces the element's tag name.

- **Element**: always shown.
- **Content of element**: always shown.
- **Attribute value**: required; String; the element's tag name.
- **Attribute identifier**: none.

- Example:

```html
<div data-sly-element="${'h1'}">Blah</div>
<!--/* outputs: */-->
<h1>Blah</h1>
```

### `data-sly-test`

Keeps or removes the element depending on the attribute value.

- **Element:** shown if test evaluates to `true`.
- **Content of element:** shown if test evaluates to `true`.
- **Attribute value:** optional; evaluated as `Boolean` (but not type-cased to `Boolean` when exposed in a variable); evaluates to `false` if the value is omitted.
- **Attribute identifier:** optional; identifier name to access the result of the test.
- **Scope:** The identifier set by the `data-sly-test` block element is global to the script and can be used anywhere after its declaration

- Example:

```html
<p data-sly-test.myVar="${'foo'}">${myVar}</p>
<!--/* outputs: */-->
<p>foo</p>
```

### `data-sly-list`

Iterates over the content of each item in the attribute value, allowing to control the iteration through the following options:

- - `begin` - iteration begins at the item located at the specified index; first item of the collection has index 0
  - `step` - iteration will only process every step items of the collection, starting with the first one
  - `end` - iteration ends at the item located at the specified index (inclusive)
- **Element:** shown only if the number of items from the attribute value is greater than 0, or if the attribute value is a string or number;
  when the `begin` value is used the element will be shown only if the `begin` value is smaller than the collection's size.
- **Content of element:** repeated as many times as there are items in the attribute value.
- **Attribute value:** optional; the item to iterate over; if omitted the content will not be shown.
- **Attribute identifier:** optional; customised identifier name to access the item within the list element; if an identifier is not provided, the block element will implicitly make available an `item` identifier to access the element of the current iteration.
- **Scope:** The identifier set by the `data-sly-list` block element is available only in the element's content scope. The identifier will override other identifiers with the same name available in the scope, however their values will be restored once outside of the element's scope.

#### Members of data-sly-list.identifier

- `index`: zero-based counter (`0..length-1`);
- `count`: one-based counter (`1..length`);
- `first`: `true` for the first element being iterated;
- `middle`: `true` if element being iterated is neither the first nor the last;
- `last`: `true` for the last element being iterated;
- `odd`: `true` if `count` is odd;
- `even`: `true` if `count` is even.

- Example:

```html
<!--/* By default the 'item' identifier is defined within the loop. */-->
<ul data-sly-list="${currentPage.listChildren}">
  <li>${item.title}</li>
</ul>

<!--/* This is how the name of the 'item' identifier can be customised. */-->
<ul data-sly-list.childPage="${currentPage.listChildren}">
  <li>${childPage.title}</li>
</ul>

<!--/* Iteration control; start from the beginning, stop after the first 10 elements (index 9) */-->
<ul data-sly-list="${currentPage.listChildren @ begin = 0, end = 9}">
  <li>${item.title}</li>
</ul>

<!--/* Iteration control; start from the 11th element (index 10), stop after the next 10 elements (index 19) */-->
<ul data-sly-list="${currentPage.listChildren @ begin = 10, end = 19}">
  <li>${item.title}</li>
</ul>
```

#### Example of Map Object for data-sly-list

```html
<dl data-sly-list="${myMap}">
  <dt>key: ${item}</dt>
  <dd>value: ${myMap[item]}</dd>
</dl>
```

### `data-sly-repeat`

Iterates over the content of each item in the attribute value and displays the containing element as many times as items in the attribute
value, allowing to control the iteration through the following options:

- - `begin` - iteration begins at the item located at the specified index; first item of the collection has index 0
  - `step` - iteration will only process every step items of the collection, starting with the first one
  - `end` - iteration ends at the item located at the specified index (inclusive)
- **Element:** shown only if the number of items from the attribute value is greater than 0, or if the attribute value is a string or number.
- **Content of element:** repeated as many times as there are items in the attribute value.
- **Attribute value:** optional; the item to iterate over; if omitted the containing element and its content will not be shown.
- **Attribute identifier:** optional; customised identifier name to access the item within the repeat element; if an identifier is not provided, the block element will implicitly make available an `item` identifier to access the element of the current iteration.
- **Scope:** The identifier set by the `data-sly-repeat` block element is available only in the element's scope. The identifier will override other identifiers with the same name available in the scope, however their values will be restored once outside of the element's scope.

```html
<ul data-sly-list="${someList}">
  <li>${item}</li>
</ul>

<ul>
  <li data-sly-repeat="${someList}">${item}</li>
</ul>
<!-- OUTPUT -->
<ul>
  <li>item1</li>
  <li>item2</li>
  <li>item3</li>
</ul>
```

### `data-sly-include`

Includes the output of a rendering script run with the current context.

- **Element:** always shown.
- **Content of element:** replaced with the content of the included script.
- **Attribute value:** required; the file to include.
- **Attribute identifier:** none.

* Example:

```html
<div data-sly-include="${'partials' @ appendPath='template.html'}"></div>
<!--/* will include partials/template.html */-->

<div data-sly-include="${'template.html' @ prependPath='partials'}"></div>
<!--/* will include partials/template.html */-->

<div
  data-sly-include="${'components' @ prependPath='partials', appendPath='template.html'}"
></div>
<!--/* will include partials/components/template.html */-->
```

### `data-sly-resource`

Includes a rendered resource.

- **Element:** always shown.
- **Content of element:** replaced with the content of the resource.
- **Attribute value:** required; the path to include.
- **Attribute identifier:** none.

- Example

```html
<!--/* Following statements are equivalent: */-->
<section data-sly-resource="./path"></section>
<section data-sly-resource="${'./path'}"></section>
```

> data-sly-include vs data-sly-resource - data-sly-resource creates a new internal request against the sling engine, so the attribute value could be something like 'content\xxx\xxx.html', it's a new request.
