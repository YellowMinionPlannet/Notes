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