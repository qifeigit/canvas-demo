var gulp = require('gulp');
var del = require('del');
var connect = require('gulp-connect');


var port = process.env.PORT || 10000;
var reloadPort = process.env.RELOAD_PORT || 35728;

gulp.task('clean', function () {
  del(['build']);
});

gulp.task('serve', function () {
  connect.server({
    port: port,
    livereload: {
      port: reloadPort
    }
  });
});

gulp.task('watch', function () {
  gulp.watch(['app.js']);
});
gulp.task('default', ['clean','serve', 'watch']);
