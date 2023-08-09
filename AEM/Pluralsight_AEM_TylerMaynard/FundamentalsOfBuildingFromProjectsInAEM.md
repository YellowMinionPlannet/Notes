> Maven Fundamentals course in Pluralsight is good start for Maven

# AEM Packages and Vault-Pushing Content into the JCR

Package contains JCR content and meta data.

When we install package into AEM, these content and data turns into nodes and properties.

## Understanding AEM Pacakge

It contains two folders

1. `jcr_root`
2. `META-INF`

The `META-INF` will give content a structure. It defines name of the package, group it belongs, and bulk filters.

The `jcr_root` folder is the root node in JCR of AEM. It will contains same folder structure corresponding to the JCR.

Within the `jcr_root` folder, every level will have a `.content.xml` file. It defines the node converted from the package when we install. If `.content.xml` is in folder `examplenode` folder, it defines the node called "examplenode".

Tool => Deployment => Package gives us Package console.

## Importing and Exporting JCR Content

FileVault is the framework (Jackrabbit) to import and export packages. It will has filter feature that is able to include and exclude specific paths.

FileVault has CLI called VLT.

## Working with AEM's Package Manager

When upload package, we upload and place pacakge in the JCR.

Only install node involve with FileVault. And will create/update nodes corresponding to the package content and data.

When we delete package, it won't delete nodes created/updated by that package.

When we uninstall a package, it doesn't delete package, but Removes nodes from JCR that are mapped to the package.

### Building the package

Build command will rebuild the package (Put JCR's CURRENT content, which are mapped according to the package filter, into the package).

Reinstall = Install

> NEVER EVER delete package before uninstall it. Will create status that nodes exists without package pointing to.

# Maven and AEM - Building an AEM Project

1. Maven build produces AEM package/packages or bundles place inside package.

2. Use Maven push those package into instance.

## Understanding Maven and the AEM Project Structure

Maven project structure, a folder with a `pom.xml` which is called parent pom.

And there will be "child" pom file for modules. The child pom and parent pom are related. Parent pom contains properties and configuration for entire application including modules. Module pom (Child pom) will produce artifact their module.

## Working with Maven's Pom.xml

POM Requirements:

1. modelVersion
2. groupId
3. artifactId
4. version

### Pom Packaging

Pom file can produce different package types. If it's content-package, it will produce AEM package that can be installed into AEM. It also can produce pom package, which contains pom file.

## Working with Maven's Plugins, Properties, and Lifecycles

Build process:

1. Validate

2. Compile

3. Test

4. Package

5. Verify

6. Install

7. Deploy

If you run maven package, it will run 1 through 4, which means Validate, compile, test, and package.

### Using a Plugin

```xml
<plugin>
    <groupId></groupId>
    <artifactId></artifactId>
    <version></version>
    ...
</plugin>
```

### Executing a Plugin Goal

```xml
<plugin>
...
    <executions>
        <execution>
            <goals>
                <goal></goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

### Configuring a Plugin

```xml
<plugin>
    ...
    <configuration>
        <plugin-property></plugin-property>
    </configuration>
</plugin>
```

By default if you run maven install it will push your artifact into your local repository which located at .m2 folder.

## Working with Maven's Profile, Repositories and Dependencies

### Profile

A defined configuration that can be used to override build defaults or even extend a build

```xml
<profiles>
    <profile>
        <id> </id>
        <activation>
            <activeByDefault>false</activeByDefault>
        </activation>
        <build></build>
        <!-- the build here override or extend the configuration -->
    </profile>
</profiles>
```

To activate profile with id autoInstallPackage `mvn install -PautoInstallPackage`

### Dependency Management

tell maven what are the dependent artifact are

```xml
<dependency>
    <groupId></groupId>
    <artifactId></artifactId>
    <version></version>
    <scope>provided</scope>
    <!-- tell maven when build/install don't need this dependency artifact, 'cause targeting repository already has it. -->
</dependency>
```

## Maven Archetype

Project Blueprint or Template

Create a maven project through archetype
`mvn archetype:generate -DarchetypeRepository=htps://repo.adobe.com/nexus/content/groups/public -DarchetypeGroupId=com.adobe.granite.archetypes -DarchetypeArtifactId=aem-project-archetype -DarchetypeVersion=10`

# Working with AEM in IDEs

Skipped due to unsolved dependencies.

# AEM Project Structure Deep Dive

Because we have java, java is embeded into bundles.

Plus the `jcr_root` and `META_INF` folders which we called content package.

Plus the vault meta data.

Maven Build groups three things together into AEM Package.

`packaging` tag in pom.xml define which type this module produce.

For example:

```xml
<packaging>bundle</packaging>
```

## Maven Resources Plugin

If the pom.xml packaging tag valued content-package, we build a content package.

What maven does is copy jcr_root to target folder, and package it.

The copying is processed by Maven Resources Plugin.

We need configure this plugin

```xml
<resources>
    <resource>
        <directory>
            ${basedir}/src/main/content/jcr_root
        </directory>
    </resource>
</resources>
```

## Content-Package Maven Plugin

1. Create package for AEM
2. Upload/install packages to AEM

When it builds package it can also embed java or even packages into built package.

```xml
<embeddeds>
    <embedded>
        <groupId>com.demo</groupId>
        <artifactId>project-example.core</artifactId>
        <traget>/apps/project-example/install</target>
    </embedded>
</embeddeds>
```

## AEM Project Profiles

_maven-sling-plugin to push the generated bundle to AEM_

## Package Filters

Filter is used to map package we built to contents in JCR.

## Filter mode

- Replace: Delete content in JCR(AEM) that does not exist in built package
- Merge: Only content that doesn't exist in the AEM is added
- Update:

> Note replace is the default mode.
