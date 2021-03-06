var fs = require('fs');
var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var del = require('del');

gulp.task('clean', function(cb) {
    del(['build','build.zip'], function(){
        fs.mkdir('build', cb);
    });
});

gulp.task('css-minify', ['clean'], function() {
    return gulp.src(['./src/css/*.css','!./src/css/*.min.css'])
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./build/css/'));
});


gulp.task('css-copy', ['clean'], function() {
    return gulp.src(['./src/css/*.min.css'])
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('js-minify', ['clean'], function() {
    return gulp.src(['./src/js/*.js', '!./src/js/*.min.js', '!./src/js/*.dev.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('js-copy', ['clean'], function() {
    return gulp.src(['./src/js/*.min.js'])
        .pipe(gulp.dest('./build/js/'));
});


gulp.task('fonts-copy', ['clean'], function() {
    return gulp.src('./src/fonts/*.woff2')
        .pipe(gulp.dest('./build/fonts/'));
});

gulp.task('images-copy', ['clean'], function() {
    return gulp.src('./src/images/*.png')
        .pipe(gulp.dest('./build/images/'));
});

gulp.task('sounds-copy', ['clean'], function() {
    return gulp.src('./src/sounds/*.ogg')
        .pipe(gulp.dest('./build/sounds/'));
});

gulp.task('xml-copy', ['clean'], function() {
    return gulp.src('./src/xml/*.xml')
        .pipe(gulp.dest('./build/xml/'));
});

gulp.task('html-minify', ['clean'], function() {
    return gulp.src('./src/*.html')
        .pipe(minifyHtml())
        .pipe(gulp.dest('./build/'));
});

gulp.task('manifest-generate', ['clean'], function() {
    return gulp.src('./src/manifest.json')
        .pipe(gulp.dest('./build/'));
});

gulp.task('other-files', ['clean'], function() {
    return gulp.src(['./LICENSE.txt', './README.md'])
        .pipe(gulp.dest('./build/'));
});

gulp.task('packing', ['clean', 'html-minify', 'css-minify', 'css-copy', 'js-minify', 'js-copy', 'fonts-copy', 'images-copy', 'sounds-copy','xml-copy', 'manifest-generate', 'other-files'], function(cb){
    var JSZip = require("jszip");
    var zip = new JSZip();
    var replacer = /^build(\\|\/)/;
    require('glob').sync('build/**/*').forEach(function(file){
        if (fs.lstatSync(file).isFile()) {
            zip.file(file.replace(replacer, ''), fs.readFileSync(file));
        }
    });
    var buffer = zip.generate({type:"nodebuffer"});
    fs.writeFile('owa.zip', buffer, function(err) {
        if (err) throw err;
        cb();
    });
});

gulp.task('default', ['packing']);