'use strict';

/* ====================================================== */

module.exports = function(db) {

  var Play = db.define('play', {
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

  Play.hasOne('user', db.models.user, { required: true, autoFetch: false });
  Play.hasOne('playlist', db.models.playlist, { required: true, reverse: 'plays' });

  return Play;

};