# 3 OAuth in Detail
## Authorization Code for Web Applications
![CodeFlow](./CodeFlow.png)
### Authorization Request
```
https://authserver.example.com/authorize
    ?response_type=code
    &client_id=apdsoifapsoidfu
    &redirect_uri=https://client.example.com/callback
    &state=xyz
    &scope=api1 api2.read
```
### Authorization Response
```
https://client.example.com/callback
    ?code=zcoivuqrelqewqiewur
    &state=xyz
```
### Token Request
```
POST /token HTTP/1.1
    Host: server.example.com
    Content-Type: application/x-www-form-urlencoded
    (Authorization: Basic qpoeiurqwer)

    client_id=asdfqwer
    &client_secret=zcxvwerqwer
    &grant_type=authorization_code
    &code=zcoivuqrelqewqiewur
    &redirect_uri=https://client.exaple.com/cb
```

Basic Authentication:
Base64(client_id : client_secret)

OAuth Style
Base64(urlformencode(client_id):urlformencode(client_secret))

Try these two types when you get a 401

### Token Response
```
HTTP/1.1 200 OK
    Content-Type: application/json
    {
        "access_token": "123asjvasd0jfadsf",
        "token_type": "Bearer",
        "expires_in": 3600,
        "scope": "api2.read"
    }
```
## Implicit Flow for Single Page Applications
### Authorization Request
![ImplicitFlow](./ImplicitFlow.png)

```
https://authserver.example.com/authorize
?response_type=token
&client_id=asldkjfqwer
&redirect_uri=https://client.example.com/callback
&state=xyz
&scope=read
```

***redirect_uri is registered ahead to make sure the implicit flow work***

### Authorization Response
```
https://client.example.com/callback
#access_token=pwoeqinrv
?token_type=example
&expires_in=3600
&state=xyz
```
### Security Concerns
* Access tokens exposed to resource owner, since the token is fragment of url
* Acess tokens accessible to Javascript
* use openid connect is much better 
* no cross domain(SPA and authorization server at different domain) token request, because the browser will block it
* Implicit flow is not recommended any more, use CORS + PKCE instead

## The Client Credentials Grant Type
![ClientCredential](./ClientCredentialFlow.png)

### Token Request
```
POST /token HTTP/1.1
    Host: server.example.com
    Content-Type: application/x-www-form-urlencoded
    Authorization: Basic zpoiqewr

grant_type=client_credentials
&scope=api1 api2.read
```

### Token Response
```
HTTP/1.1 200 OK
Content-Type: application/json
{
    "access_token": "jqowieruzcvn",
    "token_type": "Bearer",
    "expires_in": 3600,
    "scope": "api2.read"

}
```
## The Resource Owner Password Credentials (ROPC) Grant Type

```
POST /token HTTP/1.1
    Host: server.example.com
    Content-type: application/x-www-form-urlencoded
    Authorization: Basic zpouvwlqwer

    grant_type=password
    &username=johndoe
    &password=1234
    &scope=api2 api1.read
```

### Token Response
```
HTTP/1.1 200 OK
Content-Type: application/json
{
    "access_token": "12314adadg",
    "token_type": "Bearer",
    "expires_in": 3600,
    "scope": "api2.read"
}
```

## Long Lived Access with Refresh Tokens
### Authorization Request
```
https://authserver.example.com/authorize
    ?response_type=code
    &client_id=apqoiewru
    &redirect_uri=https://client.example.com/callback
    &state=xyz
    &scope=api1 api2.read offline_access
```

### Authorization Response
```
HTTP/1.1 200 OK
Content-Type: application/json
{
    "access_token": "12314adadg",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "zqewpirqwef;ijadsgj"
    "scope": "api2.read offline_access"
}
```

### Refresh Token Request
```
POST /token HTTP/1.1
    Host: server.example.com
    Content-type: application/x-www-form-urlencoded
    Authorization: Basic zpouvwlqwer

    grant_type=refresh_token
    &refresh_token=zqewpirqwef;ijadsgj
    &scope=api2 api1.read
```

### Refresh Token Response
```
HTTP/1.1 200 OK
Content-Type: application/json
{
    "access_token": "12314adadg",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "zqewpirqwef;ijadsgj"
    "scope": "api2.read offline_access"
}
```

## OpenID Connect
![OpenID Connect](./OpenIDConnect.png)

Request
```
Client_Id
Client_Secret
Scopes
ResponseType
RedirectURI
```
Identity Provider will check
1. If the client has the authority for those scopes
2. If the RedirectURI match the white list

If all checked, will show two screen:
1. screen for user to login(eg. provide username and password)
2. screen for user to consent the scope requested

If all checked, will send back the response according the response type requested.

response will have two tokens:
1. IdToken
    * iss: issuer
    * exp: expire date
    * sub: user id
    * other claims
2. AccessToken

# Revised 2024/07/20:
A typical scenario do describe why we need OAuth:

Suppose we are a registered user of server.example.com, and we want to grant a application, client.example.com, to access to server.example.com's one of the API, which should only perform deleting my Message stored in that server.

Without OAUTH, only thing we could do is to give this application my credentials, eg. username and password. But there are several things need to be aware of:
1. That application, with my credential, is able to access any API in server.example.com.(Full authority)
2. We are doing multi tasks, to avoid giving my credentials everytime, that application needs to store my credentials somewhere somehow. That is dangerous, for example, risk of exposing user's credentials.
3. As long as credential is out, full authority is granted, that means, multi-factor authentication is useless.
4. If that application wants to use other application as delegate, it needs to share credential with that delegate?
5. For server.example.com security analysis perspective, it's not possible to identify this is an operation of the real user, or an operation of delegate application.

## To use cookie
We can let user to go to the url of that specific API and enter their credential and store this grant state in a cookie. But cookie is browser based storage, Cross-Forgery Attack can use script which is able trick the browser to send unwanted request using the browser's cookie.

## OAuth Process
### The Characters
There 4 characters within the OAUTH process:
1. The real user
2. The client application, a delegate application needs user's specific scoped authority
3. The identity server
4. The Resource API, which has access to the user's data

### The Process
1. So when user want's an application to act as a delegate to manipulate user's data, application will redirect user to the identity server.
2. User provide credential to the identity server who they are, and Identity server will also ask user which scope they want to grant
3. If granted, (user proved who they are by credential, and chose the scope), identity server redirect user back to the application page with authorization code, which represent the grant by the user
4. Application at the background, send the code to identity server and also prove who it is, identity server confirmed and send back the access token, which include scope and expiry period info.
5. Application use this token, go to the resources, resources needs to verify this token, either locally, or send request to identity server to verify this.
6. After verification, resource only do what token allows to do.