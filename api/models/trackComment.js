'use strict';

/* ====================================================== */

module.exports = function(db) {

  var TrackComment = db.define('comment', {
    body:      { type: 'text', required: true },
    created: { type: 'date', required: true, time: true },
    modified:  { type: 'date', required: true, time: true }
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

  TrackComment.hasOne('creator', db.models.user, { required: true, autoFetch: true });
  TrackComment.hasOne('track', db.models.track, { required: true, autoFetch: true, reverse: 'comments' });

  return TrackComment;

};