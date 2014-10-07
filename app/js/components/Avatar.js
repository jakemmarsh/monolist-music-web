/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var Avatar = React.createClass({

  propTypes: {
    size: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  },

  render: function() {
    // TODO: don't hardcode background-image
    var styles = {
      'height': this.props.size,
      'width': this.props.size,
      'background-image': 'url(https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-xpf1/t31.0-8/1796992_10151957242618173_179336983_o.jpg)'
    };

    return (
      <div className="avatar" style={styles} />
    );
  }

});

module.exports = Avatar;