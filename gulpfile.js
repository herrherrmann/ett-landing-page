'use strict';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import { deleteSync } from 'del';
import sourcemaps from 'gulp-sourcemaps';
import less from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import cleanCss from 'gulp-clean-css';

const browserSyncInstance = browserSync.create();

function clean() {
    return new Promise((resolve) => {
        deleteSync(['./styles.css', './styles.css.map']);
        resolve();
    });
}

function styles() {
    return gulp
        .src('./less/styles.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 3 versions'],
            }),
        )
        .pipe(concat('styles.css'))
        .pipe(cleanCss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./'));
}

function serve() {
    browserSyncInstance.init({
        server: {
            baseDir: './',
        },
    });

    gulp.watch('./less/**/*.less', styles);
    gulp.watch('./*.html').on('change', browserSyncInstance.reload);
}

const watch = gulp.series(clean, styles, serve);
const defaultTask = gulp.series(clean, styles);

export { clean, styles, watch, defaultTask as default };