# Section 8: A Quick Introduction to CSS Grid Layouts
## Why CSS Grid: A Whole New Mindset
### Grid Properties Overview
* Container
    * grid-template
        * grid-template-rows
        * grid-template-columns
        * grid-template-areas
    * grid-gap
        * grid-row-gap
        * grid-column-gap
    * ...
        * justify-items
        * align-items
        * justify-content
        * align-content
    * ...
        * grid-auto-rows
        * grid-auto-columns
        * grid-auto-flow
* Item
    * grid-area
        * grid-row
            * grid-row-start
            * grid-row-end
        * grid-column
            * grid-column-start
            * grid-column-end
    * ...
        * ...
            * justify-self
            * align-self
    * ...
        * ...
            * order


```html
<div class="contianer">
    <div class="item itme--1">Orange</div>
    <div class="item itme--2">Green</div>
    <div class="item itme--3">Violet</div>
    <div class="item itme--4">Pink</div>
    <div class="item itme--5">Blue</div>
    <div class="item itme--6">Brown</div>
</div>
```

```css
.container{
    background-color: #eee;
    width: 1000px;
    margin: 30px auto;

    display: grid;
    grid-template-rows: repeat(2, 150px);
    /* we have 150px 150px with repeat function*/
    grid-template-columns: 50% 150px 1fr;
    /*now the 6 divs are positioned in 2 rows and 3 cols*/
    /*1fr represents all units space left*/
    grid-row-gap: 30px;
    /*now we have gap between rows*/
    grid-column-gap: 30px;
    /*now we have gap among columns*/
}

.item{
    padding: 20px;
    font-size: 30px;
    font-family: sans-serif;
    color: white;

    &--1{
        background-color: orangered;
        grid-row-start: 2;
        grid-row-end: 3;
        /*Orange will move to the second row and first column*/
        grid-column-start: 2;
        grid-column-end: 3;
        /*Now Orange will move to the second col*/
    }
     &--2{
        background-color: yellowgreen;
        grid-row: 2/3;
        grid-column: 2/4;
        /*It will span 2 columns, the sixth div will be in new line and creating a implicit grid*/
    }
     &--3{
        background-color: blueviolet;
        grid-column: 2/-1;
        /*we have column from line 2 to the end*/
    }
     &--4{
        background-color: palevioletred;
    }
     &--5{
        background-color: royalblue;
        grid-row: 1/2;
        grid-column: 3/4;
        /*Green will move to first row and third col*/
        grid-area: 1/3/2/4;
        /*this will be the same as last 2 lines, it follows pattern of row-start/col-start/row-end/col-end*/
    }
     &--6{
        background-color: goldenrod;
        grid-column: 1 / span 3;
        /*it starts at line 1 and span 3 cols*/
    }
}

```

> Remember that percentage in grid does not consider the gap, however fr units will consider gap in.

## Spanning Grid Items

> When grid cells are positioned in the same cells the later will hide the previous one.

## Naming Grid Lines

```html
<div className="challenge">
    <div className="smallBox">

    </div>
    <div className="smallBox">

    </div>
    <div className="smallBox">

    </div>
    <div className="mainContent"></div>
    <div className="sideBar"></div>
    <div className="footer">
</div>
```
We can name the grid lines by using grid-template-rows and grid-template-columns properties, we name it at the sides of row heights and column widths.
```css
.challenge{
    width: 1000px;
    margin: 30px auto;

    display: grid;
    grid-template-rows: [header-start] 100px [header-end box-start] 200px [box-end main-start] 400px [main-end footer-start] 100px [footer-end];
    grid-template-columns: repeat(3, [col-start] 1fr [col-end]) 200px [grid-end];
    grid-gap: 30px;

    & > * {
        background-color: orangered;
        padding: 20px;
        color: white;
    }

    .header{
        grid-column: col-start 1/ grid-end;/* repeat will add number after line name*/
    }

    .sideBar{
        grid-column: col-start 3 / grid-end;
        grid-row: box-start / main-end;
    }

    .main-content{
        grid-column: col-start 1 / col-end 3;
    }

    .footer{
        grid-column: col-start 1 / grid-end;
    }
}
```

## Naming Grid Areas
Instead of naming the grid lines, we can also name grid areas.

```html
<div className="challenge">
    <div className="smallbox-1">

    </div>
    <div className="smallbox-2">

    </div>
    <div className="smallbox-3">

    </div>
    <div className="maincontent"></div>
    <div className="sidebar"></div>
    <div className="footer">
</div>
```
```css
.challenge{
    width: 1000px;
    margin: 30px auto;

    display: grid;
    grid-template-rows: 100px 200px 400px 100px;
    grid-template-columns: repeat(3, 1fr) 200px;
    grid-gap: 30px;

    grid-template-areas: "head head head head"
                        "box-1 box-2 box-3 side"
                        "main main main side"
                        "foot foot foot foot";

    & > * {
        background-color: orangered;
        padding: 20px;
        color: white;
    }

    .header{
        grid-area: head;
    }

    .sidebar{
        grid-area: side;
    }

    .maincontent{
        grid-area: main;
    }

    .footer{
        grid-area: foot;
    }

    .smallbox-1{
        grid-area: box-1;
    }

    .smallbox-2{
        grid-area：box-2;
    }

    .smallbox-3{
        grid-area: box-3;
    }
}
```

## Implicit Grid vs. Explicit Grid

```html
<div class="container">
    <div class="item item--1">Modern</div>
    <div class="item item--2">CSS</div>
    <div class="item item--3">with</div>
    <div class="item item--4">Flexbox</div>
    <div class="item item--5">and</div>
    <div class="item item--6">Grid</div>
    <div class="item item--7">is</div>
    <div class="item item--8">great</div>
</div>
```

```css
.container{
    width: 1000px;
    margin: 30px auto;
    background-color: #ddd;

    display: grid;
    grid-template-rows: repeat(2, 150px);
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 30px;

    grid-auto-rows: 80px; /*implicit grids are defined as row height of 80px*/

    grid-auto-columns: .5fr; /*Not work if we set grid-auto-flow to row*/

    grid-auto-flow: column; /*then implicit grids are added as columns*/

    align-items: center; /*align items by vertical axis*/
    justify-items: center; /*align items by horizontal axis*/
    .item{
        padding: 20px;
        color: white;
        font-family: sans-serif;
        font-size: 30px;
        background-color: orangered;
    }

    &--4{
        background-color: crimson;
        grid-row: 2 / span 3;
        align-self: start; /* overwrite align-items*/
        justify-self: start: /* overwrite justify-itemss*/
    }
}
```

First 2 rows and 2 columns in this sample is defined in the css. So it's called explicit grids.

The rest grid areas are called implicit grids;

## Align grid items
