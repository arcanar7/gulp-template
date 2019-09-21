const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const gulpStylelint = require('gulp-stylelint')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const del = require('del')

function style() {
  return gulp
    .src('./scss/main.scss')
    .pipe(
      gulpStylelint({ reporters: [{ formatter: 'string', console: true }] })
    )
    .pipe(sass({ includePaths: require('node-normalize-scss').includePaths }))
    .pipe(concat('style.css'))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest('./css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream())
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  })
  style()
  gulp.watch('./scss/**/*.scss', style)
  gulp.watch('./*.html').on('change', browserSync.reload)
}

function htmlCopy() {
  return gulp.src('./index.html').pipe(gulp.dest('./build'))
}

function clean() {
  return del(['build/*'])
}

exports.style = style
exports.watch = watch
exports.clean = clean
exports.build = gulp.series(clean, gulp.parallel(style, htmlCopy))
