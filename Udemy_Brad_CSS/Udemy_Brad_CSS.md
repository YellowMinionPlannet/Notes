# Section 3: CSS Basics
## Fonts in CSS
px = 1/96 inch
pt = 1/72 inch
1 inch = 2.54 cm
px = 1/38 cm
pt = 1/28 cm

1.2 rem = root element font-size * 1.2
1.2 em = parent(1 generation) element font-size * 1.2

## Box Model, Margin & Padding
```css
/*Global Reset*/
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```
## Float & Alignment
* We can do horizontal center by using text-align and margin auto
* to do vertical align without flex, we can use padding
* we can use line-height/ padding to stretch out the line height

```html
<!DOCTYPE html>
<html>
<head>
<style>

* {
      box-sizing: border-box;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.4em;
    }
    .container {
      max-width: 960px;
      margin: 30px auto;
    }

/*NOTE: Important to clear float effect after float divs*/
.clr {
    clear:both;
}

.box {
      background: #f4f4f4;
      border: 1px solid #333;
      padding: 20px;
      margin-bottom: 15px;
    }
    .box p {
      /* Text Align */
      text-align: left;
      text-align: right;
      text-align: center;
      text-align: justify;
    }
    #box-2 {
      float: left;
      width: 68%;
    }
    #box-3 {
      float: right;
      width: 30%;
    }
</style>
</head>
<body>

<div class="container">
    <div id="box-1" class="box">
      <h3>Heading</h3>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolor, soluta esse voluptas aliquam eligendi veritatis illo impedit minus unde.</p>
    </div>
    <div id="box-2" class="box">
      <h3>Heading</h3>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolor, soluta esse voluptas aliquam eligendi veritatis illo impedit minus unde.</p>
    </div>
    <div id="box-3" class="box">
      <h3>Heading</h3>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolor, soluta esse voluptas aliquam eligendi veritatis illo impedit minus unde.</p>
    </div>
    <div class="clr"></div>
    <div id="box-4" class="box">
      <h3>Heading</h3>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolor, soluta esse voluptas aliquam eligendi veritatis illo impedit minus unde.</p>
    </div>
  </div>
</body>
</html>

```

## Navigation Menu Styling

To display what's covered by floated element, use overflow hidden on the parent element.

* Method 1:
```css
ul {
    /*NOTE: How we display background which is covered by floated li*/
    overflow: auto;/*Or hidden*/
    float: right;
}
li{
    float: left;
}
```
* Method 2:
```css
li{
display: inline;
}
```
## Inline, Block & Inline-Block Display
Usually image is inline, margin:auto does not work if you want to center it.
```css
img{
    display: block;
    margin: auto;
}

```

width property does not work on inline, but inline-block will work.
```css
div {
    display: inline-block;
    width: 32.8%;
}
```

## Positioning
|Value|Description|
|-|-|
|Static|Not effected by tblr(top, bottom, left, right) properties/values|
|Relative|tblr values cause element to be moved from its normal position|
|Absolute|Positioned relative to its parent element that is positioned "relative"|
|Fixed|Positioned relative to the viewport|
|Sticky|Positioned based on scroll position|

# Section 5: Intro To Responsive Layouts

## Media Queries
* max-width == 500px is true then background is red
* min-width == 501 and max-width == 768px are true then background is blue
* other than that background is black
```css
body{
    background: black;
}

@media(max-width: 500px){
body{ background: red;}
}

@media(min-width: 501px) and (max-width: 768px){
    body{
        background: blue;
    }
}
```

## Em vs Rem Units
em is not used often. It will calculate the font-size of it's own element, if not specific, go to parent or parent's parent and then reach the html root element.

We use rem because it does not have nest rules and more friendly to the accessibility feature to the browser.

We can also use percent to the font-size of html. 

Default font-size is 16px. If we use 62.5%, then font-size is 10px.

## Vh & Vw Units
NOTE: body element only wrap the content, but is not the entire view port.

Vh = ViewPort Height
Vw = VeiwPort Width

**Concept**
We split viewport, which is the whole browser's display area, into 100 slices in both horizontal and vertical directions.

100vh means the whole height of viewport,
50vh means the 50 slices of viewport,
20vh ...

vh is commonly used for background-color when you want to cover the whole view port. And it works very responsively 'cause when you try to change equipment, 100vh always gives you a full screen.

* Compare to percent
    the height property of body always equals to the content height, not the full screen(viewport) height. So 100% to the height does not give you full screen effect. 
* Compare to fixed value
    the fixed value will not be adaptable for mobile equipment.
    
## Making Hotel Website Fully Responsive
**Concept**
use link element's media attribute to specify
```css
<link rel="stylesheet" media="screen and (max-width:768px)" type="text/css" href="./somecssfolder/somecssfile.css"/>
```
# Section 6: Intro To Flexbox
## What is Flexbox?
What is Flexbox? Why using it?
* Modern layout mode in CSS3
* "flex" is a value for the display property
* Replaces floats and is much more elegant to work with
* Aligns items both horizontal(row) and vertical (column)
* Flex items can be re-ordered via CSS

![Udemy_Brad_CSS_1.png](Udemy_Brad_CSS_1.png?raw=true)

* display: flex - Creates a "flex container"
* All direct child elements are "flex items"
* justify-content: Align along the main aixis(hotizontal)
* align-items: Align items along the cross axis(vertical)
* align-content: Align when extra space in cross axis

## Flexbox Basis
```css
.itemparent{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.item1{
    flex-shrink: 0; // 打死不缩小，只能放大
}

.item2{
    flex-grow: 1;
}

.item3{
    flex-grow: 1; //在main axis中的比例为 1：2
    
    flex-basis: 0;//从零开始就有比例了
}
```

