var gulp = require('gulp'),
	htmlmin = require('gulp-htmlmin');
	jsImport = require('gulp-js-import'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify');

// Minify HTML
gulp.task('html', () => {
  return gulp.src('./src/html/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./'));
});

// Compile Sass
gulp.task('sass', function(){
  return gulp.src('./src/sass/main.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
	.pipe(rename('style.css'))
    .pipe(gulp.dest('./dist'))
});

// Compile Js
gulp.task('js', function(){
  return gulp.src('./src/js/main.js')
    .pipe(jsImport({hideConsole: true}))
	.pipe(rename('script.js'))
	.pipe(uglify())
    .pipe(gulp.dest('./dist'))
});

// Watch task
gulp.task('watch', function() {
	gulp.watch('./src/html/*.html', gulp.series('html'));
	gulp.watch('./src/sass/**/*.scss', gulp.series('sass'));
	gulp.watch('./src/js/**/*.js', gulp.series('js'));
});