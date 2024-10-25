# Introduction
## Installation
```html
<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>

<script>
var template = Handlebars.compile("Handlebars" "<b>{{doesWhat}}</b>")
console.log(template({"doesWhat": "rocks!"}))
</script>
```

# Expressions
## Basic Usage
```hbs
<!-- handlebar template -->
<p>{{firstname}} {{lastname}}</p>
```

```json
// input object
{
  "firstname":"Yehuda",
  "lastname":"Katz"
}
```

```html
<!-- output file-->
<p>Yehuda Katz</p>
```
## Path expressions
Suppose we have input file that contains an object.
```json
{
  "person":{
    "firstname": "Yehuda",
    "lastname":"Katz"
  }
}
```
Then we can use the expression in template like this:

```hbs
{{person.firstname}} {{person.lastname}}
```

## Changing the context
When dealing with nested object or list of objects, you can use `../` to go back to parent context.

```hbs
{{prefix}}
{{#each people}}
  {{../prefix}} {{firstname}}
{{/each}}
```
## Literal Segments
Within the expression, if you want to reference a invalid identifier for a property, you can use `[]` to achieve this.

Samples:
|GOOD|BAD|
|-|-|
|`{{array.[0].item}}`|`{{array.0.item}}`|
|`{{array.[0].[item-class]}}`|`{{array.[0].item-class}}`|
|`{{./[true]}}`|`{{./true}}`|

## HTML escaping
To avoid html escaping for the special character, for example `&` into `&amp;`, we can use `{{{}}}`.

```json
// input object

{
  "specialChars": "& < > \" ' ` ="
}
```

```hbs
raw: {{{specialChars}}}
html-escaped: {{specialChars}}
```

```html
raw: & < > " ' ` =
html-escaped: &amp; &lt; &gt; &quot; &#x27; &#x60; &#x3D;
```

## Helpers
We can use `Handlebars.registerHelper` to register helpers. And to use them,within the expression, we first pass in the helper's identifier and then the parameters each seperated by space.

```js
Handlebars.registerHelper("loud", function(aString){
  return aString.toUpperCase();
})
```

```hbs
{{firstname}} {{loud lastname}}
```

```html
Yehuda KATZ
```

### Prevent HTML-escaping
- Use `Handlebars.Safestring`, then the return value will not be escaped.
- Use `Handlebars.escapeExpresssion` to enforce escaping.
```js
Handlebars.registerHelper("loud", function(text){
  var result = "<b>" + Handlebars.escapeExpression(text) + "</b>";
  return new Handlebars.SafeString(result);
})
```

### Helpers with Multiple Parameters
Let's see the sample:

```hbs
{{link "See Website", url}}
```

```js
Handlebars.registerHelper("link", function(text, url){
  var url = Handlebars.escapeExpression(url),
      text = Handlebars.escapeExpression(text);

  return new Handlebars.SafeString("<a href='" + url + "'>" + text + "</a>");
})
```

```json

{
  "url": "https://yehudakatz.com/"
}
```

```html
<a href='https://yehudakatz.com/'>See Website</a>
```

### Helpers with Hash arguments
```hbs
{{link "See Website" href=person.url class="person"}}
```

```js
Handlebars.registerHelper("link", function(text, options) {
    var attributes = [];

    Object.keys(options.hash).forEach(key => {
        var escapedKey = Handlebars.escapeExpression(key);
        var escapedValue = Handlebars.escapeExpression(options.hash[key]);
        attributes.push(escapedKey + '="' + escapedValue + '"');
    })
    var escapedText = Handlebars.escapeExpression(text);
    
    var escapedOutput ="<a " + attributes.join(" ") + ">" + escapedText + "</a>";
    return new Handlebars.SafeString(escapedOutput);
});
```

```json
{
  "person": {
    "firstname": "Yehuda",
    "lastname": "Katz",
    "url": "https://yehudakatz.com/",
  },
}
```

```html
<a class="person" href="https://yehudakatz.com/">See Website</a>
```

### Disambiguating helpers calls and property lookup
If helper has the same identifier as input property, helper's name has priority. We can fix this by using `./`, `this.`, `this/` to enforce referening input property.

```hbs
helper: {{name}}
data: {{./name}} {{this/name}} {{this.name}}
```

```json
{
  "name": "Yehuda"
}

