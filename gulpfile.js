'use strict';

//
//
//
const 
    gulp                    = require('gulp'),
    path                    = require('path'),
    sass                    = require('gulp-sass'),
    cleanCSS                = require('gulp-clean-css'),
    uglify                  = require('gulp-uglify'),
    pipeline                = require('readable-stream').pipeline,
    nodePhpAwesomeServer    = require('node-php-awesome-server'),
    browserSync             = require('browser-sync').create(),
    babel                   = require('gulp-babel'),
    gulpMultiProcess        = require('gulp-multi-process'),
    watch                   = require('gulp-watch')
;

//
const PUBLIC_PATH = 'public';

//----------------------------------------------------------
//  SASS Compiling
//----------------------------------------------------------
sass.compiler = require('node-sass');
 
gulp.task('sass', function () {
  return gulp.src('./assets/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(path.join(PUBLIC_PATH,'assets','css')));
});

gulp.task('js', function () {
    return pipeline(
        gulp.src([
            'node_modules/babel-polyfill/dist/polyfill.js',
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/popper.js/dist/popper.min.js',
            'assets/js/**/*.js'
        ]),
        babel({
            presets: ['@babel/preset-env']
        }),
        uglify(),
        gulp.dest(path.join(PUBLIC_PATH, 'assets/js/'))
    );
});

gulp.task('assets', gulp.parallel('sass', 'js'));

//----------------------------------------------------------
//  SERVER
//----------------------------------------------------------
gulp.task('browserSync.reload', function () {
    browserSync.reload();
});

gulp.task('serve', function(){
    var serverPort = 9000;
    var phpServer = nodePhpAwesomeServer({
        port: serverPort,
        root: PUBLIC_PATH,
        env: {

        },
        middleware: [

        ],
        //ini_config: "/path/to/your/custom.ini",
        ini_set: {
            max_execution_time: 280
        },
        output: {
            browser: true,
            reqTime: true
        },
        clustersSet: 'auto',
        phpPerCluster: 2
    });
    phpServer.on('connect', () => {
        browserSync.init({
            proxy: `localhost:${serverPort}`
        });
    });
});

//----------------------------------------------------------
//  Development tasks
//----------------------------------------------------------
gulp.task('watch', function () {
    var viewsPath = path.join(PUBLIC_PATH, 'assets/views/**/*.blade.php');
    gulp.watch(viewsPath, function(){})
    .on('change', function(){
        gulp.series('browserSync.reload')();
    });
    gulp.watch('./assets/styles/*.scss', function () {})
    .on('change', function(){
        gulp.series('sass', 'browserSync.reload')();
    });
    gulp.watch('./assets/js/*.js', function () {}).on('change', function(){
        gulp.series('js', 'browserSync.reload')();
    });
});

gulp.task('dev', gulp.parallel('serve', gulp.series('assets', 'watch'), function(){

}));

//----------------------------------------------------------
//  Release tasks
//----------------------------------------------------------
gulp.task('dist', gulp.series('sass', function(){

}));



