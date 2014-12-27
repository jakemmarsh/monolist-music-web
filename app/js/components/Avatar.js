/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var _     = require('lodash');
var Link  = React.createFactory(require('react-router').Link);

var Avatar = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    includeLink: React.PropTypes.bool,
    style: React.PropTypes.object,
    size: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  },

  getDefaultProps: function() {
    return {
      user: {},
      includeLink: true,
      style: {}
    };
  },

  renderLink: function() {
    var element = null;

    if ( this.props.includeLink && !_.isEmpty(this.props.user) ) {
      element = (
        <Link to="Profile" params={{ username: this.props.user.username }} />
      );
    }

    return element;
  },

  render: function() {
    var styles = _.merge(this.props.style, {
      'height': this.props.size,
      'width': this.props.size,
      'backgroundImage': this.props.user.imageUrl ? 'url(' + this.props.user.imageUrl + ')' : null
    });

    return (
      <div className="avatar" style={styles}>
        {this.renderLink()}
      </div>
    );
  }

});

module.exports = React.createFactory(Avatar);