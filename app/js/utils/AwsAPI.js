'use strict';

import request  from 'superagent';

import APIUtils from './APIUtils';

var awsAPI = {

  uploadImage(type, image, id) {
    return new Promise((resolve, reject) => {
      request.post(APIUtils.root + 'upload/' + type + '/' + id)
      .withCredentials()
      .attach('image', image)
      .end(res => {
        if ( !res.ok ) {
          reject(APIUtils.normalizeResponse(res.body.error));
        } else {
          resolve(APIUtils.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  uploadUserImage(image, userId) {
    return this.uploadImage('user', image, userId);
  },

  uploadPlaylistImage(image, playlistId) {
    return this.uploadImage('playlist', image, playlistId);
  },

  uploadGroupImage(image, groupId) {
    return this.uploadImage('group', image, groupId);
  }

};

export default awsAPI;