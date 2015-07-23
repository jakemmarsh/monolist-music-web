'use strict';

import APIUtils from './APIUtils';

var GroupAPI = {

  get(slug) {
    return APIUtils.get('group/' + slug);
  },

  getPlaylists(groupId) {
    return APIUtils.get('group/' + groupId + '/playlists');
  },

  getTrending() {
    return APIUtils.get('groups/trending');
  },

  search(query) {
    return APIUtils.get('groups/search/' + query)
  },

  update(groupId, updates) {
    return APIUtils.patch('/group/' + groupId, updates)
  },

  addMember(groupId, userId) {
    return APIUtils.post('group/' + groupId + '/member/' + userId);
  },

  removeMember(groupId, userId) {
    return APIUtils.del('group/' + groupId + '/member/' + userId);
  },

  follow(groupId) {
    return APIUtils.post('group/' + groupId + '/follow');
  }

};

export default GroupAPI;