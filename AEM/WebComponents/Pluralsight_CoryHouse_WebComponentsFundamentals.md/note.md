> IMPORTANT: This course content is deprecated, but concept is good. So notes stops at Section 5.

# 2 Templates
## Intros
## Common Approaches when `template` tag is not available
- there is handlebar js library and Kendo UI library, they all offer template feature through `script` tag.
  - issues: script provides template through innerHTML, so it's a string that parsed into nodes. That will have XSS risk

- Hidden DOM elements
for example:
```html
<div style="display:none" id="my-template"></div>
```
- It's easier to be cloned compared to the script solution
- But script will immediately run if we put it inside this kind of template

## `template` tag characteristics
1. Inert, everything inside it will not run until it is cloned/used
2. Hidden from Selectors, 
```html
<template>
    <p id="p"></p>
</template>
<script>
  document.getElementById("p"); //null
</script>
```
3. Flexible Placement, you can place `template` anywhere

## Defining and cloning
- How to activate template
1. `template = document.querySelector("#myTemplate");` get the reference of template
2. `clone = document.importNode(template.content, true)` clone `template` tag's content(excluding open/closed tag), and `true` is deeply cloned
3. `document.body.appendChild(clone)`

## Injecting Dynamic Data
- How to inject dynamic data?
1. `template = document.querySelector("#myTemplate");` get the reference of template
2. `clone = document.importNode(template.content, true)` clone `template` tag's content(excluding open/closed tag), and `true` is deeply cloned
3. `clone.querySelector(".target").textContent= "awesome";`, traverse from the cloned template
4. 3. `document.body.appendChild(clone)`

Example:
```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
      <template>
        <p>
          This <span class="adjective"></span> tempalte has been copied <span class="number-of-copies"></span> times.
        </p>
      </template>

      <button onclick="copyTemplate()">copy template</button>
      <script>
          var numberOfCopies = 0;
          function copyTemplate(){
            var template = document.querySelector("template");
            var clone = document.importNode(template.content, true);
            clone.querySelector(".adjective").textContent = "awesome";
            clone.querySelector(".number-of-copies").textContent = ++numberOfCopies;

            document.body.appendChild(clone);
          }
      </script>
  </body>
</html>
```

## Nested Templates
- If we have nested templates, we need clone each of the parent and descendant templates to make it work.

Example:
```html
<!DOCTYPE html>
<html>
  <head>
    <template id="header">
      <div>header</div>
      <template id="body">
        <div>body</div>
      </template>
    </template>
  </head>
  <body>
      <script>
          var template = document.querySelector("#header");
          var clone = document.importNode(template.content, true);
          document.body.appendChild(clone);

          var template = document.querySelector("#body");
          var clone = document.importNode(template.content, true);
          document.body.appendChild(clone);
      </script>
  </body>
</html>
```

# 3 Custom Elements
## Intro
- Custom Elements can make custom element like native element

It has following characteristics:
1. Descriptive: you don't need `div` for everything, so that we can achieve concept of semantic web. Imrpove SEO performance and Enhances accessibility.
2. Speeds up development, aids maintenance

## Core Functionality
Extends custom elements by `is="xxxx"` attribute.

## Registering Custom Elements
```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <pluralsight-comment/>
      <script>
          var PluralsightCommentProto = Object.create(HTMLElement.prototype);
          PluralsightCommentProto.createdCallback = function(){
            this.innerHTML = "<h2>Pluralsight Comment</h2><textarea></textarea></br><input type='submit/>'"
          }

          var PluralsightComment = document.registerElement("pluralsight-comment", {
            prototype: PluralsightCommentProto
          });

      </script>
  </body>
</html>
```

## Instantiating Extended Custom Elements
1. Declare in markup
`<button is="super-button">`
2. Javascript
`var button = document.createElement("button", "super-button");`
3. New operator
`document.body.appendChild(new SuperButton());`

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
  <button is="pluralsight-button"></button>
      <script>
          var Proto = Object.create(HTMLButtonElement.prototype);

          Proto.createdCallback = function(){
            this.innerHTML = "Pluralsight Button";
            this.value = "Default value";
            this.style.color = "orange";
          }

          var PluralsightButton = document.registerElement("pluralsight-button", {
            prototype: Proto,
            extends: "button"
          });
      </script>
  </body>
