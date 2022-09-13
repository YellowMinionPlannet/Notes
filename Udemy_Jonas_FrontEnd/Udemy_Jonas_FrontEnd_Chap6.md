# Section 6: Natours Project - Advanced Responsive Design

## Mobile-First vs. Desktop-First and Breakpoints

### How media query works? *- Max-width and Min-width*
* Desktop-First use Max-width.
For example:
```css
@media (max-width: 600px){
    ...
}
```
Which means media content will applies only for view port width that is less or equal to 600px. media content's max applicable range is up to 600px.
So if we have view port width of a phone is 500px. following two media query will both applies.
```css
@media (max-width: 600px){
    ...
}
@media (max-width: 900px){
    ...
}
```
* Mobile-first use min-width instead.

### Selecting our breakpoints: The options

BAD: simply put fixed width for phone, portrait pad, landscape pad, desktop

GOOD: All used devices, group them to decide break pints.

PERFECT: ignore device, and use design breaks.

This course is for GOOD solutions.
Use
http://gs.statcounter.com/screen-resolution-stats

(Stats for screen sizes used on internet.)

## An Overview of Responsive Image
### Three type of responsive image
* Change of resolution
* Change of resolution density
* Change of art direction

### Change of resolution density and art direction
```html
<img srcset='img/logo-green-1x.png 1x, img/logo-green-2x.png 2x' alt='footer-logo' class='footer-logo'>
<!-- srcset uses comma to seperate low density(1x) and high density(2x), browser will automatically pick which sreen density is used-->

<picture>
    <source srcset="img/logo-green-small-1x.png 1x, img/logo-green-small-2x.png 2x" media="(max-width: 37.5em)">
    <img srcset='img/logo-green-1x.png 1x, img/logo-green-2x.png 2x' alt='footer-logo' class='footer-logo'>
</picture>
<!-- source and img in picture tag will do the art direction change due to the media query specified in media attribute. In this example, when screen size smaller than 37.5em(600px), it will use logo-green-small instead of logo-green, then we do density change by srcset attribute. -->
```

### Change of resolution
```html
<img srcset="img/nat-1.jpg 300w, img/nat-1-larg.jpg 1000w" 
    sizes="(max-width: 900px) 20vw, (max-width: 600px) 30vw, 300px"
    src="img/nat-1-large.jpg"
>
<!-- see https://css-tricks.com/responsive-images-css/ for more info on sizes and srcset combinations -->
```

## Responsive Image with CSS
```css
/* with resolution of 192dpi or higher and min with of 37.5em(600px) or higher, or min width of 125em(2000px) the css applies*/
@media (min-resolution: 192dpi) and (min-width: 37.5em), 
        (-webkit-min-device-pixel-ratio: 2) and (min-width: 37.5em),
        (min-width: 125em){

}
```

## @supports
```css
/* if backdrop-filter is supported or webkit-backdrop-filter is supported, css applies */
@supports ((backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px))){

}
```

## More details
```css
::selection{
    background-color: $color-primary;
    color: $color-white;
}
/* Try this when you select text */
```
```css
@media only screen (max-width: 37.5em){
    @content
};
/* only screen means media query only applies to screens, if user try to print, media query does not apply */
```

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- without this browser will try to render the website to the largest element's width, but with this, max width will be the device width -->
```

```css
@media only screen and (max-width: 56.25em), only screen and (hover:none){
/* only screen and screen that can't hover */
}
```