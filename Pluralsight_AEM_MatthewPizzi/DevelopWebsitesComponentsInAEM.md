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
- right-click on `structure` folder and *create component*
- _Label_ will be the node name, we use contentPage here.
- _Super Type_ is `wcm/foundation/components/page`
- Other properties could be customized
- if we want to use html, then we need to rename the `contentpage.jsp` under the newly created node to `contentpage.html`.
- change the content of `contentpage.html` to 
```html
<!DOCTYPE HTML>
<html>
    <head>
    </head>
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