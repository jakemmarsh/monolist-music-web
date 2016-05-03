'use strict';

import Reflux      from 'reflux';
import _           from 'lodash';

import PostActions from '../actions/PostActions';
import PostAPI     from '../utils/PostAPI';

const ViewingPostStore = Reflux.createStore({

  init() {
    this.post = null;

    this.listenTo(PostActions.open, this.loadPost);
    this.listenTo(PostActions.likeViewing, this.likePost);
    this.listenTo(PostActions.deleteViewing, this.deletePost);
    this.listenTo(PostActions.addCommentViewing, this.addComment);
    this.listenTo(PostActions.removeCommentViewing, this.removeComment);
  },

  loadPost(postId, cb = function() {}) {
    PostAPI.get(postId).then((post) => {
      this.post = post;
      cb(null, this.post);
      this.trigger(null, this.post);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  },

  addComment(body, cb = function() {}) {
    PostAPI.addComment(this.post.id, body).then((createdComment) => {
      this.post.comments.push(createdComment);
      cb(null, createdComment);
      this.trigger(null, this.post);
    }).catch((err) => {
      cb(err);
    });
  },

  removeComment(commentId, cb = function() {}) {
    PostAPI.removeComment(this.post.id, commentId).then(() => {
      this.post.comments = _.reject(this.post.comments, (comment) => {
        return comment.id === commentId;
      });
      cb(null);
      this.trigger(null, this.post);
    }).catch((err) => {
      cb(err);
    });
  },

  deletePost(cb = function() {}) {
    PostAPI.delete(this.post.id).then(() => {
      this.post = null;
      cb(null);
      this.trigger(null, null);
    }).catch((err) => {
      cb(err);
    });
  }

});

export default ViewingPostStore;
