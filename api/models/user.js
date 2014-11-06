'use strict';

var orm = require('orm');

/* ====================================================== */

module.exports = function(db) {

  var User = db.define('user', {
    username:   { type: 'text', required: true },
    email:      { type: 'text' },
    imageUrl:   { type: 'text' },
    hash:       { type: 'text' },
    created:    { type: 'date', required: true, time: true },
    modified:   { type: 'date', required: true, time: true }
  },
  {
    cache: false,
    autoFetch: true,
    validations: {
      username: orm.validators.unique('That username is already taken.')
    },
    hooks: {
      beforeValidation: function () {
        this.created = new Date();
        this.modified = new Date();
      },
      beforeSave: function() {
        this.modified = new Date();
      }
    },
    methods: {},
  });

  return User;

};