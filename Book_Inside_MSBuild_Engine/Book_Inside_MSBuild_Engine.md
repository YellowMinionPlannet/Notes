# Chapter 1 MSBuild Quick Start
## Project File Details
A MSBuild file (MSBuild project file) is just a XML file. These XML files are described by two XML Schma Definition (XSD) documents:
* Microsoft.Build.Commontypes.xsd (Elements commonly found in Visual Studio)
* Microsoft.Build.Core.xsd (Fixed elements in an MSBuild project file)

They are located at %WINDIR%\Microsoft.NET\Framework\vNNNN\MSBuild

The simplest MSBuild file would contain the following

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
</Project>
```

## Properties and Targets
Properties are key-value pairs, where Key is the name which is element tag name, and value is the value within the element tag. Properties are defined in `<PropertyGroup>`. 

> Properties name are NOT case sensitive.

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <PropertyGroup>
        <WebServer>\\sayHi</WebServer>
    </PropertyGroup>
</Project>
```

### Tragets and tasks
Task is the smallest unit of work and a target is a sequential set of tasks.

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Target Name="HelloWorld">
        <Message Text="Hello world!" />
    </Target>
</Project>
```
`msbuild HelloWorld.proj /nologo`
`/nologo` will tell MSBuild NOT to show the version information and save some space in console.

We can refer property with `$(PropertyName)` in another Property.

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <PropertyGroup>
        <WebServer>sayHi</WebServer>
        <WebURL>http://localhost:5000/$(WebServer)</WebURL>
    </PropertyGroup>
    <Target Name="Print">
        <Message Text="$(WebURL)" />
    </Target>
</Project>
<!-- output: http://localhost:5000/sayHi -->
```

## Items
Where Property is a key-value pair of a Name and Named Variable, items is a key-value pair that represents a ItemType and Array.

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
       <ItemGroup>      
        <SolutionFile Include=".\Book_Inside_MSBuild_Engine.md" />    
    </ItemGroup>    
    <Target Name="PrintSolutionInfo">      
        <Message Text="SolutionFile: @(SolutionFile)" />    
    </Target>  
</Project>
<!-- output: .\Book_Inside_MSBuild_Engine.md -->
```
In this example, SolutionFile has a attribute Include. Include can contain:
1. one distinct value
2. a list of values delimited with semicolons
3. a value with wildcards

In this example, since the SolutionFile is a single value, it acts like a property.

* Items are ordered list, the order is preserved.
* Later property will overwrite the previous one, items are different. Items simply appends later items into the list instead of overwrite the previous one.

### Using wildcards
* ? means 1 letter
* \* means 0 to many letters excluding /
* \\**\ means any letters
For example, `Include="src\**\*.cs"` will include all .cs files within src folder.

## Item Metadata

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">
    <ItemGroup>
        <src Include="src\one.txt" />
    </ItemGroup>
    <Target Name="PrintWellKnownMetadata">
        <Message Text="===== Well known metadata ====="/>
        <!-- %40 = @ -->      
        <!-- %25 = % -->      
        <Message Text="%40(src->'%25(FullPath)'): @(src->'%(FullPath)')"/>      
        <Message Text="%40(src->'%25(RootDir)'): @(src->'%(RootDir)')"/>      
        <Message Text="%40(src->'%25(Filename)'): @(src->'%(Filename)')"/>      
        <Message Text="%40(src->'%25(Extension)'): @(src->'%(Extension)')"/>      
        <Message Text="%40(src->'%25(RelativeDir)'): @(src->'%(RelativeDir)')"/>      
        <Message Text="%40(src->'%25(Directory)'): @(src->'%(Directory)')"/>      
        <Message Text="%40(src->'%25(RecursiveDir)'): @(src->'%(RecursiveDir)')"/>      
        <Message Text="%40(src->'%25(Identity)'): @(src->'%(Identity)')"/>      
        <Message Text="%40(src->'%25(ModifiedTime)'): @(src->'%(ModifiedTime)')"/>      
        <Message Text="%40(src->'%25(CreatedTime)'): @(src->'%(CreatedTime)')"/>      
        <Message Text="%40(src->'%25(AccessedTime)'): @(src->'%(AccessedTime)')"/>     
    </Target>  
</Project>
```
Reserved character needs to be escaped. For example, @ needs to be presented as %40 etc.

