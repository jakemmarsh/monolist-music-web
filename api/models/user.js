'use strict';

var moment = require('moment');

/* ====================================================== */

module.exports = function(db) {

  var User = db.define('user', {
    username:  { type: 'text' },
    firstName: { type: 'text' },
    lastName:  { type: 'text' },
    createdAt: { type: 'date', required: true, time: true }
  },
  {
    hooks: {
      beforeValidation: function () {
        this.createdAt = new Date();
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