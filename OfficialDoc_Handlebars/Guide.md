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