## Simple Conditions
Almost any element could be attributed with Condition, and this element and all of its child elements will be ignored
|Symbol|Description|
|-|-|
|==|Checks for equality|
|!=|Checks for inequality|
|Exists|Checks for the existence of a file|
|!Exists|Checks for the nonexistence of a file|

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">    
    <PropertyGroup>      
        <Configuration>Release</Configuration>    
    </PropertyGroup>    
    <ItemGroup>      
        <Content Include="script.js"/>      
        <Content Include="script.debug.js" Condition="$(Configuration)=='Debug'" />    
    </ItemGroup>       
    <Target Name="PrintContent">      
        <Message Text="Configuration: $(Configuration)" />      
        <Message Text="Content: @(Content)" />    
    </Target>  
</Project>
<!-- output: Configuration: Release -->
<!-- output: Content: script.js -->
```

## Default/Initial Targets
Please see following link.
[Target build order](https://learn.microsoft.com/en-us/visualstudio/msbuild/target-build-order?view=vs-2022)

# Chapter 2 MSBuild Deep Dive, Part 1
## Brief
Conventions for specifying the extension of the file:
* .proj: A project file
* .targets: A file that contains shared targets, which are imported into other files
* .props: Default settings for a build process
* .tasks: Afile that contains UsingTask declarations

In visual studio, IntelliSense will be provided while edit project files. It's due to the Microsoft.Build.xsd which imports Microsoft.Build.Core.xsd and MIcrosoft.Build.Commontypes.xsd as mentioned before.

## Properties
All properties and items are evaluated first, and then executes the targets.
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">    
    <PropertyGroup>      
        <Configuration>Debug</Configuration>    
    </PropertyGroup>    
    <PropertyGroup>      
        <Configuration>Release</Configuration>    
    </PropertyGroup>    
    <Target Name="PrintConfig">      
        <Message Text="Config: $(Configuration)"/>    
    </Target>  
    <PropertyGroup>     
        <Configuration>CustomRelease</Configuration>    
    </PropertyGroup> 
</Project>
<!-- output: Config: CustomRelease -->
```
## Environment Variables
At the time of MSBuild starts, it will store the Environment Variables, the update after the start of MSBuild will not affect current build. MSBuild first find the property with the provided name, if there is no such name, MSBuild will retrieve the Environment Variables with the provided name.
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">    
    <Target Name="PrintEnvVar">      
        <Message Text="Temp: $(Temp)" />      
        <Message Text="Windir: $(windir)" />      
    </Target>  
