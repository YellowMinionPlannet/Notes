# Guidance
## Getting Started
### Getting Started with Web API2 (C#)
### Action Results in Web API 2
|Return type|How Web API creates the response|
|-|-|
|void|Return empty 204(No Content)|
|HttpResponseMessage|Convert directly to an HTTP response message|
|IHttpActionResult|Call ExecuteAsynce to create an HttpResponseMessage, then convert to an Http response messge|
|Other type|Write the serialized return value into the response body; return 200(OK)|

#### HttpResponseMessage
```c#
public class ValuesController : ApiController
{
    public HttpResponseMessage Get()
    {
        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, "value");
        response.Content = new StringContent("hello", Encoding.Unicode);
        response.Headers.CacheControl = new CacheControlHeaderValue()
        {
            MaxAge = TimeSpan.FromMinutes(20)
        };
        return response;
    } 
}
```
If we pass a object to the *CreateResponse* method, then API will use default *Media Formatter* to serialize that object. 
```c#
public HttpResponseMessage Get()
{
    // Get a list of products from a database.
    IEnumerable<Product> products = GetProductsFromDB();

    // Write the list to the response body.
    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, products);
    return response;
}
```
How the WebAPI choose Medida Formatter depends on the process *Content Negotiation*.

**Content Negotiation**
Content Negotiation is defined in RFC 2616. **Further Reading Required**

In Short, the primary mechanism for content negotiation are these request headers:
* Accept
* Accept-Charset
* Accept-Encoding
* Accept-Language
When there's a X-Requested-With header(included in request for Ajax) and no Accept header included, WebAPI would use JSON.

WebAPI's decision is based on Accept or Accept-Charset header.(no built-in support for Accept-Encoding or Accept-Language)

When client request has 
```
Accept: application/json, */*
```
You can simply set action method's  return type to domain model or HttpResponseMessage.
```c#

//Domain Model Type
public Product GetProduct(int id)
{
    var item = _products.FirstOrDefault(p => p.ID == id);
    if (item == null)
    {
        throw new HttpResponseException(HttpStatusCode.NotFound);
    }
    return item; 
}
//HttpResponseMessage Type
public HttpResponseMessage GetProduct(int id)
{
    var item = _products.FirstOrDefault(p => p.ID == id);
    if (item == null)
    {
        throw new HttpResponseException(HttpStatusCode.NotFound);
    }
    return Request.CreateResponse(HttpStatusCode.OK, item);
}
```
Both way will result in serilization the returned object to JSON, and the seconde way has more control on the content of repsonse message, such as setting headers and stuff.

WebAPI provides default media formatters for XML and JSON. It's possible for developer to customize media formatter through inheritance of MediaTypeFormatter class.

To customize media formatter, please see
*https://docs.microsoft.com/en-us/aspnet/web-api/overview/formats-and-model-binding/media-formatters*

Before the process of populating info into response message
1. pipeline will get IContentNegotiator from HttpConfiguration and the media formatters from HttpConfiguration.Formatters.
2. calls IContentNegotiator.Negotiate by passing in:
    * type of object to serialize
    * collection of media formatters
    * the HTTP request
3. return:
    * which formatter to use
    * media type for the response
If there's no formatter is suitable, then return 406(Not Acceptable)

Following code shows how WebAPI does negotiation automatically, we might use this to check the result of negotiation.
```c#
public HttpResponseMessage GetProduct(int id)
{
    var product = new Product() 
        { Id = id, Name = "Gizmo", Category = "Widgets", Price = 1.99M };

    IContentNegotiator negotiator = this.Configuration.Services.GetContentNegotiator();

    ContentNegotiationResult result = negotiator.Negotiate(
        typeof(Product), this.Request, this.Configuration.Formatters);
    if (result == null)
    {
        var response = new HttpResponseMessage(HttpStatusCode.NotAcceptable);
        throw new HttpResponseException(response));
    }

    return new HttpResponseMessage()
    {
        Content = new ObjectContent<Product>(
            product,		        // What we are serializing 
            result.Formatter,           // The media formatter
            result.MediaType.MediaType  // The MIME type
        )
    };
}
```
How Default Content Negotiatior Works
1. Verify if formatter is able to serialize the returned type by calling *CanWriteTpye* method on the media formatter
2. Looks for media type by checking *SupportedMediaTypes* collection and *MediaTypeMappings* collection

