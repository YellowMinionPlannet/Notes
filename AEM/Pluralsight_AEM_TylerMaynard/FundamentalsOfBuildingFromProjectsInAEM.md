> Maven Fundamentals course in Pluralsight is good start for Maven

# AEM Packages and Vault-Pushing Content into the JCR

Package contains JCR content and meta data.

When we install package into AEM, these content and data turns into nodes and properties.

## How does a package looks like

It contains two folders

1. `jcr_root`
2. `META-INF`

The `META-INF` will give content a structure. It defines name of the package, group it belongs, and bulk filters.

The `jcr_root` folder is the root node in JCR of AEM. It will contains same folder structure corresponding to the JCR.
