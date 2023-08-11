# Introduction and Architecture Overview

## Architecture Overview

### Architecture Stack

### Granite

### JCR

### Sling

# Introduction to Content Rendering

## Introduction to Content Rendering

JCR is composed by nodes and properties.

Nodes is the structure and is able to have parent or child.

Property stores data.

### Node

Node must has type, and that type set rules about this node or what kind of child node this node must have.

For example, cq:Page node must have a child named jcr:content, must have type cq:PageContent.

Node also can have zero to many mixin types. This are the additional rules of requiring what properties child node must have.

#### Common JCR Node Types

- nt:file, file
- nt:folder, folder
- nt:unstructured, which allow any combination of childe nodes, allow any combination of properties, store unstructured content.

- cq:Page, store content and properties for website
- cq:Template, defines a template to create pages
- cq:ClientLibraryFolder, defines libraries of js/css
- cq:Dialog, defines a touche-enabled dialog box
- cq:EditConfig, defines editing configuration for a component, drag and drop etc.
- cq:InplaceEditConfig, child of cq:EditConfig node

### Properties

A node can have any number of properties.

Property can be single / multi-valued.

#### Common namespaces can be used for properties

- jcr:
- nt:
- rep:
- mix:
- sling:
- cq:

## Folder Structure of JCR

- /apps, we can extend libs in this folder by copying content from /libs into this folder, and modify it
- /content, content of websites are stored here
- /libs, libraries originally comes from AEM itself, avoid to modify this folder

- /conf, configuration of our site, like policies
- /etc, resources related to utilities and tools
- /home, information related to users and groups
- /tmp, temporay working area
- /var, audit log, statistics
- /oak:index, store unstructured data

## Setup Project Folder Structure

node name begins with lower case letter.

1. We create project folder in /apps folder called /apps/training.
2. Create /apps/training/components folder
3. Create /apps/training/components/content and /apps/training/components/structure folders
4. Create /apps/tarining/templates folder

## Page Rendering Components

- Components are collections of scripts, which can be jsp, htl, servlets.
- Component has a default script file identical to the name of the component.
- Nodes use `sling:resourceType` property to point to a component, and its rendering script.

### Demo of creating page component

1. /apps/training/components/structure create component, lable: contentpage, title: Pluralsight Train Contentpage Component, SuperType:wcm/foundation/component/page,

   > Be noticed this component has jsr:primaryType valued cq:Component, and the default contentpage.jsp has jsr:primaryType valued nt:file. So both are nodes with types.

2. Rename the default contentpage.jsp to contentpage.html

3. Edit the script

```html
<!DOCTYPE html>
<html>
  <head> </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
```

4. /content create new node, hello-world, type: nt:unstructured
5. We need to point this content to component and its script. So add property `sling:resourceType` valued training/components/structure/contentpage

6. Browse localhost:4502/content/hello-world

## Understanding the Sling Resolution Process

Resource has 3 common properties, Path, Name, ResourceType. (resource means node in content)

So when request comming in, the content item/node will map the request into the rendering script / servlet. This is determined by

1. the properties on content node
2. HTTP Method
3. naming convention in the URL

### Steps to Resolve URL request

1. Decompose the URL
2. Search for servlet or vanity URL redirect
3. Search for a node indicated by the URL
4. Resolve the resource
5. Resolve the rendering script/servlet
6. Create rendering chain
7. Invoke rendering chain

For example:
http://myhost/tools/spy.printable.a4.html/a/b?x=12

- `/tools/spy` is the content path, locate content node in JCR
- `printable.a4` is the selector,
- `html` is the extension, extension decide content format, and specifies which script to be used
- `a/b` is the suffix, additional information
- `x=12` is the param, dynamic content

Another example:
http://myhost/tools/spy.html

1. Check for redirection rule or servlet
2. Search for tools/spy node
3. Find node's sling:resourceType, locate the script
4. nothing found, raise 404

Another example:
http://localhost:4502/content/hello-world.html

1. There are no redirection / servlet for this url
2. goes to the content/hello-world node
3. find the node's sling:resourceType, locate libs/training/components/structure/contentpage, THEN, /apps/training/components/structure/contentpage
4. .html leads to contentpage.html

Priority of locating rendering scripts
/content/hello-world.blue.html and we have three scripts in contentpage node in /apps/training/components/structure/contentpage node:

1. GET.html
2. contentpage.html
3. contentpage.blue.html

The priority order will be:

1. contentpage.blue.html
2. contentpage.html
3. GET.html

> Each node in content is exposed as a HTTP Resource.

![slingResolution](slingResolution.jpg?raw=true)

## Sling Resolution Demo

# Templates

When page is created, which must be done based on selecting one of the template, the sling:resourceType is also copied from template to the page. The initial content in template is stored in jcr:content node tree.

### Common properties and Attributes of a template

- Label, name of the template
- sling:resourceType
- jcr:title
- jcr:description
- ranking
- allowedPaths
- allowedParents
- allowedChildren
- thumnail.png

### Demo

1. /apps/training/template create template, with resourceType: training/components/structure/contentpage
2. allowedPaths: /content(/.\*)?

   > NOTE, this template node has jcr:primaryType valued cq:Template

3. Create a page in AEM Site console, choose our newly created template as base
   > NOTE, this create a node in /content folder, this node has jcr:content node which has jcr:primaryType valued cq:PageContent and has cq:template valued /apps/training/templates/contentpage, and sling:resourceType valued training/components/structure/contentpage

## Restrict Template Use

## Content Structure