# Section 11: CSS Grid
## What is CSS Grid?
* It allow developer to set up 2 dimensional layout where flex box is able to set up 1 dimensional layout.

## Grid Basics & Columns
```html
<style>
    .grid{
        display: grid;
        grid-template-columns: 200px 200px 200px;
        grid-template-columns: 1fr 2fr 1fr;
        grid-template-columns: repeat(3, 200px);
        grid-gap:1rem;
    }
    .item{
        padding: 3rem;
        border: #ccc 1px solid;
        background: #f4f4f4;
        font-size: 1.3rem;
        font-weight: bold;
        text-align: center;
    }
</style>
<div class="grid">
    <div class="item">item1</div>
    <div class="item">item2</div>
    <div class="item">item3</div>
    <div class="item">item4</div>
</div>
```

## Grid Rows
```html
<style>
.grid{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 1fr 2fr 3fr;
    }
    .item{
        padding: 3rem;
        border: #ccc 1px solid;
        background: #f4f4f4;
        font-size: 1.3rem;
        font-weight: bold;
        text-align: center;
    }
</style>
<div class="grid">
    <div class="item">item1</div>
    <div class="item">item2</div>
    <div class="item">item3</div>
    <div class="item">item4</div>
</div>
```

## Spanning Columns & Rows
```html
<style>
.grid{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: 1fr 2fr 3fr 1fr;
    }
    .item{
        padding: 3rem;
        border: #ccc 1px solid;
        background: #f4f4f4;
        font-size: 1.3rem;
        font-weight: bold;
        text-align: center;
    }
    
    .item:first-child{
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end:3;
        
        grid-column: 1/span 3;
        grid-row: 1/span 2;
    }
    
    .item:nth-child(9){
        grid-column: 1/span 3;
        grid-row: 1/span 2;
    }
</style>
<div class="grid">
    <div class="item">item1</div>
    <div class="item">item2</div>
    <div class="item">item3</div>
    <div class="item">item4</div>
    <div class="item">item5</div>
    <div class="item">item6</div>
    <div class="item">item7</div>
    <div class="item">item8</div>
    <div class="item">item9</div>
    <div class="item">item10</div>
    <div class="item">item11</div>
    <div class="item">item12</div>
    <div class="item">item13</div>
    <div class="item">item14</div>
    <div class="item">item15</div>
    <div class="item">item16</div>
</div>
```

## Auto-Fit & Minmax
```html
<style>
.grid{
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(200px, 1fr));
    }
    .item{
        padding: 3rem;
        border: #ccc 1px solid;
        background: #f4f4f4;
        font-size: 1.3rem;
        font-weight: bold;
        text-align: center;
    }
</style>
<div class="grid">
    <div class="item">item1</div>
    <div class="item">item2</div>
    <div class="item">item3</div>
</div>
```

## Grid Template Areas
```html
<style>
.container {
        display: grid;
        grid-template-areas:
          'header header header header'
          'content content content sidebar'
          'box-1 box-2 box-3 box-4'
          'footer footer footer footer';
        /* grid-template-areas:
          'header header header'
          'content content sidebar'
          'box-1 box-2 box-2'
          'box-3 box-3 box-3'
          'footer footer footer'; */
        grid-gap: 1rem;
      }
      .header,
      .content,
      .sidebar,
      .box-1,
      .box-2,
      .box-3,
      .box-4,
      .footer {
        border: 1px #ccc solid;
        padding: 0.5rem;
      }
      .header {
        grid-area: header;
      }
      .content {
        grid-area: content;
      }
      .sidebar {
        grid-area: sidebar;
      }
      .box-1 {
        grid-area: box-1;
      }
      .box-2 {
        grid-area: box-2;
      }
      .box-3 {
        grid-area: box-3;
      }
      .footer {
        grid-area: footer;
        text-align: center;
      }
</style>
  <body>
    <div class="container">
      <header class="header"><h1>My Website</h1></header>
      <section class="content">
        <h3>Welcome To My Site</h3>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo suscipit
          reprehenderit aperiam repudiandae voluptatibus, expedita ex temporibus
          eos et mollitia velit vel molestias sint dolore at doloremque neque
          minima optio ad tempore quisquam perferendis esse non. Aliquam illum
          doloremque architecto! Rem voluptas at sunt sed enim eius laborum
          dolores quaerat?
        </p>
      </section>
      <aside class="sidebar">
        <h3>Contact Us</h3>
        <ul>
          <li>Some Company</li>
          <li>50 Main st, Boston MA</li>
          <li>something@something.com</li>
          <li>555-555-5555</li>
        </ul>
      </aside>
      <div class="box-1">
        <h3>Heading</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
          quisquam at veritatis a labore quod illo dolorem fugiat quas
          repellendus omnis odio eligendi ab, dolor necessitatibus, saepe
          aliquid quaerat aperiam.
        </p>
      </div>
      <div class="box-2">
        <h3>Heading</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
          quisquam at veritatis a labore quod illo dolorem fugiat quas
          repellendus omnis odio eligendi ab, dolor necessitatibus, saepe
          aliquid quaerat aperiam.
        </p>
      </div>
      <div class="box-3">
        <h3>Heading</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
          quisquam at veritatis a labore quod illo dolorem fugiat quas
          repellendus omnis odio eligendi ab, dolor necessitatibus, saepe
          aliquid quaerat aperiam.
        </p>
      </div>
      <div class="box-4">
        <h3>Heading</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
          quisquam at veritatis a labore quod illo dolorem fugiat quas
          repellendus omnis odio eligendi ab, dolor necessitatibus, saepe
          aliquid quaerat aperiam.
        </p>
      </div>
      <footer class="footer"><p>Copyright &copy; 2019</p></footer>
    </div>
  </body>
</html>
```