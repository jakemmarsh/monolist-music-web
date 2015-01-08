/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var RouteHandler  = React.createFactory(require('react-router').RouteHandler);

var WindowMenuBar = require('./components/WindowMenuBar');

var GlobalApp = React.createClass({

  render: function() {
    return (
      <div>

        <WindowMenuBar />

        <RouteHandler params={this.props.params} query={this.props.query} />

      </div>
    );
  }

});

module.exports = React.createFactory(GlobalApp);