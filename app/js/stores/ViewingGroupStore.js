'use strict';

import Reflux       from 'reflux';

import GroupActions from '../actions/GroupActions';
import GroupAPI     from '../utils/GroupAPI';

var ViewingGroupStore = Reflux.createStore({

  init() {
    this.group = null;

    this.listenTo(GroupActions.open, this.loadGroup);
    this.listenTo(GroupActions.loadPlaylists, this.loadPlaylists);
    this.listenTo(GroupActions.addMember, this.addMember);
    this.listenTo(GroupActions.removeMember, this.removeMember);
    this.listenTo(GroupActions.follow, this.followGroup);
  },

  loadGroup(groupSlug, cb = function() {}) {
    console.log('load group:', groupSlug);

    GroupAPI.get(groupSlug).then(group => {
      this.group = group;
      cb(null, this.group);
      this.trigger(null, this.group);
    }).catch(err => {
      cb(err);
      this.trigger(err);
    });
  },

  loadPlaylists(groupId, cb = function() {}) {
    console.log('load playlists for group:', groupId);

    GroupAPI.getPlaylists(groupId).then(playlists => {
      cb(null, playlists);
    }).catch(err => {
      cb(err);
    });
  },

  addMember(groupId, user, cb = function() {}) {
    console.log('add member to group:', groupId, user);

    GroupAPI.addMember(groupId, user.id).then(() => {
      cb(null, this.group);
    }).catch(err => {
      cb(err);
    });
  },

  removeMember(groupId, user, cb = function() {}) {
    console.log('remove member from group:', groupId, user);

    GroupAPI.removeMember(groupId, user.id).then(() => {
      cb(null, this.group);
    }).catch(err => {
      cb(err);
    });
  },

  followGroup(groupId, cb = function() {}) {
    console.log('follow group:', groupId);

    GroupAPI.follow(groupId).then(() => {
      cb(null);
    }).catch(err => {
      cb(err);
    });
  },

});

export default ViewingGroupStore;