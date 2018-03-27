/* eslint-env node, es6 */
/* global Promise */
/* eslint-disable key-spacing, one-var, no-multi-spaces, max-nested-callbacks, quote-props */

'use strict';

// ################################
// Load Gulp and tools we will use.
// ################################

var importOnce  = require('node-sass-import-once'),
    path        = require('path'),
    notify      = require('gulp-notify'),
    gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create(),
    del         = require('del'),
    sass        = require('gulp-sass'),
    kss         = require('kss'),
    postcss     = require('gulp-postcss'),
    rename      = require('gulp-rename'),
    autoprefixer= require('autoprefixer'),
    mqpacker    = require('css-mqpacker'),
    concat      = require('gulp-concat'),
    runSequence = require('run-sequence');

var options = {};

// #############################
// Edit these paths and options.
// #############################

// The root paths are used to construct all the other paths in this
// configuration. The "project" root path is where this gulpfile.js is located.
// While Open Social distributes this in the theme root folder, you can also put this
// (and the package.json) in your project's root folder and edit the paths
// accordingly.
options.rootPath = {
  theme           : __dirname + '/',
  styleGuide      : __dirname + '/styleguide/',
  basetheme       : __dirname + '/../../../profiles/contrib/social/themes/socialbase/',
  drupal          : __dirname + '/../../../core/',
  social          : __dirname + '/../../../profiles/contrib/social/modules/social_features/social_landing_page/'
};

options.theme = {
  name       : 'demo',
  root       : options.rootPath.theme,
  components : options.rootPath.theme + 'components/',
  build      : options.rootPath.theme + 'assets/',
  css        : options.rootPath.theme + 'assets/css/',
  js         : options.rootPath.theme + 'assets/js/',
  icons      : options.rootPath.theme + 'assets/icons/',
  images     : options.rootPath.theme + 'assets/images/'
};

options.basetheme = {
  name       : 'socialbase',
  root       : options.rootPath.basetheme,
  components : options.rootPath.basetheme + 'components/',
  build      : options.rootPath.basetheme + 'assets/',
  css        : options.rootPath.basetheme + 'assets/css/',
  js         : options.rootPath.basetheme + 'assets/js/'
};

options.social = {
  name       : 'social',
  root       : options.rootPath.social,
  components : options.rootPath.social + 'css/',
  build      : options.rootPath.social + 'assets/',
  css        : options.rootPath.social + 'assets/css/',
  js         : options.rootPath.social + 'assets/js/'
};


// Define the node-sass configuration. The includePaths is critical!
options.sass = {
  importer: importOnce,
  includePaths: [
    options.theme.components,
  ],
  outputStyle: 'expanded'
};

var sassFiles = [
  options.social.components + '*.scss',
  options.theme.components + '**/*.scss',
  // Do not open Sass partials as they will be included as needed.
  '!' + options.theme.components + '**/_*.scss'
];


// On screen notification for errors while performing tasks
var onError = function(err) {
  notify.onError({
    title:    "Gulp error in " + err.plugin,
    message:  "<%= error.message %>",
    sound: "Beep"
  })(err);
  this.emit('end');
};


