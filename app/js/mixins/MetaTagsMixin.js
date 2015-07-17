'use strict';

import _ from 'lodash';
import $ from 'jquery';

var MetaTagsMixin = {

  getInitialState() {
    return {
      modifiedTags: []
    };
  },

  componentWillUnmount() {
    this.clearMetaTags();
  },

  updateMetaTags(tags) {
    let modifiedTags = [];

    _.forOwn(tags, (value, key) => {
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

  clearMetaTags() {
    _.each(this.state.modifiedTags, key => {
      if ( $('meta[property="og\\:' + key + '"]').length ) {
        $('meta[property="og\\:' + key + '"]').attr('content', '');
      }
      if ( $('meta[itemprop="' + key + '"]').length ) {
        $('meta[itemprop="' + key + '"]').attr('content', '');
      }
    });
  }

};

export default MetaTagsMixin;