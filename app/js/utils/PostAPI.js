'use strict';

import APIUtils from './APIUtils';

const PostAPI = {

  get(id) {
    return APIUtils.get('post/' + id);
  },

  create(post) {
    return APIUtils.post('post', post);
  },

  getNewest() {
    return APIUtils.get('posts/newest');
  },

  getNewestForGroup(groupId) {
    return APIUtils.get('group/' + groupId + '/posts');
  },

  like(postId) {
    return APIUtils.post('post/' + postId + '/like');
  },

  addComment(postId, comment) {
    comment = (typeof comment === 'object') ? comment : { body: comment };
    return APIUtils.post('post/' + postId + '/comment', comment);
  },

  removeComment(postId, commentId) {
    return APIUtils.del('post/' + postId + '/comment/' + commentId);
  },

  delete(postId) {
    return APIUtils.del('post/' + postId);
  }

};

export default PostAPI;
