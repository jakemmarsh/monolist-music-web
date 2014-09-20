/** @jsx React.DOM */
'use strict';

var React  = require('react');
var routes = require('./Routes.react');

if ( process.env.NODE_ENV !== 'production' ) {
  // Enable React devtools
  window.React = React;
}

React.renderComponent(routes, document.getElementById('app'));