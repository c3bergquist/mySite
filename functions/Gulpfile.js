var gulp = require('gulp'),
	htmlmin = require('gulp-htmlmin');
	jsImport = require('gulp-js-import'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify');

gulp.task('default', function() {
	gulp.series('html', 'sass', 'js', 'fontawesome', 'jquery');
});

// Minify HTML
gulp.task('html', function() {
  return gulp.src('../src/html/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('../public/'));
});

// Compile Sass
gulp.task('sass', function() {
  return gulp.src('../src/sass/main.scss')
    .pipe(sass())
	.pipe(rename('style.css'))
    .pipe(gulp.dest('../public/dist'))
});

// Compile Js
gulp.task('js', function() {
  return gulp.src('../src/js/main.js')
    .pipe(jsImport({hideConsole: true}))
	.pipe(rename('script.js'))
	.pipe(uglify())
    .pipe(gulp.dest('../public/dist'))
});

// Import FontAwesome
gulp.task('fontawesome', function() {
  return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest('../public/fonts/fontawesome'))
})

// Import jQuery
gulp.task('jquery', function() {
  return gulp.src('./node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('../public/dist/'))
})

// Watch task
gulp.task('watch', function() {
	gulp.watch('../src/html/*.html', gulp.series('html'));
	gulp.watch('../src/sass/**/*.scss', gulp.series('sass'));
	gulp.watch('../src/js/**/*.js', gulp.series('js'));
});