'use strict';

import _ from 'lodash';

const MetaTagsMixin = {

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
    const modifiedTags = [];

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