// Define the style guide paths and options.
options.styleGuide = {
  'source': [
    options.theme.components,
    options.basetheme.components,
    options.social.components
  ],
  'mask': /\.less|\.sass|\.scss|\.styl|\.stylus/,
  destination: options.rootPath.styleGuide,

  'builder': 'os-builder',
  'namespace': options.theme.name + ':' + options.theme.components,
  'extend-drupal8': true,

  // The css and js paths are URLs, like '/misc/jquery.js'.
  // The following paths are relative to the generated style guide.
  'css': [
    // Base stylesheets
    'kss-assets/base/base.css',
    'kss-assets/css/base.css',
    // Atom stylesheets
    'kss-assets/base/alert.css',
    'kss-assets/css/alert.css',
    'kss-assets/base/badge.css',
    'kss-assets/css/badge.css',
    'kss-assets/base/button.css',
    'kss-assets/css/button.css',
    'kss-assets/base/cards.css',
    'kss-assets/css/cards.css',
    'kss-assets/base/form-controls.css',
    'kss-assets/css/form-controls.css',
    'kss-assets/css/image--profile.css',
    'kss-assets/css/image--teaser.css',
    'kss-assets/base/list.css',
    'kss-assets/css/list.css',
    'kss-assets/css/read-more.css',
    'kss-assets/css/waves.css',
    // Molecule stylesheets
    'kss-assets/base/dropdown.css',
    'kss-assets/css/dropdown.css',
    'kss-assets/base/file.css',
    'kss-assets/css/file.css',
    'kss-assets/base/form-elements.css',
    'kss-assets/css/form-elements.css',
    'kss-assets/css/image-and-text.css',
    'kss-assets/base/datepicker.css',
    'kss-assets/css/datepicker.css',
    'kss-assets/base/input-groups.css',
    'kss-assets/css/input-groups.css',
    'kss-assets/base/password.css',
    'kss-assets/css/password.css',
    'kss-assets/base/timepicker.css',
    'kss-assets/css/timepicker.css',
    'kss-assets/base/media.css',
    'kss-assets/base/mention.css',
    'kss-assets/css/mention.css',
    'kss-assets/base/breadcrumb.css',
    'kss-assets/css/breadcrumb.css',
    'kss-assets/base/nav-book.css',
    'kss-assets/css/nav-book.css',
    'kss-assets/base/nav-tabs.css',
    'kss-assets/css/nav-tabs.css',
    'kss-assets/base/navbar.css',
    'kss-assets/css/navbar.css',
    'kss-assets/base/pagination.css',
    'kss-assets/css/pagination.css',
    'kss-assets/css/paragraph.css',
    'kss-assets/css/paragraphs.admin.css',
    'kss-assets/css/paragraphs.display.css',
    'kss-assets/base/paragraphs.widget.css',
    'kss-assets/css/paragraphs.widget.css',
    'kss-assets/base/popover.css',
    'kss-assets/css/popover.css',


    'kss-assets/css/social_landing_page.featured.css',
    'kss-assets/css/social_landing_page.section.button.css',
    'kss-assets/css/social_landing_page.section.featured.css',
    // a non-ideal way of adding the social_ contrib module css
    '../../../profiles/contrib/social/modules/social_features/social_landing_page/css/social_landing_page.section.hero.css',
    '../../../../modules/contrib/social_landing_page/css/social_landing_page.section.hero.css',
    'kss-assets/css/social_landing_page.section.hero.css',

    'kss-assets/css/social_landing_page.section.introduction.css',


    'kss-assets/css/taxonomy.css',
    'kss-assets/base/teaser.css',
    'kss-assets/css/teaser.css',
    'kss-assets/base/tour.css',
    'kss-assets/css/tour.css',
    'kss-assets/css/user-list.css',
    // Organisms stylesheets
    'kss-assets/base/comment.css',
    'kss-assets/css/comment.css',


    'kss-assets/base/hero.css',
    'kss-assets/css/hero.css',
    'kss-assets/css/hero--cta.css',
    'kss-assets/css/hero--event.css',
    'kss-assets/css/hero--group.css',
    'kss-assets/css/hero--profile.css',
    'kss-assets/css/hero--topic.css',


    'kss-assets/base/meta.css',
    'kss-assets/css/meta.css',
    'kss-assets/base/offcanvas.css',
    'kss-assets/css/offcanvas.css',
    'kss-assets/css/site-footer.css',
    'kss-assets/base/stream.css',
    'kss-assets/css/stream.css',
    'kss-assets/css/team.css',
    // Template stylesheets
    'kss-assets/base/layout.css',
    'kss-assets/base/page-node.css',
    'kss-assets/css/layout.css',
    'kss-assets/css/page-node.css',
    'kss-assets/css/profile.css',
    // Javascript stylesheets
    'kss-assets/base/morrisjs.css',
    // Styleguide stylesheets
    'kss-assets/css/styleguide.css'
  ],
  'js': [
    'kss-assets/js/waves.min.js'
  ],
  'homepage': 'homepage.md',
  'title': 'Style Guide for Demo custom theme'
};

// If your files are on a network share, you may want to turn on polling for
// Gulp watch. Since polling is less efficient, we disable polling by default.
options.gulpWatchOptions = {};
// options.gulpWatchOptions = {interval: 1000, mode: 'poll'};


var sassProcessors = [
  autoprefixer({browsers: ['> 1%', 'last 2 versions']}),
  mqpacker({sort: true})
];



// #################
//
// Compile the Sass
//
// #################
//
// This task will look for all scss files and run postcss and rucksack.
// For performance review we will display the file sizes
// Then the files will be stored in the assets folder
// At the end we check if we should inject new styles in the browser
// ===================================================

gulp.task('styles', function () {
  return gulp.src(sassFiles)
    .pipe(sass(options.sass).on('error', sass.logError))
    .pipe($.plumber({ errorHandler: onError }) )
    // run autoprefixer and media-query packer
    .pipe($.postcss(sassProcessors) )
    // run rucksack @see https://simplaio.github.io/rucksack/
    .pipe($.rucksack() )
    .pipe($.rename({dirname: ''}))
    .pipe($.size({showFiles: true}))
    .pipe(gulp.dest(options.theme.css))
    .pipe(browserSync.stream());
});



// ##################
// Build style guide.
// ##################

// Compile and copy the socialbase styles to the style guide
gulp.task('styleguide-assets-base', function() {
  return gulp.src(options.basetheme.css +'*.css')
    .pipe(gulp.dest(options.rootPath.styleGuide + 'kss-assets/base/'))
});

// Compile and copy the subtheme assets to the style guide
gulp.task('styleguide-assets', function() {
  return gulp.src(options.theme.build +'**/*')
    .pipe(gulp.dest(options.rootPath.styleGuide + 'kss-assets/'))
});

