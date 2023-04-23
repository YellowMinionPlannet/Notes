# 2 Creating Builds with Webpack

## What the Web can do

```html
<h1>Welcome to my site</h1>
<!-- ...other code -->
<script src="mainpage.js" />
<script src="cartpage.js" />
<script src="common.js" />
```

When we develop a webpage as sample above. We need to put javascript code into script tags. However, `common.js` file might be referenced in `mainpage.js` and `cartpage.js` files and web browser loads scripts by the order of script tags, so we need to move `common.js` file up.
