'use strict';

var moment = require('moment');

/* ====================================================== */

module.exports = function(db) {

  var Track = db.define('track', {
    title:     { type: 'text', required: true },
    artist:    { type: 'text' },
    upvotes:   { type: 'number', defaultValue: 0 },
    downvotes: { type: 'number', defaultValue: 0 },
    source:    ['SoundCloud', 'Bandcamp', 'YouTube', 'Spotify'],
    apiUrl:    { type: 'text', required: true },
    created:   { type: 'date', required: true, time: true },
    modified:  { type: 'date', required: true, time: true }
  },
  {
    hooks: {
      beforeValidation: function () {
        this.created = new Date();
        this.modified = new Date();
      }
    },
    methods: {
      serialize: function() {
        return {
          title: this.title,
          artist: this.title,
          upvotes: this.upvotes,
          downvotes: this.downvotes,
          score: this.upvotes - this.downvotes,
          source: this.source,
          apiUrl: this.apiUrl,
          created: moment(this.created).fromNow(),
          modified: moment(this.modified).fromNow()
        };
      }
    }
  });

  Track.hasOne('creator', db.models.user, { required: true, autoFetch: false });

  return Track;

};