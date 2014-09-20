'use strict';

var superagent   = require('superagent');
var humps        = require('humps');
var normalizr    = require('normalizr');
var camelizeKeys = humps.camelizeKeys;
var Schema       = normalizr.Schema;
var arrayOf      = normalizr.arrayOf;
var normalize    = normalizr.normalize;
var merge        = require('react/lib/merge');
var superagent   = require('superagent');

var user         = new Schema('users');

var API_ROOT    = '/api/';

var APIUtils = {

  request: function(endpoint) {
    if ( endpoint.indexOf(API_ROOT) === -1 ) {
      endpoint = API_ROOT + endpoint;
    }

    return superagent(endpoint);
  },

  normalizeUserResponse: function(response) {
    return merge(
      normalize(camelizeKeys(response.body), user),
      APIUtils.extractPagination(response)
    );
  },

  normalizeUserArrayResponse: function(response) {
    return merge(
      normalize(camelizeKeys(response.body), arrayOf(user)),
      APIUtils.extractPagination(response)
    );
  }

};

module.exports = APIUtils;