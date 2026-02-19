<!-- [This Documentation URL](https://learn.microsoft.com/en-us/nuget/what-is-nuget) -->

# What is NuGet?

Project(Source Code) : Build/Pack -> Package(one or more assemblies) : Publish -> NuGet.org/Host : Browse/Install -> Other Projects

NuGet Package is ZIP File with `.nupkg` extension, which contains manifest information about the content.

## Package targeting compatibility

A "compatible" package means that it contains assemblies built for at least one target .NET framework that's compatible with the consuming project's target framework.

Describe in function is:

```text
target framework A = target framework B
, where A is package's assembly's target framework
, where B is consuming project's target framework
```

So if .net framework is involved in consumer project, you better target framework for .NET Standard 2.0, which is compatible for .net framework 4.6.1+ and .NET 5+ inclusively.

## Managing dependencies

You only take cares of top level dependencies, and the down-level dependencies should be taken care of by the NuGet

## Tracking references and restoring packages

Because of sharing codes using source control system. It's not possible to include all referenced packages binary content to the source control host, it would be too redundant and space wasted. So NuGet only record reference list, and include this list to the source control mechanism. And when source code is downloaded (shared), use restore process to re-install referenced packages.

## how the reference list is maintained?

1. PackageReference:
    a. top-level dependency list in .proj file,
    b. and with associated file, locate at `obj/project.assets.json`, a overall dependency graph along with all down-level dependencies.

2. packages.config, flat list of all dependencies

## Other features of NuGet

1. Global Packages and Cache folder,

    - Global packages share packages among different projects on same device
    - Cache folder ensure packages that has already downloaded won't download again
2. Resolve out a single version of a package if that package's different versions are referenced by different dependencies.

# Concept

## Package installation

Here is what happens when you try to add a package to a project:

1. Try to record the package identifier and version into the project file or package.config file. If it's imcompatible, then add nothing.

2. Acquire Pacakge

    1.Check if the package is in the global-packages folder.

    2 If not specified in global-package folder, then attempt to download from sources list. If `-NoHttpCache` or `--no-http-cache` is specified with `nuget.exe` or `dotnet restore` command. Cache only remains 30 minutes.

    3.If package is specified using a floating version, for example, `1.*`, `(, 2.0.0]`, then NuGet will try to retrieve from all sources to figure out the best match.

    4.If the package is not in Cache, then download it.

    5.If failing to acquire such package from any source, show error.

3. Save a copy of the package and other info in the cache
4. Install the package into global-package folder.
5. Install the package into the project.
6. Update project file and folders:
    - For packagereference method project, update graph in `obj/project.assets.json`
    - Update `app.config` or `web.config`

## Package Versioning

A specific version number is from `Major.Minor.Patch[-Suffix]` format. Where 
    - Major, Breaking change
    - Minor, New features, backwards compatible
    - Patch, Backwards compatible bug fixes only
    - -Suffix(Optional), a hyphen followed by a string to denote a pre-reease version

Examples:

```text
1.0.1
6.11.1231
5.3.1-rc
2.2.44-beta.1
```

## Pre-release versions

- Alpha, experimental version
- Beta, feature complete version
- rc, Release candidate

So NuGet will pick stable version instead of pre-release ones. If have to pick pre-release ones, will pick rc > Beta> Alpha.

Here is a very good example of version range.

```xml
<!-- Accepts any version 6.1 and above.
     Will resolve to the smallest acceptable stable version.-->
<PackageReference Include="ExamplePackage" Version="6.1" />

<!-- Accepts any 6.x.y version.
     Will resolve to the highest acceptable stable version.-->
<PackageReference Include="ExamplePackage" Version="6.*" />

<!-- Accepts only version 6.1.0. -->
<PackageReference Include="ExamplePackage" Version="[6.1.0]" />

<!-- Accepts any version above, but not including 4.1.3. Could be
     used to guarantee a dependency with a specific bug fix. 
     Will resolve to the smallest acceptable stable version.-->
<PackageReference Include="ExamplePackage" Version="(4.1.3,)" />

<!-- Accepts any version up below 5.x, which might be used to prevent pulling in a later
     version of a dependency that changed its interface. However, this form is not
     recommended because it can be difficult to determine the lowest version. 
     Will resolve to the smallest acceptable stable version.
     -->
<PackageReference Include="ExamplePackage" Version="(,5.0)" />

<!-- Accepts any 1.x or 2.x version, but not 0.x or 3.x and higher.
     Will resolve to the smallest acceptable stable version.-->
<PackageReference Include="ExamplePackage" Version="[1,3)" />

<!-- Accepts 1.3.2 up to 1.4.x, but not 1.5 and higher.
     Will resolve to the smallest acceptable stable version. -->
<PackageReference Include="ExamplePackage" Version="[1.3.2,1.5)" />
```

## Dependency resolution

The process of restore, when install the 1st package, it will install all 1st package's dependencies.

It will create a flat list to resolve conflicts, which is called transitive restore.

When you use floating versions, which is some syntax like `2.8.*` to avoid install latest version, here `3.*` maybe, you better use lock file functionality.

NuGet restore responsible to write dependency graph into the `obj\project.assets.json` file.

`$(MSBUildProjectExtensionPath)` which default value is 'obj', is where asset file locates. DO NOT includes this file in to source control.

## Dependency resolution rules
