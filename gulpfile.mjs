import autoprefixer from 'autoprefixer'
import concat from 'gulp-concat'
import csso from 'gulp-csso'
import { deleteAsync } from 'del'
import gulp from 'gulp'
import gulpWebp from 'gulp-webp'
import imagemin, { mozjpeg, optipng, svgo } from 'gulp-imagemin'
import imageminAvif from 'imagemin-avif'
import order from 'gulp-order'
import plumber from 'gulp-plumber'
import postcss from 'gulp-postcss'
import pug from 'gulp-pug'
import rename from 'gulp-rename'
import uglify from 'gulp-uglify-es'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import sourcemap from 'gulp-sourcemaps'
import svgstore from 'gulp-svgstore'
import sync from 'browser-sync'
import { nanoid } from 'nanoid'
import postcssUrl from 'postcss-url'
import inject from 'gulp-inject'

const baseUrl = '.'
const pathCss = '..'
const searchId = nanoid(10)

const sass = gulpSass(dartSass)

const clean = async () => {
  return await deleteAsync(['dist'])
}

const copy = () => {
  return gulp
    .src(
      [
        'src/fonts/**/*.{woff,woff2}',
        'src/img/**/*.{webm,webp,avif,jpg,jpeg,png,svg}',
        'src/favicon/**/*',
        'src/game2/**/*',
        'src/favicon.ico',
        'src/settings.js',
        'src/urls.json',
        'src/robots.txt'
      ],
      { base: 'src', encoding: false }
    )
    .pipe(gulp.dest('dist'))
}

const css = () => {
  return gulp
    .src('src/scss/index.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(
      postcss([
        postcssUrl({
          url: (asset) => {
            if (asset.url.startsWith('/')) {
              return `${pathCss}${asset.url}?v=${searchId}`
            }
            return asset.url
          }
        }),
        autoprefixer({ remove: false })
      ])
    )
    .pipe(rename('style.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(sync.stream())
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dist/css'))
}

// eslint-disable-next-line no-unused-vars
const images = () => {
  return gulp
    .src('src/img/*.{png,jpg,jpeg,svg}', { encoding: false })
    .pipe(
      imagemin(
        [
          optipng({ optimizationLevel: 3 }),
          mozjpeg({ quality: 80, progressive: true }),
          svgo({
            plugins: [{ name: 'removeUnknownsAndDefaults', active: false }]
          })
        ],
        { silent: true }
      )
    )
    .pipe(gulp.dest('dist/img'))
}

// eslint-disable-next-line no-unused-vars
const webp = () => {
  return gulp
    .src('src/img/*.{png,jpg,jpeg}', { encoding: false })
    .pipe(gulpWebp({ quality: 80 }))
    .pipe(gulp.dest('dist/img'))
}

// eslint-disable-next-line no-unused-vars
const avif = () => {
  return gulp
    .src('src/img/*.{png,jpg,jpeg}', { encoding: false })
    .pipe(imagemin([imageminAvif({ quality: 50 })], { silent: true }))
    .pipe(rename((path) => (path.extname = '.avif')))
    .pipe(gulp.dest('dist/img'))
}

const sprite = () => {
  return gulp
    .src('src/icons/**/*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest('dist/img'))
}

const injectSprite = () => {
  const spritePath = 'dist/img/sprite.svg'

  return gulp
    .src('dist/*.html')
    .pipe(
      inject(gulp.src(spritePath), {
        transform: (filePath, file) => {
          return file.contents.toString()
        }
      })
    )
    .pipe(gulp.dest('dist'))
}

const jsCommon = () => {
  return gulp
    .src('src/js/common/*.js')
    .pipe(
      plumber({
        errorHandler(err) {
          console.error(err.toString())
          this.emit('end')
        }
      })
    )
    .pipe(order(['_utils.js', '*.js']))
    .pipe(concat(`script.js`))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify.default())
    .pipe(rename(`script.min.js`))
    .pipe(gulp.dest('dist/js'))
}

const jsVendor = () => {
  return gulp
    .src('src/js/vendor/*.js')
    .pipe(
      plumber({
        errorHandler(err) {
          console.error(err.toString())
          this.emit('end')
        }
      })
    )
    .pipe(concat(`vendor.js`))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify.default())
    .pipe(rename(`script.min.js`))
    .pipe(gulp.dest('dist/js'))
}

const html = () => {
  return gulp
    .src('src/pug/pages/**/*.pug')
    .pipe(plumber())
    .pipe(
      pug({
        pretty: true,
        basedir: 'src/pug',
        locals: { baseUrl, searchId }
      })
    )
    .pipe(gulp.dest('dist'))
}

const refresh = (done) => {
  sync.reload()
  done()
}

const server = () => {
  sync.init({
    server: 'dist/',
    notify: false,
    open: false,
    cors: true,
    ui: false
  })

  gulp.watch('src/pug/**/*.{pug,js}', gulp.series(html, injectSprite, refresh))
  gulp.watch(
    'src/icons/**/*.svg',
    gulp.series(sprite, html, injectSprite, refresh)
  )
  gulp.watch('src/scss/**/*.scss', gulp.series(css))
  gulp.watch('src/js/**/*.js', gulp.series(jsVendor, jsCommon, refresh))
}

export const build = gulp.series(
  clean,
  copy,
  css,
  jsVendor,
  jsCommon,
  // images,
  // webp,
  // avif,
  sprite,
  html,
  injectSprite
)

export const dev = gulp.series(build, server)
