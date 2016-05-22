'use strict';

import {camel}       from 'change-case';
import request       from 'superagent';
import qs            from 'querystring';
import _             from 'lodash';

import Helpers       from './Helpers';

const APIUtils = {

  root: 'http://localhost:3000/v1/',
  // root: 'http://api.monolist.co/v1/',

  getStreamUrl(track) {
    let url = this.root + 'stream/' + track.source + '/';

    if ( track.source === 'audiomack' ) {
      url += encodeURIComponent(track.sourceUrl);
    } else {
      url += encodeURIComponent(track.sourceParam);
    }

    return url;
  },

  humanizeTrackSource(source) {
    return {
      audiomack: 'Audiomack',
      bandcamp: 'Bandcamp',
      soundcloud: 'SoundCloud',
      youtube: 'YouTube'
    }[source];
  },

  normalizeResponse(obj) {
    return Helpers.processObjectKeys(obj, key => { return camel(key); });
  },

  get(path, progressCb = () => {}) {
    return new Promise((resolve, reject) => {
      request.get(this.root + path)
      .withCredentials()
      .on('progress', progressCb)
      .end((err, res) => {
        if ( err || !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res.body.error || err));
        } else {
          resolve(this.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  post(path, body, progressCb = () => {}) {
    return new Promise((resolve, reject) => {
      request.post(this.root + path, body)
      .withCredentials()
      .on('progress', progressCb)
      .end((err, res) => {
        if ( err || !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res.body.error || err));
        } else {
          resolve(this.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  patch(path, body, progressCb = () => {}) {
    return new Promise((resolve, reject) => {
      request.patch(this.root + path, body)
      .withCredentials()
      .on('progress', progressCb)
      .end((err, res) => {
        if ( err || !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res.body.error || err));
        } else {
          resolve(this.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  put(path, body, progressCb = () => {}) {
    return new Promise((resolve, reject) => {
      request.put(this.root + path, body)
      .withCredentials()
      .on('progress', progressCb)
      .end((err, res) => {
        if ( err || !res.ok || res.body.errors ) {
          reject(this.normalizeResponse(res.body.error || err));
        } else {
          resolve(this.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  del(path, progressCb = () => {}) {
    return new Promise((resolve, reject) => {
      request.del(this.root + path)
      .withCredentials()
      .on('progress', progressCb)
      .end((err, res) => {
        if ( err || !res.ok || res.body.errors ) {
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
