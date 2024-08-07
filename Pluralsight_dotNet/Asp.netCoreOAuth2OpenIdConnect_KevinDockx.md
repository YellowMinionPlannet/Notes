[Git Hub codebase for entire course](https://github.com/kevindockx/securingaspnetcorewithoauth2andoidc)

<sup>`main` branch is for this course, `latest and greatest` is for updates after course recording</sup>

# Concept of Confidential and Public Clients
- Confidential client means server side application, page are rendered within the server, and runs on the server. So they can persist their clientId and Secret on the server.

- Public client means client side application, eg. SPA application

[IETF Documentation for best practice of OAuth2](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics-29)

[oauth documentation](oauth.net/2.1/)

- Best flow for both confidential client and public client is Authorization code flow.