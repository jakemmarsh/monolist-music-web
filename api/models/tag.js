'use strict';

var orm = require('orm');

/* ====================================================== */

module.exports = function(db) {

  var Tag = db.define('tag', {
    title:    { type: 'text', required: true },
    created:  { type: 'date', required: true, time: true },
    modified: { type: 'date', required: true, time: true }
  },
  {
    cache: false,
    autoFetch: true,
    validations: {
      title: orm.validators.unique('That tag already exists.')
    },
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

  Tag.hasMany('playlist', db.models.playlist, {}, { required: true, reverse: 'tags' });

  return Tag;

};