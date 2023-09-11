"use strict";

/*
 * Require the path module
 */
const path = require("path");

/*
 * Require the Fractal module
 */
const fractal = (module.exports = require("@frctl/fractal").create());
const helpers = require("./helpers")(fractal);
const hbs = require("@frctl/handlebars")({ helpers });

fractal.components.engine(hbs);
fractal.docs.engine(hbs);
/*
 * Give your project a title.
 */
fractal.set("project.title", "Fractal Guide");

/*
 * Tell Fractal where to look for components.
 */
fractal.components.set("path", path.join(__dirname, "components"));

fractal.components.set("default.preview", "@preview");

/*
 * Tell Fractal where to look for documentation pages.
 */
fractal.docs.set("path", path.join(__dirname, "docs"));

/*
 * Tell the Fractal web preview plugin where to look for static assets.
 */
fractal.web.set("static.path", path.join(__dirname, "public"));
