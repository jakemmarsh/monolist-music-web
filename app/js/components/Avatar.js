/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var Avatar = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    size: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  },

  getDefaultProps: function() {
    return {
      user: {}
    };
  },

  render: function() {
    var styles = {
      'height': this.props.size,
      'width': this.props.size,
      'backgroundImage': this.props.user.imageUrl ? 'url(' + this.props.user.imageUrl + ')' : null
    };

    return (
      <div className="avatar" style={styles} />
    );
  }

});

module.exports = React.createFactory(Avatar);