# Getting Started： Intro to ARIA
## Official ARIA Standard
Read official standard, especially for following sections:
visit https://www.w3.org/TR/wai-aria/
* section 5.3
* section 5.3.2
    * including standalone and composite widgets
* section 5.3.3
* section 5.3.5
* section 5.3.6
* section 5.4 
    * alphabatical order of all roles
* section 6.4
* seciton 6.5
* seciton 6.6

## 5 Rules of ARIA

* 1st Rule of ARIA
> Don't use ARIA if you can use HTML instead
for example, commented content could be substitute by the html tags.
```html
<!-- <div rol="banner"> --> <header>
<!-- <div role="complementary">--> <aside>
<!-- <div role="form"> --> <form>
<!-- <div role="main"> --> <main>
<!-- <div role="navigation"> --> <nav>
<!-- <div role="region"> --> <section [accessible name]>
<div role="search">
<footer role="contentinfo">
```

* 2nd Rule of ARIA
> Don't Change Native Semantic
The following example, using `role="button"` will confuse user, since if it's button, user will use `space` key, but a tag needs to use `enter` key to activate. It's easier to just use `button` tag.
```html
<a href="#" role="button">Menu</a>
```
* 3rd Rule of ARIA
> All interactive ARIA roles need to be operable by keyboard.

* 4th Rule of ARIA
> Don't use `role="presentation"` or `aria-hidden="true"` on visible focusable elements

* 5th Rule of ARIA
> All interactive elements must have an accessible name
```html
<input aria-label="Street Address">
```

Five rules of ARIA is documented in
https://www.w3.org/TR/aria-in-html

## Official ARIA Authoring Practices
https://www.w3.org/WAI/ARIA/apg/

# Building an Expandable Component
## Semantics
* Interactive Widgets must have Name, Role, Value
* What semantics provide is role.
* In ARIA, there are 69 roles, but only 29 are interactive.
* Role does not provide interaction.(button role does not ensure you can use tab or space key to visit interactive content)

Use semantics instead of ARIA role:
http://bit.ly/2IMK1ko

## States and Properties
48 states and properties available
