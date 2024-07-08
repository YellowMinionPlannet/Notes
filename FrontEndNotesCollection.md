# about Box Model
## `box-sizing` property
it has two values:
- `content-box`
- `border-box`

## `height` property
- If we have `box-sizing: content-box`, which is default, we have height of content "real" height. That is the height of content only(without paddings and borders).
- If we have `box-sizing: border-box`, we have height of box-model excluding margin. That is content "real" height + paddings + borders.

# about different `height` properties
## Layout Viewport vs. Visual Viewport
- Layout Viewport: the browser's area that draws the web page.
- Visual Viewport: the visible part of browser's layout viewport.
eg. using mobile device, we can pinch to zoom in and zoom out. When we zomm in or zoom out, the layout viewport does not change, but the visual viewport changes accordingly.

## `height` properties
- `innerHeight`, which is a property of `window` object. It is the "layout viewport" of the browser. So if scroll bar is available, the scroll bar is included.

- `outerHeight`, which is a property of `window` object. It is the "layout viewport" plus the sidebar, menus, window chrome, and window resizing borders/handles.

- `scrollY`, which is a property of `window` object. It is the distance from the beginning of the web page, no matter it's out of current viewport or inside, to the top of the visible viewport. So we don't scroll, `scrollY` is 0.

- `pageYOffset`, which is a property of `window` object. It is the alias of `scrollY` and works perfectly on IE browsers and other browsers. Same as `document.documentElement.scrollTop` of the IE8.

- `scrollHeight`, which is a property of `element` obejct. It is the visible and unvisible total height of a element. `documentElement.scrollHeight` is usually larger than the `window.innerHeight` because you can scroll down. This value includes content "real" height and paddings. But it excludes borders, margins and scrollbars. It also includes pseudo-elements size.

- `clientHeight`, which is a property of `element` object. It is the content "real" height and the paddings. It excludes scroll bars.

# about `console.log` vs. `console.dir`
with `console.log`, you can print a list of objects or a list of strings.
- list of objects will appear as the order of they are inputed
- `console.log` will log the reference of the object
Example:
```js
var object = {};
console.log(object);// when we open the console, the prop valued 1234 will be included within that object, but propDelay will not appear even it's 10 seconds passed. But propDelay will appear when you revisit the object.
object.prop = "1234";

setTimeout(() => {
  object.propDelay = "10 seconds";
  console.log("10 seconds passed"); // print out after 10 seconds
}, 10000);

// Way of retrieving object at the console.log moment
console.log(JSON.parse(JSON.stringify(object)));
```

with `console.dir`, you can print out properties of an object, it also accept a option object as second arguments.
|Table of option object|colors|depth|showHidden|
|-|-|-|-|
|**Defaults**|true|2|false|
|**Descriptions**|Style the properties according to their type|Number of levels to print|wheather to print non-enumerable and symbol properties|

# about Cascade, Inheritance etc. in CSS
## Cascade
- The cascade is an algorithm that defines how user agents combine property values originating from different sources.
- So when there is more than one values set for a property from different *origin*, *cascade layer*, or *`@scope` block*, this cascade algorithm gonna decide which has the most precedence.

### Origin
There are *User-agent stylesheets*, *Author stylesheets*, *User stylesheets*.

#### User-agent stylesheets
- It is stylesheet/initial code included within browser, usually you can't configure this kind of stylesheet.
- Developer usually will have normalize.css to normalize property values to a "normal"/"common" state.
- Unless using `!important`, User-agent stylesheet is overriden by author styles, including a reset stylesheet, regardless of the specificity of the selector.

#### Author stylesheets
- linked/ imported stylesheets, `<style>` block, and inline style with `style=""` attribute.

#### User stylesheets
- other styles that can be configured directly or added by browser extentions.

