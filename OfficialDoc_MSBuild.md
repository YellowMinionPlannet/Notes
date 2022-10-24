[Official MSBuild Documentation](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild?view=vs-2022)

# MSBuild
## Project File
SDK-style projects
* You don't see Import of .targets and .props 
* Instead you have the format below, so the .props and .targets files are implicitly specified by the SDK.
```xml
<Project Sdk="Microosft.Net.Sdk">
    ...
</Project>
```
## Items

Items are inputs into the build system and typically represent files. Items are grouped into item types based on user-defined item names. These item types can be used as parameters for tasks, which use the individual items to perform the steps of the build process.

In the following example, Compile is a item type, which is declared in ItemGroup and it includes 2 files. So Compile item type can be referenced in the project file by using `@(Compile)`

Valid item names begin with an uppercase or lowercase letter or underscore (_); valid subsequent characters include alphanumeric characters (letters or digits), underscore, and hyphen (-). The name of the child element is the type of the item. 
For example, following samples are valid.
```xml
<Compile Include="file1.cs" />
<compile Include="file2.cs" />
<_Compile Include="file1.cs" />
<c-o-m-p-i-l-e Include="file2.cs" />
<Compile1 Include="file1.cs" />
```
Following samples are in different formats but means the same thing.

```xml
<ItemGroup>
    <Compile Include="file1.cs" />
    <Compile Include="file2.cs" />
</ItemGroup>
```

```xml
<ItemGroup>
    <Compile Include="file1.cs;file2.cs" />
</ItemGroup>
```
And Include attribute is relative to the $(MSBuildProjectDirectory)

Item also can be created by Task which has Output element with ItemName attribute.

By default, `@(Compile)` will have files' names seperated with semicolons(;). To change this, use `@(Compile, ' ')` will seperate them by space.

We can use wildcard characters to match files.
```xml
<ItemGroup>
    <!-- To Include all .cs files where .proj file locates -->
    <CSFile Include="*.cs" />
    <!-- To Include all .vb files in D drive -->
    <VBFile Include="D:/**/*.vb" />
</ItemGroup>
```

We can use Exclude attribute to exclude things.
```xml
<ItemGroup>
    <!-- To Include all .cs files where .proj file locates, except DoNotBuild.cs -->
    <CSFile Include="*.cs" Exclude="DoNotBuild.cs"/>
    <!-- The following Compile Item Type would NOT exclude Form1.cs, since it's already added in the first line, Exclude attribute only affect current tag -->
    <Compile Include="*.cs" />
    <Compile Include="*.res" Exclude="Form1.cs" />
</ItemGroup>
```

We can added metadata into Items
```xml
<!-- This will add Fr as Culture into Metadata of CSFile Items -->
<ItemGroup>
    <CSFile Include="one.cs;two.cs">
        <Culture>Fr</Culture>
    </CSFile>
</ITemGroup>
```
If you set metadata to an empty value, you just remove it from the Items.
You can use metadata by `%(Culture)`, or `%(CSFile.Culture)`
There are well-known metadata by conventions. [Well-known item metadata](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-well-known-item-metadata?view=vs-2022)

You can transform by `@(CppFiles -> '%(Filename).obj')` to refer to array of Filename.obj strings seperated by semicolon(;).

You can explicitly give Item Type a shared metadata and also overwite all existed metadata in ItemDefinitionGroup
```xml
<ItemDefinitionGroup>
    <Compile>
        <BuildDay>Monday</BuildDay>
    </Complie>
</ItemDefinitionGroup>
<ItemGroup>
    <Compile Include="one.cs;three.cs" />
    <Compile Include="two.cs">
        <BuildDay>Tuesday</BuildDay>
    </Compile>
</ItemGroup>
```

More Metadata manipulation of Items please refer to the original website

# How MSBuild builds projects
[How MSBuild builds projects](https://learn.microsoft.com/en-us/visualstudio/msbuild/build-process-overview?view=vs-2022)

# .NET project SDKs
[.NET project SDKs](https://learn.microsoft.com/en-us/dotnet/core/project-sdk/overview)