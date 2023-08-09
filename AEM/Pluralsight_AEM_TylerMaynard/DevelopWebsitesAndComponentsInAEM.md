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
