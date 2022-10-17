# MSBuild Essentials
## Where MSBuild lives
C:\Windows\Microsoft.NET\Framework\v4.0.30319

* How to check msbuild version
`msbuild -h` to get help
`msbuild /version` to get version information

Don't forget to add MSBuild folder in *Path* environment variables in settings.

## Targets
```xml
<!-- DoSomething.msbuild -->
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Target Name="Goodbyeworld">
        <Message Text="Goodbye, cruel world!"/>
    </Target>
    <Target Name="HelloWorld">
        <Message Text="Hello, world"/>
    </Target>
</Project>
```

```
//blah.rsp
/target:HelloWorld
```

use `msbuild DoSomething.msbuild /target:HelloWorld` or `msbuild DoSomething.msbuild @blah.rsp` to invoke HelloWorld target.

* we can also added defaulttargets attribute to define which is the default target
```xml
<?xml version="1.0" encoding="utf-8"?>
<Project DefaultTargets="HelloWorld" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Target Name="Goodbyeworld">
        <Message Text="Goodbye, cruel world!"/>
    </Target>
    <Target Name="HelloWorld">
        <Message Text="Hello, world"/>
    </Target>
</Project>
```

* If we define defaulttargets attribute and use /target: in command line, the defaulttargets will be overwritten.

## Log verbosity
We can change the log verbosity using `/v:minimal` / `/v:normal` / `/v:detailed` / `/v:diagnostic`
For example, in blah.rsp
```rsp
//blah.rsp
/target:HelloWorld;Goodbyeworld
/v:minimal
```

## Properties
We can use PropertyGroup tag to set up a group of Properties, and then use $() to reference those properties.
```xml
<?xml version="1.0" encoding="utf-8"?>
<Project DefaultTargets="HelloWorld" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <PropertyGroup>
        <Name>Lei</Name>
        <FullName>$(Name) Zhong</FullName>
    </PropertyGroup>
    <Target Name="Goodbyeworld">
        <Message Text="Goodbye, $(FullName)!"/>
    </Target>
    <Target Name="HelloWorld">
        <Message Text="Hello, $(Name)"/>
    </Target>
</Project>
```

We can also specify property using `/p:Name=Lisa`
For example, `msbuild DoSomething.msbuild @blah.rsp /p:Name=Lisa`, where Name property is overwritten.

## Reserved Properties
Properties are set initially by MSBuild, you can view all the properties using verbosity diagnostic
```xml
<?xml version="1.0" encoding="utf-8"?>
<Project DefaultTargets="HelloWorld" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <PropertyGroup>
        <Name>Lei</Name>
        <FullName>$(Name) Zhong</FullName>
    </PropertyGroup>
    <Target Name="ReservedProperties">
        <Massage Text="MSBuildProjectDirectory : $(MSBuildProjectDirectory)">
        <Message Text="LOGONSERVER : $(LOGONSERVER)">
    </Target>
    <Target Name="Goodbyeworld">
        <Message Text="Goodbye, $(FullName)!"/>
    </Target>
    <Target Name="HelloWorld">
        <Message Text="Hello, $(Name)"/>
    </Target>
</Project>
```

## Items
Items is more like a array. Here, we have Pics which is array of file type, and file type has metadata called ModifiedTime.
```xml
<?xml version="1.0" encoding="utf-8"?>
<Project DefaultTargets="HelloWorld" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <PropertyGroup>
        <Name>Lei</Name>
        <FullName>$(Name) Zhong</FullName>
        <PicsPath>c:\temp\*.*</PicsPath>
    </PropertyGroup>

    <ItemGroup>
        <Pics Include="$(PicsPath)" />
    </ItemGroup>

    <Target Name="ListPics">
        <Message Text="@(Pics)" />
        <Message Text="@(Pics->'%(ModifiedTime)')"/>
    </Target>

    <Target Name="ReservedProperties">
        <Massage Text="MSBuildProjectDirectory : $(MSBuildProjectDirectory)" />
        <Message Text="LOGONSERVER : $(LOGONSERVER)" />
    </Target>
    <Target Name="Goodbyeworld">
        <Message Text="Goodbye, $(FullName)!"/>
    </Target>
    <Target Name="HelloWorld">
        <Message Text="Hello, $(Name)"/>
    </Target>
</Project>
```
`msbuild DoSomething.msbuild /t:ListPics` will output array of file names, and then array of modifiedtime.

