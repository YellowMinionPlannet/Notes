# Part 1

## Create a clean sling project

`java -jar org.apache.sling.launchpad-8.jar`

In Eclipse

File => New => Project => Sling => Sling Content Project

Make sure you clean up the project folder, and it looks like below:

```
<!-- version 1.0 -->
- ${ProjectName}
    - jcr_root
        - apps
        - content
            - .content.xml
    - META-INF
        - vault
            - config.xml
            - filter.xml
            - settings.xml
    - .project
```

```
<!-- version 1.1 -->
- ${ProjectName}
    - jcr_root
        - apps
        - content
            - podcasts
                - .content.xml   //copied from parent folder
            - .content.xml
    - META-INF
        - vault
            - config.xml
            - filter.xml
            - settings.xml
    - .project
```

```xml
<!-- version 1.0  ./META-INF/vault/filter.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
    <filter root="/content/podcasts"/>
    <filter root="/apps/components"/>
</workspaceFilter>
```

```xml
<!-- version 1.0 ./jcr_root/content/podcasts/.content.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:vlt="http://www.day.com/jcr/vault/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" jcr:primaryType="sling:Folder">
</jcr:root>
```