```js
Handlebars.registerHelper("name", function(){
  return "Nils"; 
});
```

```html
helper: Nils
data: Yehuda Yehuda Yehuda
```

### Subexpressions
Helpers can be nested within single mustache expression, and result of nested helper could also turn into parameter to the parent helper.
For example:
```hbs
{{outer-helper (inner-helper 'abc') 'def'}}
```

In this example, `inner-helper` was first invoked with parameter `abc`, the result of `inner-helper` becomes the first parameter when invoking `outer-helper` right after.

### Whitespace control
The mustache expression's default behavior is to reserve all the whitespaces on the both side of `{{}}`.

For example:

We have an input file that looks like this,
```json
{
  "nav": [
    {
      "url": "foo", 
      "test": true,
      "title": "bar"
    },
    {
      "url": "bar"
    }
  ]
}
```

If our handlebars template is like this,

```hbs
{{#each nav}}
  <a href="{{url}}">
    {{#if test}}
      {{title}}
    {{^}}
      Empty
    {{/if}}
  </a>
{{/each}}
```
Then, the default whitespace behvior would give us,

```html
<a href="foo">
  bar
</a>
<a href="bar">
  Empty
</a>
```
- but, using `~` at the beginning or ending of the mustache expression would ignore all the whitespaces on corresponding side.

WIth the same input file, if we are having handlebars template like this,

```hbs
{{#each nav ~}}
  <a href="{{url}}">
    {{~#if test}}
      {{~title}}
    {{~^~}}
      Empty
    {{~/if~}}
  </a>
{{~/each}}
```
We would have output like this,

```html
<a href="foo">bar</a><a href="bar">Empty</a>
```

### Escaping Handlebars expressions
There are 2 ways of preventing escaping
1. `\{{unescaped}}`
2. 
```hbs
{{{{raw}}}}
  {{unescaped}}
{{{{/raw}}}}
```
<sub>Here, escaping means to transform `&` to `&amp;`</sub>

# Partials

Partials are expressions that can be reused. Expression means a string of statement that can be compiled by hbs.

For example:

```hbs
{{> myPartial}}
```

Here, we register out Partial.
```js
Handlebars.registerPartial("myPartial", "{{prefix}}");
```

```json
{ "prefix": "Hello" }
```

```output
Hello
```

## Dynamic Partials

So partials are called by `{{> }}`, this statement also can be used to call Block Helpers.

For example, we have block called `whichPartial`.

```hbs
{{> (whichPartial)}}
```

```js
Handlebars.registerHelper("whichPartial", function (context, opts) {
  return "dynamicPartial";
});

Handlebars.registerPartial("dynamicPartial", "Dynamo!");
```

```json
null
```

```output
Dynamo!
```

## Partials can be called with Context property name.

```hbs
{{> myPartial myOtherContext}}
```

```js
Handlebars.registerPartial("myPartial", "{{information}}");
```

```json
{
  "myOtherContext": {
    "information": "Interesting!"
  }
}
```

```output
Interesting!
```

## Partial can be called with Parameters.

```hbs
{{#each people}}
    {{> myPartial prefix=../prefix firstname=firstname lastanme=lastname}}.
{{/each}}
```

```js
Handlebars.registerPartial(
  "myPartial",
  "{{prefix}}, {{firstname}} {{lastname}}"
);
```

```json
{
  "people": [
    { "firstname": "Nils", "lastname": "Knappmeier" },
    { "firstname": "Yehuda", "lastname": "Katz" }
  ],
  "prefix": "Hello"
}
```

```output
  Hello, Nils Knappmeier.
  Hello, Yehuda Katz.
```

## Partial Blocks
If we are using block expression and partial at the same time, for example `{{#> layout}}`, then the block content will render as default if the partial does not exists.

For example:
```hbs
{{#> layout}}
  Error: partial not registered.
{{/layout}}
```
The sentence "Error: partial not registered" will appear only when `layout` is not registered.

However, if `layout` is registered as follow,
```js
Handlebars.registerPartial("layout", "Site Content {{> @partial-block}}")
```

and `layout` is a template like this:

```hbs
{{#> layout}}
My Content
{{/layout}}
```

