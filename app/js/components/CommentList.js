/**
 * @jsx React.DOM
 */
'use strict';

var React   = require('react/addons');
var _       = require('underscore');

var Comment = require('./Comment');

var cx      = React.addons.classSet;

var CommentList = React.createClass({

  propTypes: {
    comments: React.PropTypes.array.isRequired,
    display: React.PropTypes.bool
  },

  getDefaultPropTypes: function() {
    return {
      display: false
    };
  },

  renderComments: function() {
    var commentElements = _.map(this.props.comments, function(comment, index) {
      return (
        <Comment comment={comment} key={index} />
      );
    });

    return commentElements;
  },

  render: function() {
    var classes = cx({
      'comments-container': true,
      'show': this.props.display
    });

    return (
      <ul className={classes}>
        {this.renderComments()}
      </ul>
    );
  }

});

module.exports = CommentList;