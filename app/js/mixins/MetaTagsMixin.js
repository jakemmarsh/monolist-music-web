'use strict';

import _ from 'lodash';

var MetaTagsMixin = {

  getInitialState() {
    return {
      modifiedTags: []
    };
  },

  componentWillUnmount() {
    this.clearMetaTags();
  },

  componentDidMount() {
    this.metaTags = document.getElementsByTagName('meta');
  },

  updateMetaTags(tags) {
    let modifiedTags = [];

    _.forOwn(tags, (value, key) => {
      _.forEach(this.metaTags, (metaTagElem) => {
        if ( metaTagElem.getAttribute('property') === `og:${key}` || metaTagElem.getAttribute('itemprop') === key ) {
          metaTagElem.setAttribute('content', value);
          return;
        }
      });

      modifiedTags.push(key);
    });

    this.setState({ modifiedTags: modifiedTags });
  },

  clearMetaTags() {
    _.each(this.state.modifiedTags, (key) => {
      _.forEach(this.metaTags, (metaTagElem) => {
        if ( metaTagElem.getAttribute('property') === `og:${key}` || metaTagElem.getAttribute('itemprop') === key ) {
          metaTagElem.setAttribute('content', '');
          return;
        }
      });
    });
  }

};

export default MetaTagsMixin;