Items also can be customized type. For example
```xml
<?xml version="1.0" encoding="utf-8"?>
<Project DefaultTargets="HelloWorld" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <PropertyGroup>
        <Name>Lei</Name>
        <FullName>$(Name) Zhong</FullName>
        <PicsPath>c:\temp\*.*</PicsPath>
    </PropertyGroup>

    <ItemGroup>
        <Pics Include="$(PicsPath)" />
    </ItemGroup>

    <ItemGroup>
        <Simpsons Include="Homer">
            <CatchPhrase>Doh</CatchPhrase>
        </Simpsons>
        <Simpsons Include="Marge">
            <CatchPhrase>Mmmmmmph</CatchPhrase>
        </Simpsons>
        <Simpsons Include="Bart">
            <CatchPhrase>Eat my shorts</CatchPhrase>
        </Simpsons>
        <Simpsons Include="Lisa">
            <CatchPhrase>Bart!</CatchPhrase>
        </Simpsons>
        <Simpsons Include="Maggie">
            <CatchPhrase>slurp, slurp, slurp</CatchPhrase>
        </Simpsons>
    </ItemGroup>

    <Target Name="Simpsons">
        <Message Text="@(Simpsons)" />
        <Message Text="@(Simpsons->'%(CatchPhrase)')" />
    </Target>

    <Target Name="ListPics">
        <Message Text="@(Pics)" />
        <Message Text="@(Pics->'%(ModifiedTime)')"/>
    </Target>

    <Target Name="ReservedProperties">
        <Massage Text="MSBuildProjectDirectory : $(MSBuildProjectDirectory)" />
        <Message Text="LOGONSERVER : $(LOGONSERVER)" />
    </Target>
    <Target Name="Goodbyeworld">
        <Message Text="Goodbye, $(FullName)!"/>
    </Target>
    <Target Name="HelloWorld">
        <Message Text="Hello, $(Name)"/>
    </Target>
</Project>
```

# MSBuild Execution Lifecycle
## Invoking Multiple Targets
```xml
<?xml version="1.0" encoding="utf-8"?>
<Project DefaultTargets="HelloWorld" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Target Name="TargetA">
        <Message Text="This is Target A" />
    </Target>

    <Target Name="TargetB">
        <Message Text="This is Target B" />
    </Target>

    <Target Name="TargetC">
        <Message Text="This is Target C" />
    </Target>
</Project>
```
We can use command line to invoke the default task , which is TargetA in this case, by `msbuild DoSomething.msbuild`. And we can invoke multiple task in specific order like this `msbuild DoSomething.msbuild /t:TargetB;TargetA`. Same format can also be applied to DefaultTargets attribute of Project tag.

## CallTarget Task
Call other target within a target.

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Target Name="TargetA">
        <Message Text="This is Target A" />
        <CallTarget Targets="TargetB;TargetC">
    </Target>

    <Target Name="TargetB">
        <Message Text="This is Target B" />
    </Target>

    <Target Name="TargetC">
        <Message Text="This is Target C" />
    </Target>
</Project>
```

## DependsOnTargets Attribute
Use this to tell msbuild to run a target, after the dependented target executed only once.
```xml
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Target Name="TargetA" DependsOnTargets="TargetC">
        <Message Text="This is Target A" />
    </Target>

    <Target Name="TargetB" DependsOnTargets="TargetC">
        <Message Text="This is Target B" />
    </Target>

    <Target Name="TargetC">
        <Message Text="This is Target C" />
    </Target>
</Project>
```
`msbuild DoSomething.msbuild` will invoke TargetC , TargetA, TargetB. But NOT TargetC, TargetA, TargetC, TargetB.

DependsOnTargets requires the depended target only run once.

## BeforeTargets and AfterTargets attributes
```xml
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Target Name="TargetA" AfterTargets="TargetC">
        <Message Text="This is Target A" />
    </Target>

    <Target Name="TargetB" BeforeTargets="TargetC">
        <Message Text="This is Target B" />
    </Target>

    <Target Name="TargetC">
        <Message Text="This is Target C" />
    </Target>
</Project>
```
`msbuild DoSomething.msbuild /t:TargetC`, will trigger TargetB, targetC, targetA


## Conditional Targets
```xml
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <PropertyGroup>
        <DoIt>true</DoIt>
        <DoItString>Production</DoItString>
    </PropertyGroup>
    
    <Target Name="TargetA" DependsOnTargets="TargetC">
        <Message Text="This is Target A" />
    </Target>

    <Target Name="TargetB" Condition="$(DoItString) == 'Test'">
        <Message Text="This is Target B" />
    </Target>

    <Target Name="TargetC" Condition="$(DoIt)">
        <Message Text="This is Target C" />
    </Target>
</Project>
```
`msbuild DoSomething.msbuild /t:TargetB` will not invoke TargetB.

## Multiple MSBuild Files
MSBuild must have xml file to work with. There are conventions to name these xml files' extension name to make them function differently.
* .proj  means this is the over-arching file of the project, entry point of overall msbuild script
* .targets means this file contain shared targets 
* .props means this file contain shared properties.

```xml
<!-- DoSomething.proj -->
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Import Project="Common.targets" />
    <Import Project="Common.props" />

    <Target Name="EnterHere" DependsOnTargets="TargetA">
        <Message Text="Entry Point" />
        <Message Text="Hello, $(FullName)" />
    </Target>
</Project>
<!-- Common.props -->
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <PropertyGroup>
        <First>Peter</First>
        <Last>Griffin</Last>
        <FullName> $(First) $(Last)</FullName>
    </PropertyGroup>
</Project>
<!-- Common.targets -->
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Target Name="TargetA">
        <Message Text="This is Target A"/>
    </Target>
    <Target Name="TargetB">
        <Message Text="This is Target B"/>
    </Target>
    <Target Name="TargetC">
        <Message Text="This is Target C"/>
    </Target>