## Site Structure

# Introduction to HTL

## HTL Syntax

- Block statments: `data-sly-\*`
  - sly tag: `<sly data-sly-test.varone="${properties.yourProp}" />`, this will not show in the result(Html format), but the data will be included
  - Use: `<div data-sly-use.nav="navigation.js">${nav.foo}</div>`
  - Unwrap: `<div data-sly-unwrap><p>rendering<p></div>`
  - List: `<dl data-sly-list="${currentPage.listChildren}"`>
- Expressions: `${}`
- Comment: `<!--/* An HTL Comment */-->`
- Options: `${'example.com/path/page.html' @ scheme='http'}`

## Rendering Basic Page Content

| Enumerable              | Java Backed        |
| ----------------------- | ------------------ |
| properties              | component          |
| pageProperties          | curentDesign       |
| inheritedPageProperties | currentPage        |
|                         | currentSession     |
|                         | request - response |
|                         | resource           |
|                         | wcmmode            |

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <h1>Hello World!!</h1>
    <h3>Sling PropertiesObject</h3>
    <p>Page Title : ${properties.jcr:title}</p>

    <h3>Page Details</h3>
    <p>currentPage Title: ${currentPage.Title}</p>
    <p>currentPage Name: ${currentPage.Name}</p>
    <p>currentPage Path: ${currentPage.Path}</p>
    <p>currentPage Depth: ${currentPage.Depth}</p>

    <h3>Node Details</h3>
    <p>currentNode Name: ${currentNode.Name}</p>
    <p>currentNode Path: ${currentNode.Path}</p>
    <p>currentNode Depth: ${currentNode.Depth}</p>
  </body>
</html>
```

properties will retrieve properties in jcr:content node of corresponding content node that url resolved to.

To get to know details about HTL global object, browse [Global Object](https://experienceleague.adobe.com/docs/experience-manager-htl/content/global-objects.html?lang=en)

If it's Java backed object, goes to Java API Documentation and find that object.
[Java API Doc]()

## Modularize Page Components

Create header.html, footer.html, body.html, the goal is combine these files into contentpage.html.

> NOTE, newly created 3 files has jcr:primaryType valued nt:file. contentpage.html has jcr:primaryType: valued cq:Page.

# Inheritance

Inherited component will inherit rendering scripts, dialog boxes and other element from base component. Local rendering scripts, dialog boxes and other element will have previliage than inherited ones.

There 3 types of hierarchies in AEM.

1. Resource type hierarchy, through sling:resourceSuperType property
2. Container hierarchy,
3. Include hierarchy

## Inheriting the foundation page component

steps of investigating resource type hierarchy

1. find sling:resourceSuperType
2. follow super type path
3. take a look at base component

First find path in /apps, then /libs.

## Finding initial Rendering Scripts

The closest parent's scripts, dialogs, other elements has priority when resolve the inheritence.

# Developing Structure Components

### Terminology to clarify

In AEM the global content, like css/js files are called design(ner)s.

### Demo of design

Create structure component, which cannot be removed by author, using data-sly-resource.

```html
<div
  data-sly-resource="${'site-topnav' @ resourceType='training/components/structure/site-topnav'}"
></div>
```

To call java file /javascript file, we need to use data-sly-use.variable

```html
<div data-sly-use.topnav="topnav.js">${topnav.root.path}</div>
```

## Logging in AEM

Tools > Web console > Sling > Log support > Add Logger with Log File valued logs/training.log, and Logger valued apps.training.

Now we can goes to docker, author image -> opt -> aem -> crx-quickstart -> logs -> training.log and check the log file.

## Component Dialog Boxes

Every components within dialog should have sling:resourceType valued
(libs/)granite/ui/components/foundation/XXXX and jcr:primaryType valued nt:unstructured.

Every cq:dialog node should have jcr:priamryType valued nt:unstructured, and sling:resourceType valued /cq/gui/components/authoring/dialog.

Every Components that works as a field in a form, should have a fieldLabel property on the node, which is the label of the field. And fieldDescription act as tool tip. And name property on the node is the most important, it will map to the property name that store this field information.

For example:

We first need to use data-sly-resource=${'title' @ resourceType = 'training/components/structure/title'} to include our title component.

Under the component node, copy cq:dialog node from /libs/wcm/foundation/components/title/cq:dialog node to our component.

On the cq:dialog's title node, name property valued with `./jcr:title` means, it will store jcr:title property on the content/pluralsight-trainng/en/products/jcr:content/title node. This jcr:title can also be visited in rendering script like HTL.

```html
<!-- body.html -->
<div
  class="we-Header"
  data-sly-resource="${'title' @ resourceType='training/components/structure/title'}"
></div>
```

```html
<!-- training/components/structure/title.html -->
<h1 data-sly-use.title="title.js">${title.text}</h1>
```

```js
// training/components/structure/title.js
"use strict";

use(function () {
  var CONST = {
    PROP_TITLE: "jcr:title",
    PROP_TAG_TYPE: "type",
  };

  var title = {};

  // The actual title content retrieved from the property title
  // or, the pageProperties title, or, the currentPage.name
  title.text =
    properties.get(CONST.PROP_TITLE) ||
    pageProperties.get(CONST.PROP_TITLE) ||
    currentPage.name;

  return title;
});
```

cq:editConfig node is for editing components on the page instead of the dialog box.

## Design Dialog Boxes

It is used in Design mode, and once the property is set, it will affect all design related pages. For example, at root page, properties, advanced, design property set to etc/designs/training/
