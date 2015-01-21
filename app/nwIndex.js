'use strict';

var os            = require('os');
var gui           = require('nw.gui');
var win           = gui.Window.get();
var nativeMenuBar = new gui.Menu({ type: 'menubar' });
var macRegex      = new RegExp('mac', 'i');
var updater       = require('node-webkit-updater');
var pkg           = require('./package.json');
var upd           = new updater(pkg);
var copyPath;
var execPath;

if ( os.platform() === 'darwin' || macRegex.test(os.release()) ) {
  nativeMenuBar.createMacBuiltin('Monolist');
  win.menu = nativeMenuBar;
}

// Args passed when new app is launched from temp dir during update
if( gui.App.argv.length ) {
  // ------------- Step 5 -------------
  copyPath = gui.App.argv[0];
  execPath = gui.App.argv[1];

  // Replace old app, Run updated app from original location and close temp instance
  upd.install(copyPath, function(err) {
    if( !err ) {
      // ------------- Step 6 -------------
      upd.run(execPath, null);
      gui.App.quit();
    }
  });
} else { // if no arguments were passed to the app
  // ------------- Step 1 -------------
  upd.checkNewVersion(function(error, newVersionExists, manifest) {
    if ( !error && newVersionExists ) {
      // ------------- Step 2 -------------
      upd.download(function(error, filename) {
        if ( !error ) {
          // ------------- Step 3 -------------
          upd.unpack(filename, function(error, newAppPath) {
            if ( !error ) {
                // ------------- Step 4 -------------
                upd.runInstaller(newAppPath, [upd.getAppPath(), upd.getAppExec()],{});
                gui.App.quit();
            }
          }, manifest);
        }
      }, manifest);
    }
  });
}