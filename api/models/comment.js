'use strict';

var moment = require('moment');

/* ====================================================== */

module.exports = function(db) {

  var Comment = db.define('comment', {
    body:      { type: 'text', required: true },
    createdAt: { type: 'date', required: true, time: true }
  },
  {
    hooks: {
      beforeValidation: function () {
        this.createdAt = new Date();
      }
    },
    methods: {
      serialize: function() {
        return {
          body:      this.body,
          createdAt: moment(this.createdAt).fromNow()
        };
      }
    }
  });

  Comment.hasOne('creator', db.models.user, { required: true, autoFetch: true });

  return Comment;

};