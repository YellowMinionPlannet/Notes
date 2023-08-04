# Context Data

We can use `{{}}` in the template to access anything under context.

```hbs
<!-- example.hbs -->
<p>{{text}}</p>
```

```yml
context:
    text: This is a sample component!
```

```output
<p>This is a sample component!</p>
```

# View Template

We can use handlebars in fractal. 
```hbs
{{> '@example'}}
```

```output

```

This way will not pull the referenced partial context data in, so the output is empty.


## Using render helper

But in this way, we cannot pass data and pull the context data into the referenced partials.

So, we can use `render` helper built in fractal.

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

## Using render helper with merge

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

## Using path helper

```hbs
{{path '/css/my-stylesheet.css'}}
```

It should begin with a slash `/`

Always use this to reference static assets.

## Using context helper

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

## Using contextData helper

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

## Special Variables

### _config

Contains full fractal configuration object

```hbs
{{ _config.project.title }} <!-- outputs the project title -->
{{ _config.components.ext }} <!-- outputs the extension used for components -->
```

### _self

```hbs
{{ _self.title }} <!-- outputs 'Button' -->
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