### Cascade layers
- Cascade order is based on origin types, and the precedence of which is described in last section.
- Within origin type, the precedence is based on the declaration order of cascade layers
- Cascade layers could be declared using `layer`, `layer()`, or `@layer`
- Styles could be placed into the specified named layer, or into an anonymous layer if no name is provided. If styles are placed outside of a layer, they are treated as being part of an anonymous last declared layer.

#### `layer()` and `@layer`
- `layer()` is used for `@import`
```css
@import url(theme.css) layer(default);
@layer default{
  audio[controls]{
    display: block;
  }
}
```

- `@layer`
```css
@layer module, state;
@layer state{
  .alert{
    background-color: brown;
  }
  p{
    border: medium solid limegreen;
  }
}

@layer module{
  .alert{
    border: medium solid violet;
    background-color: yellow;
    color: white;
  }
}
```
- All styles declared outside of a layer will override styles declared in a layer, regardless of specificity.

##### 3 ways of creating cascade layer with `@layer`
1. Named layer with CSS rules for that layer inside.
```css
  @layer utilities{
    .padding-sm{
      padding: 0.5rem;
    }

    .padding-lg{
      padding: 0.8rem;
    }
  }
```

2. named cascade layer without assigning any styles.
```css
@layer utilities;
@layer theme, layout, utilities;
```
- Last layer to be listed will have top precedence, regardless of specificity.

3. anonymous cascade layer.
```css
@layer{
  p{
    margin-block: 1rem;
  }
}
```
- This anonymous layer is lower than styles declared outside of a layer, the precedence depends on order it was declared.

##### Nested Layers
```css
@layer framework{
  @layer layout{

  }
}

@layer framework.layout{
  p {
    margin-block: 1rem;
  }
}
```

### Cascading order
Steps of how the algorithm works:
1. Relevance: first filter out all rules that apply to a given element
2. Origin and importance: First is importance then the orgin type precedence
3. Specificity: if rules fall in same origin, then highest specificity wins.
4. Scoping proximity: same origin and same specificity, the property value within scoped rules with the smallest number of hops up the DOM hierarchy to hte scope root wins.
5. Order of apperance: if all the last 4 rules cannot decide a winner, the last declaration in the style order is applied.

#### Specificity
It is an algorithm to calculate weight of selector, the higher wins.

##### Selector weight categories
1. ID column
  - only ID selectors
2. CLASS column
  - class selectors, attribute selectors and pseudo-classes 
3. TYPE column
  - type selectors, like `p`, `h1`, and pseudo-elements, like `::before` and other double-colon notation.