</Project>
```

### Reserved Properties
These properties can never be overwritten!!!
|Name|Description|
|-|-|
|MSBuildProjectFile|The name of the project file, including the extension.|
|MSBuildProjectExtension|The extension of the project file, including the period.|
|MSBuildProjectFullPath|The full path to the project file.|
|MSBuildProjectName|The name of the project file, without extension.|
|MSBuildProjectDefaultTargets|Contains a list of the default targets|
|...|...|

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">
    <PropertyGroup>
        <MSBuildExtensionsPath>Like a piece of work</MSBuildExtensionsPath>
    </PropertyGroup>
    <Target Name="PrintReservedProperties">
          <Message Text="MSBuildProjectDirectory: $(MSBuildProjectDirectory)" />
          <Message Text="MSBuildProjectDirectoryNoRoot: $(MSBuildProjectDirectoryNoRoot)" />      
          <Message Text="MSBuildProjectFile: $(MSBuildProjectFile)" />      
          <Message Text="MSBuildProjectExtension: $(MSBuildProjectExtension)" />      
          <Message Text="MSBuildProjectFullPath: $(MSBuildProjectFullPath)" />      
          <Message Text="MSBuildProjectName: $(MSBuildProjectName)" />      
          <Message Text="MSBuildToolsPath: $(MSBuildToolsPath)" />      
          <Message Text="MSBuildProjectDefaultTargets: $(MSBuildProjectDefaultTargets)" />      
          <Message Text="MSBuildExtensionsPath: $(MSBuildExtensionsPath)" />      
          <Message Text="MSBuildExtensionsPath32: $(MSBuildExtensionsPath32)" />      
          <Message Text="MSBuildExtensionsPath64: $(MSBuildExtensionsPath64)" />      
          <Message Text="MSBuildNodeCount: $(MSBuildNodeCount)" />      
          <Message Text="MSBuildStartupDirectory: $(MSBuildStartupDirectory)" />      
          <Message Text="MSBuildToolsPath: $(MSBuildToolsPath)" />      
          <Message Text="MSBuildToolsVersion: $(MSBuildToolsVersion)" />      
          <Message Text="MSBuildLastTaskResult: $(MSBuildLastTaskResult)" />      
          <Message Text="MSBuildProgramFiles32: $(MSBuildProgramFiles32)" />      
          <Message Text="MSBuildThisFile: $(MSBuildThisFile)" />      
          <Message Text="MSBuildThisFileDirectory: $(MSBuildThisFileDirectory)" />      
          <Message Text="MSBuildThisFileDirectoryNoRoot: $(MSBuildThisFileDirectoryNoRoot)" />      
          <Message Text="MSBuildThisFileExtension: $(MSBuildThisFileExtension)" />      
          <Message Text="MSBuildThisFileFullPath: $(MSBuildThisFileFullPath)" />  
          <Message Text="MSBuildThisFileName: $(MSBuildThisFileName)" />
          <Message Text="MSBuildOverrideTasksPath: $(MSBuildOverrideTasksPath)" />
    </Target>
</Project>
<!-- We can override MSBuildExtensionPath even it's a reserved property, but if we try to override others, MSBuild will give an error -->
```

### Comamnd-Line Properties
`msbuild Properties05.proj /t:PrintInfo /p:AssemblyName=Sedo.Namhu.Common;OutputPath="deploy\Release\\"`

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">
    <Target Name="PrintInfo">
        <Message Text="AssemblyName: $(AssemblyName)" />
        <Message Text="OutputPath: $(OutputPath)" />
        <Message Text="ReservedProperty: $(MSBuildProjectFile)">
    </Target>
</Project>
```
* Command-line properties cannot have their values changed (except through dynamic properties)
* Command-line properties get passed to all projects through MSBuild tasks
* Command-line properties take precedence over all other property type values, including environment variables and toolset properties. 
* Command-line properties cannot override reserved properties

### Dynamic Properties

Dynamic Properties are evaluated when execute the target, but not at the time before targets execution. It can override the Command-line properties and static property.
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">
    <Target Name="PrintReservedProperties">

          <CreateProperty Value="like a piece of work">
            <Output TaskParameter="Value" PropertyName="MSBuildExtensionsPath" />
          </CreateProperty>

          
          <Message Text="MSBuildExtensionsPath: $(MSBuildExtensionsPath)" />      
          
    </Target>
</Project>
```
`msbuild Print.proj /p:MSBuildExtensionsPath='CommandLine'`
This commandline property will override if there is NO dynamic properties. The result is like a piece of work for MSBuildExtensionsPath.


Commandline property can overwrite static property,
Dynamic property can overwrite Commandline property.
No one can change reserved property.

From MSBuild 4.0, we can have cleaner solution to CreateProperty task
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">
    <Target Name="PrintReservedProperties">

         <PropertyGroup>
            <MSBuildExtensionsPath>Like a piece of work</MSBuildExtensionsPath>
         </PropertyGroup>

          <Message Text="MSBuildExtensionsPath: $(MSBuildExtensionsPath)" />      
          
    </Target>
