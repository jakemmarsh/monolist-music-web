/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var Avatar = React.createClass({

  propTypes: {
    size: React.PropTypes.number
  },

  render: function() {
    var styles = {
      'height': this.props.size,
      'width': this.props.size
    };

    return (
      <div className="avatar" style={styles} />
    );
  }

});

module.exports = Avatar;