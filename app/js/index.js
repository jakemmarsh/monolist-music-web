/** @jsx React.DOM */
'use strict';

var React  = require('react/addons');
var Router = require('react-router');
var routes = require('./Routes');

window.React = React; // Enable React devtools

Router.run(routes, Router.HashLocation, function(Handler, state) {
  React.render(<Handler params={state.params} query={state.query} />, document.getElementById('app'));
});