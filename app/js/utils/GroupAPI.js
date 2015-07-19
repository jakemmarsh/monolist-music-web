'use strict';

import APIUtils from './APIUtils';

var GroupAPI = {

  get(slug) {
    return APIUtils.get('group/' + slug);
  },

  getPopular() {
    return APIUtils.get('groups/popular');
  },

  search(query) {
    return APIUtils.get('group/search/' + query)
  },

  update(groupId, updates) {
    return APIUtils.patch('/group/' + groupId, updates)
  }

};

export default GroupAPI;