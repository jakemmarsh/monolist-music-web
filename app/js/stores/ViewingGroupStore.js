'use strict';

import Reflux       from 'reflux';

import GroupActions from '../actions/GroupActions';
import GroupAPI     from '../utils/GroupAPI';
import Mixpanel     from '../utils/Mixpanel';

var ViewingGroupStore = Reflux.createStore({

  init() {
    this.group = null;

    this.listenTo(GroupActions.open, this.loadGroup);
    this.listenTo(GroupActions.loadPlaylists, this.loadPlaylists);
    this.listenTo(GroupActions.update, this.updateGroup);
    this.listenTo(GroupActions.addMember, this.addMember);
    this.listenTo(GroupActions.removeMember, this.removeMember);
    this.listenTo(GroupActions.follow, this.followGroup);
  },

  loadGroup(groupSlug, cb = function() {}) {
    GroupAPI.get(groupSlug).then((group) => {
      this.group = group;

      Mixpanel.logEvent('view group', {
        group: group
      });

      cb(null, this.group);
      this.trigger(null, this.group);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  },

  loadPlaylists(groupId, cb = function() {}) {
    GroupAPI.getPlaylists(groupId).then((playlists) => {
      if ( this.group ) {
        this.group.playlists = playlists;
      }
      cb(null, playlists);
    }).catch((err) => {
      cb(err);
    });
  },

  updateGroup(groupId, updates, cb = function() {}) {
    GroupAPI.update(groupId, updates).then((updatedGroup) => {
      this.group = updatedGroup;

      Mixpanel.logEvent('update group', {
        groupId: groupId,
        updates: updates
      });

      cb(null, this.group);
      this.trigger(null, this.group);
    }).catch((err) => {
      cb(err);
    });
  },

  addMember(groupId, user, cb = function() {}) {
    GroupAPI.addMember(groupId, user.id).then(() => {
      Mixpanel.logEvent('add group member', {
        groupId: groupId,
        userId: user.id
      });

      cb(null, this.group);
    }).catch((err) => {
      cb(err);
    });
  },

  removeMember(groupId, user, cb = function() {}) {
    GroupAPI.removeMember(groupId, user.id).then(() => {
      Mixpanel.logEvent('remove group member', {
        groupId: groupId,
        userId: user.id
      });

      cb(null, this.group);
    }).catch((err) => {
      cb(err);
    });
  },

  followGroup(groupId, cb = function() {}) {
    GroupAPI.follow(groupId).then(() => {
      Mixpanel.logEvent('follow group', {
        groupId: groupId
      });

      cb(null);
    }).catch((err) => {
      cb(err);
    });
  }

});

export default ViewingGroupStore;