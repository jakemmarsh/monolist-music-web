'use strict';

import Reflux       from 'reflux';

import GroupActions from '../actions/GroupActions';
import GroupAPI     from '../utils/GroupAPI';

var ViewingGroupStore = Reflux.createStore({

  init() {
    this.group = null;

    this.listenTo(GroupActions.open, this.loadGroup);
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
  }

});

export default ViewingGroupStore;