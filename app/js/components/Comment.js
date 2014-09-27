/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var Link  = require('react-router').Link;

var Comment = React.createClass({

  propTypes: {
    comment: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
        <li className="comment">
          {this.props.comment.body} by <Link to="user" params={{username: this.props.comment.author}}>{this.props.comment.author}</Link>
        </li>
    );
  }

});

module.exports = Comment;