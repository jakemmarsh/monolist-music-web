'use strict';

import React   from 'react';
import _       from 'lodash';
import cx      from 'classnames';

import Comment from './Comment';

const CommentList = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    comments: React.PropTypes.array,
    shouldDisplay: React.PropTypes.bool,
    postComment: React.PropTypes.func,
    deleteComment: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      currentUser: {},
      shouldDisplay: false,
      postComment: function() {},
      deleteComment: function() {},
      comments: []
    };
  },

  getInitialState() {
    return {
      newCommentBody: ''
    };
  },

  stopPropagation(evt) {
    evt.stopPropagation();
  },

  handleCommentInputChange(evt) {
    this.setState({
      newCommentBody: evt.target.value
    });
  },

  postComment(evt) {
    evt.preventDefault();

    this.props.postComment(this.state.newCommentBody);

    this.setState({
      newCommentBody: ''
    });
  },

  deleteComment(commentId) {
    this.props.deleteComment(commentId);
  },

  renderComments() {
    return _.chain(this.props.comments)
      .sortBy('createdAt')
      .map((comment, index) => {
        return (
          <Comment currentUser={this.props.currentUser}
                   comment={comment}
                   deleteComment={this.deleteComment}
                   key={index} />
        );
      }).value();
  },

  renderCommentInput() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <li className="input-container">
          <form ref="commentForm" onSubmit={this.postComment} className="d-f ai-c">
            <div className="fx-1 soft-half--right">
              <input ref="commentInput"
                     type="text"
                     value={this.state.newCommentBody}
                     onChange={this.handleCommentInputChange}
                     placeholder="Leave a comment..." />
            </div>
            <div className="fx-75">
              <button ref="submitButton"
                      type="submit"
                      className="btn full"
                      disabled={!this.state.newCommentBody}>
                Post
              </button>
            </div>
          </form>
        </li>
      );
    }
  },

  render() {
    const classes = cx('comments-container', {
      show: this.props.shouldDisplay
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
