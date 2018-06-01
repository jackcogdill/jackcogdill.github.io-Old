const gulp = require('gulp');

// CSS
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');

// js
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglifyjs = require('uglify-es'); // ES6 support
const composer = require('gulp-uglify/composer');
const pump = require('pump');
const minify = composer(uglifyjs, console);

gulp.task('css', () => gulp.src('client/css/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css')));

gulp.task('js', function (cb) {
    // Same options as described above
    const options = {};

    pump([
        gulp.src('client/js/*.js'),
        sourcemaps.init(),
        concat('app.min.js'),
        minify(options),
        sourcemaps.write(),
        gulp.dest('build/js'),
    ], cb);
});

gulp.task('default', [ 'css', 'js' ]);
