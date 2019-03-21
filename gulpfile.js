'use strict';

//
//
//
const 
    gulp                    = require('gulp'),
    path                    = require('path'),
    sass                    = require('gulp-sass'),
    cleanCSS                = require('gulp-clean-css'),
    nodePhpAwesomeServer    = require('node-php-awesome-server'),
    browserSync             = require('browser-sync').create()
;

var phpServer = null;

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
 
gulp.task('sass:watch', function () {
    gulp.watch(path.join(PUBLIC_PATH, 'assets/views/**/*'), gulp.series('browserSync.reload'));
    gulp.watch('./assets/styles/**/*.scss', gulp.series('sass', 'browserSync.reload'));
});


//----------------------------------------------------------
//  SERVER
//----------------------------------------------------------
gulp.task('browserSync.reload', function () {
    browserSync.reload();
});

gulp.task('serve', function(){
    var serverPort = 9000;
    phpServer = nodePhpAwesomeServer({
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
gulp.task('dev', gulp.parallel('serve', 'sass:watch', function(){

}));

//----------------------------------------------------------
//  Release tasks
//----------------------------------------------------------
gulp.task('dist', gulp.series('sass', function(){

}));



