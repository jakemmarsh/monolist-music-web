'use strict';

/* ====================================================== */

module.exports = function(db) {

  var Downvote = db.define('downvote', {
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

  Downvote.hasOne('user', db.models.user, { required: true, autoFetch: false });
  Downvote.hasOne('track', db.models.track, { required: true, reverse: 'downvotes' });

  return Downvote;

};