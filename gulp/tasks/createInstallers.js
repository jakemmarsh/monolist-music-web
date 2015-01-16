'use strict';

var gulp           = require('gulp');
var del            = require('del');
var shell          = require('gulp-shell');
var p              = require('../../package.json');
var currentVersion = p.version;

gulp.task('createInstallers', function() {

  var osxCommand = './dist/mac/yoursway-create-dmg/create-dmg --volname "Monolist ' + currentVersion + '" --background ./dist/mac/installer-background.png --window-size 480 540 --icon-size 128 --app-drop-link 240 370 --icon "Monolist" 240 110 ./releases/mac/Monolist-' + currentVersion + '-osx.dmg ./webkitbuilds/Monolist/osx32/ || echo "Create dmg failed, likely caused by not being run on mac, continuing"';

  var winCommand = 'makensis dist/win/windows_installer.nsi';

  // Remove previous installers
  del(['./releases/mac/*.dmg', './releases/win/*.exe']);

  return gulp.src('')
  .pipe(shell([
    osxCommand,
    winCommand
  ]));

});