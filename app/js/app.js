/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var App = require('./components/App.react');

React.renderComponent(
  <App />,
  document.getElementById('app')
);