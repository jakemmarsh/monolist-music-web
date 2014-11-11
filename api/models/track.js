'use strict';

/* ====================================================== */

module.exports = function(db) {

  var Track = db.define('track', {
    title:       { type: 'text', required: true },
    artist:      { type: 'text' },
    source:      ['soundcloud', 'bandcamp', 'youtube', 'spotify'],
    sourceParam: { type: 'text', required: true },
    imageUrl:    { type: 'text' },
    created:     { type: 'date', required: true, time: true },
    modified:    { type: 'date', required: true, time: true }
  },
  {
    cache: false,
    autoFetch: true,
    hooks: {
      beforeValidation: function () {
        this.created = new Date();
        this.modified = new Date();
      },
      beforeSave: function() {
        this.modified = new Date();
      }
    },
    methods: {}
  });

  Track.hasOne('creator', db.models.user, { required: true, autoFetch: true });
  Track.hasOne('playlist', db.models.playlist, { required: true, reverse: 'tracks', autoFetch: true });

  return Track;

};