and `@partial-block` is not registered, the output would be,
```html
Site Content My content
```

- You need to look out for the context when partial is nested within partial blocks. The context would remain relative to the partial block but not the partial.

for example:
```hbs
{{#each people as |person|}}
  {{#> childEntry}}
    {{person.firstname}}
  {{/childEntry}}
{{/each}}
```
so the context remains `person` as available identifier within `childEntry` partial.

## Inline Partials
Inline partial can be initialized within the template, and if registered partial has the same name, inline partial would override.

Example for inline partial:
```hbs
{{#*inline "myPartial"}}
  My Content
{{/inline}}

{{#each people}}
  {{> myPartial}}
{{/each}}
```
Within this example, `myPartial` would be available for each people's item.

Example for overrides:
```hbs
{{#> layout}}
  {{#*inline "nva"}}
    My Nav
  {{/inline}}
  {{#*inline "content"}}
    My Content
  {{/inline}}
{{/layout}}
```

```js
Handlebars.registerPartial("layout", `
  <div class='nav'>
    {{> nav}}
  </div>
  <div class='content'>
    {{> content}}
  </div>
`);

Handlebars.registerPartial("nav", "nav");
Handlebars.registerPartial("content", "content");
```

Although `nav` and `content` partials are registered, but inline partials issued at template take priority.

```html
<div class='nav'>
    My Nav
  </div>
  <div class='content'>
    My Content
  </div>
```

# Helpers

Helper are function that can be called by Handlebars.

```hbs
{{firstname}} {{loud lastname}}
```

```js
Handlebars.registerHelper("loud", function (aString) {
  return aString.toUpperCase();
});
```

```json
{
  "firstname": "Yehuda",
  "lastname": "Katz"
}
```

```output
Yehuda KATZ
```

# Block Helpers

## Before everything starts

As previous notes state, we have helpers and partials. 
- Helpers, using `Handlebars.registerHelper` to register, act as a function.
- Partials, using `Handlebars.registerPartial` to register, being registered as a string.

If we put thest two things into block expression, for example `{{# helper}}` or `{{#> partial}}`, they would behave little bit different.

For block partials please refer to [Partial Blocks Section](#partial-blocks)

## Section continued

Block Helpers are special function, it has `this` keyword which represents the current context.

And only Block Helper can receive a `options` parameter when registered as function. And `options.fn` represents the current template included within the block helper, so `options.fn(this)` means to compile the current template using current context.

For example:

```hbs
{{#noop}}<div>{{body}}</div>{{/noop}}
```

```js
Handlebars.registerHelper("noop", function (options) {
  return options.fn(this);
});
```

```json
{
  "body": "Yeah!"
}
```

```html
<div>
Yeah!
</div>
```

## Calling Block Helper with Specified Context Property

Suppose we have template like below:
```hbs
<div class="entry">
  <h1>{{title}}</h1>
  {{#with story}}
    <div class="intro">{{{intro}}}</div>
    <div class="body">{{{body}}}</div>
  {{/with}}
</div>
```
Then `with` as block helper is registered below, and the context is a parameter we specified in the above template as `story` property in the current context.

```js
Handlebars.registerHelper("with", function (context, options) {
  console.log(options);
  console.log(context); // {intro: "Before the jump", body: "After the jump"}
  console.log(this); // {"title": "First Post","story": {"intro": "Before the jump","body": "After the jump"}}
  return options.fn(context);
});
```

```json
{
  "title": "First Post",
  "story": {
    "intro": "Before the jump",
    "body": "After the jump"
  }
}
```

```output
<div class="entry">
  <h1>First Post</h1>
    <div class="intro">Before the jump</div>
    <div class="body">After the jump</div>
</div>
```
## Simple iterator

> Just remember that all of the built-in helpers are block helpers, they work the same way as block helpers do.

## Conditionals


# Built-in Helpers
## #if
```hbs
<div class="entry">
{{#if author}}
<h1>{{firstName}} {{lastName}}</h1>
{{/if}}
</div>
```

```json
  "author": true,
  "firstName": "Yehuda",
  "lastName": "Katz",
```

```output
<div class="entry">
<h1>Yehuda Katz</h1>
</div>
```

