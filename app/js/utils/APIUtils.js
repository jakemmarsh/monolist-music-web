'use strict';

var superagent   = require('superagent');
var humps        = require('humps');
var camelizeKeys = humps.camelizeKeys;
var superagent   = require('superagent');

var API_ROOT    = '/api/';

var APIUtils = {

  request: function(endpoint) {
    var rootRegex = new RegExp(API_ROOT, 'i');

    if ( !rootRegex.test(endpoint) ) {
      endpoint = API_ROOT + endpoint;
    }

    return superagent(endpoint);
  },

  getStreamUrl: function(track) {
    var streamUrl = API_ROOT + 'stream/' + track.source + '/' + track.sourceParam;

    return streamUrl;
  },

  normalizeResponse: function(response) {
    return camelizeKeys(response.body);
  }

};

module.exports = APIUtils;