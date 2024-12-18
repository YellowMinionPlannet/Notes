# 22 Client-Side Storage

The goal to have a API to store browser's data locally is simple, local user's data should stay on user's machine.

## COOKIES

Cookies are originally created to store session information on the client.

They are sent by server through response.
```http
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value
Other-header: other-header-value
```

In the above example, `Set-Cookie` response header is used to set cookie with name of "name" and value of "value". Remember that name and value are URL-encoded.

And browser can send cookie back to server by following message:

```http
GET /index.jsl HTTP/1.1
Cookie: name=value
Other-header: other-header-value
```

### Restrictions

Cookies are set to a specific domain, they are sent along with requests to the same domain from which it is created. This assure cookies cannot be accessed by other domains.

There are size limits for cookies:
- 300 cookies total
- 4096 bytes per cookie
- 20 cookies per domain, vary among browsers, but do NOT exceeds 60 per domain
- 81920 bytes per domain

**Important**: Cookie will be silently droped if you exceeds the Max size of cookie.

### Cookie Parts
- Nmae, unique name to identify a cookie, name is case-insensitive.
- Value, 
- Domain, if not set, then it's same as the domain when it is set(from the server), `.wiley.com` means all subdomains from wiley.com is valid.
- Path, to specify a path under the domain where this cookie would be sent
- Expiration, this value should be formatted as Wdy, DD-Mon-YYYY HH:MM:SS GMT, if this value is future value, then the cookie will be persisted until then, if this value is past value, then the cookie will be deleted as browser closed.
- Secure flag, if specified, then only SSL connection is sending the cookie.
d

Example of Cookie parts:
```http
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; expires=Mon, 22-Jan-07 07:10:24 GMT; domain=.wiley.com
Other-header: other-header-value
```

### Cookies in JavaScript
Usage of `document.cookie` needs cautions. If the name of cookie already existed, it will overwrite it.

```js
document.cookie = encodeURIComponent("name") + "=" + encodeURIComponent("Matt") + "; domain=.wiley.com; path=/"
```
There are libraries for manipulate cookies from browser, for example, `js-cookie` in NPM.

### Cookie Considerations

HTTP-only cookie cannot be accessed by Javascript.

## WEB STORAGE

The purpose of Web Storage is to overcome limitations of cookies, and store data across sessions.

### The `Storage` Type

There are methods exposed by this type:
- `clears()`, Remove all values
- `getItem(name)`, Retrieves value for the given name
- `key(index)`, Retrieve name of the value in the numeric position
- `removeItem(name)`, remove the name-value pair
- `setItem`, Sets the value for the given name.

Since every item stored as property, you can also use dot or brackets notations.

You can use `length` property to determine how many name-value pairs.

### The `sessionStorage` Object

sessionStorage cannot be used when browser to the domain, or browser running locally. 

Any writing action is synchronous operation, you can read immediately after writting.

### The `localStorage` Object

localStorage must be accessed within the page with same domain, same protocal and same port.

The difference is localstorage will be persisted on the machine until user clear the caches.

### The `storage` Event
```js
//will trigger whenever the storage is updated
window.addEventListener("storage", (event) => alert("storage changed for ${event.domain}"));
```

### Limits and Restrictions

## INDEXEDDB
