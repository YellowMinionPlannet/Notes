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

<!--/* An HTL Comment */-->

### Special Contexts
