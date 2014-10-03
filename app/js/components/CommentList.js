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
    shouldDisplay: React.PropTypes.bool
  },

  getDefaultPropTypes: function() {
    return {
      shouldDisplay: false
    };
  },

  getInitialState: function() {
    return {
      newComment: '',
      comments: this.props.comments
    };
  },

  updateNewComment: function(evt) {
    this.setState({
      newComment: evt.target.value
    });
  },

  handleKeyPress: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.postComment();
    }
  },

  postComment: function() {
    var commentsCopy = this.state.comments;
    // TODO: get these values dynamically
    var newComment = {
      author: 'jakemmarsh',
      body: this.state.newComment,
      timestamp: new Date()
    };

    commentsCopy.push(newComment);

    this.setState({
      newComment: '',
      comments: commentsCopy
    });
  },

  renderComments: function() {
    var commentElements = _.map(this.state.comments, function(comment, index) {
      return (
        <Comment comment={comment} key={index} />
      );
    });

    return commentElements;
  },

  render: function() {
    var classes = cx({
      'comments-container': true,
      'show': this.props.shouldDisplay
    });

    return (
      <ul className={classes}>
        {this.renderComments()}
        <li className="input-container">
          <input type="text"
                 value={this.state.newComment}
                 onChange={this.updateNewComment}
                 onKeyPress={this.handleKeyPress}
                 placeholder="Leave a comment..." />
        </li>
      </ul>
    );
  }

});

module.exports = CommentList;