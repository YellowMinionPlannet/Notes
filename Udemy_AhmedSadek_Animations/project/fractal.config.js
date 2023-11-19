"use strict";

/* Create a new Fractal instance and export it for use elsewhere if required */
const fractal = (module.exports = require("@frctl/fractal").create());

/* Set the title of the project */
fractal.set("project.title", "UI Animation Effects in Fractal");

fractal.set("project.version", "v1.0");
fractal.set("project.author", "Lei Zhong");

/* Tell Fractal where the components will live */
fractal.components.set("path", __dirname + "/src/components");

/* Tell Fractal where the documentation pages will live */
fractal.docs.set("path", __dirname + "/src/docs");

fractal.web.set("static.path", __dirname + "/public");

fractal.web.set("builder.dest", __dirname + "/build");

fractal.components.set("default.preview", "@preview");
