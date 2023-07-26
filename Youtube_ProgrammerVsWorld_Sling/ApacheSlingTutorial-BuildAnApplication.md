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
