'use strict';

import {camel} from 'change-case';
import request from 'superagent';
import qs      from 'querystring';
import _       from 'lodash';

import Helpers from './Helpers';

const APIUtils = {

  root: 'http://localhost:3000/v1/',

  getStreamUrl(track) {
    let url = this.root + 'stream/' + track.source + '/';

    if ( track.source === 'audiomack' ) {
      url += encodeURIComponent(track.sourceUrl);
    } else {
      url += encodeURIComponent(track.sourceParam);
    }

    return url;
  },

  normalizeResponse(obj) {
    return Helpers.processObjectKeys(obj, key => { return camel(key); });
  },

  get(path) {
    return new Promise((resolve, reject) => {
      request.get(this.root + path)
      .withCredentials()
      .end((res) => {
        res.body = res.body || JSON.parse(res.text);

        if ( !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res.body.error));
        } else {
          resolve(this.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  post(path, body) {
    return new Promise((resolve, reject) => {
      request.post(this.root + path, body)
      .withCredentials()
      .end((res) => {
        if ( !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res.body.error));
        } else {
          resolve(this.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  patch(path, body) {
    return new Promise((resolve, reject) => {
      request.patch(this.root + path, body)
      .withCredentials()
      .end((res) => {
        if ( !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res.body.error));
        } else {
          resolve(this.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  put(path, body) {
    return new Promise((resolve, reject) => {
      request.put(this.root + path, body)
      .withCredentials()
      .end((res) => {
        if ( !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res.body.error));
        } else {
          resolve(this.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  del(path) {
    return new Promise((resolve, reject) => {
      request.del(this.root + path)
      .withCredentials()
      .end((res) => {
        if ( !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res));
        } else {
          resolve(this.normalizeResponse(res));
        }
      });
    });
  },

  buildTwitterUrl(text, tags = [], url = null) {
    const hashTags = _.union(tags, ['Monolist']);
    const queryString = qs.stringify({
      text: text,
      hashtags: hashTags.join(','),
      url: url
    });

    return `https://twitter.com/intent/tweet?${queryString}`;
  }

};

export default APIUtils;
