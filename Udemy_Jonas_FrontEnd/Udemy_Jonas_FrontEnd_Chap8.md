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