</html>
```

## Lifecycle Callback Methods
|Method|Called when|
|-|-|
|createdCallback|Instance is created|
|attachedCallback|Instance inserted into DOM|
|detachedCallback|Instance removed from DOM|
|attributedChangedCallback|Attributes are added, removed, or updated|

# 4 Shadow DOM Fundamentals
## Light DOM vs. Shadow DOM
- Light DOM: normal DOM

## Shadow DOM Alternatives
- `<iframe>` tag, embed full html document, html elements have completely seperate context

## Creating Shadow DOM
1. Select shadow host
- Choose a light DOM as the host of shadow DOM
2. Create a shadow root
3. Add elements

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      h1{
        color: red;
      }
    </style>
  </head>
  <body>
  <h1>Hello World from Light DOM</h1>
  <div id="host"></div>
  <template>
    <style>
      h1 {
        color: green;
      }
    </style>
    <h1>Hellow World from the Shadow DOM</h1>
  </template>
  <script>
      var template = document.querySelector("template");
      var host = document.getElementById("host");
      var root = host.createShadowRoot();
      root.appendChild(document.importNode(template.content, true));
  </script>
  </body>
</html>
```

## Shadow Host and Shadow Boundary
A light DOM could be the shadow host, shadow host will contains a Shadow Tree, which includes a shadow root and bunch of shadow DOMs, and this is also context of Shadow Boundary. 

## ShadowRoot DOM Methods
- getElementById()
- getElementsByClassName()
- getElementsByTagName()
- getElementsByTagnameNS()
- querySelector
- querySelectorAll()

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      h1{
        color: red;
      }
    </style>
  </head>
  <body>
  <h1>Hello World from Light DOM</h1>
  <div id="host"></div>
  <template>
    <style>
      h1 {
        color: green;
      }
    </style>
    <h1>Hellow World from the Shadow DOM</h1>
  </template>
  <script>
      var template = document.querySelector("template");
      var host = document.getElementById("host");
      var root = host.createShadowRoot();
      root.appendChild(document.importNode(template.content, true));

      root.querySelector("h1");
  </script>
  </body>
</html>
```

## Javascript is not Encapsulated in Shadow DOM

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
  <div id="host">
    <ul>
      <li>Wilbur</li>
      <li>Alfred</li>
      <li>Mortimer</li>
    </ul>
  </div>
  <template>
    <h1>Bad Cat Names</h1>
    <content id="test"></content>
    <script>
        function sayHi(){
          alert("");
        }
    </script>
  </template>
  <script>
      var host = document.querySelector("#host");
      var root = host.createShadowRoot();
      var template = document.querySelector("template");
      var clone = document.importNode(template.content, true);
      root.appendChild(clone);

      var distributedNodes = root.querySelector("#test").getDistributedNodes();

      var destinationInsertionPoints = document.querySelector("ul").getDestinationInsertionPoints();

      
  </script>
  </body>
</html>
```

# 5 Shadow DOM Insertion Points & Events
Insertion points is achieved by `<content>` tag to invite any targeted Light DOM Elements, which is included within Shadow Host, to be inserted within Shadow DOM.

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
  <comment-form>
    <h1>Tell us what's on your mind!</h1>
    <p class="instructions">Fill out this form</p>
    <p class="footer">Privacy Policy: jargon</p>
  </comment-form>

  <template>
    <fieldset>
      <legend>
        <content select="h1"></content>
      </legend>
      <content select="p.instructions"></content>
      <textarea style="width:400px; height:200px">
      </textarea>
      <br/>
      <input type="submit" value="Submit Comment"/>
      <content select=".footer"></content>
      <content></content>
    </fieldset>
  </template>
  <script>
    var commentProto = document.createObject(HTMLElement.prototype);
    commentProto.createdCallback = function(){
      var template = ducument.querySelector("template");
      var shadow = this.createShadowRoot();
      shadow.appendChild(document.importNode(template.content, true));

      document.registerElement("comment-form", {
        prototype: commentProto
      })
    }
  </script>
  </body>
</html>
```

## Insertion Points vs. Distributed Nodes
- Insertion Points are the `<content>` tags
- Distributed Nodes are the element that are introduced into Shadow DOM

- Distributed nodes are merely displayed at the insertion point. They are not actually inserted into the shadow DOM.
- Any content that are distributed can't be traversed.

```html
<!-- IMPORTANT: createShadowRoot and contains methods are deprecated -->
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <div>
      <h1>Header defined in the light DOM</h1>
    </div>
    <script>
        var root = document.querySelector("div").createShadowRoot();
        root.innerHTML = "<content select="h1"></content>";

        console.log(document.querySelector("h1"));
        console.log(root.querySelector("content").contains("h1")); // false
    </script>
  </body>
</html>
```

