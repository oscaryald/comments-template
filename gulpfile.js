
// npm install gulp --save-dev

var gulp = require('gulp'); // Require gulp

// Sass dependencies
var sass = require('gulp-sass'); // Compile Sass into CSS
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
// var minifyCSS = require('gulp-minify-css'); // Minify the CSS

// Minification dependencies
// var minifyHTML = require('gulp-minify-html'); // Minify HTML
// var concat = require('gulp-concat'); // Join all JS files together to save space
// var stripDebug = require('gulp-strip-debug'); // Remove debugging stuffs
// var uglify = require('gulp-uglify'); // Minify JavaScript
var imagemin = require('gulp-imagemin'); // Minify images

// Other dependencies
var size = require('gulp-size'); // Get the size of the project
var browserSync = require('browser-sync'); // Reload the browser on file changes
// var jshint = require('gulp-jshint'); // Debug JS files
// var stylish = require('jshint-stylish'); // More stylish debugging

var spritesmith = require('gulp.spritesmith');

var gulpSequence = require('gulp-sequence');
var newer = require('gulp-newer');

var clean = require('gulp-clean');

// Tasks -------------------------------------------------------------------- >

// Task to compile Sass file into CSS, and minify CSS into build directory
gulp.task('styles', function() {
  gulp.src('./source/sass/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./source/css'))
    // .pipe(minifyCSS())
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

// Task to minify new or changed HTML pages
// gulp.task('html', function() {
//   gulp.src('./app/*.html')
//     .pipe(minifyHTML())
//     .pipe(gulp.dest('./build/'));
// });

// Task to concat, strip debugging and minify JS files
// gulp.task('scripts', function() {
//   gulp.src(['./app/scripts/lib.js', './app/scripts/*.js'])
//     .pipe(concat('script.js'))
//     .pipe(stripDebug())
//     .pipe(uglify())
//     .pipe(gulp.dest('./build/scripts/'));
// });

// Task to minify images into build
gulp.task('images', function() {
  gulp.src('./source/img/*')
  .pipe(imagemin({
    progressive: true,
  }))
  .pipe(gulp.dest('./build/img'));
});

// Task to sprites into build
gulp.task('sprite', function () {

  // return 
  // var spriteData = gulp.src('source/img/icons/*.png') // путь, откуда берем картинки для спрайта
  //           .pipe(spritesmith({
  //               imgName: 'sprite.png',
  //               cssName: 'sprite.css',
  //               cssFormat: 'less',
  //               algorithm: 'binary-tree',
  //               // cssTemplate: 'sprite.less',
  //               cssVarMap: function(sprite) {
  //                     sprite.name = '@-s' + sprite.name
  //               }
  //           }));

  //   spriteData.img.pipe(gulp.dest('dest/img/icons')); // путь, куда сохраняем картинку
  //   spriteData.css.pipe(gulp.dest('dest/css')); // путь, куда сохраняем стили

  return gulp.src('source/img/icons/*.png')
          .pipe(spritesmith({
              imgName: 'sprite.png',
              cssName: 'sprite.scss',
              cssFormat: 'scss',
              // algorithm: 'binary-tree',
              imgPath: '../img/sprite/sprite.png',
              // cssTemplate: 'less.template.mustache',
              cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
              }
          }))
          .pipe(gulp.dest('source/img/sprite'))
          // .pipe(gulp.dest('source/sass'))
          .pipe(gulp.dest('build/img/sprite'));
          // gulp.src('source/img/icons/*.png').img.pipe(gulp.dest('build/img/icons')); // путь, куда сохраняем картинку
          // gulp.src('source/img/icons/*.png').css.pipe(gulp.dest('source/sass'));
          
          // .pipe(gulp.dest('build/css'))
});

// Task to run JS hint
// gulp.task('jshint', function() {
//   gulp.src('./source/js/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('jshint-stylish'));
// });

// Task to get the size of the app project
gulp.task('size', function() {
  gulp.src('./source/**')
    .pipe(size({
    showFiles: true,
  }));
});

// Task to get the size of the build project
gulp.task('build-size', function() {
  gulp.src('./build/**')
  .pipe(size({
    showFiles: true,
  }));
});

gulp.task('assets', function(){
   return gulp.src('source/**')
    .pipe(newer('build'))
    // .on('data', function(file){
    //   console.log(file)
    // })
    .pipe(gulp.dest('build'));
});

gulp.task('cleanAll', function(){
   return gulp.src('build/*', {read: false})
        .pipe(clean()); 
});

gulp.task('build', gulpSequence('cleanAll', ['assets', 'styles', 'sprite', 'images', 'size']));

// Serve application
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: 'source',
    },
  });
});



// Run all Gulp tasks and serve application
gulp.task('run', ['build', 'serve'], function() {
  gulp.watch('source/sass/**/*.scss', ['styles']);
  gulp.watch('source/*.html', browserSync.reload);
  gulp.watch('source/js/*.js', browserSync.reload);
  gulp.watch('source/**/*.*', ['assets']);
  // gulp.watch('source/js/**/*.js', browserSync.reload);
});



// start site

// gulp.task('dev', gulpSequence('build', ['run', 'serve']));









// var gulp = require('gulp');
// var browserify = require('gulp-browserify');
// var concat = require('gulp-concat');
// var less = require('gulp-less');
// var refresh = require('gulp-livereload');
// var lr = require('tiny-lr');
// var server = lr();
// var minifyCSS = require('gulp-minify-css');
// var embedlr = require('gulp-embedlr');

// gulp.task('scripts', function() {
//     gulp.src(['app/src/**/*.js'])
//         .pipe(browserify())
//         .pipe(concat('dest.js'))
//         .pipe(gulp.dest('dist/build'))
//         .pipe(refresh(server))
// })

// gulp.task('styles', function() {
//     gulp.src(['app/css/style.less'])
//         .pipe(less())
//         .pipe(minifyCSS())
//         .pipe(gulp.dest('dist/build'))
//         .pipe(refresh(server))
// })

// gulp.task('lr-server', function() {
//     server.listen(35729, function(err) {
//         if(err) return console.log(err);
//     });
// })

// gulp.task('html', function() {
//     gulp.src("app/*.html")
//         .pipe(embedlr())
//         .pipe(gulp.dest('dist/'))
//         .pipe(refresh(server));
// })

// gulp.task('default', function() {
//     gulp.run('lr-server', 'scripts', 'styles', 'html');

//     gulp.watch('app/src/**', function(event) {
//         gulp.run('scripts');
//     })

//     gulp.watch('app/css/**', function(event) {
//         gulp.run('styles');
//     })

//     gulp.watch('app/**/*.html', function(event) {
//         gulp.run('html');
//     })
// })