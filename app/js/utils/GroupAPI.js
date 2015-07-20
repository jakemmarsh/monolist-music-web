'use strict';

import APIUtils from './APIUtils';

var GroupAPI = {

  get(slug) {
    return APIUtils.get('group/' + slug);
  },

  getTrending() {
    return APIUtils.get('groups/trending');
  },

  search(query) {
    return APIUtils.get('groups/search/' + query)
  },

  update(groupId, updates) {
    return APIUtils.patch('/group/' + groupId, updates)
  }

};

export default GroupAPI;