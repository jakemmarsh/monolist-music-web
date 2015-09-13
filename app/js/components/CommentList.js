'use strict';

import React        from 'react/addons';
import _            from 'lodash';
import cx           from 'classnames';

import Comment      from './Comment';

var CommentList = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

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
      deleteComment: function() {}
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

  associateCommentId(err, savedComment) {
    let commentsCopy = this.state.comments;

    if ( !err ) {
      // Associate newest comment with ID in database after save
      commentsCopy[commentsCopy.length - 1].id = savedComment.id;
      this.setState({ comments: commentsCopy });
    }
  },

  postComment() {
    // Manually add new comment to display to prevent having to reload data
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
    }, this.props.postComment.bind(null, this.state.newCommentBody, this.associateCommentId));
  },

  deleteComment(commentId) {
    let commentsCopy = _.reject(this.state.comments, (comment) => {
      return comment.id === commentId;
    });

    this.setState({ comments: commentsCopy }, this.props.deleteComment.bind(null, commentId));
  },

  renderComments() {
    return _.map(this.state.comments, (comment, index) => {
      return (
        <Comment currentUser={this.props.currentUser}
                 comment={comment}
                 deleteComment={this.deleteComment}
                 key={index} />
      );
    });
  },

  renderCommentInput() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <li className="input-container">
          <input type="text"
                 valueLink={this.linkState('newCommentBody')}
                 onKeyPress={this.handleKeyPress}
                 placeholder="Leave a comment..." />
        </li>
      );
    }
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