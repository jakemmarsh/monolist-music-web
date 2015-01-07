/** @jsx React.DOM */
'use strict';

var React         = require('react/addons');
var routes        = require('./Routes');
var gui           = global.window.nwDispatcher.requireNwGui();
var win           = gui.Window.get();
var nativeMenuBar = new gui.Menu({ type: 'menubar' });

nativeMenuBar.createMacBuiltin('Monolist');
win.menu = nativeMenuBar;

if ( process.env.NODE_ENV !== 'production' ) {
  // Enable React devtools
  window.React = React;
}

React.render(routes, document.getElementById('app'));