4. No value
  - The universal selector `*` and pseudo-class `:where()` and its parameters aren't counted.
  - Combinators, like `+`, `>`, `~` and `||` does not add value
  - `&` nesting combinator does not add weight, but nested rules do, and also, `:is()`, `:has()`, `:not()` parameters do add values.

  For example:
  ```css
    [type="password"]           /*0-1-0*/
    input:focus                 /*0-1-1*/
    :root #myApp input:required /*1-2-1*/

    [type="password"],           
    input:focus,
    :root #myApp input:required{
      color: blue;
    }
  ```
  - With above css stylesheet, `color: blue` has specificity of 1-2-1, since the last comma separated selector has this highest specificity which will represents the whole rule.

  Examples:
  ```css
    #myElement {
    color: green; /* 1-0-0  - WINS!! */
    }
    .bodyClass .sectionClass .parentClass [id="myElement"] {
      color: yellow; /* 0-4-0 */
    }

    #myElement {
      color: yellow; /* 1-0-0 */
    }
    #myApp [id="myElement"] {
      color: green; /* 1-1-0  - WINS!! */
    }

    :root input {
      color: green; /* 0-1-1 - WINS because CLASS column is greater */
    }
    html body main input {
      color: yellow; /* 0-0-4 */
    }

    input.myClass {
      color: yellow; /* 0-1-1 */
    }
    :root input {
      color: green; /* 0-1-1 WINS because it comes later */
    }

    p {
      /* 0-0-1 */
    }
    :is(p) {
      /* 0-0-1 */
    }

    h2:nth-last-of-type(n + 2) {
      /* 0-1-1 */
    }
    h2:has(~ h2) {
      /* 0-0-2 */
    }

    div.outer p {
      /* 0-1-2 */
    }
    div:not(.inner) p {
      /* 0-1-2 */
    }

    :is(p, #fakeId) {
      /* 1-0-0 */
    }
    h1:has(+ h2, > #fakeId) {
      /* 1-0-1 */
    }
    p:not(#fakeId) {
      /* 1-0-1 */
    }
    div:not(.inner, #fakeId) p {
      /* 1-0-2 */
    }

    #fakeId {
      span {
        /* 1-0-1 */
      }
    }

    a:not(#fakeId#fakeId#fakeID) {
      color: blue; /* 3-0-1 */
    }

    :where(#defaultTheme) a {
      /* 0-0-1 */
      color: red;
    }
    
    @scope (.article-body) {
      /* img has a specificity of 0-0-1, as expected */
      img { ... }
    }
    
    @scope (.article-body) {
      /* :scope img has a specificity of 0-1-0 + 0-0-1 = 0-1-1 */
      :scope img { ... }
    }

    @scope (figure, #primary) {
      & img { ... }
    }
    /*
    equivalent to :is(figure, #primary) img
    */
    /*1-0-0for @scope(#primary), 0-0-1 for img, so 1-0-1 in total*/
  ```
## about `@scope`
 `@scope` enable developer to select elements in a specific DOM subtrees. If we do not use `@scope`, the specificity would be too high to override, and selectors would be coupling.

### Syntax
 ```css
@scope (scope root) to (scope limit){
  rulesets
}
 ```

#### A example
```html
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <article class="feature">
          <section class="article-hero">
          </section>
          <section class="article-body">
            <h3></h3>
            <p></p>
            <img/>
            <p></p>
            <figure>
              <img/>
              <figcaption>
            </figure>
          </section>
          <footer>
            <p></p>
            <img/>
          </footer>
        </article>
    </body>
</html>
```
- if we want to select `<img>` element inside `<section>` with a class of `.article-body`, we have selector `.feature > .article-body > img`.
- if we use `@scope`, and we want to select `<img/>` within `section.article-hero` and is not contained within `<figure>`, we can have:
```css
@scope (.article-body) to (figure){
  img{
    border: 5px solid black;
    background-color: goldenrod;
  }
}
```

## `:scope` pseudo-class

We use `:scope` within a `@scope` to select the root.

# about JS modules
> TBC: see book notes of Chapter 23

# about CSS Text
CSS could control line breaking, justification and alignment.CSS text has following properties:

|Properties|Summary|
|-|-|
|hanging-punctuation|only Safari|
|hyphenate-limit-chars|set min chars to allow hyphen and min chars allowed for two broken lines|
|hyphens|set hyphen rules with `&shy`|
|letter-spacing|horizontal spacing|
|line-break|only for Chinese, Japanese, Korean, set spacing rules for line break related to `<br/>` and punctuation related line break|
|overflow-wrap||
|tab-size||
|text-align||
|text-align-last||
|text-indent||
|text-justify||
|text-size-adjust||
|text-transform||
|text-wrap||
|white-space||
|white-space-collapse||
|word-break||
|word-spacing||


# about *line box*
Source of knowlege: [w3c_inline_formatting](https://www.w3.org/TR/CSS2/visuren.html#inline-formatting)

# about Inheritance
- If a css property `inherited` is `yes` on MDN property's `formal definition` section, then the property will be set to parent element's `computed value` for default.
- Computed value is calculated from specified value by
  1. handle special values
  2. doing computations, which could be defined in property's `formal definition` section, `computed value` line.
  
- Specified value is following precedence of 
  1. document style sheet value
  2. parent's value
  3. initial value.

