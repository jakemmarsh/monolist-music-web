'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';
import GroupAPI      from '../utils/GroupAPI';

const TrendingGroupsStore = Reflux.createStore({

  init() {
    this.groups = [];

    this.listenTo(GlobalActions.loadGroups, this.loadGroups);
  },

  loadGroups(cb = function(){}) {
    GroupAPI.getTrending().then((groups) => {
      this.groups = groups;
      cb(null, this.groups);
      this.trigger(null, this.groups);
    }).catch(err => {
      cb(err);
      this.trigger(err);
    });
  }

});

export default TrendingGroupsStore;
