var gulp = require('gulp');
var sass = require('gulp-sass');

// Compile Sass
gulp.task('styles', function() {
    gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/css/'));
});


/**************************************************

	Minification Tasks
	
**************************************************/

// Minify HTML
gulp.task('pages', function() {
  return gulp.src(['./src/**/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist'));
});

// Minify CSS
gulp.task('minify-styles', function() {
  return gulp.src('./src/sass/**/*.scss')
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('./dist/css'))
});

// Minify JavaScript
gulp.task('scripts', function() {
  return gulp.src('./src/js/**/*.js')
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('./dist/js'))
});

/**************************************************

	Main Tasks
	
**************************************************/

// Clean output directory
gulp.task('clean', () => del(['dist']));

//Watch task
gulp.task('default',function() {
    gulp.watch('src/sass/**/*.scss',['styles']);
	gulp.watch('src/js/**/*.js',['styles']);
});


// Gulp task to minify all files
gulp.task('default', ['clean'], function () {
  runSequence(
    'styles',
    'scripts',
    'pages'
  );
});