/** @jsx React.DOM */
'use strict';

var React         = require('react/addons');
var Router        = require('react-router');
var routes        = require('./Routes');
var gui           = global.window.nwDispatcher.requireNwGui();
var win           = gui.Window.get();
var nativeMenuBar = new gui.Menu({ type: 'menubar' });

gui.App.clearCache();

nativeMenuBar.createMacBuiltin('Monolist');
win.menu = nativeMenuBar;

if ( process.env.NODE_ENV !== 'production' ) {
  // Enable React devtools
  window.React = React;
}

Router.run(routes, Router.HistoryLocation, function(Handler, state) {
  React.render(<Handler params={state.params} query={state.query} />, document.getElementById('app'));
});