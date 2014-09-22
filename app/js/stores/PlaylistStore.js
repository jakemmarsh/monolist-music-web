'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var StoreUtils    = require('../utils/StoreUtils');

// TODO: Logic might be different since we don't have multiple playlists at a time?
var _playlists = {};

var PlaylistStore = StoreUtils.createStore({

  get: function(id) {
    return _playlists[id];
  }

});

PlaylistStore.dispatchToken = AppDispatcher.register(function(payload) {

  var action   = payload.action;
  var response = action.response;

  if ( response ) {
    // TODO: what to do with response?
    StoreUtils.mergeIntoBag(_playlists, response);
    PlaylistStore.emitChange();
  }

});

module.exports = PlaylistStore;