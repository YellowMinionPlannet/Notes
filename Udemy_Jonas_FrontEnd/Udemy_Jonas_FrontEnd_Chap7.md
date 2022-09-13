# Section 7: Trillo Project - Master Flexbox
## Why Flexbox: An Overview of the Philosophy Behind Flexbox
### Flexbox Properties Overview
* Container properties:
    * flex-direction: to define the direction of main axis (row | row-reverse | column | column reverse)
    * flex-wrap: to define if the item should be wrap in to new line or not if there's not enough space in container (nowrap | wrap | wrap-reverse)
    * justify-content: to define how to adjust items in main axis (flex-start | flex-end | center | space-between | space-around | space-evenly)
    * align-items: to define how to adjust itmes in cross axis (stretch | flex-start | flex-end | center | baseline)
    * align-content: to define only when there's more than one row of items, it controls rows align to cross axis(stretch | flex-start | flex-end | center | space-between | space-around)
* Item properties:
    * align-self: align-items for individual flex item (auto | stretch | flex-start | flex-end | center | baseline)
    * order: item's order (<integer>)
    * flex-grow： 0 | <integer>
    * flex-shrink: 1 | <integer>
    * flex-basis: auto | <length>
    * flex: flex-grow flex-shrink flex-basis 

## A Basic INtro to Flexbox: The Flex Container
```html 
<div class="container">
    <div class="item">1</div>
    <div class="item i2">2</div>
    <div class="item">3</div>
    <div class="item i4">4</div>
    <div class="item">5</div>
    <div class="item">6</div>    
</div>
```
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.container{
    background-color: #ccc;
    padding: 10px;

    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
    align-content: center;
}

.item{
    background-color: #f1425d;
    padding: 30px;
    margin: 30px;
    color: #fff;
    font-size: 40px;
}
```

## A Basic Intro to Flexbox: Flex Items

```html 
<div class="container">
    <div class="item">1</div>
    <div class="item i2">2</div>
    <div class="item">3</div>
    <div class="item i4">4</div>
    <div class="item">5</div>
    <div class="item">6</div>    
</div>
```
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.container{
    background-color: #ccc;
    padding: 10px;

    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
    align-content: center;
}

.item{
    background-color: #f1425d;
    padding: 30px;
    margin: 30px;
    color: #fff;
    font-size: 40px;

    flex-grow: 1;
    /* occupy all the space they can in main axis */
}

.i4{
    align-self: flex-end; 
    /* position adjustment for cross axis for individual item */
    order: -1; 
    /* will make i4 to the first item, since -1 is less than default 0 which is for other undefined items */
    flex-grow: 2;
    /* make this specific item 2 times of other items which is defined to 1 */
    /* if other item is 0, and only i4 is 1, then i4 take as long as possible and other items will be devided evenly and take the rest space */
    flex-basis: 20%;
    /* it set the min-width of the individual item, it only decrease when there's no space for the entire container */
    flex-shrink: 0;
    /* default is 1, if it's 0 it does not allow individual item to shrink */
}
```

## A Basic Intro to Flexbox: Adding More Flex Items
```html 
<div class="container">
    <div class="item">1</div>
    <div class="item i2">2</div>
    <div class="item">3</div>
    <div class="item i4">4</div>
    <div class="item">5</div>
    <div class="item">6</div> 
    <div class="item">7</div>
    <div class="item i8">8</div>
    <div class="item">9</div>
    <div class="item i10">10</div>
    <div class="item">11</div>
    <div class="item">12</div>     
</div>
```
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.container{
    background-color: #ccc;
    padding: 10px;

    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
    align-content: flex-start;
    /* align-content will adjust rows (if flex-direction is row) towards the cross axis */
    flex-wrap: wrap;
}

.item{
    background-color: #f1425d;
    padding: 30px;
    margin: 30px;
    color: #fff;
    font-size: 40px;

    flex-grow: 1;
    /* occupy all the space they can in main axis */
}
```