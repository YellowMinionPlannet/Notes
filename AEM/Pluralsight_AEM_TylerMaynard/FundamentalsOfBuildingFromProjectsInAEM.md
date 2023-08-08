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
