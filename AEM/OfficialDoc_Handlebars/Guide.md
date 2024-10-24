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

# Partials

Partials are expressions that can be reused. Expression means a string of statement that can be compiled by hbs.

For example:

```hbs
{{> myPartial}}
```

```js
Handlebars.registerPartial("myPartial", "{{prefix}}");
```

```json
{ "prefix": "Hello" }
```

```output
Hello
```

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

Block Helpers are special function, it has `this` keyword which represents the current context, and `options.fn(this)` means to compile the content of block helper using current context.

For example:

```hbs
{{#noop}}{{body}}{{/noop}}
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

```output
Yeah!
```

## With

```hbs
<div class="entry">
  <h1>{{title}}</h1>
  {{#with story}}
    <div class="intro">{{{intro}}}</div>
    <div class="body">{{{body}}}</div>
  {{/with}}
</div>
```

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

