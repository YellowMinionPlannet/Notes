[This Documentation URL](https://learn.microsoft.com/en-us/nuget/what-is-nuget)

# What is NuGet?

Project(Source Code) : Build/Pack -> Package(one or more assemblies) : Publish -> NuGet.org/Host : Browse/Install -> Other Projects

NuGet Package is ZIP File with `.nupkg` extension, which contains manifest information about the content.

# Package targeting compatibility

A "compatible" package means that it contains assemblies built for at least one target .NET framework that's compatible with the consuming project's target framework.

Describe in function is:
```
target framework A = target framework B
, where A is package's assembly's target framework
, where B is consuming project's target framework
```
So if .net framework is involved in consumer project, you better target framework for .NET Standard 2.0, which is compatible for .net framework 4.6.1+ and .NET 5+ inclusively.

# Managing dependencies

You only take cares of top level dependencies, and the down-level dependencies should be taken care of by the NuGet

# Tracking references and restoring packages

Because of sharing codes using source control system. It's not possible to include all referenced packages binary content to the source control host, it would be too redundant and space wasted. So NuGet only record reference list, and include this list to the source control mechanism. And when source code is downloaded (shared), use restore process to re-install referenced packages.

## how the reference list is maintained?

1. PackageReference: 
    a. top-level dependency list in .proj file, 
    b. and with associated file, locate at `obj/project.assets.json`, a overall dependency graph along with all down-level dependencies.

2. packages.config, flat list of all dependencies

## Other features of NuGet
1. Global Packages and Cache folder
2. Resolve out a single version of a package if that package's different versions are referenced by different dependencies. 


# Concept

## Dependency resolution

The process of restore, when install the 1st package, it will install all 1st package's dependencies.

It will create a flat list to resolve conflicts, which is called transitive restore.

When you use floating versions, which is some syntax like `2.8.*` to avoid install latest version, here `3.*` maybe, you better use lock file functionality.

NuGet restore responsible to write dependency graph into the `obj\project.assets.json` file.

`$(MSBUildProjectExtensionPath)` which default value is 'obj', is where asset file locates. DO NOT includes this file in to source control.

## Dependency resolution rules
