# Part 1

## Create a clean sling project

If we are using sling 8 we need IDE like EClipse to edit the file, but since sling 9 we don't need IDE anymore, Sling will provide a web interface editor for editing.

### 8

First, we need to download the file below and use java to start it.

`java -jar org.apache.sling.launchpad-8.jar`

Second, in the Eclipse, we need to install the tool for sling server.

Third, with Sling 8 running, we create a new Sling project and export it to the Sling server.

We can view the content in Sling website at `localhost:8080` after login as admin/admin.

## Summary to Sling framework

It's a restful web framwork that can serve any kind of media. In AEM, this is paired with Jackrabit which is a Content Repository System(implements JSR 170 /JSR 283).

Use `filter.xml` to let server know where is the root node.

Use `sling:resourceType` to connect content nodes and apps templates.

`content` folder usually contains properties of the node, meta data stuff like that.

`apps` folder will contain the template and using HTL template is more efficient.

## Summary to Felix framework

Users can use felix to bundle package, usually you can bundle package through their url.
Package like felix webconsole(host a webpage for felix) and other features.

## Summary to Karaf framework

Users can also bundle package by Karaf which has dependency awareness. It uses `localhost:8181`.

# Create client library (reference js/css)

1. Create a node named `zurbfoundation` under `/app`, choose cq:ClientLibraryFolder for Type.

2. Create folders named `source` and `style` under `/zurbfoundation` folder. Copy `foundation.css` into style folder, and `foundation.js` into source folder.

3. Create `js.txt` and `css.txt` at the `/zurbfoundation` folder. Within css.txt,

```
#base=style
foundation.css
```

4. At zurbfoundation folder/node, we need to add properties named `categories` and values added as `zurb.foundation`.

5. within `/components/mainPageComponent.html`

```html
<!DOCTYPE html>
<html data-sly-use.clientlib="/lib/granite/sightly/templates/clientlib.html">
  <head>
    <title>This is a Test Title</title>
    <sly data-sly-call="${clientlib.css @ categories='zurb.foundation'}" />
    <sly data-sly-call="${clientlib.js @ categories='zurb.foundation'}" />
  </head>
  <body>
    <h1>This is the Test Page</h1>
  </body>
</html>
```

## To add client library dependency

If that library dependency is within `/etc` folder.

1. at `/app/components/zurbfoundation` node/folder, add properties named `dependencies` and values `cq.jquery`(cq.jquery is the library folder categories property).

now we can see the html included jquery library.

# Createing a simple component from scratch

`.4.json`