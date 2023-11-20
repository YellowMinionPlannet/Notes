"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");

/*
 * Configure a Fractal instance.
 *
 * This configuration could also be done in a separate file, provided that this file
 * then imported the configured fractal instance from it to work with in your Gulp tasks.
 * i.e. const fractal = require('./my-fractal-config-file');
 */

const fractal = require("@frctl/fractal").create();

fractal.set("project.title", "Lei's Component Library"); // title for the project
fractal.web.set("builder.dest", "build"); // destination for the static export
fractal.docs.set("path", `${__dirname}/src/docs`); // location of the documentation directory.
fractal.components.set("path", `${__dirname}/src/components`); // location of the component directory.
fractal.web.set("static.path", __dirname + "/public");
fractal.components.set("default.preview", "@preview");

// any other configuration or customisation here

const logger = fractal.cli.console; // keep a reference to the fractal CLI console utility

/*
 * Start the Fractal server
 *
 * In this example we are passing the option 'sync: true' which means that it will
 * use BrowserSync to watch for changes to the filesystem and refresh the browser automatically.
 * Obviously this is completely optional!
 *
 * This task will also log any errors to the console.
 */

gulp.task("sass", function () {
  return gulp
    .src("./src/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./public/css"));
});

gulp.task("fractal:start", function () {
  const server = fractal.web.server({
    sync: true,
  });
  server.on("error", (err) => logger.error(err.message));
  server.start().then(() => {
    logger.success(`Fractal server is now running at ${server.url}`);
  });
});

/*
 * Run a static export of the project web UI.
 *
 * This task will report on progress using the 'progress' event emitted by the
 * builder instance, and log any errors to the terminal.
 *
 * The build destination will be the directory specified in the 'builder.dest'
 * configuration option set above.
 */

gulp.task("fractal:build", function () {
  const builder = fractal.web.builder();
  builder.on("progress", (completed, total) =>
    logger.update(`Exported ${completed} of ${total} items`, "info")
  );
  builder.on("error", (err) => logger.error(err.message));
  return builder.build().then(() => {
    logger.success("Fractal build completed!");
  });
});

gulp.task("default", function () {
  const server = fractal.web.server({
    sync: true,
  });
  server.on("error", (err) => logger.error(err.message));
  server.start().then(() => {
    logger.success(`Fractal server is now running at ${server.url}`);
  });
  gulp.watch(
    ["./src/components/**/*.scss", "./src/**/*.hbs"],
    gulp.series(["sass"])
  );
});
