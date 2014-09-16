'use strict';

var moment = require('moment');

/* ====================================================== */

module.exports = function(db) {

  var Playlist = db.define('playlist', {
    title:     { type: 'text', required: true },
    createdAt: { type: 'date', required: true, time: true }
  },
  {
    hooks: {
      beforeValidation: function () {
        this.createdAt = new Date();
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

  // Playlist.hasOne('creator', db.models.user, { required: true, autoFetch: true });
  // Playlist.hasMany('participants', db.models.user, {}, { autoFetch: true });
  // Playlist.hasMany('tracks', db.models.track, {}, { autoFetch: true });
  // Playlist.hasMany('comments', db.models.comment, {}, { autoFetch: true });

  return Playlist;

};