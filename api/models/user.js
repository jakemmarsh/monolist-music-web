'use strict';

var moment = require('moment');

/* ====================================================== */

module.exports = function(db) {

  var User = db.define('user', {
    username:   { type: 'text' },
    email:      { type: 'text' },
    created:    { type: 'date', required: true, time: true },
    modified:   { type: 'date', required: true, time: true }
  },
  {
    hooks: {
      beforeValidation: function () {
        this.created = new Date();
        this.modified = new Date();
      }
    },
    methods: {
      fullName: function() {
        return this.firstName + ' ' + this.lastName;
      },
      serialize: function() {
        return {
          username:  this.username,
          firstName: this.firstName,
          lastName:  this.lastName,
          createdAt: moment(this.createdAt).fromNow()
        };
      }
    },
  });

  return User;

};