</Project>
```

## Items
Fundamentally, there are two types of values in MSBuild: single-valued and multi-valued values, which are also called scalar values and vector values respectively.
When a task need a scalar value, if we input vector values, MSBuild will flatten the multiple values by semicolons by default.

### Copy Task
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">
    <ItemGroup>
        <SourceFiles Include="src\**\*.txt" />
    </ItemGroup>

    <PropertyGroup>
        <Dest>$(MSBuildProjectDirectory)\dest\</Dest>
    </PropertyGroup>

    <Target Name="PrintFiles">
        <Message Text="SourceFiles: @(SourceFiles)" />
    </Target>
    <Target Name="CopyFiles">
            <Copy SourceFiles="@(SourceFiles)" DestinationFiles="@(SourceFiles->'$(Dest)%(RecursiveDir)%(Filename)%(Extension)')" />
    </Target>
</Project>
```

### Well-Known Item Metadata
RecursiveDir will return the first ** substitued value. For example, we have sub_one.txt in \src\sub\ and \src\sub\subsub
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">
    <ItemGroup>
        <src Include="src\**\sub\sub_one.txt" />
    </ItemGroup>
    <Target Name="CopyFiles">
        <Message Text="%40(src->'%25(RecursiveDir)'): @(src->'%(RecursiveDir)')" />
    </Target>
</Project>
<!-- output: @(src->'%(RecursiveDir)'): sub\ -->

<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">
    <ItemGroup>
        <src Include="src\**\sub\sub_one.txt" />
    </ItemGroup>
    <Target Name="CopyFiles">
        <Message Text="%40(src->'%25(RecursiveDir)'): @(src->'%(RecursiveDir)')" />
    </Target>
</Project>
<!-- output: @(src->'%(RecursiveDir)'): sub\subsub\;sub\ -->
```
### Custom Metadata
Custom metadata could be overwritten like property, but well-known metadata are all read-only like reserved propert (attempts to change will cause error).
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">    
    <ItemGroup>      
        <Server Include="Server1">
                <Type>2008</Type>        
                <Name>SVR01</Name>        
                <AdminContact>Adam Barr</AdminContact>        
                <AdminContact>Kim Abercrombie</AdminContact>      
        </Server>    
    </ItemGroup>    
    <Target Name="PrintInfo" Outputs="%(Server.Identity)">      
        <Message Text="Server: @(Server)" />      
        <Message Text="Admin: @(Server->'%(AdminContact)')" />    
    </Target>  
</Project>
<!-- output: Server: Server1 -->
<!-- output: Admin: Kim Abercrombie -->
```

### Item Transformations
Item transformation never change the original, and make sure the transformed has the same number as original.
`@( ItemType-> 'TransformExpression [ TransformExpression .  .  .]'[, Separator ]) `

# Chapter 3 MSBuild Deep Dive, Part 2
## Dynamic Properties and Items
### Dynamic Items
Because the static properties and static items are evaluated before targets are executed, if the items need to be updated during the target execution, we need to use dynamic items.
Dynamic items also can remove item from static item.
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">    
    <ItemGroup>
		<Server Include="Server1">
			<Type>2008</Type>
			<Name>SVR01</Name>
			<AdminContact></AdminContact>
		</Server>
		<Server Include="Server2">
			<Type>2003</Type>
			<Name>SVR02</Name>
			<AdminContact>Sayed Y. Hashimi</AdminContact>
		</Server>
		<Server Include="Server3">
			<Type>2008</Type>
			<Name>SVR03</Name>
			<AdminContact>Nicole Woodsmall</AdminContact>
		</Server>
		<Server Include="Server4">
			<Type>2003</Type>
			<Name>SVR04</Name>
			<AdminContact>Keith Tingle</AdminContact>
		</Server>
	</ItemGroup>
	<Target Name="PrintInfo">
		<Message Text="%(Server.Identity) : %(Server.AdminContact)" />
		<Message Text="" />
		<Message Text="Override the AdminContact" Importance="high" />
		<ItemGroup>
			<Server Condition="'%(Server.AdminContact)' == 'Keith Tingle'">
				<AdminContact>Sayed Ibrahim Hashimi</AdminContact>
			</Server>
		</ItemGroup>
		<Message Text="%(Server.Identity) : %(Server.AdminContact)" />
		<Message Text="" />
		<Message Text="Remiving item" />
		<ItemGroup>
			<Server Remove="Server2" />
		</ItemGroup>
		<Message Text="%(Server.Identity) : %(Server.AdminContact)" />
		<Message Text="Admin: @(Server->'%(AdminContact)')" />
	</Target>
