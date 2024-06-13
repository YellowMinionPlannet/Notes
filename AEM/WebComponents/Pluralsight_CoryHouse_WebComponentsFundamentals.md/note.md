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