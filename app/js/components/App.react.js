/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var Nav = require('./Nav.react');

var App = React.createClass({

render: function() {
  return (
    <div>
      <Nav />
      <div>
        App has been rendered
      </div>
    </div>
  );
}

});

module.exports = App;