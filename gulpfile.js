/* global require */
var debug       = require('gulp-debug'),
    gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    prefixer    = require('gulp-autoprefixer'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps');

/* local config */
var css_path = 'css',
    sass_path = 'scss/**/*.scss';

gulp.task('sass', function() {
  gulp.src(sass_path)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'})
      .on('error', sass.logError)
    )
    .pipe(prefixer({
      browsers: ['last 2 versions', 'ie > 9'],
      cascade: true, // makes it all purty like
      remove: true, // removes prefixes that are no longer required
    }))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(css_path))
    .pipe(debug())
});

gulp.task('watch', function () {
  gulp.watch(sass_path, ['sass']);
});

gulp.task('default', ['sass', 'watch']);