* If there are multiple match, check the Accept header
For example,
```
Accept: application/json, application/xml; q=0.9, */*; q=0.1
```
which provides:
|MIME type| Quality Factor|
|-|-|
|application/json|1.0|
|application/xml|0.9|
|\*/\*|0.1|
As result, the biggest quality factor MIME type wins.

* If no match, negotiator check request body. eg, if request contains JSON data, negotiator looks for JSON formatter.
* If no match, first formatter that can serialize the type wins.

3. Check SupportedEncodings on formatter to match against Accept-Charset header.

**Media Fomatter**
In response message, *content-type* header describe the media type in response body.

In request message, *Accept* header describe the media type requested by the client.

After *Content-Negotiation*, *Media Formatter* is chosen and then do the job of serialization of the action result.

**Example: Creating a CSV Media Formatter**
```c#
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using ProductStore.Models;

namespace ProductStore.Formatters
{
    public class ProductCsvFormatter : BufferedMediaTypeFormatter
    {
        //Used in Content Negotiation procedure
        SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/csv"));
    }
    public override bool CanWriteType(System.Type type)
    {
        if (type == typeof(Product))
        {
            return true;
        }
        else
        {
            Type enumerableType = typeof(IEnumerable<Product>);
            return enumerableType.IsAssignableFrom(type);
        }
    }
    public override bool CanReadType(Type type)
    {
        return false;
    }
    public override void WriteToStream(Type type, object value, Stream writeStream, HttpContent content)
    {
        using (var writer = new StreamWriter(writeStream))
        {
            var products = value as IEnumerable<Product>;
            if (products != null)
            {
                foreach (var product in products)
                {
                    WriteItem(product, writer);
                }
            }
            else
            {
                var singleProduct = value as Product;
                if (singleProduct == null)
                {
                    throw new InvalidOperationException("Cannot serialize type");
                }
                WriteItem(singleProduct, writer);
            }
        }
    }

    // Helper methods for serializing Products to CSV format. 
    private void WriteItem(Product product, StreamWriter writer)
    {
        writer.WriteLine("{0},{1},{2},{3}", Escape(product.Id),
            Escape(product.Name), Escape(product.Category), Escape(product.Price));
    }

    static char[] _specialChars = new char[] { ',', '\n', '\r', '"' };

    private string Escape(object o)
    {
        if (o == null)
        {
            return "";
        }
        string field = o.ToString();
        if (field.IndexOfAny(_specialChars) != -1)
        {
            // Delimit the entire field with quotes and replace embedded quotes with "".
            return String.Format("\"{0}\"", field.Replace("\"", "\"\""));
        }
        else return field;
    }
    
    
}
```
To add *media formatter* into pipeline
```c#
public static void ConfigureApis(HttpConfiguration config)
{
    config.Formatters.Add(new ProductCsvFormatter()); 
}
```
#### IHttpActionResult

Every type inherits from IHttpActionResult has a method called *ExecuteAsync*. They call this to produce a HttpResponseMessage instance at the end.

Code Snippet
```c#
public class TextResult : IHttpActionResult
{
    string _value;
    HttpRequestMessage _request;

    public TextResult(string value, HttpRequestMessage request)
    {
        _value = value;
        _request = request;
    }
    public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
    {
        var response = new HttpResponseMessage()
        {
            Content = new StringContent(_value),
            RequestMessage = _request
        };
        return Task.FromResult(response);
    }
}
```
### Creating Web API Help Pages

