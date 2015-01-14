/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var RouteHandler = React.createFactory(require('react-router').RouteHandler);

var GlobalApp = React.createClass({

  render: function() {
    return (
      <div>

        <RouteHandler params={this.props.params} query={this.props.query} />

      </div>
    );
  }

});

module.exports = React.createFactory(GlobalApp);