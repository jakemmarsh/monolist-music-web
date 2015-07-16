'use strict';

import Reflux      from 'reflux';

import UserActions from '../actions/UserActions';
import SearchAPI   from '../utils/SearchAPI';

var UserSearchStore = Reflux.createStore({

  init() {
    this.user = null;

    this.listenTo(UserActions.search, this.doSearch);
  },

  doSearch(query, cb = function() {}) {
    console.log('do user search:', query);

    SearchAPI.userSearch(query).then(users => {
      cb(null, users);
      this.users = users;
      this.trigger(null, users);
    }).catch(err => {
      console.log('error doing user search:', err);
      cb(err);
      this.trigger(err);
    });
  }

});

export default UserSearchStore;