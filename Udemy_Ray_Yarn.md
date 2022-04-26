# Section 1: Overview
## Yarn Overview
### Dependency vs. Package Manager
1. All manage modules/packages
2. Dependency is for project only, on the other hand, package manager could serve package as global service to the system
* Yarn - Dependency/Package manager
* NPM - Dependency/Package manager
* Bower - Dependency manager
* Home Brew/ Chocolatey - Package manager for IOS and Windows

## Section 2: Yarn Basic
* `yarn add *package*`
* `yarn add *package@1.0.0*` (add package at specific version)

* `yarn remove *package*`

* `yarn outdated` (check packages' outdated information)
* `yarn config get registry` (check which registry is using)

* `yarn install` after you update the package.json, run this command will update yarn.lock.

* `yarn upgrade`
* `yarn upgrade *package*` (upgrade specific package to the version range specified in package.json)
> yarn gonna lock the version specified in the yarn.lock file, and ommits the version range specified in package.json. This command upgrade the version in yarn.lock file to the latest version specified in package.json.

* `yarn why *package*` (check info about why this package is installed)

* `yarn info *package*`
* `yarn info *package section*` (cehck info about this package and specified section)

## Section 3: Advanced Features
* Global config and Local config
    * Global:
        * windows, under c:\users\<username>\.yarnrc
        * global config can be changed by following command
            * Read: `yarn config list`
            * Edit: `yarn config set save-prefix '~'`
            * Delete: `yarn config delete save-prefix`
    * Local:
        * you can add .yarnrc in the project folder manually, and use file editor to edit that file
        * once you delete .yarnrc in the project, there will be no local config, all config will be read globally

* `yarn run *command*` (this will run the scripts section in package.json file where command is the key of scripts)
* When you run a command that is not pre-defined in yarn, you can just do `yarn *command*`

* For global package, just add global in front of the command to add, remove, list your package.
`yarn global add *package*`

* For cache operation:
    * `yarn cache list` gives you what packages has been stored in cache
    * `yarn cache dir` gives you full path of storage of cached packages
    * `yarn cache clean *package*` to clean all cache or specific package
    * `yarn config set cache-folder` to set storage path

* Migrate from npm:
    * `yarn import` will use package.json and package.lock.json to import package tree to yan
    * `yarn check` check the structure of tree imported
    * `yarn upgrade` solve errors in yarn check
    * remember to delete package.lock.json after
 