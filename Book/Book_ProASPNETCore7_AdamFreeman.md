# 4 Using the Development Tools
## 4.1 Creating ASP.NET Core command line

|Problem|Solution|
|-|-|
|Creating a project|`dotnet new`|
|Building and running project|`dotnet build` `dotnet run`|
|Adding packages to a project|`dotnet add package`|
|Installing tool commands|`dotnet tool`|
|Managing client-side packages|`libman`|


```bash
dotnet new --list
# to list templates available for creating new items

dotnet new web
# minimum code and content required for ASP.NET Core development
dotnet new mvc
# minimum configured for mvc framework
dotnet new webapp
# Razor paged
dotnet new blazorserver
# Blazor server
dotnet new angular
dotnet new react
dotnet new reactredux
```
## Example of creating a web project
```bash
dotnet new globaljson --sdk-version 7.0.100 --output MySolution/MyProject
# create global.json file at MySolution/MyProject, to make sure everyone using the same sdk version when developing
dotnet new web --no-https --output MySolution/MyProject --framework net7.0
# create a minimum web project at MySolution/Myproject, using runtime 7.0, without https supports
dotnet new sln -o MySolution
# create a solution file 
dotnet sln MySolution add MySolution/MyProject 
```

Use VS Code:
Open Solution folder 

(Optional)
Use Visual Studio:
Open Solution file

Create `wwwroot` folder and add HTML file named `demo.html`, 
```bash
# MySolution\MyProject
dotnet build 
dotnet run 
```

## using the hot reload features
Instead of dotnet run, we use
```bash
dotnet watch
```
This will reflect static content only, but not code in the RT(I guess).

