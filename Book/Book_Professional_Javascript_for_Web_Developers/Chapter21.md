# 21 Network Requests and Remote Resources
## THE FETCH API
[Standard](https://fetch.spec.whatwg.org)

It's about requesting resources and transmitting data in JS. And, it's also relevent for intercepting, redirecting, and altering requests.

### Basic API Utilization
`fetch()` method is available in primary page execution, modules, and inside workers. 

#### Dispatching a Request
The **required** parmameter input is the URL of the resource you wish to fetch. URL is relative address.

#### Reading a Response
```js
let r = fetch('/bar');
console.log(r); // Promise

r.then((response) =>{
    console.log(response); // Response type
    response.text();
})
.then((data) => console.log(data); ); // Reading Response
```

#### Handling Status Codes and Request Failures

```js

fetch('/bar')
.then((response) => {
    console.log(response.status); // 200
    console.log(response.statusText); // OK
})
```

**Be cautious about redirect behavior**
```js
// Default behavior is to follow the redirect until reaching a terminal URL.
// So this fetch is actually incuring at least 2 round trip network requests;
// For example, from /permanent-redirect To the redirected url
fetch('/permanent-redirect')
.then((response) => {
    console.log(response.status); //200
    console.log(response.statusText); //OK
    console.log(response.redrected); // true
})

```
***Be Cautious:***
If the server responds 500 internal error, the fetch API's resolve handler is still being executed, because the network has completed.

If the browser does not receive a server response, then the reject handler got executed.

The reason for fetch reject:
1. CORS violations
2. lack of connection to a network
3. HTTPS violations
4. other browser/network policy violations.

The full url could be inspected through `url` property from fetch's resolved response.

```js
fetch('/qux')
.then((response) => {
    console.log(response.url); // https://foo.com/qux
})
```

#### Custom Fetch Options
As default, `fetch()` will set the minimal request headers and send a GET request.

Customization can be achieved by setting the second argument of `fetch()` method.

The second argument, called `init` object, could be populated with:

|KEY|VALUE|
|-|-|
|body|To specify body field for requests. Must be any Blob, BufferSource, FormData, URLSearchParams, ReadableStream, or, String instance|
|cache|*default, no-store, reload, no-cache, force-cache, only-if-cached,* where default value is *default*|
|credentials|To specify if and how cookies should be included with outgoing request. *omit, same-origin, include*, where *omit* means no cookies sent, *same-origin* means send cookies when orgin of script match up with request url origin, *include* means cookies are always included, default value is *same-origin*|
|headers|To specify headers. Either `Headers` object or Key-Value String pairs|
|integrity|To enforce subresource integrity, default value is empty string|
|keepalive|Allow request to exist beyond the page's lifetime. Default value is *false*|
|method|...|
|...|...|

### Common Fetch Patterns
#### Sending JSON Data
```js
let payload = JSON.stringify({foo: 'bar'});

let jsonHeaders = new Headers({
    'Content-Type': 'application/json'
});

fetch('send-me-json', {
    method: 'POST',
    body: payload,
    headers: jsonHeaders
})
```

#### Sending Parameters in a Request Body
```js

let payload = 'foo=bar&baz=qux';
let paramHeaders = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
});

fetch('/send-meparams', {
    method: 'POST',
    body: payload,
    headers: paramHeaders
});
```

#### Sending Files
```js
let imageFormData = new FormData();
let imageInput = document.querySelector('input[type='file']');
imageFormData.append('image', imageInput.file[0]);
fetch('img-upload', {
    method: 'POST',
    body: imageFormData
})
```

#### Loading Files as Blobs
```js
const imageElement = document.querySelector('img');
fetch('my-image.png')
.then((response) => response.blob())
.then((blob) => {
    imageElement.src = URL.creageObjectURL(blob)
})

```

#### Sending a Cross-Origin Request
If you want to access response from cross-origin, you need to check the CORS policy. At min, you need response to be set with CORS headers.

If you don't need to access response from cross-origin, 

```js
fetch('//cross-origin.com', {
    method: 'no-cors',
})
.then((response) => console.log(response.type)); // opaque

```

#### Aborting Request
```js
let abortController = new AbortControlloer();

fetch('wikipedia.zip', {
    signal: abortController.signal
})
.catch(() => console.log('aborted!'));
// Abort the fetch after 10ms
setTimeout(() => abortController.abort(), 10);

//aborted!
```

### The Headers Object
