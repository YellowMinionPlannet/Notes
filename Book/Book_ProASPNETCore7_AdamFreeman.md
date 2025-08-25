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

## 4.4 Managing Packages
```bash
# MySolution\MyProject
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 7.0.0
```
`.csproject` is to track packages.

```bash
# use this to list packages
dotnet list package

# to remove package
dotnet remove package Microsoft.EntityframeworkCore.SqlServer

# to manage tool package
dotnet tool uninstall --global dotnet-ef
dotnet tool install --global dotnet-ef --version 7.0.0

dotnet tool install --global Microsoft.Web.LibraryManager.Cli --version 2.1.175
libman init -p cdnjs
libman install bootstrap@5.2.3 -d wwwroot/lib/bootstrap
```

```html
<!-- wwwroot\demo.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
    <link href="/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body>
    <h3 class="bg-primary text-white text-center p-2">New Message</h3>
</body>
</html>
```

# 4.5 Debugging projects
[visual studio debugger documentation](https://docs.microsoft.com/en-us/visualstudio/debugger)
[visual studio code debugger documentation](https://code.visualstudio.com/docs/editor/debugging)

# 5 Essential C# Features
```C#
// to use anonymous type object property
var products = new []{
    new { Name = "Kayak", Price = 275M},
    new { Name = "Lifejacket", Price = 48.95M},
}

products.Select(p => p.GetType().Name);

// to use extension methods
public static class MyExtensionMethods{
    public static decimal TotalPrices(this ShoppingCart cart){
        decimal total = 0;
        if (cart.Products != null){
            foreach(Product? prod in cart.Products){
                total += prod?.Price ?? 0;
            }
        }
        return total;
    }
}

var shoppingCart = new ShoppingCart();
decimal total = shoppingCart.TotalPrices();
```

## 5.13 Using asynchronous methods
