var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleancss = new LessPluginCleanCSS({ advanced: true });
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    gls = require('gulp-live-server'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish');

gulp.task('default',['watch','serve']);
gulp.task('all',['sass','less','js','html','image']);

gulp.task('sass', function () {
    return gulp.src('assets/src/sass/**/*.scss')
        .pipe(concat('style.min.css'))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('assets/css'));
});

gulp.task('less', function() {
    return gulp.src('assets/src/less/**/*.less')
        .pipe(concat('styleLess.min.css'))
        .pipe(less())
        .pipe(gulp.dest('assets/css'));
});

gulp.task('js', function() {
    return gulp.src('assets/src/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'));
});

gulp.task('html', function() {
    return gulp.src('html/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('.'))
});

gulp.task('image', function() {
    return gulp.src('assets/src/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true,optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 7}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: false},
                    {cleanupIDs: false}
                ]
            })
        ],{verbose: false}))
        .pipe(gulp.dest('assets/img'));
});

gulp.task('watch', function() {
    gulp.watch('assets/src/sass/**/*.scss',['sass']);
    gulp.watch('assets/src/less/**/*.less',['less']);
    gulp.watch('assets/src/js/**/*.js',['lint','js']);
    gulp.watch('html/**/*.html',['html']);
    gulp.watch('assets/src/img/**/*',['image']);
});

gulp.task('serve', function() {
    var server = gls.static('./',8000);
    server.start();

    gulp.watch('assets/css/**/*.css', function(file){
        gls.notify.apply(server,[file]);
    });

    gulp.watch('assets/js/**/*.js', function(file){
        gls.notify.apply(server,[file]);
    });

    gulp.watch('assets/img/**/*', function(file){
        gls.notify.apply(server,[file]);
    });

    gulp.watch('*.html', function(file){
        gls.notify.apply(server,[file]);
    });
});

gulp.task('lint', function() {
    return gulp.src('assets/src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});
