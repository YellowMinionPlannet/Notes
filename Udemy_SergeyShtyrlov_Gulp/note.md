- Gulp task is the basic unit of gulp process.
- Gulp tasks are all asynchronus tasks, so we don't know which one will finish at when.
- We can use `done` callback function or use `return` keyword to tell Gulp that this task is finished

  ```js
  gulp.task("default", function(done){
    <!-- task implementation -->
    done();
  })

  gulp.task("task-1", function(){
    return console.log("gulp says hello!");
  })
  ```

- In order to search plugins for Gulp:

  1. gulpjs.com, plugins, eg. format: gulp-sass
  2. google.com, gulp sass

- About gulp.src matching patterns
  - if we need to include all files within a specific folder:
    ```js
    gulp.src("./src/sass/*.scss");
    ```
  - if we need to include all files and children folders and files within children folders:
    ```js
    gulp.src("./src/sass/**/*.scss");
    ```
  - if we need to exclude specific file
    ```js
    gulp.src(["./src/sass/**/*.scss", "!./src/sass/excludes.scss"]);
    ```
- About gulp.series

  - if we need to group task into a sequential order, we use gulp.series.

  ```js
  gulp.series(["sass", "hello"]);
  ```

- About gulp.watch

  - will watch files updates and execute a series when file updated.

  ```js
  gulp.watch("./src/sass/**/*.scss", gulp.series(["sass"]));
  ```

  - watch multiple source paths

  ```js
  gulp
    .watch(["./src/sass/**/*.scss", "**/*.html"], gulp.series(["sass"]))
    .on("change", browserSync.reload);
  ```

- About browsersync
  - a live server to preview our updates
  ```js
  browserSync.init(
    server:{
      baseDir:"./"
    },
    browser: "optional browser name, please see documentation of options",
    online: true //to tell skip network check and accept online status
  );
  ```
