/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var _            = require('lodash');

var TrackActions = require('../actions/TrackActions');
var Comment      = require('./Comment');

var cx           = React.addons.classSet;

var CommentList = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    track: React.PropTypes.object,
    comments: React.PropTypes.array,
    shouldDisplay: React.PropTypes.bool
  },

  getDefaultPropTypes: function() {
    return {
      currentUser: {},
      shouldDisplay: false
    };
  },

  getInitialState: function() {
    return {
      newCommentBody: '',
      comments: this.props.comments || []
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if ( nextProps.comments && nextProps.comments.length !== this.state.comments.length ) {
      this.setState({
        comments: nextProps.comments
      });
    }
  },

  stopPropagation: function(evt) {
    evt.stopPropagation();
  },

  handleKeyPress: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.postComment();
    }
  },

  associateCommentId: function(savedComment) {
    var commentsCopy = this.state.comments;

    // Associate newest comment with ID in database after save
    commentsCopy[commentsCopy.length - 1].id = savedComment.id;
    this.setState({ comments: commentsCopy });
  },

  postComment: function() {
    // Manually add new comment to display to prevent having to reload entire playlist
    var newComment = {
      user: this.props.currentUser,
      createdAt: new Date(),
      body: this.state.newCommentBody
    };
    var commentsCopy = this.state.comments;
    commentsCopy.push(newComment);

    this.setState({
      comments: commentsCopy,
      newCommentBody: ''
    }, TrackActions.addComment(this.state.newCommentBody, this.props.track, this.associateCommentId));
  },

  deleteComment: function(commentId) {
    var commentsCopy = _.reject(this.state.comments, function(comment) {
      return comment.id === commentId;
    });

    this.setState({ comments: commentsCopy }, TrackActions.removeComment(this.props.track.id, commentId));
  },

  renderComments: function() {
    return _.chain(this.state.comments)
    .sortBy(function(comment) { return comment.createdAt; })
    .map(function(comment, index) {
      return (
        <Comment currentUser={this.props.currentUser}
                 track={this.props.track}
                 comment={comment}
                 deleteComment={this.deleteComment}
                 key={index} />
      );
    }.bind(this));
  },

  renderCommentInput: function() {
    var element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <li className="input-container">
          <input type="text"
                 valueLink={this.linkState('newCommentBody')}
                 onKeyPress={this.handleKeyPress}
                 placeholder="Leave a comment..." />
        </li>
      );
    }

    return element;
  },

  render: function() {
    var classes = cx({
      'comments-container': true,
      'show': this.props.shouldDisplay
    });

    return (
      <ul className={classes} onClick={this.stopPropagation} onContextMenu={this.stopPropagation}>

        {this.renderComments()}

        {this.renderCommentInput()}

        <div className="shadow" />

      </ul>
    );
  }

});

module.exports = React.createFactory(CommentList);