</Project>
<!-- PrintInfo:
        Server1 : Sayed Ibrahim Hashimi
        Server2 : Sayed Y. Hashimi
        Server3 : Nicole Woodsmall
        Server4 : Keith Tingle

    Overriding AdminContact
        Server1 : Sayed Ibrahim Hashimi
        Server2 : Sayed Y. Hashimi
        Server3 : Nicole Woodsmall
        Server4 : Sayed Ibrahim Hashimi

    Removing item
        Server1 : Sayed Ibrahim Hashimi
        Server3 : Nicole Woodsmall
        Server4 : Sayed Ibrahim Hashimi
 -->
```

## Property and Item Evaluation
Process of MSBuild:
0. Load all environment and global properites, and toolset properties
1. Evaluate properties(static) and process imports as encountered
2. Evaluate item definitions
3. Evaluate items
4. Evaluate using tasks
5. Start build and reading targets
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" DefaultTargets="PrintInfo" ToolsVersion="4.0">
	<ItemGroup>
		<ItemOne Include="One" />
		<ItemTwo Include="@(ItemThree)" />
		<ItemThree Include="Three" />
		<ItemFour Include="@(ItemThree)" />
	</ItemGroup>
	<Target Name="PrintInfo">
		<Message Text="ItemOne: @(ItemOne)" />
		<Message Text="ItemTwo: @(ItemTwo)" />
		<Message Text="ItemThree: @(ItemThree)" />
		<Message Text="ItemFour: @(ItemFour)" />
	</Target>
</Project>
<!-- 
    ItemOne: One
    ItemTwo: 
    ItemThree: Three
    ItemFour: Three
 -->
```
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0" DefaultTargets="PrintInfo">
	<PropertyGroup>
		<OutputPathCopy>$(OutputPath)</OutputPathCopy>
	</PropertyGroup>
	<ItemGroup>
		<OutputPathItem Include="$(OutputPath)" />
	</ItemGroup>
	<PropertyGroup>
		<Configuration>Debug</Configuration>
		<OutputPath>bin\$(Configuration)\</OutputPath>
	</PropertyGroup>
	<Target Name="PrintInfo">
		<Message Text="Configuration: $(Configuration)" />
		<Message Text="OutputPath: $(OutputPath)"/>
		<Message Text="OutputPathCopy: $(OutputPathCopy)" />
		<Message Text="OutputPathItem: @(OutputPathItem)" />
	</Target>
</Project>
<!-- 
        Configuration: Debug
        OutputPath: bin\Debug\
        OutputPathCopy:
        OutputPathItem: bin\Debug\
 -->
```

## Importing Files
Import files are used as shared information.

Import element must be immediate child of Project element, and only Project and Condition attributes are available.

For C# project, Microsoft.CSharp.targets file is imported then the Microsoft.Common.targets file is imported.
```xml
<!-- Import01.proj -->
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0" DefaultTargets="All">
    <PropertyGroup>
        <SourceRoot>$(MSBuildProjectDirectory)\src\</SourceRoot>
        <Configuration>Debug</Configuration>
    </PropertyGroup>
    <ItemGroup>
        <SourceFiles Include="$(SourceRoot)\*" />
    </ItemGroup>

    <Import Project="$(MSBuildProjectDirectory)\Import01.targets" />

    <Target Name="PrintOutputPath">
        <Message Text="OutputPath: $(OutputPath)" />
        <Message Text="MSBuildProjectFile: $(MSBuildProjectFile)" />
    </Target>
    <Target Name="All" DependsOnTargets="PrintInfo;PrintOutputPath" />
</Project>

<!-- Import01.targets -->
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">
    <Target Name="PrintInfo">
        <Message Text="SourceRoot: $(SourceRoot))" />
        <Message Text="Configuration: $(Configuration)" />
        <Message Text="SourceFiles: @(SourceFiles)" />
    </Target>
    <PropertyGroup>
        <OutputPath>bin\$(Configuration)\</OutputPath>
    </PropertyGroup>
