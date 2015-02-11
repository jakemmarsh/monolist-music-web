/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var RouteHandler = React.createFactory(require('react-router').RouteHandler);

var OuterApp = React.createClass({

  render: function() {
    return (
      <div className="outer-page">

        <div className="outer-header soft-half--ends">
          <img className="logo" src="https://assets.monolist.co/app/images/logo.png" alt="Monolist logo" />
        </div>

        <div className="outer-wrapper soft--ends">
          <RouteHandler params={this.props.params} query={this.props.query} />
        </div>

      </div>
    );
  }

});

module.exports = React.createFactory(OuterApp);