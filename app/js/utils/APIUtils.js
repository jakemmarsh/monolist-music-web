'use strict';

import {camel}    from 'change-case';
import request    from 'superagent';

import Helpers    from './Helpers';

var APIUtils = {

  root: 'http://localhost:3000/v1/',

  getStreamUrl(track) {
    return this.root + 'stream/' + track.source + '/' + encodeURIComponent(track.sourceParam);
  },

  normalizeResponse(obj) {
    return Helpers.processObjectKeys(obj, key => { return camel(key); });
  },

  get(path) {
    console.log('get:', request.get);
    return new Promise((resolve, reject) => {
      request.get(this.root + path)
      .withCredentials()
      .end(res => {
        if ( !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res.body.error));
        } else {
          resolve(this.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  post(path, body) {
    console.log('post:', request.post);
    return new Promise((resolve, reject) => {
      request.post(this.root + path, body)
      .withCredentials()
      .end(res => {
        if ( !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res.body.error));
        } else {
          resolve(this.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  patch(path, body) {
    console.log('patch:', request.patch);
    return new Promise((resolve, reject) => {
      request.patch(this.root + path, body)
      .withCredentials()
      .end(res => {
        if ( !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res.body.error));
        } else {
          resolve(this.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  put(path, body) {
    console.log('put:', request.put);
    return new Promise((resolve, reject) => {
      request.put(this.root + path, body)
      .withCredentials()
      .end(res => {
        if ( !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res.body.error));
        } else {
          resolve(this.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  del(path) {
    console.log('del:', request.del);
    return new Promise((resolve, reject) => {
      request.del(this.root + path)
      .withCredentials()
      .end(res => {
        if ( !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res));
        } else {
          resolve(this.normalizeResponse(res));
        }
      });
    });
  }

};

export default APIUtils;