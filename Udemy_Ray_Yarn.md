# Section 1: Overview
## Yarn Overview
### Dependency vs. Package Manager
1. All manage modules/packages
2. Dependency is for project only, on the other hand, package manager could serve package as global service to the system
Yarn - Dependency/Package manager
NPM - Dependency/Package manager
Bower - Dependency manager
Home brew/ Chocolatee - Package manager for IOS and Windows

## Section 2: Yarn Basic
yarn add *package*
yarn add *package@1.0.0* (add package at specific version)

yarn remove *package*

yarn outdated (check packages' outdated information)
yarn config get registry (check which registry is using)

yarn upgrade
yarn upgrade *package* (upgrade specific package to the version specified in package.json)
> this command also change yarn.lock file. If we have yarn.lock file in the project, yarn gonna lock the version according to the yarn.lock file, and ommits the version range specified in package.json

yarn why *package* (check info about why this package is installed)

yarn info *package*
yarn info *package section* (cehck info about this package and specified section)

## Section 3: Advanced Features