</Project>

<!-- 
    PrintInfo:
        SourceRoot: C:\InsideMSBuild\Ch03\src\
        Configuration: Debug
        SourceFiles: C:\...
    PrintOutputPath:
        OutputPath: bin\Debug\
        MSBuildProjectFile: Import01.proj
 -->
```

Note:
1. All items and properties in Import01.proj before the Import element are available to Import01.targets.
2. All items and properties defined in Import01.targets are available to Import01.proj after the Import element.
3. All properties and targets are defined from top to bottom, and the last definition that occurs is the value that persists.
4. **Targets are executed after all items, properties, and imports are evaluated.**

Reserved Property, such as MSBuildProjectFullPath, is evaluated when the process starts, and will not be changed. Even you request that property in imported file with different path, the property will not change. If you want to use current path (different from the path MSBuild starts), you can use MSBuildThisFile property.

## Extending the Build Process
We can extends the build by:
1. PreBuildEvent and PostBuildEvent(Not recommended)
2. Override BeforeBuild, AfterBuild, and similar targets
3. Target Hooks(i.e. BeforeTargets and AfterTarget)
4. Target Injection

For point 2, if you define target with the same name, AfterBuild, for example, then the target will override the AfterBuild target defined previously. But if you have more imported files, all AfterBuild targets will be overriden.
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">
...
    <Target Name="AfterBuild">
        <Message Text="Build Complete!" />
    </Target>
...
</Project>
```

### Target Hooks
We can use BeforeTargets and AfterTargets attributes on Target Element to tell MSBuild, the attributed target should execute before or after the targeted target.
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0" DefaultTargets="Build">
    <Target Name="Build">
        <Message Text="Build target" />
    </Target>
    <Target Name="GenerateCode" BeforeTargets="Build" Condition="false">
        <Message Text="GenerateCode target" />
    </Target>
    <Target Name="CustomCopyOutput" AfterTargets="Build">
        <Message Text="CustomCopyOutput target" />
    </Target>
</Project>

<!-- 
    GenerateCode:
        GenerateCode target
    Build:
        Build target
    CustomCopyOutput:
        CustomCopyOutput target

 -->
```
Note: 
* Even Build target's condition equals to false, Before/AfterBuild will execute.
* Before/AfterBuild only execute once.

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0" DefaultTargets="Build;Build1">
    <Target Name="Build">
        <Message Text="Build target" />
    </Target>
    <Target Name="Build1">
    <Message Text="Build1 target" />
    </Target>
    <Target Name="GenerateCode" BeforeTargets="Build;Build1">
        <Message Text="GenerateCode target" />
    </Target>
    <Target Name="CustomCopyOutput" AfterTargets="Build;Build1">
        <Message Text="CustomCopyOutput target" />
    </Target>
</Project>

<!-- 
    GenerateCode:
        GenerateCode target
    Build:
        Build target
    CustomCopyOutput:
        CustomCopyOutput target
    Build1:
        Build1 target
 -->

```

### Target Injection
We can use DependsOnTargets attribute to achieve this.
```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0" DefaultTargets="Build">
...
    <Import Project="$(MSBuildToolsPath)\Microsoft.CSharp.targets" />

    <PropertyGroup>
        <BuildDependsOn>
            $(BuildDependsOn);
            CustomAfterBuild
        </BuildDependsOn>
    </PropertyGroup>

    <Target Name="CustomAfterBuild">
        <Message Text="Inside CustomAfterBuild target" Importance="high" />
    </Target>

    ...
    <Target Name="Build" DependsOnTargets="$(BuildDependsOn)">
</Project>
```

Note: 
* If target Build's condition is false, then DpendsOnTargets will be ignored.
* We can also place CustomAfterBuild infront of $(BuildsDependsOn)

## Property Functions and Item Functions

Also visit official doc for this topic [Property functions](https://learn.microsoft.com/en-us/visualstudio/msbuild/property-functions?view=vs-2022)
