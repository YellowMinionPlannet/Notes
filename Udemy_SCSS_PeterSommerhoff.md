# Variables

```scss
$text-color: #222222;

body {
  font-family: san-serif;
  color: $text-color;
}
```

# Partials

Partials are also SCSS files of their own, but they don't get converted to CSS files. Preprocessor won't create CSS files from Partials.

We can put variables, font, color, sizes in Partials.

Partials file name starts with `_`.

```scss
//_variables.scss
$text-color: #222222;
//other variables...
//...
//...
//...

//main.scss
@imports "variables";
body {
  color: $text-color;
}
```

Here we don't have `_variables.css` created, all the variables will be replaced by preprocessor.

# Mixins

Mixins is reusable styles/code that behave like code placeholder.

```scss
//usage of mixin
@mixin warning {
  background-color: orange;
  color: white;
}
.warning-button {
  @include warning;
}

//shorthanded syntax
@mixin large-text {
  font: {
    size: 22px;
    weight: bold;
  }
  //same as font-size, font-weight
}

//complex mixin
@mixin rounded {
  border-radius: 6px;
}
@mixin box {
  @include rounded;
  border: 1px solid #333;
}

//root-level mixin
@mixin fancy-links {
  a {
    font-style: italic;
    text-decoration: none;
    color: $text-color;
  }
}
@include fancy-links;
```

## Mixin with arguments

```scss
//_mixins.scss

//mixin with arguments
@mixin rounded($radius: 6px) {
  border-radius: $radius;
}
@mixin box($radius 6px, $border: 1px solid #999) {
  @include rounded($radius);
  border: $border;
}

//mixin with variable arguments, multiple same type arguments
@mixin box-shadow($shadow...) {
  box-shadow: $shadow;
  -moz-box-shadow: $shadow;
  -webkit-box-shadow: $shadow;
}

//main.scss
#header {
  @include box(8px, 1px solid #999);
  @include box-shadow(2px 0px 4px #999, 1px 1px 6px $secondary-color);
}
```

## Parsing Content into Mixins

```scss
//_mixins.scss
@mixin apply-to-ie-6 {
  * html {
    @content;
  }
}

//main.scss
@include apply-to-ie-6 {
  body {
    font-size: 125%;
  }
}

//main.css
* html body {
  font-size: 125%;
}
```

# Imports

- using `@import` to import font from internet.

```scss
//_mixin.scss
@mixin google-font($font) {
  $font: unquote($font);
  @import url(https://fonts.googleapis.com/css?family=#{$font});
}

//main.scss
@include google-font("Alegreya+Sans");
```

# Media Queries

- Normal Media Queries in CSS

```scss
#main {
  @media only screen and (max-width: 960px) {
    width: auto;
  }
}
```

- Media Queries using Mixin

```scss
//_mixin.scss
@mixin medium-screens() {
  @media only screen and (max-width: 680px) {
    @content;
  }
}

//main.scss
@include medium-screens {
  width: auto;
}
```

# SASS interactive shell

```
>>sass --interactive
>> 3px + 4px
>> 7px
```

# Functions

```scss
//_functions.scss
@function sum($left: 1, $right) {
  @return $left + $right;
}

@function em($pixels, $context: 16px) {
  @return ($pixels / $context) * 1em;
}

@function strip-unit($value) {
  @return $value / ($value * 0 + 1);
}

//main.scss
body {
  font-size: em(18px);
}
```

# Inheritance

`%` is called placeholder selector, the code under this selector will not be included within final CSS file.

```scss
//main.scss

%someClass {
  font-size: 10px;
}

body {
  @extend %someClass;
}
```
