/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var gui   = global.window.nwDispatcher.requireNwGui();

var WindowMenuBar = React.createClass({

  componentWillMount: function() {
    this.win = gui.Window.get();
  },

  closeWindow: function() {
    this.win.close();
  },

  minimizeWindow: function() {
    this.win.minimize();
  },

  maximizeWindow: function() {
    this.win.maximize();
  },

  render: function() {
    return (
      <div className="window-menu-bar">

        <div className="button-container soft-half--right">
          <div className="window-button close" onClick={this.closeWindow}>
            <i className="fa fa-remove" />
          </div>
        </div>
        <div className="button-container soft-half--right">
          <div className="window-button minimize" onClick={this.minimizeWindow}>
            <i className="fa fa-minus" />
          </div>
        </div>
        <div className="button-container">
          <div className="window-button maximize" onClick={this.maximizeWindow}>
            <i className="fa fa-plus" />
          </div>
        </div>

        <div className="window-title-container text-center">
          Monolist
        </div>

        <div className="button-container" />
        <div className="button-container soft-half--left" />
        <div className="button-container soft-half--left" />

      </div>
    );
  }

});

module.exports = React.createFactory(WindowMenuBar);