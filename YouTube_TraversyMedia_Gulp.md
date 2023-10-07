- How Gulp Works

  - Built on **node streams**
  - Pipelines / **.pipe()** operator
  - Single purpose plugins
  - Files not affected until all plugins are processed

- Node Streams

  - continuous stream of data that can be manipulated asyncronously.
  - it manipulates the file through pipeline.
  - pipeline is a chain of operation elements
  - so the output of one element is the input of next element.
  - we can run plugins task after task

- Gulp vs. Grunt

  - Gulp is code over configuration
  - Gulp is easier to read than Grunt
  - Gulp is based on streams, Grunt is based on files

- Init Project & Simple Task

1. npm init
2. npm install --save-dev gulp
3. create src within the root folder
4. create `guplfile.js`

```js
//gulpfile.js

const gulp = require("gulp");
/*
  TOP LEVER FUNCTIONS
  gulp.task - define tasks
  gulp.src - point to files to use
  gulp.dest - point to folder to output
  gulp.watch - watch files and folders for changes
*/

// Logs Message
gulp.task("message", function () {
  return console.log("Gulp is running...");
});
```

5. (Within Terminal) gulp message

```js
//gulpfile.js

const gulp = require("gulp");
/*
  TOP LEVER FUNCTIONS
  gulp.task - define tasks
  gulp.src - point to files to use
  gulp.dest - point to folder to output
  gulp.watch - watch files and folders for changes
*/

// Logs Message
gulp.task("message", function () {
  return console.log("Gulp is running...");
});

gulp.task("default", function () {
  return console.log("Default is running");
});
```

- copy files

1. create files `src\index.html` `src\about.html`
2. gulpfile.js

```js
//gulpfile.js

const gulp = require("gulp");
/*
  TOP LEVER FUNCTIONS
  gulp.task - define tasks
  gulp.src - point to files to use
  gulp.dest - point to folder to output
  gulp.watch - watch files and folders for changes
*/

// Logs Message
gulp.task("message", function () {
  return console.log("Gulp is running...");
});

gulp.task("default", function () {
  return console.log("Default is running");
});

// Copy all HTML files
gulp.task("copyHTML", function () {
  gulp.src("src/*.html").pipe(gulp.dest("dist"));
});
```

3. gulp copyHTML

- Using plugins

1. npm install --save-dev gulp-imagemin
2. gulpfile.js

```js
//gulpfile.js

const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
/*
  TOP LEVER FUNCTIONS
  gulp.task - define tasks
  gulp.src - point to files to use
  gulp.dest - point to folder to output
  gulp.watch - watch files and folders for changes
*/

// Logs Message
gulp.task("message", function () {
  return console.log("Gulp is running...");
});

gulp.task("default", function () {
  return console.log("Default is running");
});

// Copy all HTML files
gulp.task("copyHTML", function () {
  gulp.src("src/*.html").pipe(gulp.dest("dist"));
});

// Plugins
gulp.task("imageMin", function () {
  gulp.src("src/images/*").pipe(imagemin()).pipe(gulp.dest("dist/images"));
});
```

3. gulp imageMin

- Run all tasks

```js
//gulpfile.js

const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
/*
  TOP LEVER FUNCTIONS
  gulp.task - define tasks
  gulp.src - point to files to use
  gulp.dest - point to folder to output
  gulp.watch - watch files and folders for changes
*/

// Logs Message
gulp.task("message", function () {
  return console.log("Gulp is running...");
});

// gulp.task("default", function () {
//   return console.log("Default is running");
// });

// Copy all HTML files
gulp.task("copyHTML", function () {
  gulp.src("src/*.html").pipe(gulp.dest("dist"));
});

// Plugins
gulp.task("imageMin", function () {
  gulp.src("src/images/*").pipe(imagemin()).pipe(gulp.dest("dist/images"));
});

gulp.task("default", ["message", "copyHTML", "imageMin"]);
```
