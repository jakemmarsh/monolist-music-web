'use strict';

import Reflux        from 'reflux';
import _             from 'lodash';

import GlobalActions from '../actions/GlobalActions';
import GroupActions  from '../actions/GroupActions';
import PostActions   from '../actions/PostActions';
import PostAPI       from '../utils/PostAPI';
import Mixpanel      from '../utils/Mixpanel';

var ViewingPostListStore = Reflux.createStore({

  init() {
    this.posts = [];

    this.listenTo(GlobalActions.loadExplorePosts, this.getGlobalPosts);
    this.listenTo(GroupActions.loadPosts, this.getGroupPosts);
    this.listenTo(PostActions.create, this.createPost);
    this.listenTo(PostActions.addComment, this.addComment);
    this.listenTo(PostActions.removeComment, this.removeComment);
    this.listenTo(PostActions.delete, this.deletePost);
  },

  getGlobalPosts(cb = function() {}) {
    PostAPI.getNewest().then((posts) => {
      this.posts = posts || [];
      cb(null, this.posts);
      this.trigger(null, this.posts);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  },

  getGroupPosts(groupId, cb = function() {}) {
    PostAPI.getNewestForGroup(groupId).then((posts) => {
      this.posts = posts || [];
      cb(null, this.posts);
      this.trigger(null, this.posts);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  },

  createPost(post, cb = function() {}) {
    PostAPI.create(post).then((createdPost) => {
      this.posts.unshift(createdPost);

      Mixpanel.logEvent('create post', {
        post: createdPost
      });

      cb(null, createdPost);
      this.trigger(null, this.posts);
    }).catch((err) => {
      cb(err);
    });
  },

  addComment(postId, body, cb = function() {}) {
    PostAPI.addComment(postId, body).then((createdComment) => {
      _.find(this.posts, { id: postId }).comments.push(createdComment);

      Mixpanel.logEvent('add post comment', {
        postId: postId,
        comment: body
      });

      cb(null, createdComment);
      this.trigger(null, this.posts);
    }).catch((err) => {
      cb(err);
    });
  },

  removeComment(postId, commentId, cb = function() {}) {
    PostAPI.removeComment(postId, commentId).then(() => {
      _.each(this.posts, (post) => {
        if ( post.id === postId ) {
          post.comments = _.reject(post.comments, (comment) => {
            return comment.id === commentId;
          });
        }
      });

      Mixpanel.logEvent('remove post comment', {
        postId: postId,
        commentId: commentId
      });

      cb(null);
      this.trigger(null, this.posts);
    }).catch((err) => {
      cb(err);
    });
  },

  deletePost(postId, cb = function() {}) {
    PostAPI.delete(postId).then(() => {
      Mixpanel.logEvent('delete post', {
        postId: postId
      });

      cb(null);
    }).catch((err) => {
      cb(err);
    });
  }

});

export default ViewingPostListStore;