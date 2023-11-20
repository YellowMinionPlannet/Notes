const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

gulp.task("sass", function (done) {
  return gulp
    .src(["./src/sass/**/*.scss", "!./src/sass/excludes.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/css"));
});

gulp.task("default", function () {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    online: true,
  });
  gulp
    .watch("./src/sass/**/*.scss", gulp.series(["sass"]))
    .on("change", browserSync.reload);
});
