/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');

var WindowMenuBar = require('./components/WindowMenuBar');

var OuterApp = React.createClass({

  render: function() {
    return (
      <div className="outer-page">

        <WindowMenuBar />

        <div className="outer-header soft-half--ends">
          <img className="logo" src="https://assets.monolist.co/images/logo.png" alt="Monolist logo" />
        </div>

        <div className="outer-wrapper soft--ends">
          <this.props.activeRouteHandler />
        </div>

      </div>
    );
  }

});

module.exports = React.createFactory(OuterApp);