# Why we use package?
Because in a big project, there might be different teams to work together. Some of the functionality could be shared within different teams once published. However, sharing the source code from source control might cause issues. For example, merge conflict or if the project too big, the loading time of whole project, etc. So, publishing independent functionality could be achieved by sharing packages. 

# Way of sharing packages?
Nuget is package feed for .net
Maven is package feed for Java
npm is package feed for javascript
sdist/Wheel is package feed for python

# Why Azure Artifacts?
Nuget provides service to pubilsh your package to the nuget.org. But this will be public to everyone, which sometimes not an option for you. You can also build up your own nuget package server to your on premise server. But you need to input time and money maybe. Or Azure Artifact is a SASS(software as a service solution) on Azure.

# What is Azure Artifacts?
* Creating and sharing from private and public sources
* Integrating into CI/CD pipelines

Public source: nuget etc.
Private source: Azure artifacts instance, or your own feed

Supported package type:
-Nuget
-Maven
-NPM
-Python
-Universal packages

Universal package type can store anything with version and name.

* You can group public packages(nuget etc.) and your private packages into your own feed.
* When using public packages, artifact also catch these packages and make it available when public source is down.
* Views are subset of pacakges
* 2GB free, over that will be charged

