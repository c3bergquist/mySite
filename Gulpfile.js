var gulp = require('gulp');
var jsImport = require('gulp-js-import');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

// Compile Sass
gulp.task('sass', function(){
  return gulp.src('./src/sass/main.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
	.pipe(rename('style.css'))
    .pipe(gulp.dest('./dist'))
});

// Compile Sass
gulp.task('js', function(){
  return gulp.src('./src/js/main.js')
    .pipe(jsImport({hideConsole: true}))
	.pipe(rename('script.js'))
    .pipe(gulp.dest('./dist'))
});

/**************************************************

	Minification Tasks
	
**************************************************/

// Minify HTML
//gulp.task('pages', function() {
  //return gulp.src(['./src/**/*.html'])
    //.pipe(htmlmin({
      //collapseWhitespace: true,
      //removeComments: true
    //}))
    //.pipe(gulp.dest('./dist'));
//});

// Minify CSS
//gulp.task('minify-styles', function() {
  //return gulp.src('./src/sass/**/*.scss')
    //.pipe(uglify())
    //.pipe(gulp.dest('./dist/css'))
//});

// Minify JavaScript
//gulp.task('scripts', function() {
  //return gulp.src('./src/js/**/*.js')
    //.pipe(uglify())
    //.pipe(gulp.dest('./dist/js'))
//});

/**************************************************

	Main Tasks
	
**************************************************/

// Clean output directory
//gulp.task('clean', () => del(['dist']));

// Watch task
gulp.task('watch', function() {
    gulp.watch('./src/sass/**/*.scss', gulp.series('sass'));
	gulp.watch('./src/js/**/*.js', gulp.series('js'));
});


// Gulp task to minify all files
/*gulp.task('default', ['clean'], function() {
  runSequence(
    'styles',
    'scripts',
    'pages'
  );
});*/