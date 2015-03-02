var gulp,
    traceur;

gulp = require('gulp');
traceur = require('gulp-traceur');

gulp.task('build', ['traceur']);
gulp.task('default', ['build']);
gulp.task('traceur', function () {
    return gulp.src('src/**/*.js')
        .pipe(traceur({annotations: true}))
        .pipe(gulp.dest('build/'));
});

