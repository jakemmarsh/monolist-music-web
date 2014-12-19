'use strict';

var _ = require('lodash');
var $ = require('jquery');

var MetaTagsMixin = {

  getInitialState: function() {
    return {
      modifiedTags: []
    };
  },

  componentWillUnmount: function() {
    this.clearMetaTags();
  },

  updateMetaTags: function(tags) {
    var modifiedTags = [];

    _.forOwn(tags, function(value, key) {
      if ( $('meta[property="og\\:' + key + '"]').length ) {
        $('meta[property="og\\:' + key + '"]').attr('content', value);
      }
      if ( $('meta[itemprop="' + key + '"]').length ) {
        $('meta[itemprop="' + key + '"]').attr('content', value);
      }
      modifiedTags.push(key);
    });

    this.setState({ modifiedTags: modifiedTags });
  },

  clearMetaTags: function() {
    _.each(this.state.modifiedTags, function(key) {
      if ( $('meta[property="og\\:' + key + '"]').length ) {
        $('meta[property="og\\:' + key + '"]').attr('content', '');
      }
      if ( $('meta[itemprop="' + key + '"]').length ) {
        $('meta[itemprop="' + key + '"]').attr('content', '');
      }
    });
  }

};

module.exports = MetaTagsMixin;