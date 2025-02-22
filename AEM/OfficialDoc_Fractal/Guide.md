[fractal.build](fractal.build)

# Installing Fractal
## Installing Fractal in your project

1. use `npm init` to initialize your project directory.
2. use `npm install --save @frctl/fractal` 
> NOTE: `npm install` and `npm install --save` is no difference after npm 5.0.0

## Installing the Fractal CLI tool

Using CLI tool to start Fractal development web server is easy, but you can also us Gulp and other NPM scripts tool to do this.

To install Fractal CLI tool by using `npm i -g @frctl/fractal`

[Link to Fractal CLI](#fractal-cli)

# Upgrading
- Template engines: default Handlebars engine
- Themes: Mandelbrot

# Project Settings

Before you can get your dev server running, you need to provide following required settings.

## The `fractal.config.js` file

This file should be locate in your root directory, and you need this to use CLI tool.

> It recommanded way to create path using keyword `__dirname`, for example, instead of using `src/components`, it's better to use `__dirname + '/src/components'`

## Creating and exporting a new Fractal instance
At min for the setting file, it needs to create a new instance and export it.
```js
const fractal = module.exports = require('@frctl/fractal').create();
```

## Project-related metadata(Customization)

You can use `fractal.set()` to customize the metadata from defaults.

```js
fractal.set('project.title', 'FooCorp Component Library');
fractal.set('project.version', 'v1.0');
fractal.set('project.author', 'Mickey Mouse');
```

## Configuring components (path)

```js
fractal.components.set('path', __dirname+'/src/components');
```

## Configuring documentation pages (path)

```js
fractal.docs.set('path', __dirname+'/src/docs');
```

## Configuring the web UI

- Path of assets
```js
fractal.web.set('static.path', __dirname+'/public');
```
- Path of build destination
```js
fractal.web.set('builder.dest', __dirname+'/build');
```

# View templates
Template is something static to each page, it is the reusable part. You can also pass variables into it.

## File extensions
By default, the componnet view templates with `.hbs` and documentation view templates with a `.md` extension name.

You can customize this by
```js
fractal.components.set('ext', '.handlebars');
fractal.docs.set('ext', '.html');
```

## Using Handlebars
Handlebars is the default template engine for Fractal components.

[Click here for Handlebars section](../OfficialDoc_Handlebars/Guide.md)

### Handlebars helpers

We can use handlebars in fractal. 
```hbs
{{> '@example'}}
```

```output

```

This way will not pull the referenced partial context data in, so the output is empty.

> Refering the [handlebar guide](../OfficialDoc_Handlebars/Guide.md#partial-can-be-called-with-parameters), the handlebar can play with parameters but you can pass in the whole context data.

#### `render`

We can use `render` helper built in fractal to pass in context data.

```hbs
<!-- example.hbs -->
<p>{{ text }}</p>

{{#if merge}}
<p>{{ merge}}</p>
{{/if}}

{{#if original}}
<p>{{ original}}</p>
{{/if}}
```

```hbs
<!-- render-example.hbs -->
{{render '@example' someData}}
```
```yml
# example.config.yml
context:
    text: This is a sample component!
```
```yml
# render-example.config.yml
context:
    someData:
        text: BOOM!
        merge: MERGE!
```

```output
<p>BOOM!</p>

<p>MERGE!</p>
```

As result, we can see that context in referenced template, `example.hbs`, was replaced by referencer template, `render-example.hbs`.

#### `merge`

```hbs
<!-- example.hbs -->
<p>{{ text }}</p>

{{#if merge}}
<p>{{ merge}}</p>
{{/if}}

{{#if original}}
<p>{{ original}}</p>
{{/if}}
```

```hbs
<!-- render-example.hbs -->
{{render '@example' someData merge=true}} 
<!-- merge involved -->
```
```yml
# example.config.yml
context:
    text: This is a sample component!
    original: ORIGINAL!
```
```yml
# render-example.config.yml
context:
    someData:
        text: BOOM!
        merge: MERGE!
```

```output
<p>BOOM!</p>

<p>MERGE!</p>

<p>ORIGINAL!</p>
```

As result, we can see the context was first replaced by `someData`, then the `original`context was merged.

#### `path`

```hbs
{{path '/css/my-stylesheet.css'}}
```

It should begin with a slash `/` and arguments are relative to the web root.

Always use this to reference static assets.

#### `context`

```hbs
{{context '@example'}}
```

```yml
# example.config.yml
context:
    text: This is a sample component!
    original: ORIGINAL!
```

```output
{ "text": "This is an example component!", "original": "ORIGINAL!" }
```

#### `contextData`

Will return the context object of a certain partial.

```hbs
<!--
  Include the @button-1 component template but pass in
  the context data from @button-2
-->
{{> '@button-1' (contextData '@button-2') }}

<!--
  The same as above, but passing in some data to override
   some items in the @button-2 data. 'someData' is an
   object, i.e. {text: 'foo'}
-->
{{> '@button-1' (contextData '@button-2' someData) }}
```

#### `view`
Output the raw view template for a component.
```hbs
{{view '@example'}}

```

### Special Variables

#### _config

Contains full fractal configuration object

```hbs
{{ _config.project.title }} <!-- outputs the project title -->
{{ _config.components.ext }} <!-- outputs the extension used for components -->
```

#### _self

```hbs
{{ _self.title }} <!-- outputs 'Button' -->
```

#### _target
Only available in component preview layout, and contains data object represnets the item rendered.

## Customising Handlebars
Before customising handlebar engine, you need to install package directly into your project.

Try run `npm install --save @frctl/handlebars`

Then here is the example of customization:
```js
// fractal.config.js file 

const hbs = require('@frctl/handlebars')(
    {
        helpers:{
            uppercase: function(str){
                return str.toUpperCase();
            }
        },
        partials:{
            foobar: "thi sis a partial!",
            prestine: true,
        }
    }
);

fractal.components.engine(hbs); /* set as the default template engine for components */
fractal.docs.engine(hbs); /* you can also use the same instance for documentation, if you like! */
```

#### Accessing the underlying Handlebars instance
We can register helper and partials the way as handlbar does by visiting `handlebars` instance in the fractal instance.

```js
const instance = fractal.components.engine();
instance.handlebars.registerHelper("foo", function(str){

});
```

we can use way combined with handlebars adapter which is introduced previously.

```js
const hbs = require('@frctl/handlebars')({
    /* configuration options here */
});

const instance = fractal.components.engine(hbs);

instance.handlebars.registerHelper('bar', function(str){
    /* do something */
});
```


# Context Data

Context data is data that is available to your view templates.

It can be following data structure:
1. strings
2. booleans
3. numbers
4. arrays
5. objects

It can also contain Promises and 'static data references'

## Defining & using context data
To define context data, you need to set a `context` object in relevent configuration file:
```json
// my-component.config/json
{
    "context":{
        // context data goes here
    }
}
```

For example:
We can use `{{}}` in the template to access anything under context.

```hbs
<!-- example.hbs -->
<p>{{text}}</p>
```

```yml
context:
    text: This is a sample component!
```

```html
<p>This is a sample component!</p>
```

## Static data references
within the conetext config file, you can reference another view template's context data by using syntax like `@otherContext`.

For example,

```yml
# list-items.config.yml
context:
    title: My favorite list items
    items:
        - one
        - two
        - three
        - four
```
```yml
# another .config.yml
context:
    list: '@list-items.items'

# this will resolve to
context:
    list:
        - one
        - two
        - three
        - four
```

## Dynamic data
We can us framework such as *Faker* to program and generate dynamic data.

Before we start coding, we need to use `npm install faker --save` to install *faker* framework.
```js
// within member-list.config.js

const faker = require('faker');
const memberCount = 10;
const memberData = [];

for(var i = 0; i < memberCount; i++){
    memberData.push(
        {
            name: faker.name.findName(),
            email: faker.internet.email()
        }
    );
}

module.exports = {
    context:{
        member: memberData
    }
}
```

### Using data from API
By using `Promise` we can add remote data.
```js
const request = require('request-promise-native');

const response = request({
    uri: 'http://www.mysite-api.com/member',
    json: true
})

response.then(function(membersApiData){
    const memberData = [];
    for(let member of membersApiData){
        memberData.push({
            name: `${member.firstName} ${member.lastName}`,
            email: member.emailAddress
        })
    }
    return memberData
})

module.exports ={
    context:{
        members: response //should be a promise type
    }
}
```

# Configuration Files
We can set configuration files for 3 types of items, with 3 formats.

Items:
- Component
- Pages
- Collection

3 formats:
1. .config.json
2. .config.yml
3. .config.js

## Configuration inheritance
In fractal, the configuration context data is using *cascade* concept. This concept will reuse shared properties, for example, collection configuration file properties will pass down to the components.

Rules for properties in config files. 

1. If property is primitive, downstream entity override upstream
    - Check if it is set directly in the component's configuration file, if so, use it.
    - Otherwise, recursively work upwards to check any parent collections to see if any of them have the same identifier.
    - I no values set in the upwards, use the default value.
2. If property is missing in downstream, aggregate upstream to downstream.
3. If property is object or array, aggregate upstream to downstream. 
    - downstream is merged with upstream
    
For example, No.3,
```js

// fractal.config.js
fractal.components.set('default.conetext', {
    'background': 'sparkly'
});

//upstream collection config file
{
    "context":{
        "special-sauce": true,
        "background": "stars"
    }
}

//downstream component config file
{
    "context":{
        "text":"Click here!"
    }
}

// Finally resolved to 
{
    "background": "stars",
    "special-sauce": true,
    "text": "Click here!"
}
```

# Naming & Referencing
Fractal auto identify templates through file path/structure, this gives hard time when trying to reference other templates. That's because if the path changes, we need to correct each path reference.

So, fractal also supports *handle* reference.

## Generated names & handles
Unless devloper specified through config, fractal will infer *name* of component/item, and use that *name* as *handle* for that component/item, then developer can reference other templates by using these *handles*.

> TIP
>
> *name* and *handles* can only contain lowercase, alphanumeric, underscores and dashes.

The *name* will be also used to generate *label* and *title*. *Label* is used for navigation, and *title* is used for name of item when it needs to appear as text.

For example, if we have folder structure like
```
|-- components
|   |-- blockquote-large.hbs
```
Then, we will have corresponding properties for `blockquote-large` as
- name: blockquote-large
- handle: blockquote-large
- label: Blockquote Large
- title: Blockquote Large

## Uniqueness
Fractal only recognize unique handle, so the later handle with the same name would be ignored.

For example, we have folder structure like,
```
|-- components
|   |-- standard
|   |   |-- button.hbs
|   |-- special
|   |   |-- button.hbs
```
In this case, the second `button` will be ignored.

You can solve this by:
1. [collection prefix](#prefixes)
2. [bespoke handle](#customising-names--handles)

## Ordering and hiding
### Ordering
two digits could be used in front of the name in order to do ordering.
```
|-- pages
|   |-- 01-index.md
|   |-- 02-changelog.md
|   |-- 03-naming-conventions.md
```
underscore is used to hide template.
```
|-- components
|   |-- _hidden-components.hbs
|   |-- article.hbs
```
The `hidden-components` could be referenced by others but will not appear in the navigation.

## Prefixes
The collection can have its own collection configuration file, whose property will apply to all the components.

Within this file, there's `prefix` property will cause *handle* generation behave differently.

for example,
```
|-- components
|   |-- standard
|   |   |-- button.hbs
|   |-- special
|   |   |-- special.config.json
|   |   |-- button.hbs
|   |   |-- alert.hbs
```
Upper example shows that `special.config.json` is a collection config file. If it contains property like `"prefix": "sparkly"`, then the `button.hbs` and `alert.hbs` handles would become `sparkly-button` and `sparkly-alert` correspondingly.

## Customising names & handles

- Customising *name* will also change the *handle*
- Customising *name* will not prevent *prefix* logic, but customized *handle* will lead to ignorance of *prefix*

## Referencing other items
If we have file structure like:
```
|-- components
|   |-- banner.hbs
|   |-- standard
|   |   |-- button.config.json
|   |   |-- button.hbs
|   |-- special
|   |   |-- special.config.json
|   |   |-- button.hbs
|   |   |-- alert.hbs

```
and, we have  following customized config files:

```json
// components/standard/button.config.json
{
    "handle": "clickme"
}

// components/special/special.config.json
{
    "prefix": "sparkly"
}
```
Then, we have reference relation as following
|referenced file|reference syntax|
|-|-|
|banner.hbs|@banner|
|standard/button.hbs|@clickme|
|special/alert.hbs|@sparkly-alert|
|special/button.hbs|@sparkly-button|

## Statuses
There are couple default options for components and documentation items.
- components: `ready` `wip` `prototype`
- documentation: `ready` `draft`

So within the item's config file, you can set this through `status` property in the context.

### Customising

By the `fractal.config.json`, you can set the default statuses for components and docs like:
```js
fractal.components.set('statuses', {
    prototype: {
        label: "Prototype",
        description: "Do not implement.",
        color: "#FF3333"
    },
    wip: {
        label: "WIP",
        description: "Work in progress. Implement with caution.",
        color: "#FF9233"
    },
    ready: {
        label: "Ready",
        description: "Ready to implement.",
        color: "#29CC29"
    }
});

fractal.docs.set('statuses', {
    draft: {
        label: 'Draft',
        description: 'Work in progress.',
        color: '#FF3333'
    },
    ready: {
        label: 'Ready',
        description: 'Ready for referencing.',
        color: '#29CC29'
    }
})

```

Or more specifically, 

```js
fractal.components.set('statuses.prototype.color', 'pink');
fractal.docs.set('statuses.ready.label', 'Good to go!')
```

# Components - Overview
What is **required** to be a component in fractal:
1. Live within the components directory which is defined by project settings
2. Should have a extension file that match up the template engine file extension, which is also defined in project settings.

What is **optional** for components:
- configuration and preview data
- organzied into directories or sub-directories
- include related files, such as js, css, tests, README.md
- have one or more variants.

## Simple components
It is defined as simple component if:
- it only contains a template file. It can have a configuration file which must be reside in same directory.
- And both of the files must NOT have same name as the folder.

## Compound components
It is compound component if:
1. the template has the same name as the parent folder
2. configuration file can be added
3. other related files has no naming conventions

For example,
```
|-- components
|   |-- blockquote
|       |-- blockquote.config.yml
|       |-- blockquote.hbs
|       |-- fancy-quote.js
|       |-- README.md
|       |-- style.css
```

## Hiding components and Ordering them
- Ordering: using two digits in front of name
- Hiding: using `hidden` property in config file or adding `_` underscore as prefix.

# Creating a Component
## Creating variants
Using `--` to clarify this template is a variant, for example:
```
|-- components
|   |-- blockquote.config.json
|   |-- blockquote--fancy.hbs
|   |-- blockquote.hbs
```

## Adding a preview layout
We can use global config file to point to a component to be the default preview layout.
```js
fractal.components.set('default.preview', '@preview');
```
Here, we set template with handle 'preview' to be the default preview layout, which something looks like:
```hbs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="{{ path '/assets/main.css' }}">
    <title>Preview</title>
</head>
<body>

{{{ yield }}}

<script src="{{ path '/assets/main.js' }}"></script>
</body>
</html>
```
Be noticed that `{{{yield}}}` is where you render the individual component.

# Preview Layouts
In the preview file, remember that you can hook up with related files(css, js etc.) using `path` helper. For example, `{{path '/example.css'}}`

## Preview rendering steps

1. component is rendered using its own context
2. rendered content passed into `yield`
3. A json representation of component assigned to `_target`
4. Layout view renders other yield and _target.


# Variants

In the context data, you can define a array property named `variants` to define your variants of current component. Each item in the `variants` array should contain a `name` property, which is the only required property.

For example,
```json
{
    "title": "Notification Banner",
    "variants":[
        {
            "name": "warning"
        },{
            "name": "success"
        }
    ]
}

```

## Defining variants in the component's config file

Variants inherits the context data of parent component. And within each variant, you can set up individual `context` property, properties of which will overides the parent ones.

For example,
```hbs
<!--notifications.config.json-->
<div class="notification notification--{{modifier}}">
    <p class="notification-message">{{message}}</p>
    <a class="notification-close" href="#">{{closeButtonText}}</a>
</div>
```

```json
{
    "title":"Notification Banner",
    "status": "ready",
    "context":{
        "modifier":"default",
        "closeButtonGText": "close",
        "message":"This is the default banner"
    },
    "variants":[
        {
            "name": "warning",
            "context":{
                "modifier": "alert",
                "message":"This is a warning banner"
            }
        },{
            "name": "success",
            "status":"prototype",
            "context":{
                "modifier":"success",
                "message": "This is a success banner"
            }
        }
    ]
}
```

## Creating file-based variants
If the variant has different markup from the default component, you can also create variant by adding another template file. The convention of naming is some syntax like `<component-name>--<variant name>`.

Variants and default component shares the same context data from config file.

```
|-- components
|   |-- notification
|   |   |-- notification--success.hbs
|   |   |-- notification--warning.hbs
|   |   |-- notification.hbs
```

```hbs
<!-- button.hbs -->
<input type="button" value="{{_self.name}}"/>
```
```yml
# button.config.yml
variants:
    - name: success
    - name: warning
```

## Mixing configuration and file based variants
Remember, you can mix both methods. You can have variants' own templates file and share the config file of default component. When rendering variants, if the config file `variants` property contains the same named item, that item will become the variant's context data.

## Default variant
Even you don't have `variants` property set, there would be one variant implicitly created by fractal. That default variant is named *default*. This default name could be customized through `default` property within the config file.

The implicit default variant is rendered by default. 

For example,
```hbs
{{render @notification}}

<!-- Same meaning with upper line even the config file does not *default* variant defined.-->
{{render @notification--default}}
```
### Default variants and context data
We can utilize this default variant behavior to prevent sharing context data from parent component context data.

```json
{
    "title": "Notification Banner",
    "context": {}, // no shared data
    "variants":[
        {
            "name": "default",
            "label": "Base",
            "context":{
                "message": "This is a standard notification"
            }
        },
        // other variants
    ]
}
```

## Collated components
To show each variant in a individual preview page, you need to set `collated` property to `true`.

# Including sub-components

<sub>Following methods will include sub-components without individual context data</sub>

- Example #1:

We have parent component 
```hbs
<!--search-box.hbs-->
<div class="searchbox">
    <input type="search" name="keywords">
    {{> @button}}
</div>
```
then, we have sub-component
```hbs
<!--button.hbs-->
<button type="button" name="submit">Search</button>
```

- Example #2:
Using `@partial-block`, buit in handlebars framework, will also work for including sub-component.

We have parent template
```hbs
<!--container.hbs-->
<div class="container">
    {{> @partial-block}}
</div>
```

Then we can have:
```hbs
<!--This will render anotherPartial with container div-->
{{#> container}}
    {{> anotherPartial}}
{{/container}}
```
```hbs
{{#> container}}
    {{yield}}
{{/container}}
```

Above 2 examples will not render sub-component with the context data even there is config file for sub-component.

## Providing context data to sub-components
To provide context data when including sub-components, there would be 3 ways:

1. Using `render` helper
```hbs
<!-- button.hbs -->
<button type='button' name='submit'>{{ button.text }}</button>
```

```json
// button.config.json
{
    "context":{
        "button":{
            "text": "A Button"
        }
    }
}
```

```hbs
<!-- search-box.hbs -->
<div class="search-box">
    <label for="search">{{ label }}</label>
    <input type="search" name="keywords" id="search">
    {{ render '@button'}}
</div>
```

```json
// search-box.config.json
{
    "context": {
        "label": "Search"
    }
}
```

```html
<!-- output -->
<div class="search-box">
    <label for="search">Search</label>
    <input type="search" name="keywords" id="search">
    <button type='button' name='submit'>A Button</button>
</div>
```

2. Define all context data in the parent component's config
```hbs
<!-- button.hbs -->
<button type='button' name='submit'>{{ button.text }}</button>
```

```json
// button.config.json
{
    "context":{
        "button":{
            "text": "A Button"
        }
    }
}
```

```hbs
<!-- search-box.hbs -->
<div class="search-box">
    <label for="search">{{ label }}</label>
    <input type="search" name="keywords" id="search">
    {{> @button}}
</div>
```

```json
// search-box.config.json
{
    "context": {
        "label": "Search",
        "button":{
            "text": "Go!"
        }
    }
}
```

```html
<!-- output -->
<div class="search-box">
    <label for="search">Search</label>
    <input type="search" name="keywords" id="search">
    <button type='button' name='submit'>Go!</button>
</div>
```

3. Use `@handle` syntax within context data (config file)

```hbs
<!-- button.hbs -->
<button type='button' name='submit'>{{ button.text }}</button>
```

```json
// button.config.json
{
    "context":{
        "button":{
            "text": "A Button"
        }
    }
}
```

```hbs
<!-- search-box.hbs -->
<div class="search-box">
    <label for="search">{{ label }}</label>
    <input type="search" name="keywords" id="search">
    {{ render '@button'}}
</div>
```

```json
// search-box.config.json
{
    "context": {
        "label": "Search",
        "button": "@button"
    }
}
```

```html
<!-- output -->
<div class="search-box">
    <label for="search">Search</label>
    <input type="search" name="keywords" id="search">
    <button type='button' name='submit'>A Button</button>
</div>
```

# Notes
Notes can be done through explicit markdown file or `notes` property within config file.

markdown file could be named as syntax `README.md` `readme.md` `<component-name>.readme.md` or `<component-name>--<variant-name>.readme.md`.

Remember that `README.md` will be run through fractal engine before markdown parser. That means you can use mustache within your documentation.

# Configuration reference(quick cheatsheet)


# Fractal CLI
## Overview
### Installation & setup
You can install CLI tool by `npm i -g @frctl/fractal`

There would be Prerequisites
1. you must ahve a project settings file, `fractal.config.js` by default
2. and it exports a configured Fractal instance:
```js
//fractal.config.js

var fractal = require('@frctl/fractal').create();
fractal.set('project.title', 'FooCorp Component Library');
fractal.components.set('path', _dirname + '/src/components');

module.exports = fractal; // export the configured Fractal instance for use by the CLI tool.
```

### Running commands

Typical command format:
```
fractal <command-name> [args] [opts]
```

If you want to open UI dev server with *BrowserSync* option:

```
fractal start --sync
```

To run multiple commands, please see [Interactive Mode](#interactive-mode)


### Command Types
There are 2 types for commands:
1. global
2. project

Example of *global command*
```
fractal new <project-name>
```

Where *project commands* can only be run within root directory of your project, which requires *project settings file*

## Custom commands
Custom commands can hook up Fractal's API. 

You need to register your custom commands within your *project settings file* by `fractal.cli.command()`.

### An example custom command

```js
// fractal.config.js

var config = {
    description: 'Lists components in the project'
}

function listComponents(ars, done){
    const app = this.fractal;
    for(let item of app.components.flatten()){
        this.log(`${item.handle} - ${item.status.label}`);
    }
    done();
}

fractal.cli.command('list-components', listComponents, config);
```

Once created, the command can be run from project directory by `fractal list-components`.

OR

`fractal.cli.exec('list-components')`

### Accepting arguments

When you want to pass arguments to your custom commands, the usage of `fractal.cli.command()` function would be slightly different.

```js
fratcal.cli.command('foo <requiredArg> [optionalArg] [anotherOptionalAr]', function(args, done){
    console.log(args.requiredArg);
    done();
})
```

The first argument of `fractal.cli.command()` would be the string format of your custom command, where `<>` represents the name of required arguments, and `[]` is the name of optional arguments.

### Accepting options

```js
var config = {
    options:[
        ['-p, --port <number>', 'The port to use.']
    ]
}

fractal.cli.command('foo', function(args,done){
    console.log(`Something was started on port ${args.options.port}`);
    done();
}, config); 
```

## Interactive Mode

It is a mode that allows you to start a dev server and do subsequent commands in the same CLI window.

You can launch interactive CLI by running `fractal` command in your terminal.

And following command would follow format as it originally was, but `fractal` prefix could be ignored.

For example：
```
start --sync
```

### Interactiv CLI tips

you can use `help`, `exit` commands, but global level commands cannot be run within interactive mode.

## Commands reference

### Project commands

```
fractal start
```
with following options:
- `-p, --port <port-number>`
- `-t, --theme <theme-name>`
- `-s, --sync`
- `-w, --watch`


```
build
```
with following option:
- `-t, -theme <theme-name>`

### Global commands
```
fractal new <directory-name>
```