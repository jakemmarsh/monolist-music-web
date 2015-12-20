'use strict';

import Reflux           from 'reflux';

import CurrentUserStore from './CurrentUserStore';
import GlobalActions    from '../actions/GlobalActions';
import UserAPI          from '../utils/UserAPI';
import GroupAPI         from '../utils/GroupAPI';

var GroupsStore = Reflux.createStore({

  init() {
    this.groups = {
      user: [],
      trending: []
    };

    this.listenTo(GlobalActions.loadGroups, this.loadGroups);
  },

  loadGroups(cb = function(){}) {
    let promises = [GroupAPI.getTrending()];

    if ( CurrentUserStore.user && CurrentUserStore.user.id ) {
      promises.push(UserAPI.getGroups(CurrentUserStore.user.id));
    }

    Promise.all(promises).then(results => {
      this.groups = {
        trending: results[0] || [],
        user: results[1] || []
      };
      cb(null, this.groups);
      this.trigger(null, this.groups);
    }).catch(err => {
      cb(err);
      this.trigger(err);
    });
  }

});

export default GroupsStore;