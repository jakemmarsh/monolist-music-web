/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var Spinner = React.createClass({

  propTypes: {
    size: React.PropTypes.number
  },

  render: function() {
    var bounceStyle = {
      'height': this.props.size,
      'width': this.props.size
    };

    return (
      <div className="spinner">
        <div className="bounce1" style={bounceStyle}></div>
        <div className="bounce2" style={bounceStyle}></div>
        <div className="bounce3" style={bounceStyle}></div>
      </div>
    );
  }

});

module.exports = React.createFactory(Spinner);