// Copy the mime icons from the components folder to the styleguide assets folder (manual task)
gulp.task('styleguide-mime-image-icons', function () {
  return gulp.src(options.basetheme.components + '06-libraries/icons/source/mime-icons/*.png')
    .pipe(gulp.dest(options.rootPath.styleGuide + 'kss-assets/'))
});

// Main styleguide task
gulp.task('styleguide', ['clean:styleguide'], function () {
  return kss(options.styleGuide);
});

// Before deploying create a fresh build
gulp.task('build-styleguide', function(done) {
  runSequence('clean:styleguide', 'scripts-drupal', 'styleguide',
    ['styleguide-assets-base', 'styleguide-assets', 'styleguide-mime-image-icons'],
    done);
});

// Copy drupal scripts from drupal to make them available for the styleguide
gulp.task('scripts-drupal', function() {
  return gulp.src([
    options.rootPath.drupal + 'assets/vendor/domready/ready.min.js',
    options.rootPath.drupal + 'assets/vendor/jquery/jquery.min.js',
    options.rootPath.drupal + 'assets/vendor/jquery-once/jquery.once.min.js',
    options.rootPath.drupal + '/misc/drupalSettingsLoader.js',
    options.rootPath.drupal + '/misc/drupal.js',
    options.rootPath.drupal + '/misc/debounce.js',
    options.rootPath.drupal + '/misc/forms.js',
    options.rootPath.drupal + '/misc/tabledrag.js',
    options.rootPath.drupal + '/modules/user/user.js',
    options.rootPath.drupal + '/modules/file/file.js'
  ])
    .pipe( concat('drupal-core.js') )
    .pipe( gulp.dest(options.rootPath.styleGuide + 'kss-assets/') );
});



// ##############################
//
// Watch for changes and rebuild.
//
// ##############################

gulp.task('watch', ['styles', 'watch:styleguide', 'icons-watch', 'watch:js'], function () {

  browserSync.init({
    proxy: "social.test:32769"
  });

  gulp.watch(options.theme.components + '**/*.scss', ['styles']);
  gulp.watch(options.theme.components + '**/*.svg', ['icons-watch']);
  gulp.watch(options.theme.components + '**/*.js', ['watch:js']);
});

gulp.task('watch:styleguide', ['build-styleguide'], function () {
  return gulp.watch([
    options.basetheme.components + '**/*.scss',
    options.theme.components + '**/*.scss',
    options.basetheme.components + '**/*.twig',
    options.theme.components + '**/*.twig',
    options.basetheme.components + '**/*.json',
    options.theme.components + '**/*.json',
    options.theme.components + '**/*.md'
  ], options.gulpWatchOptions, ['build-styleguide']);
});



// #################
//
// Minify JS
//
// #################
//
// First clean the JS folder, then search all components for js files.
// Then compress the files, give them an explicit .min filename and
// save them to the assets folder.
// ===================================================

gulp.task('watch:js', function () {
  return gulp.src(options.theme.components + '**/*.js')
    .pipe($.uglify())
    .pipe($.flatten())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(options.theme.js));
});

// #################
//
// Sprite icons
//
// #################
//
// svgmin minifies our SVG files and strips out unnecessary
// code that you might inherit from your graphics editor.
// svgstore binds them together in one giant SVG container called
// icons.svg. Then cheerio gives us the ability to interact with
// the DOM components in this file in a jQuery-like way. cheerio
// in this case is removing any fill attributes from the SVG
// elements (you’ll want to use CSS to manipulate them)
// and adds a class of .hide to our parent SVG. It gets
// deposited into our inc directory with the rest of the HTML partials.
// ===================================================

var svgmin        = require('gulp-svgmin'),
  svgstore      = require('gulp-svgstore'),
  cheerio       = require('gulp-cheerio');

gulp.task('sprite-icons', function () {
  return gulp.src(options.theme.components + '**/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}))
    .pipe($.rename('icons.svg') )
    .pipe(cheerio({
      run: function ($, file) {
        $('svg').addClass('hidden');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest(options.theme.icons))
});


// #################
//
// Image icons
//
// #################
//
// Besides the sprite we sometimes still need the individual svg files
// to load as a css background image. This task optimises and copies
// the icons to the assets folder.
// ===================================================

gulp.task('image-icons', function () {
  return gulp.src(options.theme.components + '**/*.svg')
    .pipe(svgmin())
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest(options.theme.icons + 'icons/'))
});


gulp.task('icons-watch', ['sprite-icons', 'image-icons']);

// ######################
//
// Clean all directories.
//
// ######################

gulp.task('clean', ['clean:css', 'clean:styleguide']);

// Clean style guide files.
gulp.task('clean:styleguide', function () {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del([
    options.styleGuide.destination + '*.html',
    options.styleGuide.destination + 'kss-assets',
    options.theme.build + 'twig/*.twig'
  ], {force: true});
});

// Clean CSS files.
gulp.task('clean:css', function () {
  return del([
    options.theme.css + '**/*.css',
    options.theme.css + '**/*.map'
  ], {force: true});
});



// ######################
//
// Default task (no watching)
//
// ######################
gulp.task('default', ['styles', 'styleguide']);