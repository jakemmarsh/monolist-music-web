'use strict';

import Reflux           from 'reflux';

import GlobalActions    from '../actions/GlobalActions';
import GroupActions     from '../actions/GroupActions';
import CurrentUserStore from './CurrentUserStore';
import UserAPI          from '../utils/UserAPI';
import GroupAPI         from '../utils/GroupAPI';
import Mixpanel         from '../utils/Mixpanel';

const UserGroupsStore = Reflux.createStore({

  init() {
    this.groups = [];

    this.listenTo(GlobalActions.loadUserGroups, this.loadCurrentUserGroups);
    this.listenTo(GroupActions.create, this.createGroup);
  },

  loadCurrentUserGroups(cb = function() {}) {
    if ( CurrentUserStore.user && CurrentUserStore.user.id ) {
      UserAPI.getGroups(CurrentUserStore.user.id).then((groups) => {
        this.groups = groups || [];
        cb(null, this.groups);
        this.trigger(null, this.groups);
      });
    }
  },

  createGroup(group, cb = function() {}) {
    GroupAPI.create(group).then((createdGroup) => {
      Mixpanel.logEvent('create group', {
        group: createdGroup
      });

      this.groups.push(createdGroup);
      cb(null, createdGroup);
      this.trigger(null, this.groups);
    }).catch((err) => {
      cb(err);
    });
  }

});

export default UserGroupsStore;
