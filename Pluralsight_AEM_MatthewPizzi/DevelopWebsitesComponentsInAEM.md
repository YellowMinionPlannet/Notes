# 4 Introduction to Content Rendering

## Folder Structure of the JCR

- `apps`: contents related to AEM interface itself, most of contents are inherited from `libs`, when we customize AEM interface, make sure we only change `apps` folder and keep `libs` untouched.
- `libs`: contents of fundamental features of AEM framework, don't touch this folder
- `content`: where our webpages located, its content are created by the authors
- `conf`: all configurations of our sites, store dynamic templates and policies of our sites
- `etc`: contents related to all resources of utilities and tools
- `home`: related all users and groups
- `tmp`: temp folder, serves as a temporary working area
- `var`: audit logs, statistics, and event handling
- `oak:index`: housing unstructured data

## Page Rendering Components

To create a project named training in `apps` folder. We can create following folders:

- `apps/training/components/content`
- `apps/training/components/structure`
- `apps/training/templates`

To create a component in `apps/training/components/structure` folder.

- right-click on `structure` folder and _create component_
- _Label_ will be the node name, we use contentPage here.
- _Super Type_ is `wcm/foundation/components/page`
- Other properties could be customized
- if we want to use html, then we need to rename the `contentpage.jsp` under the newly created node to `contentpage.html`.
- change the content of `contentpage.html` to

```html
<!DOCTYPE html>
<html>
  <head> </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
```

To serve this html page, we need to create a node in `apps/content` folder.

- Right-click `content` folder, and create node
- _Name_ is hello-world
- _Type_ is nt:unstructured
- Add property to this hello-world node,

```json
{
  "name": "sling:resourceType",
  "value": "training/components/structure/contentpage"
}
```

Now, we can visit `localhost:4502/content/hello-world.html`.

## Understanding the Sling Resolution Process

- Sling is resource-oriented
- Resources form a virtual tree
- Resources are typically mapped to a JCR node, but also a file system/database

### 3 Common Properties of Resources

- Path: helps to locate resource
- Name: this is identity
- ResourceType: this point to the resource renderer

### Basic Steps of Processing Requests

1. JCR content items exposed as an HTTP resource
2. Determine script or servlet to handle request

### Steps to Resolve a URL Request

1. Decompose the URL
2. Search for servlet/vanity URL redirect
3. Search for a node indicated by the URL
4. Resolve the resource
5. Resolve the rendering script/servlet
6. Create rendering chain
7. Invoke rendering chain

### An example

`http://myhost/tools/spy.printable.a4.html/a/b?x=12`

Decomposed:
|URL parts|Decomposed|Description|
|-|-|-|
|http://|protocal||
|myhost|Host||
|tools/spy|content path|this will map to the JCR|
|printable.a4|selectors|version of the spy.html|
|html|extension|will direct resolution/rendering method of content|
|a/b|suffix||
|x=12|parameters||

In our previous examle

We have `http://localhost:4502/content/hello-world.html`. The AEM resolve this by finding the node at `/content/hello-world` node, and then found the `sling:resourceType=training/components/structure/contentpage`, so, first search `apps` folder and found it (if not, then search the `libs` folder),and `html` will direct AEM to find `contentpage.html` since contentpage is the default name that matches the resource name.

### Another example

Suppose we have `/content/hello-world.blue.html`.
We have following scripts in `training/components/structure/contentpage`, the resolve order will be:

1. blue.html
2. contentpage.html
3. GET.html

![sling-resolution](sling-resolution.png?raw=true)

# 5 Templates

## Templates

### Attributes & Properties of a Template

- label : name of the templates
- sling: resourceType: define rendering component when create page
- jcr:title: name shows up in the console
- jcr:description
- ranking: priority in the order in the create page dialog
- allowedPaths
- allowedParents: path
- allowedChildren: path
- thumbnail.png

### Create a Template in AEM

Under `apps/training/templates`, Right-click, create-templates, use `training/components/structure/contentpage` as the Resource Type. Set label as contentpage.

Allowed Path is set to `/content(/.*)?`, which means this template accessed anywhere in the `/content`.

## Ristrict Template Use

In templates Allowed Path, we can change to `/content/pluralsight-train(/.*)?`, then it's restricted to everything below `/content/pluralsight-train`.

We can change `/content/pluralsight-train` page property and add the property to `cq:allowedTemplates` to `/apps/training/templates`

# 6 Introduction to HTL

## Introduction to HTL

[HTL Documentation](https://experienceleague.adobe.com/docs/experience-manager-htl/content/overview.html?lang=en)

## Rendering Basic Page Content