## Routing
### Routing in Web API
#### Routing Tables
Defaut Route
```c#
routes.MapHttpRoute(
    name: "API Default",
    routeTemplate: "api/{controller}/{id}",
    defaults: new { id = RouteParameter.Optional }
);
```
Following request url will be matched and go in the default route table
```
/api/contacts
/api/contacts/1
/api/contacts/gizmo1
```
After default route is chosen:
1.look for controller name match the variable in default route's {controller} part
2. looks at the HTTP verb name
    eg. if it's a GET request, will look for action method name prefix is Get.
    this rule applis to GET, POST, PUT, DELETE, HEAD, OPTIONS, and PATCH verbs
3. Other variable in route template, such as {id}

Example Table
```c#
public class ProductsController : ApiController
{
    public IEnumerable<Product> GetAllProducts() { }
    public Product GetProductById(int id) { }
    public HttpResponseMessage DeleteProduct(int id){ }
}
```
Action that will be selected by URI Path provided
|HTTP Verb| URI Path|Action|Parameter|
|-|-|-|-|
|GET|api/products|GetAllProducts||
|GET|api/products/4|GetAllProductById|4|
|DELETE|api/products/4|DeleteProduct|4|
|POST|api/products|NO MATCH||

#### Routing Variations
##### HTTP verbs
```
[HttpGet]
[HttpPut]
[HttpPost]
[HttpDelete]
[HttpHead]
[HttpOptions]
[HttpPatch]
[AcceptVerbs("GET", "HEAD")]
```
##### Routing by Action Name
```c#
routes.MapHttpRoute(
    name: "ActionApi",
    routeTemplate: "api/{controller}/{action}/{id}",
    defaults: new { id = RouteParameter.Optional }
);


public class ProductsController : ApiController
{
    [HttpGet]
    [ActionName("Thumbnail")]
    public HttpResponseMessage GetThumbnailImage(int id);

    [HttpPost]
    [ActionName("Thumbnail")]
    public void AddThumbnailImage(int id);
}
```
##### Non-Actions
```c#
// Not an action method.
[NonAction]  
public string GetPrivateData() { ... }
```
### Routing and Action Selection in ASP.NET Web API
```c#
routes.MapHttpRoute(
    name: "DefaultApi",
    routeTemplate: "api/{controller}/{category}",
    defaults: new { category = "all" }
);
```
#### Route Template
RouteTemplate is formatted as
```
api/{controller}/public/{category}/{id}
```
It is similar as URI, but it can holds placeholders which are included in curly braces.

When creating a route, you can
1. set defaut values to placeholders.
```C#
defaults: new {category = "all"}
```
2. provide contraints about placeholders
```c#
constraints: new { id = @"\d+" } // Only matches if "id" is one or more digits.
```
When doing the route match, framework does not look at host and query part of URI. Framework will match the values in URI to placeholders according to the constraints, and will select the first route that matches the URI in the route table.
NOTE: When do the matching, palceholder matches any value.

There are 2 special placeholders
1. controller
2. action

#### Defaults (Default Values in Route)
If you provide *Defaults*, framework will match a "missing part" URI to the route which has *Defaults* for that "missing part"

For example,

http://localhost/api/products/all and http://localhost/api/products
matches
```C#
routes.MapHttpRoute(
    name: "DefaultApi",
    routeTemplate: "api/{controller}/{category}",
    defaults: new { category = "all" }
);
```
The second URI's "category" is missing, but we match that in route because there's *Default* for "category". 

#### Route Dictionary
Once URI is matched, the placeholder's corresponding URI parts will be stored into *IHttpRouteData* object.

> IHttpRouteData type property is included in HttpControllerContext 

In *Defaults*, you can assign *RouteParameter.Optional* to placeholder, if placeholder is missing from URI and defaults value(*RouteParameter.Optional*) assign to the placeholder, then the placeholder's value is not added to the Dictionary mentioned above.
For Example:
```c#
routes.MapHttpRoute(
    name: "DefaultApi",
    routeTemplate: "api/{controller}/{category}/{id}",
    defaults: new { category = "all", id = RouteParameter.Optional }
);
```
Then URI 
```
api/products
```
will contains following dictionary values:
```
{
controller: products
category: all
//no id for key and value
}
```
If in route template, there's no placeholder, but you set a property in *Defaults*. Then the property in *Defaults* will be added to the dictionary automatically.
For example
```c#
routes.MapHttpRoute(
    name: "Root",
    routeTemplate: "api/root/{id}",
    defaults: new { controller = "customers", id = RouteParameter.Optional }
);
```

