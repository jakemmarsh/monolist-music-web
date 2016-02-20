'use strict';

import React       from 'react';
import moment      from 'moment';
import {Link}      from 'react-router';
import Linkify     from 'react-linkify';

import PostActions from '../actions/PostActions';
import Avatar      from './Avatar';
import Track       from './Track';
import CommentList from './CommentList';

const PostCard = React.createClass({

  propTypes: {
    post: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    trackIndex: React.PropTypes.number,
    playlist: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    deletePost: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      post: {},
      currentUser: {},
      trackIndex: 0,
      playlist: {},
      userCollaborations: [],
      deletePost: function() {}
    };
  },

  getInitialState() {
    return {
      displayComments: true
    };
  },

  postComment(body, cb = () => {}) {
    PostActions.addComment(this.props.post.id, body, cb);
  },

  deleteComment(commentId, cb = () => {}) {
    PostActions.removeComment(this.props.post.id, commentId, cb);
  },

  trackIsActive: function() {
    const postTrack = this.props.post.track;

    return this.props.currentTrack && this.props.currentTrack.sourceParam === postTrack.sourceParam;
  },

  renderDeleteButton() {
    if ( this.props.post.user.id === this.props.currentUser.id || this.props.currentUser.role === 'admin' ) {
      return (
        <i className="icon-close post-delete-button"
           onClick={this.props.deletePost.bind(null, this.props.post.id, () => {})} />
      );
    }
  },

  renderTrack() {
    if ( this.props.post && this.props.post.track ) {
      return (
        <ul className="nudge-quarter--bottom">
          <Track type="post"
                 track={this.props.post.track}
                 index={this.props.trackIndex}
                 playlist={this.props.playlist}
                 currentUser={this.props.currentUser}
                 userCollaborations={this.props.userCollaborations}
                 isActive={this.trackIsActive()} />
        </ul>
      );
    }
  },

  render() {
    return (
      <div className="post-card islet nudge-half--bottom">

        <div className="user-info-container table full-width">
          <div className="td avatar-container">
            <Avatar user={this.props.post.user} size={50} />
          </div>
          <div className="td name-container soft-half--sides">
            <Link to={`/profile/${this.props.post.user.username}`}>
              {this.props.post.user.username}
            </Link>
          </div>
          <div className="td post-timestamp text-right">
            {this.renderDeleteButton()}
            {moment(this.props.post.createdAt).fromNow()}
          </div>
        </div>

        <div className="body islet">
          <Linkify properties={{ 'target': '_blank' }}>
            {this.props.post.body}
          </Linkify>
        </div>

        {this.renderTrack()}

        <CommentList currentUser={this.props.currentUser}
                     postComment={this.postComment}
                     deleteComment={this.deleteComment}
                     comments={this.props.post.comments}
                     shouldDisplay={this.state.displayComments} />

      </div>
    );
  }

});

export default PostCard;