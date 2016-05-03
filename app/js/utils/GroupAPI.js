'use strict';

import APIUtils from './APIUtils';

const GroupAPI = {

  get(slug) {
    return APIUtils.get('group/' + slug);
  },

  create(group) {
    return APIUtils.post('group', group);
  },

  getPlaylists(groupId) {
    return APIUtils.get('group/' + groupId + '/playlists');
  },

  getTrending() {
    return APIUtils.get('groups/trending');
  },

  update(groupId, updates) {
    return APIUtils.patch(`group/${groupId}`, updates);
  },

  addMember(groupId, userId) {
    return APIUtils.post('group/' + groupId + '/member/' + userId);
  },

  removeMember(groupId, userId) {
    return APIUtils.del('group/' + groupId + '/member/' + userId);
  },

  updateMemberLevel(groupId, userId, newLevel) {
    return APIUtils.post('group/' + groupId + '/member/' + userId + '/level/' + newLevel);
  },

  follow(groupId) {
    return APIUtils.post('group/' + groupId + '/follow');
  }

};

export default GroupAPI;