```
api/root/8
``` 
will contains
```
{
controller: customers
id: 8
}
```

#### Selecting a Controller
Framework look into the dictionary
1. find "controller" value
2. concat "Controller" at the end of step1 value
3. look for type name equals to step2 value

If no type or multiple type found, raise an error.
In step 3, framework uses *DefaultControllerSelector*'s
*IHttpControllerTypeResolver* to return a collection of 
1. public class
2. *IHttpController*'s implementation
3. not abstract
4. class name ends with "Controller"

#### Action Selection
Fist, we use algorithm to decide which action method wins. Second, we do the parameter bindings.

**The Algorithm**
1. Create a list of all actions on the controller that match the HTTP request method.
2. If the route dictionary has an "action" entry, remove all actions whose name does not match this value.
3. Try match action parameters to the URI
    a. For each action, get a list of the parameters that are simple type, where the binding gets the parameter from the URI. **Exclude optional parameters**.
    b. From this list, try to find a match for each parameter name, either in the route dictionary or in the URI query string.Matches are **case insensitive** and do not depend on the parameter order
    c. Select an action where every parameter in the list has a match in the URI
    d. If more that one action meets these criteria, pick the one with the most parameter matches.
4. Ignore actions with the [NonAction] attribute.

NOTE:
* step1: When creating the list methods such as constructors, events, operator overloads, and property get/set are excluded. Methods inherited from the *ApiController* class get excluded too. So parameter with simple type targeting RequestBody will be excluded too.
* step3-a: Simple type is described in *.NET Framework primitive types* plus DateTime, Decimal, Guid, String, and TimeSpan. 
* step3-c: Action with 0 parameter in the list get included automatically
* **By default**, Web API find parameter of simply type through URI, except you specify [FromBody] attribute infront of parameter.

#### Extended Example
```c#
routes.MapHttpRoute(
    name: "ApiRoot",
    routeTemplate: "api/root/{id}",
    defaults: new { controller = "products", id = RouteParameter.Optional }
);
routes.MapHttpRoute(
    name: "DefaultApi",
    routeTemplate: "api/{controller}/{id}",
    defaults: new { id = RouteParameter.Optional }
);

public class ProductsController : ApiController
{
    public IEnumerable<Product> GetAll() {}
    public Product GetById(int id, double version = 1.0) {}
    [HttpGet]
    public void FindProductsByName(string name) {}
    public void Post(Product value) {}
    public void Put(int id, Product value) {}
}
```
```
GET http://localhost:34701/api/products/1?version=1.5&details=1
```
**Result**
* Route Matching
"DefaultApi" wins, because placeholder can match any value.
* Controller Selection
"ProdcutsController" wins
* Action Selection
1. GET actions collected:
    GetAll, GetById, FindProductsByName
2. no "action" entry
3. 
|Action|Parameters to Match|Matched|
|-|-|-|
|GetAll|none|Included automatically|
|GetById|"Id"|1 matched (Id)|
|FIndProductsByName|"name"|0 matched|

You get following parameter info when you are in action method
```
id = 1
version = 1.5 //binded in parameter binding, however ignored when do action selection
```
#### Extension Points
```c#
var config = GlobalConfiguration.Configuration;
config.Services.Replace(typeof(IHttpControllerSelector), new MyControllerSelector(config));
```

### Attribute Routing in ASP.NET Web API 2
#### Why Attribute Routing
Using convention-based routing needs to place route template in one place and it's hard to achieve RESTful API pattern.

