# Section 4: INtroduction to Sass and NPM
## What is Sass?
### Main Sass Features
* **Variables**: resusable values
* **Nesting**: nest selectors
* **Operators**: mathematical operations
* **Partials and imports** to write CSS in different files and importing them
* **Mixins**: to write reusable pieces of CSS code
* **Functions**: similar to mixins, but produce a value then can be reused
* **Extends**: make different selectors inherit declarations that are common to all of them
* **Control directives**: writing conditionals and loops

### Two syntax of Sass
Sass syntax

```scss
.navigation
    list-style: none;
    float: left;

    & li
        display: inline-block;
        margin-left: 30px;
```

SCSS Syntax

```scss
.naviation{
    list-style:none;
    float: left;
    & li{
        display: inline-block;
        margin-left: 30px;
    }
}
```

### sample code

```html
<nav>
    <ul class="navigation">
        <li><a href="#">About us</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Contact us</a></li>
    </ul>
    <div class="button">
        <a class="btn-main" href="#">Sign up</a>
        <a class="btn-hot" href="#">Get a quote</a>
    </div>
</nav>
```

```scss
* {
  margin: 0;
  padding: 0;
}
$color-primary: #f9ed69;
$color-secondary: #f08a5d;
$color-tertiary: #b83b5e;
$color-text-dark: #333;
$color-text-light: #eee;
$width-button: 150px;

nav {
  margin: 30px;
  background-color: $color-primary;
  &::after {
    content: "";
    clear: both;
    display: table;
  }
}

.navigation {
  list-style: none;
  float: left;

  li {
    display: inline-block;
    margin-left: 30px;
    &:first-child {
      // & write current selector
      margin: 0;
    }

    a:link {
      text-decoration: none;
      text-transform: uppercase;
      color: $color-text-dark;
    }
  }
}

.button {
  float: right;
}

.btn-main:link,
.btn-hot:link {
  padding: 10px;
  diplay: inline-block;
  text-align: center;
  border-radius: 100px;
  text-decoration: none;
  text-transform: uppercase;
  width: $width-button;
  color: $color-text-light;
}

.btn-main {
  &:link {
    background-color: $color-secondary;
  }
  &:hover {
    background-color: darken($color-secondary, 15%);
  }
}


.btn-hot {
  &:link {
    background-color: $color-tertiary;
  }
  &:hover {
    background-color: lighten($color-tertiary, 10%);
  }
}
```

## First Steps with Sass: Mixins, Extends and Functions
```scss
* {
  margin: 0;
  padding: 0;
}
$color-primary: #f9ed69;
$color-secondary: #f08a5d;
$color-tertiary: #b83b5e;
$color-text-dark: #333;
$color-text-light: #eee;
$width-button: 150px;

@mixin clearfix{
  &::after {
    content: "";
    clear: both;
    display: table;
  }
}

@mixin style-link-text($color) {
      text-decoration: none;
      text-transform: uppercase;
      color: $color;
}

@function divide($a , $b){
  @return $a / $b;
}

nav {
  margin: divide(60, 2) * 1px;
  background-color: $color-primary;
  @include clearfix;
}

.navigation {
  list-style: none;
  float: left;

  li {
    display: inline-block;
    margin-left: 30px;
    &:first-child {
      // & write current selector
      margin: 0;
    }

    a:link {
      @include style-link-text($color-text-dark)
    }
  }
}

.button {
  float: right;
}

%btn-placeholder{
  padding: 10px;
  diplay: inline-block;
  text-align: center;
  border-radius: 100px;
  @include style-link-text($color-text-light);
  width: $width-button;
}

.btn-main {
  &:link {
    @extend %btn-placeholder;
    background-color: $color-secondary;
  }
  &:hover {
    background-color: darken($color-secondary, 15%);
  }
}


.btn-hot {
  &:link {
    @extend %btn-placeholder;
    background-color: $color-tertiary;
  }
  &:hover {
    background-color: lighten($color-tertiary, 10%);
  }
}
···

Mixin and Placeholder are different, Mixin simply replace the code to the targeted place in compiled code. Placeholder actually abstract code out of the target place and group them into a new code block in the compiled code.
https://codepen.io/YellowMinions/pen/PoRXMVL?editors=0110