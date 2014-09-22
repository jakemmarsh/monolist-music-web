/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var Nav = require('./components/Nav');

var App = React.createClass({

  propTypes: {
    activeRouteHandler: React.PropTypes.func
  },

  render: function() {
    return (
      <div>
        <Nav />
        <div>
          <this.props.activeRouteHandler />
        </div>
      </div>
    );
  }

});

module.exports = App;