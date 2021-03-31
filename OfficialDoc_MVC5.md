# Guidance
## Getting Started
### Geting Started with ASP.NET MVC 5
#### Adding a Controller

* **M**odels: Data
* **V**iews: Template files that dynamically generate HTML responses
* **C**ontrollers: Handle requests, CRUD data and specify view to return as a response

*First taste of routing*
If we add a empty controller called HelloWorldController as stated below:
```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OfficialDocTest.Controllers
{
    public class HelloWorldController : Controller
    {
        // GET: HelloWorld
        public ActionResult Index()
        {
            return View();
        }

        public string Welcome(string name, int ID = 1)
        {
            return $"{name} : {ID}";
        }
    }
}
```
* visit https://localhost:xxxxx/helloworld
    We hit Index() method and since there's no view created, we would get an error.
* visit https://localhost:xxxxx/helloworld/welcome
    We hit Welcome method and would display
    > : 1
* visit https://localhost:xxxxx/helloworld/welcome?name=<script>alert("oops!")</script>
    We would get an error triggered by request validation mechanism.
    
*Further Reading*
Script Exploits
> *https://docs.microsoft.com/en-us/previous-versions/aspnet/w1sw53ds(v=vs.100)*
> ASP.NET performs request validation against query-string and form variables as well as cookie values. By default, if the current Request contains HTML-encoded elements or certain HTML characters (such as \&#151; for an em dash), the ASP.NET page framework raises an error.

However we can override this behavior by code below:
```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Util;

namespace OfficialDocTest.Util
{
    //https://docs.microsoft.com/en-us/dotnet/api/system.web.util.requestvalidator?view=netframework-4.8
    public class ScriptExploitsValidator : RequestValidator
    {
        protected override bool IsValidRequestString(
        HttpContext context, string value,
        RequestValidationSource requestValidationSource, string collectionKey,
        out int validationFailureIndex)
        {
            validationFailureIndex = -1;
            return true;
        }
    }
}
add this snippet to Web.config file.
<httpRuntime targetFramework="4.7.2" 
requestValidationType="OfficialDocTest.Util.ScriptExploitsValidator" /> 
```

To avoid script expoits, we should encode string from user's input and also encode string after retrieve suspected string from database and pass it to response.
```c#
using System;
using System.Web;
using System.IO;

class MyNewClass
{
    public static void Main()
    {
        Console.WriteLine("Enter a string having '&', '<', '>' or '\"' in it: ");
        string myString = Console.ReadLine();

        // Encode the string.
        string myEncodedString = HttpUtility.HtmlEncode(myString);

        Console.WriteLine($"HTML Encoded string is: {myEncodedString}");
        StringWriter myWriter = new StringWriter();

        // Decode the encoded string.
        HttpUtility.HtmlDecode(myEncodedString, myWriter);

        string myDecodedString = myWriter.ToString();
        Console.Write($"Decoded string of the above encoded string is: {myDecodedString}");
    }
}
```
Also browse
*https://docs.microsoft.com/en-us/previous-versions/aspnet/a2a4yykt(v=vs.100)?redirectedfrom=MSDN*

#### Adding a View

**ActionResult Type**
It's the base type of Action method return type. There are several types inherited from this type and are able to cover most of usecases in practice.
*https://docs.microsoft.com/en-us/dotnet/api/system.web.mvc.actionresult?redirectedfrom=MSDN&view=aspnet-mvc-5.2*
* System.Web.Mvc.ContentResult
* System.Web.Mvc.EmptyResult
* System.Web.Mvc.FileResult
* System.Web.Mvc.HttpStatusCodeResult
* System.Web.Mvc.JavaScriptResult
* System.Web.Mvc.JsonResult
* System.Web.Mvc.RedirectResult
* System.Web.Mvc.RedirectToRouteResult
* System.Web.Mvc.ViewResultBase

##### Changing Views and Layout Page
The Structure of HTML returned by action method.
1. First execute contents in *~/Views/Shared/_ViewStart.cshtml* 
2. Then render *~/Views/xxxxx/xxxxx.cshtml*
3. Then render *~/Views/Shared/Layout.cshtml*
**Need further proof**

* Therefore we can write common stuff in *_ViewStart.cshtml* and share the stuff in every page. For example, we do not need to provide Layout property since it's set in *_ViewStart.cshtml* file.
* Step 2 content will put in @RenderBody() part of *_Layout.cshtml*, and ASP.NET will put body tag arround the content.

>*https://docs.microsoft.com/en-us/aspnet/mvc/overview/getting-started/introduction/adding-a-view* 
>A best practice: A view template should never perform business logic or interact with a database directly.
>Maintaining this "separation of concerns" helps keep your code clean, testable and more maintainable

##### Passing Data from the Controller to the View
There are 3 Properties in ControllerBase can be used to pass data.
1. TempData
2. ViewBag
3. ViewData

Following code snippet shows how to pass data using ViewBag which is a dynamic type property in ControllerBase.

HelloWorldController.cs
```c#
 public ActionResult Welcome(string name, int numTimes)
{
    ViewBag.name = name;
    ViewBag.numTimes = numTimes;
    return View();
}
```
Welcome.cshtml
```c#
@for(int i = 0; i < ViewBag.numTimes; i++)
{
    <p>This is @ViewBag.name,</p>
    <text>
        <p>I already repeated @ViewBag.name for @i times!</p>
        <p>Total in @ViewBag.numTimes!</p>
    </text>
}
```


*Further Reading*
FormCollection Type and Model Binding
**FormCollection**

FormCollection can be used as parameter in action method.

**Model Binding**
> *https://docs.microsoft.com/en-us/previous-versions/dd410405(v=vs.90)?redirectedfrom=MSDN*
> A model binder in MVC provides a simple way to map posted form values to a .NET Framework type and pass the type to an action method as a parameter. Binders also give you control over the deserialization of types that are passed to action methods. Model binders are like type converters, because they can convert HTTP requests into objects that are passed to an action method. However, they also have information about the current controller context.

Types implement *IModelBinder* can be used as binders in Controller Type. And there are *Binders* property in Controller Type to store these binders and corresponding Types to work with.

*DefaultModelBinder* class maps a browser request to a data object. This class provides a concrete implementation of a model binder.
*https://docs.microsoft.com/en-us/dotnet/api/system.web.mvc.defaultmodelbinder?redirectedfrom=MSDN&view=aspnet-mvc-5.2*

When request is sent by a client, ASP.NET will populate the information in HTTP Request into HttpRequest instance which can be retrieved from Controller's Request Property.

There are 4 main collection of information to use.
1. QueryString
    Variables populated from url
2. Form
    Variables populated when request content-type is 
*application/x-www-form-urlencoded* or *multipart/form-data*
3. Cookies
    Request's `Cookie` header
    or
    Response `Set-Cookie` header
4. ServerVariables
    Other valuable but distrust information in the request.
    
    Read more about Writing Secure Code in Website
    *https://docs.microsoft.com/en-us/previous-versions/iis/6.0-sdk/ms525871(v=vs.90)*
    and Book
    *Writing Secure Code*