#### Enabling Attribute Routing
```c#
public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        // Attribute routing.
        config.MapHttpAttributeRoutes();

        // Convention-based routing.
        config.Routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
        );
    }
}
```
#### Route Prefixes
```C#
public class BooksController : ApiController
{
    [Route("api/books")]
    public IEnumerable<Book> GetBooks() { ... }

    [Route("api/books/{id:int}")]
    public Book GetBook(int id) { ... }

    [Route("api/books")]
    [HttpPost]
    public HttpResponseMessage CreateBook(Book book) { ... }
}

[RoutePrefix("api/books")]
public class BooksController : ApiController
{
    // GET /api/authors/1/books
    [Route("~/api/authors/{authorId:int}/books")]
    public IEnumerable<Book> GetByAuthor(int authorId) { ... }

    // ...
}
```
We use *RoutePrefix* attribute on controller to add prefix to the beginning of every *Route* attribute. However, we can use "~" to ignore this pattern.


#### Route Constraints
|Constraint	|Description	|Example|
|-|-|-|
|alpha|	Matches uppercase or lowercase Latin alphabet characters (a-z, A-Z)|	{x:alpha}|
|bool|	Matches a Boolean value.|	{x:bool}|
|datetime|	Matches a DateTime value.|	{x:datetime}|
|decimal|	Matches a decimal value.|	{x:decimal}|
|double|	Matches a 64-bit floating-point value.|	{x:double}|
|float|	Matches a 32-bit floating-point value.|	{x:float}|
|guid|	Matches a GUID value.|	{x:guid}|
|int|	Matches a 32-bit integer value.|	{x:int}|
|length|	Matches a string with the specified length or within a specified range of lengths.|	{x:length(6)} {x:length(1,20)}|
|long|	Matches a 64-bit integer value.|	{x:long}|
|max|	Matches an integer with a maximum value.|	{x:max(10)}|
|maxlength|	Matches a string with a maximum length.|	{x:maxlength(10)}|
|min|	Matches an integer with a minimum value.|	{x:min(10)}|
|minlength|	Matches a string with a minimum length.|	{x:minlength(10)}|
|range|	Matches an integer within a range of values.|	{x:range(10,50)}|
|regex|	Matches a regular expression.|	{x:regex(^\d{3}-\d{3}-\d{4}$)}|

#### Custom Route Constraints
You can create a type that inherit *IHttpRouteConstraint* interface to customize the constraint.

```c#
public class ValidAccountConstraint : IHttpRouteConstraint
    {
        public bool Match(HttpRequestMessage request, IHttpRoute route, string parameterName, IDictionary<string, object> values, HttpRouteDirection routeDirection)
        {
            object value;
            if (values.TryGetValue(parameterName, out value) && value != null)
            {
                var accountId = value as string;
                if(!string.IsNullOrEmpty(accountId))
                {
                    return IsValidAccount(accountId);
                }
            }
            return false;
        }
        public bool IsValidAccount(string sAccount)
        {
            return (!String.IsNullOrEmpty(sAccount) &&
                sAccount.StartsWith("1234") &&
                sAccount.Length > 5);
        }
    }
    
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            //config.MapHttpAttributeRoutes();

            var constraintResolver = new DefaultInlineConstraintResolver();
            constraintResolver.ConstraintMap.Add("validAccount", typeof(APITest.Utils.ValidAccountConstraint));

            config.MapHttpAttributeRoutes(constraintResolver);

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);
        }
    }
    
    public class ValuesController : ApiController
    {
       
        [HttpGet, Route("values/{accountId:validAccount}")]
        public IHttpActionResult GetAccount(string accountId)
        {
            return Ok(accountId);
        }
        
    }
```

The reason we are using this because we might need constraint on parameter with *enum* type. 

