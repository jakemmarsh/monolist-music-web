'use strict';

/* ====================================================== */

module.exports = function(db) {

  var Like = db.define('like', {
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

  Like.hasOne('user', db.models.user, { required: true, autoFetch: false });
  Like.hasOne('playlist', db.models.playlist, { required: true, reverse: 'likes' });

  return Like;

};