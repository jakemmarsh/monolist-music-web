'use strict';

import Reflux           from 'reflux';

import CurrentUserStore from './CurrentUserStore';
import GlobalActions    from '../actions/GlobalActions';
import GroupActions     from '../actions/GroupActions';
import UserAPI          from '../utils/UserAPI';
import GroupAPI         from '../utils/GroupAPI';

var GroupsStore = Reflux.createStore({

  init() {
    this.groups = {
      user: [],
      popular: [],
      results: null
    };

    this.listenTo(GlobalActions.loadGroups, this.loadGroups);
    this.listenTo(GroupActions.search, this.searchGroups);
  },

  loadGroups(cb = function(){}) {
    let promises = [GroupAPI.getPopular()];

    if ( CurrentUserStore.user && CurrentUserStore.user.id ) {
      promises.push(UserAPI.getGroups(CurrentUserStore.user.id));
    }

    console.log('load groups');

    Promise.all(promises).then(results => {
      this.groups = {
        popular: results[0],
        user: results[1],
        results: this.groups.results || null
      };
      cb(null, this.groups);
      this.trigger(null, this.groups);
    }).catch(err => {
      cb(err);
      this.trigger(err);
    });
  },

  searchGroups(query, cb = function(){}) {
    console.log('search groups for:', query);

    if ( query && query.length ) {
      GroupAPI.search(query).then(results => {
        this.groups.results = results || [];
        cb(null, this.groups);
        this.trigger(null, this.groups);
      }).catch(err => {
        cb(err);
        this.trigger(err);
      });
    } else {
      this.groups.results = null;
      cb(null, this.groups);
      this.trigger(null, this.groups);
    }
  }

});

export default GroupsStore;