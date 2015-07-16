'use strict';

import React        from 'react/addons';
import _            from 'lodash';
import cx           from 'classnames';

import TrackActions from '../actions/TrackActions';
import Comment      from './Comment';

var CommentList = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    track: React.PropTypes.object,
    comments: React.PropTypes.array,
    shouldDisplay: React.PropTypes.bool
  },

  getDefaultPropTypes() {
    return {
      currentUser: {},
      shouldDisplay: false
    };
  },

  getInitialState() {
    return {
      newCommentBody: '',
      comments: this.props.comments || []
    };
  },

  componentWillReceiveProps(nextProps) {
    if ( nextProps.comments && nextProps.comments.length !== this.state.comments.length ) {
      this.setState({ comments: nextProps.comments });
    }
  },

  stopPropagation(evt) {
    evt.stopPropagation();
  },

  handleKeyPress(evt) {
    let keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.postComment();
    }
  },

  associateCommentId(savedComment) {
    let commentsCopy = this.state.comments;

    // Associate newest comment with ID in database after save
    commentsCopy[commentsCopy.length - 1].id = savedComment.id;
    this.setState({ comments: commentsCopy });
  },

  postComment() {
    // Manually add new comment to display to prevent having to reload entire playlist
    let newComment = {
      user: this.props.currentUser,
      createdAt: new Date(),
      body: this.state.newCommentBody
    };
    let commentsCopy = this.state.comments;
    commentsCopy.push(newComment);

    this.setState({
      comments: commentsCopy,
      newCommentBody: ''
    }, TrackActions.addComment.bind(null, this.state.newCommentBody, this.props.track, this.associateCommentId));
  },

  deleteComment(commentId) {
    let commentsCopy = _.reject(this.state.comments, function(comment) {
      return comment.id === commentId;
    });

    this.setState({ comments: commentsCopy }, TrackActions.removeComment.bind(null, this.props.track.id, commentId));
  },

  renderComments() {
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

  renderCommentInput() {
    let element = null;

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

  render() {
    let classes = cx({
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

export default CommentList;