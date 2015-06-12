var gulp = require('gulp');
var rename = require('gulp-rename');
var loopbackAngular = require('gulp-loopback-sdk-angular');
var exec = require('child_process').exec;

gulp.task('build', function () {
  return gulp.src('./server/server.js')
    .pipe(loopbackAngular({apiUrl:'http://0.0.0.0:3000/api'}))
    .pipe(rename('wxcard-reconciliation-lbservices.js'))
    .pipe(gulp.dest('./bower/'));
});

var paths = {
  scripts: ['common/models/*.js', 'common/models/*.json', 'test/*.js'],
};

gulp.task('bdd', function (cb) {
  exec('npm test', function (err, stdout, stderr) {
    if(err) return cb(err);
    console.log('STDOUT:',stdout)
    console.log('STDERR:',stderr)
    cb();
  })
});

gulp.task('default', function() {
  gulp.watch(paths.scripts, ['bdd']);
});