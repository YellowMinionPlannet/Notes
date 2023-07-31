# WCAG

World standards for accessiblity guidelines.

It consists following layers:

- Principals
  - Guidelines
    - Success Criteria
      - Techniques

## Principals

It is general guideline for all, which has 4 items:

- Perceivable
- Operable
- Understandable
- Robust

## Guidelines

There are 13 guidelines to describe overall objectives, but these are not testable.

## Success Criteria

For each guideline, there can be testable success criterias, which is classified as A, AA, AAA.

## Techniques

For each guideline and criteria, there are techniques which are advisory and sufficient.

# Samples

## HTML

### Document Structure and Landmarks

```html
<!DOCTYPE html>
<!-- The `!DOCTYPE` tag is required for properly parsing, which enables accessiblity tools to work. -->
<html lang="en">
  <!-- The lang attribute enables voice reading work properly for accessiblity tools. -->
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <!-- If both response HTTP header and webpage has `x-ua-compatible`, webpage take precedence, if the value is ie=edge means document mode is highest supported document mode of the browser. Document mode: Document Compatibility Mode, these are specific to IE browser, it will limit browser to specific IE Version if that browser is able to support-->
    <title>About | ACME Web Design</title>
    <!-- This is required -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
    />
    <!-- this is required for responsive reason, make sure the width=divice-width, and don't block user-scales. Also make sure use relative units for font-size, because this will allow user zoom in without ui cut offs. -->
  </head>
  <body>
    <header>
      <nav aria-lable="site"></nav>
    </header>
    <div class="wrapper">
      <main></main>
      <aside>
        <nav aria-lable="page">
          <!-- because this nested nav actually is nav for current page only, so we use aria-lable to defferentiate it -->
        </nav>
      </aside>
    </div>
    <footer>
      <nav aria-lable="site"></nav>
    </footer>
  </body>
</html>
```

# Narrator, Windows Voice Testing Tool

`Window + ctrl + enter`
