'use strict';

var moment = require('moment');

/* ====================================================== */

module.exports = function(db) {

  var Track = db.define('track', {
    source:    ['SoundCloud', 'Bandcamp', 'YouTube', 'Spotify'],
    apiUrl:    { type: 'text', required: true },
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
          source:    this.source,
          apiUrl:    this.apiUrl,
          createdAt: moment(this.createdAt).fromNow()
        };
      }
    }
  });

  Track.hasOne('creator', db.models.user, { required: false, autoFetch: true });

  return Track;

};