Using constraints on parameter can resolve lots of security issues.
**Further Reading on Udemy Course - Security Issues**
>By doing this validation at the routing layer, we've created a scenario where the reponse is different depending on whether the account ID is valid or not.  Without some infrastructure protection such as an application gateway or firewall, an attacker might now have a valuable tool for discovering valid account IDs by using brute force techniques.  He can call the service over and over, incrementing the account ID, and any HTTP status code 404s returned tell him which accounts are invalid.  Any 200s are valid accounts.
>We could potentially solve these issues at the infrastructure layer.  For example if this service were purely internal, not public facing, and if we guaranteed that it was internal using our network firewalls, then it's not necessarily a problem depending on the situation.  An application gateway could additionally limit requests from particular IP addresses to disallow large numbers of brute force requests. Intrusion prevention devices could notice the large number of requests, especially ones getting 404s, and cut off the attacker's communication to our service. 
>Another issue might be the parameter itself and how we validated it in a real world scenario.  If the validation required a database call, we would probably need to do a lot more checking of the parameter first to ensure it is the right length and white list the character set, plus make sure our database queries were parameterized, to avoid SQL injection attacks; a regular expression check could be used to verify the integrity of the account parameter itself (either in our external account validation method, or as an initial piece of the route constraint, e.g {accountId:regex(...):validAccount}.
>You should always be thinking about both of these issues when you are doing constraints at the routing layer, since attackers specifically look for places where they get variable results depending on values sent. In the end you might opt for more trivial checks in the route (like simple length and character set), and leave deeper checks for the action method logic.  Just be sure you don't recreate the same issue in the action method (i.e. returning variable information to the caller for security-sensitive parameters that informs an attacker of valid and invalid values), and make sure you and your DevOps team understand what infrastructure security you need for your service. 
>Of course not all parameters are security-sensitive, and where they are not this sort of validation is perfectly fine.


#### Route Names
```c#
public class BooksController : ApiController
{
    [Route("api/books/{id}", Name="GetBookById")]
    public BookDto GetBook(int id) 
    {
        // Implementation not shown...
    }

    [Route("api/books")]
    public HttpResponseMessage Post(Book book)
    {
        // Validate and add book to database (not shown)

        var response = Request.CreateResponse(HttpStatusCode.Created);

        // Generate a link to the new book and set the Location header in the response.
        string uri = Url.Link("GetBookById", new { id = book.BookId });
        response.Headers.Location = new Uri(uri);
        return response;
    }
}

```
We do use this feature for Self-Referencing URLs.

#### Optional URI Parameters and Default Values
```c#
public class BooksController : ApiController
{
    [Route("api/books/locale/{lcid:int?}")]
    public IEnumerable<Book> GetBooksByLocale(int lcid = 1033) { ... }
}

public class BooksController : ApiController
{
    [Route("api/books/locale/{lcid:int=1033}")]
    public IEnumerable<Book> GetBooksByLocale(int lcid) { ... }
}
```

#### Route Order
1. Compare the Order property of the route attribute.
2. Look at each URI segment in the route template. For each segment, order as follows:
    a. Literal segments.
    b. Route parameters with constraints.
    c. Route parameters without constraints.
    d. Wildcard parameter segments with constraints.
    e. Wildcard parameter segments without constraints.
3. In the case of a tie, routes are ordered by a case-insensitive ordinal string comparison (OrdinalIgnoreCase) of the route template.

```c#
[RoutePrefix("orders")]
public class OrdersController : ApiController
{
    [Route("{id:int}")] // constrained parameter
    public HttpResponseMessage Get(int id) { ... }

    [Route("details")]  // literal
    public HttpResponseMessage GetDetails() { ... }

    [Route("pending", RouteOrder = 1)]
    public HttpResponseMessage GetPending() { ... }

    [Route("{customerName}")]  // unconstrained parameter
    public HttpResponseMessage GetByCustomer(string customerName) { ... }

    [Route("{*date:datetime}")]  // wildcard
    public HttpResponseMessage Get(DateTime date) { ... }
}
```
The order means when routing look at the action they will look at following order to compare action route to the URLs.
1. orders/details
2. orders/{id}
3. orders/{customerName}
4. orders/{\*date}
5. orders/pending

For example:
look at orders/details if matched with url
then look at orders/{id} if matched with url 
etc.
## Advanced Topics
### Configuring Web API 2