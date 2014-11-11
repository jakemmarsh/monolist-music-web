'use strict';

/* ====================================================== */

module.exports = function(db) {

  var Upvote = db.define('upvote', {
    created:  { type: 'date', required: true, time: true },
    modified: { type: 'date', required: true, time: true }
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
    }
  });

  Upvote.hasOne('user', db.models.user, { required: true, autoFetch: false });
  Upvote.hasOne('track', db.models.track, { required: true, reverse: 'upvotes' });

  return Upvote;

};