</Project>
```

`msbuild DoSomething.proj` will invoke TargetA only, because the file import TargetA first, so TargetA is the default target.
`msbuild DoSomething.proj` will invoke EnterHere and then TargetA, if we slightly change the file into this:
```xml
<!-- DoSomething.proj -->
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
   
    <Import Project="Common.props" />

    <Target Name="EnterHere" DependsOnTargets="TargetA">
        <Message Text="Entry Point" />
        <Message Text="Hello, $(FullName)" />
    </Target>
     <Import Project="Common.targets" />
</Project>
```

### About Inheritance

```xml
<!-- DoSomething.proj -->
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Import Project="Common.targets" />
    <Import Project="Common.props" />

    <Target Name="EnterHere" DependsOnTargets="TargetA">
        <Message Text="Entry Point" />
        <Message Text="Hello, $(FullName)" />
    </Target>
     <Target Name="TargetA">
        <Message Text="Hello DreamWork" />
     </Target>
</Project>
```
`msbuild DoSomething.proj` will get message "Hello DreamWork", but not "This is Target A"

> Check out the MSBuild Task Reference on Microsoft learn

# Custom Tasks
## The MSBuild Extension Pack
## Using Tasks from the Extension Pack
```xml
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Target Name="PackageStuff">
        <ItemGroup>
            <FilesToZip Include="c:\temp\pics\*.*" />
        </ItemGroup>
        <MSBuild.ExtensionPack.Compression.DNZip 
            TaskAction="Create"
            CompressFiles="@(FilesToZip)"
            ZipFileName="c:\temp\ZippedUpStuff.zip"
        />
    </Target>
    
    <Import Project="Common.targets" />
    <Import Project="Common.props" />

    <Import Project="c:\Program Files\MSBuild\ExtensionPack\4.0\MSBuild.ExtensionPck.tasks">
</Project>
```

## Implementing ITask
```C#
public class Add2Numbers:ITask{
    [required]
    public double Number1{get;set;}
    [required]
    public double Number2{get;set;}
    [output]
    public double Result{get;set;}

    public bool Execute(){
        Result = Number1 + Number2;
        var args = new BuildMessageEventArgs("Added 2 numbers", "Add", "Add2NUmbers", MessageImportance.High);
        return true;
    }
    public IBuildEngine BuildEngine{get;set;}
    public ITaskHost HostObject{get;set;}
}
```

## Create an Inline Task

```xml
<!-- PsTasks.tasks -->
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <UsingTask 
        AssemblyFile=".\PsBuildTasks\Pluralsight.MSBuild.Tasks\bin\Debug\Pluralsight"
        TaskName="Add2Numbers"
    />
    <UsingTask 
        AssemblyFile=".\PsBuildTasks\Pluralsight.MSBuild.Tasks\bin\Debug\Pluralsight"
        TaskName="Multiply2Numbers"
    />
    <UsingTask 
        AssemblyFile="$(MSBuildToolsPath)\Microsoft.Build.Tasks.v4.0.dll"
        TaskName="Divide2Numbers"
        TaskFactory="CodeTaskFactory"
    >
        <ParameterGroup>
            <Number1 ParameterType="System.Double" Required="true" />
            <Number1 ParameterType="System.Double" Required="true" />
            <Result ParameterType="System.Double" Output="true" />
        </ParameterGroup>
        <Task>
            <Code Type="Fragment" language="cs">
                Log.LogMessage(MessageImportance.High, "Divided 2 numbers", null);
                Result = Number1 / Number2;
            </Code>
        </Task>
    </UsingTask>
</Project>

<!-- DoSomething.proj -->
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">
    <PropertyGroup>
        <Number1>10</Number1>
        <Number2>2</Number2>
    </PropertyGroup>
    <Target Name="PackageStuff">
        <ItemGroup>
            <FilesToZip Include="c:\temp\pics\*.*" />
        </ItemGroup>
        <MSBuild.ExtensionPack.Compression.DNZip 
            TaskAction="Create"
            CompressFiles="@(FilesToZip)"
            ZipFileName="c:\temp\ZippedUpStuff.zip"
        />
    </Target>
    <Target Name="Math">
        <Add2Numbers Number1="$(Number1)" Number2="$(Number2)">
            <Output TaskParameter="Result" PropertyName="Sum" />
        </Add2Numbers>
        <Message Text="The sum is $(Sum)"/>
        <Multiply2Numbers Number1="$(Number1)" Number2="$(Number2)">
            <Output TaskParameter="Result" PropertyName="Product" />
        </Multiply2Numbers>
        <Message Text="The product is $(Product))"/>
        <Divide2Numbers>
            <Output TaskParameter="Result" PropertyName="Quotient" />
        </Divide2Numbers>
        <Message Text="The quotient is $(Quotient)"/>
    </Target>
    
    <Import Project="Common.targets" />
    <Import Project="Common.props" />
    <Import Project="PsTasks.tasks">
    <Import Project="c:\Program Files\MSBuild\ExtensionPack\4.0\MSBuild.ExtensionPck.tasks">
</Project>
```