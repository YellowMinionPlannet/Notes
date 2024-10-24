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

It should begin with a slash `/`

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
        }
    }
);

fractal.components.engine(hbs); /* set as the default template engine for components */
fractal.docs.engine(hbs); /* you can also use the same instance for documentation, if you like! */
```

#### Configuration options
There are other stuff you can put into the Handlebars

- partials
```js
{
    partials:{
        foobar: "thi sis a partial!"
    }
}

```
- pristine
If set to `true`, that means you DO NOT wish to automatically load any of the bundled helpers.
```js
{
    pristine: true
}
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

Rules for properties in config files. 

1. If property is primitive, downstream entity override upstream
2. If property is missing in downstream, aggregate upstream to downstream.
3. If property is object, aggregate upstream to downstream. 
    
For example, No.3,
```yml
# upstream.config.yml
context:
    tags:
        - sprint-1
        - dashboard
```

```yml
# downstream.config.yml
context:
    tags:
        - dashboard
        - needs-review
```

then after aggregate, the downstream context will be:

```yml
context:
    tags:
        - dashboard
        - needs-review
        - sprint-1
```

# Naming & Referencing

# Statuses

# Components

# Creating a Component

# Preview Layouts

# Variants

## Three ways of creating variants

### By configuration files

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

There will be three components in the fractal to display.

```output
<input type="button" value="default"/>
<input type="button" value="success"/>
<input type="button" value="warning"/>
```

### By view templates

Just create button.hbs and button--success.hbs and button--warning.hbs.

### By mixed method

Just mix both method.

> Note: The variant will aggregate configuration in the default ones.

# Including sub-components

There are 3 ways of doing this.

## using render helper
## using handlebar partial
## using handlebar partial and reference partial context data in configuration file


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