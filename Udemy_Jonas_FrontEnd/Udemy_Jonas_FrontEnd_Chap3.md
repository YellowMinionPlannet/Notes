# Section 3: How CSS Works: A Look Behind the Scene
## How CSS Works, Part 1: Cascade and Specificity
Sources for CSS:
* Author(developer's code)
* User(user's code in Browser)
* Browser(user agent, eg. chrome or edge, firefox etc.)

Importance for CSS (Priority from highest to lowest):
* User's `!important`
* Author's `!important`
* Author
* User
* Browser

Specificity for CSS
1. Inline style
2. Ids
3. Classes pseudo-classes attribute
4. Element pseudo-element
```css
.button{

}/*Specificity value: (0,0,1,0): (inline, Ids, classes, element))*/

nav#nav div.pull-right .button{

}/*Specificity value: (0,1,2,2)*/

a{

}/*(0,0,0,1)*/

#nav a.button:hover{

}/*(0,1,2,1)*/

/*So at the end (0,1,2,2) wins, because it's more specific*/
```
Source Order:
The last CSS declaration locate in the source code wins

Cascade means when CSS is parsed, it must solve conflict against css declarations from different sources. It follows the rule like the following:
Importance > Specificity > Source Order

> **Conventions:**
> * `!important` has highest priority, be careful
> * Inline style has priority over external stylesheets, be careful
> * IDs is more specific than classes, classes is more specific than element
> * universal selector `* {}` has no specificity value (0,0,0,0)
> * code rely more on specificity
> * 3rd-party stylesheets more rely on source order

## How CSS is Parsed, Part2: Value Processing

For example, we have following code
```html
<div class="section">
    <p class="amazing"> CSS is absolutely amazing</p>
</div>
```

```css
.section{
    font-size: 1.5rem;
    width: 280px;
    background-color: orangered;
}
p {
    width: 140px;
    background-color: green;
}
.amazing{
    width: 66%
}
```
The value will be processed into 6 steps:
1. Declared Value
2. Cascaded Value
3. Specified Value (default value, if there's no cascaded value)
4. Computed Value(Converting relative value to absolute)
5. Used value (final calculations based on layout)
6. Actual Value(browser or device restricting)

|steps\code|width(paragraph)|padding(paragraph)|font-size(root)|font-size(section)|font-size(paragraph|
|-|-|-|-|-|-|
|1. Declared Value|140px/66%|-|-|1.5rem|-|
|2. Cascaded Value|66%|-|16px(Browser default)|1.5rem|-|
|3. Specified Value|66%|0px(initial)|16px|1.5rem|24px(inherited)|
|4. Computed Value|66%|0px|16px|1.5*16px = 24px|24px|
|5. Used Value|66%*280px=184.8px|0px|16px|24px|24px|
|6. Actual Value|185px|0px|16px|24px|24px|


### How Units Are Converted From Relative To Absolute
For example, we have following code:
```html
<!DOCTYPE>
<html>
    <body>
        <div class="header">
            <div class="header-child">
            </div>
        </div>
    </body>
</html>
```
```css
html, body{
    font-size: 16px;
    width: 80vw;
}
.header{
    font-size: 150%;
    padding: 2em;
    margin-bottom: 10rem;
    height: 90vh;
    width: 1000px;
}
.header-child{
    font-size: 3em;
    padding: 10%
}
```
|code\steps|example|how to convert to pixels| result in pixels|
|-|-|-|-|
|% font|font-size: 150%|150% * parent computed font-size| 24px|
|% length|padding: 10%|10% * parent computed width| 100px|
|em font|font-size:3em| 3 * parent computed font-size| 72px|
|em length|padding: 2em| 2 * **current element** computed font-size|48px|
|rem|font-size/padding: 10rem| 10 * root computed font-size| 160px|
|vh|90vh| 90% viewport height||
|vw|80vw| 80& viewport width||

## How CSS is Parsed, Part3: Inheritance

```css
.parent{
    font-size: 20px;
    line-height: 150%;
}

.child{
    font-size:25px;
}
```

font-size is the key element for percentage, and em. if current element has font-size, then computed value is current element relative to the percentage and em. if current element does not have font-size, then go to parent or parent's parent until find font-size.

