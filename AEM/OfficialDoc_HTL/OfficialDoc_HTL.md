[HTL](https://experienceleague.adobe.com/docs/experience-manager-htl/content/getting-started.html?lang=en)

# Getting Started with HTL

## Fundamental Concepts of HTL

HTL gets compiled into Java Servlets, the expressions and data attributes are evaluated entirely server-side.

### Blocks and Expressions

```html
<h1 data-sly-test="${properties.jcr:title}">${properties.jcr:title}</h1>
```

`<h1 data-sly-test=""></h1>` is called block statements, `${properties.jcr:title}` is called expression language.

### SLY Element

When there might not be an existing element at the exact location where block statements has to be inserted, we use sly element.

```html
<sly data-sly-test="${properties.jcr:title && properties.jcr:description}">
  <h1>${properties.jcr:title}</h1>
  <p>${properties.jcr:description}</p>
</sly>
```

So, only if there are both jcr:title and jcr:description properties, the h1 and p tags are displayed.

### HTL Comments

```
<!--/* An HTL Comment */-->
```

### Special Contexts

# data-sly-template

If template is at the same page of data-sly-call

```
<template data-sly-template.one>blah</template>
<div data-sly-call="${one}"></div>

```

If different page.

```
<div data-sly-use.lib="templateLib.html" data-sly-call="${lib.one}"></div>
<div data-sly-call="${lib.two @ title=properties.jcr:title, resource=resource.parent}"></div>
```

```
//templateLib.html
<template data-sly-template.two="${@ title, resource}">
    <div> Title = ${title} </div>
    <div> Resource = ${resource.name} </div>
</template>

<template data-sly-template.one>
	<h1>This is Template II !!!!</h1>
</template>

<template data-sly-template.haha>
<h1>Within Template !!!! ${properties.haha}</h1>
</template>
```
