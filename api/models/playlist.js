'use strict';

var moment = require('moment');

/* ====================================================== */

module.exports = function(db) {

  var Playlist = db.define('playlist', {
    title:      { type: 'text', required: true },
    imageUrl:  { type: 'text' },
    privacy:    ['Public', 'Private'],
    created:    { type: 'date', required: true, time: true },
    modified:   { type: 'date', required: true, time: true }
  },
  {
    cache: false,
    autoFetch: true,
    hooks: {
      beforeValidation: function () {
        this.created = new Date();
        this.modified = new Date();
      }
    },
    methods: {
      serialize: function() {
        return {
          createdAt: moment(this.createdAt).fromNow()
        };
      }
    }
  });

  Playlist.hasOne('creator', db.models.user, { required: true, autoFetch: false, reverse: 'playlists' });
  // Playlist.hasMany('participants', db.models.user, {}, { autoFetch: true });
  // Playlist.hasMany('comments', db.models.comment, {}, { autoFetch: true });

  return Playlist;

};