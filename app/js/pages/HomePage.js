/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var HomePage = React.createClass({

  render: function() {
    return (
      <div>
        Home Page
      </div>
    );
  }

});

module.exports = React.createFactory(HomePage);